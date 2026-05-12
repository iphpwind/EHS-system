<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="选择年份" prop="years">
        <el-date-picker
            v-model="queryParams.years"
            type="year"
            @change="selectYear"
            placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="Plus"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['safework:rplist:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="Edit"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['safework:rplist:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="Delete"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['safework:rplist:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="Download"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['safework:rplist:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="rplistList" @selection-change="handleSelectionChange">
      <el-table-column label="用户" align="center" prop="userName" />
      <el-table-column label="1月份" align="center" prop="yi">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.yi,'1')">
            {{ (scope.row.yi == null || scope.row.yi === '') ? '/' : scope.row.yi}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="2月份" align="center" prop="er">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.er,'2')">
            {{ (scope.row.er == null || scope.row.er === '') ? '/' : scope.row.er}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="3月份" align="center" prop="san">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.san,'3')">
            {{ (scope.row.san == null || scope.row.san === '') ? '/' : scope.row.san}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="4月份" align="center" prop="si">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.si,'4')">
            {{ (scope.row.si == null || scope.row.si === '') ? '/' : scope.row.si}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="5月份" align="center" prop="wu">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.wu,'5')">
            {{ (scope.row.wu == null || scope.row.wu === '') ? '/' : scope.row.wu}}</span>
        </template>
      </el-table-column>
      <el-table-column label="6月份" align="center" prop="liu">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.liu,'6')">
            {{ (scope.row.liu == null || scope.row.liu === '') ? '/' : scope.row.liu}}</span>
        </template>
      </el-table-column>
      <el-table-column label="7月份" align="center" prop="qi">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.qi,'7')">
            {{ (scope.row.qi == null || scope.row.qi === '') ? '/' : scope.row.qi}}</span>
        </template>
      </el-table-column>
      <el-table-column label="8月份" align="center" prop="ba">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.ba,'8')">
            {{ (scope.row.ba == null || scope.row.ba === '') ? '/' : scope.row.ba}}</span>
        </template>
      </el-table-column>
      <el-table-column label="9月份" align="center" prop="jiu">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.jiu,'9')">
            {{ (scope.row.jiu == null || scope.row.jiu === '') ? '/' : scope.row.jiu}}</span>
        </template>
      </el-table-column>
      <el-table-column label="10月份" align="center" prop="shi">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.shi,'10')">
            {{ (scope.row.shi == null || scope.row.shi === '') ? '/' : scope.row.shi}}</span>
        </template>
      </el-table-column>
      <el-table-column label="11月份" align="center" prop="shiyi">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.shiyi,'11')">
            {{ (scope.row.shiyi == null || scope.row.shiyi === '') ? '/' : scope.row.shiyi}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="12月份" align="center" prop="shier">
        <template #default="scope">
          <span class="lan" @click="godetail(scope.row.userId,scope.row.shier,'12')">
            {{ (scope.row.shier == null || scope.row.shier === '') ? '/' : scope.row.shier}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="奖励积分" align="center" prop="zheng" />
      <el-table-column label="惩罚积分" align="center" prop="fu" />
      <el-table-column label="总计" align="center" prop="zong" />
      <el-table-column label="奖惩金额" align="center" prop="yi">
        <template #default="scope">
          {{ parseInt(scope.row.zong) * parseInt(mon) }}
        </template>
      </el-table-column>

<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template #default="scope">-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['safework:rplist:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['safework:rplist:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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

<script setup name="Rplist">
import { sumRplist,listRplist, getRplist, delRplist, addRplist, updateRplist } from "@/api/safework/rplist";
import { listRpbase } from "@/api/safework/rpbase";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const rplistList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const mon = ref(0);
const title = ref("");
const currentYear = new Date().getFullYear();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    rpcontent: null,
    originNum: null,
    objectId: null,
    unitId: null,
    time: null,
    num: null,
    // year: new Date('2023')
    year: new Date().getFullYear(),
    years: new Date(currentYear, 0, 1)
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
function getBase() {
  listRpbase().then(response => {
    if (response.total>0){
      mon.value = response.rows[0].money
      console.log(mon.value)
    }
  });
}
/** 查询奖惩列列表 */
function getList() {
  loading.value = true;
  sumRplist(queryParams.value).then(response => {
    rplistList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function godetail(userId,num,type) {

  if(num != null && num !== ''){
    let time = queryParams.value.year +'-'+type+'-01'
    console.log(queryParams.value.year)
    proxy.$router.push({
      path: '/safework/rpdetail',
      query: {
        userId: userId,
        year: queryParams.value.year,
        type: type
      }
    })


    // listRplist({
    //   pageNum: 1,
    //   pageSize: 10,
    //   userId: userId,
    //   time:time,
    // }).then(res => {
    //   console.log(res)
    // })
  }
}

function selectYear(val){
  queryParams.value.year=queryParams.value.years.getFullYear()
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
    userName: null,
    rpcontent: null,
    originNum: null,
    objectId: null,
    unitId: null,
    time: null,
    num: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
  };
  proxy.resetForm("rplistRef");
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
  title.value = "添加奖惩列";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getRplist(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改奖惩列";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["rplistRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRplist(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRplist(form.value).then(response => {
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
    return delRplist(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/rplist/export', {
    ...queryParams.value
  }, `rplist_${new Date().getTime()}.xlsx`)
}
getBase();
getList();
</script>
<style>
.lan{
  color: #1c84c6;
  cursor: pointer
}
</style>
