<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="静默区域名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入静默区域名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable filterable placeholder="请选择">
          <el-option
              key="0"
              label="正常"
              value="0"
          ></el-option>
          <el-option
              key="1"
              label="停用"
              value="1"
          ></el-option>
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
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['positioning:silentarea:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="silentareaList">
      <el-table-column label="静默区域名称" align="center" prop="name" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.delFlag == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            v-if="scope.row.status!='1'"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
              type="text"
              v-if="scope.row.status=='1'"
              @click="handlelook(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            v-if="scope.row.status!='1'"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
              type="text"
              v-if="scope.row.status!='1'"
              @click="handleqy(scope.row,1)"
          >启用</el-button>
          <el-button
              type="text"
              v-if="scope.row.status=='1'"
              @click="handleqy(scope.row,2)"
          >禁用</el-button>
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

    <el-dialog :title="title" v-model="openCesium" width="90%" append-to-body>
      <h3>请按顺时针或逆时针的顺序依次鼠标左键点击边界点位，完成后点击鼠标右键完成绘制。</h3>
      <div id="cesiumContent"></div>
    </el-dialog>
    <!-- 添加或修改静默区域设置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="silentareaRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="静默区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入静默区域名称" />
        </el-form-item>
        <el-form-item label="边界" prop="name">
          <el-input v-model="form.polygon" />
          <el-button @click="openCesiumFunc">绘制边界</el-button>
        </el-form-item>
      <div class="attr">
        <div class="addbtn"><el-button type="primary" @click="addtime">添加静默时间段</el-button></div>
        <div class="attr-buttom">
          <el-row :gutter="10" >
            <el-col :span="20">开始-结束时间</el-col>
            <el-col :span="4">操作</el-col>
          </el-row>
        </div>
        <div v-for="(value,index) in form.arrList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-time-picker
                  is-range
                  v-model="value.times"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
              </el-time-picker>
            </el-col>
            <el-col :span="4">
              <el-button @click="deleteAttr(index,value.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
        <el-form-item label="状态" prop="delFlag">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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
    <!-- 查看静默区域设置对话框 -->
    <el-dialog :title="title" v-model="lookopen" width="500px" append-to-body>
      <el-form ref="silentareaRef" :model="form" :rules="rules" label-width="120px" disabled>
        <el-form-item label="静默区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入静默区域名称" />
        </el-form-item>
      <div class="attr">
        <div class="addbtn"><el-button type="primary" @click="addtime">添加静默时间段</el-button></div>
        <div class="attr-buttom">
          <el-row :gutter="10" >
            <el-col :span="20">开始-结束时间</el-col>
            <el-col :span="4">操作</el-col>
          </el-row>
        </div>
        <div v-for="(value,index) in form.arrList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-time-picker
                  is-range
                  v-model="value.times"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
              </el-time-picker>
            </el-col>
            <el-col :span="4">
              <el-button @click="deleteAttr(index,value.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
        <el-form-item label="状态" prop="delFlag">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="边界" prop="polygon">




        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="Silentarea">
import { listSilentarea, getSilentarea, delSilentarea, addSilentarea, updateSilentarea } from "@/api/positioning/silentarea";
import { listSilentattr, getSilentattr, delSilentattr, addSilentattr, updateSilentattr } from "@/api/positioning/silentattr";
import {h} from "vue";
import {delAttributes} from "@/api/equipment/classattributes";
import {getMapConfig} from "@/api/system/positioning";
import Bjt3DClass from "@/utils/Bjt3DClass";
import {getLayerColor, getRiskColor} from "@/utils/pointUtil";
const { proxy } = getCurrentInstance();

const bjt3D = ref(null);
const openCesium = ref(false);
const silentareaList = ref([]);
const open = ref(false);
const lookopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const staffOptions = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const visible = ref(false);
const nowflag = ref(0);

const data = reactive({
  form: {
    arrList:[]
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    name: null,
    yellowStaffids: null,
    orangeStaffids: null,
    redStaffids: null,
    polygon: null,
    status: null,
  },
  rules: {
    name: [
      { required: true, message: "静默区域名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

function addtime(){
  let item = {
    times: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
  }
  form.value.arrList.push(item)
}

function deleteAttr(index,id){
  form.value.arrList.splice(index,1)
}

/** 查询静默区域设置列表 */
function getList() {
  loading.value = true;
  listSilentarea(queryParams.value).then(response => {
    silentareaList.value = response.rows;
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
    name: null,
    yellowStaffids: null,
    orangeStaffids: null,
    redStaffids: null,
    polygon: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    arrList:[]
  };
  proxy.resetForm("silentareaRef");
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


/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.delFlag = '0';
  open.value = true;
  title.value = "添加静默区域设置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSilentarea(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改静默区域设置";
  });
}

/** 查看按钮操作 */
function handlelook(row) {
  const id = row.id || ids.value
  getSilentarea(id).then(response => {
    form.value = response.data;
    lookopen.value = true;
    title.value = "查看静默区域设置";
  });
}
function openCesiumFunc() {
  openCesium.value = true
  getMapConfig().then(res => {
    let data = res.data;
    bjt3D.value = new Bjt3DClass();
    bjt3D.value.init('cesiumContent', data.mapAddress, data, () => {
      bjt3D.value.layer(50, '', getLayerColor(getRiskColor('低风险')), (layer, id) => {
        form.value.polygon = JSON.stringify(layer)
        openCesium.value = false
      })
    })
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["silentareaRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        if(form.value.delFlag=='1'){
          form.value.status = '2';
        }
        updateSilentarea(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        if(form.value.delFlag=='1'){
          form.value.status = '2';
        }
        addSilentarea(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除静默区域设置编号为"' + idss + '"的数据项？').then(function() {
    return delSilentarea(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

function handleqy(row,status){
  updateSilentarea({status:status,id:row.id}).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    getList();
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('positioning/silentarea/export', {
    ...queryParams.value
  }, `silentarea_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped lang="scss">
.dengjiedit{
  padding:0;list-style: none;
  li{
    margin: 0 0 10px
  }
  :deep(.el-select) {
    display: inline-block;width: 100px;
    margin: 0 5px;
  }
}

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

#cesiumContent {
  width: 100%;
  height: 700px;
}
</style>
