<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="品牌" prop="brand">
        <el-select v-model="queryParams.brand" placeholder="请选择品牌" clearable>
          <el-option label="海康" value="海康" />
        </el-select>
      </el-form-item>
      <el-form-item label="布控球编码" prop="ballNum">
        <el-input
          v-model="queryParams.ballNum"
          placeholder="请输入布控球编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序列号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入序列号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="1" />
          <el-option label="停用" value="2" />
        </el-select>
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
          v-hasPermi="['safework:monitoreq:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="monitoreqList" @selection-change="handleSelectionChange">
      <el-table-column label="品牌" align="center" prop="brand" />
      <el-table-column label="布控球编码" align="center" prop="ballNum" />
      <el-table-column label="布控球名称" align="center" prop="ballName" />
      <el-table-column label="序列号" align="center" prop="serialNumber" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 1"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
              type="text"
              v-if="scope.row.status=='1'"
              @click="handleStop(scope.row)"
          >停用</el-button>
          <el-button
              type="text"
              @click="handleTest(scope.row)"
          >调用测试</el-button>
          <el-button
            type="text"
            @click="handleDelete(scope.row)"
          >解除账号绑定</el-button>
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

    <!-- 添加或修改监控设备管理对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="monitoreqRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="form.brand" placeholder="请选择品牌" clearable>
            <el-option label="海康" value="海康" />
          </el-select>
        </el-form-item>
        <el-form-item label="布控球编号" prop="ballNum">
          <el-input v-model="form.ballNum" placeholder="请输入布控球编号" />
        </el-form-item>
        <el-form-item label="布控球名称" prop="ballName">
          <el-input v-model="form.ballName" placeholder="请输入布控球名称" />
        </el-form-item>
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入序列号" v-if="form.id==null || form.id==''"/>
          <el-input v-model="form.serialNumber" placeholder="请输入序列号" v-else disabled/>
        </el-form-item>
        <el-form-item label="验证码" prop="code" v-if="form.id==null || form.id==''">
          <el-input v-model="form.code" placeholder="请输入验证码" />
        </el-form-item>
        <el-form-item label="布控球配置信息" prop="ballConfigInfo">
          <el-input type="textarea" v-model="form.ballConfigInfo" placeholder="请输入布控球配置信息" />
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="form.rem" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="2">停用</el-radio>
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
    <el-dialog title="视频测试" v-model="openTest" width="700px" append-to-body>
      <div id="video-container"></div>
    </el-dialog>
  </div>
</template>

<script setup name="Monitoreq">
import { listMonitoreq, getMonitoreq, delMonitoreq, addMonitoreq, updateMonitoreq } from "@/api/safework/monitoreq";
import { getAccessToken,getUrl,addmonitor,upMonitor,delmonitor} from "@/api/safework/yscloud";
import { listYsconfig, getYsconfig, delYsconfig, addYsconfig, updateYsconfig } from "@/api/safework/ysconfig";
import EZUIKit from 'ezuikit-js';
var player = null;

const { proxy } = getCurrentInstance();

const monitoreqList = ref([]);
const open = ref(false);
const openTest = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const AppKey = ref("");
const Secret = ref("");
const accessToken = ref("");
const zburl = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    brand: null,
    ballNum: null,
    ballName: null,
    serialNumber: null,
    code: null,
    ballConfigInfo: null,
    rem: null,
    status: null,
    delFlag:'0'
  },
  rules: {
    code: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    serialNumber: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    ballNum: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    brand: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询监控设备管理列表 */
function getList() {
  loading.value = true;
  listMonitoreq(queryParams.value).then(response => {
    monitoreqList.value = response.rows;
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
    brand: null,
    ballNum: null,
    ballName: null,
    serialNumber: null,
    code: null,
    ballConfigInfo: null,
    rem: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("monitoreqRef");
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
  form.value.status = '1';
  form.value.delFlag = '0';
  title.value = "添加监控设备管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getMonitoreq(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改监控设备管理";
  });
}

function getToken(){
  listYsconfig().then(response => {
    if(response.rows.length>0){
      Secret.value = response.rows[0].secret;
      AppKey.value = response.rows[0].appkey;
      //通过AppKey和Secret获取token
      getAccessToken({appKey:AppKey.value,appSecret:Secret.value}).then(res=>{
        accessToken.value = res.data.data.accessToken
      })
    }
  });
}

function handleTest(row){
  //根据token获取播放地址
  getUrl({accessToken:accessToken.value,deviceSerial:row.serialNumber}).then(re=>{
    zburl.value = re.data.data.url
    player = new EZUIKit.EZUIKitPlayer({
      id: 'video-container', // 视频容器ID
      accessToken: accessToken.value,
      url: zburl.value,
      // simple - 极简版; pcLive-pc直播；pcRec-pc回放；mobileLive-移动端直播；mobileRec-移动端回放;security - 安防版;voice-语音版;
      //template: 'simple',
      plugin: ['talk'], // 加载插件，talk-对讲
      width: 600,
      height: 400,
    });
    window.player = player;
  })
  openTest.value = true;
}

function handleStop(row){
  const id = row.id || ids.value
  updateMonitoreq({id:id,status:'2'}).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    open.value = false;
    getList();
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["monitoreqRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMonitoreq(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        //先在云端添加
        addmonitor({accessToken:accessToken.value,deviceSerial:form.value.serialNumber,validateCode:form.value.code}).then(res=>{
          if(res.data.code==200){
            proxy.$modal.msgSuccess(res.data.msg);
            addMonitoreq(form.value).then(response => {
              proxy.$modal.msgSuccess("新增成功");
              open.value = false;
              getList();
            });
          }
        })
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除监控设备管理编号为"' + idss + '"的数据项？').then(function() {
    delmonitor({accessToken:accessToken.value,deviceSerial:row.serialNumber}).then(res=>{
      if(res.data.code==200){
        delMonitoreq(idss).then(() => {
          getList();
          proxy.$modal.msgSuccess("删除成功");
        });
      }
    })
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/monitoreq/export', {
    ...queryParams.value
  }, `monitoreq_${new Date().getTime()}.xlsx`)
}

getList();
getToken();
</script>
