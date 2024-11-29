import { defineStore } from "pinia";

type State = {
    visible:boolean;
    progress:number;
    message:string;
    verify:boolean;
}

export const storeProgress = defineStore('progress', {
    state:():State => ({
        visible:true,
        progress: 0,
        message: '',
        verify: true
    }),
    actions:{
        progressInfo(){
            if(this.$state.progress == 100){
                this.$state.progress = 0;
            } else {
                this.$state.progress++;
            }
        }
    }
})