<template>
  <div class="fenjijilu">
		<div class="table">
		  <div class="header">
		    <el-row>
		      <el-col :span="12"><div class="card-tit">风险等级</div></el-col>
		      <el-col :span="12">
						<div class="toolist">
								<el-button class="btn"
										type="primary"
										plain
										@click="handleRecord"
								>记录</el-button>
								<el-button class="btn"
										type="success"
										plain
										@click="submitForm"
								>保存</el-button>
								<el-button class="btn"
										type="danger"
										plain
										@click="handleReturn"
								>返回</el-button>
						</div>
					</el-col>
				</el-row>
		  </div>

			    <el-form ref="rankingRef" :model="form" :rules="rules" label-width="260px">
			      <el-form-item label="直接判定" prop="evaluationMethod">
			        <el-checkbox v-model="form.checked" @change="clearevent"></el-checkbox>
			      </el-form-item>
			      <el-form-item label="评估方法" prop="evaluationMethod" v-if="form.checked!=true">
			        <el-select v-model="form.evaluationMethod" placeholder="请选择" @change="clearevent">
			          <el-option label="LS" value="1" />
			          <el-option label="LEC" value="2" />
			        </el-select>
			      </el-form-item>
			      <div v-if="form.checked!=true">
			        <el-form-item label="事故发生的可能性(L)" prop="evaluationL" v-if="form.evaluationMethod==1">
			          <el-select v-model="form.evaluationL" placeholder="请选择事故发生的可能性(L)">
			            <el-option label="等级1：有充分、有效的防范、控制、监测、保护措施，或员工安全卫生意识相当高，严格执行操作规程。极不可能发生事故或事件。" value="1" />
			            <el-option label="等级2：危害一旦发生能及时发现，并定期进行监测，或现场有防范控制措施，并能有效执行，或过去偶尔发生事故或事件。" value="2" />
			            <el-option label="等级3：没有保护措施（如没有保护装置、没有个人防护用品等），或未严格按操作程序执行，或危害的发生容易被发现（现场有监测系统），或曾经作过监测，或过去曾经发生类似事故或事件，或在异常情况下类似事故或事件。" value="3" />
			            <el-option label="等级4：危害的发生不容易被发现，现场没有检测系统，也未发生过任何监测，或在现场有控制措施，但未有效执行或控制措施不当，或危害常发生或在预期情况下发生。" value="4" />
			            <el-option label="等级5：在现场没有采取防范、监测、保护、控制措施，或危害的发生不能被发现（没有监测系统），或在正常情况下经常发生此类事故或事件。" value="5" />
			          </el-select>
			        </el-form-item>
			        <el-form-item label="事件后果严重性(S)" prop="evaluationSc" v-if="form.evaluationMethod==1">
			<!--          <el-select ref="selectRef"  v-model="form.evaluationSc" placeholder="请选择事件后果严重性(S)"  @click="changexianshi">
			            <el-option label="1" value="1" />
			            <el-option label="2" value="2" />
			            <el-option label="3" value="3" />
			            <el-option label="4" value="4" />
			            <el-option label="5" value="5" />
			          </el-select>-->
			          <el-popover ref="popoverRef" placement="bottom" :width="800" trigger="click">
			            <template #reference>
			              <el-button style="margin-right: 16px;width: 215px;">{{form.evaluationSc_name}}</el-button>
			            </template>
			            <el-table :data="tableData" @row-click="tableClick">
			              <el-table-column width="100" property="level" label="等级" />
			              <el-table-column width="200" property="lawyer" label="法律、法规及其他要求" />
			              <el-table-column width="100" property="user" label="人员" />
			              <el-table-column width="120" property="qian" label="财产损失/万元" />
			              <el-table-column width="150" property="gong" label="停工" />
			              <el-table-column width="100" property="image" label="公司形象" />
			            </el-table>
			          </el-popover>
			        </el-form-item>
			        <el-form-item label="事故、事件或偏差发生的可能性(L)" prop="evaluationL" v-if="form.evaluationMethod==2">
			          <el-select v-model="form.evaluationL" placeholder="事故、事件或偏差发生的可能性(L)">
			            <el-option label="（0.1分）实际不可能。" value="0.1" />
			            <el-option label="（0.2分）极不可能。" value="0.2" />
			            <el-option label="（0.5分）很不可能，可以设想。" value="0.5" />
			            <el-option label="（1分）可能性小，完全意外。" value="1" />
			            <el-option label="（3分）可能，但不经常。" value="3" />
			            <el-option label="（6分）相当可能。" value="6" />
			            <el-option label="（10分）完全可以预料。" value="10" />
			          </el-select>
			        </el-form-item>
			        <el-form-item label="暴露于危险环境的频繁程程度(E)" prop="evaluationE" v-if="form.evaluationMethod==2">
			          <el-select v-model="form.evaluationE" placeholder="暴露于危险环境的频繁程程度(E)">
			            <el-option label="（0.5分）非常罕见暴露。" value="0.5" />
			            <el-option label="（1分）每年几次暴露。" value="1" />
			            <el-option label="（2分）每月一次暴露。" value="2" />
			            <el-option label="（3分）每周一次或偶然暴露。" value="3" />
			            <el-option label="（6分）每天工作时间内暴露。" value="6" />
			            <el-option label="（10分）连续暴露。" value="10" />
			          </el-select>
			        </el-form-item>
			        <el-form-item label="发生事故事件偏差产生的后果严重性(C)" prop="evaluationSc" v-if="form.evaluationMethod==2">
			          <el-select v-model="form.evaluationSc" placeholder="发生事故事件偏差产生的后果严重性(C)">
			            <el-option label="（1分）完全符合法律法规，或人员无伤亡，或损失一万元以下，或没有设备停工，或公司形象没有受损。" value="1" />
			            <el-option label="（3分）不符合公司操作规程，或人员轻微受伤、间歇不舒服，或损失一万元以上，或一套设备停工，或引人关注，不利于基本的安全卫生要求。" value="2" />
			            <el-option label="（7分）不符合上级或行业的安全方针、制度、规定等，或人员丧失劳动力、截肢、骨折、听力丧失、慢性病，或损失10万元以上，或部分设备停工，或在公司及周边产生影响。" value="7" />
			            <el-option label="（15分）潜在违反法规和标准，或3人以下死亡，或10人以下重伤，或损失100万以上，或部分装置停工，或在地区内产生影响。" value="15" />
			            <el-option label="（40分）违反法律法规或标准，或3人以上10人以下死亡，或10人以上50人以下重伤，或损失1000万元以上，或装置停工，或在行业内、省内产生影响。" value="40" />
			            <el-option label="（100分）严重违反法律法规和标准，或10人以上死亡或50人以上重伤，或损失5000万元以上，或公司停产，或产生重大国际、国内影响。" value="100" />
			          </el-select>
			        </el-form-item>
			        <el-form-item label="">
			          <el-button type="success" style="background: #09bec5;border:0" size="mini" @click="calculate">计算</el-button>
			        </el-form-item>
			        <el-form-item label="风险值(R)" prop="riskRd" v-if="form.evaluationMethod==1">
			          <el-input v-model="form.riskRd" placeholder="请输入" readonly/>
			        </el-form-item>
			        <el-form-item label="风险值(D)" prop="riskRd" v-if="form.evaluationMethod==2">
			          <el-input v-model="form.riskRd" placeholder="请输入" readonly/>
			        </el-form-item>
			        <el-form-item label="风险等级" prop="riskLevel" class="inputDeep">
			          <span class="level" v-if="form.riskLevel=='低风险'" style="background-color: rgb(40, 140, 223);">低风险</span>
			          <span class="level" v-if="form.riskLevel=='一般风险'" style="background-color: rgb(218, 192, 17);">一般风险</span>
			          <span class="level" v-if="form.riskLevel=='较大风险'" style="background-color: rgb(239, 102, 0);">较大风险</span>
			          <span class="level" v-if="form.riskLevel=='重大风险'" style="background-color: rgb(233, 0, 0);">重大风险</span>
			        </el-form-item>
			      </div>
			      <el-form-item label="直接判定准则" prop="directJudgeId" v-if="form.checked==true">
			        <el-select v-model="form.directJudgeId" placeholder="请选择" clearable filterable>
			          <el-option
			              v-for="item in judgeoptions"
			              :key="item.id"
			              :label="item.directJudgeName"
			              :value="item.id"
			          />
			        </el-select>
			      </el-form-item>
			      <el-form-item label="风险等级" prop="riskLevel1" v-if="form.checked==true">
			        <el-select v-model="form.riskLevel1" placeholder="请选择" clearable filterable>
			          <el-option
			              v-for="item in riskleveloption"
			              :key="item.riskLevelName"
			              :label="item.riskLevelName"
			              :value="item.riskLevelName"
			          />
			        </el-select>
			      </el-form-item>
			      <el-form-item label="管控层级" prop="unitLevelId">
			        <el-select v-model="form.unitLevelId" placeholder="请选择" clearable filterable>
			          <el-option
			              v-for="item in leveloptions"
			              :key="item.id"
			              :label="item.levelName"
			              :value="item.id"
			          />
			        </el-select>
			      </el-form-item>
			      <el-form-item label="负责人" prop="userId">
			        <el-select v-model="form.userId" clearable filterable placeholder="请选择">
			          <el-option
			              v-for="item in personcolumns"
			              :key="item.userId"
			              :label="item.nickName"
			              :value="item.userId"
			          ></el-option>
			        </el-select>
			      </el-form-item>
			      <el-form-item label="措施落实情况" prop="measure">
			        <el-input v-model="form.measure" placeholder="请输入措施落实情况" type="textarea"/>
			      </el-form-item>
			      <el-form-item label="上次评估时间" prop="lastTime">
			        <el-date-picker clearable
			                        v-model="form.lastTime"
			                        type="datetime"
			                        value-format="YYYY-MM-DD HH:mm:ss"
			                        placeholder="请选择上次评估时间">
			        </el-date-picker>
			      </el-form-item>
			      <el-form-item label="末次修改时间" prop="finalTime">
			        <el-date-picker clearable
			                        v-model="form.finalTime"
			                        type="datetime"
			                        value-format="YYYY-MM-DD HH:mm:ss"
			                        placeholder="请选择末次修改时间">
			        </el-date-picker>
			      </el-form-item>
			    </el-form>

		</div>


    <el-dialog :title="title" v-model="open" width="1500px" append-to-body>
      <el-table v-loading="loading" :data="rankingList" @selection-change="handleSelectionChange">
        <el-table-column label="分析单元" align="center" prop="unitName" />
        <el-table-column label="评估方法" align="center" prop="evaluationMethod">
          <template #default="scope">
            <el-row justify="center" v-if="scope.row.evaluationMethod == 1">LS</el-row>
            <el-row justify="center" v-if="scope.row.evaluationMethod == 2">LEC</el-row>
            <el-row justify="center" v-if="scope.row.evaluationMethod == 3">直判</el-row>
          </template>
        </el-table-column>
        <el-table-column label="评估项L" align="center" prop="evaluationL" />
        <el-table-column label="评估项E" align="center" prop="evaluationE" />
        <el-table-column label="评估项S/C" align="center" prop="evaluationSc" />
        <el-table-column label="评估结果(R/D)" align="center" prop="riskRd" />
        <el-table-column label="评估人" align="center" prop="nickName" />
        <el-table-column label="评估时间" align="center" prop="createTime" />
      </el-table>
    </el-dialog>

  </div>
</template>

<script setup name="Ranking">
import { listRanking, getRanking, delRanking, addRanking, updateRanking ,getLastInfo} from "@/api/safework/ranking";
import { listRisklevel} from "@/api/safework/risklevel";
import { listJudge} from "@/api/safework/judge";
import { listLevel} from "@/api/safework/level";
import {userList} from "@/api/system/user";
import {updateUnit } from "@/api/safework/unit";

const { proxy } = getCurrentInstance();

const rankingList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const xianshi = ref("");
const judgeoptions = ref([]);
const riskleveloption = ref([]);
const leveloptions = ref([]);
const personcolumns = ref([]);
const visible = ref(false)

const data = reactive({
  xianshi:0,
  form: {
    evaluationMethod:'1',
    riskLevel:'',
    riskLevel1:'',
    checked:false,
    unitId:'',
    evaluationSc_name:'',
  },
  unitform:{
    id:'',
    userId:null,
    levelId:null,
    riskLevel:null
  },
  queryParams: {
    /*pageNum: 1,
    pageSize: 10,*/
    unitId: null,
    evaluationMethod: null,
    evaluationL: null,
    evaluationE: null,
    evaluationSc: null,
    riskRd: null,
    directJudgeId: null,
    riskLevel: null,
    unitLevelId: null,
    userId: null,
    measure: null,
    lastTime: null,
    finalTime: null,
    delFlag:0
  },
  rules: {
  },
  tableData: [{
    level: '5',
    lawyer: '违反法律、法规和标准',
    user: '死亡',
    qian:'>100',
    gong:'部分装置（>2套）或设备停工',
    image:'重大国际国内影响'
  },{
    level: '4',
    lawyer: '潜在违反法规和标准',
    user: '丧失劳动能力',
    qian:'>50',
    gong:'2套装置停工、或设备停工',
    image:'行业内、省内影响'
  },{
    level: '3',
    lawyer: '不符合上级公司或行业的安全方针、制度、规定等',
    user: '截肢、骨折、听力丧失、慢性病',
    qian:'>1',
    gong:'1套装置停工或设备',
    image:'地区影响'
  },{
    level: '2',
    lawyer: '不符合公司的安全操作程序、规定',
    user: '轻微受伤、间歇不舒服',
    qian:'<1',
    gong:'受影响不大，几乎不停工',
    image:'公司及周边范围'
  },{
    level: '1',
    lawyer: '完全符合',
    user: '无伤亡',
    qian:'无损失',
    gong:'没有停工',
    image:'形象没有受损'
  }, ]
});

const { queryParams, form, rules,tableData ,unitform} = toRefs(data);

/** 查询风险分级记录列表 */
function getList() {
  loading.value = true;
  queryParams.value.unitId = proxy.$route.query.unitId
  listRanking(queryParams.value).then(response => {
    rankingList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getjudgeList() {
  listJudge({delFlag:0}).then(response => {
    judgeoptions.value = response.rows;
  });
}
/** 查询风险等级字典列表 */
function getriskList() {
  listRisklevel(queryParams.value).then(response => {
    if(response.rows.length>0){
      response.rows.forEach((j, index) => {
        if(j.riskLevelName=='较大风险' || j.riskLevelName=='重大风险'){
          riskleveloption.value.push(j)
        }
      })
    }
  });
}

/** 查询风险分析单元管控层级字典列表 */
function getlevelList() {
  listLevel({delFlag:0}).then(response => {
    leveloptions.value = response.rows;
  });
}

/* 查询人员 */
function getUser(){
  userList().then(res => {
    personcolumns.value = res.rows
  })
}

//获取最后一次评估分值
function getInfo(){
  getLastInfo(form.value.unitId).then(response => {
    if(response.data!=null && response.data!=''){
      form.value = response.data;

      if(form.value.evaluationMethod==3){
        form.value.checked=true;
        form.value.evaluationMethod='1';
        form.value.riskLevel1=form.value.riskLevel;
        form.value.riskLevel='';
      }

      form.value.unitId = proxy.$route.query.unitId;
      form.value.userId = parseInt(proxy.$route.query.userId);
      form.value.unitLevelId = parseInt(proxy.$route.query.levelId);
      form.value.measure=null;
      form.value.lastTime=null;
      form.value.finalTime=null;
      form.value.evaluationSc_name = "等级"+form.value.evaluationSc;
    }else{
      form.value.unitId = proxy.$route.query.unitId;
      form.value.userId = parseInt(proxy.$route.query.userId);
      form.value.unitLevelId = parseInt(proxy.$route.query.levelId);
    }

  });
}

function calculate(){
  let result=0;
  let flag = true;
  if(form.value.evaluationMethod==1){//LS
    if(form.value.evaluationL==null || form.value.evaluationL==''){//事故发生的可能性(L)
      proxy.$modal.msgWarning("事故发生的可能性(L)不能为空");
      flag = false;
    }
    if(form.value.evaluationSc==null || form.value.evaluationSc==''){//事件后果严重性(S)
      proxy.$modal.msgWarning("事件后果严重性(S)不能为空");
      flag = false;
    }
    if(flag==true){
      result = (form.value.evaluationL==null ? 0:form.value.evaluationL) * (form.value.evaluationSc==null ? 0:form.value.evaluationSc)
      if(parseFloat(1)<=parseFloat(result) && parseFloat(result)<=parseFloat(8)){
        form.value.riskLevel='低风险'
      }
      if(parseFloat(9)<=parseFloat(result) && parseFloat(result)<=parseFloat(12)){
        form.value.riskLevel='一般风险'
      }
      if(parseFloat(15)<=parseFloat(result) && parseFloat(result)<=parseFloat(16)){
        form.value.riskLevel='较大风险'
      }
      if(parseFloat(20)<=parseFloat(result) && parseFloat(result)<=parseFloat(25)){
        form.value.riskLevel='重大风险'
      }
    }
  }
  if(form.value.evaluationMethod==2){//LES
    if(form.value.evaluationSc==null || form.value.evaluationSc==''){//发生事故事件偏差产生的后果严重性(C)
      proxy.$modal.msgWarning("发生事故事件偏差产生的后果严重性(C)不能为空");
      flag = false;
    }
    if(form.value.evaluationE==null || form.value.evaluationE==''){//暴露于危险环境的频繁程程度(E)
      proxy.$modal.msgWarning("暴露于危险环境的频繁程程度(E)不能为空");
      flag = false;
    }
    if(form.value.evaluationL==null || form.value.evaluationL==''){//事故、事件或偏差发生的可能性(L)
      proxy.$modal.msgWarning("事故、事件或偏差发生的可能性(L)不能为空");
      flag = false;
    }
    if(flag==true){
      result = (form.value.evaluationSc==null ? 0:form.value.evaluationSc) * (form.value.evaluationE==null ? 0:form.value.evaluationE) * (form.value.evaluationL==null ? 0:form.value.evaluationL)
      if(parseFloat(0)<=parseFloat(result) && parseFloat(result)<=parseFloat(69)){
        form.value.riskLevel='低风险'
      }else if(parseFloat(70)<=parseFloat(result) && parseFloat(result)<=parseFloat(159)){
        form.value.riskLevel='一般风险'
      }else if(parseFloat(160)<=parseFloat(result) && parseFloat(result)<=parseFloat(319)){
        form.value.riskLevel='较大风险'
      }else if(parseFloat(320)<=parseFloat(result) && parseFloat(result)<=parseFloat(10000)){
        form.value.riskLevel='重大风险'
      }
    }
  }
  form.value.riskRd = result;
}


function tableClick(row){

  if(row.level==5){
    form.value.evaluationSc_name='等级5'
    form.value.evaluationSc = 5;
  }
  if(row.level==4){
    form.value.evaluationSc_name='等级4'
    form.value.evaluationSc = 4;
  }
  if(row.level==3){
    form.value.evaluationSc_name='等级3'
    form.value.evaluationSc = 3;
  }
  if(row.level==2){
    form.value.evaluationSc_name='等级2'
    form.value.evaluationSc = 2;
  }
  if(row.level==1){
    form.value.evaluationSc_name='等级1'
    form.value.evaluationSc = 1;
  }
  let that=this
  proxy.$refs["popoverRef"].hide()
}

function clearevent(){
  form.value.evaluationL = null
  form.value.evaluationE = null
  form.value.evaluationSc = null
  form.value.riskRd = null
  form.value.riskLevelId = null
  form.value.riskLevel = null
  form.value.unitLevelId = null
  form.value.userId = null
  form.value.measure = null
  form.value.lastTime = null
  form.value.finalTime = null
  form.value.evaluationSc_name = ''
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    evaluationL: null,
    evaluationE: null,
    evaluationSc: null,
    riskRd: null,
    riskLevelId: null,
    unitLevelId: null,
    userId: null,
    measure: null,
    lastTime: null,
    finalTime: null
  };
  proxy.resetForm("rankingRef");
}

/** 提交按钮 */
function submitForm() {
  if(form.value.checked==true){
    form.value.evaluationMethod=3;
    form.value.riskLevel=form.value.riskLevel1;
    form.value.evaluationSc='';
    form.value.evaluationL='';
    form.value.evaluationE='';
    form.value.riskRd='';
  }else{
    form.value.directJudgeId=''
  }
  proxy.$refs["rankingRef"].validate(valid => {
    if (valid) {
      addRanking(form.value).then(response => {
        unitform.value.id = form.value.unitId
        unitform.value.levelId = form.value.unitLevelId
        unitform.value.riskLevel = form.value.riskLevel
        unitform.value.userId = form.value.userId
        unitform.value.code = proxy.$route.query.code

        const today = new Date()
        const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
        unitform.value.effeTime = nextYear

        updateUnit(unitform.value).then(res => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          proxy.$router.push({
            path: '/safework/fxlevel/unit',
          })
        });
      });
    }
  });
}
/**查看记录*/
function handleRecord(){
  open.value = true;
  getList();
  title.value = "风险分级记录";
}

//返回
function handleReturn(){
  proxy.$router.push({
    path: '/safework/fxlevel/unit',
  })
}

/** 删除按钮操作 */
/*function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除风险分级记录编号为"' + idss + '"的数据项？').then(function() {
    return delRanking(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}*/

/** 导出按钮操作 */
/*function handleExport() {
  proxy.download('safework/ranking/export', {
    ...queryParams.value
  }, `ranking_${new Date().getTime()}.xlsx`)
}*/

//getList();
form.value.unitId = proxy.$route.query.unitId;
getjudgeList();
getriskList();
getlevelList();
getUser();
getInfo();
</script>
<style scoped lang="scss">
.level{
  border-radius: 5px;
  padding: 0 5px;
  color: #fff;
}
.fenjijilu{
	  padding: 10px;background: #f3f3f4;
	  height: calc(100vh - 84px);
		.toolist{
			text-align: right;margin-top: -5px;
		}
		.table{
		  padding: 10px;border: 1px solid #eee;background: #fff;
		  box-shadow: 0 0 5px #eee;border-radius: 5px;
		  height: 100%;position: relative;
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
		}
}
</style>
