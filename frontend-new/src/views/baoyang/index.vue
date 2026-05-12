<template>
  <div class="baoyangplan">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <div class="head-container tree">
            <h4>区域设备导航</h4>
            <el-input
                v-model="sectionName"
                placeholder="请输入组织名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container tree down-tree">
            <el-tree
                :data="sectionOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="sectionTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
            />
          </div>
        </el-col>

        <el-col :span="19" style="border-left: 1px solid #f0f0f0;padding: 0">
          <div class="tools">
            <el-form :model="queryParams">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="设备名称" prop="eqId">
                    <el-select v-model="queryParams.eqId" placeholder="请选择设备" clearable>
                      <el-option
                          v-for="item in optionseq"
                          :key="item.eqId"
                          :label="item.eqName"
                          :value="item.eqId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="保养类型">
                  <el-select v-model="queryParams.maintenanceType" placeholder="请选择">
                    <el-option label="周期保养" value="0" />
                    <el-option label="指定时间保养" value="1" />
                  </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="保养状态">
                    <el-select v-model="queryParams.status" placeholder="请选择">
                      <el-option label="有效" value="0" />
                      <el-option label="无效" value="1" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button class="btn" @click="search">查询</el-button>
                  <el-button class="btn" @click="add">新增</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <!-- 新增弹出 -->

          <!-- 新建弹出 -->
          <div class="addtanchu">
            <el-dialog
                v-model="dialogVisible"
                title="保养计划"
                width="60%"
            >
              <el-form :model="addform" :rules="rules" ref="addform" label-width="100px">
                <el-row>
                  <el-input v-model="addform.classId" placeholder="请输入" v-if="false"/>
                  <el-input v-model="addform.sectionId" placeholder="请输入" v-if="false"/>
                  <el-input v-model="addform.maintenanceId" placeholder="请输入" v-if="false"/>
                  <el-col :span="12">
                    <el-form-item label="保养设备" prop="eqId">
                      <el-select v-model="addform.eqId" placeholder="请选择设备" clearable @change="updatePatsandShare" filterable>
                        <el-option
                            v-for="item in optionseq"
                            :key="item.eqId"
                            :label="item.eqName"
                            :value="item.eqId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保养类型">
                      <el-radio-group v-model="addform.maintenanceType" @change="handleTim">
                        <el-radio label="0">周期保养</el-radio>
                        <el-radio label="1">指定时间保养</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="addform.maintenanceType=='0'">
                    <el-form-item label="保养时间" prop="maintenanceCycle">
                      <el-input type="number" min="1" v-model="addform.maintenanceCycle" placeholder="请输入"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="addform.maintenanceType=='1'">
                    <el-form-item label="保养时间" prop="maintenanceTime">
                      <el-date-picker value-format="YYYY-MM-DD HH:mm:ss"
                                      v-model="addform.maintenanceTime"
                                      type="datetime"
                                      placeholder="选择时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="addform.maintenanceType=='0'">
                    <el-form-item label="单位" prop="unit">
                      <el-select v-model="addform.unit" placeholder="请选择">
                        <el-option label="月" value="0" />
                        <el-option label="日" value="1" />
                        <el-option label="小时" value="2" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="保养内容">
                      <el-input v-model="addform.maintenanceContent" type="textarea" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保养操作人" prop="maintenanceOperator">
                      <el-select v-model="addform.maintenanceOperator" multiple placeholder="请选择(多选)" @click="getUserList" filterable>
                        <el-option
                            v-for="item in options"
                            :key="item.userId"
                            :label="item.nickName"
                            :value="item.userId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保养确认人" prop="maintenanceConfirmer">
                      <el-select v-model="addform.maintenanceConfirmer" placeholder="请选择(单选)" filterable>
                        <el-option
                            v-for="item in options"
                            :key="item.userId"
                            :label="item.nickName"
                            :value="item.userId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="提前提醒时间(天)" prop="tsNum" label-width="120">
                      <el-input type="number" min="1" v-model="addform.tsNum" placeholder="请输入"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="超期时间(天)" prop="cqNum" label-width="120">
                      <el-input type="number" min="1" v-model="addform.cqNum" placeholder="超过指定保养时间几天算超期"/>
                    </el-form-item>
                  </el-col>
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="单位" prop="tsType">-->
<!--                      <el-select v-model="addform.tsType" placeholder="请选择">-->
<!--                        <el-option label="日" value="1" />-->
<!--                        <el-option label="小时" value="2" />-->
<!--                      </el-select>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
                  <el-col :span="24">
                    <el-form-item label="保养部位" class="parts">
                      <el-row>
                        <el-col :span="8">
                          <div class="textcenter">保养部位</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="textcenter">保养步骤</div>
                        </el-col>
                        <el-col :span="8"></el-col>
                      </el-row>
                      <el-row :gutter="10" v-for="(part, index) in addform.maintenancePartList" :key="index">
                        <el-col :span="8">
                          <el-select v-model="part.maintenancePartsId" placeholder="请选择" @change="getparsInfo(index,part.maintenancePartsId)">
                            <el-option
                                v-for="par in partsoptions"
                                :key="par.maintenancePartsId"
                                :label="par.maintenancePartsName"
                                :value="par.maintenancePartsId"
                            />
                          </el-select>
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="part.maintenanceStep" />
                        </el-col>
                        <el-col :span="8">
                          <div class="partremove" @click="partremove(part)">
                            <el-icon><Remove /></el-icon>
                          </div>
                        </el-col>
                      </el-row>
                      <div class="partadd" @click="partadd">
                        <el-icon><CirclePlus /></el-icon> 添加一行
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="使用备件" class="parts">
                      <el-row>
                        <el-col :span="4">
                          <div class="textcenter">备件名称</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="textcenter">规格型号</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="textcenter">单位</div>
                        </el-col>
                        <el-col :span="4">
                          <div class="textcenter">使用数量</div>
                        </el-col>
                        <el-col :span="4"></el-col>
                      </el-row>
                      <el-row :gutter="10" v-for="(attachment, index) in addform.maintenanceSpareList" :key="index">
                        <el-col :span="4">
                          <el-select v-model="attachment.sparePartsId" placeholder="请选择" @change="getShareInfo(index,attachment.sparePartsId)">
                            <el-option
                                v-for="att in shareoptions"
                                :key="att.sparePartsId"
                                :label="att.sparePartsName"
                                :value="att.sparePartsId"
                            />
                          </el-select>
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="attachment.sparePartsSpe" />
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="attachment.sparePartsUnit" />
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="attachment.num" />
                        </el-col>
                        <el-col :span="4">
                          <div class="partremove" @click="attachremove(attachment)">
                            <el-icon><Remove /></el-icon>
                          </div>
                        </el-col>
                      </el-row>
                      <div class="partadd" @click="attachadd">
                        <el-icon><CirclePlus /></el-icon> 添加一行
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="状态">
                      <el-radio-group v-model="addform.status">
                        <el-radio label="0">有效</el-radio>
                        <el-radio label="1">无效</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <template #footer>
								<span class="dialog-footer">
									<el-button @click="dialogVisible = false" class="btn">取消</el-button>
									<el-button @click="save('addform')" class="btn green">保存</el-button
                  >
								</span>
              </template>
            </el-dialog>
          </div>

          <!-- 表格 -->
          <div class="table">
            <div class="header">
              <div class="card-tit">保养计划</div>
            </div>
            <el-table
                :data="tableData"
                stripe="true"
                border
                height="calc(100vh - 310px)"
                style="width: 100%"
                v-loading="loading"
            >
              <el-table-column prop="maintenanceId" label="主键ID" v-if="false"/>
              <el-table-column prop="eqName" label="设备名称"/>
              <el-table-column prop="maintenanceType" label="保养类型">
                <template #default="scope">
                  <el-row justify="center" v-if="scope.row.maintenanceType == 0">周期保养</el-row>
                  <el-row justify="center" v-else>指定时间保养</el-row>
                </template>
              </el-table-column>
              <el-table-column prop="maintenanceContent" label="保养内容" />
              <el-table-column prop="maintenanceOperatorNames" label="保养操作人" />
              <el-table-column prop="maintenance_confirmer_name" label="保养确认人" />
              <el-table-column prop="maintenanceTime" label="计划保养日期" width="150" />
              <el-table-column prop="status" label="状态" >
                <template #default="scope">
                  <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">有效</el-tag></el-row>
                  <el-row justify="center" v-else><el-tag type="danger">无效</el-tag></el-row>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template #default="scope">
                  <el-button link @click="edit(scope.row)" class="btn">无效</el-button>
                  <el-button link @click="record(scope.row)" class="btn green">记录</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 页码 -->

            <div class="pages">
              <pagination
                  v-show="total > 0"
                  :total="total"
                  v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize"
                  @pagination="getList"
              />
            </div>
          </div>

        </el-col>
      </el-row>

    </el-card>
  </div>

</template>

<script>
import { reactive } from 'vue'
import { treeselect } from "@/api/unitmanage/section";
import { listMaintenanceinfo,editSta,addMaintenanceinfo } from "@/api/unitmanage/maintenanceinfo";
import { listDevice } from "@/api/unitmanage/device";
import { editStaWorkorder } from "@/api/unitmanage/workorders";
import { getUserList } from "@/api/system/user";
import { listMaintenanceparts } from "@/api/unitmanage/maintenanceparts";
import { listSpareparts } from "@/api/unitmanage/spareparts";


export default {
  name: "保养计划",
  data() {
    return {
      maintenanceId:'',
      sectionName:'',
      highlightBd: true,
      defaultKey: [],
      sectionOptions:[],
      //status: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {
        eqId: '',
        type: '',
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      rules: {
        maintenanceCycle: [
          { required: true, message: "周期时间不能为空", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "周期时间单位不能为空", trigger: "blur" }
        ],
        maintenanceTime: [
          { required: true, message: "指定保养时间不能为空", trigger: "blur" }
        ],
        eqId: [
          { required: true, message: "设备不能为空", trigger: "change" }
        ],
        maintenanceConfirmer: [
          { required: true, message: "保养确认人不能为空", trigger: "change" }
        ],
        maintenanceOperator: [
          { required: true, message: "保养操作人不能为空", trigger: "change" }
        ],
      },
      value: '',
      options: [],
      optionseq: [],
      tableData: [],
      total: 20,
      dialogVisible: false,
      addform: reactive({
        name: '',
        sectionId: '',
        classId: '',
        maintenanceId: '',
        eqId: '',
        tsNum: '',
        cqNum: 0,
        tsType:'',
        maintenanceTime: '',
        maintenanceType: '0',
        maintenanceContent: '',
        maintenanceOperator: [],
        maintenanceConfirmer: '',
        maintenanceCycle: '',
        maintenancePartsId: '',
        maintenancePartList: [{
          maintenancePartsId: '',
          maintenanceStep: '',
          partsoptions: [],
        }],
        maintenanceSpareList: [{
          sparePartsId: '',
          shareoptions: [],
          sparePartsSpe: '',
          sparePartsUnit: '',
          num: '',
        }],
        status: '0',
      }),
    }
  },
  created() {
    this.getTreeselect();
    this.getList();
    this.getDeviceList();
    //this.getPartsList();
  },
  watch: {
    sectionName(val) {
      this.$refs.sectionTreeRef.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      //this.queryParams.status = data.id;
      this.queryParams.sectionId = data.id;
      this.addform.sectionId = data.id;
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getDeviceList();
      this.getList();
    },
    /** 查询保养计划列表 */
    getList() {
      this.loading = true;
      listMaintenanceinfo(this.queryParams).then(response => {
        this.tableData = response.rows;//table数据
        this.total = response.total;//table总个数
        this.loading = false;
      });
    },
    //获取设备数据
    getDeviceList() {
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.optionseq = response.rows;//list数据
        this.loading = false;
      });
    },
    //获取用户
    getUserList() {
      this.loading = true;
      getUserList().then(response => {
        this.options = response.rows;//list数据
        this.loading = false;
      });
    },
    //获取设备保养部位的数据
    getPartsList(){
      this.loading = true;
      listMaintenanceparts(this.addform).then(response => {
        this.partsoptions = response.rows;//list数据
        this.loading = false;
      });
    },

    //获取使用备件的数据
    getshareList(){
      this.loading = true;
      listSpareparts(this.addform).then(response => {
        this.shareoptions = response.rows;//list数据
        this.loading = false;
      });
    },

    //设备修改选择时触发事件
    updatePatsandShare(val){
      for (const yx of this.optionseq) {
        if(yx.eqId == val){
          this.addform.classId = yx.classId;
        }
      }
      this.getPartsList();
      this.getshareList();
    },

    //保养部位选择时触发事件
    getparsInfo(index,val){
      const obj = this.partsoptions.find(function(item){ return item.maintenancePartsId === val; })
      this.addform.maintenancePartList[index].maintenanceStep=obj.maintenanceStep;
    },

    //使用备件选择时触发事件
    getShareInfo(index,val){
      const obj = this.shareoptions.find(function(item){ return item.sparePartsId === val; })
      this.addform.maintenanceSpareList[index].sparePartsSpe = obj.sparePartsSpe;
      this.addform.maintenanceSpareList[index].sparePartsUnit = obj.sparePartsUnit;
    },

    //编辑保养计划的状态
    editSta(maintenanceId){
      this.loading = true;
      editSta(maintenanceId).then(response => {
        this.$message({
          type: 'success',
          message: `修改成功！`
        });
        this.loading = false;
        this.open = false;
        this.getList();
      });
    },
    //编辑工单的状态
    editStaWorkorder(maintenanceId){
      this.loading = true;
      editStaWorkorder(maintenanceId).then(response => {
        this.$message({
          type: 'success',
          message: `修改成功！`
        });
        this.loading = false;
        this.open = false;
        this.getList();
      });
    },

    search() {
      this.getList();
    },
    add() {
      //this.reset();
      this.dialogVisible = true;
    },
    edit(row) {
      console.log(row.maintenanceId);
      this.$confirm('是否同时作废相关工单?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        center: true
      }).then(() => {
        this.editSta(row.maintenanceId);//更新保养计划状态为无效
        this.editStaWorkorder(row.maintenanceId);//更新工单状态为无效
      }).catch(action => {
        if(action === 'cancel'){
          this.editSta(row.maintenanceId);
        }else{
          this.$message('取消');
        }
      });
    },

    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addMaintenanceinfo(this.addform).then(response => {
            this.$message({
              type: 'success',
              message: `新增成功！`
            });
            this.reset();
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          return false;
        }
      });
    },

    record(row) {
      this.$router.push({
        path: '/baoyang/workorders',
        query:{
          id:row.maintenanceId
        }
      })
    },
    // 表单重置
    reset() {
      this.addform = {
        name: '',
        sectionId: '',
        classId: '',
        maintenanceId: '',
        eqId: '',
        maintenanceTime: '',
        maintenanceType: '0',
        maintenanceContent: '',
        maintenanceOperator: [],
        maintenanceConfirmer: '',
        maintenanceCycle: '',
        maintenancePartsId: '',
        maintenancePartList: [{
          maintenancePartsId: '',
          maintenanceStep: '',
          partsoptions: [],
        }],
        maintenanceSpareList: [{
          sparePartsId: '',
          shareoptions: [],
          sparePartsSpe: '',
          sparePartsUnit: '',
          num: '',
        }],
        status: '0',
      };
    },
    partremove(item) {
      var index = this.addform.maintenancePartList.indexOf(item)
      if (index !== -1) {
        this.addform.maintenancePartList.splice(index, 1)
      }
    },
    partadd() {
      this.addform.maintenancePartList.push({
        position: '',
        step: '',
        key: Date.now()
      });
    },
    attachremove(item) {
      var index = this.addform.maintenanceSpareList.indexOf(item)
      if (index !== -1) {
        this.addform.maintenanceSpareList.splice(index, 1)
      }
    },
    attachadd() {
      this.addform.maintenanceSpareList.push({
        name: '',
        mode: '',
        unit: '',
        num: '',
        key: Date.now()
      });
    },
    /** 查询组织下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.sectionOptions = response.data;
      });
    },
  }
}
</script>

<style scoped lang="scss">
.baoyangplan{
  height: calc(100vh - 84px);padding: 10px;
  background: #f3f3f4;
  :deep(.el-card) {
    height: 100%;
    .el-card__body{height: 100%;}
    .el-row{height: 100%;}
  }
  .tree{
    h4{
      margin: 10px 0 10px;
      color: #333;padding: 0;
      border-bottom: 0;
    }
    :deep(.el-select) {
      .el-input__inner{
        border: 0;border-radius: 0;
      }
    }
    :deep(.el-tree) {
      .customNodeClass{
        border-top: 1px solid #eee;
        .customNodeClass{
          border: 0;
        }
      }
    }
  }
  .header {
    padding: 10px 15px;
    border-bottom: 1px solid #f0f0f0;
    .card-tit {
      padding-left: 10px;
      border-left: 5px solid #09bec5;
      font-size: 18px;
    }
  }
  .info{
    padding: 30px 25px;
    .item{
      font-size: 14px;
      img{
        vertical-align: middle;margin-right: 15px;
      }
      span{
        display: inline-block;
        color: #999;
      }
      i{
        font-style: normal;
      }
    }
  }
  .tools{
    padding: 0 15px;
    border-bottom: 5px solid #eee;
    :deep(.el-form-item__label) {
      font-weight: normal;padding: 0 10px;
    }
    .btn{
      border: 0;background: #09bec5;color:#fff;
    }
  }
  .addtanchu{

    .danwei{
      position: absolute;right: 10px;top: 0;line-height: 32px;
      color: #aaa;
    }
    .textcenter{text-align: center;line-height: 1;}
    .parts{
      :deep(.el-row) {height: auto;margin: 10px 0 0;}
      :deep(.el-form-item__content) {
        display: block;
      }
      .partremove{
        cursor: pointer;
      }
      .partadd{
        color: #09bec5;cursor: pointer;
        :deep(.el-icon) {
          line-height: 1;vertical-align: middle;display: inline-block;
          height: auto;
        }
      }
    }
    .dialog-footer{
      display: block;width: 100%;text-align: center;margin-top: -20px;
      padding: 0 0 20px;
      .btn{
        width: 200px;
      }
      .green{background: #09bec5;color: #fff;border-color: #09bec5;}
    }
    :deep(.el-form) {
      .el-select{
        width: 100%;
      }
    }
    :deep(.el-dialog) {
      overflow: hidden;
      .el-dialog__header{
        box-shadow: 0 5px 10px #eee;
      }
    }
  }
  .table{
    padding: 0 10px;
    height: calc(100% - 200px);position: relative;
    margin: 10px 0 0;
    .header{
      margin: 0 0 10px;
    }

    .btn{
      height: auto;border: 0;padding: 0;color: #09bec5;
    }
    .btn.green{
      color: #46ba7f;
    }

    :deep(.el-table) {

      .el-table__header-wrapper th{
        text-align: center;background: #09bec5 !important;color: #fff;border: 0;
      }
      .sort-caret.ascending{
        border-bottom-color: #fff !important;
      }
      .sort-caret.descending{
        border-top-color: #fff !important;
      }
      td.el-table__cell{text-align: center;border-color: #d2eef1;}
      .el-table__inner-wrapper::before{
        display: none;
      }
      .el-table__row--striped td.el-table__cell{
        background: #f6fcfc !important;
      }
      .el-table__row:hover  td.el-table__cell{
        background: #f6fcfc !important;
      }
    }
    :deep(.el-table--border::after) {
      display: none;
    }
    :deep(.el-table--border::before) {
      display: none;
    }
    .pages{
      position: relative;padding-right: 70px;
      right: 20px;bottom: 10px;
      :deep(.el-pagination) {
        padding: 0;
        .el-pager li{
          outline: none;background: transparent;border: 1px solid #ddd;
        }
        .el-pager li.active{
          background: #09bec5;border-color: #09bec5;font-weight: normal;
        }
      }
      .pagebtn{
        position: absolute;right: 0;top: 0;
      }
    }
  }

}
//1366屏幕响应
@media screen and (max-width: 1366px) {
  .baoyangplan{
    height: auto;

  }
}
</style>
