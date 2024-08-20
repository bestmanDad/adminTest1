import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import "@/assets/less/index.less";
import router from "./router";
import "@/api/mock.js";
import api from "@/api/api";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { useAllDataStore } from "@/stores";
import { ElMessage } from "element-plus";
const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$api = api;

app.use(pinia);
const store = useAllDataStore();
store.addMenu(router, "refresh");
function isRoute(to) {
    return router.getRoutes().filter((item) => item.path === to.path).length > 0;
}
router.beforeEach((to, from, next) => {
    // if (to.path !== "/login" && !store.state.token) {
    //     ElMessage.error("请先登录");
    //     return { name: "login" };
    //     return;
    // }

    next();
    if (!isRoute(to)) {
        console.log(to);
        return { name: "404" };
    }
});
app.use(router);
app.use(ElementPlus);
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
