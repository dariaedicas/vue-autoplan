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

Vue.use(VueAxios, axios);
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

