<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="法规编号" prop="lawCode">
        <el-input
          v-model="queryParams.lawCode"
          placeholder="请输入法规编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="法律法规分类" prop="typeId" label-width="100px">
        <el-select v-model="queryParams.typeId" placeholder="请选择法律法规分类" clearable>
          <el-option
            v-for="dict in lawTypeList"
            :key="dict.id"
            :label="dict.typeName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文件名称" prop="lawName">
        <el-input
          v-model="queryParams.lawName"
          placeholder="请输入文件名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="强制程度" prop="lawLevel">
        <el-select v-model="queryParams.lawLevel" placeholder="请选择强制程度" clearable>
          <el-option key="0" label="强制性" value="0"/>
          <el-option key="1" label="推荐性" value="1"/>
        </el-select>
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
          v-hasPermi="['safework:lawManage:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:lawManage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:lawManage:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:lawManage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="lawManageList" @selection-change="handleSelectionChange">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="法规编号" align="center" prop="lawCode" />
      <el-table-column label="法律法规分类" align="center" prop="typeName" />
      <el-table-column label="文件名称" align="center" prop="lawName" />
      <el-table-column label="强制程度" align="center" prop="lawLevel" >
        <template #default="scope">
          <span v-if="scope.row.lawLevel == '0'">强制性</span>
          <span v-if="scope.row.lawLevel == '1'">推荐性</span>
        </template>
      </el-table-column>
      <el-table-column label="发布机构" align="center" prop="publishAgency" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用日期" align="center" prop="beginDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.beginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否现行" align="center" prop="activeFlag" >
        <template #default="scope">
          <span v-if="scope.row.activeFlag == '0'">是</span>
          <span v-if="scope.row.activeFlag == '1'">否</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" prop="origin" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:lawManage:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:lawManage:remove']"
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

    <!-- 添加或修改法律法规管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="lawManageRef" :model="form" :rules="rules" label-width="106px">
        <el-form-item label="法规编号" prop="lawCode">
          <el-input v-model="form.lawCode" placeholder="请输入法规编号" />
        </el-form-item>
        <el-form-item label="法律法规分类" prop="typeId">
					<el-select v-model="form.typeId" clear>
						<el-option 
							v-for="item in lawTypeList"
							:key="item.id"
							:label="item.typeName"
							:value="item.id">
						</el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="文件名称" prop="lawName">
          <el-input v-model="form.lawName" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="强制程度" prop="lawLevel">
          <el-radio-group v-model="form.lawLevel">
            <el-radio key="0" label="0">强制性</el-radio>
            <el-radio key="1" label="1">推荐性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布机构" prop="publishAgency">
          <el-input v-model="form.publishAgency" placeholder="请输入发布机构" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker clearable
            v-model="form.publishDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="启用日期" prop="beginDate">
          <el-date-picker clearable
            v-model="form.beginDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择启用日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="废止日期" prop="repealDate">
          <el-date-picker clearable
            v-model="form.repealDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择废止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input type="textarea" v-model="form.summary" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="是否现行" prop="activeFlag">
          <el-radio-group v-model="form.activeFlag">
            <el-radio key="0" label="0">是</el-radio>
            <el-radio key="1" label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="附件">
          <file-upload v-model="form.annexUrl"/>
        </el-form-item>
        <el-form-item label="复查时间" prop="reviewDate">
          <el-date-picker clearable
            v-model="form.reviewDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择复查时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="辨识人" prop="recognizor">
					<el-select v-model="form.recognizor" clear>
						<el-option 
							v-for="item in staffList"
							:key="item.staffId"
							:label="item.staffName"
							:value="item.staffId">
						</el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="辨识日期" prop="recognizeDate">
          <el-date-picker clearable
            v-model="form.recognizeDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择辨识日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="适用部门">          
					<el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
					<el-tree
					    class="tree-border"
					    :data="deptOptions"
					    show-checkbox
					    ref="deptRef"
					    node-key="id"
				    empty-text="加载中..."
				    :props="{ label: 'label', children: 'children' }"
					></el-tree>
        </el-form-item>
        <el-form-item label="来源" prop="origin">
          <el-input v-model="form.origin" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="状态">
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

<script setup name="LawManage">
import { listLawManage, getLawManage, delLawManage, addLawManage, updateLawManage } from "@/api/safework/lawManage";
import { listLawType } from "@/api/safework/lawType";
import { listStaff } from "@/api/system/staff";
import { treeselect } from "@/api/system/dept";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const lawManageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const lawTypeList = ref([]);
const staffList = ref([]);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const deptRef = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    lawCode: null,
    typeId: null,
    lawName: null,
    lawLevel: null,
    status: "0",
    delFlag: "0"
  },
  rules: {
    deptId: [
      { required: true, message: "部门编号不能为空", trigger: "blur" }
    ],
    lawCode: [
      { required: true, message: "法规编号不能为空", trigger: "blur" }
    ],
    typeId: [
      { required: true, message: "法律法规分类不能为空", trigger: "blur" }
    ],
    lawName: [
      { required: true, message: "文件名称不能为空", trigger: "blur" }
    ],
    lawLevel: [
      { required: true, message: "强制程度(0强制性1推荐性)不能为空", trigger: "blur" }
    ],
    publishDate: [
      { required: true, message: "发布日期不能为空", trigger: "blur" }
    ],
    activeFlag: [
      { required: true, message: "是否现行(0是1否)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询法律法规管理列表 */
function getList() {
  loading.value = true;
  listLawManage(queryParams.value).then(response => {
    lawManageList.value = response.rows;
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
    lawCode: null,
    typeId: null,
    lawName: null,
    lawLevel: null,
    publishAgency: null,
    publishDate: null,
    beginDate: null,
    repealDate: null,
    summary: null,
    activeFlag: null,
    annexUrl: null,
    reviewDate: null,
    recognizor: null,
    recognizeDate: null,
    origin: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    delFlag: "0",
    deptIds: [],
  };
  proxy.resetForm("lawManageRef");
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
  title.value = "添加法律法规管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getLawManage(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改法律法规管理";
    nextTick(() => {
			let checkedKeys = form.value.deptIdList;
			checkedKeys.forEach((v) => {
				nextTick(() => {
					deptRef.value.setChecked(v, true, false);
				});
			});
    });
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["lawManageRef"].validate(valid => {
    if (valid) {
			 form.value.deptIds = getDeptAllCheckedKeys();
      if (form.value.id != null) {
        updateLawManage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLawManage(form.value).then(response => {
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
    return delLawManage(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/lawManage/export', {
    ...queryParams.value
  }, `lawManage_${new Date().getTime()}.xlsx`)
}

function getLawTypeList() {
	listLawType({status:"0"}).then(response => {
    lawTypeList.value = response.rows;
  });
}

function getStaffList() {
	listStaff({delFlag:"0"}).then(response => {
    staffList.value = response.rows;
  });
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
}

/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 查询部门树结构 */
function getDeptTreeselect() {
  return treeselect().then(response => {
    deptOptions.value = response.data;
    return response;
  });
}

getDeptTreeselect();
getLawTypeList();
getStaffList();
getList();
</script>
