<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="82px">
      <el-form-item label="承包商类型" prop="typeId">
				<el-select v-model="queryParams.typeId" placeholder="请选择承包商类型" clearable>
          <el-option
            v-for="t in typeList"
            :key="t.id"
            :label="t.typeName"
            :value="t.id"
          />
				</el-select>
      </el-form-item>
      <el-form-item label="单位名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入单位名称"
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
          v-hasPermi="['contractorManage:contractor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['contractorManage:contractor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['contractorManage:contractor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['contractorManage:contractor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="承包商名称" align="center" prop="contractorName" />
      <el-table-column label="所属企业" align="center" prop="deptName" />
      <el-table-column label="社会信用代码" align="center" prop="socialCreditCode" />
      <el-table-column label="承包商类型" align="center" prop="typeName" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系电话" align="center" prop="phone" />
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
            v-hasPermi="['contractorManage:contractor:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractorManage:contractor:remove']"
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

    <!-- 添加或修改承包商对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="contractorRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="承包商名称" prop="contractorName">
          <el-input v-model="form.contractorName" placeholder="请输入承包商名称" />
        </el-form-item>
				<el-form-item label="承包商类型" prop="typeId">
					<el-select v-model="form.typeId" placeholder="请选择承包商类型" clearable>
						<el-option
							v-for="t in typeList"
							:key="t.id"
							:label="t.typeName"
							:value="t.id"
						/>
					</el-select>
				</el-form-item>
        <el-form-item label="社会信用代码" prop="socialCreditCode">
          <el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicense">
					<ImageUpload
					v-model.value="form.businessLicense"
					:limit = "1"
					/>
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="form.businessScope" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="form.mail" placeholder="请输入邮箱" />
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

<script setup name="Contractor">
import { listContractor, getContractor, delContractor, addContractor, updateContractor } from "@/api/contractorManage/contractor";
import { listContractorTypeDic } from "@/api/contractorManage/contractorTypeDic";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const typeList = ref([]);
const contractorList = ref([]);
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
    deptName: null,
    typeId: null,
		delFlag: "0"
  },
  rules: {
    contractorName: [
      { required: true, message: "承包商名称不能为空", trigger: "blur" }
    ],
    socialCreditCode: [
      { required: true, message: "社会信用代码不能为空", trigger: "blur" }
    ],
    typeId: [
      { required: true, message: "承包商类型不能为空", trigger: "change" }
    ],
    businessLicense: [
      { required: true, message: "营业执照不能为空", trigger: "blur" }
    ],
    contact: [
      { required: true, message: "联系人不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    delFlag: [
      { required: true, message: "删除标志不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询承包商类型列表 **/
function getContractorTypeDic() {
	listContractorTypeDic({status: '0'}).then(response => {
		typeList.value = response.rows;
	})
}

/** 查询承包商列表 */
function getList() {
  loading.value = true;
  listContractor(queryParams.value).then(response => {
    contractorList.value = response.rows;
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
    contractorName: null,
    deptId: null,
    socialCreditCode: null,
    typeId: null,
    businessLicense: null,
    businessScope: null,
    contact: null,
    phone: null,
    mail: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("contractorRef");
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
  title.value = "添加承包商";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getContractor(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改承包商";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["contractorRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateContractor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addContractor(form.value).then(response => {
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
    return delContractor(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('contractorManage/contractor/export', {
    ...queryParams.value
  }, `contractor_${new Date().getTime()}.xlsx`)
}

getContractorTypeDic();
getList();
</script>
