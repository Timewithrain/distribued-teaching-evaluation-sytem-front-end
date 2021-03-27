import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
// import { config } from 'vue/types/umd'

//配置请求的根路径
axios.defaults.baseURL = 'http://localhost:8080/'
// 设置路由拦截器，在请求头中加入Authorization字段用于鉴权
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
