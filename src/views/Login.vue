<script setup>
    import { ref, getCurrentInstance, onMounted, reactive } from "vue";
    import { useAllDataStore } from "@/stores";
    import { ElMessage } from "element-plus";
    import { useRouter } from "vue-router";
    const { proxy } = getCurrentInstance();

    const loginForm = reactive({
        username: "",
        password: "",
    });
    const store = useAllDataStore();
    const router = useRouter();
    const handleClick = async () => {
        if (!loginForm.username || !loginForm.password) {
            ElMessage.error("用户名或密码不能为空");
            return;
        }
        const data = await proxy.$api.getMenu(loginForm);
        console.log(data);
        store.updateMenuList(data.menuList);
        store.state.token = data.token;
        ElMessage.success("登陆成功");
        store.addMenu(router);
        router.push("/home");
    };
</script>

<template>
    <div class="body-login">
        <el-form :model="loginForm" class="login-contianer">
            <h1>欢迎登陆</h1>
            <el-form-item prop="username">
                <el-input
                    type="input"
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    placeholder="请输入密码"
                    type="password"
                    v-model="loginForm.password"
                ></el-input
            ></el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleClick">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped lang="less">
    .body-login {
        height: 100%;
        width: 100%;
        background-image: url("@/assets/images/background.png");
        background-size: 100%;
        overflow: hidden;
    }

    .login-contianer {
        width: 400px;
        background-color: #fff;
        border: 1px solid #eaeaea;
        border-radius: 15px;
        padding: 35px 35px 15px 35px;
        box-shadow: 0 0 25px #cacaca;
        margin: 250px auto;

        h1 {
            text-align: center;

            margin-bottom: 20px;
            color: #545054;
        }
    }

    :deep(.el-form-item__content) {
        justify-content: center;
    }
</style>
