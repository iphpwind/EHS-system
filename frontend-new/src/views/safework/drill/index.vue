<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="演练类型" prop="drillTypeId">
        <el-select v-model="queryParams.drillTypeId" placeholder="请选择演练类型" @keyup.enter="handleQuery">
          <el-option v-for="item in drillType"
                     :key="item.id"
                     :label="item.typeName"
                     :value="item.id">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="演练形式" prop="drillModalityId">
        <el-select v-model="queryParams.drillModalityId" placeholder="请选择演练形式" @keyup.enter="handleQuery">
          <el-option v-for="item in drillModality"
                     :key="item.id"
                     :label="item.modalityName"
                     :value="item.id">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="演练级别" prop="drillLevelId">
        <el-select v-model="queryParams.drillLevelId" placeholder="请选择演练级别" @keyup.enter="handleQuery">
          <el-option v-for="item in drillLevel"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" @keyup.enter="handleQuery">
          <el-option v-for="item in stateSelect"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
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
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="drillList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="${comment}" align="center" prop="deptId" v-if="false"/>
      <el-table-column label="应急预案id" align="center" prop="planId" v-if="false"/>
      <el-table-column label="演练名称" align="center" prop="drillName"/>
      <el-table-column label="演练地点" align="center" prop="drillLocation"/>
      <el-table-column label="主办单位" align="center" prop="organizer"/>
      <el-table-column label="演练类型" align="center" prop="drillTypeId" :formatter="drillTypeFormatter"/>
      <el-table-column label="演练形式" align="center" prop="drillModalityId" :formatter="drillModalityFormatter"/>
      <el-table-column label="演练级别" align="center" prop="drillLevelId" :formatter="drillLevelFormatter"/>
      <el-table-column label="演练目的" align="center" prop="drillObjective"/>
      <el-table-column label="参演人数" align="center" prop="peopleCount"/>
      <el-table-column label="演练摘要" align="center" prop="drillAbstract"/>
      <el-table-column label="定制人" align="center" prop="drillCreateBy"/>
      <el-table-column label="定制时间" align="center" prop="drillCreateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.drillCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="演练时间" align="center" prop="drillTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.drillTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
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

    <!-- 添加或修改应急预案对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="drillRef" :model="form" :rules="rules" label-width="80px">
        <!--        <el-form-item label="${comment}" prop="deptId">-->
        <!--          <el-input v-model="form.deptId" placeholder="请输入${comment}" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="应急预案id" prop="planId">-->
        <!--          <el-input v-model="form.planId" placeholder="请输入应急预案id" />-->
        <!--        </el-form-item>-->
        <el-form-item label="演练名称" prop="drillName">
          <el-input v-model="form.drillName" placeholder="请输入演练名称"/>
        </el-form-item>
        <el-form-item label="演练地点" prop="drillLocation">
          <el-input v-model="form.drillLocation" placeholder="请输入演练地点"/>
        </el-form-item>
        <el-form-item label="主办单位" prop="organizer">
          <el-input v-model="form.organizer" placeholder="请输入主办单位"/>
        </el-form-item>
        <el-form-item label="演练类型" prop="drillTypeId">
          <el-select v-model="form.drillTypeId" placeholder="请选择演练类型">
            <el-option v-for="item in drillType"
                       :key="item.id"
                       :label="item.typeName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="演练形式" prop="drillModalityId">
          <el-select v-model="form.drillModalityId" placeholder="请选择演练形式">
            <el-option v-for="item in drillModality"
                       :key="item.id"
                       :label="item.modalityName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="演练级别" prop="drillLevelId">
          <el-select v-model="form.drillLevelId" placeholder="请选择演练形式">
            <el-option v-for="item in drillLevel"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="演练目的" prop="drillObjective">
          <el-input v-model="form.drillObjective" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="参演人数" prop="peopleCount">
          <el-input v-model="form.peopleCount" placeholder="请输入参演人数"/>
        </el-form-item>
        <el-form-item label="演练摘要" prop="drillAbstract">
          <el-input v-model="form.drillAbstract" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="定制人" prop="drillCreateBy">
          <el-input v-model="form.drillCreateBy" placeholder="请输入定制人"/>
        </el-form-item>
        <el-form-item label="定制时间" prop="drillCreateTime">
          <el-date-picker clearable
                          v-model="form.drillCreateTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择定制时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="演练时间" prop="drillTime">
          <el-date-picker clearable
                          v-model="form.drillTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择演练时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option v-for="item in stateSelect"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
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

<script setup name="Drill">
import {listDrill, getDrill, delDrill, addDrill, updateDrill} from "@/api/safework/drill";
import {listType} from "@/api/safework/drilltype";
import {listModality} from "@/api/safework/modality";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const drillList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const drillType = ref([]);
const drillModality = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    planId: null,
    drillName: null,
    drillLocation: null,
    organizer: null,
    drillTypeId: null,
    drillModalityId: null,
    drillLevelId: null,
    drillCreateBy: null,
    drillCreateTime: null,
    drillTime: null,
    state: null
  },
  rules: {},
  drillLevel: [
    {
      label: '公司级',
      value: 1
    }, {
      label: '车间级',
      value: 2
    }, {
      label: '班组级',
      value: 3
    }
  ],
  stateSelect: [
    {
      label: '正常',
      value: 0
    }, {
      label: '停用',
      value: 1
    }
  ]
});

const {queryParams, form, rules, drillLevel, stateSelect} = toRefs(data);

/** 查询应急预案列表 */
function getList() {
  loading.value = true;
  listDrill(queryParams.value).then(response => {
    drillList.value = response.rows;
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
    planId: null,
    drillName: null,
    drillLocation: null,
    organizer: null,
    drillTypeId: null,
    drillModalityId: null,
    drillLevelId: null,
    drillObjective: null,
    peopleCount: null,
    drillAbstract: null,
    drillCreateBy: null,
    drillCreateTime: null,
    drillTime: null,
    state: null
  };
  proxy.resetForm("drillRef");
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
  title.value = "添加应急预案";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getDrill(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改应急预案";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["drillRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDrill(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDrill(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delDrill(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/drill/export', {
    ...queryParams.value
  }, `drill_${new Date().getTime()}.xlsx`)
}

function initList() {
  listType({state: 0}).then(res => {
    drillType.value = res.rows
  })
  listModality({state: 0}).then(res => {
    drillModality.value = res.rows
  })
}

function drillTypeFormatter(e) {
  let result = ''
  if (e.drillTypeId) {
    drillType.value.forEach(item => {
      if (item.id == e.drillTypeId) {
        result = item.typeName
      }
    })
  }
  return result
}
function drillModalityFormatter(e) {
  let result = ''
  if (e.drillModalityId) {
    drillModality.value.forEach(item => {
      if (item.id == e.drillModalityId) {
        result = item.modalityName
      }
    })
  }
  return result
}

function drillLevelFormatter(e) {
  let result = ''
  if (e.drillLevelId) {
    drillLevel.value.forEach(item => {
      if (item.value == e.drillLevelId) {
        result = item.label
      }
    })
  }
  return result
}

function stateFormatter(e) {
  if (e.state == 0) {
    return '正常'
  }
  return '停用'
}

getList();
initList();


</script>
