import { defineStore } from 'pinia'


export const useKeepAliver = defineStore('keepAlive',{
  state: ()=>{
    return {
      caches:Array<string>()
    }
  },
  actions:{
    addKeepAlive(view: { name: string }){
      if (!this.caches.includes(view.name)) {
        this.caches.push(view.name)
      }
    },
    removeKeepAlive(view: { name: string }){
      this.caches = this.caches.filter((item)=>{item !== view.name})
    },
    clearKeepAlive(){
      this.caches = []
    }
  }
})