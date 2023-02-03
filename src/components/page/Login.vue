<template>
    <div class="login-wrap">
        <div class="ms-login" v-if="!show">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" >
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button type="primary" @click="zhuce()">注册</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
          
        </div>
          <register v-else @zhu="zhu"></register>
    </div>
</template>

<script>
import register from "./register";
export default {
    components:{
        register
    },
    data: function () {
        return {
            param: {
                username: '',
                password: ''
            },
            show:false,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        zhu(i){
            console.log(i);
            this.show=i
        },
        //登录账号设置
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                     this.$axios
                    .post(`/registrations/logins`,{
                        number:this.param.username,
                        password:this.param.password,
                        // administrator:"0"
                    })
                    .then((res) => {
                        if (res.data['提示']=='成功') {
                            if (res.data['管理员'].administrator==0) {
                                this.$message.error("权限不足")
                                return
                            }
                            this.$message({
                                type:"success",
                                message:"登录成功"
                            })
                            // this.$router.push('/');
                            let a=JSON.stringify(res.data['管理员'])
                            localStorage.setItem('ms_username', a);
                            localStorage.setItem('ms_token', res.data.token);
                            this.$router.push('/dashboard').catch(()=>{
                                    
                            })
                        }else{
                            this.$message.error('用户或者密码错误');
                        }
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        this.$message.error(error.data['提示'])
                    });
                    
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
        zhuce(){
            this.show=true
        },
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/蓝色喷溅.jpg);
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
    margin-left: 0;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
