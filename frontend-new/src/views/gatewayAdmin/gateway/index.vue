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
      <el-form-item label="网关ip" prop="ipaddress">
        <el-input
            v-model="queryParams.ipaddress"
            placeholder="请输入网关IP"
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
            v-hasPermi="['gatewayAdmin:gateway:add']"
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
            v-hasPermi="['gatewayAdmin:gateway:edit']"
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
            v-hasPermi="['gatewayAdmin:gateway:remove']"
        >删除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            icon="Download"-->
<!--            @click="handleExport"-->
<!--            v-hasPermi="['gatewayAdmin:gateway:export']"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gatewayList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="企业名称" align="center" prop="deptName"/>
      <el-table-column label="网关编号" align="center" prop="gwCode"/>
      <el-table-column label="网关类型" align="center" prop="gwType" :formatter="gatewayTypeFormatter"/>
      <el-table-column label="网关型号" align="center" prop="gwModel"/>
      <el-table-column label="密码" align="center" prop="gwPassword"/>
      <el-table-column label="IP" align="center" prop="ipaddress"/>
      <el-table-column label="端口" align="center" prop="port"/>
      <el-table-column label="联网模式" align="center" prop="netMode" :formatter="netModelFormatter"/>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
      <el-table-column label="用途说明" align="remark" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['gatewayAdmin:gateway:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['gatewayAdmin:gateway:remove']"
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

    <!-- 添加或修改网关盒子信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="gatewayRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="网关编号" prop="gwCode">
          <el-input v-model="form.gwCode" placeholder="请输入网关编号"/>
        </el-form-item>
        <el-form-item label="网关类型" prop="gwType">
          <el-select v-model="form.gwType" placeholder="请选择网关类型">
            <el-option
                v-for="item in gateway_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网关型号" prop="gwModel">
          <el-input v-model="form.gwModel" placeholder="请输入网关型号"/>
        </el-form-item>
        <el-form-item label="密码" prop="gwPassword">
          <el-input v-model="form.gwPassword" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="网关ip" prop="ipaddress">
          <el-input v-model="form.ipaddress" placeholder="请输入网关ip"/>
        </el-form-item>
        <el-form-item label="网关端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入网关端口"/>
        </el-form-item>
        <el-form-item label="用途说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入用途说明"/>
        </el-form-item>
        <el-form-item label="联网模式" prop="netMode">
          <el-select v-model="form.netMode" placeholder="请选择联网模式" style="width: 100%" clearable>
            <el-option
                v-for="item in netModel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
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

<script setup name="Gateway">
import {listGateway, getGateway, delGateway, addGateway, updateGateway} from "@/api/gatewayAdmin/gateway";
import {h} from "vue";


const {proxy} = getCurrentInstance();
const {gateway_type}  = proxy.useDict('gateway_type');
const gatewayList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const netModel = ref(
    [
      {label: '4G', value: 1},
      {label: '有线', value: 2},
      {label: 'WIFI', value: 3}
    ]
)

const state = ref(
    [
      {label: '离线', value: 0},
      {label: '在线', value: 1},
    ]
)


const data = reactive({
  form: {},

  queryParams: {
    pageNum: 1,
    pageSize: 10,
    gwCode: null,
    deptId: null,
    gwType: null,
    gwPassword: null,
    ipaddress: null,
    port: null,
    netMode: null,
    state: null,
    gwModel: null
  },
  rules: {
    gwCode: [
      {required: true, message: "网关信编号不能为空", trigger: "blur"}
    ],
    deptId: [
      {required: true, message: "部门id不能为空", trigger: "blur"}
    ],
    gwType: [
      {required: true, message: "网关类型：1.自研  2.忱工  3.研华  4.信捷不能为空", trigger: "change"}
    ],
    gwModel: [
      {required: true, message: "网关型号不能为空", trigger: "blur"}
    ],
    gwPassword: [
      {required: true, message: "密码不能为空", trigger: "blur"}
    ],
    ipaddress: [
      {required: true, message: "网关ip不能为空", trigger: "blur"}
    ],
    port: [
      {required: false}
    ],
    netMode: [
      {required: true, message: "联网模式：1.4G  2.有线  3.WIFI不能为空", trigger: "blur"}
    ],
    state: [
      {required: true, message: "状态: 0.关闭  1.开启不能为空", trigger: "blur"}
    ],
    remark: [
      {required: true, message: "用途说明不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询网关盒子信息列表 */
function getList() {
  loading.value = true;
  listGateway(queryParams.value).then(response => {
    gatewayList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function gatewayTypeFormatter(e) {
  switch (e.gwType) {
    case 1:
      return '自研'
    case 2:
      return '忱工'
    case 3:
      return 'OPC'
    case 4:
      return '研华'
    case 5:
      return '信捷'
  }
}

function netModelFormatter(e) {
  switch (e.netMode) {
    case 1:
      return '4G'
    case 2:
      return '有线'
    case 3:
      return 'WIFI'
  }
}

function stateFormatter(e) {
  switch (e.state) {
    case 0:
      return '离线'
    case 1:
      return '在线'
  }
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    gwCode: null,
    deptId: null,
    gwType: null,
    gwPassword: null,
    ipaddress: null,
    port: null,
    netMode: null,
    state: null,
    createTime: null,
    remark: null
  };
  proxy.resetForm("gatewayRef");
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
  title.value = "添加网关盒子信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getGateway(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改网关盒子信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["gatewayRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateGateway(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addGateway(form.value).then(response => {
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
    return delGateway(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('gatewayAdmin/gateway/export', {
    ...queryParams.value
  }, `gateway_${new Date().getTime()}.xlsx`)
}

getList();
</script>
