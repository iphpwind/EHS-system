<template>
  <div class="app-container">
    <el-form :model="form" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公司" prop="deptId">
        <tree-select
            v-model:value="form.enterpriseCode"
            :options="deptOptions"
            placeholder="请选择归属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button type="primary" @click="handleImport">双重预防导入</el-button>
        <el-button type="primary" @click="handleImport1">特殊作业导入</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="basedicimpList" @selection-change="handleSelectionChange">
      <el-table-column label="企业编码" align="center" prop="enterpriseCode" />
      <el-table-column label="企业名称" align="center" prop="deptName" />
      <el-table-column label="表名称" align="center" prop="tableName" />
      <el-table-column label="导入时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
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
  </div>
</template>

<script setup name="Basedicimp">
import { listBasedicimp, getBasedicimp, delBasedicimp, addBasedicimp, updateBasedicimp,importdic,importdic1 } from "@/api/safework/basedicimp";
import {treeselect} from "@/api/system/dept";

const { proxy } = getCurrentInstance();

const basedicimpList = ref([]);
const deptOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {
    enterpriseCode:null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    tableName: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询双重预防基础字典导入记录列表 */
function getList() {
  loading.value = true;
  listBasedicimp(queryParams.value).then(response => {
    basedicimpList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 初始化部门数据 */
function initTreeData() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
}

function handleImport(){
  if(form.value.enterpriseCode==null || form.value.enterpriseCode==''){
    proxy.$modal.msgError("先输入公司");
  }else{
    proxy.$modal.confirm('确定导入双重预防基础字典吗？').then(function() {
      return importdic(form.value);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("导入成功");
    }).catch(() => {});
  }
}

function handleImport1(){
  if(form.value.enterpriseCode==null || form.value.enterpriseCode==''){
    proxy.$modal.msgError("先输入公司");
  }else{
    proxy.$modal.confirm('确定导入特殊作业基础字典吗？').then(function() {
      return importdic1(form.value);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("导入成功");
    }).catch(() => {});
  }
}


/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.enterpriseCode = form.value.enterpriseCode
  getList();
}


getList();
initTreeData();
</script>
