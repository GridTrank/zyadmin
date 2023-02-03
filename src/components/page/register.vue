<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">注册</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username"  placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">提交</el-button><br/>
                    <!-- <el-button type="primary" @click="zhuce()">提交</el-button> -->
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        //注册账号设置
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    this.$axios
                    .post(`/registrations/saveUsers`,{
                        number:this.param.username,
                        password:this.param.password,
                        // administrator:"0"
                    })
                    .then((res) => {
                        if (res.data.msg=='注册成功') {
                            this.$message({
                                type:"success",
                                message:"注册成功"
                            })
                            this.$emit("zhu",false)
                            this.param= {
                                    username: '',
                                    password: ''
                                }
                        }
                        // this.findAllUser();
                        // this.$message.success('删除成功');
                        // this.tableData.splice(index, 1);
                    })
                    .catch((error) => {
                        this.$message.error(error.data.msg);
                    });
                    // localStorage.setItem('ms_username', this.param.username);
                    // this.$router.push('/');
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../../assets/img/蓝色喷溅.jpg); */
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
