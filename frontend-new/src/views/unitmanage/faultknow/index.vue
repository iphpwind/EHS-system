<template>
  <div class="faultknow">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <div class="head-container tree">
            <h4>区域设备导航</h4>
            <el-input
                v-model="sectionName"
                placeholder="请输入名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container tree down-tree " >
            <el-tree
                :data="sectionOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="TreeRef"
                default-expand-all
                @node-click="handleNodeClick"
            />
          </div>
        </el-col>

        <el-col :span="20" style="border-left: 1px solid #f0f0f0;padding: 0">
          <div class="right-card">
            <el-tabs type="card">
              <el-tab-pane label="设备故障字典" class="sadf">
                <component :is="type"></component>
              </el-tab-pane>
              <el-tab-pane label="故障诊断字典" class="sadf">
                <component :is="type1"></component>
              </el-tab-pane>
              <el-tab-pane label="维修方法字典" class="sadf">
                <component :is="type2"></component>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
import troubleshooting from '@/views/repair/troubleshooting';
import faulttype from '@/views/repair/faulttype';
import repairmethod from '@/views/unitmanage/repairmethod';
import {listEqClass, listFaulttype} from "@/api/unitmanage/faulttype";
import {listTroubleshooting} from "@/api/unitmanage/troubleshooting";
import {listRepairmethod} from "@/api/unitmanage/repairmethod";
export default {
  name: "dic",
  components: {troubleshooting, faulttype,repairmethod},
  data() {
    return {
      type: 'faulttype',
      type1:'troubleshooting',
      type2:'repairmethod',
      sectionOptions: [],
      selectList:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      sectionName:'',
      classList:[],
      faulttypeList:[],
      trobleList:[],
      methodList:[],
    }
  },
  created() {

  },
  mounted() {
    this.getTreeselect();
  },
  watch: {
    sectionName(val) {
      this.$refs.TreeRef.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
/*    getclass(){
      listEqClass().then(res => {
        this.classList = res.data;
        this.getfault();
      })
    },
    getfault(){
      listFaulttype().then(response => {
        this.faulttypeList = response.rows;

      })
    },
    gettroble(){
      listTroubleshooting().then(re => {
        this.trobleList = re.rows;
      })
    },
    getmethod(){
      listRepairmethod().then(resp => {
        this.methodList = resp.rows;
      })
    },*/
    async getallInfo(){
      await listEqClass().then(res => {
        this.classList = res.data;
      })

      await listFaulttype().then(response => {
        this.faulttypeList = response.rows;
      })

      await listTroubleshooting().then(re => {
        this.trobleList = re.rows;
      })

      await listRepairmethod().then(resp => {
        this.methodList = resp.rows;
      })
      return this.classList
    },
    /** 查询组织下拉树结构 */
    async getTreeselect() {
     let list = await this.getallInfo();
      const finalFileTree = [];
      if(this.classList.length>0){
        this.classList.forEach((j, index) => {
          const curPar = { // 阶段层的数据
            label: j.name,
            children: []
          }
          if(this.faulttypeList.length>0){
            this.faulttypeList.forEach((i, index1) => {
              const curObj = { // 阶段下的任务段的数据
                label: i.fault,
                children: []
              }
              if(this.trobleList.length>0){
                this.trobleList.forEach((h, index2) => {
                  const finalChild = { // cur保存阶段下的任务段的子文件数据
                    label: h.troubleshooting,
                    children: []
                  }
                  if(this.methodList.length>0){
                    this.methodList.forEach((m, index3) => {
                      const fiChild = { // cur保存阶段下的任务段的子文件数据
                        label: m.method,
                        children:[]
                      }
                      if(m.troubleId == h.id){
                        finalChild.children.push(fiChild);
                      }
                    })
                  }
                  if(i.id == h.faultId){
                    curObj.children.push(finalChild);
                  }
                })
              }
              if(j.id == i.classId){
                curPar.children.push(curObj);
                console.log(curPar);
              }
            })
          }
          finalFileTree.push(curPar);
        })
      }
      this.sectionOptions = finalFileTree // 已建立好的树的数据
    },
  }
}
</script>

<style scoped lang="scss">
.faultknow{
  padding: 15px;
  .right-card{
    padding:15px;
    :deep(.el-tabs__item.is-active) {
      color:#09bec5 ;
    }

  }
}
.down-tree{
  height:calc(100vh - 260px);
  overflow-y:scroll;
}
.down-tree::-webkit-scrollbar {display:none}

//.sadf{
//  height: calc(100vh - 84px);
//}

/*1366屏幕响应*/
@media screen and (max-width: 1366px) {
  .faultknow{
    height: auto;

  }
}
</style>
