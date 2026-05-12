<template>
  <div class="yirenyidangshow">
    <el-card class="box-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
<!--      个人信息-->
      <el-tab-pane label="个人信息" name="first">
        <table width="100%" border="1" cellspacing="0" cellpadding="0" class="tablecon">
          <tr>
            <td>姓名</td>
            <td>{{staffInfo.staffName}}</td>
            <td>性别</td>
            <td><dict-tag :options="sys_user_sex" :value="staffInfo.sex"/></td>
          </tr>
          <tr>
            <td>工号</td>
            <td>{{staffInfo.staffNo}}</td>
            <td>账号</td>
            <td>{{staffInfo.userName}}</td>
          </tr>
          <tr>
            <td>所属部门</td>
            <td>{{staffInfo.deptName}}</td>
            <td>所属岗位</td>
            <td>{{staffInfo.postNames}}</td>
          </tr>
          <tr>
            <td>所属机构</td>
            <td>{{staffInfo.deptName}}</td>
            <td>角色</td>
            <td>{{staffInfo.staffDeptName}}</td>
          </tr>
          <tr>
            <td>手机号</td>
            <td>{{staffInfo.phonenumber}}</td>
            <td>邮箱</td>
            <td>{{staffInfo.email}}</td>
          </tr>
          <tr>
            <td>人员类型</td>
            <td><span v-if="staffInfo.staffType == 1">内部员工</span><span v-if="staffInfo.staffType == 2">访客</span></td>
          </tr>
          <!-- <tr>
            <td>最高学历</td>
            <td>高中</td>
            <td>毕业院校</td>
            <td>蓬莱第一中学</td>
          </tr> -->
          <!-- <tr>
            <td>专业</td>
            <td> </td>
            <td>最高学位</td>
            <td></td>
          </tr> -->
          <!-- <tr>
            <td>户籍所在地</td>
            <td></td>
            <td>从业所在地</td>
            <td></td>
          </tr> -->
          <!-- <tr>
            <td>参加工作时间</td>
            <td></td>
            <td>工作单位</td>
            <td> </td>
          </tr>
          <tr>
            <td>工龄</td>
            <td></td>
            <td>办公电话</td>
            <td></td>
          </tr> -->
          <!-- <tr>
            <td>职务</td>
            <td></td>
            <td>职称</td>
            <td></td>
          </tr> -->
          <!-- <tr>
            <td>人员类型</td>
            <td>其他</td>
            <td>工作职责</td>
            <td>1接受班长的领导，完成班长交给的一切任务。2认真按工艺规程做好生产前的准备工作，严格遵守工艺及设备操作规程，保证安全生产。3运行中严密监视各仪表，保证设备的安全、经济运行，保持各设备最佳状态，保持各参数在允许值范围内。4经常分析、总结运行状况，吸取经验教训，不断提高运行技能，保持设备良好的运行状态。5认真学习生产工艺，严格按照岗位操作规程进行生产操作。6仔细、真实、及时填写操作记录。7加强个人安全防护，杜绝人身安全事故的发生。8发现生产异常，及时向上级领导标准。9严格遵守车间、部门级公司的各项规章制度。10有效管理车间的定置管理，使车间工作场所保持整洁、有序。11听从指挥，负责所在辖区范围内的现场操作及治理工作。
            </td>
          </tr>
          <tr>
            <td>健康状况</td>
            <td></td>
            <td>工作经历</td>
            <td></td>
          </tr>
          <tr>
            <td>本人照片</td>
            <td></td>
            <td>本人手写签字图片	</td>
            <td></td>
          </tr> -->

        </table>
      </el-tab-pane>

<!--      证件信息-->
      <el-tab-pane label="证件信息" name="second">
        <!--表格-->
        <div class="table">
          <el-table v-loading="loading" :data="certificateList">
            <el-table-column label="人员类型" align="center" prop="personnelType">
              <template #default="scope">
                <dict-tag :options="certificate_personnel_type" :value="scope.row.personnelType"/>
              </template>
            </el-table-column>
            <el-table-column label="所属部门/承包商" align="center" prop="companyName" />
            <el-table-column label="姓名" align="center" prop="personnelName" />
            <el-table-column label="岗位" align="center" prop="postName" />
            <el-table-column label="证件名称" align="center" prop="certificateName" />
            <el-table-column label="证件编号" align="center" prop="certificateNo" />
            <el-table-column label="是否过期" align="center" prop="expire" />
            <el-table-column label="有效期开始日期" align="center" prop="startDate" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期结束日期" align="center" prop="endDate" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="status" :value="scope.row.status"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button
                  type="text"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['certificateManage:certificate:edit']"
                >详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
<!--        弹出内容-->
        <!-- 添加或修改人员证书管理对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
          <el-form ref="certificateRef" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="人员类型" prop="personnelType">
              <el-radio-group v-model="form.personnelType">
                <el-radio
                  v-for="dict in certificate_personnel_type"
                  :key="dict.value"
                  :label="dict.value"
                  disabled="disabled"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="labelCompanyId" prop="companyId">
              <el-select v-if="form.personnelType == '0'" v-model="form.companyId" disabled="disabled">
                <el-option
                v-for="dept in deptList"
                :key="dept.deptId"
                :label="dept.deptName"
                :value="dept.deptId">
                </el-option>
              </el-select>
              <el-select v-else-if="form.personnelType == '1'" v-model="form.companyId" disabled="disabled">
                <el-option
                v-for="contractor in contractorList"
                :key="contractor.id"
                :label="contractor.contractorName"
                :value="contractor.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择人员" prop="personnelId">
              <el-select v-if="form.personnelType == '0'" v-model="form.personnelId" disabled="disabled">
                <el-option
                v-for="staff in staffList"
                :key="staff.staffId"
                :label="staff.staffName"
                :value="staff.staffId">
                </el-option>
              </el-select>
              <el-select v-else-if="form.personnelType == '1'" v-model="form.personnelId">
                <el-option
                v-for="personnel in personnelList"
                :key="personnel.id"
                :label="personnel.personnelName"
                disabled="disabled"
                :value="personnel.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件类型" prop="certificateType">
              <el-select v-model="form.certificateType" disabled="disabled">
                <el-option
                v-for="certificateTypeDic in certificateTypeDicList"
                :key="certificateTypeDic.id"
                :label="certificateTypeDic.typeName"
                :value="certificateTypeDic.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件名称" prop="certificateName">
              <el-input v-model="form.certificateName" placeholder="请输入证件名称" disabled="disabled"/>
            </el-form-item>
            <el-form-item label="证件编号" prop="certificateNo">
              <el-input v-model="form.certificateNo" placeholder="请输入证件编号" disabled="disabled"/>
            </el-form-item>
            <el-form-item label="发证机关" prop="certificateAgency">
              <el-input v-model="form.certificateAgency" placeholder="请输入发证机关" disabled="disabled"/>
            </el-form-item>
            <el-form-item label="证件照" prop="certificatePicture">
              <ImageUpload
              v-model.value="form.certificatePicture"
              :limit = "1"
              disabled="disabled"
              />
            </el-form-item>
            <el-form-item label="有效期开始日期" prop="startDate">
              <el-date-picker clearable
                v-model="form.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                disabled="disabled"
                placeholder="请选择有效期开始日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期结束日期" prop="endDate">
              <el-date-picker clearable
                v-model="form.endDate"
                type="date"
                disabled="disabled"
                value-format="YYYY-MM-DD"
                placeholder="请选择有效期结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in status"
                  :key="dict.value"
                  disabled="disabled"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
          </template>
        </el-dialog>
      </el-tab-pane>


<!--      培训记录-->
      <el-tab-pane label="培训记录" name="third">
        <el-card class="box-card">
          <el-form :inline="true"  class="demo-form-inline seachform">
            <el-date-picker
                v-model="trainingDate"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-form-item >
              <el-button type="primary" @click="search()" class="checkbtn">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="pxjl1">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="kcsydx">
                <div id="kcsydx"></div>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="amount">
                <div class="training_pie">
                  <img src="@/assets/images/yirenyid/ico1.png" alt="" style="width: 50px; height: 50px;">
                  <span class="fontStyle">计划未完成数</span>
                  <div >{{planData.fail}}</div>
                </div>
                <div class="training_pie">
                  <img src="@/assets/images/yirenyid/ico2.png" alt="" style="width: 50px; height: 50px;">
                  <span class="fontStyle">计划已完成</span>
                  <div >{{planData.pass}}</div>
                </div>
                <div class="training_pie">
                  <img src="@/assets/images/yirenyid/ico3.png" alt="" style="width: 50px; height: 50px;">
                  <span class="fontStyle">计划课程学习时长(分钟)</span>
                  <div >{{ coursePlanData.time  }}</div>
                </div>
                <div class="training_pie">
                  <img src="@/assets/images/yirenyid/ico4.png" alt="" style="width: 50px; height: 50px;">
                  <span class="fontStyle">自修课程</span>
                  <div >{{ courseSSData.num  }}</div>
                </div>
                <div class="training_pie">
                  <img src="@/assets/images/yirenyid/ico5.png" alt="" style="width: 50px; height: 50px;">
                  <span class="fontStyle">自修课程总时长(分钟)</span>
                  <div >{{ courseSSData.time }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
          </div>

        </el-card>
        <el-card class="box-card pxjl2">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="公司级安全教育" name="1">
              <div>
                <el-table
                    :data="companyData"
                    style="width: 100%"
                    height="240">
                  <el-table-column
                      prop="planName"
                      label="计划名称">
                  </el-table-column>
                  <el-table-column
                      prop="courseName"
                      label="课程名称">
                  </el-table-column>
                  <el-table-column
                      prop="time"
                      label="课程学习时长(分钟)">
                  </el-table-column>
                  <el-table-column
                      prop="title"
                      label="试卷名称">
                  </el-table-column>
                  <el-table-column
                      prop="passingMark"
                      label="及格分数/题目数">
                  </el-table-column>
                  <el-table-column
                      prop="totalScore"
                      label="及格分数/题目数">
                  </el-table-column>
                 <el-table-column
                    prop="pass"
                    label="是否合格">
                    <template #default="scope">
                      <span v-if="scope.row.pass == 1">是</span>
                      <span v-if="scope.row.pass == 0">否</span>
                    </template>
                </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>

            <el-collapse-item title="车间级安全教育" name="2">
              <el-table
                    :data="workshopData"
                    style="width: 100%"
                    height="240">
                  <el-table-column
                      prop="planName"
                      label="计划名称">
                  </el-table-column>
                  <el-table-column
                      prop="courseName"
                      label="课程名称">
                  </el-table-column>
                  <el-table-column
                      prop="time"
                      label="课程学习时长(分钟)">
                  </el-table-column>
                  <el-table-column
                      prop="title"
                      label="试卷名称">
                  </el-table-column>
                  <el-table-column
                      prop="passingMark"
                      label="及格分数/题目数">
                  </el-table-column>
                  <el-table-column
                      prop="totalScore"
                      label="及格分数/题目数">
                  </el-table-column>
                 <el-table-column
                    prop="pass"
                    label="是否合格">
                    <template #default="scope">
                      <span v-if="scope.row.pass == 1">是</span>
                      <span v-if="scope.row.pass == 0">否</span>
                    </template>
                </el-table-column>
                </el-table>
            </el-collapse-item>

            <el-collapse-item title="班组级安全教育" name="3">
              <el-table
                    :data="teamData"
                    style="width: 100%"
                    height="240">
                  <el-table-column
                      prop="planName"
                      label="计划名称">
                  </el-table-column>
                  <el-table-column
                      prop="courseName"
                      label="课程名称">
                  </el-table-column>
                  <el-table-column
                      prop="time"
                      label="课程学习时长(分钟)">
                  </el-table-column>
                  <el-table-column
                      prop="title"
                      label="试卷名称">
                  </el-table-column>
                  <el-table-column
                      prop="passingMark"
                      label="及格分数/题目数">
                  </el-table-column>
                  <el-table-column
                      prop="totalScore"
                      label="及格分数/题目数">
                  </el-table-column>
                 <el-table-column
                    prop="pass"
                    label="是否合格">
                    <template #default="scope">
                      <span v-if="scope.row.pass == 1">是</span>
                      <span v-if="scope.row.pass == 0">否</span>
                    </template>
                </el-table-column>
                </el-table>
            </el-collapse-item>
            <el-collapse-item title="线下培训统计" name="4">
              <el-table
                  :data="tableDatalistcj"
                  style="width: 100%"
                  height="240">
                <el-table-column
                    prop="ProjectName"
                    label="计划名称">
                </el-table-column>
                <el-table-column
                    prop="TrainingDate"
                    label="培训日期">
                </el-table-column>
                <el-table-column
                    prop="TrainingHours"
                    label="培训学时（h）">
                </el-table-column>
                <el-table-column
                    prop="score"
                    label="得分">
                </el-table-column>
                <el-table-column
                    prop="result"
                    label="培训结果">
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-card>

      </el-tab-pane>
    </el-tabs>
    </el-card>

  </div>
</template>

<script setup="personDetail">

import * as echarts from '@/utils/echarts'
import {listCertificate,getCertificate} from "@/api/certificateManage/certificate";
import { listDept } from '@/api/system/dept'
import { listStaff,getStaff } from '@/api/system/staff'
import { listContractor } from '@/api/contractorManage/contractor'
import { listPersonnel } from '@/api/contractorManage/personnel'
import { listCertificateTypeDic } from '@/api/certificateManage/certificateTypeDic'
import { getPlanCountDataByPerson,getCourseCountDataByPerson,getCourseStatsByCompany,getCourseStatsByWorkshop,getCourseStatsByTeam} from "@/api/safework/personProfile";
const { proxy } = getCurrentInstance();
const { certificate_personnel_type,sys_user_sex,status } = proxy.useDict('sys_user_sex','certificate_personnel_type', 'status');
const certificateList = ref([]);
const deptList = ref([]);
const staffList = ref([]);
const contractorList = ref([]);
const personnelList = ref([]);
const certificateTypeDicList = ref([]);
const labelCompanyId = ref("所属部门");
const trainingDate = ref('');
const data = reactive({
  staffId:proxy.$route.query.staffId,
  activeName: 'first',
  activeNames: ['1','2','3','4'],
  dialogVisible: false,
  labelPosition: 'left',
  ruleForm: {
    name: '',
  },
  rules: {
    name: [
      {required: true, message: '请输入活动名称', trigger: 'blur'},
      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
    ],
  },
  trainingDate: '',
  staffInfo:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    certificateType: null,
    status: "0",
		delFlag: "0",
    staffId:proxy.$route.query.staffId,
    userId:proxy.$route.query.userId
  },
  total:0,
  form:{},
  title:'',
  open:false,
  trainingParams:{
    startDate:'',
    endDate:'',
    staffId:proxy.$route.query.staffId,
    userId:proxy.$route.query.userId
  },
  planData:{},
  coursePlanData:{
    time:0,
    num:0,
  },
  courseSSData:{
    time:0,
    num:0,
  },
  companyData:[],
  workshopData:[],
  teamData:[],
})
const {staffInfo,staffId,queryParams,total,activeName,activeNames,form,title,open,trainingParams,planData,coursePlanData,courseSSData,companyData,workshopData,teamData} = toRefs(data);

function courseStatsCompany(){
  getCourseStatsByCompany(queryParams.value).then(response =>{
    companyData.value = response.rows
  })
}
function courseStatsWorkshop(){
  getCourseStatsByWorkshop(queryParams.value).then(response =>{
    workshopData.value = response.rows
  })
}
function courseStatsTeam(){
  getCourseStatsByTeam(queryParams.value).then(response =>{
    teamData.value = response.rows
  })
}

function courseCountDataByPerson(){
  getCourseCountDataByPerson(queryParams.value).then(response =>{
    if(response != null && response != ''){
      coursePlanData.value = response[0];
      courseSSData.value = response[1];
    }
  })
}

function planCountDataByPerson(){
  getPlanCountDataByPerson(trainingParams.value).then(response =>{
    planData.value = response
    kcsydxChart();
  })
}

function search(){
  trainingParams.value.startDate = trainingDate.value[0];
  trainingParams.value.endDate = trainingDate.value[1];
  planCountDataByPerson();
}
/** 查询部门列表 */
function getDeptList(){
	listDept({deptFlag: '0', status: '0'}).then(response => {
		deptList.value = response.data;
	})
}

/** 查询部门员工列表 */
function getStaffList(){
	listStaff({deptFlag: '0', status: '0'}).then(response => {
		staffList.value = response.rows;
	})
}

/** 查询承包商列表 */
function getContractorList(){
	listContractor({deptFlag: '0', status: '0'}).then(response => {
		contractorList.value = response.rows;
	})
}

/** 查询承包商人员列表 */
function getPersonnelList(){
	listPersonnel({deptFlag: '0', status: '0'}).then(response => {
		personnelList.value = response.rows;
	})
}

/** 查询证书类型列表 */
function getCertificateTypeDicList(){
	listCertificateTypeDic({status: '0'}).then(response => {
		certificateTypeDicList.value = response.rows;
	})
}
/** 提交按钮 */
function submitForm() {
  open.value = false;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  getCertificate(row.id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改人员证书管理";
  });
}
/** 查询人员证书管理列表 */
function getList() {
  listCertificate(queryParams.value).then(response => {
    certificateList.value = response.rows;
    total.value = response.total;
  });
}
function getStaffInfo(){
  getStaff(staffId.value).then(response => {
    staffInfo.value = response.data;
  });
}
function handleClick(tab, event) {
  console.log(tab, event);

}
function handleChange(val) {
  console.log(val);
}
function kcsydxChart() {
  let chartDom = document.getElementById('kcsydx');
  chartDom.removeAttribute('_echarts_instance_');
  let myChart = echarts.init(chartDom);
  let option;
  let _this = this;
  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '2%',
      left: 'center'
    },
    title: {
      text:'计划数',//主标题文本
      subtext:planData.value.total,//副标题文本
      left:'center',
      top:'40%',
      textStyle:{
        fontSize: 18,
        color:'#454c5c',
        align:'center'
      },
      subtextStyle:{
        fontFamily : "微软雅黑",
        fontSize: 16,
        color:'#6c7a89',
      }
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [
          { value: planData.value.pass, name: '已完成' },
          { value: planData.value.fail, name: '未完成' },
        ]
      }
    ]
  };
  option && myChart.setOption(option);
}

getStaffInfo();
getList();
getDeptList();
getStaffList();
getContractorList();
getPersonnelList();
getCertificateTypeDicList();
planCountDataByPerson();
courseCountDataByPerson();
courseStatsCompany();
courseStatsWorkshop();
courseStatsTeam();
</script>
<style scoped lang="scss">
.yirenyidangshow{
  padding: 10px;
  background: #f3f3f3;
  overflow: scroll;
  height: calc(100vh - 84px);
  .tablecon{
    border: 1px solid #e6ebf5;
    tr{
      td{
        border: 1px solid #e6ebf5;
         padding: 8px 10px;
      font-size: 12px}
      td:nth-child(odd){
        background: #fafafa;;
        text-align: right;
        width: 150px;
        color: #333;
        font-weight: 700;
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
  .seachform{
    .checkbtn{
      background: #09bec5;padding: 0 25px;border: 0;color: #fff;    margin-top: 12px;
      margin-left: 10px;
    }
  }
  .pxjl1{
    .kcsydx{
      height: 200px;

      #kcsydx{
        height: 200px;
        width: 300px;
      }
    }
.amount{
  padding-top: 48px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  border-left: 1px solid #e3e3e3;
  .training_pie{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    height: 120px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
}
  }
  .pxjl2{
    margin-top:15px;
    :deep(.el-collapse-item__header){
      text-indent: 10px;
      background: #eaf3f9;
    }
  }
}
</style>
