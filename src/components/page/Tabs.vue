<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 产品系列添加表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 信息展示 -->
            <div>
                <el-col :span="5" v-for="item in findAll" :key="item.id">
                    <el-card :body-style="{ padding: '20px' }">
                        <img :src="item.picture" class="image" />
                        <div style="padding: 14px">
                            <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                                <span class="text2">{{ item.name }}</span>
                            </el-tooltip>

                            <div class="bottom clearfix">
                                <!-- <time class="time text2">{{ item.introduce }}</time> -->
                                <el-tooltip class="item" effect="dark" :content="item.introduce" placement="top-start">
                                    <span class="text2 time">{{ item.introduce }}</span>
                                </el-tooltip>
                                <el-button type="text" class="button" @click="Dbug(item)">修改</el-button>
                                <el-button type="text" class="button" @click="dell(item.sid)">删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </div>
            <!-- 信息展示 -->
            <!-- 添加主类 -->
            <div>
                <el-button type="button" @click="dialogVisible = true">添加主类</el-button>
                <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
                    <!-- 上传图片 -->
                    <el-upload
                        class="avatar-uploader"
                        :action="action"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload
                    ><br />
                    <!-- 上传图片 -->
                    <el-input placeholder="请输入主类名称" v-model="className" clearable> </el-input><br /><br />
                    <el-input placeholder="请输入主类简略信息" v-model="classDetail" clearable> </el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialog">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <!-- 修改主类 -->
            <el-dialog title="修改信息" :visible.sync="dialogVisibleDbug" width="30%" :before-close="handleClose">
                <!-- 图片 -->
                <el-upload
                    class="avatar-uploader"
                    :action="action"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess2"
                    :before-upload="beforeAvatarUpload2"
                >
                    <img v-if="Bug.picture" :src="Bug.picture" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload
                ><br />
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
                <el-input v-model="Bug.name" clearable> </el-input><br /><br />
                <el-input v-model="Bug.introduce" clearable> </el-input><br /><br />
                <!-- 图片 -->
                <el-button @click="dialogVisibleDbug = false">取 消</el-button>
                <el-button type="primary" @click="Ebug">确 定</el-button>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    data() {
        return {
            action: this.$axios.defaults.baseURL + '/upload',
            imageUrl: '',
            dialogVisible: false,
            dialogVisibleDbug: false,
            currentDate: new Date(),
            findAll: '',
            //主类
            className: '',
            //简略信息
            classDetail: '',
            dialogImageUrl: '',
            dialogVisible: false,
            Bug: ''
        };
    },
    mounted() {
        this.findBll();
    },
    methods: {
        //增
        async dialog() {
            if (this.className == '') {
                this.$message.error('请填写主类名称');
                return;
            }
            if (this.classDetail == '') {
                this.$message.error('请填写主类简略信息');
                return;
            }
            if (this.imageUrl == '') {
                this.$message.error('请上传图片');
                return;
            }
            await this.$axios
                .post('/Commoditys/addCommoditys', {
                    name: this.className,
                    introduce: this.classDetail,
                    picture: this.imageUrl
                })
                .then(() => {
                    this.dialogVisible = false;
                    this.className = '';
                    this.classDetail = '';
                    this.imageUrl = '';
                    this.findBll();
                });
        },
        //删
        async dell(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios.get(`/Commoditys/deleteCommoditys?sid=${id}`).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.findBll();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        //改
        async Ebug() {
            if (this.Bug.name == '') {
                this.$message.error('请填写主类名称');
                return;
            }
            if (this.Bug.introduce == '') {
                this.$message.error('请填写主类简略信息');
                return;
            }
            if (this.Bug.picture == '') {
                this.$message.error('请上传图片');
                return;
            }
            await this.$axios
                .put('/Commoditys/updateCommoditys', {
                    sid: this.Bug.sid,
                    name: this.Bug.name,
                    introduce: this.Bug.introduce,
                    picture: this.Bug.picture
                })
                .then(() => {
                    this.dialogVisibleDbug = false;
                });
        },
        async Dbug(id) {
            this.dialogVisibleDbug = true;
            this.Bug = id;
        },
        //获取大类内容
        async findBll() {
            await this.$axios.get('/Commoditys/findAllCommoditys').then((res) => {
                this.findAll = res.data;
            });
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        //图片新增上传
        handleAvatarSuccess(res, file) {
            this.imageUrl = res['地址'];
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            // if (!isLt2M) {
            //     this.$message.error('上传图片大小不能超过 2MB!');
            // }
            return isJPG;
        },
        handleAvatarSuccess2(res, file) {
            this.Bug.picture = res['地址'];
        },
        beforeAvatarUpload2(file) {
            const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            // if (!isLt2M) {
            //     this.$message.error('上传图片大小不能超过 2MB!');
            // }
            return isJPG;
        }
    }
    //图片上传
};
</script>

<style>
.text2 {
    cursor: pointer;
    white-space: nowrap;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 0.9;
}
/* 大类展示 */
.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    height: 120px;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}

.clearfix:after {
    clear: both;
}
/* 大类展示 */
/* upload */
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 100%;
    height: 178px;
    display: block;
}
/* upload */
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
</style>
