<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 首页图片添加表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 信息展示 -->
            <div>
                <el-col :span="5" v-for="item in findAll" :key="item.id">
                    <el-card :body-style="{ padding: '20px' }">
                        <img :src="item.path" class="image" />
                        <div style="padding: 14px">
                            <!-- <span>{{ item.name }}</span> -->
                            <div class="bottom clearfix">
                                <!-- <time class="time">{{ item.introduce }}</time> -->
                                <el-button type="text" class="button" @click="Dbug(item)">修改</el-button>
                                <el-button type="text" class="button" @click="dell(item.id)">删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </div>
            <!-- 信息展示 -->
            <!-- 添加主类 -->
            <div>
                <el-button type="button" @click="addA">添加图片</el-button>
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
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible2">取 消</el-button>
                        <el-button type="primary" @click="dialog">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    data() {
        return {
            action:this.$axios.defaults.baseURL + '/uploads',
            imageUrl: '',
            dialogVisible: false,
            dialogVisibleDbug: false,
            currentDate: new Date(),
            findAll: '',
            type:"add",
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
        addA(){
            this.type="add"
            this.dialogVisible = true;
        },
        //增
        async dialog() {
            
            if (this.imageUrl=='') {
                this.$message.error("请上传图片")
                return
            }
            if (this.type=='add') {
                await this.$axios
                .post('Uploads/addUploads', {
                    path:this.imageUrl
                })
                .then(() => {
                    this.dialogVisible = false;
                    this.imageUrl=''
                    this.findBll();
                });
            }else if(this.type=="edit"){
                this.Ebug()
            }
            
        },
        //删
        async dell(id) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // 二次确认删除
                this.$axios.get(`/Uploads/deleteUploads?id=${id}`).then(() => {
                this.findBll();
            }).catch(() => {});
            });
        },
        //改
        async Ebug() {
            await this.$axios
                .put('/Uploads/updateUploads', {
                    id:this.Bug.id,
                    path:this.imageUrl
                })
                .then(() => {
                    this.dialogVisible = false;
                    this.imageUrl=''
                    this.findBll();
                });
        },
        async Dbug(id) {
            this.type="edit"
            this.dialogVisible = true;
            this.Bug = id;
            this.imageUrl = id.path;
        },
        dialogVisible2(){
            this.imageUrl=""
            this.dialogVisible = false;
            this.Bug={}
        },
        //查询
        async findBll() {
            await this.$axios.get('/Uploads/findAllUploads').then((res) => {
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
            console.log(res);
            this.imageUrl = res['地址']
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
    }
    //图片上传
};
</script>

<style>
.image{
    width: 100%;
    height: 178px;
}
.avatar {
    width: 100%;
    height: 178px;
    display: block;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
</style>
