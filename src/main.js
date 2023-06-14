import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config'

// add router to pinia stores
const pinia = createPinia()

pinia.use(({ store }) => {
    store.router = markRaw(router)
})

import './assets/main.css'

let app = null;

onAuthStateChanged(auth, (user) => {
    if (!app) {
        // if app instance has not been initialized, initialize it
        app = createApp(App)
        app.use(pinia)
        app.use(router)

        app.mount('#app')
    }
});