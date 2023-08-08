import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, CancelToken } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { errCode } from '../utils/errCode'
import { getToken } from '@/utils/auth'

interface CustomOptions {
  repeat_request_cancel?: boolean
  loading?: boolean
  restore_data_format?: boolean
  error_message_show?: boolean
  code_message_show?: boolean
}

interface LoadingOptions {
  fullscreen?: boolean // 全屏 貌似服务形式调用只能全屏
  text?: string // 显示文本
  customClass?: string // 自定义class
  spinner?: string // 动画类型
  background?: string // 遮罩背景色
}

const pendingMap: Map<string, CancelToken> = new Map()

interface LoadingInstance {
  _target: any
  _count: number
}

const LoadingInstance: LoadingInstance = {
  _target: null,
  _count: 0,
}

function Axios(
  axiosConfig: AxiosRequestConfig,
  customOptions: CustomOptions = {},
  loadingOptions: LoadingOptions = {}
) {
  const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 100000,
    responseType: 'json',
  })

  // 自定义配置
  const custom_options = Object.assign(
    {
      repeat_request_cancel: true, // 是否中断重复请求
      loading: false, // 是否加载loading动画
      restore_data_format: true, // 返回数据格式处理
      error_message_show: true,
      code_message_show: false,
    },
    customOptions
  )

  // 请求拦截
  service.interceptors.request.use(
    (config: any) => {
      removePending(config)
      custom_options.repeat_request_cancel && addPending(config)
      // 创建loading实例
      if (custom_options.loading) {
        LoadingInstance._count++
        if (LoadingInstance._count === 1) {
          LoadingInstance._target = ElLoading.service(loadingOptions)
        }
      }
      if (getToken()) {
        config.headers['Authorization'] = getToken()
      }

      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      removePending(response.config)
      custom_options.loading && closeLoading(custom_options) // 关闭loading
      if (custom_options.code_message_show && response.data && response.data.code !== 200) {
        ElMessage({
          type: 'error',
          message: response.data.msg as string,
        })
        return Promise.reject(response.data) // code不等于200, 直接返回错误信息
      }

      return custom_options.restore_data_format ? response.data : response
    },
    (error: AxiosError) => {
      error.config && removePending(error.config)
      custom_options.loading && closeLoading(custom_options) // 关闭loading
      custom_options.error_message_show && httpErrorStatusHandle(error) // 处理错误状态码
      return Promise.reject(error) // 错误继续返回给到具体页面
    }
  )

  return service(axiosConfig)
}

export default Axios

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error: any) {
  // 处理被取消的请求
  if (axios.isCancel(error)) return console.error('请求的重复请求：' + error.message)
  let message = ''
  if (error && error.response) {
    const code = error.response.code || 'default'
    message = errCode[code as keyof typeof errCode] || error.response.msg
  }
  if (error.message.includes('timeout')) message = '网络请求超时！'
  if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！'

  ElMessage({
    type: 'error',
    message,
  })
}

/**
 * 关闭Loading层实例
 * @param {*} _options
 */
function closeLoading(_options: CustomOptions) {
  if (_options.loading && LoadingInstance._count > 0) LoadingInstance._count--
  if (LoadingInstance._count === 0) {
    LoadingInstance._target.close()
    LoadingInstance._target = null
  }
}

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 * @param {*} config
 */
function addPending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel: any) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken: any = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

/**
 * 生成唯一的每个请求的唯一key
 * @param {*} config
 * @returns
 */
function getPendingKey(config: AxiosRequestConfig) {
  const info: AxiosRequestConfig = config
  if (typeof info.data === 'string') info.data = JSON.parse(info.data) // response里面返回的config.data是个字符串对象
  return [info.url, info.method, JSON.stringify(info.params), JSON.stringify(info.data)].join('&')
}

