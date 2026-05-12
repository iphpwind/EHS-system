<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="聚通平台部门ID:" prop="bjtDeptId">
        <el-select v-model="queryParams.bjtDeptId" filterable placeholder="请选择">
          <el-option
              v-for="item in restaurants"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
              @keyup.enter="handleQuery">
          </el-option>
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
            v-hasPermi="['system:config:add']"
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
            v-hasPermi="['system:config:edit']"
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
            v-hasPermi="['system:config:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:config:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="聚通部门ID" align="center" prop="bjtDeptId" :formatter="deptFormatter"/>
      <el-table-column label="真源部门ID" align="center" prop="zyDeptId"/>
      <el-table-column label="厂区ID" align="center" prop="orgId"/>
      <el-table-column label="地图ID" align="center" prop="areaId"/>
      <el-table-column label="真源clientId" align="center" prop="clientId"/>
      <el-table-column label="真源clientSecret" align="center" prop="clientSecret"/>
      <el-table-column label="真源MQ队列名" align="center" prop="mqQueuesName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:config:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:config:remove']"
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

    <!-- 添加或修改真源部门配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="configRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="聚通部门ID" prop="bjtDeptId">
          <el-autocomplete
              v-model="form.bjtDeptName"
              :fetch-suggestions="querySearch"
              placeholder="请输入聚通平台部门ID"
              @select="handleSelect"
              style="width: 100%"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="真源部门ID" prop="zyDeptId">
          <el-input v-model="form.zyDeptId" placeholder="请输入真源平台部门ID"/>
        </el-form-item>
        <el-form-item label="厂区ID" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入厂区ID"/>
        </el-form-item>
        <el-form-item label="地图ID" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入地图ID"/>
        </el-form-item>
        <el-form-item label="真源clientId" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入clientId"/>
        </el-form-item>
        <el-form-item label="真源clientSecret" prop="clientSecret">
          <el-input v-model="form.clientSecret" placeholder="请输入clientSecret"/>
        </el-form-item>
        <el-form-item label="真源MQ队列名" prop="mqQueuesName">
          <el-input v-model="form.mqQueuesName" placeholder="请输入mqQueuesName"/>
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

<script setup name="Config">
import {listConfig, getConfig, delConfig, addConfig, updateConfig} from "@/api/system/zyconfig";
import {allCompany} from "@/api/system/positioning";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const configList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const restaurants = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    bjtDeptId: null,
    zyDeptId: null,
    orgId: null,
    areaId: null,
    clientId: null,
    clientSecret: null
  },
  rules: {
    bjtDeptId: [
      {required: true, message: "聚通平台部门ID不能为空", trigger: "blur"}
    ],
    zyDeptId: [
      {required: true, message: "真源平台部门ID不能为空", trigger: "blur"}
    ],
    orgId: [
      {required: true, message: "厂区id不能为空", trigger: "blur"}
    ],
    areaId: [
      {required: true, message: "地图id不能为空", trigger: "blur"}
    ],
    clientId: [
      {required: true, message: "$comment不能为空", trigger: "blur"}
    ],
    clientSecret: [
      {required: true, message: "$comment不能为空", trigger: "blur"}
    ],
    mqQueuesName: [
      {required: true, message: "队列名不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询真源部门配置列表 */
function getList() {
  loading.value = true;
  listConfig(queryParams.value).then(response => {
    configList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function getAllCompany() {
  allCompany().then(res => {
    restaurants.value = res.data
  })
}

function deptFormatter(item) {
  let str = ''
  restaurants.value.forEach(i => {
    if (i.deptId == item.bjtDeptId) {
      str = i.deptName
    }
  })
  return str
}

function querySearch(queryString, cb) {
  var results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants;
  let res = []
  results.forEach(item => {
    res.push({
      value: item.deptName,
      id: item.deptId
    })
  })
  cb(res);
}

function createFilter(queryString) {
  return (restaurant) => {
    return (restaurant.deptName.includes(queryString));
  };
}

function handleSelect(item) {
  console.log(item);
  form.value.bjtDeptId = item.id
  form.value.bjtDeptName = item.value
  console.log(form.value.bjtDeptId)
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    bjtDeptId: null,
    zyDeptId: null,
    orgId: null,
    areaId: null,
    clientId: null,
    clientSecret: null,
    mqQueuesName: null,
    bjtDeptName: null
  };
  proxy.resetForm("configRef");
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
  title.value = "添加真源部门配置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getConfig(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改真源部门配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["configRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateConfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addConfig(form.value).then(response => {
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
    return delConfig(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/config/export', {
    ...queryParams.value
  }, `config_${new Date().getTime()}.xlsx`)
}
getAllCompany()
getList();
</script>
