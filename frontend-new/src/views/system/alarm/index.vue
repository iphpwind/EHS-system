<template>
  <!--告警事件-->
  <div class="alarm">
    <el-card :body-style="{ padding: '10px' }">
      <el-row>
        <el-col :span="24">
          <div class="header">
            <div class="card-tit">电力告警</div>
          </div>
        </el-col>
      </el-row>

      <el-row class="alarm-top">
        <el-col :span="24">
          <div class="fl tit">日期</div>
          <div class="fl">
            <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="fl pading10">
            <el-button class="inquirebtn" @click="searchList">查询</el-button>
          </div>
          <div class="fl pading10">
            <el-button class="inquirebtn" @click="alarmHandler">处理告警</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="alarm-con">
      <el-card :body-style="{ padding: '10px' }">
        <el-table
            ref="table"
            :data="tableData"
            stripe
            border
            @selection-change="change"
            style="width: 100%">
          <el-table-column type="selection" prop="id"></el-table-column>
          <el-table-column prop="type" v-if="false"></el-table-column>
          <el-table-column prop="remark" v-if="false"></el-table-column>
          <el-table-column
              prop="devicename"
              label="智能设备名称">
          </el-table-column>
          <el-table-column
              prop="name"
              label="测点名称">
          </el-table-column>
          <el-table-column
              prop="content"
              label="告警内容">
          </el-table-column>
          <el-table-column
              prop="time"
              label="告警时间">
          </el-table-column>
          <el-table-column
              prop="handler"
              label="处理人">
          </el-table-column>
          <el-table-column
              prop="handlerTime"
              label="处理时间">
          </el-table-column>
          <el-table-column
              prop="deal"
              label="处理">
            <template #default="scope">

              <img v-if="scope.row.deal == '已处理'" src="@/assets/images/yichuli.png" class="ico">
              <img v-else-if="scope.row.deal == '待处理'" src="@/assets/images/daichuli.png" class="ico">
              <img v-else-if="scope.row.deal == '处理中'" src="@/assets/images/chilizhong.png" class="ico">
              <span @click="popup(scope.row)">{{ scope.row.deal }}</span>

            </template>
          </el-table-column>
        </el-table>


        <!--弹出-->
        <el-dialog :title="title" v-model="open" custom-class="scopecon" width="500px">
          <el-row class="scopen-top">
            <el-col :span="24" class="title">告警信息</el-col>
            <el-col :span="12">
              <div class="">
                智能设备名称：{{ handlerSensorName }}
              </div>
            </el-col>
            <el-col :span="12">
              <div class="">
                测点名称：{{ handlerYcName }}
              </div>
            </el-col>
            <el-col :span="12">
              <div class="">
                告警内容：{{ handlerContent }}
              </div>
            </el-col>
            <el-col :span="12">
              <div class="">
                告警时间：{{ handlerDate }}
              </div>
            </el-col>
          </el-row>
          <el-form ref="form" :model="form" label-width="80px" v-if="tanchu == '待处理'">
            <el-form-item label="处理信息">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="处理状态">
              <el-radio-group v-model="form.resource">
                <el-radio label="已处理"></el-radio>
                <el-radio label="未处理"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <el-form ref="form" :model="form" label-width="80px" v-else-if="tanchu == '已处理'">
            <el-form-item label="处理信息">
              <el-input type="textarea" v-model="form.desc" readonly></el-input>
            </el-form-item>
            <el-form-item label="处理人">
              <el-input v-model="form.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="处理时间">
              <el-input v-model="form.handlerTime" readonly></el-input>
            </el-form-item>
            <el-form-item label="处理状态">
              <el-radio-group v-model="form.resource">
                <el-radio label="已处理" :disabled="true"></el-radio>
                <el-radio label="未处理" :disabled="true"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="oneAlarmHandler" v-if="tanchu == '待处理'">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>

        </el-dialog>





        <el-dialog :title="title" v-model="openAll" custom-class="scopecon" width="500px">
          <el-form ref="form" :model="form" label-width="80px" v-if="tanchu === 'all'">
            <el-form-item label="处理信息">
              <el-input type="textarea" v-model="form.descAll"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="handlerAll">确 定</el-button>
              <el-button @click="cancelAll">取 消</el-button>
            </div>
          </template>

        </el-dialog>
        <el-row class="page">
          <el-col :span="24">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="totalData">
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </div>


  </div>

</template>

<script>
import {alarmList, handler} from '@/api/system/alarm';

export default {
  name: "index",
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      totalData: 0,
      value1: '',
      tableData: [],
      selectList: [],
      dialogVisible: false,
      open: false,
      openAll: false,
      handlerSensorName: '',
      handlerYcName: '',
      handlerContent: '',
      handlerDate: '',
      form: {
        name: '',
        resource: '',
        handlerTime: '',
        descAll: ''
      },
      checkType: null,
      checkId: null,
      tanchu: ''
    }
  },
  mounted() {
    this.searchList()
  },
  methods: {

    /** 弹出按钮操作 */
    popup(data) {
      this.tanchu = data.deal
      this.checkId = data.id
      this.checkType = data.type
      this.open = true;
      this.title = "处理信息";
      this.handlerSensorName = data.devicename;
      this.handlerYcName = data.name;
      this.handlerContent = data.content;
      this.handlerDate = data.time
      this.form.resource = data.deal
      this.form.name = data.handler;
      this.form.desc = data.remark;
      this.form.handlerTime = data.handlerTime
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    cancelAll() {
      this.openAll = false;
    },
    change(rows) {
      this.selectList = rows
    },
    alarmHandler() {
      if (this.selectList.length !== 0) {
        this.tanchu = 'all'
        this.openAll = true;
      }
    },
    handlerAll() {
      handler(this.selectList, this.form.descAll).then(res => {
        this.searchList()
        this.openAll = false;
        this.form.descAll = ''
      })
    },
    oneAlarmHandler() {
      let handlerList = [{
        id: this.checkId,
        deal: this.form.resource,
        yuexDealbz: this.form.desc,
        type: this.checkType
      }]
      handler(handlerList).then(res => {
        this.searchList()
        this.open = false;
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.searchList()
    },
    searchList() {
      let startTime = this.value1[0];
      let endTime = this.value1[1];
      alarmList(this.pageNum, this.pageSize, startTime, endTime).then(res => {
        console.log(res)
        this.totalData = res.total;
        this.tableData = []
        for (let i = 0; i < res.rows.length; i++) {
          this.tableData.push({
            remark: res.rows[i].yuexDealbz,
            id: res.rows[i].id,
            devicename: res.rows[i].eqname,
            name: res.rows[i].pointName,
            type: res.rows[i].type,
            handler: res.rows[i].yuexOperName,
            handlerTime: res.rows[i].yuexDealdt,
            content: res.rows[i].state,
            time: res.rows[i].dt,
            deal: res.rows[i].deal == '0' ? '待处理' : '已处理'
          })
        }
      })
    },


  },
}

</script>

<style lang="scss" scoped>
:deep(.scopecon) {
  .el-dialog__body {
    padding: 0px var(--el-dialog-padding-primary) 10px !important;
  }

  .scopen-top {
    padding: 15px;
    margin-bottom: 20px;
    line-height: 28px;
    background: #f6f6f6;

    .title {
      font-size: var(--el-form-label-font-size);
      color: var(--el-text-color-regular);
      line-height: 32px;
      font-weight: bold;
    }

  }
}

.fl {
  float: left;
}

.text-right {
  text-align: right;
}

.pading10 {
  padding-left: 10px;
}

.alarm {
  padding: 15px;

  .header {
    padding: 0 0 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }

  .alarm-top {
    padding: 20px 15px 15px;

    .tit {
      line-height: 32px;
      padding-right: 6px;
    }

    .inquirebtn {
      background: #09bec5;
      color: #fff;
      border: none;
    }
  }

  .alarm-con {
    margin-top: 10px;

    .ico {
      vertical-align: middle;
      margin-right: 10px;
      padding: 5px 0;
    }

    :deep(.el-table__header-wrapper) {
      th {
        //background-color: #09bec5 !important;
        //color: #FFFFFF;
        text-align: center;
      }
    }

    :deep(.el-table__cell) {
      text-align: center;
      border-bottom: none !important;
    }

    :deep(.el-table__row--striped) {
      .el-table__cell {
        background: #f6fcfc !important;
      }
    }

    .page {
      float: right;
      margin-top: 20px;
      margin-bottom: 20px;

      :deep(.active) {
        background-color: #09bec5 !important;
      }
    }
  }
}
</style>
