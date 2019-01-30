import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qrcode from 'qrcode'

Vue.use(Element)
Vue.prototype.$axios = axios//把axios设置为所有vue组件示例的成员属性，以后就可以使用this.$axios实现异步请求功能
Vue.use(qrcode)
Vue.config.productionTip = false
// 过滤器
import filterMoney from './components/commentJs/filterMoney.js'
import filterDate from './components/commentJs/filterDate.js'
import filterTime from './components/commentJs/filterTime.js'
Vue.filter('filterMoney',filterMoney)
Vue.filter('filterDate',filterDate)
Vue.filter('filterTime',filterTime)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
