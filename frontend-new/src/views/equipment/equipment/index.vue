<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container down-tree">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="所属部门" prop="deptId">
            <tree-select
                v-model:value="queryParams.deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
                :objMap="{ value: 'id', label: 'label', children: 'children' }"
            />
          </el-form-item>
          <el-form-item label="所属分类" prop="classId">
            <el-select v-model="queryParams.classId" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in classOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单元" prop="sectionId">
            <el-select v-model="queryParams.sectionId" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in sectionOptions"
                  :key="item.sectionId"
                  :label="item.sectionName"
                  :value="item.sectionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备编码" prop="eqCode">
            <el-input
              v-model="queryParams.eqCode"
              placeholder="请输入设备编码"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备名称" prop="eqName">
            <el-input
              v-model="queryParams.eqName"
              placeholder="请输入设备名称"
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
              v-hasPermi="['equipment:equipment:add']"
            >新增</el-button>
          </el-col>
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="success"-->
    <!--          plain-->
    <!--          icon="Edit"-->
    <!--          :disabled="single"-->
    <!--          @click="handleUpdate"-->
    <!--          v-hasPermi="['equipment:equipment:edit']"-->
    <!--        >修改</el-button>-->
    <!--      </el-col>-->
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['equipment:equipment:remove']"
            >删除</el-button>
          </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Download"
            @click="selectEqType"
            v-hasPermi="['equipment:equipment:export']"
          >导出模板</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="upload"
            @click="handleImport"
            v-hasPermi="['equipment:equipment:import']"
          >导入设备</el-button>
        </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="equipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="eqId" />-->
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="所属分类" align="center" prop="className" />
      <el-table-column label="设备编码" align="center" prop="eqCode" />
      <el-table-column label="设备名称" align="center" prop="eqName" />
<!--      <el-table-column label="状态" align="center" prop="status" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Search"
            @click="handleChakan(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:equipment:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:equipment:remove']"
          >删除</el-button>
          <el-popover
              placement="left"
              :width="280"
              trigger="hover"
          >
            <el-button
                type="text"
                icon="list"
                @click="handleSpotCheck(scope.row)"
                v-hasPermi="['equipment:spotCheckDict:list']"
            >点检配置</el-button>
            <el-button
                type="text"
                icon="DocumentCopy"
                @click="handleFiles(scope.row)"
                v-hasPermi="['equipment:equipment:query']"
            >附件管理</el-button>
            <el-button
                type="text"
                icon="picture"
                @click="handleMa(scope.row)"
            >二维码</el-button>
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

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="equipmentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="所属分类" prop="classId">
<!--          <el-input v-model="form.classId" placeholder="请输入分类id" />-->
          <el-select v-model="form.classId" @change="changeClass" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属设备" prop="parentId">
          <tree-select
            v-model:value="form.parentId"
            :options="equipmentOptions"
            :objMap="{ value: 'eqId', label: 'eqName', children: 'children' }"
            placeholder="请选择所属设备"
          />
        </el-form-item>
        <el-form-item label="设备编码" prop="eqCode">
          <el-input v-model="form.eqCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="设备名称" prop="eqName">
          <el-input v-model="form.eqName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="特殊设备" prop="specialFlag">
					<el-radio-group v-model="form.specialFlag">
						<el-radio key="0" label="0">否</el-radio>
						<el-radio key="1" label="1">是</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="责任人" prop="liableUserId">
					<el-select v-model="form.liableUserId">
						<el-option
								v-for="item in userOptions"
								:key="item.staffId"
								:label="item.staffName"
								:value="item.staffId"
						/>
					</el-select>
        </el-form-item>
        <el-form-item label="设备图片" prop="imgUrl">
					<ImageUpload
					v-model.value="form.imgUrl"
					:limit = "1"
					/>
        </el-form-item>
      </el-form>
      <div>
<!--        <div><el-button @click="addAttr">新增属性</el-button></div>-->
        <div class="attr-buttom">
        <el-row :gutter="10">
          <el-col :span="12">名称</el-col>
          <el-col :span="12">值</el-col>
        </el-row>
        </div>
        <div v-for="(value,index) in form.eqAttributesList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input readonly  v-model="value.attrName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="value.attrValue"></el-input>
            </el-col>
<!--            <el-col :span="8">-->
<!--              <el-button @click="deleteAttr(index,value.id)">删除</el-button>-->
<!--            </el-col>-->
          </el-row>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 查看对话框 -->
    <el-dialog :title="title" v-model="chakanopen" width="500px" append-to-body>
      <el-form ref="equipmentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="所属分类" prop="classId">
          <!--          <el-input v-model="form.classId" placeholder="请输入分类id" />-->
          <el-select v-model="form.classId" filterable placeholder="请选择">
            <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属设备" prop="parentId">
          <tree-select
            v-model:value="form.parentId"
            :options="equipmentOptions"
            :objMap="{ value: 'eqId', label: 'eqName', children: 'children' }"
            placeholder="请选择所属设备"
          />
        </el-form-item>
        <el-form-item label="设备编码" prop="eqCode">
          <el-input readonly v-model="form.eqCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="设备名称" prop="eqName">
          <el-input readonly v-model="form.eqName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="特殊设备" prop="specialFlag">
					<el-radio-group v-model="form.specialFlag">
						<el-radio key="0" label="0">否</el-radio>
						<el-radio key="1" label="1">是</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="责任人" prop="liableUserId">
					<el-select v-model="form.liableUserId">
						<el-option
								v-for="item in userOptions"
								:key="item.staffId"
								:label="item.staffName"
								:value="item.staffId"
						/>
					</el-select>
        </el-form-item>
        <el-form-item label="设备图片" prop="imgUrl">
					<ImageUpload
					v-model.value="form.imgUrl"
					:limit = "1"
					/>
        </el-form-item>
      </el-form>
      <div>
        <!--        <div><el-button @click="addAttr">新增属性</el-button></div>-->
        <div class="attr-buttom">
          <el-row :gutter="10">
            <el-col :span="12">名称</el-col>
            <el-col :span="12">值</el-col>
          </el-row>
        </div>
        <div v-for="(value,index) in form.eqAttributesList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input readonly v-model="value.attrName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input readonly v-model="value.attrValue"></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!-- 选择要导入的设备类型对话框 -->
    <el-dialog :title="exportTitle" v-model="eqTypeOpen" width="500px" append-to-body>
      <el-form ref="equipmentTypeRef" :model="eqTypeform" :rules="rules" label-width="80px">
        <el-form-item label="所属分类" prop="classId">
          <el-select v-model="eqTypeform.classId" @change="changeClass" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="eqTypeformSubmitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

      <!-- 设备导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.importOpen" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的设备数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.importOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

		<!-- 设备点检配置对话框 -->
		<el-dialog title="设备点检配置" v-model="spotcheckopen" width="800px" append-to-body>
      <div class="dianjian">
        <el-card class="box-card">
          <div class="seachform">
            <el-form :model="eqParams">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="设备编号" prop="eqCode">
                    <div style="min-width: 100px;">{{eqParams.eqCode}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="设备名称" prop="eqName">
                    <div style="min-width: 100px;">{{eqParams.eqName}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所在单元" prop="sectionName">
                    <div style="min-width: 100px;">{{eqParams.sectionName}}</div>
                  </el-form-item>
                </el-col>
<!--                <el-col :span="6">
                  <el-form-item>
                    <el-button class="checkbtn" @click="handleSpotSave">保存</el-button>
                  </el-form-item>
                </el-col>-->
              </el-row>
            </el-form>
          </div>
        </el-card>

        <el-card class="box-card tablebox">
          <template #header>
            <div class="card-header">
              <span>点检列表</span>
              <div class="addbtn" @click="handleSpotAdd">
                <el-icon><CirclePlus /></el-icon> 添加
              </div>
            </div>
          </template>

          <el-table
              :data="eqSpotCheckContentList"
              stripe="true"
              border
              style="width: 100%"
              v-loading="loading"
              height="400px"
          >
            <el-table-column prop="orderNum" label="排序" width="100"/>
            <el-table-column prop="content" label="点检项目"/>
            <el-table-column label="操作" width="400">
              <template #default="scope">
<!--                <el-button class="handlebtn">上移</el-button>
                <el-button class="handlebtn">下移</el-button>-->
                <el-button class="handlebtn" @click="handleSpotEdit(scope.row)">编辑</el-button>
                <el-button class="handlebtn" @click="handleSpotDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
		</el-dialog>

    <!-- 设备点检配置对话框 -->
    <el-dialog title="设备附件" v-model="eqfilemo" width="800px" append-to-body>
<!--      <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :file-list="eqfileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>-->
      <FileUpload
          v-model.value="eqfile.addreses"
      />
<!--      <ul class="list-group list-group-striped">-->
<!--        <li v-for="(item, index) in fileList" :key="index">-->
<!--            {{item.address.substring(item.address.lastIndexOf("/")+1,item.address.length)}} <button @click="deleteEqFile(item.id)">删除</button>-->
<!--        </li>-->
<!--      </ul>-->
      <el-button class="handlebtn" @click="saveEqfile">保存</el-button>
      <el-button class="handlebtn" @click="">取消</el-button>
    </el-dialog>

    <!-- 设备二维码对话框 -->
    <el-dialog title="二维码" v-model="eqerweimamo" width="800px" append-to-body>
      <div style="width:200px;height:200px"><img :src="erweimaimgUrl" /></div>
      <el-button class="handlebtn" @click="saveEqerweima">下载</el-button>
      <el-button class="handlebtn" @click="returner">返回</el-button>
    </el-dialog>

		<!-- 设备点检配置新增/修改框 -->
		<el-dialog :title="titleSpot" v-model="spotcheckopen2" width="500px" append-to-body>
      <el-form ref="eqSpotCheckRef" :model="eqSpotCheckform" :rules="rulesSpotCheck" label-width="80px">
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="eqSpotCheckform.orderNum" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="点检项目" prop="content">
          <el-input v-model="eqSpotCheckform.content" placeholder="请输入点检项目" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="eqSpotCheckformSubmitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
		</el-dialog>
    </el-col>
  </el-row>
  </div>
</template>

<script setup name="Equipment">
import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment ,addSpotCheck,getErweima} from "@/api/equipment/equipment";
import { listFiles,addFiles, updateFiles,getFiles, delFiles} from "@/api/equipment/files";
import { listClassification } from "@/api/equipment/classification";
import { listAttributes } from "@/api/equipment/classattributes";
import { listEquipAttributes } from "@/api/equipment/equipattributes";
import {treeselect} from "@/api/system/dept";
import {getToken} from "../../../utils/auth";
import { listUser } from "@/api/system/user";
import { listStaff } from "@/api/system/staff";
import { listEqSpotCheckContent, getEqSpotCheckContent, addEqSpotCheckContent, updateEqSpotCheckContent, delEqSpotCheckContent, changeOrderNum } from "@/api/equipment/eqSpotCheckContent";
import { listSection } from "@/api/unitmanage/section";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const equipmentList = ref([]);
const equipmentOptions = ref([]);
const sectionOptions = ref([]);
const eqSpotCheckContentList = ref([]);
const open = ref(false);
const chakanopen = ref(false);
const spotcheckopen = ref(false);
const eqfilemo = ref(false);
const eqerweimamo = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const exportTitle = ref("导出模板");
const deptOptions = ref(undefined);
const classOptions = ref(undefined);
const eqTypeOpen = ref(false);
const userOptions = ref([]);
const eqfileList = ref([]);
const fileList = ref([]);
const titleSpot = ref("");
const spotcheckopen2 = ref(false);
const eqIdSpot = ref("");
const sectionName = ref("");
const eqCode = ref("");
const eqName = ref("");
const deptName = ref("");
const erweimaimgUrl = ref("");
const upload = reactive({
  // 是否显示弹出层（设备导入）
  importOpen: false,
  // 弹出层标题（设备导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/equipment/equipment/importData"
});
const data = reactive({
  form: {},
  rowinfo:{
    eqId:null,
    qrCode:null,
  },
  eqTypeform:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    classId: null,
    eqCode: null,
    eqName: null,
    status: null,
		sectionId: null,
  },
  rules: {
    deptId: [
      { required: true, message: "所属部门不能为空", trigger: "blur" }
    ],
    classId: [
      { required: true, message: "所属分类不能为空", trigger: "blur" }
    ],
    eqCode: [
      { required: true, message: "编码不能为空", trigger: "blur" }
    ],
    eqName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
  },
	eqParams:{},
  eqSpotCheckform:{},
  rulesSpotCheck: {
    orderNum: [
      { required: true, message: "排序不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "点检项目不能为空", trigger: "blur" }
    ],
  },
  classId:'',
  eqCode:null,
  eqName:null,
  sectionName:null,
  eqfile:{
    eqId:null,
    addreses:null
  }
});

const { queryParams, form,eqTypeform, rules, eqParams, eqSpotCheckform, rulesSpotCheck,eqfile,rowinfo } = toRefs(data);

const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

function deleteEqFile(id){
  delFiles(id).then(response =>{
    proxy.$modal.msgSuccess("删除成功");
    eqfilemo.value = false;
  })
}
function saveEqfile(){
  eqfile.value.eqId = eqIdSpot.value;
  if (eqfile.value.id != null) {
    updateFiles(eqfile.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      eqfilemo.value = false;
    });
  } else {
    addFiles(eqfile.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      eqfilemo.value = false;
    });
  }
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
};
function selectEqType(){
  eqTypeOpen.value = true;
}

function handleImport(){
  upload.title = "设备导入";
  upload.importOpen = true;
}

/** 提交上传文件 */
function submitFileForm() {
  // if(data.classId != null && data.classId != ''){
    proxy.$refs["uploadRef"].submit();
  // }else{
  //   proxy.$modal.msgError("请先导出模板");
  // }

};

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 查询设备下拉树结构 */
async function getTreeselect() {
  equipmentOptions.value = [];
  await listEquipment({delFlag: "0", status: "0"}).then(response => {
    const data = {eqId: 0, eqName: "顶级节点", children: []};
    data.children = proxy.handleTree(response.rows, "eqId");
    equipmentOptions.value.push(data);
  });
}

/** 查询单元组织管理下拉树结构 */
async function getSectionList() {
  sectionOptions.value = [];
  await listSection({delFlag: "0",status:"0"}).then(response => {
    sectionOptions.value = response.data;
  });
}

/** 查询人员列表 **/
function getUserList(){
	listStaff().then(response => {
		  userOptions.value = response.rows;
	});
}

/** 查询设备列表 */
function getList() {
  loading.value = true;
  listEquipment(queryParams.value).then(response => {
    equipmentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getClass() {
  listClassification().then(res => {
    classOptions.value = res.rows;
  })
}

function changeClass(id) {
  listAttributes({classId:id}).then(res => {
    //form.value.eqAttributesList = res.rows;
    if(res.total>0){
      form.value.eqAttributesList = res.rows;
    }else {
      form.value.eqAttributesList = [];
    }
  })
}

// 取消按钮
function cancel() {
  open.value = false;
  eqTypeOpen.value = false;
	spotcheckopen2.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    eqId: null,
    deptId: null,
    classId: null,
    eqCode: null,
    eqName: null,
    status: "0",
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    parentId: null,
    imgUrl: null,
    specialFlag: "0",
    liableUserId: null,
  };
  proxy.resetForm("equipmentRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.deptId = '';
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.eqId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const eqId = row.eqId || ids.value
  getEquipment(eqId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备";
  });
  listEquipAttributes({eqId:eqId}).then(res => {
    form.value.eqAttributesList = res.rows
  })
}
/** 查看 */
function handleChakan(row) {
  reset();
  const eqId = row.eqId

  getEquipment(eqId).then(response => {
    form.value = response.data;
    listEquipAttributes({eqId:eqId}).then(res => {
    form.value.eqAttributesList = res.rows
    chakanopen.value = true;
  })
    title.value = "查看";
  });

}

/** 选择导出设备类型提交按钮 */

function eqTypeformSubmitForm(){
   proxy.$refs["equipmentTypeRef"].validate(valid => {
    if (valid) {
      eqTypeOpen.value = false;
      data.classId = eqTypeform.value.classId
      handleExport();
    }
  });
}

function handleCheck(row) {
  const id = row.id
  listAttributes({classId:id}).then(res => {
    if(res.total>0){
      form.value.eqClassAttributesList = res.rows;
      sxopen.value = true;
      title.value = "查看分类属性";
    }else {
      form.value.eqClassAttributesList = [];
      sxopen.value = true;
      title.value = "查看分类属性";
      // proxy.$modal.msgSuccess("修改成功");
    }
  })
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["equipmentRef"].validate(valid => {
    if (valid) {
      if (form.value.eqId != null) {
        updateEquipment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEquipment(form.value).then(response => {
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
  const eqIds = row.eqId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delEquipment(eqIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('equipment/equipment/exportTemplate', {
    ...eqTypeform.value
  }, `equipment_${new Date().getTime()}.xlsx`)
}

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};

/** 设备点检配置 */
function handleSpotCheck(row) {
	eqParams.value = row;
	eqIdSpot.value = row.eqId;
  listEqSpotCheckContent({eqId: row.eqId}).then(response => {
		eqSpotCheckContentList.value = response.rows;
		spotcheckopen.value = true;
	});
}

/** 设备附件管理 */
function handleFiles(row) {
  eqParams.value = row;
  eqIdSpot.value = row.eqId;
  listFiles({eqId: row.eqId}).then(response => {
    fileList.value = response.rows;
    eqfilemo.value = true;
  });
}

/** 设备二维码管理 */
function handleMa(row) {
  rowinfo.value = row;
  getErweima(row.eqId).then(response => {
    erweimaimgUrl.value = response.data.qrCode
    eqerweimamo.value = true;
  });
}

/** 下载二维码操作 **/
function saveEqerweima(){
  proxy.download('equipment/equipment/qrCode', {
    ...rowinfo.value}, rowinfo.value.qrCode.split("/",6)[5])
}

function returner(){
  eqerweimamo.value = false;
}

// 表单重置
function resetSpot() {
  eqSpotCheckform.value = {
    id: null,
    orderNum: null,
    content: null,
  };
  proxy.resetForm("eqSpotCheckRef");
}

function handleSpotAdd(){
	resetSpot();
	spotcheckopen2.value = true;
	titleSpot.value = "设备点检配置新增";
}

function handleSpotEdit(row){
	resetSpot();
	getEqSpotCheckContent(row.id).then(response => {
		if(response.code == 200){
			eqSpotCheckform.value.id = response.data.id;
			eqSpotCheckform.value.orderNum = response.data.orderNum;
			eqSpotCheckform.value.content = response.data.content;
			spotcheckopen2.value = true;
			titleSpot.value = "设备点检配置修改";
		}
	});
}

function eqSpotCheckformSubmitForm(){
	proxy.$refs["eqSpotCheckRef"].validate(valid => {
		if (valid) {
			if (eqSpotCheckform.value.id != null) {
				updateEqSpotCheckContent(eqSpotCheckform.value).then(response => {
					proxy.$modal.msgSuccess("修改成功");
					spotcheckopen2.value = false;
          sectionName.value = eqParams.value.sectionName;
          eqCode.value = eqParams.value.eqCode;
          eqName.value = eqParams.value.eqName;
					handleSpotCheck({eqId:eqIdSpot.value});
          eqParams.value.sectionName = sectionName.value;
          eqParams.value.eqCode = eqCode.value;
          eqParams.value.eqName = eqName.value;
				});
			} else {
				eqSpotCheckform.value.eqId = eqIdSpot.value;
				addEqSpotCheckContent(eqSpotCheckform.value).then(response => {
					proxy.$modal.msgSuccess("新增成功");
					spotcheckopen2.value = false;
          sectionName.value = eqParams.value.sectionName;
          eqCode.value = eqParams.value.eqCode;
          eqName.value = eqParams.value.eqName;
					handleSpotCheck({eqId:eqIdSpot.value});
          eqParams.value.sectionName = sectionName.value;
          eqParams.value.eqCode = eqCode.value;
          eqParams.value.eqName = eqName.value;
				});
			}
		}
	});
}

function handleSpotDelete(row){
  const content = row.content;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delEqSpotCheckContent(row.id);
  }).then(() => {
    sectionName.value = eqParams.value.sectionName;
    eqCode.value = eqParams.value.eqCode;
    eqName.value = eqParams.value.eqName;
		handleSpotCheck({eqId:eqIdSpot.value});
    proxy.$modal.msgSuccess("删除成功");
    eqParams.value.sectionName = sectionName.value;
    eqParams.value.eqCode = eqCode.value;
    eqParams.value.eqName = eqName.value;
  }).catch(() => {});
}

function handleSpotUp(row){
	changeOrderNum({id:row.id,changeOrderNumType:"up"}).then(response => {
		handleSpotCheck({eqId:eqIdSpot.value});
	});
}

function handleSpotDown(row){
	changeOrderNum({id:row.id,changeOrderNumType:"down"}).then(response => {
		handleSpotCheck({eqId:eqIdSpot.value});
	});
}

function handleSpotSave(){
	/*addSpotCheck({eqId:eqIdSpot.value}).then(response => {
		proxy.$modal.msgSuccess("保存成功");
		spotcheckopen.value = false;
		getList();
	});*/
  addEqSpotCheckContent({eqId:eqIdSpot.value}).then(response => {
    proxy.$modal.msgSuccess("保存成功");
    spotcheckopen.value = false;
    getList();
  });
}

getSectionList();
getTreeselect();
getUserList();
getList();
initTreeData();
getClass();
</script>
<style lang="scss">
.attr-buttom{
  border-bottom: 1px solid #f5f5f5;
  padding: 10px;
  background: #fbfbfb;
}
.attrli{

  margin: 5px 0;
}
.toolsline{
  height: 30px;
}

.dianjian{
  padding: 10px;
  background: #f3f3f3;
  //height: calc(100vh - 84px);

  .box-card{
    .seachform{
      .checkbtn{
        background: #1a56db;padding: 0 25px;border: 0;color: #fff;
      }
      :deep(.el-form-item--default) {margin: 0;}
    }
  }
  .tablebox{
    margin: 10px 0 0;padding: 0;position: relative;
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #1a56db;font-size: 16px;font-weight: 600;
      }
    }
    .addbtn{
      float: right;color: #1a56db;font-size: 14px;
      display: block;margin: 5px 0 0;cursor:pointer;
      :deep(.el-icon) {
        vertical-align: middle;font-size: 16px;
      }
    }
    .handlebtn{
      height: auto;border: 0;padding: 0;color: #1a56db;
      position: relative;margin-right: 15px;
    }
    .handlebtn:hover{
      background: transparent;
    }
    .handlebtn+.handlebtn::after{
      content: '|';
      position: absolute;left: -14px;top: -1px;color: #1a56db;
    }
    :deep(.el-card__body) {
      height: calc(100% - 75px);
    }
    :deep(.el-table) {
      .el-table__header-wrapper th{
        text-align: center;background: #1a56db !important;color: #fff;border: 0;
      }
      td.el-table__cell{text-align: center;}
      .el-table__inner-wrapper::before{
        display: none;
      }
    }
    .pages{
      position: absolute;padding-right: 70px;
      right: 20px;bottom: 10px;
      :deep(.el-pagination) {
        padding: 0;
        .el-pager li{
          outline: none;background: transparent;border: 1px solid #ddd;
        }
        .el-pager li.active{
          background: #1a56db;border-color: #1a56db;font-weight: normal;
        }
      }
      .pagebtn{
        position: absolute;right: 0;top: 0;
      }
    }
  }
}
</style>
