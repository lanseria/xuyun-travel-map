import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

import App from './App.vue'

import '@arco-design/web-vue/dist/arco.css'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(ArcoVue, {})
app.use(ArcoVueIcon)
app.use(router)
app.mount('#app')

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: 'https://453783d33c2e453e83839da817aad5b0@o144044.ingest.sentry.io/4504557755826176',
    release: process.env.RELEASE,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['xuyun-map.netlify.app', /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
