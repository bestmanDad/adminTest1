import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "main",
        component: () => import("@/views/Main.vue"),
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("@/views/Home.vue"),
                meta: { breadcrumb: "首页" }, // 添加面包屑信息
            },
            {
                path: "user",
                name: "user",
                component: () => import("@/views/User.vue"),
                meta: { breadcrumb: "用户管理" },
            },
            {
                path: "mall",
                name: "mall",
                component: () => import("@/views/Mall.vue"),
                meta: { breadcrumb: "商品管理" },
            },
            {
                path: "page1",
                name: "page1",
                component: () => import("@/views/Page1.vue"),
                meta: { breadcrumb: "页面1" },
            },
            {
                path: "page2",
                name: "page2",
                component: () => import("@/views/Page2.vue"),
                meta: { breadcrumb: "页面2" },
            },
        ],
    },
    {
        path: "/404",
        name: "404",
        component: () => import("@/views/404.vue"),
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
