import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600// 定义超时时间
const service = axios.create({
  // 当执行npm run dev => .env.developoment => /api =>跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api  npm run build => /prod-api
  timeout: 5000 // 设置超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  //  注入token
  if (store.getters.token) {
    // 只有在有token的情况下才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true 表示过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回的
}, error => {
  // error 信息 里面response 的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候，表示后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回 执行错误 让当前的执行链跳出成功，直接进入catch
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了，应该进入catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功 直接进入catch
})

// 是否超时
// 超时逻辑 (当前时间 - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service

