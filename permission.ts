// import Cookies from 'js-cookie'
import router from './src/route'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from './src/utils/auth'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login']

router.beforeEach((to, _from, next) => {
  NProgress.start()
  // 有token
  if (getToken()) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})