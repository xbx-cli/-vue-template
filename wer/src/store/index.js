import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
})

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: false,
    modules: {
        app,
        permission,
        settings,
        user
    },
    getters,
    plugins: [vuexLocal.plugin]
})

export default store
