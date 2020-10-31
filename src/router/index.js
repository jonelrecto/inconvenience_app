import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import store from '../store/index.js'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    // console.log(store, 'getuser')
    // console.log(to, from, next, 'to from next')
    // if (to.path === '/admin' && store.getters['BackendModule/getUser']) {
    //   next(from.path)
    //   return
    // } else if () {
      
    // }

    // if (from.path === '/login' && store.getters['BackendModule/getUser'].email === 'admin@admin.com') {
    //   next()
    //   return
    // } else {
      
    // }

    if (to.path === '/signin' && store.getters['BackendModule/getUser']) {
      next(from.path)
      return
    }

    if (to.matched.some(record => record.meta.requiredAuth)) {
      if (to.path === '/admin' && store.getters['BackendModule/getUser'].email != 'admin@admin.com') {
        next('/login')
        store.dispatch('BackendModule/signOut')
        return
      } else if (store.getters['BackendModule/isLoggedIn'] || store.getters['BackendModule/getUser']) {
        next()
        return
      } 
      else {
        console.log('not authenticated')
        next('/signin')
        return
      }
    } else {
      next ()
    }
  })

  return Router
}
