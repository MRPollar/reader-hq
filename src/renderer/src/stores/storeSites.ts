import { defineStore } from 'pinia'
import ISiteItem from '../../../types/ISiteItem'

type State = {
  sites: ISiteItem[]
}

export const storeSites = defineStore('sites', {
  state:():State => ({
    sites: []
  }),
  actions: {
    async getAllSites(): Promise<void> {
      this.$state.sites = await window.database.getAllSites() || []
    }
  }
})
