import router from '@/router'
import store from './store' // 引入store实例，和组件中的this.$store是一回事
// 不需要导出，因为只需要让代码执行即可
// 前置守卫
// next是前置守卫必须必须执行的钩子，next必须执行 如果不执行，页面就挂了
// next() 放过
// next(false)  跳转终止
// next(地址) 跳转到某个地址
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404'] // 自定义白名单
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是登录页
      next('/') // 跳转到主页
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗
      // 如果当前vuex中有用户的资料的id 表示已经有资料了 不需要获取了，如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        // async函数所return的内容用await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续，需要根据用户资料获取数据的话，这里必须改成同步
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用的动态路由
        // routes就是筛选得到的动态路由
        // 动态路由添加到路由表中 默认的路由表只有静态路由，没有动态路由
        // addRoutes 必须用next(地址) 不用next()
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转  为什么要多做一次跳转
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done() // 关闭进度条
})
// 路由后置守卫
router.afterEach(() => {
  nProgress.done()
})
