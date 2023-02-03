<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 后台用户管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <div class="handle-box">
                <template>
                    <el-table :data="alladd">
                        <el-table-column label="用户名" width="280" prop="number">
                            <!-- <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.viplv }}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column label="密码" width="280" prop="password" v-if="username.administrator==2">
                            <!-- <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.discount }}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column label="等级" width="280" prop="administrator">
                            <!-- <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.discount }}</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                
                                <el-button size="small" icon="" type="warning" @click="handleEdit(scope.$index, scope.row)" round
                                    >编辑</el-button
                                >
                                <el-button size="small" icon="" type="danger" @click="handleDelete(scope.$index, scope.row)" round
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <!-- 会员添加 -->
                <el-dialog title="修改" :before-close="handleClose" :visible.sync="VipAdd" width="30%">
                    <el-form :model="numberValidateForm" ref="numberValidateForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="number">
                            <el-input placeholder="请输入名称" v-model="numberValidateForm.number" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input
                                v-model="numberValidateForm.password"
                                autocomplete="off"
                                placeholder="请输入密码"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="等级" prop="administrator">
                            <el-select v-model="numberValidateForm.administrator" clearable placeholder="请选择">
                                <el-option
                                v-for="item in 2"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('numberValidateForm')">取 消</el-button>
                        <el-button type="primary" @click="submitForm('numberValidateForm')">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
// import { type } from 'os';

export default {
    data() {
        return {
            type: 'add',
            onemessage: '',
            alladd: [],
            VIPAll: '',
            numberValidateForm: {},
            // 添加
            VipAdd: false,
            VipEdit: false,
            rules: {
                number: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                administrator: [{ required: true, message: '用户等级不能为空', trigger: 'change' }]
            }
        };
    },
    created() {
        this.findAllVIP();
    },
    computed:{
         username() {
            let a = localStorage.getItem('ms_username');
            let username=JSON.parse(a)
            return username
        }
    },
    methods: {
        //查询
        async findAllVIP() {
            await this.$axios.get('/registrations/findAllAdministratorService').then((res) => {
                this.alladd = res.data;
            });
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.resetForm('numberValidateForm');
                    done();
                })
                .catch((_) => {});
        },
        // 修改
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // if (this.type == 'add') {
                        this.$axios
                            .put('/registrations/updateAdministratorService', {
                                ...this.numberValidateForm
                            })
                            .then(() => {
                                this.findAllVIP();
                                this.$message.success('修改成功');
                                this.VipAdd=false
                            });
                    // } else {
                    //     this.$axios
                    //         .put('/discount/updateDiscount', {
                    //             ...this.numberValidateForm
                    //         })
                    //         .then(() => {
                    //             this.findAllVIP();
                    //             this.VipAdd = false;
                    //         });
                    }
                // } 
            });
        },
        //修改
        handleEdit(index, row) {
            if (this.username.administrator!=2) {
                this.$message.error("权限不足")
                return
            }
            
            this.numberValidateForm = row;
            this.VipAdd = true;
        },
        //清空
        resetForm(formName) {
            this.VipAdd = false;
            this.numberValidateForm = {};
            this.$refs[formName].resetFields();
        },
        //删除
        async handleDelete(index, row) {
            if (this.username.administrator!=2) {
                this.$message.error("权限不足")
                return
            }
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.get(`/registrations/deleteAdministratorService?id=${row.id}`).then(() => {
                    this.findAllVIP();
                    this.$message.success('删除成功');
                    // this.alladd.splice(index, 1);
                });
            });
        }
    }
};
</script>

<style scoped>
.handle-input {
    width: 300px;
    margin: 10px;
    display: inline-block;
}
.content {
    background: #fff;
}
</style>
