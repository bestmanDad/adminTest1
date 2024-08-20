import { defineStore } from "pinia";
import { ref, watch } from "vue";

function initState() {
    return {
        isCollapse: true,
        tags: [
            {
                path: "/home",
                name: "home",
                label: "首页",
                icon: "home",
            },
        ],
        currentMenu: null,
        menuList: [
            {
                path: "/home",
                name: "home",
                label: "首页",
                icon: "house",
                url: "Home",
            },
            {
                path: "/mall",
                name: "mall",
                label: "商品管理",
                icon: "video-play",
                url: "Mall",
            },
            {
                path: "/user",
                name: "user",
                label: "用户管理",
                icon: "user",
                url: "User",
            },
            {
                path: "other",
                label: "其他",
                icon: "location",
                children: [
                    {
                        path: "/page1",
                        name: "page1",
                        label: "页面1",
                        icon: "setting",
                        url: "Page1",
                    },
                    {
                        path: "/page2",
                        name: "page2",
                        label: "页面2",
                        icon: "setting",
                        url: "Page2",
                    },
                ],
            },
        ],
        token: "",
        routerList: [],
    };
}

export const useAllDataStore = defineStore("allData ", () => {
    const state = ref(initState());
    function selectMenu(val) {
        if (val.name === "home") {
            state.value.currentMenu = null;
        } else {
            state.value.currentMenu = val;
            let index = state.value.tags.findIndex((item) => item.name === val.name);
            index === -1 ? state.value.tags.push(val) : "";
        }
    }
    watch(
        state,
        (newObj) => {
            if (!newObj.token) return;
            localStorage.setItem("store", JSON.stringify(newObj));
        },
        { deep: true }
    );
    function updateMenuList(val) {
        state.value.menuList = val;
    }

    function addMenu(router, type) {
        if (type == "refresh") {
            if (JSON.parse(localStorage.getItem("store"))) {
                state.value = JSON.parse(localStorage.getItem("store"));
                state.value.routerList = [];
            } else {
                return;
            }
        }
        const menu = state.value.menuList;
        const moudle = import.meta.glob("../views/**/*.vue");
        const routeArr = [];
        menu.forEach((item) => {
            if (item.children) {
                item.children.forEach((val) => {
                    const url = `../views/${val.url}.vue`;
                    val.component = moudle[url];
                    routeArr.push(...item.children);
                });
            } else {
                const url = `../views/${item.url}.vue`;
                item.component = moudle[url];
                routeArr.push(item);
            }
        });
        const routers = router.getRoutes();
        state.value.routerList.forEach((item) => {
            if (item.name == "home" || item.name == "main" || item.name == "404") {
                return;
            } else {
                router.removeRoute(item.name);
            }
        });
        routeArr.forEach((item) => {
            state.value.routerList.push(router.addRoute("main", item));
        });
    }

    function updateTags(tag) {
        let index = state.value.tags.findIndex((item) => item.name === tag.name);
        state.value.tags.splice(index, 1);
    }

    function clean() {
        state.value.routerList.forEach((item) => {
            console.log(item);
            if (item) {
                item();
            }
            // router.removeRoute(item.name);
        });
        state.value = initState();
        localStorage.removeItem("store");
    }
    return { state, selectMenu, updateTags, updateMenuList, addMenu, clean };
});
