import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes/router';
import Vue3Toastify from 'vue3-toastify';
import pinia from './plugins/pinia';
import Landing from './modules/Landing';

const app = createApp(App);

app.use(Vue3Toastify, {
    autoClose: 3000,
    maxToasts: 5,
    newestOnTop: true,
    closeOnClick: false,
    rtl: true,
    draggable: true,
    pauseOnHover: true,
    draggablePercent: 50,
    transition: 'Vue3Toastify__fade',
    transitionMode: 'out-in',
    position: 'top-right',
    hideProgressBar: false,
    progress: 0.3,
    style: {
        opacity: '1',
        userSelect: 'initial',
    }
});

app.use(pinia);

const options = {
    router,
};

app.use(Landing, options);




app.use(router).mount('#app')
