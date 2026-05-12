<template>
  <div class="baoyanggongdan">
    <el-card class="tools">
      <el-form :model="form" label-width="80px">
        <el-row>
          <el-col :span="20">
            <el-row>
              <el-col :span="6">
                <el-form-item label="单元" prop="sectionId">
                  <el-select v-model="form.sectionId" placeholder="请选择单元" clearable>
                    <el-option
                        v-for="item in sectionOptions"
                        :key="item.sectionId"
                        :label="item.sectionName"
                        :value="item.sectionId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备名称" prop="eqId">
                  <el-select v-model="form.eqId" placeholder="请选择设备" clearable>
                    <el-option
                        v-for="item in options"
                        :key="item.eqId"
                        :label="item.eqName"
                        :value="item.eqId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单号">
                  <el-input v-model="form.workorderNo" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button class="toolbtn" @click="searchTwo">
                  <el-icon><Search /></el-icon> 查询
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
          <!-- 新建弹出 -->
          <div class="addtanchu">
            <el-dialog
                v-model="dialogVisible"
                title="保养工单"
                width="60%"
            >
              <el-form :model="addform" ref="addformRef" label-width="100px">
                <el-row>
                  <el-input v-model="addform.maintenanceWorkorderId" v-if="false" />
                  <el-input v-model="addform.maintenanceOperator" v-if="false" />
                  <el-col :span="12">
                    <el-form-item label="单元">
                      <el-input v-model="addform.sectionName" readonly />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保养设备">
                      <el-input v-model="addform.eqName" readonly />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="保养内容">
                      <el-input v-model="addform.maintenanceContent" type="textarea" readonly/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保养操作人">
                      <el-input v-model="addform.maintenanceOperatorNames" readonly />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保养确认人">
                      <el-input v-model="addform.maintenance_confirmer_name" readonly />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="计划保养时间">
                      <el-date-picker v-model="addform.startTime"  type="datetime" placeholder="计划保养时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="addform.status==3">
                    <el-form-item label="申请确认时间">
                      <el-date-picker v-model="addform.apply_confirm_time"  type="datetime" placeholder="申请确认时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="addform.status==4">
                    <el-form-item label="验收完成时间">
                      <el-date-picker v-model="addform.endTime"  type="datetime" placeholder="申请确认时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
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
                      <el-row :gutter="10" v-for="(part, index) in addform.unitWorkorderPartsList" :key="index">
                        <el-col :span="8">
                          <el-input v-model="part.maintenancePartsName" readonly />
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="part.maintenanceStep" readonly />
                        </el-col>
                        <el-col :span="8">
                          <el-button @click="complishpart(part.id)" class="btn green" v-if="part.status==0">完成</el-button>
                          <el-button class="btn" v-if="part.status==1">已完成</el-button>
                        </el-col>
                      </el-row>
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
                      <el-row :gutter="10" v-for="(attachment, index) in addform.unitWorkorderSpareList" :key="index">
                        <el-col :span="4">
                          <el-input v-model="attachment.sparePartsName" readonly />
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="attachment.sparePartsSpe" readonly />
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="attachment.sparePartsUnit" readonly />
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="attachment.num" readonly/>
                        </el-col>
                        <el-col :span="4">
                          <el-button @click="complishspare(attachment.id,addform.maintenanceWorkorderId)" class="btn green" v-if="attachment.status==0">完成</el-button>
                          <el-button class="btn" v-if="attachment.status==1">已完成</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注信息">
                      <el-input v-model="addform.rem" type="textarea" v-if="addform.status==2"/>
                      <el-input v-model="addform.rem" type="textarea" v-if="addform.status==3 || addform.status==4" readonly/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <template #footer>
									<span class="dialog-footer">
                    <el-button @click="temSave" class="btn" v-if="addform.status==2">暂存</el-button>
										<el-button @click="save" class="btn green" v-if="addform.status==2">保养完成</el-button>
                    <el-button @click="dialogVisible = false" class="btn" v-if="addform.status==3">取消</el-button>
										<el-button @click="saveconfirm" class="btn green" v-if="addform.status==3">确认</el-button>
									</span>
              </template>
            </el-dialog>
          </div>
          </el-col>

        </el-row>
      </el-form>
    </el-card>


    <!-- <表格 -->
    <div class="table">
      <div class="header">
        <div class="card-tit">保养计划</div>
      </div>
      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="maintenanceWorkorderId" label="maintenanceWorkorderId" v-if="false"/>
        <el-table-column prop="workorderNo" label="工单号"/>
        <el-table-column prop="sectionName" label="单元"/>
        <el-table-column prop="eqName" label="设备名称"/>
        <el-table-column prop="maintenanceType" label="保养类型">
          <template #default="scope">
            <el-row justify="center" v-if="scope.row.maintenanceType == 0">周期保养</el-row>
            <el-row justify="center" v-else>指定时间保养</el-row>
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceContent" label="保养内容" />
        <el-table-column prop="status" label="保养状态" >
          <template #default="scope">
            <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="danger">已作废</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 1"><el-tag>未到期</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 2"><el-tag>待保养</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 3"><el-tag>待确认</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 4"><el-tag type="success">保养完成</el-tag></el-row>
          </template>
        </el-table-column>
        <el-table-column prop="maintenanceOperatorNames" label="保养操作人" />
        <el-table-column prop="maintenance_confirmer_name" label="保养确认人" />
        <el-table-column prop="startTime" label="保养计划时间" width="180" />
        <el-table-column prop="endTime" label="保养完成时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button link @click="edit(scope.row)" class="btn">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <div class="pages">
        <el-pagination
            background
            :total="total"
        />
        <el-button @click="confirm" class="pagebtn">确定</el-button>
      </div>
    </div>

  </div>

</template>

<script>
import { reactive } from 'vue'
import { listDevice } from "@/api/unitmanage/device";
import { listSection } from "@/api/unitmanage/section";
import { exceedlist,getWorkorder} from "@/api/unitmanage/workorders";
export default {
  name: "保养工单",
  data() {
    return {
      form: reactive({
        gongduan: '',
        unit: '',
        eqName: '',
        maintenanceType: '',
        status: '',
        workorderNo: '',
        date1: null,
        date2: null,
        sectionId: '',
        sectionName: '',
        eqId: '',
        sectionOptions:[],
        options: [],
        is_exceed:'',
      }),
      addform: reactive({
        unit: '',
        eqName: '',
        rules: '',
        status: '',
        starttime: '',
        endtime: '',
        apply_confirm_time: '',
        maintenanceContent: '',
        maintenance_confirmer_name: '',
        maintenanceOperatorNames: '',
        maintenanceOperator: '',
        maintenanceConfirmer: '',
        maintenanceType_name: '',
        maintenanceWorkorderId:'',
        diagram_url:'',
        confirm_diagram_url:'',
        rem:'',
      }),
      dialogVisible: false,
      tableData: [],
      total: 20,
      countDataList:{},
    }
  },
  created() {
    this.form.maintenanceId = this.$route.query.id;
    this.listSection();//获取单元数据
    this.getDeviceList();//获取设备数据
    this.getList();//获取列表数据
  },
  methods: {
    searchOne() {

    },
    searchTwo() {
      this.getList();//获取列表数据
    },

    edit(row) {
      this.dialogVisible = true;
      const WorkorderId = row.maintenanceWorkorderId || ids.value
      getWorkorder(WorkorderId).then(response => {
        this.addform = response.data;
        this.open = true;
        this.title = "修改保养工单";
      });
    },

    //筛选时间确认
    ctimeonfirm1(val){
      this.starttimeresult = this.timeFormat(val);
      this.datePicker = false;
      this.form.date1 = this.starttimeresult
    },

    ctimeonfirm2(val){
      this.endtimeresult = this.timeFormat(val);
      this.datePicker = false;
      this.form.date2 = this.endtimeresult
    },

    timeFormat(time) { // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let hh = time.getHours();
      let dd = time.getMinutes();
      let ss = time.getSeconds();
      return year + '-' + month + '-' + day + ' ' + hh + ':' + dd + ':' + ss;
    },

    //获取设备数据
    getDeviceList() {
      listDevice(this.queryParams).then(response => {
        this.options = response.rows;//list数据
      });
    },

    /** 查询组织下拉树结构 */
    listSection() {
      listSection(this.form).then(response => {
        this.sectionOptions = response.data;//list数据
      });
    },
    /** 查询保养工单列表 */
    getList() {
      this.form.is_exceed='1';
      this.loading = true;
      exceedlist(this.form).then(response => {
        this.tableData = response.rows;//table数据
        this.total = response.total;//table总个数
        this.loading = false;
      });
    },
  }
}


</script>

<style scoped lang="scss">
.baoyanggongdan{
  padding: 10px;background: #f3f3f4;
  height: calc(100vh - 84px);
  .tools{
    :deep(.el-card__body) {padding-bottom: 0;}
    :deep(.el-select) {width: 100%;}
    .toolbtn{
      float: right;border: 0;background: #09bec5;color: #fff;
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
  }
  .table{
    padding: 10px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 5px;
    height: calc(100% - 165px);position: relative;
    margin: 10px 0 0;
    .header{
      margin: 0 0 10px;
      padding: 10px 15px;
      border-bottom: 1px solid #f0f0f0;
      .card-tit {
        padding-left: 10px;
        border-left: 5px solid #09bec5;
        font-size: 18px;
      }
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
      position: absolute;padding-right: 70px;
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
</style>