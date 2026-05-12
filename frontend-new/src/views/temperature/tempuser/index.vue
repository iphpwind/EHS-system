<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="企业id" prop="tenantId">
        <el-input
          v-model="queryParams.tenantId"
          placeholder="请输入企业id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户编号" prop="tuNum">
        <el-input
          v-model="queryParams.tuNum"
          placeholder="请输入用户编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测温设备编号" prop="tuSbid">
        <el-input
          v-model="queryParams.tuSbid"
          placeholder="请输入测温设备编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="tuUsername">
        <el-input
          v-model="queryParams.tuUsername"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="tuPhone">
        <el-input
          v-model="queryParams.tuPhone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域" prop="tuArea">
        <el-input
          v-model="queryParams.tuArea"
          placeholder="请输入区域"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="位置" prop="tuLocation">
        <el-input
          v-model="queryParams.tuLocation"
          placeholder="请输入位置"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="等级时间" prop="tuTime">
        <el-date-picker clearable
          v-model="queryParams.tuTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择等级时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="告警上限" prop="alarmup">
        <el-input
          v-model="queryParams.alarmup"
          placeholder="请输入告警上限"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="告警下限" prop="alarmdown">
        <el-input
          v-model="queryParams.alarmdown"
          placeholder="请输入告警下限"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input
          v-model="queryParams.age"
          placeholder="请输入年龄"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属分组" prop="groupId">
        <el-input
          v-model="queryParams.groupId"
          placeholder="请输入所属分组"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="延迟测温时间" prop="yanchiTime">
        <el-input
          v-model="queryParams.yanchiTime"
          placeholder="请输入延迟测温时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测温间隔时间" prop="jiangeTime">
        <el-input
          v-model="queryParams.jiangeTime"
          placeholder="请输入测温间隔时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上次测量次数" prop="lastNum">
        <el-input
          v-model="queryParams.lastNum"
          placeholder="请输入上次测量次数"
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
          v-hasPermi="['system:tempuser:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:tempuser:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:tempuser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:tempuser:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="tempuserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="tuId" />
      <el-table-column label="企业id" align="center" prop="tenantId" />
      <el-table-column label="用户编号" align="center" prop="tuNum" />
      <el-table-column label="测温设备编号" align="center" prop="tuSbid" />
      <el-table-column label="姓名" align="center" prop="tuUsername" />
      <el-table-column label="身份证号" align="center" prop="tuIdnumber" />
      <el-table-column label="手机号" align="center" prop="tuPhone" />
      <el-table-column label="性别 0 女 1 男 2 保密" align="center" prop="tuSex" />
      <el-table-column label="状态 0 激活 1 注销" align="center" prop="tuStatus" />
      <el-table-column label="区域" align="center" prop="tuArea" />
      <el-table-column label="位置" align="center" prop="tuLocation" />
      <el-table-column label="等级时间" align="center" prop="tuTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.tuTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="告警上限" align="center" prop="alarmup" />
      <el-table-column label="告警下限" align="center" prop="alarmdown" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="所属分组" align="center" prop="groupId" />
      <el-table-column label="延迟测温时间" align="center" prop="yanchiTime" />
      <el-table-column label="测温间隔时间" align="center" prop="jiangeTime" />
      <el-table-column label="上次测量次数" align="center" prop="lastNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:tempuser:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:tempuser:remove']"
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

    <!-- 添加或修改聚通测温云  用户列对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="tempuserRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="企业id" prop="tenantId">
          <el-input v-model="form.tenantId" placeholder="请输入企业id" />
        </el-form-item>
        <el-form-item label="用户编号" prop="tuNum">
          <el-input v-model="form.tuNum" placeholder="请输入用户编号" />
        </el-form-item>
        <el-form-item label="测温设备编号" prop="tuSbid">
          <el-input v-model="form.tuSbid" placeholder="请输入测温设备编号" />
        </el-form-item>
        <el-form-item label="姓名" prop="tuUsername">
          <el-input v-model="form.tuUsername" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="tuPhone">
          <el-input v-model="form.tuPhone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="区域" prop="tuArea">
          <el-input v-model="form.tuArea" placeholder="请输入区域" />
        </el-form-item>
        <el-form-item label="位置" prop="tuLocation">
          <el-input v-model="form.tuLocation" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="等级时间" prop="tuTime">
          <el-date-picker clearable
            v-model="form.tuTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择等级时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="告警上限" prop="alarmup">
          <el-input v-model="form.alarmup" placeholder="请输入告警上限" />
        </el-form-item>
        <el-form-item label="告警下限" prop="alarmdown">
          <el-input v-model="form.alarmdown" placeholder="请输入告警下限" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="所属分组" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入所属分组" />
        </el-form-item>
        <el-form-item label="删除标识0：已删1：正常" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识0：已删1：正常" />
        </el-form-item>
        <el-form-item label="延迟测温时间" prop="yanchiTime">
          <el-input v-model="form.yanchiTime" placeholder="请输入延迟测温时间" />
        </el-form-item>
        <el-form-item label="测温间隔时间" prop="jiangeTime">
          <el-input v-model="form.jiangeTime" placeholder="请输入测温间隔时间" />
        </el-form-item>
        <el-form-item label="上次测量次数" prop="lastNum">
          <el-input v-model="form.lastNum" placeholder="请输入上次测量次数" />
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

<script setup name="Tempuser">
import { listTempuser, getTempuser, delTempuser, addTempuser, updateTempuser } from "@/api/temperature/tempuser";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const tempuserList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tenantId: null,
    tuNum: null,
    tuSbid: null,
    tuUsername: null,
    tuIdnumber: null,
    tuPhone: null,
    tuSex: null,
    tuStatus: null,
    tuArea: null,
    tuLocation: null,
    tuTime: null,
    alarmup: null,
    alarmdown: null,
    age: null,
    groupId: null,
    yanchiTime: null,
    jiangeTime: null,
    lastNum: null
  },
  rules: {
    tuSbid: [
      { required: true, message: "测温设备编号不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询聚通测温云  用户列列表 */
function getList() {
  loading.value = true;
  listTempuser(queryParams.value).then(response => {
    tempuserList.value = response.rows;
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
    tuId: null,
    tenantId: null,
    tuNum: null,
    tuSbid: null,
    tuUsername: null,
    tuIdnumber: null,
    tuPhone: null,
    tuSex: null,
    tuStatus: 0,
    tuArea: null,
    tuLocation: null,
    tuTime: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    alarmup: null,
    alarmdown: null,
    age: null,
    groupId: null,
    delFlag: null,
    yanchiTime: null,
    jiangeTime: null,
    lastNum: null
  };
  proxy.resetForm("tempuserRef");
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
  ids.value = selection.map(item => item.tuId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加聚通测温云  用户列";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const tuId = row.tuId || ids.value
  getTempuser(tuId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改聚通测温云  用户列";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["tempuserRef"].validate(valid => {
    if (valid) {
      if (form.value.tuId != null) {
        updateTempuser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTempuser(form.value).then(response => {
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
  const tuIds = row.tuId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delTempuser(tuIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/tempuser/export', {
    ...queryParams.value
  }, `tempuser_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
