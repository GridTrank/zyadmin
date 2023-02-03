<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 用户管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.name" placeholder="搜索用户名称" clearable class="handle-input mr10"></el-input>
                <el-select v-model="search.gradevip" placeholder="请选择用户等级" clearable>
                    <el-option v-for="item in alladd" :key="item.vid" :label="item.viplv" :value="item.vid"> </el-option>
                </el-select>
                <el-input v-model="search.companyname" placeholder="搜索公司名称" clearable class="handle-input mr10"></el-input>
                <el-input v-model="search.phone" placeholder="搜索手机号" clearable class="handle-input mr10"></el-input>
                <el-input v-model="search.email" placeholder="搜索邮箱" clearable class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" round style="margin-top:10px">搜索</el-button>
                <download-excel :data="allUser" :fields="json_fields" :header="title" name="会员信息.xls" class="defExcel">
                    <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
                    <el-button type="primary" round>导出Excel</el-button>
                </download-excel>
            </div>
            <el-table
                id="vcfResult"
                :data="allUser"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用户ID:">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="账号名:">
                                <span>{{ props.row.nickname }}</span>
                            </el-form-item>
                            <el-form-item label="注册时间:">
                                <span>{{ props.row.time }}</span>
                            </el-form-item>
                            <el-form-item label="手机号:">
                                <span>{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="邮箱:">
                                <span>{{ props.row.email }}</span>
                            </el-form-item>
                            <el-form-item label="公司名称:">
                                <span>{{ props.row.companyname }}</span>
                            </el-form-item>
                            <el-form-item label="职位:">
                                <span>{{ props.row.position }}</span>
                            </el-form-item>
                            <el-form-item label="来源渠道:">
                                <span>{{ props.row.source }}</span>
                            </el-form-item>
                            <el-form-item label="密码:" v-if="username==2">
                                <span>{{ props.row.password }}</span>
                            </el-form-item>
                            <el-form-item label="会员等级:">
                                <span>{{ props.row.viplv }}</span>
                            </el-form-item>
                            <el-form-item label="折扣:">
                                <span>{{ props.row.discount }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="用户ID" prop="id" align="center"> </el-table-column>
                <el-table-column label="用户姓名" prop="name" align="center"> </el-table-column>
                <el-table-column label="注册时间" prop="time" width="170" align="center" sortable> </el-table-column>
                <el-table-column label="会员等级" prop="viplv" align="center" sortable> </el-table-column>
                <el-table-column label="折扣" prop="discount" align="center" sortable> </el-table-column>
                <el-table-column label="操作" width="500" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除&nbsp;&nbsp;</el-button
                        >

                        <!-- 下拉菜单 -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名称">
                    <el-input v-model="form.name" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="公司名称">
                    <el-input v-model="form.companyname" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="职位">
                    <el-input v-model="form.position" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="来源渠道">
                    <el-input v-model="form.source" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="账户">
                    <el-input v-model="form.nickname" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="密码" v-if="username == 'admin'">
                    <el-input v-model="form.password" :disabled="username!=2"></el-input>
                </el-form-item>
                <el-form-item label="会员">
                    <el-select v-model="form.gradevip" placeholder="请选择会员等级" value-key="vid">
                        <el-option v-for="item in alladd" :key="item.vid" :label="item.viplv" :value="item.vid">
                            <span style="float: left">{{ item.viplv }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.discount }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            alladd: [],
            // 所有数据
            allUser: [],
            allUser2: [],
            //测试
            title: '会员信息',
            json_fields: {
                用户ID: 'id',
                注册日期: 'time',
                用户姓名: 'name',
                手机号: 'phone',
                邮箱: 'email',
                公司名称: 'companyname',
                职位: 'position',
                来源渠道: 'source',
                账户: 'nickname',
                密码: 'password',
                会员等级: 'gradevip'
            },
            //测试
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            search: {
                name: '',
                gradevip: '',
                companyname: ''
            },
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            jx: {
                id: '1',
                phone: '18614983835',
                ly: '百家乐'
            },
            name: 'linxin'
        };
    },

    computed: {
            username() {
            let a = localStorage.getItem('ms_username');
            let username=JSON.parse(a)
            return username.administrator 
        }
        // }
    },
    methods: {
        handleClick() {
            alert('button click');
        },
        //会员总含量
        async findAllVIP() {
            await this.$axios.get('/discount/findAllDiscount').then((res) => {
                this.alladd = res.data;
                this.findAllUser();
            });
        },
        //调取用户信息
        async findAllUser() {
            await this.$axios.get('/registration/findAllUser').then((res) => {
                this.allUser = res.data;
                for (let index = 0; index < this.allUser.length; index++) {
                    const element = res.data[index];
                    // this.allUser.findIndex(j => j.gradevip=== this.alladd[i].vid)
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (element.gradevip == this.alladd[i].vid) {
                            element.discount = this.alladd[i].discount;
                            element.viplv = this.alladd[i].viplv;
                        }
                    }
                }
                this.allUser.forEach(element => {
                    // console.log(element.discount);
                    if (typeof(element.discount)=='undefined') {
                        // console.log('333');
                        element.gradevip=""
                    }
                });
            });
        },
        // 触发搜索按钮
        handleSearch() {
            if (this.search.name != '') {
                this.$axios.get(`/registration/findname?name=${this.search.name}`).then((res) => {
                    this.allUser = res.data;
                for (let index = 0; index < this.allUser.length; index++) {
                    const element = res.data[index];
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (element.gradevip == this.alladd[i].vid) {
                            element.discount = this.alladd[i].discount;
                            element.viplv = this.alladd[i].viplv;
                        }
                    }
                }
                });
            } else if (this.search.gradevip != '') {
                this.$axios.post(`/registration/findvip?gradevip=${this.search.gradevip}`).then((res) => {
                    this.allUser = res.data;
                for (let index = 0; index < this.allUser.length; index++) {
                    const element = res.data[index];
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (element.gradevip == this.alladd[i].vid) {
                            element.discount = this.alladd[i].discount;
                            element.viplv = this.alladd[i].viplv;
                        }
                    }
                }
                });
            } else if (this.search.companyname != '') {
                this.$axios.get(`/registration/findcomp?companyname=${this.search.companyname}`).then((res) => {
                    this.allUser = res.data;
                for (let index = 0; index < this.allUser.length; index++) {
                    const element = res.data[index];
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (element.gradevip == this.alladd[i].vid) {
                            element.discount = this.alladd[i].discount;
                            element.viplv = this.alladd[i].viplv;
                        }
                    }
                }
                });
            }  else if (this.search.phone != '') {
                this.$axios.get(`/registration/findphone?phone=${this.search.phone}`).then((res) => {
                    this.allUser = res.data;
                for (let index = 0; index < this.allUser.length; index++) {
                    const element = res.data[index];
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (element.gradevip == this.alladd[i].vid) {
                            element.discount = this.alladd[i].discount;
                            element.viplv = this.alladd[i].viplv;
                        }
                    }
                }
                });
            } else if (this.search.email != '') {
                this.$axios.get(`/registration/findemail?email=${this.search.email}`).then((res) => {
                    this.allUser = res.data;
                for (let index = 0; index < this.allUser.length; index++) {
                    const element = res.data[index];
                    for (let i = 0; i < this.alladd.length; i++) {
                        if (element.gradevip == this.alladd[i].vid) {
                            element.discount = this.alladd[i].discount;
                            element.viplv = this.alladd[i].viplv;
                        }
                    }
                }
                });
            }else {
                this.findAllVIP();
            }
        },
        // 删除操作
        async handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // 二次确认删除
                this.$axios
                    .get(`/registration/deleteuser?id=${row.id}`)
                    .then(() => {
                        this.findAllUser();
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })
                    .catch(() => {});
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        async saveEdit() {
            await this.$axios
                .put('/registration/updateuser', {
                    ...this.form
                })
                .then(() => {
                    this.findAllUser();
                    this.editVisible = false;
                    this.$message.success(`修改成功`);
                    // this.$set(this.tableData, this.idx, this.form);
                });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    },
    mounted() {
        this.findAllVIP();
        this.findAllUser();
    }
};
</script>

<style scoped>
/* 导出Excel */
.defExcel {
    /* float: right; */
    /* width: 1px; */
    display: inline-block;
    margin-left:10px ;
}
/* 下拉菜单样式 */
.el-dropdown {
    vertical-align: top;
}
.el-dropdown + .el-dropdown {
    margin-left: 15px;
}
.el-icon-arrow-down {
    font-size: 12px;
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
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
