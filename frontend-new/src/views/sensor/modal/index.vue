<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container down-tree">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="70px">
          <el-form-item label="模型名称" prop="modalName">
            <el-input
              v-model="queryParams.modalName"
              placeholder="请输入模型名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
    <!--      <el-form-item label="描述" prop="modalMemo">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.modalMemo"-->
    <!--          placeholder="请输入描述"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--        />-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="品牌" prop="modalBrand">-->
    <!--        <el-input-->
    <!--          v-model="queryParams.modalBrand"-->
    <!--          placeholder="请输入品牌"-->
    <!--          clearable-->
    <!--          @keyup.enter="handleQuery"-->
    <!--        />-->
    <!--      </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8 toolsline">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['sensor:modal:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['sensor:modal:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['sensor:modal:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['sensor:modal:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table height="calc(100vh - 300px)" v-loading="loading" :data="modalList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="模型编号" align="center" prop="modalCode" />
          <el-table-column label="模型名称" align="center" prop="modalName" />
          <!-- <el-table-column label="具体分类" align="center" prop="modalTypecode" />
          <el-table-column label="类型分类" align="center" prop="modalTypeclass" /> -->
    <!--      <el-table-column label="描述" align="center" prop="modalMemo" />-->
    <!--      <el-table-column label="品牌" align="center" prop="modalBrand" />-->
    <!--      <el-table-column label="型号" align="center" prop="modalType" />-->
    <!--      <el-table-column label="备注" align="center" prop="remark" />-->
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width operate" width="300" fixed="right">
            <template #default="scope">

              <el-button
                type="text"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['sensor:modal:edit']"
              >修改</el-button>
              <el-button
                type="text"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['sensor:modal:remove']"
              >删除</el-button>



              <el-popover
                  placement="left"
                  :width="320"
                  trigger="hover"
              >
                <router-link :to="'/sensor/modalYc/index/' + scope.row.modalCode" class="link-type yaoli">
                  <el-button  type="text"  icon="Document">遥测</el-button>
                </router-link>
                <router-link :to="'/sensor/modalYx/index/' + scope.row.modalCode" class="link-type yaoli">
                  <el-button  type="text"  icon="DocumentRemove">遥信</el-button>
                </router-link>
                <router-link :to="'/sensor/modalYk/index/' + scope.row.modalCode" class="link-type yaoli">
                  <el-button type="text"  icon="DocumentCopy">遥控</el-button>
                </router-link>
                <router-link :to="'/sensor/modalYxStatus/index/' + scope.row.modalCode" class="link-type yaoli">
                  <el-button type="text"  icon="DocumentCopy">运行状态</el-button>
                </router-link>

                <template #reference>
                  <el-button>更多</el-button>
                </template>
              </el-popover>

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

        <!-- 添加或修改传感器模板对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
          <el-form ref="modalRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="模型名称" prop="modalName">
              <el-input v-model="form.modalName" placeholder="请输入模型名称" />
            </el-form-item>
            <el-form-item label="公司" v-if="deptList != ''">
              <el-select v-model="form.deptId" placeholder="请选择公司" clearable>
                <el-option
                    v-for="dict in deptList"
                    :key="dict.deptId"
                    :label="dict.deptName"
                    :value="dict.deptId"
                />
            </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="modalMemo">
              <el-input v-model="form.modalMemo" placeholder="请输入描述" />
            </el-form-item>
            <el-form-item label="品牌" prop="modalBrand">
              <el-input v-model="form.modalBrand" placeholder="请输入品牌" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Modal">
import {treeselect} from "@/api/system/dept";
import { listModal, getModal, delModal, addModal, updateModal } from "@/api/sensor/modal";
import { getDeptListBySecondDeptId,saveCurrChildrenDeptId } from "@/api/system/dept";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const modalList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptList = ref([]);
const compDisplay = ref(false);
const deptOptions = ref(undefined);
const deptName = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    modalName: null,
    modalTypecode: null,
    modalTypeclass: null,
    modalMemo: null,
    modalBrand: null,
    modalType: null,
    deptId: null
  },
  rules: {
    modalName: [{required: true, message: "模型名称不能为空", trigger: "blur"}],
  }
});

const { queryParams, form, rules } = toRefs(data);

const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
};

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};


function getDeptListDeptId(){
  getDeptListBySecondDeptId().then(response =>{
    deptList.value = response.data;
  })
}

/** 查询传感器模板列表 */
function getList() {
  loading.value = true;
  listModal(queryParams.value).then(response => {
    modalList.value = response.rows;
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
    modalCode: null,
    modalName: null,
    modalTypecode: null,
    modalTypeclass: null,
    modalMemo: null,
    modalBrand: null,
    modalType: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    deptId: null
  };
  proxy.resetForm("modalRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.deptId = "";
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.modalCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getDeptListDeptId();
  open.value = true;
  title.value = "添加传感器模板";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  compDisplay.value = false;
  reset();
  getDeptListDeptId();
  const modalCode = row.modalCode || ids.value
  getModal(modalCode).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改传感器模板";


    deptList.value.forEach(function (arr, index) {
      console.log("arr",arr.deptId);
      console.log("form",form.value.deptId);
       if(arr.deptId == form.value.deptId){
          compDisplay.value = true
       }
    })
    console.log(compDisplay.value);
    if(compDisplay.value){
      form.value.deptId = form.value.deptId
    }else{
      form.value.deptId = '';
    }
  });


}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["modalRef"].validate(valid => {
    if (valid) {
      if (form.value.modalCode != null) {
        updateModal(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addModal(form.value).then(response => {
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
  const modalCodes = row.modalCode || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delModal(modalCodes);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/modal/export', {
    ...queryParams.value
  }, `modal_${new Date().getTime()}.xlsx`)
}
getTreeselect();
getList();
</script>

<style lang="scss" scoped>

.yaoli{
  margin-right: 12px;
}
.toolsline{
  height: 30px;
}
</style>
