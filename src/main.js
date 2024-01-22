import './assets/index.css'

import { createApp } from 'vue'
import pinia from './plugins/pinia'
import vuetify from './plugins/vuetify'

import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(vuetify)

app.mount('#app')
