import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入国际化
import VueI18n from 'vue-i18n'
//初始化web3
// import {initWeb3} from './utils/web3'
// Vue.prototype.web3 = initWeb3()
// 全局引入按需引入UI库 vant
import '@/plugins/vant'

// 全局引入按需引入UI库 element
import "element-ui/lib/theme-chalk/index.css";
import element from "./plugins/element";
Vue.use(element);

Vue.config.productionTip = false

Vue.use(VueI18n);
let newlanguage = localStorage.getItem('language');
const i18n = new VueI18n({
  locale: newlanguage ? newlanguage : 'zh-CN',    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
  messages: {
    'zh-CN': require('./i18n/zh-CN/zh-CN'),   // 中文语言包
    'en-US': require('./i18n/en/en')    // 英文语言包
  }
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
