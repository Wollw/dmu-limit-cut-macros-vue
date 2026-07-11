import { createApp } from 'vue'
import App from './App.vue'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import './app.css'

createApp(App).use(ToastPlugin).mount('#app')
