import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import ISiteItem from '../types/ISiteItem'
import ISite from '../types/ISite'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('database', {
      getAllSites: async (): Promise<ISiteItem[]> => ipcRenderer.invoke('get-all-sites'),
      getSite: async (data:{ slug:string }):Promise<ISite> => ipcRenderer.invoke('get-site', data),
      downloadSite: async (data:{ url: string, slug: string }): Promise<void> => ipcRenderer.invoke("download-story",data),
      deleteSite: async (data:{ id }): Promise<void> => ipcRenderer.invoke("delete-site", data),
      addSite: async (data:ISite): Promise<void> => ipcRenderer.invoke('add-site', data)
    })
    contextBridge.exposeInMainWorld('electron', {
      on: (channel, listener) => {
        ipcRenderer.on(channel, (_, args) => listener(args));
      },
      ...electronAPI
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
