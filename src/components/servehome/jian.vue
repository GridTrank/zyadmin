<template>
    <div>
        <el-card class="form-container" shadow="never">
            <el-form :model="productAttr" ref="productAttrFrom" :rules="rules" label-width="150px">
                <el-form-item label="产品名称：" prop="sid">
                    <el-select v-model="productAttr.sid" placeholder="请选择" @change="handContent">
                        <el-option v-for="item in classAll" :key="item.sid" :label="item.name" :value="item.sid"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="兼容：" prop="judge">
                    <el-radio-group v-model="productAttr.judge">
                        <el-radio :label="0">数量兼容</el-radio>
                        <el-radio :label="1">产品兼容</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="约束类别：" prop="aid">
                    <el-cascader
                        v-model="productAttr.aid"
                        :options="dataData"
                        :show-all-levels="false"
                        :props="{ children: 'detailss', value: 'xid', label: 'choose', leaf: 'xid' }"
                        :key="cascaderKey"
                        ref="cascader"
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="约束类别数量：" v-if="productAttr.judge == 0" prop="anumber">
                    <el-input-number :min="1" v-model="productAttr.anumber"></el-input-number>
                </el-form-item>
                <el-form-item label="被约束类别：" prop="bid">
                    <el-cascader
                        v-model="productAttr.bid"
                        :options="dataData"
                        :show-all-levels="false"
                        :props="{ children: 'detailss', value: 'xid', label: 'choose', leaf: 'xid' }"
                        :key="cascaderKey"
                        ref="cascader"
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="被约束类别最小值：" v-if="productAttr.judge == 0" prop="bmin">
                    <el-input-number :min="0" v-model="productAttr.bmin"></el-input-number>
                </el-form-item>
                <el-form-item label="被约束类别最大值：" v-if="productAttr.judge == 0" prop="bnumber">
                    <el-input-number :min="0" v-model="productAttr.bnumber"></el-input-number>
                </el-form-item>
                <el-form-item label="被约束类别严格数量：" v-if="productAttr.judge == 0" prop="bstringent">
                    <el-input-number :min="0" v-model="productAttr.bstringent"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
                    <el-button @click="resetForm('productAttrFrom')">重置</el-button>
                    <el-button @click="$router.push('/Serve2488V6')">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-select v-model="sid" placeholder="请选择" @change="jian">
            <el-option v-for="item in classAll" :key="item.sid" :label="item.name" :value="item.sid"> </el-option>
        </el-select>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="aname" label="约束类别"> </el-table-column>
            <el-table-column label="约束类别数量">
                <template slot-scope="scope">
                    <div v-if="scope.row.judge == 0">
                        {{ scope.row.anumber }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="bname" label="被约束类别"> </el-table-column>
            <el-table-column label="被约束类别数量">
                <template slot-scope="scope">
                    <div v-if="scope.row.judge == 0">
                        {{ scope.row.bnumber }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="judge" label="兼容">
                <template slot-scope="scope">
                    <div>
                        {{ scope.row.judge == 1 ? '产品兼容' : '数量兼容' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div>
                        <el-button @click="handClick(scope.row.jid)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'ProductAttrDetail',
    data() {
        return {
            tableData: [],
            //产品数据
            classAll: [],
            //分类数据
            classDetail: [],
            //内容数据
            classTable: [],
            // 详细
            detailedData: [],
            // 总数据
            commodityData: [],
            dataData: [],

            value: true,
            cascaderKey: 1,
            rules: {
                sid: [{ required: true, message: '请选择产品', trigger: 'change' }],
                judge: [{ required: true, message: '请选择兼容', trigger: 'change' }],
                aid: [{ required: true, message: '请选择类别', trigger: 'change' }],
                bid: [{ required: true, message: '请选择类别', trigger: 'change' }],
                anumber: [{ required: true, message: '请选择数量', trigger: 'blur' }],
                bnumber: [{ required: true, message: '请选择最大值', trigger: 'blur' }],
                bmin: [{ required: true, message: '请选择最小值', trigger: 'blur' }],
                bstringent: [{ required: true, message: '请选择严格数量', trigger: 'blur' }]
            },
            // 总数据
            productAttr: {},
            commodityObj: {},
            // 兼容性
            obj: {},
            sid: ''
        };
    },
    watch: {
        classDetail(val) {
            this.cascaderKey++;
        }
    },
    methods: {
        handleChange(o) {
            // this.findDetail()
        },
        // 获得类型数据
        handProduct() {
            // this.classAll.forEach((item) => {
            //     if (item.sid == this.productAttr.sid) {
            //         this.classDetail = item.classificationtabless;
            //     }
            // });
        },
        // 获取内容数据
        handContent() {
            // this.classDetail[index].xin=null
            // this.classTable = [];
            // this.$forceUpdate()
            this.findDetail();
        },
        // 获取详细
        handDetailed(index) {
            // this.$forceUpdate()
            this.findTable(index);
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('是否提交数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (this.productAttr.aid[2] == this.productAttr.bid[2]) {
                            this.$message.error('不能对相同类别设置兼容');
                            return;
                        }
                        let data = {
                            productid: this.productAttr.sid,
                            aid: this.productAttr.aid[2],
                            bid: this.productAttr.bid[2],
                            anumber: this.productAttr.judge == 1 ? 0 : this.productAttr.anumber,
                            bnumber: this.productAttr.judge == 1 ? 0 : this.productAttr.bnumber,
                            judge: this.productAttr.judge,
                            bmin: this.productAttr.bmin,
                            bstringent: this.productAttr.bstringent,
                        };

                        this.$axios.post('/Compatibility/addCompatibility', { ...data }).then((res) => {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.jian();
                        });
                    });
                } else {
                    this.$message({
                        message: '验证失败',
                        type: 'error',
                        duration: 1000
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //第一层
        async findClass() {
            await this.$axios.get('/classificationtable/findAll').then((res) => {
                this.classAll = res.data;
                // res.data.forEach(item=>{
                //     if (item.sid==this.productAttr.sid) {

                //     }
                // })
            });
        },
        //第二层
        async findDetail() {
            await this.$axios.get('/Detailstable/findAll').then((res) => {
                this.classDetail = [];
                res.data.forEach((item) => {
                    if (this.productAttr.sid == item.comm_id) {
                        this.classDetail.push(item);
                    }
                });
                this.findTable();
            });
        },
        //第三层
        async findTable() {
            await this.$axios.get('/AllTable/findAllAllTable').then((res) => {
                // // this.classTable = res.data;
                // this.classDetail.classTable = [];
                res.data.forEach((item) => {
                    this.classDetail.forEach((i) => {
                        i.choose = i.classification;
                        i.xid = i.fid;
                        for (let a = 0; a < i.detailss.length; a++) {
                            const element = i.detailss[a];
                            element.choose = element.details;
                            element.xid = element.nid;
                            if (item.classes_id == element.classes_id && item.co_id == element.co_id && item.nid == element.nid) {
                                element.detailss = [];
                                element.detailss = item.allTabless;
                            }
                        }
                    });
                });
                this.dataData = this.classDetail;
                console.log(res.data);
                console.log(this.dataData);
            });
        },
        //总数据
        async commodity(index) {
            await this.$axios.get('/commodity/findAllCommodity').then((res) => {
                this.commodityData = [];
                res.data.forEach((item) => {
                    if (item.sid == this.productAttr.sid) {
                        this.commodityData.push(item);
                    }
                });
                this.$forceUpdate();
            });
        },
        // 查询兼容性
        async jian() {
            await this.$axios.get(`/Compatibility/findAllCompatibility?productid=${this.sid}`).then((res) => {
                this.obj = res.data;
                console.log(this.obj);
                this.commodity2();
            });
        },
        async commodity2() {
            await this.$axios.get('/commodity/findAllCommodity').then((res) => {
                console.log(res);
                this.commodityObj = res.data;
                this.tableData = [];
                let a = [];
                res.data.forEach((item) => {
                    if (this.sid == item.sid) {
                    item.alltableings.forEach((i) => {
                        a.push(i);
                    });
                    }
                });
                console.log(this.obj);
                this.tableData=[]
                this.obj.forEach((j,index) => {
                    this.tableData.push({})
                    console.log('j',j);
                    a.forEach((item) => {
                        console.log(item);
                        if (j.aid == item.xid) {
                            console.log('j',j);
                            console.log(item);
                            // ({
                                this.tableData[index].aname= item.choose,
                                this.tableData[index].productid= j.productid,
                                this.tableData[index].judge= j.judge,
                                this.tableData[index].anumber= j.anumber,
                                this.tableData[index].jid= j.jid
                            // });
                        }
                    });
                    a.forEach((item) => {
                        if (j.bid == item.xid) {
                            this.tableData[index].bname = item.choose;
                            this.tableData[index].bnumber = j.bnumber;
                        }
                    });
                });
                console.log(this.obj);
                console.log(this.tableData);
            });
            // });
        },
        // 删除
        async handClick(id) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // 二次确认删除
                this.$axios
                    .get(`/Compatibility/deleteCompatibility?jid=${id}`)
                    .then((res) => {
                        this.jian();
                    })
                    .catch(() => {});
            });
        }
    },
    mounted() {
        this.findClass();
        // this.jian();
        // this.commodity2();

        // this.findDetail();
        // this.findTable();
    }
};
</script>

<style scoped>
</style>
