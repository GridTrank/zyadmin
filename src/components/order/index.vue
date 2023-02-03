<template>
    <div class="content">
        <div class="handle-box">
            <el-input placeholder="订单编号" v-model="search.number" class="handle-input mr10" clearable></el-input>
            <el-input placeholder="客户姓名" v-model="search.username" class="handle-input mr10" clearable></el-input>
            <el-input placeholder="商品名称" v-model="search.paper" class="handle-input mr10" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handsearch()">搜索</el-button>
            <download-excel
                :data="tableData"
                :fields="json_fields"
                :header="title"
                name="订单信息表.xls"
                style="float: right; margin-top: 10px"
            >
                <div>
                    <el-button type="primary">导出</el-button>
                </div>
            </download-excel>
        </div>
        <el-table :data="tableData" row-key="oid" :expand-row-keys="expands.length > 0 ? expands : expands2" style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column type="expand" width="0" align="right">
                <template >
                    <!-- 客户信息 -->
                    <div v-if="expands.length > 0">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用户ID:">
                                <span>{{ userData.id }}</span>
                            </el-form-item>
                            <el-form-item label="账号名:">
                                <span>{{ userData.nickname }}</span>
                            </el-form-item>
                            <el-form-item label="注册时间:">
                                <span>{{ userData.time }}</span>
                            </el-form-item>
                            <el-form-item label="手机号:">
                                <span>{{ userData.phone }}</span>
                            </el-form-item>
                            <el-form-item label="邮箱:">
                                <span>{{ userData.email }}</span>
                            </el-form-item>
                            <el-form-item label="公司名称:">
                                <span>{{ userData.companyname }}</span>
                            </el-form-item>
                            <el-form-item label="职位:">
                                <span>{{ userData.position }}</span>
                            </el-form-item>
                            <el-form-item label="来源渠道:">
                                <span>{{ userData.source }}</span>
                            </el-form-item>
                            <el-form-item label="会员等级:">
                                <span>{{ userData.viplv }}</span>
                            </el-form-item>
                            <el-form-item label="折扣:">
                                <span>{{ userData.discount }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 产品配置 -->
                    <div v-else>
                        <div v-for="item in peizhi" :key="item.zid">
                            <p>{{ item.classification }}</p>
                            <p style="margin-left: 10px" v-for="i in item.alltableings" :key="i.xid">
                                {{ i.choose }}
                                <span style="margin-left: 10px">数量：{{ i.number }}</span>
                            </p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="number" show-overflow-tooltip label="订单编号"> </el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="客户姓名（下单人）">
                <template slot-scope="scope">
                    <p>{{ scope.row.username }}</p>
                    <el-button class="table_button" size="mini" type="text" @click="expandRow(scope.row)"
                        ><i
                            :class="`${expands[0] == scope.row.oid ? 'el-icon-caret-bottom' : 'el-icon-caret-right'} 'el-icon--right'`"
                        />客户信息</el-button
                    >
                </template>
            </el-table-column>
            <el-table-column prop="time" show-overflow-tooltip label="下单时间"> </el-table-column>
            <el-table-column prop="address" show-overflow-tooltip label="选购商品名称">
                <template slot-scope="scope">
                    <p>{{ scope.row.paper }}</p>
                    <el-button class="table_button" size="mini" type="text" @click="expandRow2(scope.row)"
                        ><i
                            :class="`${expands2[0] == scope.row.oid ? 'el-icon-caret-bottom' : 'el-icon-caret-right'} 'el-icon--right'`"
                        />产品配置</el-button
                    >
                </template>
            </el-table-column>
            <!-- <el-table-column prop="addressname" show-overflow-tooltip label="选购商品数量"> </el-table-column>
            <el-table-column prop="addressname" show-overflow-tooltip label="选购商品价格"> </el-table-column> -->
            <el-table-column prop="addressname" show-overflow-tooltip label="收件人信息"> </el-table-column>
            <el-table-column prop="phone" show-overflow-tooltip label="收件人联系电话"> </el-table-column>
            <el-table-column prop="site" show-overflow-tooltip label="收件人收货地址"> </el-table-column>
            <el-table-column prop="state" show-overflow-tooltip label="订单支付状态"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="logistics" label="物流状态"> </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                    <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改订单" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <!-- <el-form-item label="总价" prop="price">
                    <el-input v-model="ruleForm.price"></el-input>
                </el-form-item> -->
                <el-form-item label="订单编号" prop="number">
                    <el-input v-model="ruleForm.number"></el-input>
                </el-form-item>
                <el-form-item label="订单状态" prop="state">
                    <el-input v-model="ruleForm.state"></el-input>
                </el-form-item>
                <el-form-item label="物流状态" prop="logistics">
                    <el-input v-model="ruleForm.logistics"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '订单文件',
            //导出格式
            json_fields: {
                订单ID: 'oid',
                订单编号: 'number',
                客户姓名: 'name',
                下单时间: 'time',
                选购商品名称: 'paper',
                收件人信息: 'addressname',
                收件人联系电话: 'phone',
                收件人收货地址: 'site',
                订单支付状态: 'state',
                物流状态: 'logistics'
            },
            tableData: [],
            dialogVisible: false,
            expands: [],
            expands2: [],

            ruleForm: {
                name: ''
            },
            rules: {
                price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
                number: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
                state: [{ required: true, message: '请输入订单状态', trigger: 'blur' }],
                logistics: [{ required: true, message: '请输入物流状态', trigger: 'blur' }]
            },
            objData: {},
            // 搜索
            search: {
                number: '',
                username: '',
                paper: ''
            },
            userData: {},
            peizhi: {},
            alladd:[]
        };
    },
    methods: {
        handsearch() {
            if (this.search.number != '') {
                this.$axios.get(`/Orders/findOneOrders4?number=${this.search.number}`).then((res) => {
                    this.tableData = [];
                    res.data.forEach((item) => {
                        if (item.username != null) {
                            this.tableData.push(item);
                        }
                    });
                });
            } else if (this.search.username != '') {
                this.$axios.post(`/Orders/findOneOrders2?username=${this.search.username}`).then((res) => {
                    this.tableData = [];
                    res.data.forEach((item) => {
                        if (item.username != null) {
                            this.tableData.push(item);
                        }
                    });
                });
            } else if (this.search.paper != '') {
                this.$axios.get(`/Orders/findOneOrders3?paper=${this.search.paper}`).then((res) => {
                    this.tableData = [];
                    res.data.forEach((item) => {
                        if (item.username != null) {
                            this.tableData.push(item);
                        }
                    });
                });
            }else{
                this.queryData()
            }
        },
        handleClick(row) {
            this.dialogVisible = true;
            let a = JSON.stringify(row);
            this.ruleForm = JSON.parse(a);
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        //会员等级
        async findAllVIP() {
            await this.$axios.get('/discount/findAllDiscount').then((res) => {
                this.alladd = res.data;
            });
        },
        // 客户注册信息
        expandRow(row) {
            if (this.expands.indexOf(row.oid) < 0) {
                this.expands = [];
                this.$axios.post(`/registration/findUserID?id=${row.userid}`).then((res) => {
                    this.userData = res.data;
                // for (let index = 0; index < this.userData.length; index++) {
                    // const element = this.userData[index];
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (this.userData.gradevip == this.alladd[i].vid) {
                            this.userData.discount = this.alladd[i].discount;
                            this.userData.viplv = this.alladd[i].viplv;
                        }
                    }
                // }
                console.log(this.userData);
                this.expands.push(row.oid);
                });
            } else {
                this.expands = [];
            }
        },
        // 详细配置
        expandRow2(row) {
            if (this.expands2.indexOf(row.oid) < 0) {
                this.expands2 = [];
                this.expands2.push(row.oid);
                this.peizhi = JSON.parse(row.paperdetails);
            } else {
                this.expands2 = [];
            }
        },
        submitForm(formName) {
            let a = JSON.stringify(this.ruleForm);
            this.objData = JSON.parse(a);
            delete this.objData.paperdetail;
            delete this.objData.userdetail;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.put('/Orders/updateOrders', { ...this.objData }).then((res) => {
                        this.queryData()
                        this.dialogVisible = false;
                    });
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.ruleForm = {};
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
        },
        // 查询
        async queryData() {
            await this.$axios.get('/Orders/findAllOrders').then((res) => {
                // this.alladd = res.data;
                this.tableData = [];
                res.data.forEach((item) => {
                    if (item.username != null&&item.paper!=null) {
                        this.tableData.push(item);
                    }
                });
            });
        }
    },
    mounted() {
        this.findAllVIP()
        this.queryData();
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
