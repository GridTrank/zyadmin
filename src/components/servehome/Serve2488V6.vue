<template>
    <div v-loading="loading">
        <el-button @click="$router.push({path:'/jian'})">兼容性</el-button>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 商品数据修改 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="crumbs">
            <!-- 分类 -->
            <el-collapse v-model="activeName" accordion @change="tab">
                <!-- 分类 -->
                <el-collapse-item title="分类添加" name="1">
                    <el-tabs type="border-card" tab-position="left" @tab-click="tabClick">
                        <div class="list-wrap">
                            <div class="wrap-left">
                                <draggable v-model="classAll" @remove="removeHandle" :options="dragOptions"   >
                                    <transition-group tag="div" id="todo">
                                        <div v-for="(item,index) in classAll" 
                                        @click="selectClass(index)"
                                        :class="['drag-list',{'active':allDetailIndex==index}]"
                                        :key="item.sid" 
                                        @dragend="dragend(index)"
                                        @dragstart="dragstart(index)" 
                                        @dragenter="dragenter($event, index)"
                                        @dragover.prevent
                                        >
                                            {{ item.name }}

                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>
                            <div class="wrap-right" v-if="classAll.length>0">
                                <el-table :data="classAll[allDetailIndex].classificationtabless" border >
                                    <el-table-column :label="classAll[allDetailIndex].name" >
                                        <template slot-scope="scope">
                                            <p style="margin-left: 10px; white-space: pre-wrap; height: auto">{{ scope.row.classification }}</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="handleEdit2(index, scope.row, 'edit')" round>编辑</el-button>
                                            <el-button size="mini" type="danger" @click="handleDel2(index, scope.row)" round
                                                >删除</el-button
                                            >
                                            <el-button size="mini" type="success" @click="handleAdd2(index, scope.row, 'add')" round
                                                >增加</el-button
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        

                        <!-- <el-tab-pane v-for="(item, index) in classAll" :key="item.id" :label="item.name">
                            <div>
                                <el-table :data="item.classificationtabless" style="width: 100%">
                                    <el-table-column :label="item.name" width="600px">
                                        <template slot-scope="scope">
                                            <span style="margin-left: 10px"> {{ scope.row.classification }} </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="handleEdit(index, scope.row, 'edit')" round>编辑</el-button>
                                            <el-button size="mini" type="danger" @click="handleDel(index, scope.row)" round>删除</el-button>
                                            <el-button size="mini" type="success" @click="handleAdd(index, scope.row, 'add')" round
                                                >增加</el-button
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane> -->
                    </el-tabs>
                </el-collapse-item>

                <!-- 内容 -->
                <el-collapse-item title="内容添加" name="2">
                    <el-tabs type="border-card" tab-position="left" @tab-click="tabClick2">
                        <el-tab-pane v-for="(item, index) in classDetail" :key="item.id" :label="item.classification">
                            <div>
                                <el-table :data="item.detailss" style="width: 100%">
                                    <el-table-column :label="item.classification" width="600px">
                                        <template slot-scope="scope">
                                            <p style="margin-left: 10px; white-space: pre-wrap; height: auto">{{ scope.row.details }}</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="handleEdit2(index, scope.row, 'edit')" round>编辑</el-button>
                                            <el-button size="mini" type="danger" @click="handleDel2(index, scope.row)" round
                                                >删除</el-button
                                            >
                                            <el-button size="mini" type="success" @click="handleAdd2(index, scope.row, 'add')" round
                                                >增加</el-button
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-collapse-item>
                <!-- 内容 -->
                <!-- 详细信息 -->
                <el-collapse-item title="详细信息添加" name="3">
                    <el-tabs type="border-card" tab-position="left">
                        <el-tab-pane v-for="(item, index) in classTable" :key="item.id" :label="item.details">
                            <div>
                                <el-table :data="item.allTabless" style="width: 100%">
                                    <el-table-column :label="item.classification" width="600px">
                                        <template slot-scope="scope">
                                            <p style="margin-left: 10px; display: inline-block; vertical-align: top">名称:&nbsp;</p>
                                            <p style="white-space: pre-wrap; height: auto; display: inline-block">{{ scope.row.choose }}</p>
                                            <br />
                                            <span style="margin-left: 10px">最大值:&nbsp;{{ scope.row.max }} </span><br />
                                            <span style="margin-left: 10px">最小值:&nbsp;{{ scope.row.min }} </span><br />
                                            <span style="margin-left: 10px"> 价格:&nbsp;{{ scope.row.price }} </span><br />
                                            <!-- <span style="margin-left: 10px"> 兼容性说明:&nbsp;{{ scope.row.compatibili }} </span><br /> -->
                                            <span style="margin-left: 10px"> 数量是否展示:&nbsp;{{ scope.row.judge?"展示":"不展示" }} </span><br />
                                            <span style="margin-left: 10px"> 是否包含在价格内:&nbsp;{{ scope.row.cd?"包含":"不包含" }} </span><br />
                                            <span style="margin-left: 10px"> 默认值:&nbsp;{{ scope.row.number }} </span><br />
                                            <span style="margin-left: 10px"> 严格数量:&nbsp;{{ scope.row.astrict }} </span><br />
                                            <span style="margin-left: 10px"> 是否必选:&nbsp;{{ scope.row.suibian?"必选":"非必选" }} </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="handleEdit3(index, scope.row, 'edit')" round>编辑</el-button>
                                            <el-button size="mini" type="danger" @click="handleDel3(index, scope.row)" round
                                                >删除</el-button
                                            >
                                            <el-button size="mini" type="success" @click="handleAdd3(index, scope.row, 'add')" round
                                                >增加</el-button
                                            >
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-collapse-item>
                <!-- 详细信息 -->
            </el-collapse>
        </div>
        <!-- 第一层 -->
        <el-dialog :title="type == 'edit' ? '修改' : '添加'" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="desab" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="classification">
                    <el-input v-model="desab.classification"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </span>
        </el-dialog>
        <!-- 第二层 -->
        <el-dialog :title="type2 == 'edit' ? '修改' : '添加'" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose">
            <el-form :model="desab2" ref="ruleForm2" :rules="rules2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="内容名称" prop="details">
                    <el-input type="textarea" :rows="1" v-model="desab2.details"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2('ruleForm2')">确定</el-button>
                <el-button @click="resetForm('ruleForm2')">取消</el-button>
            </span>
        </el-dialog>
        <!-- 第三层 -->
        <el-dialog :title="type3 == 'edit' ? '修改' : '添加'" :visible.sync="dialogVisible3" width="30%" :before-close="handleClose">
            <el-form :model="desab3" ref="ruleForm3" :rules="rules3" label-width="130px" class="demo-ruleForm">
                <el-form-item label="名称" prop="choose">
                    <el-input type="textarea" :rows="1" v-model="desab3.choose"></el-input>
                </el-form-item>
                <el-form-item label="最大值" prop="max">
                    <el-input v-model="desab3.max"></el-input>
                </el-form-item>
                <el-form-item label="最小值" prop="min">
                    <el-input v-model="desab3.min"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="desab3.price"></el-input>
                </el-form-item>
                <!-- <el-form-item label="兼容性" prop="compatibili">
                    <el-input v-model="desab3.compatibili"></el-input>
                </el-form-item> -->
                <el-form-item label="数量是否展示" prop="judge">
                    <el-switch
                        :active-value="num"
                        :inactive-value="num2"
                        v-model="desab3.judge"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                </el-form-item>
                <el-form-item label="是否包含在价格内" prop="cd">
                    <el-switch
                        :active-value="cd"
                        :inactive-value="cd2"
                        v-model="desab3.cd"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                </el-form-item>
                <el-form-item label="是否必选" prop="suibian">
                    <el-switch
                        :active-value="suibian"
                        :inactive-value="suibian2"
                        v-model="desab3.suibian"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                        </el-switch>
                </el-form-item>
                <el-form-item label="默认值" prop="number">
                    <el-input v-model="desab3.number"></el-input>
                </el-form-item>
                <el-form-item label="严格数量" prop="number">
                    <el-input v-model="desab3.astrict"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3('ruleForm3')">确定</el-button>
                <el-button @click="resetForm('ruleForm3')">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
    name: 'baseform',
    data() {
        return {
            loading:false,
            dragOptions: {
                animation: 120,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            num:1,
            num2:0,
            cd:1,
            cd2:0,
            suibian:1,
            suibian2:0,
            //第一层数据
            classAll: [],
            classAll_:[
                {
                    id: 1,
                    content: '开发图表组件'
                },
                {
                    id: 2,
                    content: '开发拖拽组件'
                },
                {
                    id: 3,
                    content: '开发权限测试组件'
                },
                {
                    id: 4,
                    content: '开发图1111'
                },
                {
                    id: 5,
                    content: '开发拖2222'
                },
                {
                    id: 6,
                    content: '开发权限3333'
                }
            ],
            allDetail:[],
            allDetailIndex:0,
            //第二层数据
            classDetail: '',
            //第三层数据
            classTable: '',
            //折叠面板
            activeName: '1',
            dianData: 0,
            dianData2: 0,
            // 第一层编辑
            dialogVisible: false,
            type: '',
            add: {},
            desab: {},
            rules: {
                classification: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            // 第二层编辑
            dialogVisible2: false,
            type2: '',
            add2: {},
            desab2: {},
            rules2: {
                details: [{ required: true, message: '请输入内容名称', trigger: 'blur' }]
            },
            // 第三层编辑
            dialogVisible3: false,
            type3: '',
            add3: {},
            desab3: {},
            rules3: {
                choose: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                max: [{ required: true, message: '请输入最大值', trigger: 'blur' }],
                min: [{ required: true, message: '请输入最小值', trigger: 'blur' }],
                price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
                compatibili: [{ required: true, message: '请输入兼容性', trigger: 'blur' }],
                number: [{ required: true, message: '请输入默认值', trigger: 'blur' }],
                astrict: [{ required: true, message: '请输入默认数量', trigger: 'blur' }]
            },
            dragIndex:null
        };
    },
    components: {
        draggable
    },
    mounted() {},
    created() {
        this.findClass();
        this.findDetail();
        this.findTable();
    },
    methods: {
        selectClass(index){
            this.allDetailIndex=index
            this.dianData = index
        },
        dragstart(index) {
            this.dragIndex = index;
        },
        dragend(index){
            this.dragIndex = index;
            this.allDetailIndex=index
            this.dianData = index
        },
        dragenter(e,index){
            let list=JSON.parse(JSON.stringify(this.classAll))
            if (this.dragIndex !== index) {
                const moving = list[this.dragIndex];
                list.splice(this.dragIndex, 1);
                list.splice(index, 0, moving);
            }
        },
        removeHandle(event) {
           
            this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
        },
        preText(pretext) {
            return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        },
        // 切换
        tab(i) {
            if (i == '1') {
                this.findClass();
            } else if (i == '2') {
                this.findDetail();
            } else if (i == '3') {
                this.findDetail();
                this.findTable();
            }
        },
        tabClick(i) {
            this.dianData = i.index;
        },
        tabClick2(i) {
            this.dianData2 = i.index;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        resetForm(formName) {
            this.dialogVisible = false;
            this.dialogVisible2 = false;
            this.dialogVisible3 = false;
            this.$refs[formName].resetFields();
        },
        // 修改
        handleEdit(index, row, type) {
            this.dialogVisible = true;
            this.type = type;
            this.desab = {};
            let a = JSON.stringify(row);
            this.desab = JSON.parse(a);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.type == 'edit' ? this.editUserInfo() : this.Add();
                } else {
                    return false;
                }
            });
        },
        //修改接口
        async editUserInfo() {
            await this.$axios
                .put('/classificationtable/update', {
                    fid: this.desab.fid,
                    comm_id: this.desab.comm_id,
                    classification: this.desab.classification
                })
                .then(() => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.findClass();
                    this.dialogVisible = false;
                });
        },
        // 添加
        handleAdd(index, row, type) {
            if (row.classification == '' || !row.classification) {
                this.$message({
                    type: 'error',
                    message: '请填写名字后完成以下操作'
                });
                return;
            }
            this.dialogVisible = true;
            this.type = type;
            this.add = row;
            this.desab = {};
        },
        async Add() {
            await this.$axios
                .post('/classificationtable/add', {
                    comm_id: this.add.comm_id,
                    classification: this.desab.classification
                })
                .then(() => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.findClass();
                    this.dialogVisible = false;
                });
        },
        // 删除
        async handleDel(index, row) {
            if (this.classAll[index].classificationtabless.length == 1) {
                this.$message({
                    type: 'error',
                    message: '此为最后一条，请前往产品页面删除'
                });
                return;
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios.delete(`/classificationtable/delete?fid=${row.fid}`).then(() => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.findClass();
                        this.dialogVisible = false;
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },

        // 内容

        // 修改
        handleEdit2(index, row, type) {
            this.dialogVisible2 = true;
            this.type2 = type;
            this.desab2 = {};
            let a = JSON.stringify(row);
            this.desab2 = JSON.parse(a);
        },
        submitForm2(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.type2 == 'edit' ? this.editUserInfo2() : this.Add2();
                } else {
                    return false;
                }
            });
        },
        //修改接口
        async editUserInfo2() {
            await this.$axios
                .put('/Detailstable/update', {
                    nid: this.desab2.nid,
                    co_id: this.desab2.co_id,
                    classes_id: this.desab2.classes_id,
                    details: this.desab2.details
                })
                .then(() => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.findDetail();
                    this.dialogVisible2 = false;
                });
        },
        // 添加
        handleAdd2(index, row, type) {
            if (row.details == '' || !row.details) {
                this.$message({
                    type: 'error',
                    message: '请填写名字后完成以下操作'
                });
                return;
            }
            this.dialogVisible2 = true;
            this.type2 = type;
            this.add2 = row;
            this.desab2 = {};
        },
        async Add2() {
            await this.$axios
                .post('/Detailstable/add', {
                    co_id: this.add2.co_id,
                    classes_id: this.add2.classes_id,
                    details: this.desab2.details
                })
                .then(() => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.findDetail();
                    this.dialogVisible2 = false;
                });
        },
        // 删除
        async handleDel2(index, row) {
            if (this.classDetail[index].detailss.length == 1) {
                this.$message({
                    type: 'error',
                    message: '此为最后一条，请前往分类删除'
                });
                return;
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios.post(`/Detailstable/delete?nid=${row.nid}`).then(() => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.findDetail();
                        this.dialogVisible2 = false;
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },

        // 详细信息添加
        // 修改
        handleEdit3(index, row, type) {
            this.dialogVisible3 = true;
            this.type3 = type;
            this.desab3 = {};
            let a = JSON.stringify(row);
            this.desab3 = JSON.parse(a);
        },
        submitForm3(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.type3 == 'edit' ? this.editUserInfo3() : this.Add3();
                } else {
                    return false;
                }
            });
        },
        //修改接口
        async editUserInfo3() {
            if (Number(this.desab3.max) < Number(this.desab3.min)) {
                this.$message({
                    type: 'error',
                    message: '最大值不能小于最小值'
                });
                return;
            }
            if (Number(this.desab3.number) > Number(this.desab3.max) || Number(this.desab3.number) < Number(this.desab3.min)) {
                this.$message({
                    type: 'error',
                    message: '默认值必须在最大值最小值区间内'
                });
                return;
            }
            await this.$axios
                .put('/AllTable/update', {
                    ...this.desab3
                    // choose: this.desab3.choose,
                    // max: this.desab3.max,
                    // min: this.desab3.min,
                    // price: this.desab3.price,
                    // compatibili: this.desab3.compatibili,
                })
                .then(() => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.findTable();
                    this.dialogVisible3 = false;
                });
        },
        // 添加
        handleAdd3(index, row, type) {
            if (row.choose == '' || !row.choose) {
                this.$message({
                    type: 'error',
                    message: '请填写名字后完成以下操作'
                });
                return;
            }
            this.dialogVisible3 = true;
            this.type3 = type;
            this.add3 = row;
            this.desab3 = {};
        },
        async Add3() {
            if (Number(this.desab3.max) < Number(this.desab3.min)) {
                this.$message({
                    type: 'error',
                    message: '最大值不能小于最小值'
                });
                return;
            }
            if (Number(this.desab3.number) > Number(this.desab3.max) || Number(this.desab3.number) < Number(this.desab3.min)) {
                this.$message({
                    type: 'error',
                    message: '默认值必须在最大值最小值区间内'
                });
                return;
            }
            await this.$axios
                .post('/AllTable/addAllTable', {
                    class_id: this.add3.class_id,
                    deta_id: this.add3.deta_id,
                    commod_id: this.add3.commod_id,
                    choose: this.desab3.choose,
                    max: this.desab3.max,
                    min: this.desab3.min,
                    price: this.desab3.price,
                    compatibili: this.desab3.compatibili,
                    number: this.desab3.number,
                    astrict: this.desab3.astrict,
                    ...this.desab3
                })
                .then(() => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.findTable();
                    this.dialogVisible3 = false;
                });
        },
        // 删除
        async handleDel3(index, row) {
            if (this.classTable[index].allTabless.length == 1) {
                this.$message({
                    type: 'error',
                    message: '此为最后一条，请前往内容删除'
                });
                return;
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios.post(`/AllTable/delete?xid=${row.xid}`).then(() => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.findTable();
                        this.dialogVisible3 = false;
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },

        //编辑侧边栏

        //添加接口  删除
        // async editUserInfoOn(addOn) {
        //     await this.$axios
        //         .post('commodity/deleteCommodity', {
        //             chooseaname: this.addOn.chooseaname,
        //             max: this.addOn.max,
        //             min: this.addOn.min,
        //             price: this.addOn.price,
        //             explanatory: this.addOn.explanatory,
        //             categoryid: this.addOn.categoryid,
        //             contentid: this.addOn.contentid
        //         })
        //         .then(() => {
        //             this.$message({
        //                 message: '添加成功',
        //                 type: 'success'
        //             });
        //             this.open2();
        //             this.dialogVisibleOn = false;
        //         });
        // },

        //添加第二层  删除
        // async editUserInfoOnTwo(addOnTwo) {
        //     await this.$axios
        //         .post('content/addContent', {
        //             content: this.addOnTwo.contentss,
        //             categoryId: this.addOnTwo.categoryid
        //         })
        //         .then(() => {
        //             this.$message({
        //                 message: '添加成功',
        //                 type: 'success'
        //             });
        //             this.open2();
        //             this.dialogVisibleOnTwo = false;
        //         });
        // },
        //添加侧边栏按钮

        //删除
        // handle(row) {
        //     this.dialogVisi = true;
        //     this.addtwo = row;
        // },

        //删除
        // editDialogClosed() {
        //     this.$refs.desab.resetFields();
        // },

        //修改  删除
        // handleEdit(index, row) {
        //     this.dialogVisible = true;
        //     this.desab = row;
        // },
        //添加第二层  删除
        // handleOnTwo(index, row) {
        //     this.dialogVisibleOnTwo = true;
        //     this.addOnTwo = row;
        // },

        // 删除前提示
        // async removeuserById(row) {
        //     this.$confirm('此操作将永久删除', '提示', {
        //         confirmButtonText: '确定',
        //         canelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         const id = row.id;
        //         this.$axios.get('/category2488hv6/delf2488hv6/?id=' + id).then(() => {
        //             this.$message({
        //                 type: 'success',
        //                 message: '删除成功'
        //             });
        //             this.open2();
        //         });
        //     });
        // },
        // 处理数据 渲染table表单 删除

        // hhh(tab, event) {
        //     this.tableData = [];
        //     this.tabIndex = tab.index;
        //     var res = this.tabdata.alltableings[this.tabIndex];
        //     this.tableData.push({
        //         contentss: res.details,
        //         chooseaname: res.choose,
        //         min: res.min,
        //         max: res.max,
        //         price: res.price
        //     });
        // },

        // 获取数据接口
        //总接口
        async open2() {
            const { data: res } = await this.$axios.post('/commodity/findAllCommodity');
            this.tabdata = res[0];
        },
        //第一层
        async findClass() {
            this.loading=true
            await this.$axios.get('/classificationtable/findAll').then((res) => {
                this.classAll = res.data;
                this.loading=false
            });
        },
        //第二层
        async findDetail() {
            this.loading=true
            await this.$axios.get('/Detailstable/findAll').then((res) => {
                this.classDetail = [];
                res.data.forEach((item) => {
                    if (this.classAll[this.dianData].sid == item.comm_id) {
                        this.classDetail.push(item);
                    }
                });
                this.loading=false
            });
        },
        //第三层
        async findTable() {
            this.loading=true
            await this.$axios.get('/AllTable/findAllAllTable').then((res) => {
                // this.classTable = res.data;
                this.classTable = [];
                res.data.forEach((item) => {
                    if (this.classDetail.length !== 0) {
                        if (
                            this.classDetail[this.dianData2].fid == item.classes_id &&
                            this.classDetail[this.dianData2].comm_id == item.co_id
                        ) {
                            this.classTable.push(item);
                        }
                    }
                    this.loading=false
                });
            });
        }
        //点击添加
        // handleadd() {
        //     alert(123);
        // }
    }
};
</script>
<style scoped lang="less">
.el-descriptions {
    width: 100%;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
/* 标签分类 */
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
/* 分类标签 */

.list-wrap{
    display: flex;
    .wrap-left{
        width: 20%;
        background-color: #f1f1f1;
        border: 1px solid #f1f1f1;
        .drag-list{
            width: 100%;
            height: 50px;
            line-height: 50px;
            cursor: pointer;
            padding-left: 20px;
            &.active{
                background-color: #fff;
            }
        }
        .drag-list:hover {
            background-color: #fff;
        }
    }
    .wrap-right{
        width: 80%;
    }
}
</style>
