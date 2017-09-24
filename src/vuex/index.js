import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import user from './user'
import message from './message'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
})

const store = new Vuex.Store({
    modules: {
        user,
        message
    },
    plugins: [vuexLocal.plugin]
})

export default store