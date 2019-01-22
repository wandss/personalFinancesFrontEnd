import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Chartjs from 'chart.js'
import VueCookies from 'vue-cookies'
import urls from './resources'
import moment from 'moment'
import {formatDate} from './filters/filters.js'

Vue.use(VueCookies)

Vue.prototype.$http = axios;
Vue.prototype.$urls = urls;
Vue.prototype.$moment = moment;
Vue.prototype.$chart = Chartjs

Vue.filter('formatDate', formatDate);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
