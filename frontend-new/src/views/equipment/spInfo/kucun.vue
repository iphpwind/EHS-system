<template>
  <div class="beijian">
    <!-- 筛选 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>库存清单</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :inline="true" :model="queryParams" >
          <el-form-item label="类型">
            <el-select v-model="queryParams.sptypeDictId" placeholder="请选择类型" clearable>
              <el-option
                  v-for="item in Options"
                  :key="item.sptypeDictId"
                  :label="item.sptypeName"
                  :value="item.sptypeDictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编号">
            <el-input v-model="queryParams.spNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备件名称">
            <el-input v-model="queryParams.spName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>


    <!--表格-->
    <div class="table">
      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="sptypeName"  label="类型"/>
        <el-table-column prop="spNo"  label="编号"/>
        <el-table-column prop="spName"  label="备件名称" />
        <el-table-column prop="spSpe"  label="规格" />
        <el-table-column prop="spType"  label="型号" />
        <el-table-column prop="spunitName"  label="单位" />
        <el-table-column prop="safetyStock"  label="安全库存" />
        <el-table-column prop="stockNow"  label="当前库存" />
        <el-table-column label="操作" width="200" fixed="right" >
          <template #default="scope" >
            <el-tooltip
                class="box-item"
                effect="light"
                content="库存记录"
                placement="top"
            >
              <el-button class="operation"  @click="onRecord(scope.row)"><el-icon :size="20" ><Edit /></el-icon></el-button>
            </el-tooltip>

            <el-tooltip
                class="box-item"
                effect="light"
                content="库存调整"
                placement="top"
            >
              <el-button class="operation"  @click="onSubmit(scope.row)"><el-icon :size="20" ><Switch /></el-icon></el-button>
            </el-tooltip>


          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <div class="pages">
        <pagination
            background
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </div>

      <!--库存记录-->
      <div class="detailtc">
        <el-dialog
            v-model="dialogVisiblerec"
            :show-close="showClose"
            width="calc(100% - 200px)"
            :modal="mask"
            :close-on-click-modal="maskclose">

          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>库存记录</span>
                <el-button class="btn" @click="dialogVisiblerec = false">
                  <el-icon style="margin-right: 5px;"><Back /></el-icon>返回
                </el-button>
              </div>
            </template>
            <div class="card-con">
              <el-row>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico1.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>类型：</i>{{ spinfos.sptypeName }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico2.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>备件名称：</i>{{ spinfos.spName }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico3.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>型号：</i>{{ spinfos.spType }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico4.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>编号：</i>{{ spinfos.spNo }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico5.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>规格：</i>{{ spinfos.spSpe }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico6.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>当前库存：</i>{{ spinfos.stockNow }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 记录-->
          <div class="record-con">
            <div class="record-con-top">
              <span class="demonstration">日期</span>
              <el-date-picker
                  v-model="value1"
                  @change="ctimeonfirm"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="primary" @click="adjustsearch" class="checkbtn">查询</el-button>
            </div>
            <div class="record-con-li">
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-card class="box-card">
                    <template #header>
                      <div class="card-header">
                        <span>入库记录</span>
                      </div>
                    </template>
                    <div class="rkjl">
                      <el-table
                          :data="spinfoListr"
                          stripe="true"
                          border
                          style="width: 100%;border: 1px solid #efefef; border-left: none;"
                          v-loading="loading"
                          height="400"
                      >
                        <el-table-column prop="rkdate"  label="日期"/>
                        <el-table-column prop="rktype"  label="入库类型"/>
                        <el-table-column prop="rknumber"  label="数量" />
                        <el-table-column prop="rkpeople"  label="入库人" />
                      </el-table>
                    </div>
                  </el-card>
                </el-col>

                <el-col :span="12">
                  <el-card class="box-card">
                    <template #header>
                      <div class="card-header">
                        <span>出库记录</span>
                      </div>
                    </template>
                    <div class="ckjl">
                      <div class="rkjl">
                        <el-table
                            :data="spinfoListc"
                            stripe="true"
                            border
                            style="width: 100%;border: 1px solid #efefef; border-left: none;"
                            v-loading="loading"
                            height="400"
                        >
                          <el-table-column prop="ckdate"  label="日期"/>
                          <el-table-column prop="cktype"  label="入库类型"/>
                          <el-table-column prop="cknumber"  label="数量" />
                          <el-table-column prop="ckpeople"  label="出库人" />
                          <el-table-column prop="ckglsb"  label="关联设备" />
                        </el-table>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-dialog>
      </div>
      <!--库存记录end-->

      <!--库存调整-->
      <div class="addtanchu">
        <el-dialog
            title="库存调整"
            v-model="dialogVisible"
            width="40%">

          <el-form ref="spadjustRef" :model="inventoryform" :rules="rules" label-width="100px" :label-position="labelPosition">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input v-model="inventoryform.spId" v-if="false"></el-input>
                <el-form-item label="操作" prop="spadjustOperate">
                  <el-select v-model="inventoryform.spadjustOperate" placeholder="选择操作" @change="changeop">
                    <el-option label="出库" value="2"></el-option>
                    <el-option label="入库" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="inventoryform.spadjustOperate == '2'">
                <el-form-item label="调整类型" prop="spadjustType">
<!--                  <el-input v-model="inventoryform.inventorylx"></el-input>-->
                  <el-select v-model="inventoryform.spcstockDictId" placeholder="选择类型" @change="adjustvalue">
                    <el-option
                        v-for="item in spcstockDics"
                        :key="item.spcstockDictId"
                        :label="item.spcstockName"
                        :value="item.spcstockDictId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="inventoryform.spadjustOperate == '1'">
                <el-form-item label="调整类型" prop="spadjustType">
<!--                  <el-input v-model="inventoryform.inventorylx"></el-input>-->
                  <el-select v-model="inventoryform.sprstockDictId" placeholder="选择类型" @change="adjustvalue">
                    <el-option
                        v-for="item in sprstockDics"
                        :key="item.sprstockDictId"
                        :label="item.sprstockName"
                        :value="item.sprstockDictId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数量" prop="spadjustNum">
                  <el-input v-model="inventoryform.spadjustNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联设备" >
<!--                  <el-input v-model="inventoryform.relevanceEqid"></el-input>-->
                  <tree-select
                      v-model:value="inventoryform.relevanceEqid"
                      :options="equipmentOptions"
                      :objMap="{ value: 'eqId', label: 'eqName', children: 'children' }"
                      placeholder="请选择关联设备"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" >
                  <el-input type="textarea" v-model="inventoryform.rem"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <template #footer>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="btn">取 消</el-button>
          <el-button type="primary" @click="adjustSave" class="btn green">确 定</el-button>
        </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { listSpInfo, getSpInfo, delSpInfo, addSpInfo, updateSpInfo } from "@/api/equipment/spInfo";
import { listSptypeDic } from "@/api/equipment/sptypeDic";
import { listEquipment} from "@/api/equipment/equipment";
import { listSpadjust, getSpadjust, delSpadjust, addSpadjust, updateSpadjust } from "@/api/equipment/spadjust";
import { listSpcstockDic} from "@/api/equipment/spcstockDic";
import { listSprstockDic} from "@/api/equipment/sprstockDic";

export default {
  name: "index",
  data() {
    return {
      dialogVisible: false,
      dialogVisiblerec: false,
      mask: false,
      maskclose: false,
      showClose: false,
      value1: [],
      Options:[],
      spcstockDics:[],
      sprstockDics:[],
      spinfos:[],
      spinfoListc:[],
      spinfoListr:[],
      loading:true,
      total:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        spName: null,
        sptypeDictId: null,
        spNo:null,
        delFlag:0,
        status:0
      },
      adjuquerys:{
        date1:null,
        date2:null,
        spId:'',
      },
      labelPosition: 'top',
      inventoryform:{
        spadjustOperate: '1',
        spadjustType:'',
        spadjustNum:'',
        relevanceEqid:'',
        rem:'',
        spId:'',
        sprstockDictId:'',
        spcstockDictId:''
      },
      rules: {
        spadjustOperate: [
          { required: true, message: '请输入操作', trigger: 'blur' },
        ],
        spadjustType: [
          { required: true, message: '请输入调整类型', trigger: 'blur' },
        ],
        spadjustTyper: [
          { required: true, message: '请输入调整类型', trigger: 'blur' },
        ],
        spadjustNum: [
          { required: true, message: '请输入数量', trigger: 'blur' },
        ],

      },
      tableData: [],
      equipmentOptions:[],
      title:''
    }
  },

  created() {
    this.getList();
    this.getsptype();
  },

  mounted() {
    this.getTreeselect();
    this.getspcstock();
    this.getsprstock();
  },

  methods: {
    changeop(){
      this.inventoryform.spadjustType='';
      this.inventoryform.sprstockDictId='';
      this.inventoryform.spcstockDictId='';
    },
    adjustvalue(value){
      console.log(value)
      this.inventoryform.spadjustType=value;
    },
    timeFormat(time) { // 时间格式化 2019-09-08
      let year = time.getFullYear().toString();
      let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1).toString() : (time.getMonth() + 1).toString();
      let day = time.getDate() < 10 ? '0' + time.getDate().toString() : time.getDate().toString();
      return year + '-' + month + '-' + day;
    },
    //出入库记录时间筛选
    ctimeonfirm(val){
      this.value1 = [this.timeFormat(val[0]), this.timeFormat(val[1])];
      this.adjuquerys.date1 = this.value1[0];
      this.adjuquerys.date2 = this.value1[1];
    },
    //库存记录时间筛选查询
    adjustsearch(){
      const SpadjustListc = [];
      const SpadjustListr = [];
      this.adjuquerys.spId = this.spinfos.spId;
      listSpadjust(this.adjuquerys).then(response => {
        if(response.rows!=null && response.rows.length>0){
          response.rows.forEach((j, index) => {
            if(j.spadjustOperate == '2'){//出库
              SpadjustListc.push({
                ckdate:j.createTime,
                cktype:'出库',
                cknumber:j.spadjustNum,
                ckpeople:j.userName,
                ckglsb:j.eqName
              });
            }

            if(j.spadjustOperate == '1'){//入库
              SpadjustListr.push({
                rkdate:j.createTime,
                rktype:'入库',
                rknumber:j.spadjustNum,
                rkpeople:j.userName,
              });
            }
          })
        }
        this.spinfoListc = SpadjustListc;
        this.spinfoListr = SpadjustListr;
      });

    },
    reset() {
      this.inventoryform = {
        spadjustOperate: '1',
        spadjustType:'',
        spadjustNum:'',
        relevanceEqid:'',
        rem:'',
        spId:'',
      };
    },
    reset1() {
      this.adjuquerys={
        date1:null,
        date2:null,
        spId:'',
      };
      this.value1=[];
    },
    onSubmit(row) {//库存调整
      this.reset();
      this.inventoryform.spId = row.spId
      this.dialogVisible = true;
    },
    onRecord(row) {//库存记录
      this.reset1();
      const spId = row.spId
      const SpadjustListc = [];
      const SpadjustListr = [];
      getSpInfo(spId).then(response => {
        if(response.data!=null && response.data.equipmentSpadjustList.length>0){
          response.data.equipmentSpadjustList.forEach((j, index) => {
            if(j.spadjustOperate == '2'){//出库
              SpadjustListc.push({
                ckdate:j.createTime,
                cktype:'出库',
                cknumber:j.spadjustNum,
                ckpeople:j.userName,
                ckglsb:j.eqName
              });
            }

            if(j.spadjustOperate == '1'){//入库
              SpadjustListr.push({
                rkdate:j.createTime,
                rktype:'入库',
                rknumber:j.spadjustNum,
                rkpeople:j.userName,
              });
            }
          })
        }
        this.spinfos = response.data;
        this.spinfoListc = SpadjustListc;
        this.spinfoListr = SpadjustListr;
        this.dialogVisiblerec = true;
      });
    },
    /** 查询备件类型列表 */
    getsptype() {
      listSptypeDic(this.queryParams).then(response => {
        this.Options = response.rows;
      });
    },

    /** 查询备件库存调整出库字典列表 */
    getspcstock() {
      listSpcstockDic(this.queryParams).then(response => {
        this.spcstockDics = response.rows;
      });
    },
    /** 查询备件库存调整出库字典列表 */
    getsprstock() {
      listSprstockDic(this.queryParams).then(response => {
        this.sprstockDics = response.rows;
      });
    },

    /** 查询备件台账信息列表 */
    getList() {
      this.loading = true;
      listSpInfo(this.queryParams).then(response => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 查询设备下拉树结构 */
    getTreeselect() {
      this.equipmentOptions = [];
      listEquipment({delFlag: "0", status: "0"}).then(response => {
        const data = {eqId: 0, eqName: "顶级节点", children: []};
        data.children = this.handleTree(response.rows, "eqId");
        this.equipmentOptions.push(data);
      });
    },
    /** 保存调整记录 */
    adjustSave() {
      this.$refs["spadjustRef"].validate(valid => {
        if (valid) {
          if (this.inventoryform.equipmentSpadjustId != null) {
            updateSpadjust(form.value).then(response => {
              this.$message({
                type: 'success',
                message: `修改成功！`
              });
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            addSpadjust(this.inventoryform).then(response => {
              this.$message({
                type: 'success',
                message: `新增成功！`
              });
              this.dialogVisible = false;
              this.getList();
            });
          }
        }
      });
    }

  }

}


</script>

<style scoped lang="scss">
.beijian{
  padding: 10px;
  background: #f3f3f3;
  height: calc(100vh - 84px);
  .box-card{
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
    }
    .card-con{
      .ico{
        vertical-align: middle;
        padding: 10px 0;
      }
      .title{
        padding: 10px 0;
        line-height: 28px;
        color: #252631;
        i{
          font-style: inherit;
          color: #a1aab7;
        }
      }

    }
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }
    }
  }
  .table{
    padding: 20px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 3px;
    height: calc(100% - 160px);position: relative;
    margin: 10px 0 0;

    .handlebtn{
      height: auto;border: 0;padding: 0;color: #09bec5;
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
    .operation{
      padding: 0;
      border: none;
      background: transparent;
      --el-button-hover-text-color:#37c4cb;
    }
    .nav{
      text-align: right;
      margin-bottom: 10px;
    }
    .addtanchu{
      :deep(.el-dialog) {
        overflow: hidden;
        .el-dialog__header{
          box-shadow: 0 5px 10px #eee;
        }
      }
      .el-form {
        .el-select{
          width: 100%;
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
      .el-tree-select{
        width: 400px;
      }
    }
  }

  /*库存记录*/
  .detailtc{
    :deep(.el-dialog) {
      margin-top: calc(100vh - 84px);
      padding: 10px;
      background: #f3f3f3;
      margin-left: 200px;
      margin-top: 84px !important;
      margin-bottom: 0;margin-right: 0;
      height: calc(100vh - 84px);
      border: 0;border-radius: 0;

      .el-dialog__header{display: none;}
      .el-dialog__body{padding: 0;height: 100%;}
      .table{
        height: calc(100% - 145px);
      }
    }
  }
  .box-card{
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
      .btn{
        float: right;padding: 6px 15px;border: 0;border-radius: 20px;
        background: url("@/assets/images/xunjian/btn-bg.jpg") repeat-y;
        background-size: 100%;color: #fff;
        height: auto;
      }
    }
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }

    }
  }
  .record-con{
    padding: 20px;
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 0 5px #eee;
    border-radius: 3px;
    height: calc(100% - 210px);
    position: relative;
    margin: 10px 0 0;
    .record-con-top{
      display: flex;
      margin-bottom: 20px;
      .demonstration{
        margin-right: 10px;
        line-height: 32px;
      }
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;margin-left: 10px;
      }
    }
    .record-con-li{

    }

  }
}
</style>
