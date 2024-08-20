<script setup>
    import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
    import { ElMessage, ElMessageBox } from "element-plus";
    const { proxy } = getCurrentInstance();

    const config = reactive({ name: "", tatal: 0, page: 1, limit: 10 });
    const tableData = ref([]);
    const getUserData = async () => {
        let data = await proxy.$api.getUserData(config);
        console.log(data);
        tableData.value = data.list.map((item) => {
            return { ...item, sexLabel: item.sex === 1 ? "男" : "女" };
        });
        config.tatal = data.count;
    };

    const tableLable = reactive([
        { prop: "name", label: "姓名" },
        { prop: "age", label: "年龄" },
        { prop: "sexLabel", label: "性别" },
        { prop: "birth", label: "生日" },
        { prop: "addr", label: "地址", width: 500 },
    ]);

    const formInline = reactive({ keyWord: "" });

    const handleSearch = () => {
        config.name = formInline.keyWord;
        getUserData();
    };

    const handleChange = (page) => {
        config.page = page;
        getUserData();
    };

    const handleDelete = (val) => {
        ElMessageBox.confirm("是否确定删除").then(async () => {
            console.log(val);

            await proxy.$api.deleteUser({ id: val.id });
            ElMessage({
                showClose: true,
                message: "删除成功",
                type: "success",
            });
            getUserData();
        });
    };

    onMounted(() => {
        getUserData();
    });

    const action = ref("add");
    const dialogVisible = ref(false);
    const formUser = reactive({});

    const rules = reactive({
        name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
        age: [
            { required: true, message: "年龄是必填项", trigger: "blur" },
            { type: "number", message: "年龄必须是数字" },
        ],
        sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
        birth: [{ required: true, message: "出生日期是必选项" }],
        addr: [{ required: true, message: "地址是必填项" }],
    });

    const handleClose = () => {
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields();
    };

    const handleCancel = () => {
        proxy.$refs["userForm"].resetFields();
        dialogVisible.value = false;
    };

    const handleAdd = () => {
        dialogVisible.value = true;
    };

    const formatDate = (date) => {
        let time = new Date(date);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        function addZero(num) {
            return num < 10 ? "0" + num : num;
        }
        return year + "-" + addZero(month) + "-" + addZero(day);
    };

    const onSubmit = async () => {
        proxy.$refs["userForm"].validate(async (valid) => {
            if (valid) {
                let res = null;

                formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
                    ? formUser.birth
                    : formatDate(formUser.birth);
                formUser.sex = parseInt(formUser.sex);
                if (action.value == "add") {
                    console.log(formUser);
                    res = await proxy.$api.createUser(formUser);
                } else {
                    res = await proxy.$api.updateUser(formUser);
                }
                if (res) {
                    ElMessage({
                        showClose: true,
                        message: action.value === "add" ? "添加成功" : "修改成功",
                        type: "success",
                    });
                    dialogVisible.value = false;
                    proxy.$refs["userForm"].resetFields();
                    getUserData();
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: "请填写完整",
                    type: "error",
                });
            }
        });
        // await proxy.$api.createUser(formUser);
    };

    const handleEdit = (val) => {
        action.value = "edit";
        dialogVisible.value = true;
        nextTick(() => {
            Object.assign(formUser, { ...val, sex: "" + val.sex });
        });
    };
</script>
<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入:">
                <el-input placeholder="Please Input" v-model="formInline.keyWord"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <!-- <p class="total-label">
            共获取到 <span>{{ config.tatal }}</span> 条数据
        </p> -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column
                v-for="item in tableLable"
                :prop="item.prop"
                :key="item.prop"
                :label="item.label"
                :width="item.width ? item.width : 125"
            />
            <el-table-column fixed="right" label="Operations" min-width="120">
                <template #="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="primary" size="small" @click="handleDelete(scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            background
            layout="prev, pager, next"
            :total="config.tatal"
            size="small"
            @current-change="handleChange"
            :page-count="Math.ceil(config.tatal / config.limit)"
        />

        <el-dialog
            v-model="dialogVisible"
            :title="action == 'add' ? '新增用户' : '编辑用户'"
            width="35%"
            :before-close="handleClose"
        >
            <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
            <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="formUser.name" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item class="select-clearn" label="性别" prop="sex">
                            <el-select v-model="formUser.sex" placeholder="请选择">
                                <el-option label="男" value="1" />
                                <el-option label="女" value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出生日期" prop="birth">
                            <el-date-picker
                                v-model="formUser.birth"
                                type="date"
                                placeholder="请输入"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="地址" prop="addr">
                        <el-input v-model="formUser.addr" placeholder="请输入地址" />
                    </el-form-item>
                </el-row>
                <el-row style="justify-content: flex-end">
                    <el-form-item>
                        <el-button type="primary" @click="handleCancel">取消</el-button>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
    .user-header {
        display: flex;
        justify-content: space-between;
    }
    .table {
        position: relative;
        height: 520px;

        .pager {
            position: absolute;
            bottom: 30px;
            right: 10px;
        }
        .el-table {
            width: 100%;
            height: 500px;
        }
        // p {
        //     font-size: 14px;
        //     color: #333;
        //     padding-bottom: 10px;
        //     span {
        //         font-weight: bold;
        //         color: #409eff;
        //     }
        // }
        .select-clearn {
            display: flex;
        }
    }
</style>
