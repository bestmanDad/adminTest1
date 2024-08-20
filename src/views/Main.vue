<script setup>
    import CommonAsside from "@/components/CommonAsside.vue";
    import CommonHeader from "@/components/CommonHeader.vue";
    import CommonTag from "@/components/CommonTag.vue";
</script>

<template>
    <div class="common-layout">
        <el-container class="lay-container">
            <!-- 侧边栏 -->
            <common-asside />
            <el-container>
                <el-header class="right-header">
                    <!-- 头部导航 -->
                    <common-header />
                </el-header>
                <common-tag />
                <el-main class="right-main">
                    <!-- main区域 -->
                    <router-view> </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang="less">
    .common-layout,
    .lay-container {
        height: 100%;
    }
    .el-header {
        background-color: #333;
    }
</style>
