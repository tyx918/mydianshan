//项目的入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import TreeTable from "vue-table-with-tree-grid"

//导入全局变量样式表
import "assets/css/global.css"
import "assets/font-icon/iconfont.css"

import axios from "axios"
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/',
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
Vue.prototype.$http = axios;

// axios的拦截器:预处理请求
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    //1.显示图标
    return config;
},err => {
    console.log(err);
});

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
