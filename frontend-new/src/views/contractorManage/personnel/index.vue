<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="personnelName">
        <el-input
          v-model="queryParams.personnelName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-hasPermi="['contractorManage:personnel:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['contractorManage:personnel:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['contractorManage:personnel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['contractorManage:personnel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="personnelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属承包商" align="center" prop="contractorName" />
      <el-table-column label="姓名" align="center" prop="personnelName" />
      <el-table-column label="性别" align="center" prop="sex">
        <template #default="scope">
          <dict-tag :options="sys_user_sex" :value="scope.row.sex"/>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="身份证" align="center" prop="identityCard" />
      <el-table-column label="工作岗位" align="center" prop="post" />
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
            v-hasPermi="['contractorManage:personnel:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractorManage:personnel:remove']"
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

    <!-- 添加或修改承包商人员对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="personnelRef" :model="form" :rules="rules" label-width="92px">
				<el-form-item label="所属承包商" prop="contractorId">
					<el-select v-model="form.contractorId" placeholder="请选择承包商" clearable>
						<el-option
							v-for="t in contractorList"
							:key="t.id"
							:label="t.contractorName"
							:value="t.id"
						/>
					</el-select>
				</el-form-item>
        <el-form-item label="姓名" prop="personnelName">
          <el-input v-model="form.personnelName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="dict in sys_user_sex"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="身份证" prop="identityCard">
          <el-input v-model="form.identityCard" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="工作岗位" prop="post">
          <el-input v-model="form.post" placeholder="请输入工作岗位" />
        </el-form-item>
        <el-form-item label="本人照片">
					<ImageUpload
					v-model.value="form.picture"
					:limit = "1"
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

<script setup name="Personnel">
import { listPersonnel, getPersonnel, delPersonnel, addPersonnel, updatePersonnel } from "@/api/contractorManage/personnel";
import { listContractor } from "@/api/contractorManage/contractor";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { sys_user_sex, status } = proxy.useDict('sys_user_sex', 'status');

const contractorList = ref([]);
const personnelList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractorId: null,
    personnelName: null,
    status: "0",
		delFlag: "0"
  },
  rules: {
    contractorId: [
      { required: true, message: "承包商不能为空", trigger: "blur" }
    ],
    personnelName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    sex: [
      { required: true, message: "性别不能为空", trigger: "change" }
    ],
    phone: [
      { required: true, message: "手机号不能为空", trigger: "blur" }
    ],
    identityCard: [
      { required: true, message: "身份证不能为空", trigger: "blur" }
    ],
    post: [
      { required: true, message: "工作岗位不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询承包商列表 **/
function getContractor() {
	listContractor({status: '0', delFlag: '0'}).then(response => {
	  contractorList.value = response.rows;
	});
}

/** 查询承包商人员列表 */
function getList() {
  loading.value = true;
  listPersonnel(queryParams.value).then(response => {
    personnelList.value = response.rows;
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
    contractorId: null,
    personnelName: null,
    sex: null,
    phone: null,
    identityCard: null,
    post: null,
    picture: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("personnelRef");
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
  title.value = "添加承包商人员";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPersonnel(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改承包商人员";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["personnelRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePersonnel(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPersonnel(form.value).then(response => {
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
    return delPersonnel(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('contractorManage/personnel/export', {
    ...queryParams.value
  }, `personnel_${new Date().getTime()}.xlsx`)
}

getContractor();
getList();
</script>
