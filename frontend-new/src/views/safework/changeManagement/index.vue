<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="变更编码" prop="changeCode">
        <el-input
          v-model="queryParams.changeCode"
          placeholder="请输入变更编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更名称" prop="changeName">
        <el-input
          v-model="queryParams.changeName"
          placeholder="请输入变更名称"
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:changeManagement:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:changeManagement:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:changeManagement:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:changeManagement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="changeManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="变更编码" align="center" prop="changeCode" />
      <el-table-column label="变更名称" align="center" prop="changeName" />
      <el-table-column label="申请部门" align="center" prop="deptName" />
      <el-table-column label="所属区域" align="center" prop="region" />
      <el-table-column label="变更类型" align="center" prop="changeTypeName" />
      <el-table-column label="变更级别" align="center" prop="changeLevelName" />
      <el-table-column label="变更时限" align="center" prop="changeTimeName" width="180"/>
      <el-table-column label="验收状态" align="center" prop="acceptStatus" width="180">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.acceptStatus == '0'">未验收</el-row>
          <el-row justify="center" v-if="scope.row.acceptStatus == '1'">已验收</el-row>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
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
            v-hasPermi="['safework:changeManagement:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:changeManagement:remove']"
          >删除</el-button>
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

    <!-- 添加或修改变更管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="changeManagementRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="变更编码" prop="changeCode">
          <el-input v-model="form.changeCode" placeholder="请输入变更编码" />
        </el-form-item>
        <el-form-item label="变更名称" prop="changeName">
          <el-input v-model="form.changeName" placeholder="请输入变更名称" />
        </el-form-item>
        <el-form-item label="申请部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-input v-model="form.region" placeholder="请输入所属区域" />
        </el-form-item>
        <el-form-item label="变更类型" prop="changeType">
          <el-select v-model="form.changeType" placeholder="请输入变更类型">
            <el-option
                v-for="dict in typeOptions"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更级别" prop="changeLevel">
          <el-select v-model="form.changeLevel" placeholder="请输入变更级别">
            <el-option
                v-for="dict in levelOptions"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更时限" prop="changeTimeLimit">
          <el-select v-model="form.changeTimeLimit" placeholder="请输入变更时限">
            <el-option
                v-for="dict in timeLimitOptions"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio
							v-for="dict in status"
							:key="dict.value"
              :label="dict.value"
						>{{dict.label}}</el-radio>
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

<script setup name="ChangeManagement">
import { listChangeManagement, getChangeManagement, delChangeManagement, addChangeManagement, updateChangeManagement } from "@/api/safework/changeManagement";
import { listChangeType} from "@/api/safework/changeType";
import { listChangeLevel} from "@/api/safework/changeLevel";
import { listTimeLimit} from "@/api/safework/timeLimit";
import {treeselect} from "../../../api/system/dept";
import {h} from "vue";
const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const changeManagementList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const typeOptions = ref(undefined); 
const levelOptions = ref(undefined);
const timeLimitOptions = ref(undefined);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    changeCode: null,
    changeName: null,
    deptId: null,
    region: null,
    changeType: null,
    changeLevel: null,
    changeTimeLimit: null,
    status: null,
  },
  rules: {
    changeCode: [
      { required: true, message: "变更编码不能为空", trigger: "blur" }
    ],
    changeName: [
      { required: true, message: "变更名称不能为空", trigger: "blur" }
    ],
  },
  fileUrl: null,
});

const { queryParams, form, rules } = toRefs(data);

/** 查询变更时限列表 */
function getTimeLimitList() {
  listTimeLimit({status:0}).then(response => {
    timeLimitOptions.value = response.rows;
  });
}
/** 查询变更等级列表 */
function getChangeLevelList() {
  listChangeLevel({status:0}).then(response => {
    levelOptions.value = response.rows;
  });
}
/** 查询变更分类列表 */
function getChangeTypeList() {
  listChangeType({status:0}).then(response => {
    typeOptions.value = response.rows;
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
/** 查询变更管理列表 */
function getList() {
  loading.value = true;
  listChangeManagement(queryParams.value).then(response => {
    changeManagementList.value = response.rows;
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
    enterpriseCode: null,
    changeCode: null,
    changeName: null,
    deptId: null,
    region: null,
    changeType: null,
    changeLevel: null,
    changeTimeLimit: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("changeManagementRef");
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
  title.value = "添加变更管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getChangeManagement(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改变更管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["changeManagementRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateChangeManagement(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addChangeManagement(form.value).then(response => {
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
    return delChangeManagement(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/changeManagement/export', {
    ...queryParams.value
  }, `changeManagement_${new Date().getTime()}.xlsx`)
}

getList();
initTreeData();
getChangeTypeList();
getChangeLevelList();
getTimeLimitList();
</script>
