<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 会员管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content">
            <el-button size="small" icon="" type="success" @click="handleAdd()" round
                                    >增加会员</el-button
                                >
            <div class="handle-box">
                <template>
                    <el-table :data="alladd">
                        <el-table-column label="会员名称" width="280">
                            <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.viplv }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="折扣" width="280">
                            <template slot-scope="scope">
                                <span style="margin-left: 10px">{{ scope.row.discount }}</span>
                            </template>
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
                <el-dialog :title="type == 'add' ? '会员&折扣' : '修改'" :before-close="handleClose" :visible.sync="VipAdd" width="30%">
                    <el-form :model="numberValidateForm" ref="numberValidateForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="会员" prop="viplv">
                            <el-input placeholder="请输入会员名称" v-model="numberValidateForm.viplv" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="折扣" prop="discount">
                            <el-input
                                v-model="numberValidateForm.discount"
                                @input="numberValidateForm.discount = numberValidateForm.discount.replace(/[^0-9.]/g, '')"
                                autocomplete="off"
                                placeholder="请输入数字类型"
                            ></el-input>
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
                viplv: [{ required: true, message: '会员不能为空', trigger: 'blur' }],
                discount: [{ required: true, message: '折扣不能为空', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.findAllVIP();
    },
    methods: {
        //会员总含量
        async findAllVIP() {
            await this.$axios.get('/discount/findAllDiscount').then((res) => {
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
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.type == 'add') {
                        this.$axios
                            .post('/discount/addAllDiscount', {
                                viplv: this.numberValidateForm.viplv,
                                discount: this.numberValidateForm.discount
                            })
                            .then(() => {
                                this.findAllVIP();
                                this.VipAdd = false;
                            });
                    } else {
                        this.$axios
                            .put('/discount/updateDiscount', {
                                ...this.numberValidateForm
                            })
                            .then(() => {
                                this.findAllVIP();
                                this.VipAdd = false;
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        //增加
        handleAdd() {
            // this.numberValidateForm.age = '';

            this.numberValidateForm = {};
            this.type = 'add';
            this.VipAdd = true;
        },
        //修改
        handleEdit(index, row) {
            this.type = 'edit';
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
            if (this.alladd.length == 1) {
                this.$message({
                    type: 'error',
                    message: '最后一条禁止删除'
                });
                return;
            }
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.get(`/discount/deleteDiscount?vid=${row.vid}`).then(() => {
                    this.findAllVIP();
                    this.$message.success('删除成功');
                    this.alladd.splice(index, 1);
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
