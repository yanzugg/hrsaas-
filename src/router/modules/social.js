// 导出员工的路由规则
import Layout from '@/layout'

export default {
  // 路由规则
  path: '/social', // 路由地址
  name: 'social', // 给模块的一级路由加一个name属性，这个属性我们后面会在做权限的时候使用
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候，此时它表示二级路的默认路由
    path: '', // 这里什么都不用写，表示/social 不但有layout布局 =>社保主页
    component: () => import('@/views/social'),
    // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
    meta: {
      title: '社保', // 这里为什么要用title 因为左侧导航栏读取了这里的title属性
      icon: 'table'
    }
  }]

}
