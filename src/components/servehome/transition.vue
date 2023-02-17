<template>
    <div class="transition">
        <div class="table-head table f-row">
            <div class="left">{{  name}}</div>
            <div class="right">操作</div>
        </div>
        <draggable v-model="allData.classificationtabless"  :options="dragOptions"   >
            <transition-group tag="div" id="todo">
                <div v-for="(item,index) in allData.classificationtabless" 
                @click="selectClass(index)"
                :class="['drag-list',{'active':allDetailIndex==index},'f-row','table']"
                :key="item.fid" 
                @dragend="dragend(index)"
                @dragstart="dragstart(index)" 
                @dragenter="dragenter($event, index)"
                @dragover.prevent
                >
                    <div class="left">{{ item.classification }}</div>
                    <div class="right">
                        <el-button size="mini" @click="handleEdit2(index, item, 'edit')" round>编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDel2(index, item)" round
                            >删除</el-button
                        >
                        <el-button size="mini" type="success" @click="handleAdd2(index, item, 'add')" round
                            >增加</el-button
                        >
                    </div>

                </div>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
   data(){
        return {
            dragOptions: {
                animation: 120,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            allDetailIndex:0,
            classAll:{}
        }
    },
    props:{
        allData:{
            default:()=>{
                return {}
            }
        },
        name:{
            type:String
        }
    },
    components: {
        draggable
    },
    watch:{
        allData:{
            handler(val) {
                this.classAll=val
			},
			deep: true,
			immediate: true
        }
    },
    created(){
    },
    computed:{},
    methods:{
        handleEdit2(){},
        handleDel2(){},
        handleAdd2(){},
        selectClass(index){
            this.allDetailIndex=index
        },
        dragstart(index) {
            this.dragIndex = index;
        },
        dragend(index){
            this.dragIndex = index;
            this.allDetailIndex=index
        },
        dragenter(e,index){
         
            let list=JSON.parse(JSON.stringify(this.allData.classificationtabless))
            if (this.dragIndex !== index) {
                const moving = list[this.dragIndex];
                list.splice(this.dragIndex, 1);
                list.splice(index, 0, moving);
                console.log(1111,list)
            }
        },
    },
}
</script>
<style lang="less" scoped>
.transition{
            .table{
                height: 50px;
                padding: 0 20px;
                .left{
                    width: 50%;
                }
                .right{
                    width: 50%;
                }
            }
    }
</style>