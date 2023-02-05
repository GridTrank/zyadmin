<template>
    <div class="brand-wrap">

        <div class="page-con-wrap">
            <div class="btn-wrap">
                <el-button type="primary" @click="addMenu">添加品牌</el-button>
            </div>
            <div class="block">
                <el-tree :data="brandsList"  node-key="id" default-expand-all :props="defaultProp"
                    :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ data.brandName }}</span>
                        <span style="margin-left:20px">
                            <el-button type="primary" @click="() => append(data)">
                                添加子品牌
                            </el-button>
                            <el-button type="primary"  @click="() => edit(data)">
                                编辑
                            </el-button>
                            <el-button type="danger"  @click="() => remove(data)">
                                删除
                            </el-button>
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <el-dialog :title="title" @close="dialogVisible = false" width="30%" :visible="dialogVisible">
            <el-form :model="formData">
                <el-form-item label="父级品牌:" v-if="formData.pId">
                    <span>{{ formData.pName }}</span>
                </el-form-item>
                <el-form-item label="品牌名称:">
                    <el-input style="width:200px" v-model="formData.brandName"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {},
            title: '添加子菜单',
            expands: [],
            tableData: [],
            dialogVisible: false,
            dialogType: 'add',
            loading: false,
            brandsList: [],
            defaultProp: {
                children: 'brands',
                label: 'brandName'
            }
        }
    },
    created() {
        this.getList()
    },
    watch:{
        dialogVisible(val){
            if(!val){
                this.formData={}
            }
        }
    },
    computed: {},
    methods: {
        getList() {
            this.$axios
                .get('/commodity/brand/list', {})
                .then((res) => {
                    this.brandsList = res.data.data;
                    console.log(11111, this.brandsList)
                });
        },
        append( data) {
            this.title = '添加子品牌'
            this.formData.pId = data.id
            this.formData.pName = data.brandName
            this.dialogType = 'new'
            this.dialogVisible = true
        },
        edit(data) {
            this.formData = {
                pId: data.parent,
                pName: data.brandName,
                ...data
            }
            this.dialogType = 'edit'
            this.dialogVisible = true
        },
        remove(data) {
            this.$confirm('是否确认删除此品牌?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios
                .post('/commodity/brand/delete', { id:data.id})
                .then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getList()
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addMenu() {
            this.title = '添加新品牌'
            this.dialogType = 'add'
            this.dialogVisible = true
        },
        submit() {
            let url = (this.dialogType == 'add' || this.dialogType == 'new') ? '/commodity/brand/add' : '/commodity/brand/update'
            let data = {
                brandName: this.formData.brandName,
            }
            if (this.dialogType == 'new') {
                data.parent = this.formData.pId
            } else if (this.dialogType == 'edit') {
                data.id = this.formData.id
            }
            this.$axios
                .post(url, { ...data })
                .then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: this.dialogType == 'edit'?'编辑成功':'添加成功',
                            type: 'success'
                        });
                        this.dialogVisible = false
                        this.getList()
                    }
                });
        }
    },
}
</script>
<style lang="less" scoped>
.brand-wrap {
    background-color: #fff;
    padding: 20px;

    .block {
        margin-top: 20px;
    }
    /deep/ .el-tree-node{
        margin-top: 10px;
    }
}
</style>