<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择归属公司"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
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
          v-hasPermi="['dataApiManage:datamanage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['dataApiManage:datamanage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['dataApiManage:datamanage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['dataApiManage:datamanage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="datamanageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="企业名称" align="center" prop="deptName" />
      <el-table-column label="网关serial" align="center" prop="terminalName" />
      <el-table-column label="传感器serial" align="center" prop="equipmentName" />
      <el-table-column label="推送地址" align="center" prop="dataHost" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">有效</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">无效</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dataApiManage:datamanage:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dataApiManage:datamanage:remove']"
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

    <!-- 添加或修改api接口管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="datamanageRef" :model="form" :rules="rules" label-width="80px">
        <el-input v-model="form.appId" v-if="false"/>
        <el-input v-model="form.appSecret" v-if="false"/>
        <el-form-item label="公司名称" prop="deptId" >
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属公司"
              :objMap="{ value: 'id', label: 'label', children: 'children'}"
              @func="getMsg"
          />
        </el-form-item>
        <el-form-item label="网关" prop="terminalSerial">
          <el-select v-model="form.terminalSerial" @change="changeEquipment" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in terminalOptions"
                :key="item.termCode"
                :label="item.termName"
                :value="item.termCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="传感器" prop="equipmentSerial">
          <el-select v-model="form.equipmentSerial" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in equipmentOptions"
                :key="item.equipmentId"
                :label="item.equipmentName"
                :value="item.equipmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送地址" prop="dataHost">
          <el-input v-model="form.dataHost" placeholder="请输入推送地址" />
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

<script setup name="Datamanage">
import { listDatamanage, getDatamanage, delDatamanage, addDatamanage, updateDatamanage } from "@/api/dataApiManage/datamanage";
import {treeselect} from "@/api/system/dept";
import {getTerminalByDept} from "@/api/sensor/terminal";
import {listSensor} from "@/api/sensor/sensor";
import {h, ref} from "vue";
import {listDept,getDept} from "@/api/system/dept";
import {listTerminal} from "../../../api/sensor/terminal";
const { proxy } = getCurrentInstance();

const datamanageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const terminalOptions = ref(undefined);
const equipmentOptions = ref(undefined);
let deptData = [];
let terminalData = [];
let equipmentData = [];

const data = reactive({
  form: {
    appSecret:null,
    appId:null,
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    terminalSerial: null,
    equipmentSerial: null,
    status: null
  },
  rules: {
    dataHost: [
      { required: true, message: "推送地址不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

function deptFormatter() {
  listDept({pageSize: 10000}).then(response => {
    deptData = response.data
  })
}

function termFormatter() {
  listTerminal({pageSize: 10000}).then(res => {
    terminalData = res.rows
  })
}

function equipmentFormatter() {
  listSensor({pageSize: 1000000}).then(res => {
    equipmentData = res.rows
  })
}

/** 查询api接口管理列表 */
function getList() {
  loading.value = true;
  listDatamanage(queryParams.value).then(response => {
    datamanageList.value = response.rows;
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
    appId: null,
    appSecret: null,
    terminalSerial: null,
    equipmentSerial: null,
    dataHost: null,
    createTime: null,
    updateTime: null,
    status: 0
  };
  proxy.resetForm("datamanageRef");
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
  title.value = "添加api接口管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getDatamanage(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改api接口管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["datamanageRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDatamanage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDatamanage(form.value).then(response => {
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
    return delDatamanage(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('dataApiManage/datamanage/export', {
    ...queryParams.value
  }, `datamanage_${new Date().getTime()}.xlsx`)
}

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
}
function getMsg(data){
  console.log(data)
  let val = data.id
  if(val==null || val=='' || val == 'undefined'){
    proxy.$modal.msgWarning("先选择所属部门");
  }else{
    changeTerminal(val);
  }

}
function changeTerminal(id) {
  // console.log('row',row);
  form.value.deptId = id;
  //获取appid和appSecret
  getDept(id).then(response => {
    form.value.appId = response.data.appId;
    form.value.appSecret = response.data.appSecret;
    console.log('row',form.value.deptId);
    console.log('row',response.data.appId);
    console.log('row',form.value.appId);
  });
  terminalOptions.value = []
  equipmentOptions.value = []
  getTerminalByDept(id).then(res => {
    terminalOptions.value = res;
  })
}

function changeEquipment(val) {
  // console.log(val)
  equipmentOptions.value = []
  listSensor({termCode: val, pageSize: 10000}).then(res => {
    if (res.total > 0) {
      equipmentOptions.value = res.rows;
    } else {
      equipmentOptions.value = []
    }
  })
}

getList();
initTreeData();
deptFormatter();
termFormatter();
equipmentFormatter();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
