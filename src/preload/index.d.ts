import { ElectronAPI } from '@electron-toolkit/preload'
import ISiteItem from '../types/ISiteItem'
import ISite from '../types/ISite'

interface IElectron extends ElectronAPI{
  on: (channel:string, func:(data:any) => void) => void
}

declare global {
  interface Window {
    database:{
      getAllSites: () => Promise<ISiteItem[]>,
      getSite: (data: { slug: string }) => Promise<ISite>,
      downloadSite: (data: { url: string, slug: string }) => Promise<void>,
      deleteSite: (data:{ id:number }) => Promise<void>,
      addSite: (data:ISite) => Promise<void>
    }
    electron: IElectron
    api: unknown
  }
}
