import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh'
import customEN from './en'
Vue.use(VueI18n)

export default new VueI18n({
  // i18n选项
  locale: Cookie.get('language') || 'zh',
  messages: {
    zh: {
      ...elementZH, ...customZH
    },
    en: {
      ...elementEN, ...customEN
    }
  }
})
