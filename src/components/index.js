// 负责所有全局自定义组件的注册
import PageTools from '@/components/PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import print from 'vue-print-nb'

export default {
  install(Vue) {
    //  组件注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(print)
  }
}