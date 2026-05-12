<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="隐患编号" prop="hazardNo">
        <el-input
            v-model="queryParams.hazardNo"
            placeholder="请输入隐患编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:hazareport:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="hazareportList" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <!--      <el-table-column label="主键id" align="center" prop="id" />
            <el-table-column label="企业编码" align="center" prop="enterpriseCode" />-->
      <el-table-column label="隐患编号" align="center" prop="hazardNo" width="180"/>
      <el-table-column label="隐患主管部门" align="center" prop="deptName" width="220"/>
      <el-table-column label="排查类型" align="center" prop="investigateName" width="120"/>
      <el-table-column label="隐患来源" align="center" prop="troubleSourceName" width="120"/>
      <el-table-column label="整改负责人" align="center" prop="zgChargeUserName" width="120"/>
      <el-table-column label="分析对象" align="center" prop="objectName" width="180"/>
      <el-table-column label="分析单元" align="center" prop="unitName" width="120"/>
      <el-table-column label="隐患类型" align="center" prop="troubleTypeName" />
      <el-table-column label="隐患描述" align="center" prop="hazardDetails" width="200"/>
      <el-table-column label="隐患位置" align="center" prop="hazardSeat" width="120"/>
      <el-table-column label="隐患评估人或负责人" align="center" prop="nickName" width="200"/>
      <el-table-column label="上报人" align="center" prop="reportName" />
      <el-table-column label="上报时间" align="center" prop="reportTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 1">待评估</el-row>
          <el-row justify="center" v-if="scope.row.status == 2">待整改</el-row>
          <el-row justify="center" v-if="scope.row.status == 3">整改中</el-row>
          <el-row justify="center" v-if="scope.row.status == 4">分管验收</el-row>
          <el-row justify="center" v-if="scope.row.status == 5">主管验收</el-row>
          <el-row justify="center" v-if="scope.row.status == 6">验收完成</el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template #default="scope">
          <el-button
              type="text"
              @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
              type="text"
              @click="handleHamo(scope.row)"
              v-if="scope.row.recordId!=null && scope.row.recordId!=''"
          >异常编号</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <div class="earthitem">
        <table>
          <tr>
            <td>装置/区域</td>
            <td colspan="2">{{item.objectName}}</td>
          </tr>
          <tr>
            <td>隐患类型</td>
            <td colspan="2">{{item.investigateName}}</td>
          </tr>
          <tr>
            <td>分析单元/风险点</td>
            <td colspan="2">{{item.unitName}}</td>
          </tr>
          <tr>
            <td>隐患排查内容</td>
            <td colspan="2">{{item.content}}</td>
          </tr>
          <tr>
            <td>排查结果</td>
            <td colspan="2" v-if="item.result==0">正常</td>
            <td colspan="2" v-if="item.result==1">异常</td>
          </tr>
          <tr>
            <td>异常编码</td>
            <td colspan="2">{{item.errNum}}</td>
          </tr>
          <tr>
            <td>异常描述</td>
            <td colspan="2">{{item.details}}</td>
          </tr>
          <tr>
            <td>执行人</td>
            <td colspan="2">{{item.nickName}}</td>
          </tr>
          <tr>
            <td>排查时间</td>
            <td colspan="2">{{item.implementTime}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>

    <el-dialog title="详情" v-model="detailOpen" width="500px" append-to-body>
      <div class="report">
        <div class="title">隐患排查详情</div>
        <el-collapse @change="handleChange">
          <el-collapse-item title="上报" name="1">
            <div class="earthitem">
              <h4>上报</h4>
              <table>
                <tr>
                  <td>排查类型：</td>
                  <td colspan="2">{{ sbform.investigateName }}</td>
                </tr>
                <tr>
                  <td>隐患来源：</td>
                  <td colspan="2">{{ sbform.troubleSourceName }}</td>
                </tr>
                <tr>
                  <td>分析对象：</td>
                  <td colspan="2">{{ sbform.objectName }}</td>
                </tr>
                <tr>
                  <td>分析单元：</td>
                  <td colspan="2">{{ sbform.unitName }}</td>
                </tr>
                <tr>
                  <td>隐患主管部门：</td>
                  <td colspan="2">{{ sbform.deptName }}</td>
                </tr>
                <tr>
                  <td>隐患位置：</td>
                  <td colspan="2">{{ sbform.hazardSeat }}</td>
                </tr>
                <tr>
                  <td>隐患类型：</td>
                  <td colspan="2">{{ sbform.troubleTypeName }}</td>
                </tr>
                <tr>
                  <td>发生环节：</td>
                  <td colspan="2">{{ sbform.occurLinkName }}</td>
                </tr>
                <tr>
                  <td>隐患描述：</td>
                  <td colspan="2">{{ sbform.hazardDetails }}</td>
                </tr>
                <tr>
                  <td>上报人：</td>
                  <td colspan="2">{{ sbform.reportName }}</td>
                </tr>
                <tr>
                  <td>上报时间：</td>
                  <td colspan="2">{{ sbform.reportTime }}</td>
                </tr>
                <tr>
                  <td>指定评估人：</td>
                  <td colspan="2">{{ sbform.nickName }}</td>
                </tr>
                <tr>
                  <td>图片：</td>
                  <td colspan="2">
                    <div v-for="(item,index) in fjlist">
                      <img :src="item.address" alt="" class="qianming">
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </el-collapse-item>
          <el-collapse-item title="待整改" name="2" v-if="sbform.rectifyStatus==1">
            <h4>待整改</h4>
            <table>
              <tr>
                <td>整改意见：</td>
                <td colspan="2">{{ dzgform.opinion }}</td>
              </tr>
              <tr>
                <td>责任部门：</td>
                <td colspan="2">{{ dzgform.responName }}</td>
              </tr>
              <tr>
                <td>整改负责作业人：</td>
                <td colspan="2">{{ dzgform.zgChargeUserName }}</td>
              </tr>
              <tr>
                <td>提交时间：</td>
                <td colspan="2">{{ dzgform.time }}</td>
              </tr>
              <tr>
                <td>指定整改作业人：</td>
                <td colspan="2">{{ dzgform.userNames }}</td>
              </tr>
              <tr>
                <td>整改期限：</td>
                <td colspan="2">{{ dzgform.rectificDate }}</td>
              </tr>
            </table>
          </el-collapse-item>
          <el-collapse-item title="整改中" name="3">
            <div class="earthitem">
              <h4>整改中</h4>
              <table>
                <tr>
                  <td>原因分析：</td>
                  <td colspan="2">{{zgform.reason}}</td>
                </tr>
                <tr>
                  <td>整改情况：</td>
                  <td colspan="2">{{zgform.situation}}</td>
                </tr>
                <tr>
                  <td>整改作业人：</td>
                  <td colspan="2">{{zgform.userName}}</td>
                </tr>
                <tr>
                  <td>整改人签字：</td>
                  <td colspan="2"><img :src="zgform.rectificSign" alt="" class="qianming"></td>
                </tr>
                <tr>
                  <td>整改完成时间：</td>
                  <td colspan="2">{{zgform.time}}</td>
                </tr>
                <tr>
                  <td>整改负责人验收：</td>
                  <td colspan="2">{{zgform.chargeUserName}}</td>
                </tr>
                <tr>
                  <td>图片：</td>
                  <td colspan="2">
                    <div v-for="(item,index) in fjlist1">
                      <img :src="item.address" alt="" class="qianming">
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </el-collapse-item>
          <el-collapse-item title="验收" name="4">
            <div class="earthitem">
              <h4>验收</h4>
              <table>
                <tr>
                  <td>验收情况：</td>
                  <td colspan="2">{{ysform.situation}}</td>
                </tr>
                <tr>
                  <td>整改负责人验收：</td>
                  <td colspan="2"><img :src="ysform.chargeSign" alt="" class="qianming"></td>
                </tr>
                <tr>
                  <td>提交人：</td>
                  <td colspan="2">{{ ysform.changeUserName }}</td>
                </tr>
                <tr>
                  <td>提交时间：</td>
                  <td colspan="2">{{ ysform.changeTime }}</td>
                </tr>
                <tr>
                  <td>资金投入：</td>
                  <td colspan="2">{{ ysform.money }}</td>
                </tr>
              </table>
            </div>
            <div class="earthitem" v-if="ysform.mainChargeUser">
              <h4>验收</h4>
              <table>
                <tr>
                  <td>验收情况：</td>
                  <td colspan="2">{{ysform.mainSituation}}</td>
                </tr>
                <tr>
                  <td>主管负责人验收：</td>
                  <td colspan="2"><img :src="ysform.mainChargeSign" alt="" class="qianming"></td>
                </tr>
                <tr>
                  <td>提交人：</td>
                  <td colspan="2">{{ ysform.mainChargeUserName }}</td>
                </tr>
                <tr>
                  <td>提交时间：</td>
                  <td colspan="2">{{ ysform.mainChargeTime }}</td>
                </tr>
              </table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

  </div>
</template>

<script setup name="Hazareport">
import { listHazareport, getHazareport, delHazareport, addHazareport, updateHazareport } from "@/api/safework/hazareport";
import {listRecord, getRecord} from "@/api/safework/record";
import { listHazardattachment} from "@/api/safework/hazardattachment";
import { listNotrectified } from "@/api/safework/notrectified";
import { listAssessment, delAssessment, addAssessment, updateAssessment } from "@/api/safework/assessment";
import { listRectification } from "@/api/safework/rectification";
import { listRectmeasure } from "@/api/safework/rectmeasure";
import { listAccept, delAccept, addAccept, updateAccept } from "@/api/safework/accept";
import {userList} from "@/api/system/user";

const { proxy } = getCurrentInstance();

const hazareportList = ref([]);
const personcolumns = ref([]);
const open = ref(false);
const detailOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const fjlist = ref([]);
const fjlist1 = ref([]);
const fjlist2 = ref([]);
const fjlist3 = ref([]);
const meList = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("异常详情");

const data = reactive({
  form: {},
  sbform: {},
  pgform: {},
  dzgform: {},
  zgform: {},
  ysform: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    hazardNo: null,
    investigateTypeId: null,
    troubleSourceId: null,
    objectId: null,
    directorDeptId: null,
    unitId: null,
    hazardSeat: null,
    occurlinkId: null,
    hazardDetails: null,
    evaluatorUser: null,
    reportUser: null,
    reportTime: null,
    status: null,
  },
  item: {},
  rules: {
  }
});

const { queryParams, form, rules, item, sbform,pgform,dzgform,zgform,ysform } = toRefs(data);

/** 查询隐患上报列表 */
function getList() {
  loading.value = true;
  queryParams.value.hazardFlag = '快速整改'
  listHazareport(queryParams.value).then(response => {
    hazareportList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


// 表单重置
function reset() {
  form.value = {
    id: null,
    enterpriseCode: null,
    hazardNo: null,
    investigateTypeId: null,
    troubleSourceId: null,
    objectId: null,
    directorDeptId: null,
    unitId: null,
    hazardSeat: null,
    occurlinkId: null,
    hazardDetails: null,
    evaluatorUser: null,
    reportUser: null,
    reportTime: null,
    delFlag: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("hazareportRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

//异常编号
function handleHamo(row){
  open.value = true;
  getRecord(row.recordId).then(response => {
    item.value = response.data;
  })
}

//上报详情
function handleDetail(row){
  detailOpen.value = true;
  getHazareport(row.id).then(response => {
    sbform.value = response.data;
    getAssessment(row);
    getNotrectified(row);
    getRectificate(row);
    getAccept(row);
  })
}
//评估详情
function getAssessment(row){
  listAssessment({reportId:row.id}).then(response => {
    if(response.rows.length>0){
      pgform.value = response.rows[0]
      console.log(pgform.value)
    }
  })
}

function getNotrectified(row){
  listNotrectified({reportId:row.id}).then(response => {
    if(response.rows.length>0){
      if(response.rows[0].rectificUser != ""){
        response.rows[0].userIdArray = response.rows[0].rectificUser.split(",");
        var userNames = [];
        for(let id of response.rows[0].userIdArray){
          for(let user of personcolumns.value){
            if(Number(id) == user.userId){
              userNames.push(user.nickName);
            }
          }
        }
        response.rows[0].userNames = userNames.join(',');
      }
      dzgform.value=response.rows[0]
    }
  });
}

function getAccept(row){
  listAccept({reportId:row.id}).then(response => {
    ysform.value = response.rows[0];
    getFujian2(row);
  });
}

function getRectificate(row){
  listRectification({reportId:row.id}).then(response => {
    if(response.rows.length>0){
      zgform.value=response.rows[0]
      getFujian1(row)
      listRectmeasure({recId:form.value.id}).then(res => {
        meList.value = res.rows
      })
    }
  });
}

//附件
function getFujian(row){
  listHazardattachment({reId:row.recordId,type:1}).then(res => {
    fjlist.value = res.rows;
  })
}

function getFujian1(row){
  listHazardattachment({reId:row.recordId,type:4}).then(res => {
    fjlist1.value = res.rows;
  })
}

function getFujian2(row){
  listHazardattachment({reId:row.recordId,type:5}).then(res => {//分级主管
    fjlist2.value = res.rows;
  })
  listHazardattachment({reId:row.recordId,type:6}).then(res => {//主管
    fjlist3.value = res.rows;
  })
}

/* 查询人员 */
function getUser(){
  userList().then(res => {
    personcolumns.value = res.rows
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/hazareport/export', {
    ...queryParams.value
  }, `hazareport_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped lang="scss">
.earthitem{
  padding: 5px;
  margin: 5px;
  background-color: #eeeeee;
}
.earthitem table{
  td{
    border: none;
  }
  .qianming{
    height: 25px;vertical-align: middle;
  }
}
:deep(.el-collapse) {
  border: 0;padding: 20px 15px 15px 60px;background: #fff;
  .el-collapse-item__header{
    background: #f9f9f9;padding-left: 15px;
  }
  .el-collapse-item{
    margin-bottom: 10px;position: relative;
  }
  .el-collapse-item:before{
    content: '';width: 25px;height: 25px;line-height: 25px;
    position: absolute;top: 0;left: -40px;
    border: 1px solid #09bec5;border-radius: 50%;
    text-align: center;color: #09bec5;background: #fff;
    z-index: 9;
  }
  .el-collapse-item:nth-child(1):before{
    content: '1'
  }
  .el-collapse-item:nth-child(2):before{
    content: '2'
  }
  .el-collapse-item:nth-child(3):before{
    content: '3'
  }
  .el-collapse-item:nth-child(4):before{
    content: '4'
  }
  .el-collapse-item:nth-child(5):before{
    content: '5'
  }
  .el-collapse-item:last-child::after{
    display: none;
  }
  .el-collapse-item::after{
    content: '';width: 2px;height: calc(100% + 15px);
    background: #09bec5;
    position: absolute;top: 0;left: -29px;
    z-index: 1;
  }
  .el-collapse-item__content{
    background: #f9f9f9;padding-top: 10px;
    border-top: 1px solid #eaeaea;
  }
  .el-collapse-item__content:before,.el-collapse-item__content::after{
    content: '';clear: both;display: table;
  }
}
</style>
