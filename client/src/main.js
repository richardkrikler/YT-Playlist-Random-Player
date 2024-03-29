import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import routes from './routes'
import store from './store'
import {createStore} from 'vuex'
import {createRouter, createWebHashHistory} from 'vue-router'

createApp(App)
    .use(createStore(store))
    .use(createRouter({
        history: createWebHashHistory(),
        routes
    }))
    .mount('#app')