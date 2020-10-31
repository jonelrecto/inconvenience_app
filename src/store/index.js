import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import ClientModule from './client-module'
import BackendModule from './backend-module'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['BackendModule']
  // reducer: (state) => ({ user: state.BackendModule.user })
})

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */


const Store = new Vuex.Store({
  modules: {
    ClientModule,
    BackendModule
  },
  plugins: [vuexLocal.plugin],
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: false
})

  export default Store

