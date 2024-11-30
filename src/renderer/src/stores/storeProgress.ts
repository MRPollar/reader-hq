import { defineStore } from "pinia";
import ITaskProgress from '../../../types/ITaskProgress'
import ITaskVerify from '../../../types/ITaskVerify'

type State = {
    visible:boolean;
    progress:number;
    message:string;
    verify:boolean;
}

export const storeProgress = defineStore('progress', {
  state:():State => ({
    visible: false,
    progress: 0,
    message: '',
    verify: true
  }),
  actions: {
    observableProgress(){
      window.electron.ipcRenderer.on("", (e,data:ITaskVerify): void => {
        this.$state.visible = data.visible;
        this.$state.verify = data.verify;
        this.$state.message = data.message;
      });
      window.electron.ipcRenderer.on('task-progress', (e, data:ITaskProgress): void => {
        this.$state.visible = data.visible;
        this.$state.verify = data.verify;
        this.$state.message = data.message;
        this.$state.progress = data.progress;
      });
    }
  }
})
