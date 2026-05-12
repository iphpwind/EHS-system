<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['environment:environment-area:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Sort"
            @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        height="calc(100vh - 180px)"
        v-if="refreshTable"
        v-loading="loading"
        :data="areaList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="区域名称" align="center" prop="areaName"/>
      <el-table-column label="所属部门" align="center" prop="deptName"/>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['environment:environment-area:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['environment:environment-area:add']"
          >新增
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['environment:environment-area:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改工业区域对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="areaRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父级区域" prop="parentId">
          <tree-select
              v-model:value="form.parentId"
              :options="areaOptions"
              :objMap="{ value: 'id', label: 'areaName', children: 'children' }"
              value-key="id"
              placeholder="请选择父级区域"
              check-strictly
          />
        </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称"/>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in status"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
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

<script setup name="Area">
import {listArea, getArea, delArea, addArea, updateArea,getFlag} from "@/api/environment/environmentArea";
import {treeselect} from "../../../api/system/dept";
import {h} from "vue";

const {proxy} = getCurrentInstance();
const {status} = proxy.useDict('status');

const areaList = ref([]);
const areaOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(true);
const refreshTable = ref(true);
const deptOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    delFlag: 0
  },
  rules: {
    deptId: [
      {required: true, message: "所属部门不能为空", trigger: "blur"}
    ],
    areaName: [
      {required: true, message: "区域名称不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询区域列表 */
function getList() {
  loading.value = true;
  listArea(queryParams.value).then(response => {
    loading.value = false;
    areaList.value = proxy.handleTree(response.data, "id", "parentId");
  });
}

/** 查询区域下拉树结构 */
async function getTreeselect() {
  areaOptions.value = [];
  await listArea({delFlag: "0"}).then(response => {
    const data = {id: 0, areaName: '顶级节点', children: []};
    data.children = proxy.handleTree(response.data, "id", "parentId");
    areaOptions.value.push(data);
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
    parentId: null,
    ancestors: null,
    areaName: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    deptId: null
  };
  proxy.resetForm("areaRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
async function handleAdd(row) {
  reset();
  await getTreeselect();
  if (row != null && row.id) {
    form.value.parentId = row.id;
  } else {
    form.value.parentId = 0;
  }
  open.value = true;
  title.value = "添加区域";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.parentId = row.id;
  }
  getArea(row.id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改区域";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["areaRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        getFlag(form.value).then(res => {
          if(res.data.length>0 || form.value.parentId=='0'){
            updateArea(form.value).then(response => {
              proxy.$modal.msgSuccess("修改成功");
              open.value = false;
              getList();
            });
          }else{
            proxy.$modal.msgError("非法修改：上级区域的所属部门是当前添加区域的所属部门的下级或者平级");
          }
        })
      } else {
        //先判断父区域得所属部门是否是当前新增区域所属部门得父级
        getFlag(form.value).then(res => {
          if(res.data.length>0 || form.value.parentId=='0'){
            addArea(form.value).then(response => {
              proxy.$modal.msgSuccess("新增成功");
              open.value = false;
              getList();
            });
          }else{
            proxy.$modal.msgError("非法添加：上级区域的所属部门是当前添加区域的所属部门的下级或者平级");
          }
        })
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delArea(row.id);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};

getList();
initTreeData();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
