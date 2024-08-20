<script setup>
    import { ref, computed } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import { ElMessage } from "element-plus";
    import { useAllDataStore } from "@/stores";
    const store = useAllDataStore();

    const tags = computed(() => store.state.tags);
    const route = useRoute();
    const router = useRouter();
    const handleMenu = (item) => {
        router.push(item.name);
        store.selectMenu(item);
    };
    const handleClose = (tag, index) => {
        store.updateTags(tag);
        if (tag.name !== route.name) {
            return;
        }
        if (index === store.state.tags.length) {
            const lastTag = tags.value[index - 1];
            router.push(lastTag.name);
            store.selectMenu(lastTag);
        } else {
            const nextTag = tags.value[index];
            router.push(nextTag.name);
            store.selectMenu(nextTag);
        }
    };
</script>

<template>
    <div class="tags">
        <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :closable="tag.name != 'home'"
            :effect="route.name === tag.name ? 'dark' : 'plain'"
            @click="handleMenu(tag)"
            @close="handleClose(tag, index)"
            >{{ tag.label }}
        </el-tag>
    </div>
</template>

<style lang="less" scoped>
    .tags {
        margin: 20px 0 0 20px;
    }
    .el-tag {
        margin-right: 10px;
        :hover {
            cursor: pointer;
        }
    }
</style>
