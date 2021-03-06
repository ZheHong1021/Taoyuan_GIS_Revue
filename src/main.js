import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'   

createApp(App).use(store).use(router).use(PrimeVue).mount('#app')

router.beforeEach((to,from,next) =>{
    if(to.meta.title){
      document.title = to.meta.title
    }
    next();
  })