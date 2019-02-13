import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
<<<<<<< HEAD
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import filterDate from './components/commentJs/filterDate.js'
import filterMoney from './components/commentJs/filterMoney.js'
import filterTime from './components/commentJs/filterTime.js'
import filterStatus from './components/commentJs/filterStatus.js'

/* 插件和全局对象的设置 */
Vue.use(ElementUI)   //注册ElementUI插件
Vue.prototype.$axios = axios  //把axios设置为所有Vue组件实例的成员属性，以后可以使用this.$axios使用异步请求功能
Vue.config.productionTip = false

Vue.filter("filterMoney",filterMoney)
Vue.filter("filterDate",filterDate)
Vue.filter("filterStatus",filterStatus)
Vue.filter("filterTime",filterTime)

new Vue({
  router,
  store,              //指定当前项目唯一的Vuex存储仓库对象，其中保存着可供所有组件共享的数据
  render: h => h(App) //根据App组件创建<App></App>元素，挂载到#app内部
=======
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
>>>>>>> origin/master
}).$mount('#app')
