<template>
    <div class="content">
        <div class="handle-box">
            <el-input placeholder="商品名称" class="handle-input mr10" v-model="search"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="findGoodsName">搜索</el-button>
        </div>
        <el-table :data="goods" row-key="id" :expand-row-keys="expands.length > 0 ? expands : expands2" style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="商品名称"> </el-table-column>
            <el-table-column prop="stock" show-overflow-tooltip label="库存总量"> </el-table-column>
            <el-table-column prop="inputStock" show-overflow-tooltip label="入库总量"> </el-table-column>
            <el-table-column prop="outputStock" show-overflow-tooltip label="上次出库"> </el-table-column>
            <el-table-column prop="sales" show-overflow-tooltip label="销量"> </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">入库</el-button>
                    <el-button type="text" size="small" @click="edit2(scope.row)">出库</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="入库数量" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="alledit" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="入库" prop="name">
                    <el-input v-model="alledit.inputStock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="出库数量" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose">
            <el-form :model="alledit2" :rules="rules" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                <el-form-item label="出库" prop="name">
                    <el-input v-model="alledit2.outputStock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm2('ruleForm1')">确定</el-button>
                    <el-button @click="resetForm2('ruleForm1')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alledit:{},
            alledit2:{},
            search: '',
            goods: [],
            dialogVisible: false,
            dialogVisible2: false,
            expands: [],
            expands2: [],
            ruleForm: {
                name: ''
            },
            rules: {
                inputStock: [{ required: true, message: '请输入数量', trigger: 'blur' }],
                outputStock: [{ required: true, message: '请输入数量', trigger: 'blur' }]
            },
            rowData:{},
        };
    },
    created() {
        this.findAllgoods();
    },
    methods: {
        edit(row) {
            this.rowData = row;
            this.dialogVisible = true;
        },
        edit2(row) {
            this.rowData = row;
            this.dialogVisible2 = true;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },

        // 详细配置
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editGoods();
                } else {
                    return false;
                }
            });
        },
        submitForm2(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editStorage();
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },
        resetForm2(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible2 = false;
        },
        //查询所有库存商品.
        findAllgoods() {
            this.$axios.post('/manageStock/getAllCommodity').then((res) => {
                this.goods = res.data;
            });
        },
        //模糊搜索商品名称
        findGoodsName() {
            this.$axios.get(`/manageStock/getCommodityListByName?name=${this.search}`).then((res) => {
                this.goods = res.data;
            });
        },
        //商品入库
        editGoods() {
            this.$axios.get(`/manageStock/updateInputCommodity?sid=${this.rowData.sid}&&inputStock=${this.alledit.inputStock}`).then(() => {
                this.findAllgoods();
                this.alledit={}
                this.dialogVisible = false;
            });
        },
        //商品出库
        editStorage() {
            this.$axios
                .post(`/manageStock/updateOutputCommodity?sid=${this.rowData.sid}&&outputStock=${this.alledit2.outputStock}`)
                .then(() => {
                    this.alledit2={}
                    this.findAllgoods();
                    this.dialogVisible2 = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.handle-input {
    width: 300px;
    margin: 10px;
    display: inline-block;
}
.content {
    background: #fff;
}
/deep/.el-table__expand-icon {
    visibility: hidden;
}
</style>
