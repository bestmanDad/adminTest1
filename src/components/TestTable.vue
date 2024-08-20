<template>
    <div class="component-wrapper">
        <div class="textarea-container">
            <el-input
                v-model="inputText"
                type="textarea"
                :rows="10"
                placeholder="请输入或粘贴内容，每行将作为一个单独的数据项"
                @input="handleInput"
                class="line-numbered-textarea"
                :autosize="{ minRows: 10, maxRows: 20 }"
            />
            <div class="line-numbers" aria-hidden="true">
                <div v-for="num in lineCount" :key="num">{{ num }}:</div>
            </div>
        </div>
        <el-button type="primary" @click="importToTable" style="margin-top: 20px"
            >导入到表格</el-button
        >

        <el-table :data="tableData" style="width: 100%; margin-top: 20px">
            <el-table-column type="index" label="行号" width="80" />
            <el-table-column prop="content" label="内容" />
        </el-table>
    </div>
</template>

<script setup>
    import { ref, computed } from "vue";
    import { ElMessage } from "element-plus";

    const inputText = ref("");
    const tableData = ref([]);

    const lineCount = computed(() => {
        return inputText.value.split("\n").length;
    });

    const lines = computed(() => {
        return inputText.value.split("\n").map((line, index) => ({
            lineNumber: index + 1,
            content: line.trim(),
        }));
    });

    const handleInput = () => {
        // 自动调整textarea的高度以匹配内容
        const textarea = document.querySelector(".line-numbered-textarea textarea");
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    };

    const importToTable = () => {
        if (inputText.value.trim() === "") {
            ElMessage.warning("请先输入内容");
            return;
        }

        tableData.value = lines.value.filter((line) => line.content !== "");
        ElMessage.success(`成功导入 ${tableData.value.length} 行数据到表格`);
    };
</script>

<style scoped>
    .component-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }

    .textarea-container {
        position: relative;
        width: 100%;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
    }

    .line-numbers {
        position: absolute;
        top: 5px;
        left: 5px;
        bottom: 5px;
        width: 30px;
        overflow: hidden;
        color: #999;
        user-select: none;
    }

    .line-numbers > div {
        padding: 0 5px;
        text-align: right;
    }

    .line-numbered-textarea {
        width: 100%;
    }

    .line-numbered-textarea :deep(textarea) {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        padding: 5px 5px 5px 40px !important;
        resize: vertical;
    }

    .el-table {
        width: 100%;
    }
</style>
