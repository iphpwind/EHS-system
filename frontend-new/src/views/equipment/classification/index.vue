<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择归属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="分类标签" prop="cateId">
        <el-select v-model="queryParams.cateId" clearable filterable placeholder="请选择">
          <el-option
              v-for="item in cateOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入分类编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
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
          v-hasPermi="['equipment:classification:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="Edit"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['equipment:classification:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:classification:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="Download"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:classification:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="classificationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="分类标签" align="center" prop="cateName" />
      <el-table-column label="分类编码" align="center" prop="code" />
      <el-table-column label="分类名称" align="center" prop="name" />
<!--      <el-table-column label="状态" align="center" prop="status" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleCheck(scope.row)"
            v-hasPermi="['equipment:classification:edit']"
          >查看属性</el-button>
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:classification:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:classification:remove']"
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

    <!-- 添加或修改设备分类对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="classificationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="分类标签" prop="cateId">
          <el-select v-model="form.cateId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in cateOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <div class="attr">
        <div class="addbtn"><el-button @click="addAttr">新增属性</el-button></div>
        <div class="attr-buttom">
          <el-row :gutter="10" >
            <el-col :span="10">名称</el-col>
            <el-col :span="10">排序</el-col>
            <el-col :span="4">操作</el-col>
          </el-row>
        </div>

        <div v-for="(value,index) in form.eqClassAttributesList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input v-model="value.attrName"></el-input>
            </el-col>
            <el-col :span="10">
              <el-input v-model="value.orderNum"></el-input>
            </el-col>
            <el-col :span="4">
<!--              <el-input v-model="value.orderNum"></el-input>-->
              <el-button @click="deleteAttr(index,value.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 查看分类属性对话框 -->
    <el-dialog :title="title" v-model="sxopen" width="700px" append-to-body>
<!--      <el-form ref="classificationRef" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="所属部门" prop="deptId">-->
<!--          <tree-select-->
<!--              v-model:value="form.deptId"-->
<!--              :options="deptOptions"-->
<!--              placeholder="请选择归属部门"-->
<!--              :objMap="{ value: 'id', label: 'label', children: 'children' }"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="所属类别" prop="cateId">-->
<!--          <el-select v-model="form.cateId" clearable filterable placeholder="请选择">-->
<!--            <el-option-->
<!--                v-for="item in cateOptions"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="编码" prop="code">-->
<!--          <el-input v-model="form.code" placeholder="请输入编码" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="名称" prop="name">-->
<!--          <el-input v-model="form.name" placeholder="请输入名称" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <div class="attr">
        <div class="attr-buttom">
          <el-row :gutter="10" >
            <el-col :span="12">名称</el-col>
            <el-col :span="12">排序</el-col>
          </el-row>
        </div>

        <div v-for="(value,index) in form.eqClassAttributesList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input disabled v-model="value.attrName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input disabled v-model="value.orderNum"></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--          <el-button @click="cancel">取 消</el-button>-->
<!--        </div>-->
<!--      </template>-->
    </el-dialog>
  </div>
</template>

<script setup name="Classification">
import { listClassification, getClassification, delClassification, addClassification, updateClassification } from "@/api/equipment/classification";
import { listAttributes,delAttributes } from "@/api/equipment/classattributes";
import { listCategory } from "@/api/equipment/category";
import {treeselect} from "@/api/system/dept";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const classificationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const cateOptions = ref([]);
const deptOptions = ref(undefined);
const attrIds = ref([]);
const sxopen = ref(false);
// const eqClassAttributesList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    cateId: null,
    code: null,
    name: null,
    status: null,
  },
  rules: {
    deptId: [
      { required: true, message: "所属部门不能为空", trigger: "blur" }
    ],
    cateId: [
      { required: true, message: "所属类别不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备分类列表 */
function getList() {
  loading.value = true;
  listClassification(queryParams.value).then(response => {
    classificationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getCate(){
  listCategory().then(res => {
    cateOptions.value = res.rows;
    // console.log(cateOptions.value)
  })
}
function addAttr(){
  console.log("77777777")
  let item = {
    attrName:'',
    orderNum:''
  }
  console.log(form.value)
  form.value.eqClassAttributesList.push(item)
}
function deleteAttr(index,id){

  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    if (id) {
      return delAttributes(id);
    }
  }).then(() => {
    form.value.eqClassAttributesList.splice(index,1)
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});

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
    cateId: null,
    code: null,
    name: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    eqClassAttributesList: []
  };
  proxy.resetForm("classificationRef");
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
  initTreeData();
  open.value = true;
  title.value = "添加设备分类";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  initTreeData();
  const id = row.id || ids.value
  getClassification(id).then(response => {
    form.value = response.data;
    listAttributes({classId:id}).then(res => {
      if(res.total>0){
        form.value.eqClassAttributesList = res.rows;
      }else {
        form.value.eqClassAttributesList = [];
      }
    })
    open.value = true;
    title.value = "修改设备分类";
  });

}
function handleCheck(row) {
  const id = row.id
  listAttributes({classId:id}).then(res => {
    if(res.total>0){
      form.value.eqClassAttributesList = res.rows;
      sxopen.value = true;
      title.value = "查看分类属性";
    }else {
      form.value.eqClassAttributesList = [];
      sxopen.value = true;
      title.value = "查看分类属性";
      // proxy.$modal.msgSuccess("修改成功");
    }
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classificationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateClassification(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClassification(form.value).then(response => {
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
    return delClassification(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/classification/export', {
    ...queryParams.value
  }, `classification_${new Date().getTime()}.xlsx`)
}

getList();
getCate();
initTreeData();
</script>
<style lang="scss">
  .attr{
    padding:10px 20px 20px;
    .attr-buttom{
      border-bottom: 1px solid #f5f5f5;
      padding: 10px;
      background: #fbfbfb;
    }
    .attrli{

      margin: 10px 0;
    }
    .addbtn{
      margin-bottom: 10px;
    }
  }
  .toolsline{
    height: 30px;
  }
</style>
