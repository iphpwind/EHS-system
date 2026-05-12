<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="网关编号" prop="gwCode">
        <el-input
            v-model="queryParams.gwCode"
            placeholder="请输入网关编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="sim卡号" prop="gwCode">
        <el-input
            v-model="queryParams.simCode"
            placeholder="请输入sim卡号"
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
            v-hasPermi="['gatewayAdmin:sim:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['gatewayAdmin:sim:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['gatewayAdmin:sim:remove']"
        >删除
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="warning"-->
      <!--            plain-->
      <!--            icon="Download"-->
      <!--            @click="handleExport"-->
      <!--            v-hasPermi="['gatewayAdmin:sim:export']"-->
      <!--        >导出-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="simList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="sim卡号" align="center" prop="simCode"/>
      <el-table-column label="网关编号" align="center" prop="gwCode"/>
      <el-table-column label="余额" align="center" prop="balance"/>
      ·
      <el-table-column label="启用日期" align="center" prop="enableDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.enableDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" prop="expireDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expireDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="renew(scope.row)"
              v-hasPermi="['gatewayAdmin:sim:edit']"
          >续费
          </el-button>
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['gatewayAdmin:sim:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['gatewayAdmin:sim:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改网关盒子SIM卡信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="simRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="网关编号" prop="gwCode">
          <el-input v-model="form.gwCode" placeholder="请选择网关"/>
        </el-form-item>
        <el-form-item label="sim卡号" prop="simCode">
          <el-input v-model="form.simCode" placeholder="请输入sim卡号"/>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入余额"/>
        </el-form-item>
        <el-form-item label="启用日期" prop="enableDate">
          <el-date-picker clearable
                          v-model="form.enableDate"
                          type="date"
                          style="width: 100%"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择启用日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker clearable
                          v-model="form.expireDate"
                          type="date"
                          style="width: 100%"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态" style="width: 100%" clearable>
            <el-option
                v-for="item in state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
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

<script setup name="Sim">
import {listSim, getSim, delSim, addSim, updateSim} from "@/api/gatewayAdmin/sim";
import { addRenew } from "@/api/gatewayAdmin/renew";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const simList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const state = ref(
    [
      {label: '使用中', value: 0},
      {label: '未使用', value: 1},
    ]
)

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    gwCode: null,
    deptId: null,
    balance: null,
    enableDate: null,
    expireDate: null,
    state: null,
    simCode: null
  },
  rules: {
    gwCode: [
      {required: true, message: "网关编号不能为空", trigger: "blur"}
    ],
    simCode: [
      {required: true, message: "sim卡号不能为空", trigger: "blur"}
    ],
    deptId: [
      {required: true, message: "企业id不能为空", trigger: "blur"}
    ],
    balance: [
      {required: true, message: "余额不能为空", trigger: "blur"}
    ],
    state: [
      {required: true, message: "0.关闭  1.开启不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询网关盒子SIM卡信息列表 */
function getList() {
  loading.value = true;
  listSim(queryParams.value).then(response => {
    simList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function stateFormatter(row) {
  if (row.state == 1) {
    return '使用中'
  } else {
    return '未使用'
  }
}

function renew(row) {
  console.log(row)
  proxy.$prompt('请输入充值金额', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        inputErrorMessage: '金额不能为空',
        inputValidator: (value) => {
          if (!value) {
            return '输入不能为空';
          }
        },
      }).then(({value}) => {
    row.balance = Number(row.balance);
    row.balance += Number(value)
    updateSim(row)
    let renewInfo = {
      simId: row.id,
      amount: value,
      gwCode: row.gwCode
    }
    console.log(renewInfo)
    addRenew(renewInfo)
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
    gwCode: null,
    deptId: null,
    balance: null,
    enableDate: null,
    expireDate: null,
    state: null
  };
  proxy.resetForm("simRef");
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
  title.value = "添加网关盒子SIM卡信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSim(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改网关盒子SIM卡信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["simRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSim(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSim(form.value).then(response => {
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
  proxy.$modal.confirm(h('p', null, [h('span', {style: 'color: black'}, '确定删除该数据吗'), h('p', {style: 'color: red'}, "删除后不可恢复!!!")]), {}).then(function () {
    return delSim(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('gatewayAdmin/sim/export', {
    ...queryParams.value
  }, `sim_${new Date().getTime()}.xlsx`)
}

getList();
</script>
