import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import { initChunks } from './util/remote'

Vue.config.productionTip = false

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isProd = ['production', 'prod'].includes(process.env.NODE_ENV)

async function init () {
  await initChunks([
    {
      name: 'overview',
      chunk: `${isProd ? '/overview' : 'https://localhost:10000'}/remoteEntry.js`
    }
  ], {
    router,
    store
  })

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

init();
