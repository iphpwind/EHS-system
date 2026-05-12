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
        <el-form :inline="true" :model="formInline" >
          <el-form-item label="类型">
            <el-select v-model="formInline.facility" placeholder="设备">
              <el-option label="设备一" value="shebeiyi"></el-option>
              <el-option label="设备二" value="shebeier"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号">
            <el-input v-model="formInline.number" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备件名称">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="" class="checkbtn">查询</el-button>
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
        <el-table-column prop="typename"  label="类型"/>
        <el-table-column prop="digital"  label="编号"/>
        <el-table-column prop="bjname"  label="备件名称" />
        <el-table-column prop="specification"  label="规格" />
        <el-table-column prop="model"  label="型号" />
        <el-table-column prop="unit"  label="单位" />
        <el-table-column prop="inventory"  label="安全库存" />
        <el-table-column prop="dqinventory"  label="当前库存" />
        <el-table-column label="操作" width="200" fixed="right" >
           <template #default="scope" >
             <el-tooltip
                 class="box-item"
                 effect="light"
                 content="库存记录"
                 placement="top"
             >
               <el-button class="operation"  @click="onRecord"><el-icon :size="20" ><Edit /></el-icon></el-button>
             </el-tooltip>

             <el-tooltip
                 class="box-item"
                 effect="light"
                 content="库存调整"
                 placement="top"
             >
               <el-button class="operation"  @click="onSubmit"><el-icon :size="20" ><Switch /></el-icon></el-button>
             </el-tooltip>


            </template>
        </el-table-column>
      </el-table>

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
                      <i>类型：</i>设备
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico2.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>备件名称：</i>设备A89SA
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico3.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>型号：</i>A9001
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico4.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>编号：</i>AAAA9001
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico5.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>规格：</i>12mmx23mm
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="2" class="ico">
                      <img src="@/assets/images/kucun/kc-ico6.png" width="25"/>
                    </el-col>
                    <el-col :span="22" class="title">
                      <i>当前库存：</i>20
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
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="primary" @click="" class="checkbtn">查询</el-button>
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
                        :data="tableDatark"
                        stripe="true"
                        border
                        style="width: 100%"
                        v-loading="loading"
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
                          :data="tableDatack"
                          stripe="true"
                          border
                          style="width: 100%"
                          v-loading="loading"
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

          <el-form ref="inventoryform" :model="inventoryform" :rules="rules" label-width="100px" :label-position="labelPosition">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="操作" prop="inventoryopear">
                  <el-select v-model="inventoryform.inventoryopear" placeholder="默认">
                    <el-option label="类型一" value="leixingyi"></el-option>
                    <el-option label="类型二" value="leixinger"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="调整类型" prop="inventorylx">
                  <el-input v-model="inventoryform.inventorylx"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数量" prop="inventorysl">
                  <el-input v-model="inventoryform.inventorysl"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联设备" >
                  <el-input v-model="inventoryform.inventoryglsb"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" >
                  <el-input type="textarea" v-model="inventoryform.inventoryglsbbz"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <template #footer>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="btn">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false" class="btn green">确 定</el-button>
        </span>
          </template>




        </el-dialog>
      </div>



      <!-- 页码 -->
      <div class="pages">
        <el-pagination
            background
            :total="10"
            ref="page"
        />
        <el-button @click="confirm" class="pagebtn">确定</el-button>
      </div>
    </div>







  </div>
</template>

<script>


export default {
  name: "index",
  data() {
    return {
      dialogVisible: false,
      dialogVisiblerec: false,
      mask: false,
      maskclose: false,
      showClose: false,
      value1: '',
      formInline: {
        number: '',
        name:'',
        facility: '',
        total: 0,
      },
      labelPosition: 'top',
      inventoryform:{
        inventoryopear:'',
        inventorylx:'',
        inventorysl:'',
        inventoryglsb:'',
        inventoryglsbbz:'',
      },
      rules: {
        inventoryopear: [
          { required: true, message: '请输入操作', trigger: 'blur' },
        ],
        inventorylx: [
          { required: true, message: '请输入调整类型', trigger: 'blur' },
        ],
        inventorysl: [
          { required: true, message: '请输入数量', trigger: 'blur' },
        ],

      },
      tableData: [{
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        unit: '个',
        inventory: '209211231',
        dqinventory: '209211231',

      }, {
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        unit: '个',
        inventory: '209211231',
        dqinventory: '209211231',

      },{
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        unit: '个',
        inventory: '209211231',
        dqinventory: '209211231',

      }],
      tableDatark: [{
        rkdate: '2011-11-01 10:00',
        rktype: '入库',
        rknumber: '12',
        rkpeople: '管理员A',
      },{
        rkdate: '2011-11-01 10:00',
        rktype: '入库',
        rknumber: '12',
        rkpeople: '管理员A',
      },{
        rkdate: '2011-11-01 10:00',
        rktype: '入库',
        rknumber: '12',
        rkpeople: '管理员A',
      }],
      tableDatack: [{
        ckdate: '2011-11-01 10:00',
        cktype: '出库',
        cknumber: '12',
        ckpeople: '管理员A',
        ckglsb: '管理员手机',
      },{
        ckdate: '2011-11-01 10:00',
        cktype: '出库',
        cknumber: '12',
        ckpeople: '管理员A',
        ckglsb: '管理员手机',
      },{
        ckdate: '2011-11-01 10:00',
        cktype: '出库',
        cknumber: '12',
        ckpeople: '管理员A',
        ckglsb: '管理员手机',
      }]
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = true;
    },
    onRecord() {
      this.dialogVisiblerec = true;
    },


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
