// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import N3Components from 'N3-components'
import 'N3-components/dist/index.min.css'
import 'N3-components/src/style/default.less'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(N3Components, 'en')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

