import { createPinia } from "pinia";
import { markRaw } from "vue";
import router from "../routes/router";
import { toast } from 'vue3-toastify';

const pinia = createPinia();
pinia.use((context) => {
    context.store.router = markRaw(router);
    context.store.toast = markRaw(toast);
});

export default pinia;