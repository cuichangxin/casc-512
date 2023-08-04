import { createApp } from 'vue'
import './assets/style/index.scss'
import './assets/style/font-family.scss'
import App from './App.vue'
import router from './route'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import modal from './utils/modal'
import '../permission'
import axios from '@/api/api'

const app = createApp(App)

const pinia = createPinia()
app.use(ElementPlus,{
  locale:zhCn
})
app.config.globalProperties.$modal = modal
app.config.globalProperties.$axios = axios
app.use(pinia)
app.use(router)
app.mount('#app')
