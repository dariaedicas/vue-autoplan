import Vue from 'vue'
import App from './App'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import formatDate from './filters/formatDateFilter'

import 'bootstrap/dist/css/bootstrap.css'
import locale from '../static/langs/en'

Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true;
axios.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response.status===403 && error.response.data.error==='login') {
        router.push('login');
    } else {
        return Promise.reject(error)
    }
})
Vue.use(ElementUI, { locale });
Vue.config.productionTip = false
Vue.filter('formatDate', formatDate)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

