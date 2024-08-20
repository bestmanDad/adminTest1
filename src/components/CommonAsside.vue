<script setup>
    import { ref, computed } from "vue";
    import { useAllDataStore } from "@/stores";
    import { useRouter, useRoute } from "vue-router";
    // const menu_list = ref([
    //     {
    //         path: "/home",
    //         name: "home",
    //         label: "首页",
    //         icon: "house",
    //         url: "Home",
    //     },
    //     {
    //         path: "/mall",
    //         name: "mall",
    //         label: "商品管理",
    //         icon: "video-play",
    //         url: "Mall",
    //     },
    //     {
    //         path: "/user",
    //         name: "user",
    //         label: "用户管理",
    //         icon: "user",
    //         url: "User",
    //     },
    //     {
    //         path: "other",
    //         label: "其他",
    //         icon: "location",
    //         children: [
    //             {
    //                 path: "/page1",
    //                 name: "page1",
    //                 label: "页面1",
    //                 icon: "setting",
    //                 url: "Page1",
    //             },
    //             {
    //                 path: "/page2",
    //                 name: "page2",
    //                 label: "页面2",
    //                 icon: "setting",
    //                 url: "Page2",
    //             },
    //         ],
    //     },
    // ]);

    const menu_list = computed(() => store.state.menuList);

    const hasChild = computed(() => menu_list.value.filter((item) => item.children));
    const notChild = computed(() => menu_list.value.filter((item) => !item.children));
    const store = useAllDataStore();
    const isCollapse = computed(() => store.state.isCollapse);
    const width = computed(() => (isCollapse.value ? "64px" : "180px"));

    const router = useRouter();
    const route = useRoute();
    const activeMenu = computed(() => route.path);
    const handleMenu = (item) => {
        router.push(item.path);
        store.selectMenu(item);
    };
</script>

<template>
    <el-aside :width="width">
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical"
            background-color="#545c63"
            text-color="#fff"
            :collapse="isCollapse"
            :collapse-transition="false"
            :defaultActive="activeMenu"
        >
            <div class="logo-container">
                <h3 v-show="!isCollapse">通用后台系统</h3>
                <h3 v-show="isCollapse">后台</h3>
            </div>
            <el-menu-item
                v-for="item in notChild"
                :index="item.path"
                :key="item.path"
                @click="handleMenu(item)"
            >
                <el-icon class="icons"><component :is="item.icon"></component></el-icon>
                <template #title>{{ item.label }}</template>
            </el-menu-item>

            <el-sub-menu v-for="item in hasChild" :index="item.path" :key="item.path">
                <template #title>
                    <el-icon class="icons"><component :is="item.icon"></component></el-icon>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item
                        v-for="(subItem, subIndex) in item.children"
                        :index="subItem.path"
                        :key="subItem.path"
                        @click="handleMenu(subItem)"
                    >
                        <el-icon class="icons"><component :is="subItem.icon"></component></el-icon>
                        <template #title>{{ subItem.label }}</template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<style lang="less" scoped>
    .el-aside {
        height: 100vh;

        overflow-x: hidden;
        background-color: #304156;
    }

    .el-menu {
        height: 100%;
        border-right: none;

        background-color: #304156 !important;
        &:not(.el-menu--collapse) {
            width: 180px;
        }
    }

    .logo-container {
        height: 60px;
        background-color: #435061;
        display: flex;
        justify-content: center;
        align-items: center;

        h3 {
            color: #fff;
            font-size: 18px;
            margin: 0;
            white-space: nowrap;
        }
    }

    .el-menu-item,
    .el-sub-menu__title {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
        padding: 0 20px !important;
        &:hover,
        &.is-active {
            background-color: #263445 !important;
        }
        .icons {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    }

    .el-menu-item {
        &:hover,
        &.is-active {
            background-color: #3a4b5c;
        }
    }

    .el-sub-menu {
        .el-menu-item {
            padding-left: 40px !important;
            background-color: #1f2d3d !important;
            &:hover,
            &.is-active {
                background-color: #001528 !important;
            }
            &:hover,
            &.is-active {
                background-color: #3f5061;
            }
        }
    }
</style>
