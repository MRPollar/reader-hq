import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/reader.png?asset'
import ServerExpress from '../expressServer'
import SQLite from '../classes/Database';
import ISiteItem from '../types/ISiteItem'
import ISite from '../types/ISite'
import ITaskProgress from '../types/ITaskProgress'
import ITaskVerify from '../types/ITaskVerify'
import ISeletores from '../types/ISeletores'
import puppeteer, { Browser, Page } from 'puppeteer'
import axios from 'axios'
import fs from 'fs'
import { extname } from 'path'

const downloadDir: string[] = ['..', '..', 'downloads'];
const server:ServerExpress = new ServerExpress(4200, join(__dirname, ...downloadDir));
const db:SQLite = new SQLite(join(__dirname, '..', '..', 'sqlite', 'sites.db'));
db.createTable(`
    CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    url TEXT NOT NULL,
    site_name TEXT NOT NULL,
    site_slug TEXT NOT NULL,
    title_selector TEXT NOT NULL,
    chapter_selector TEXT NOT NULL,
    page_selector TEXT NOT NULL
    )
`);

const userAgent: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";


app.disableHardwareAcceleration();
function createWindow(): void {
  // Create the browser window.
  const mainWindow:BrowserWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  server.start();
  createInteractionsAndRequests(mainWindow);
}

function createInteractionsAndRequests(win:BrowserWindow){
  let current_progress = 0;

  const verifyProcess = (verify:boolean, visible:boolean, message:string): void => {
    const response: ITaskVerify = { verify, visible, message }
    win.webContents.send("task-verify", response);
  }

  const downloadProgress = (total_progress:number, verify:boolean, visible:boolean, message:string): void => {
    current_progress++;
    const progress: number = Math.floor((current_progress/total_progress)*100);
    const response: ITaskProgress = {
      verify,
      message,
      visible,
      progress
    }
    win.webContents.send("task-progress", response);
  }

  const alertProcess = (verify:boolean, visible:boolean, message:string): void => {
    const response:ITaskProgress = { verify, message, visible, progress: 0 }
    win.webContents.send("alert-progress", response);
  }

  ipcMain.handle('add-site', async (_,data:ISite):Promise<void> => {
    const { site_name, url, title_selector, chapter_selector, page_selector } = data;
    const browser:Browser = await puppeteer.launch({ headless: true });
    try {
      const page:Page = await browser.newPage();
      await page.setUserAgent(userAgent);
      page.setDefaultTimeout((5 * 60000));

      await page.goto(url);
      await page.waitForFunction(() => document.readyState == 'complete');


      const icon:string[] = await page.evaluate(() => {
        let metaLinks:NodeListOf<HTMLLinkElement> = document.querySelectorAll("head > link[rel='icon']") || [];

        if(metaLinks.length == 0){
          metaLinks = document.querySelectorAll("head > link[rel='shortcut icon']") || []
        }
        const icons:string[] = Array.from(metaLinks).map((el) => el.href)

        return icons;
      })

      if(){

      }

    } catch (error) {
      console.log(error);
    }finally{
      await browser.close();
    }
  });

  ipcMain.handle('download-story', async (_,data:{ url: string, slug:string }) => {
    try{
      verifyProcess(true, true, "Iniciando.")
      const { site_slug, title_selector, chapter_selector, page_selector }:ISeletores = db.selectSingle<ISeletores>(
        'sites',
        ["site_slug","title_selector", "chapter_selector", "page_selector"],
        "site_slug=?",
        [data.slug]
      )

      const browser: Browser = await puppeteer.launch({ headless: true })
      const page: Page = await browser.newPage();
      page.setDefaultTimeout(60 * 60000);
      await page.setUserAgent(userAgent);

      verifyProcess(true, true, "Acessando: "+data.url);
      await page.goto(data.url, { waitUntil: 'networkidle2' });

      
      verifyProcess(true, true, "Esperando conteúdo dinâmico");
      await page.waitForFunction(() => document.readyState === 'complete');

      verifyProcess(true, true, "Esperando Seletor de título")
      await page.waitForSelector(title_selector, { timeout: (3 * 60000) });

      verifyProcess(true, true, "Buscando história");
      let title:string | null = await page.evaluate((selector: string) => {
        const el:HTMLElement | null = document.querySelector(selector) || null;

        return el ? el.textContent : null;
      }, title_selector);

      if(title == null) {
        throw new Error("Nenhum título encontrado");
      }
      title = sanitizeDirectoryName(title);

      verifyProcess(true, true, "Buscando capítulos de "+title);
      const chapters: { chapter:string, href:string }[] = await page.evaluate((selector: string) => {
        const el:NodeListOf<HTMLAnchorElement> | null =  document.querySelectorAll(selector) || null;
        const links: { chapter:string, href:string }[] = [];
        if(el){
          el.forEach((link) => {
            links.push({
              chapter: link.textContent ? link.textContent.trim() : `$${Date.now()}`,
              href: link.href
            });
          });
        }
        return links;
      }, chapter_selector);

      if(chapters.length == 0){
        verifyProcess(true, true, "Nenhum capítulo encontrado");
        return
      }
      console.log("capítulos: ",chapters);

      let total_progress:number = 0
      const chapterAndPages:{ chapter: string, pages: string[] }[] = []
      for(const chapter of chapters){
        verifyProcess(true, true, "Buscando páginas de "+chapter.chapter);
        const pages:string[] = await getPages(chapter.href, browser, page_selector);
        chapterAndPages.push({
          chapter: chapter.chapter,
          pages: pages,
        })
        total_progress+= pages.length;
      }

      const dir = join(__dirname, ...downloadDir, site_slug, title);
      verifyDir(dir);

      for(const chapter of chapterAndPages){
        const chapterName: string = sanitizeDirectoryName(chapter.chapter)
        for(let i = 0; i < chapter.pages.length; i++){
          
          const ext:string = extname(chapter.pages[i]);
          const filename: string = `page-${ i + 1 }${ext}`;
          let saveIn: string = join(__dirname, ...downloadDir, site_slug, title, chapterName);
          verifyDir(saveIn);

          saveIn = join(saveIn, filename)
          if(!fs.existsSync(saveIn)){
            downloadProgress(total_progress, false, true, `Baixando: ${chapter.chapter} - ${filename}`)
            await saveImages(chapter.pages[i], saveIn);
          } else {
            downloadProgress(total_progress, false, true, `Baixando: ${chapter.chapter} - ${filename}`)
          }
        }

      }

      total_progress = 0;
      current_progress = 0;
      alertProcess(true, false, "História baixada com sucesso");
      await browser.close();
    }catch (err){
      console.log(err);
    }
  })

  ipcMain.handle('update-site', (_,_data) => {

  });

  ipcMain.handle('delete-site', async (_,data:{ id:number }) => {
    const { id } = data;
    const { image }:{ image:string } = await db.selectSingle<{ image:string }>('sites',["image"], 'id=?', [id]);

    const result = await db.deleteItem('sites', 'id=?',[id]);

    const file = join(__dirname, '..', '..', 'uploads', 'icons', image)
    if(result > 0 && fs.existsSync(file) && image !== 'favicon.png'){
      fs.unlinkSync(file);
    }

    console.log(image);
  });

  ipcMain.handle('get-site', (_,data:{ slug:string }):ISite => {
    const { slug } = data;
    const site:ISite = db.selectSingle<ISite>(
      'sites',
      ['*'],
      'site_slug=?',
      [slug]
    )
    return site;
  })

  ipcMain.handle('get-all-sites', ():ISiteItem[] => {
    const sites:ISiteItem[] = db.selectAll<ISiteItem>(
      'sites',
      ['id', 'image', 'site_name', 'site_slug']
    )
    return sites
  });
}

const getPages = async (url: string, browser: Browser, selector:string): Promise<string[]> => {
  console.log("Acessando: ", url);
  const page: Page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(60000);
  try{
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.setUserAgent(userAgent);

    const pages: string[] = await page.evaluate((selector) => {
      const images: NodeListOf<HTMLImageElement> | null = document.querySelectorAll(selector);
      const links: string[] = [];
      if(images){
        images.forEach((img) => {
          let src: string | null = img.hasAttribute('src') ? img.src : img.getAttribute('data-src');
          if(src) links.push(src.trim());
        })
      }
      return links
    }, selector)

    return pages;
  } catch (err){
    console.log(err);
    return [];
  }finally {
    await page.close();
  }
}

const saveImages = async (url:string, dir:string): Promise<void> => {
  try{
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    })

    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(dir))
        .on('finish', resolve)
        .on('error', reject)
    })
  }catch (err){
    console.log("Erro da função saveImage: ", err);
  }
}

function sanitizeDirectoryName(title: string): string {
  // Lista de caracteres proibidos no Windows para nomes de arquivos e diretórios
  const forbiddenChars = /[<>:"/\\|?*\x00-\x1F]/g;
  // Substituir caracteres proibidos por um hífen ou qualquer outro caractere
  return title.trim().replace(forbiddenChars, '-');
}

const verifyDir = async (dir:string) => {
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
