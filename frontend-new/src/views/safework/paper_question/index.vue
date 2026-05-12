<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编码" prop="questionCode">
        <el-input
            v-model="queryParams.questionCode"
            placeholder="请输入编码"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属分类" prop="classificationId">
        <el-select v-model="queryParams.classificationId" clearable @keyup.enter="handleQuery" placeholder="请输入分类">
          <el-option
              v-for="item in classificationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="难易度" prop="facilityValue">
        <el-select v-model="queryParams.facilityValue" clearable @keyup.enter="handleQuery" placeholder="请输入难易度">
          <el-option
              v-for="item in facilityValueList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目内容" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入题目内容"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="发布状态" prop="releaseState">
        <el-select v-model="queryParams.releaseState" clearable @keyup.enter="handleQuery" placeholder="请输入题目类型">
          <el-option
              v-for="item in releaseStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['safework:paper_question:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['safework:paper_question:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['safework:paper_question:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:paper_question:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paper_questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="所属机构" align="center" prop="deptId" v-if="false"/>
      <el-table-column label="编码" align="center" prop="questionCode"/>
      <el-table-column label="所属分类" align="center" prop="classificationId" :formatter="classFormatter"/>
      <el-table-column label="难易度" align="center" prop="facilityValue" :formatter="facilityValueFormatter"/>
      <el-table-column label="题目类型" align="center" prop="questionType" :formatter="questionTypeFormatter"/>
      <el-table-column label="题目内容" align="center" prop="title"/>
      <el-table-column label="分数" align="center" prop="fraction"/>
      <el-table-column label="发布状态" align="center" prop="releaseState" :formatter="releaseStateFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['safework:paper_question:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['safework:paper_question:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改线上教育-题库对话框 -->
    <el-dialog :title="title" v-model="open" width="620px" append-to-body>
      <el-form ref="paper_questionRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="编码" prop="questionCode">
          <el-input v-model="form.questionCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="所属分类" prop="classificationId">
          <el-select v-model="form.classificationId" placeholder="请输入所属分类">
            <el-option
                v-for="item in classificationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难易度" prop="facilityValue">
          <el-select v-model="form.facilityValue" placeholder="请输入难易度">
            <el-option
                v-for="item in facilityValueList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目类型" prop="questionType">
          <el-radio-group v-model="timuleixing"
                          @change="timuLeixing">
            <el-radio label="1">单选题</el-radio>
            <el-radio label="2">多选题</el-radio>
            <el-radio label="3">判断题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目内容" prop="title">
          <el-input v-model="form.title" placeholder="请输入题目内容"/>
        </el-form-item>
        <el-form-item label="配图地址" prop="pictureUrl">
          <!-- <el-input v-model="form.pictureUrl" placeholder="请输入配图地址"/> -->
          <!--					<el-upload action="" list-type="picture-card"-->
          <!--					:auto-upload="false"-->
          <!--					:multiple="true"-->
          <!--					:on-preview="handlePictureCardPreview"-->
          <!--					>-->
          <!--            -->
          <!--						<el-icon><Plus /></el-icon>-->
          <!--					</el-upload>-->
          <ImageUpload
              v-model.value="form.pictureUrl"
          />
          <div class="redtips">注:支持图片格png,peg,jpg,gif</div>
          <div class="uploadpicview">
            <el-dialog v-model="dialogPeitu">
              <img w-full :src="dialogPeitusUrl"/>
            </el-dialog>
          </div>
        </el-form-item>
        <el-form-item label="分数" prop="fraction">
          <el-input v-model="form.fraction" placeholder="请输入分数"/>
        </el-form-item>
        <el-form-item label="选项" prop="optionsJson">
          <!-- <el-input v-model="form.optionsJson" type="textarea" placeholder="请输入内容"/> -->
          <!-- 单选、多选 -->
          <div v-for="(domain, index) in domains" v-if="addbtnShow == true" style="width: 100%;">
            <el-row style="margin: 0 0 10px;">
              <el-col :span="18">
                <el-input v-model="domain.value">
                  <template #prepend>{{ domain.enname }}</template>
                </el-input>
              </el-col>
              <el-col :span="6">
                <div @click.prevent="removeDomain(domain)"
                     style="margin-left: 10px;display: inline-block;cursor: pointer;">
                  <el-icon>
                    <DeleteFilled/>
                  </el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 判断 -->
          <div v-if="addbtnShow == false" style="width: 100%;">
            <div>
              <el-row style="margin: 0 0 10px;">
                <el-col :span="18">
                  <el-input model-value="正确">
                    <template #prepend>A</template>
                  </el-input>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <el-row style="margin: 0 0 10px;">
                <el-col :span="18">
                  <el-input model-value="错误">
                    <template #prepend>B</template>
                  </el-input>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
            </div>

          </div>
          <el-button type="primary" @click="addDomain" v-if="addbtnShow == true">
            <el-icon style="margin-right: 5px">
              <Plus/>
            </el-icon>
            添加选项
          </el-button>
        </el-form-item>
        <div v-if="danxuananswerShow == true">
          <el-form-item label="正确答案" prop="correctJson">
            <!-- <el-input v-model="form.correctJson" type="textarea" placeholder="请输入内容"/> -->
            <el-radio-group v-model="rightanswer">
              <el-radio v-for="(answer, index) in answers" :label="index">{{ answer.enname }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="duoxuananswerShow == true">
          <el-form-item label="正确答案" prop="correctJson">
            <el-checkbox-group v-model="rightanswer2">
              <el-checkbox v-for="(answer, index) in answers" :label="index">
                <template #default>
                  {{ answer.enname }}
                </template>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div v-if="panduananswerShow == true">
          <el-form-item label="正确答案" prop="correctJson">
            <el-radio-group v-model="rightanswer3">
              <el-radio label="1">A</el-radio>
              <el-radio label="2">B</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="题目解析" prop="analysis">
          <el-input v-model="form.analysis" placeholder="请输入题目解析"/>
        </el-form-item>
        <el-form-item label="知识点出自" prop="comeFrom">
          <el-input v-model="form.comeFrom" placeholder="请输入知识点出自"/>
        </el-form-item>
        <el-form-item label="题目类型" prop="releaseState">
          <el-select v-model="form.releaseState" placeholder="请输入题目类型">
            <el-option
                v-for="item in releaseStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Paper_question">
import {
  listPaper_question,
  getPaper_question,
  delPaper_question,
  addPaper_question,
  updatePaper_question
} from "@/api/safework/paper_question";
import {
  listClassification
} from "@/api/safework/classification";
import { listCategory} from "@/api/safework/category";
import {h} from "vue";
const dialogPeitusUrl = ref('')
const dialogPeitu = ref(false)

const {proxy} = getCurrentInstance();

const paper_questionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const classificationList = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    questionCode: null,
    classificationId: null,
    facilityValue: null,
    questionType: null,
    title: null,
    pictureUrl: null,
    fraction: null,
    optionsJson: null,
    correctJson: null,
    analysis: null,
    comeFrom: null,
    releaseState: null
  },
  rules: {},
  facilityValueList: [
    {
      label: '易',
      value: 1
    }, {
      label: '中',
      value: 2
    }, {
      label: '难',
      value: 3
    }
  ],
  questionTypeList: [
    {
      label: '单选题',
      value: 1
    }, {
      label: '多选题',
      value: 2
    }, {
      label: '判断',
      value: 3
    }
  ],
  releaseStateList: [
    {
      label: '未发布',
      value: 0
    }, {
      label: '已发布',
      value: 1
    }
  ],
});

const {queryParams, form, rules, facilityValueList, questionTypeList, releaseStateList} = toRefs(data);


function handlePictureCardPreview(e) {
  //console.log(JSON.parse(JSON.stringify(e)).url)
  dialogPeitusUrl.value = JSON.parse(JSON.stringify(e)).url
  dialogPeitu.value = true
}

function questionTypeFormatter(item) {
  let str = ''
  questionTypeList.value.forEach(e => {
    if (e.value == item.questionType) {
      str = e.label
    }
  })
  return str
}


function classFormatter(item) {
  let str = ''
  console.log(item)
  classificationList.value.forEach(e => {
    if (e.id == item.classificationId) {
      str = e.classificationName
    }
  })
  return str
}

function facilityValueFormatter(e) {
  if (e.facilityValue == 1) {
    return '易'
  } else if (e.facilityValue == 2) {
    return '中'
  } else if (e.facilityValue == 3) {
    return '难'
  }
}

// function questionTypeFormatter(e) {
//   if (e.questionType == 1) {
//     return '单选题'
//   } else if (e.questionType == 2) {
//     return '多选题'
//   } else if (e.questionType == 3) {
//     return '判断题'
//   }
// }

function releaseStateFormatter(e) {
  if (e.releaseState == 0) {
    return '未发布'
  } else if (e.releaseState == 1) {
    return '已发布'
  }
}

/** 查询线上教育-题库列表 */
function getList() {
  loading.value = true;
  listPaper_question(queryParams.value).then(response => {
    paper_questionList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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
    deptId: null,
    questionCode: null,
    classificationId: null,
    facilityValue: null,
    questionType: null,
    title: null,
    pictureUrl: null,
    fraction: null,
    optionsJson: null,
    correctJson: null,
    analysis: null,
    comeFrom: null,
    releaseState: null
  };
  proxy.resetForm("paper_questionRef");
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


/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPaper_question(id).then(response => {
    form.value = response.data;
    open.value = true;
    loadQuestion()
    title.value = "修改线上教育-题库";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["paper_questionRef"].validate(valid => {
    if (valid) {
      buildQuestion()
      if (form.value.id != null) {
        updatePaper_question(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPaper_question(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

function loadQuestion() {
  console.log(form.value)
  timuleixing.value = form.value.questionType + ""
   let options = JSON.parse(form.value.optionsJson)
   let correct = JSON.parse(form.value.correctJson)
  let rightOption = []
  domains.value = []

  for (let i = 0; i < options.length; i++) {
    domains.value.push({
      value: options[i].value,
      enname: options[i].option
    })
    for (let j = 0; j < correct.length; j++) {
      if (options[i].value == correct[j].value) {
        rightOption.push(i)
      }
    }
  }
  console.log(domains.value)
  if (timuleixing.value == 3) {
    addbtnShow.value = false
    panduananswerShow.value = true
    rightanswer3.value = rightOption[0] + 1 + ""
  } else if (timuleixing.value == 2) {
    addbtnShow.value = true
    duoxuananswerShow.value = true
    answers.value = domains.value
    console.log(answers.value)
    rightanswer2.value = rightOption
  } else {
    addbtnShow.value = true
    danxuananswerShow.value = true
    answers.value = domains.value
    rightanswer.value = rightOption[0]
  }
}


function buildQuestion() {
  let optionsJson = []
  domains.value.forEach(item => {
    optionsJson.push({
      value: item.value,
      option: item.enname
    })
  })
  let correct;
  if (timuleixing.value == 3) {
    optionsJson = []
    optionsJson.push({
      value: '正确',
      option: 'A'
    })
    optionsJson.push({
      value: '错误',
      option: 'B'
    })
    correct = [optionsJson[rightanswer3.value - 1]]
  } else if (timuleixing.value == 2) {
    let data = []
    rightanswer2.value.forEach(item => {
      data.push(optionsJson[item])
    })
    correct = data
  } else {
    correct = [optionsJson[rightanswer.value]]
  }
  form.value.questionType = timuleixing.value
  form.value.optionsJson = optionsJson
  form.value.correctJson = correct
  console.log( form.value)
}


/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delPaper_question(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/paper_question/export', {
    ...queryParams.value
  }, `paper_question_${new Date().getTime()}.xlsx`)
}

function getClassList() {
  listCategory({state: 0}).then(res => {
    classificationList.value = res.rows
    console.log(classificationList.value)
  })
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加线上教育-题库";
  domains.value = [];
  answers.value = [];
  timuleixing.value = '1';
  rightanswer.value = '';
  rightanswer2.value = [];
  rightanswer3.value = '';
  danxuananswerShow.value = false;
  duoxuananswerShow.value = false;
  panduananswerShow.value = false;
  addbtnShow.value = true;
}

// 题目类型
const domains = ref([]);
const answers = ref([]);
const rightanswer = ref('');
const rightanswer2 = ref([]);
const rightanswer3 = ref('');
const timuleixing = ref("1");
const danxuananswerShow = ref(false);
const duoxuananswerShow = ref(false);
const panduananswerShow = ref(false);
const addbtnShow = ref(true);

function timuLeixing() {
  rightanswer.value = '';
  rightanswer2.value = [];
  rightanswer3.value = '';
  if (timuleixing.value == '1') {
    if (domains.value.length > 0) {
      danxuananswerShow.value = true;
    }
    duoxuananswerShow.value = false;
    panduananswerShow.value = false;
    addbtnShow.value = true;
  } else if (timuleixing.value == '2') {
    danxuananswerShow.value = false;
    if (domains.value.length > 0) {
      duoxuananswerShow.value = true;
    }
    panduananswerShow.value = false;
    addbtnShow.value = true;
  } else if (timuleixing.value == '3') {
    danxuananswerShow.value = false;
    duoxuananswerShow.value = false;
    panduananswerShow.value = true;
    addbtnShow.value = false;
  }
}

//新增选项
function addDomain() {
  domains.value.push({
    value: '',
    enname: ''
  });
  answers.value.push({
    value: '',
    enname: ''
  });
  //console.log(domains.value.length)
  for (var num = 1; num <= domains.value.length; num++) {
    var stringName = "";
    if (num > 0) {   //按英文字母排序
      if (num >= 1 && num <= 26) {
        stringName = String.fromCharCode(64 + parseInt(num));
      } else {
        while (num > 26) {
          var count = parseInt(num / 26);
          var remainder = num % 26;
          if (remainder == 0) {
            remainder = 26;
            count--;
            stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
          } else {
            stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
          }
          num = count;
        }
        stringName = String.fromCharCode(64 + parseInt(num)) + stringName;
      }
    }
    domains.value[num - 1].enname = stringName;
    answers.value[num - 1].enname = stringName;
  }
  timuLeixing()
}

function removeDomain(item) {
  const index = domains.value.indexOf(item)
  if (index !== -1) {
    domains.value.splice(index, 1)
    answers.value.splice(index, 1)
  }
  //console.log(domains.value.length)
  for (var num = 1; num <= domains.value.length; num++) {
    var stringName = "";
    if (num > 0) {   //按英文字母排序
      if (num >= 1 && num <= 26) {
        stringName = String.fromCharCode(64 + parseInt(num));
      } else {
        while (num > 26) {
          var count = parseInt(num / 26);
          var remainder = num % 26;
          if (remainder == 0) {
            remainder = 26;
            count--;
            stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
          } else {
            stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
          }
          num = count;
        }
        stringName = String.fromCharCode(64 + parseInt(num)) + stringName;
      }
    }
    domains.value[num - 1].enname = stringName;
    answers.value[num - 1].enname = stringName;
  }
}

// const num = ref(1);
// function addXuanxiang() {
// 	var xxbox = document.getElementById("xxbox");
// 	var xxboxhtml = xxbox.innerHTML;
// 	var answerbox = document.getElementById("rightanswer");
// 	var answerhtml = answerbox.innerHTML;

// 	var stringName = "";
// 	if(num.value > 0) {   //按英文字母排序
// 		if(num.value >= 1 && num.value <= 26) {
// 			 stringName = String.fromCharCode(64 + parseInt(num.value));
// 		} else {
// 			 while(num.value > 26) {
// 				 var count = parseInt(num.value/26);
// 				 var remainder = num.value%26;
// 				 if(remainder == 0) {
// 					 remainder = 26;
// 					 count--;
// 					 stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
// 				 } else {
// 					 stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
// 				 }
// 				 num.value = count;
// 			 }
// 			 stringName = String.fromCharCode(64 + parseInt(num.value)) + stringName;
// 		}
// 	}

// 	xxbox.innerHTML = xxboxhtml + '<div class="xxitem">' + stringName +
// 										'<input type="text" /></div>';
// 	answerbox.innerHTML = answerhtml + '<div class="answeritem"><input type="radio" name="' +
// 										stringName + '" value="option' +
// 										stringName + '" />' +
// 									 stringName + '</div>'
// 	num.value++;
// }

getClassList();
getList();


</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.uploadpicview img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.redtips {
  font-size: 12px;
  color: red;
  width: 100%;
}

#xxbox {
  width: 100%;
  margin: 0 0 10px;
}

.xxitem {
  padding-left: 15px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 0 0 10px;
}

.xxitem input {
  border: 0;
  border-left: 1px solid #ddd;
  line-height: 32px;
  margin-left: 15px;
  width: calc(100% - 50px);
  outline: none;
  padding: 0 10px;
}

.answeritem {
  display: inline-block;
  margin-right: 15px;
}

.answeritem input {
  vertical-align: middle;
  display: inline-block;
  margin-top: 0;
}
</style>
