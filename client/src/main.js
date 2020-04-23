import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import vSelect from "vue-select"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "vue-select/dist/vue-select.css"

Vue.use(BootstrapVue)
Vue.component("v-select", vSelect);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
