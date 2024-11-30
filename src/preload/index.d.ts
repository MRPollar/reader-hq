import { ElectronAPI } from '@electron-toolkit/preload'
import ISiteItem from '../types/ISiteItem'
import ISite from '../types/ISite'

declare global {
  interface Window {
    database:{
      getAllSites: () => Promise<ISiteItem[]>,
      getSite: (data: { slug: string }) => Promise<ISite>,
      downloadSite: (data: { url: string, slug: string }) => Promise<void>,
    }
    electron: ElectronAPI
    api: unknown
  }
}
