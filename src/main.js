// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from '@/router'
import store from '@/vuex'
import VueResource from 'vue-resource'
import filters from '@/views/filters'
import alert from '@js/alert'
import LoadingComponent from '@/components/loading'
import ErrorComponent from '@/components/error'
import 'github-markdown-css'
import '@less/common.less'

Vue.config.productionTip = true

Vue.use(VueResource)
Vue.http.options.root = 'https://cnodejs.org/api/v1'

Vue.use(filters)
Vue.use(alert)

Vue.component('loading', LoadingComponent)
Vue.component('error', ErrorComponent)

new Vue({
    router,
    store
}).$mount('#app')