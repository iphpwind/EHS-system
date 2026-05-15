<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="部门" prop="deptIdss">
        <el-select
          ref="selectTree"
          v-model="valueName"
          :value="valueMultiple"
          multiple
          clearable
          @remove-tag="changeValue"
          @clear="clearHandle"
          placeholder="请选择"
        >
          <el-option :value="valueName" style="height: auto; background: #fff">
            <el-tree
              show-checkbox
              :data="deptOptions"
              ref="deptRef"
              node-key="id"
              id="tree-option"
              default-expand-all
              :props="{ label: 'label', children: 'children' }"
              check-strictly="true"
              @check-change="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="postIdss">
        <el-select
          filterable
          v-model="postIdList"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in postList"
            :key="item.postId"
            :label="item.postName"
            :value="item.postId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件类型" prop="certificateType">
        <el-select v-model="queryParams.certificateType">
          <el-option
            v-for="certificateTypeDic in certificateTypeDicList"
            :key="certificateTypeDic.id"
            :label="certificateTypeDic.typeName"
            :value="certificateTypeDic.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件名称" prop="certificateName">
        <el-input
          v-model="queryParams.certificateName"
          placeholder="请输入证件名称"
        />
      </el-form-item>

      <el-form-item label="姓名" prop="personnelName">
        <el-input
          v-model="queryParams.personnelName"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="到期提醒" prop="expire">
        <el-select
          v-model="queryParams.expire"
          placeholder="到期提醒"
          clearable
        >
          <el-option
            v-for="dict in expire"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
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
          v-hasPermi="['certificateManage:certificate:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['certificateManage:certificate:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['certificateManage:certificate:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['certificateManage:certificate:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="certificateList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="人员类型" align="center" prop="personnelType">
        <template #default="scope">
          <dict-tag
            :options="certificate_personnel_type"
            :value="scope.row.personnelType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="所属部门/承包商"
        align="center"
        prop="companyName"
      />
      <el-table-column label="姓名" align="center" prop="personnelName" />
      <el-table-column label="岗位" align="center" prop="postName" />
      <el-table-column label="证件名称" align="center" prop="certificateName" />
      <el-table-column label="证件编号" align="center" prop="certificateNo" />
      <el-table-column label="是否过期" align="center" prop="expire" />
      <el-table-column
        label="有效期开始日期"
        align="center"
        prop="startDate"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="有效期结束日期"
        align="center"
        prop="endDate"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['certificateManage:certificate:edit']"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['certificateManage:certificate:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改人员证书管理对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form
        ref="certificateRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <!-- <el-form-item label="人员类型" prop="personnelType">
          <el-radio-group v-model="form.personnelType">
            <el-radio
              v-for="dict in certificate_personnel_type"
              :key="dict.value"
							:label="dict.value"
							@change="resetCompany"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item :label="labelCompanyId" prop="companyId">
          <!-- <el-select v-if="form.personnelType == '0'" v-model="form.companyId" @change="deptChange">
						<el-option
            v-for="dept in deptList"
            :key="dept.deptId"
            :label="dept.deptName"
            :value="dept.deptId">
						</el-option>
					</el-select>
					<el-select v-else-if="form.personnelType == '1'" v-model="form.companyId">
						<el-option
            v-for="contractor in contractorList"
            :key="contractor.id"
            :label="contractor.contractorName"
            :value="contractor.id">
						</el-option>
					</el-select> -->
          <el-select v-model="form.companyId" @change="deptChange">
            <el-option
              v-for="dept in deptList"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择人员" prop="personnelId">
          <el-select v-model="form.personnelId">
            <el-option
              v-for="staff in staffList"
              :key="staff.staffId"
              :label="staff.staffName"
              :value="staff.staffId"
            >
            </el-option>
          </el-select>
          <!-- <el-select v-if="form.personnelType == '0'" v-model="form.personnelId">
						<el-option
            v-for="staff in staffList"
            :key="staff.staffId"
            :label="staff.staffName"
            :value="staff.staffId">
						</el-option>
					</el-select>
					<el-select v-else-if="form.personnelType == '1'" v-model="form.personnelId">
						<el-option
            v-for="personnel in personnelList"
            :key="personnel.id"
            :label="personnel.personnelName"
            :value="personnel.id">
						</el-option>
					</el-select> -->
        </el-form-item>
        <el-form-item label="证件类型" prop="certificateType">
          <el-select v-model="form.certificateType">
            <el-option
              v-for="certificateTypeDic in certificateTypeDicList"
              :key="certificateTypeDic.id"
              :label="certificateTypeDic.typeName"
              :value="certificateTypeDic.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件名称" prop="certificateName">
          <el-input
            v-model="form.certificateName"
            placeholder="请输入证件名称"
          />
        </el-form-item>
        <el-form-item label="证件编号" prop="certificateNo">
          <el-input v-model="form.certificateNo" placeholder="请输入证件编号" />
        </el-form-item>
        <el-form-item label="发证机关" prop="certificateAgency">
          <el-input
            v-model="form.certificateAgency"
            placeholder="请输入发证机关"
          />
        </el-form-item>
        <el-form-item label="证件照" prop="certificatePicture">
          <ImageUpload v-model.value="form.certificatePicture" :limit="1" />
        </el-form-item>
        <el-form-item label="有效期开始日期" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择有效期开始日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择有效期结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
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

<script setup name="Certificate">
import {
  listCertificate,
  getCertificate,
  delCertificate,
  addCertificate,
  updateCertificate,
} from "@/api/certificateManage/certificate";
import { treeselect, listDept } from "@/api/system/dept";
import { listStaff } from "@/api/system/staff";
import { listContractor } from "@/api/contractorManage/contractor";
import { listPersonnel } from "@/api/contractorManage/personnel";
import { listCertificateTypeDic } from "@/api/certificateManage/certificateTypeDic";
import { listPost } from "@/api/system/post";
import { h } from "vue";

const { proxy } = getCurrentInstance();
const { certificate_personnel_type, sys_normal_disable } = proxy.useDict(
  "certificate_personnel_type",
  "sys_normal_disable"
);

const certificateList = ref([]);
const deptList = ref([]);
const staffList = ref([]);
const contractorList = ref([]);
const personnelList = ref([]);
const certificateTypeDicList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const labelCompanyId = ref("所属部门");
// 部门筛选
const deptOptions = ref(undefined);
const valueName = ref([]);
const valueMultiple = ref([]);
const choosedValue = ref([]);

const postOptions = ref([]);
const postList = ref([]);
const postIdList = ref([]);
const postIdss = ref([]);

const expire = ref([
  // {
  //     "label": "忽略",
  //     "value": "0",

  // },
  {
    label: "到期",
    value: "1",
  },
  {
    label: "近一周",
    value: "2",
  },
  {
    label: "近一个月",
    value: "3",
  },
  {
    label: "近三个月",
    value: "4",
  },
  {
    label: "近六个月",
    value: "5",
  },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    certificateType: null,
    expire: null,
    personnelName: null,
    certificateName: null,
    postIdss: null,
    deptIdss: null,
    status: null,
    personnelType: "0",
    delFlag: "0",
  },
  staffParams: {
    deptFlag: "0",
    status: "0",
    deptId: "",
  },
  rules: {
    personnelType: [
      { required: true, message: "人员类型不能为空", trigger: "blur" },
    ],
    companyId: [
      { required: true, message: "所属部门/承包商不能为空", trigger: "change" },
    ],
    personnelId: [
      { required: true, message: "人员id不能为空", trigger: "change" },
    ],
    certificateType: [
      { required: true, message: "证件类型不能为空", trigger: "change" },
    ],
    certificateName: [
      { required: true, message: "证件名称不能为空", trigger: "blur" },
    ],
    certificateNo: [
      { required: true, message: "证件编号不能为空", trigger: "blur" },
    ],
    certificatePicture: [
      { required: true, message: "证件照不能为空", trigger: "blur" },
    ],
    startDate: [
      { required: true, message: "有效期开始日期不能为空", trigger: "blur" },
    ],
    endDate: [
      { required: true, message: "有效期结束日期不能为空", trigger: "blur" },
    ],
    status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
  },
});

console.log(status);
const { queryParams, form, rules, staffParams } = toRefs(data);

/** 查询部门列表 */
function getDeptList() {
  listDept({ deptFlag: "0", status: "0" }).then((response) => {
    deptList.value = response.data;
  });
}
function deptChange(val) {
  console.log(val);
  staffParams.value.deptId = val;
  getStaffList();
}
/** 查询部门员工列表 */
function getStaffList() {
  listStaff(staffParams.value).then((response) => {
    staffList.value = response.rows;
  });
}

/** 查询承包商列表 */
function getContractorList() {
  listContractor({ deptFlag: "0", status: "0" }).then((response) => {
    contractorList.value = response.rows;
  });
}

/** 查询承包商人员列表 */
function getPersonnelList() {
  listPersonnel({ deptFlag: "0", status: "0" }).then((response) => {
    personnelList.value = response.rows;
  });
}

/** 查询证书类型列表 */
function getCertificateTypeDicList() {
  listCertificateTypeDic({ status: "0" }).then((response) => {
    certificateTypeDicList.value = response.rows;
  });
}

/** 查询人员证书管理列表 */
function getList() {
  loading.value = true;
  console.log(queryParams.value);
  queryParams.deptIdss = valueName;
  listCertificate(queryParams.value)
    .then((response) => {
      certificateList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    })
    .catch(() => {
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
    personnelType: "0",
    companyId: null,
    personnelId: null,
    certificateType: null,
    certificateName: null,
    certificateNo: null,
    certificateAgency: null,
    certificatePicture: null,
    startDate: null,
    endDate: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
  };
  proxy.resetForm("certificateRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;

  let postvalue = [];
  queryParams.value.postIdss = "";
  if (postIdList.value.length > 0) {
    postIdList.value.forEach((item, index) => {
      postvalue.push(parseInt(item));
    });
    queryParams.value.postIdss = postvalue.join(",");
  }

  let newvalue = [];
  queryParams.deptIdss = "";
  if (choosedValue.value.length > 0) {
    choosedValue.value.forEach((item, index) => {
      newvalue.push(parseInt(item));
    });
    queryParams.value.deptIdss = newvalue.join(",");
  }
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加人员证书管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getCertificate(id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改人员证书管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["certificateRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateCertificate(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCertificate(form.value).then((response) => {
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
  proxy.$modal
    .confirm(
      h("p", null, [
        h("span", { style: "color: black" }, "确定删除该数据吗"),
        h("p", { style: "color: red" }, "删除后不可恢复!!!"),
      ]),
      {}
    )
    .then(function() {
      return delCertificate(idss);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "certificateManage/certificate/export",
    {
      ...queryParams.value,
    },
    `certificate_${new Date().getTime()}.xlsx`
  );
}

function resetCompany() {
  form.value.companyId = null;
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then((response) => {
    deptOptions.value = response.data;
  });
}

function handleNodeClick(node, checked) {
  console.log();

  // if (valueName.value.length > 0){
  if (checked) {
    // if (node.children == null || node.children == undefined) {
    let num = 0;
    valueName.value.forEach((item) => {
      item == node["label"] ? num++ : num;
    });
    if (num == 0) {
      valueName.value.push(node["label"]);
      choosedValue.value.push(node["id"]);
      choosedValue.value = [...new Set(choosedValue.value)];
      valueName.value = [...new Set(valueName.value)];
    }
    // }
  } else {
    // if (node.children == null || node.children == undefined) {
    valueName.value.map((item, index) => {
      if (node.label == item) {
        valueName.value.splice(index, 1);
      }
    });
    choosedValue.value.map((item, index) => {
      if (node.id == item) {
        choosedValue.value.splice(index, 1);
      }
    });
    // }
  }
}
// 删除单个标签
function changeValue(val) {
  const a = findItemByName(deptOptions.value, val);
  console.log(a);
  choosedValue.value.forEach((item, index) => {
    if (item == a.id) {
      choosedValue.value.splice(index, 1);
    }
  });
  let newvalue = [];
  if (choosedValue.value.length > 0) {
    choosedValue.value.forEach((item, index) => {
      newvalue.push(parseInt(item));
    });
  }
  console.log(newvalue);
  deptRef.value.setCheckedKeys(newvalue);
  // deptRef.value.setCheckedKeys([parseInt(332),333]);
}

// 递归找到符合的元素
function findItemByName(items, targetName) {
  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    if (currentItem.label === targetName) {
      return currentItem;
    }

    if (currentItem.children) {
      const foundItem = findItemByName(currentItem.children, targetName);
      if (foundItem) {
        return foundItem;
      }
    }
  }
}

function getposts() {
  listPost({ status: "0" }).then((response) => {
    postList.value = response.rows;
  });
}

getDeptList();
getStaffList();
getContractorList();
getPersonnelList();
getCertificateTypeDicList();
getList();
getTreeselect();

getposts();
</script>
