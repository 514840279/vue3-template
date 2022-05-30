import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(VueAxios, axios)
app.mount('#app')