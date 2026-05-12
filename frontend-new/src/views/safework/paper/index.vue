<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="编码" prop="paperCode">
        <el-input
            v-model="queryParams.paperCode"
            placeholder="请输入编码"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试卷名称" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入试卷名称"
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
            v-hasPermi="['safework:paper:add']"
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
            v-hasPermi="['safework:paper:edit']"
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
            v-hasPermi="['safework:paper:remove']"
        >删除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            icon="Download"-->
<!--            @click="handleExport"-->
<!--            v-hasPermi="['safework:paper:export']"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="所属机构" align="center" prop="deptId" v-if="false"/>
      <el-table-column label="所属分类" align="center" prop="classificationId" :formatter="classFormatter"/>
      <el-table-column label="编码" align="center" prop="paperCode"/>
      <el-table-column label="试卷名称" align="center" prop="title"/>
      <el-table-column label="命题方式" align="center" prop="propositionMethod" :formatter="topicFormatter"/>
      <el-table-column label="考试时长(分钟)" align="center" prop="duration"/>
      <el-table-column label="发布状态" align="center" prop="releaseState" :formatter="releaseStateFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['safework:paper:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['safework:paper:remove']"
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

    <!-- 添加或修改线上教育-试卷对话框 -->
    <el-dialog :title="title" v-model="open" width="60%" append-to-body custom-class="mydialog">
      <el-form ref="paperRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="所属分类" prop="classificationId">
          <el-select v-model="form.classificationId" placeholder="请选择所属分类">
            <el-option
                v-for="item in classificationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷编码" prop="paperCode">
          <el-input v-model="form.paperCode" placeholder="请输入试卷编码"/>
        </el-form-item>
        <el-form-item label="试卷名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入试卷名称"/>
        </el-form-item>
        <el-form-item label="通过有效期(天)" prop="validity">
          <el-input v-model="form.validity" placeholder="请输入通过有效期"/>
        </el-form-item>
        <el-form-item label="命题方式" prop="propositionMethod" >
          <el-select v-model="propositionMethod"
                     placeholder="请选择所属分类"
                     @change="mingtiMethodChange"
                     :disabled="form.id != null">
            <el-option
                v-for="item in mingtioptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-if="gudingbox === true">
<!--          <el-form-item label="是否按题目类型给分" prop="releaseState">-->
<!--            <el-radio-group v-model="antimuleixing"-->
<!--                            @change="antimuLeixing">-->
<!--              <el-radio label="1">否</el-radio>-->
<!--              <el-radio label="2">是</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
          <div v-if="antimuleixingyes === true">
            <el-form-item label="单选分值" prop="danxuanfenzhi">
              <el-input v-model="form.singleChoiceScore" @change="resetScoreCount"/>
            </el-form-item>
            <el-form-item label="多选分值" prop="danxuanfenzhi">
              <el-input v-model="form.multipleChoiceScore" @change="resetScoreCount"/>
            </el-form-item>
            <el-form-item label="判断分值" prop="danxuanfenzhi">
              <el-input v-model="form.judgeScore" @change="resetScoreCount"/>
            </el-form-item>
          </div>
          <div class="timutable">
            <el-table :data="timuData" border style="width: 100%">
              <el-table-column type="index" width="50"/>
              <el-table-column label="题目类型" property="questionType" width="80"
                               :formatter="questionTypeFormatter"></el-table-column>
              <el-table-column label="题目">
                <template #default="scope">
                  {{ scope.row.title }}
                </template>
              </el-table-column>
              <el-table-column label="分数" width="100">
                <template #default="scope">
                  <el-input readonly v-model="scope.row.fraction" style="width: 100%;"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <div class="timuhandle">
                    <el-icon @click="timuMoveDown(scope.$index, scope.row)">
                      <SortDown/>
                    </el-icon>
                    <el-icon @click="timuMoveUp(scope.$index, scope.row)">
                      <SortUp/>
                    </el-icon>
                    <el-icon @click="timuDelete(scope.$index, scope.row)" style="color: red;">
                      <Delete/>
                    </el-icon>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="addtimu">
              <el-icon>
                <Plus/>
              </el-icon>
              添加问题
            </el-button>
          </div>
          <div v-if="antimuleixingyes === true">
            <el-form-item label="单选总分" prop="danxuanzongfen">
              <el-input v-model="singleChoiceScoreCount" disabled/>
            </el-form-item>
            <el-form-item label="多选总分" prop="danxuanzongfen">
              <el-input v-model="multipleChoiceScoreCount" disabled/>
            </el-form-item>
            <el-form-item label="判断总分" prop="danxuanzongfen">
              <el-input v-model="judgeScoreCount" disabled/>
            </el-form-item>
          </div>
        </div>
        <div v-if="suijibox === true">
<!--          <el-form-item label="是否按题目类型给分" prop="releaseState">-->
<!--            <el-radio-group v-model="antimuleixing2"-->
<!--                            @change="antimuLeixing2">-->
<!--              <el-radio label="1">否</el-radio>-->
<!--              <el-radio label="2">是</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
          <div v-if="antimuleixingyes2 === true">
            <el-row :gutter="15">
              <el-col :span="8">
                <el-form-item label="单选题目数">
                  <el-input v-model="singleChoiceNum" @change="resetScoreCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单选分值">
                  <el-input v-model="form.singleChoiceScore" @change="resetScoreCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单选总分">
                  <el-input v-model="singleChoiceScoreCount" disabled/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="8">
                <el-form-item label="多选题目数">
                  <el-input v-model="multipleChoiceNum" @change="resetScoreCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="多选分值">
                  <el-input v-model="form.multipleChoiceScore" @change="resetScoreCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="多选总分">
                  <el-input v-model="multipleChoiceScoreCount" disabled/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="8">
                <el-form-item label="判断题目数">
                  <el-input v-model="judgeNum" @change="resetScoreCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="判断分值">
                  <el-input v-model="form.judgeScore" @change="resetScoreCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="判断总分">
                  <el-input v-model="judgeScoreCount"  disabled/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="propositionMethod == 1">
          <el-form-item label="题目总数量" prop="questionCount">
            <el-input v-model="form.questionCount" placeholder="请输入题目总数量"/>
          </el-form-item>
        </div>
        <!-- <div v-if="propositionMethod != 1">
          <el-form-item label="题目总分" prop="timuAmount">
            <el-input v-model="form.allScoreCount" placeholder="请输入题目总分"/>
          </el-form-item>
        </div> -->
        <el-form-item label="及格分数/正确题目数量" prop="passingMark">
          <el-input v-model="form.passingMark" placeholder="请输入及格分数"/>
        </el-form-item>
        <el-form-item label="考试时长(min)" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入考试时长"/>
        </el-form-item>
<!--        <el-form-item label="结果公布方式" prop="resultMethod">-->
<!--          <el-input v-model="form.resultMethod" placeholder="请输入考试时长"/>-->
<!--        </el-form-item>-->
        <el-form-item label="其他注意事项" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入其他注意事项"/>
        </el-form-item>
        <el-form-item label="发布状态" prop="releaseState">
          <el-radio-group v-model="form.releaseState">
            <el-radio label="0" size="large">未发布</el-radio>
            <el-radio label="1" size="large">已发布</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="状态" prop="releaseState">-->
<!--          <el-radio-group v-model="form.mainState" class="ml-4">-->
<!--            <el-radio label="1" size="large">正常</el-radio>-->
<!--            <el-radio label="2" size="large">停用</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加题目弹出 -->
    <div class="addtimutanchu">
      <el-dialog
          v-model="dialogAddtimu"
          title="选择题库"
          width="60%"
      >
        <div class="search">
          <el-row :gutter="15">
            <el-col :span="7">
              <el-form-item label="所属分类">
                <el-select v-model="fenleiValue">
                  <el-option
                      v-for="item in classificationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="题目类型">
                <el-select v-model="tmlxValue">
                  <el-option
                      v-for="item in tmlxoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="题目内容">
                <el-input placeholder="请输入题目名称" v-model="selectTitle"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="getAllTimu">查询</el-button>
            </el-col>
          </el-row>
          <el-table
              ref="multipleTableRef"
              :data="timutableData"
              style="width: 100%"
              @selection-change="timuchoose"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column property="id" label="id" v-if="false"/>
            <el-table-column property="questionCode" label="编码" width="120"/>
            <el-table-column property="classificationId" label="所属分类" width="120"/>
            <el-table-column property="questionType" label="题目类型" width="100" :formatter="questionTypeFormatter"/>
            <el-table-column property="fraction" label="分数" width="100"/>
            <el-table-column property="title" label="题目内容"/>
          </el-table>
        </div>
        <template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogAddtimu = false">取消</el-button>
						<el-button type="primary" @click="addtimuConfirm">
							确定
						</el-button>
					</span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup name="Paper">
import {listPaper, getPaper, delPaper, addPaper, updatePaper} from "@/api/safework/paper";
import {
  listPaper_question
} from "@/api/safework/paper_question";
import {
  listClassification
} from "@/api/safework/classification";
import { getAllQuestionByPaperQuestionIds } from "@/api/safework/paper_question_selection";
import { listCategory} from "@/api/safework/category";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const paperList = ref([]);
const singleChoiceNum = ref(0);
const multipleChoiceNum = ref(0);
const judgeNum = ref(0);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const singleChoiceScoreCount = ref(0);
const multipleChoiceScoreCount = ref(0);
const judgeScoreCount = ref(0);
const title = ref("");
const classificationList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    classificationId: null,
    paperCode: null,
    title: null,
    validity: null,
    propositionMethod: null,
    topicType: null,
    passingMark: null,
    duration: null,
    releaseState: null
  },
  rules: {
    questionCount: [
      {required: true, message: "题目数量不能为空", trigger: "blur"}, {
        min: 2,
        max: 20,
        pattern:/^[1-9]\d*$/,
        message: "题目数量必须大于0",
        trigger: "blur"
      }
    ],
  },
  releaseStateList: [
    {
      label: '未发布',
      value: 0
    }, {
      label: '已发布',
      value: 1
    }
  ],
  propositionMethodList: [{
    label: '固定命题',
    value: 0
  }, {
    label: '随机命题',
    value: 1
  }]
});
const fenleiValue = ref("")
const fenleioptions = ref([])
const tmlxValue = ref("")
const tmlxoptions = ref([
  {
    value: '1',
    label: '单选',
  },
  {
    value: '2',
    label: '多选',
  },
  {
    value: '3',
    label: '判断',
  },
])
const timutableData = ref([])


const {queryParams, form, rules, releaseStateList} = toRefs(data);


/** 查询线上教育-试卷列表 */
function getList() {
  loading.value = true;
  listPaper(queryParams.value).then(response => {
    paperList.value = response.rows;
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
    classificationId: null,
    paperCode: null,
    title: null,
    validity: null,
    propositionMethod: null,
    topicType: null,
    passingMark: null,
    duration: null,
    remark: null,
    releaseState: null,
    singleChoiceScore: null,
    multipleChoiceScore: null,
    judgeScore: null,
    singleChoiceQuantity: null,
    multipleChoiceQuantity: null,
    judgeQuantity: null,
    questionCount: 0,
    allScoreCount: 0,
    questions: []
  };
  timuData.value = []
  proxy.resetForm("paperRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加线上教育-试卷";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPaper(id).then(response => {
    form.value = response.data;
    form.value.releaseState = response.data.releaseState + ""
    propositionMethod.value = response.data.propositionMethod + ""
    if (response.data.propositionMethod == 0) {
      gudingbox.value = true
      antimuleixing.value = response.data.topicType + ""
      getAllQuestionByPaperQuestionIds({testPaperId: response.data.id}).then(res => {
        timuData.value = res.data
      })
    } else if (response.data.propositionMethod == 1) {
      suijibox.value = true
      getAllQuestionByPaperQuestionIds({testPaperId: response.data.id}).then(res => {
        let score = 0
        res.data.forEach(e => {
          score += e.fraction
        })
        // form.value.questionCount = res.data.length;
        form.value.allScoreCount = score
      })
      resetScoreCount()
    }
    open.value = true;
    title.value = "修改线上教育-试卷";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["paperRef"].validate(valid => {
    buildFixedPropositionForm()
    if (valid) {
      if (form.value.id != null) {
        updatePaper(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPaper(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

function questionTypeFormatter(item) {
  let str = ''
  tmlxoptions.value.forEach(e => {
    if (e.value == item.questionType) {
      str = e.label
    }
  })
  return str
}

function classFormatter(item) {
  let str = ''
  classificationList.value.forEach(e => {
    if (e.id == item.classificationId) {
      str = e.name
    }
  })
  return str
}

function releaseStateFormatter(item) {
  let str = ''
  releaseStateList.value.forEach(e => {
    if (e.value == item.releaseState) {
      str = e.label
    }
  })
  return str
}

function topicFormatter(item) {
  let str = ''
  if (0 == item.propositionMethod) {
    str = '固定命题'
  } else {
    str = '随机命题'
  }
  return str
}


function buildFixedPropositionForm() {
  form.value.propositionMethod = propositionMethod.value
  if (propositionMethod.value == 0 && antimuleixing.value == 1) {
    let questions = []
    timuData.value.forEach(e => {
      questions.push({
        id: e.id,
        score: e.fraction
      })
    })
    form.value.questions = questions
    form.value.topicType = antimuleixing.value

  }

  if (propositionMethod.value == 0 && antimuleixing.value == 2) {
    let questions = []
    timuData.value.forEach(e => {
      questions.push({
        id: e.id,
        type: e.questionType
      })
    })
    form.value.questions = questions
    form.value.topicType = antimuleixing.value

  }

  if (propositionMethod.value == 1 && antimuleixing2.value == 1) {
    form.value.topicType = antimuleixing2.value
  }

  if (propositionMethod.value == 1 && antimuleixing2.value == 2) {
    form.value.singleChoiceQuantity = singleChoiceNum.value
    form.value.multipleChoiceQuantity = multipleChoiceNum.value
    form.value.judgeQuantity = judgeNum.value
    form.value.topicType = antimuleixing2.value
  }
}


/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delPaper(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/paper/export', {
    ...queryParams.value
  }, `paper_${new Date().getTime()}.xlsx`)
}

//命题方式start
const propositionMethod = ref("");
const mingtioptions = [
  {
    value: '0',
    label: '固定',
  },
  {
    value: '1',
    label: '随机命题',
  }
]
const gudingbox = ref(false)
const suijibox = ref(false)
const antimuleixing = ref("1");
const selectTitle = ref("");
const antimuleixingyes = ref(false);
const antimuleixing2 = ref("1");
const antimuleixingyes2 = ref(false);
const timuData = ref([]);
const dialogAddtimu = ref(false);
const timuArr = ref([]);

function mingtiMethodChange() {
  if (propositionMethod.value === '0') {  //固定
    gudingbox.value = true;
    suijibox.value = false;

  } else if (propositionMethod.value === '1') {  //随机
    gudingbox.value = false;
    suijibox.value = true;

  }
}

function antimuLeixing() {
  if (antimuleixing.value === '1') {  //否
    antimuleixingyes.value = false;

  } else if (antimuleixing.value === '2') {  //是
    antimuleixingyes.value = true;
  }
}

function antimuLeixing2() {
  if (antimuleixing2.value === '1') {  //否
    antimuleixingyes2.value = false;

  } else if (antimuleixing2.value === '2') {  //是
    antimuleixingyes2.value = true;
  }
}

function addtimu(rows) {
  dialogAddtimu.value = true;
  proxy.$refs["multipleTableRef"].clearSelection();
  getAllTimu()
}

function getAllTimu() {
  listPaper_question({
    classificationId: fenleiValue.value,
    questionType: tmlxValue.value,
    title: selectTitle.value
  }).then(res => {
    timutableData.value = res.rows
  })
}

function addtimuConfirm() {
  dialogAddtimu.value = false;
  for (var i = 0; i < timuArr.value.length; i++) {
    timuData.value.push(timuArr.value[i])
  }
}

//选题
function timuchoose(val) {
  timuArr.value = val;
}

// 题目操作
function timuMoveUp(index, row) {
  if (index > 0) {
    let upDate = timuData.value[index - 1];
    timuData.value.splice(index - 1, 1);
    timuData.value.splice(index, 0, upDate);
  } else {
    alert('已经是第一条，不可上移');
  }
}

function timuMoveDown(index, row) {
  if ((index + 1) === timuData.value.length) {
    alert('已经是最后一条，不可下移');
  } else {
    let downDate = timuData.value[index + 1];
    timuData.value.splice(index + 1, 1);
    timuData.value.splice(index, 0, downDate);
  }
}

function timuDelete(index, row) {
  timuData.value.splice(index, 1)
}

function getClassList() {
  listCategory({state: 0}).then(res => {
    classificationList.value = res.rows
  })
}

function resetScoreCount() {
  let score1 = 0
  let score2 = 0
  let score3 = 0
  if (propositionMethod.value == '0') {  //固定
    timuData.value.forEach(e => {
      if (e.questionType == 1) {
        score1 += Number(form.value.singleChoiceScore)
      } else if (e.questionType == 2) {
        score2 += Number(form.value.multipleChoiceScore)
      } else if (e.questionType == 3) {
        score3 += Number(form.value.judgeScore)
      }
    })
  } else if (propositionMethod.value == '1') {  //随机
    score1 = Number(form.value.singleChoiceScore) * singleChoiceNum.value
    score2 = Number(form.value.multipleChoiceScore) * multipleChoiceNum.value
    score3 = Number(form.value.judgeScore) * judgeNum.value
  }
  singleChoiceScoreCount.value = score1
  multipleChoiceScoreCount.value = score2
  judgeScoreCount.value = score3
}

//命题方式end

getList();
getAllTimu()
getClassList()

</script>
<style scoped lang="scss">
.timutable {
  padding-left: 150px;
  margin: 0 0 20px;

  .el-table {
    margin: 0 0 10px;

    .timuhandle {

      .el-icon {
        margin: 0 6px;
        cursor: pointer;

      }
    }
  }

}

.mydialog {
  .el-input {
    width: 214px;
  }
}
</style>
