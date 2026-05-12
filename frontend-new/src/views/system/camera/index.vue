<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门:" prop="deptId">
        <el-select
            v-model="queryParams.deptId"
            placeholder="请选择部门"
            clearable
            @keyup.enter="handleQuery"
        >
          <el-option
              v-for="item in deptList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码:" prop="equipmentCode">
        <el-input
            v-model="queryParams.equipmentCode"
            placeholder="请输入监控设备编码"
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
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
<!--        <el-button-->
<!--            type="danger"-->
<!--            plain-->
<!--            icon="Delete"-->
<!--            :disabled="multiple"-->
<!--            @click="handleDelete"-->
<!--        >删除-->
<!--        </el-button>-->
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            icon="Download"-->
<!--            @click="handleExport"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="cameraList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="部门" align="center" prop="deptId" :formatter="deptFormatter"/>
      <el-table-column label="监控设备编码" align="center" prop="equipmentCode"/>
      <el-table-column label="品牌" align="center" prop="brand"/>
      <el-table-column label="型号" align="center" prop="modelType"/>
      <el-table-column label="ip" align="center" prop="ip"/>
      <el-table-column label="账户" align="center" prop="cameraAccount"/>
      <el-table-column label="密码" align="center" prop="cameraPassword"/>
      <el-table-column label="通道" align="center" prop="channel"/>
      <el-table-column label="端口" align="center" prop="cameraPort"/>
      <el-table-column label="协议" align="center" prop="agreement"/>
      <el-table-column label="安装位置" align="center" prop="position"/>
      <el-table-column label="rtsp地址" align="center" prop="rtspAddress"/>
      <el-table-column label="状态" align="center" prop="openStatus" :formatter="statusFormatter"/>
      <el-table-column label="视频转码地址" align="center" prop="transcodingUrl"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
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

    <!-- 添加或修改摄像头配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="cameraRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="部门" prop="deptId">
          <el-select
              v-model="form.deptId"
              placeholder="请选择部门"
              clearable
              @keyup.enter="handleQuery"
          >
            <el-option
                v-for="item in deptList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控设备编码" prop="equipmentCode">
          <el-input v-model="form.equipmentCode" placeholder="请输入监控设备编码"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌"/>
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入ip"/>
        </el-form-item>
        <el-form-item label="账户" prop="cameraAccount">
          <el-input v-model="form.cameraAccount" placeholder="请输入账户"/>
        </el-form-item>
        <el-form-item label="密码" prop="cameraPassword">
          <el-input v-model="form.cameraPassword" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="通道" prop="channel">
          <el-input v-model="form.channel" placeholder="请输入通道"/>
        </el-form-item>
        <el-form-item label="端口" prop="cameraPort">
          <el-input v-model="form.cameraPort" placeholder="请输入端口"/>
        </el-form-item>
        <el-form-item label="协议" prop="agreement">
          <el-input v-model="form.agreement" placeholder="请输入协议"/>
        </el-form-item>
        <el-form-item label="安装位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入安装位置"/>
        </el-form-item>
        <el-form-item label="rtsp地址" prop="rtspAddress">
          <el-input v-model="form.rtspAddress" placeholder="请输入rtsp地址"/>
        </el-form-item>
        <el-form-item label="视频转码地址" prop="transcodingUrl">
          <el-input v-model="form.transcodingUrl" placeholder="请输入视频转码地址"/>
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

<script setup name="Camera">
import {listCamera, getCamera, delCamera, addCamera, updateCamera} from "@/api/system/camera";
import {treeselect} from "../../../api/system/dept";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const cameraList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    equipmentCode: null,
    brand: null,
    modelType: null,
    ip: null,
    cameraAccount: null,
    cameraPassword: null,
    channel: null,
    cameraPort: null,
    agreement: null,
    position: null,
    rtspAddress: null,
    openStatus: null,
    transcodingUrl: null
  },
  deptList: [],
  rules: {
    deptId: [
      {required: true, message: "部门id不能为空", trigger: "blur"}
    ],
    equipmentCode: [
      {required: true, message: "监控设备编码不能为空", trigger: "blur"}
    ],
    brand: [
      {required: true, message: "品牌不能为空", trigger: "blur"}
    ],
    modelType: [
      {required: true, message: "型号不能为空", trigger: "change"}
    ],
    ip: [
      {required: true, message: "ip不能为空", trigger: "blur"}
    ],
    cameraAccount: [
      {required: true, message: "账户不能为空", trigger: "blur"}
    ],
    cameraPassword: [
      {required: true, message: "密码不能为空", trigger: "blur"}
    ],
    channel: [
      {required: true, message: "通道不能为空", trigger: "blur"}
    ],
    cameraPort: [
      {required: true, message: "端口不能为空", trigger: "blur"}
    ],
    agreement: [
      {required: true, message: "协议不能为空", trigger: "blur"}
    ],
    position: [
      {required: true, message: "安装位置不能为空", trigger: "blur"}
    ],
    rtspAddress: [
      {required: true, message: "rtsp地址不能为空", trigger: "blur"}
    ],
    openStatus: [
      {required: true, message: "状态： 0. 停用  1.开启不能为空", trigger: "blur"}
    ],
    transcodingUrl: [
      {required: true, message: "视频转码地址不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules, deptList} = toRefs(data);

/** 查询摄像头配置列表 */
function getList() {
  loading.value = true;
  listCamera(queryParams.value).then(response => {
    cameraList.value = response.rows;
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
    equipmentCode: null,
    brand: null,
    modelType: null,
    ip: null,
    cameraAccount: null,
    cameraPassword: null,
    channel: null,
    cameraPort: null,
    agreement: null,
    position: null,
    rtspAddress: null,
    openStatus: 0,
    transcodingUrl: null
  };
  proxy.resetForm("cameraRef");
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
  title.value = "添加摄像头配置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getCamera(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改摄像头配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cameraRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCamera(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCamera(form.value).then(response => {
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
  console.log(row.id)
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delCamera(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/camera/export', {
    ...queryParams.value
  }, `camera_${new Date().getTime()}.xlsx`)
}

function initTreeData() {
  treeselect().then(response => {
    console.log(response)
    for (let i = 0; i < response.data[0].children.length; i++) {
      deptList.value.push({
        label: response.data[0].children[i].label,
        value: response.data[0].children[i].id,
      })
    }

  });
};

function deptFormatter(v) {
  let str = ''
  deptList.value.forEach(item => {
    if (item.value == v.deptId) {
      str = item.label;
    }
  })
  return str;
}

function statusFormatter(v) {
  let str = ''
  if (v.openStatus == '1') {
    str = '已开启'
  } else {
    str = '未开启'
  }
  return str;
}

getList();
initTreeData();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
