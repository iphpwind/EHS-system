<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="20">
        <!--组织数据-->
        <el-col :span="4" :xs="24">
          <div class="head-container tree">
            <h4>区域设备导航</h4>
            <el-input
                v-model="sectionName"
                placeholder="请输入组织名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container tree down-tree">
            <el-tree
                :data="sectionOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="sectionTreeRef"
                default-expand-all
                @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <!--巡检点数据-->
        <el-col :span="20" :xs="24" style="border-left: 1px solid rgb(231, 232, 237);">
          <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
            <el-form-item label="巡检点编码" prop="siteCode">
              <el-input
                  v-model="queryParams.siteCode"
                  placeholder="请输入巡检点编码"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="巡检点名称" prop="siteName">
              <el-input
                  v-model="queryParams.siteName"
                  placeholder="请输入巡检点名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="巡检点类型" prop="siteType">
              <el-select v-model="queryParams.siteType" placeholder="请选择巡检点类型" clearable>
                <el-option
                    v-for="dict in unit_site_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option
                    v-for="dict in unit_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <!--					<el-form-item>-->
            <!--						<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
            <!--						<el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
            <!--					</el-form-item>-->
          </el-form>

          <el-row :gutter="10" class="mb8 toolsline" >
            <el-col :span="1.5">
              <el-button
                  type="primary"
                  plain
                  icon="Plus"
                  @click="handleAdd"
                  v-hasPermi="['unitManage:site:add']"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  type="success"
                  plain
                  icon="Edit"
                  :disabled="single"
                  @click="handleUpdate"
                  v-hasPermi="['unitManage:site:edit']"
              >修改</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  type="danger"
                  plain
                  icon="Delete"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['unitManage:site:remove']"
              >删除</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                  type="warning"
                  plain
                  icon="Download"
                  @click="handleExport"
                  v-hasPermi="['unitManage:site:export']"
              >导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table height="calc(100vh - 300px)" v-loading="loading" :data="siteList" @selection-change="handleSelectionChange" style="min-height: calc(100vh - 300px);">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="巡检点编码" align="center" prop="siteCode" />
            <el-table-column label="巡检点名称" align="center" prop="siteName" />
            <el-table-column label="巡检点类型" align="center" prop="siteType">
              <template #default="scope">
                <dict-tag :options="unit_site_type" :value="scope.row.siteType"/>
              </template>
            </el-table-column>
            <el-table-column label="巡检卡编号" align="center" prop="cardCode" />
            <el-table-column label="归属部门" align="center" prop="deptName" />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="unit_status" :value="scope.row.status"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300" fixed="right">

              <template #default="scope">
                <el-button
                    type="text"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['unitManage:site:edit']"
                >修改</el-button>
                <el-button
                    type="text"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['unitManage:site:remove']"
                >删除</el-button>

                <el-popover
                    placement="left"
                    :width="650"
                    trigger="hover"
                >
                  <el-button
                      type="text"
                      icon="CreditCard"
                      @click="handleDevice(scope.row)"
                      v-hasPermi="['unitManage:site:list']"
                  >设备列表</el-button>
                  <el-button
                      type="text"
                      icon="Calendar"
                      @click="handleInspection(scope.row)"
                      v-hasPermi="['unitManage:site:list']"
                  >巡检内容</el-button>
                  <el-button
                      type="text"
                      icon="Document"
                      @click="handlePlan(scope.row)"
                      v-hasPermi="['unitManage:site:list']"
                  >巡检计划</el-button>
                  <el-button
                      type="text"
                      icon="SetUp"
                      @click="handleTask(scope.row)"
                      v-hasPermi="['unitManage:site:list']"
                  >巡检任务</el-button>
                  <el-button
                      type="text"
                      icon="picture"
                      @click="handleQrCode(scope.row)"
                      v-hasPermi="['unitManage:site:list']"
                  >下载二维码</el-button>
                  <template #reference>
                    <el-button>更多</el-button>
                  </template>
                </el-popover>

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
        </el-col>
      </el-row>



    <!-- 添加或修改单元巡检点管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="siteRef" :model="form" :rules="rules" label-width="110px">
				<el-form-item label="归属组织" prop="sectionId">
					<tree-select
							v-model:value="form.sectionId"
							:options="sectionOptions"
							placeholder="请选择归属组织"
							:objMap="{ value: 'id', label: 'label', children: 'children' }"
					/>
				</el-form-item>
        <el-form-item label="巡检点编码" prop="siteCode">
          <el-input v-model="form.siteCode" placeholder="请输入巡检点编码" />
        </el-form-item>
        <el-form-item label="巡检点名称" prop="siteName">
          <el-input v-model="form.siteName" placeholder="请输入巡检点名称" />
        </el-form-item>
        <el-form-item label="巡检点类型" prop="siteType">
          <el-select v-model="form.siteType" placeholder="请选择巡检点类型">
            <el-option
              v-for="dict in unit_site_type"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检卡编号" prop="cardCode">
          <el-input v-model="form.cardCode" placeholder="请输入巡检卡编号" />
        </el-form-item>
        <el-form-item label="巡检内容模板" prop="templateId">
					<el-select v-model="form.templateId">
						<el-option
								v-for="item in templateOptions"
								:key="item.templateId"
								:label="item.templateName"
								:value="item.templateId"
						/>
					</el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in unit_status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
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
		<!-- <el-dialog title="设备列表" v-model="device" width="900px" append-to-body>
			<el-row :gutter="10" class="mb8">
			  <el-col :span="1.5">
			    <el-button type="primary" icon="Plus" @click="handleAddInspectionDevice">添加</el-button>
			  </el-col>
			  <el-col :span="1.5">
			    <el-button type="danger" icon="Delete" @click="handleDeleteInspectionDevice">删除</el-button>
			  </el-col>
			</el-row>
			<el-table :data="inspectionDeviceList" :row-class-name="rowInspectionDeviceIndex" @selection-change="handleInspectionDeviceSelectionChange" ref="inspectionDevice">
			  <el-table-column type="selection" width="50" align="center" />
			  <el-table-column label="序号" width="50" align="center" prop="id"/>
			  <el-table-column label="设备名称" align="center" prop="eqName"/>
			</el-table>
		</el-dialog> -->
		<el-dialog title="巡检内容" v-model="dict" width="900px" append-to-body>
			<el-table :data="inspectionTemplateDictList" ref="inspectionTemplateDict">
			  <el-table-column label="序号" width="50" align="center" prop="id"/>
			  <el-table-column label="名称" align="center" prop="inspectionDictName"/>
			  <el-table-column label="内容" min-width="200" align="center" prop="inspectionDictContent"/>
			  <el-table-column label="运行值域" align="center">
					<template #default="scope">
						<div v-if="scope.row.inspectionDictType == '0'"><span>{{scope.row.runningNumLow}}</span>~<span>{{scope.row.runningNumUp}}</span></div>
						<div v-if="scope.row.inspectionDictType == '1'"><span>{{scope.row.runningStringNormal}}</span>|<span>{{scope.row.runningStringFault}}</span></div>
					</template>
				</el-table-column>
			  <el-table-column label="待机值域" align="center">
					<template #default="scope">
						<div v-if="scope.row.inspectionDictType == '0'"><span>{{scope.row.standbyNumLow}}</span>~<span>{{scope.row.standbyNumUp}}</span></div>
						<div v-if="scope.row.inspectionDictType == '1'"><span>{{scope.row.standbyStringNormal}}</span>|<span>{{scope.row.standbyStringFault}}</span></div>
					</template>
				</el-table-column>
			  <el-table-column label="单位" align="center" prop="numUnit"/>
			</el-table>
		</el-dialog>
    <inspection-device ref="deviceRef" :siteId="form.siteId" :sectionId="form.sectionId"/>
		</el-card>
  </div>
</template>

<script setup name="Site">
import { listSite, getSite, delSite, addSite, updateSite, qrCode } from "@/api/unitManage/site";
import { listInspectionDevice, getInspectionDevice, delInspectionDevice, addInspectionDevice, updateInspectionDevice } from "@/api/unitManage/inspectionDevice";
import { treeselect } from "@/api/unitmanage/section";
import inspectionDevice from "./inspectionDevice";
import { listInspectionTemplate } from "@/api/unitmanage/inspectionTemplate";
import {saveAs} from 'file-saver'
import { listInspectionTemplateDict} from "@/api/unitmanage/inspectionTemplateDict";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_site_type, unit_status } = proxy.useDict('unit_site_type', 'unit_status');

const siteList = ref([]);
const inspectionDeviceList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const sectionName = ref("");
const sectionOptions = ref(undefined);
const router = useRouter();
const device = ref(false);
const checkedInspectionDevice = ref([]);
const templateOptions = ref([]);
const inspectionTemplateDictList = ref([]);
const dict = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    siteCode: null,
    siteName: null,
    siteType: null,
    status: null,
    sectionId: null,
    delFlag: "0"
  },
  rules: {
    sectionId: [
      { required: true, message: "归属组织不能为空", trigger: "blur" }
    ],
    siteCode: [
      { required: true, message: "巡检点编码不能为空", trigger: "blur" }
    ],
    siteName: [
      { required: true, message: "巡检点名称不能为空", trigger: "blur" }
    ],
    siteType: [
      { required: true, message: "巡检点类型不能为空", trigger: "change" }
    ],
    cardCode: [
      { required: true, message: "巡检卡编号不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    templateId: [
      { required: true, message: "巡检内容模板不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选组织树 */
watch(sectionName, val => {
  proxy.$refs["sectionTreeRef"].filter(val);
});

/** 查询组织下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    sectionOptions.value = response.data;
  });
};

/** 查询巡检内容模板列表 **/
function getTemplateList(){
  listInspectionTemplate({delFlag:0,status:0}).then(response => {
    templateOptions.value = response.rows;
  });
}

/** 查询单元巡检点管理列表 */
function getList() {
  loading.value = true;
  listSite(queryParams.value).then(response => {
    siteList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.sectionId = data.id;
  handleQuery();
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    sectionId: queryParams.value.sectionId,
    siteId: null,
    siteCode: null,
    siteName: null,
    siteType: null,
    cardCode: null,
    status: "0",
    delFlag: "0",
    templateId: null,
  };
  inspectionDeviceList.value = [];
  proxy.resetForm("siteRef");
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
  ids.value = selection.map(item => item.siteId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加单元巡检点管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const siteId = row.siteId || ids.value
  getSite(siteId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改单元巡检点管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["siteRef"].validate(valid => {
    if (valid) {
      if (form.value.siteId != null) {
        updateSite(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSite(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}


/** 设备列表按钮操作 */
function handleDevice(row) {
  form.value.siteId = row.siteId;
  form.value.sectionId = row.sectionId;
  getInspectionDeviceList(form.value.siteId);
}
function getInspectionDeviceList(siteId){
  listInspectionDevice({siteId:siteId}).then(response => {
    inspectionDeviceList.value = response.rows;

    proxy.$refs["deviceRef"].show();
    // device.value = true;
  });
}

/** 巡检内容操作 **/
function handleInspection(row){
  getInspectionTemplateDictList(row.templateId);
}
function getInspectionTemplateDictList(templateId){
  listInspectionTemplateDict({templateId:templateId}).then(response => {
    inspectionTemplateDictList.value = response.rows;
    dict.value = true;
  });
}

/** 巡检计划操作 **/
function handlePlan(row){
  const siteId = row.siteId;
  router.push("/unitmanage/site-plan/index/" + siteId);
}

/** 巡检任务操作 **/
function handleTask(row){
  const siteId = row.siteId;
  router.push("/unitmanage/site-task/index/" + siteId);
}

/** 下载二维码操作 **/
function handleQrCode(row){
  proxy.download('unitManage/site/qrCode', {
    ...row
  }, row.qrCode.split("/",5)[4])
}

/** 删除按钮操作 */
function handleDelete(row) {
  const siteIds = row.siteId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSite(siteIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/site/export', {
    ...queryParams.value
  }, `site_${new Date().getTime()}.xlsx`)
}

/** 巡检点设备和巡检点关联序号 */
function rowInspectionDeviceIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 巡检点设备和巡检点关联添加按钮操作 */
function handleAddInspectionDevice() {
  proxy.$refs["deviceRef"].show();
}

/** 巡检点设备和巡检点关联删除按钮操作 */
function handleDeleteInspectionDevice() {
  if (checkedInspectionDevice.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的巡检点设备");
  } else {
    const checkedInspectionDevices = checkedInspectionDevice.value;
    proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
    }).then(function () {
      return delInspectionDevice(checkedInspectionDevices);
    }).then(() => {
      getInspectionDeviceList(form.value.siteId);
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
}

/** 复选框选中数据 */
function handleInspectionDeviceSelectionChange(selection) {
  checkedInspectionDevice.value = selection.map(item => item.id)
}


getTemplateList();
getTreeselect();
getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
