<template>

  <div class="knowinfo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>运维知识清单</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="设备类型">
            <el-select v-model="queryParams.classId" placeholder="请选择" >
              <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="知识名称" prop="knowName">
            <el-input
                v-model="queryParams.knowName"
                placeholder="请输入运维知识名称"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="handleQuery" class="checkbtn">查询</el-button>
            <el-button  @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--表格-->
    <div class="table">

      <div class="nav">
        <el-button
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['unitManage:knowinfo:add']"
        >新增</el-button>
      </div>


      <el-table
          :data="knowinfoList"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange"
      >
        <el-table-column label="设备类型" align="center" prop="className" />
        <el-table-column label="名称" align="center" prop="knowName" />
        <el-table-column label="内容" align="center" prop="knowContent" width="800" />
        <el-table-column label="操作" width="200" fixed="right" >
          <template #default="scope" >
            <el-tooltip
                effect="light"
                content="查询"
                placement="top"
            >
              <el-button class="operation" @click="handleLook(scope.row)"><el-icon :size="20" ><Document /></el-icon></el-button>
            </el-tooltip>
            <el-tooltip
                class="box-item"
                effect="light"
                content="编辑"
                placement="top"
            >
              <el-button class="operation" @click="handleUpdate(scope.row)"><el-icon :size="20" ><Edit /></el-icon></el-button>
            </el-tooltip>
            <el-tooltip
                class="box-item"
                effect="light"
                content="删除"
                placement="top"
            >
              <el-button class="operation" @click="handleDelete(scope.row)"><el-icon :size="20" ><Delete /></el-icon></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <!--    <el-table v-loading="loading" :data="knowinfoList" @selection-change="handleSelectionChange">-->
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <!--      <el-table-column label="设备分类" align="center" prop="className" />-->
      <!--      <el-table-column label="运维知识名称" align="center" prop="knowName" />-->
      <!--      <el-table-column label="运维知识内容" align="center" prop="knowContent" />-->
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template #default="scope">-->
      <!--          <el-button-->
      <!--            type="text"-->
      <!--            icon="Edit"-->
      <!--            @click="handleUpdate(scope.row)"-->
      <!--            v-hasPermi="['unitManage:knowinfo:edit']"-->
      <!--          >修改</el-button>-->
      <!--          <el-button-->
      <!--            type="text"-->
      <!--            icon="Delete"-->
      <!--            @click="handleDelete(scope.row)"-->
      <!--            v-hasPermi="['unitManage:knowinfo:remove']"-->
      <!--          >删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--    </el-table>-->
      <!-- 页码 -->

      <div class="pages">
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </div>

      <!-- 添加或修改运维知识台账对话框 -->
      <div class="addtanchu">


        <el-dialog :title="title" v-model="open" width="40%"  >
          <el-form ref="knowinfoRef" :model="form" :rules="rules" label-width="80px">

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备类型" prop="classId">
                  <el-select v-model="form.classId" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="名称" prop="knowName">
                  <el-input v-model="form.knowName" placeholder="请输入运维知识名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容">
                  <el-input type="textarea" v-model="form.knowContent"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上传图片" prop="imgUrl">
                  <ImageUpload
                      v-model="form.imgUrl"
                      :limit = "1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上传附件" prop="knowAttAddress">
                  <FileUpload
                      v-model.value="form.knowAttAddresses"
                  />
                  <!--        <ul class="list-group list-group-striped">
                            <li v-for="(item, index) in fileList" :key="index">
                              <el-link :href="item.knowAttAddress" :underline="false" target="_blank">
                              {{item.knowAttAddress.substring(item.knowAttAddress.lastIndexOf("/")+1,item.knowAttAddress.length)}} <button @click="deleteEqFile(item.knowAttId)">删除</button>
                              </el-link>
                            </li>
                          </ul>-->
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
                    <li :key="file.knowAttId" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
                      <el-link :href="file.knowAttAddress" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.knowAttAddress) }} </span>
                      </el-link>
                      <div class="ele-upload-list__item-content-action">
                        <el-link :underline="false" @click="handleDeletefile(index)" type="danger">删除</el-link>
                      </div>
                    </li>
                  </transition-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm" class="btn green">确 定</el-button>
              <el-button @click="cancel" class="btn">取 消</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <div class="addtanchu">
        <el-dialog :title="title" v-model="opencha" width="40%"  >
          <el-form ref="knowinfoRef" :model="form" :rules="rules" label-width="80px">

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备类型" prop="classId">
                  <el-select v-model="form.classId" placeholder="请选择" disabled >
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="名称" prop="knowName">
                  <el-input v-model="form.knowName" placeholder="请输入运维知识名称" readonly/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容">
                  <el-input type="textarea" v-model="form.knowContent" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上传图片" prop="imgUrl">
                  <ImageUpload
                      v-model="form.imgUrl"
                      :limit = "1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上传附件" prop="knowAttAddress">
                  <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
                    <li :key="file.knowAttId" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
                      <el-link :href="file.knowAttAddress" :underline="false" target="_blank">
                        <span class="el-icon-document"> {{ getFileName(file.knowAttAddress) }} </span>
                      </el-link>
                    </li>
                  </transition-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-dialog>
      </div>

    </div>
  </div>

</template>

<script setup name="Knowinfo">
import { listKnowinfo, getKnowinfo, delKnowinfo, addKnowinfo, updateKnowinfo } from "@/api/unitManage/knowinfo";
import {listClassification} from "@/api/equipment/classification";
import {h} from "vue";
const emit = defineEmits();
const { proxy } = getCurrentInstance();

const knowinfoList = ref([]);
const tableData = [
  {
    className: '电力',
    knowName: '轴承圆圈',
    knowContent: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
  },
  {
    className: '电力',
    knowName: '轴承圆圈',
    knowContent: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
  }
]

const open = ref(false);
const opencha = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const options = ref([]);
const fileList = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classId: null,
    knowName: null,
    delFlag:0,
  },
  rules: {
  },
});

const { queryParams, form, rules } = toRefs(data);

// 获取文件名称
function getFileName(name) {
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return "";
  }
}

// 删除文件
function handleDeletefile(index) {
  fileList.value.splice(index, 1);
  emit("update:modelValue", listToString(fileList.value));
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = "";
  separator = separator || ",";
  for (let i in list) {
    strs += list[i].url + separator;
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : '';
}

/** 查询运维知识台账列表 */
function getList() {
  loading.value = true;
  listKnowinfo(queryParams.value).then(response => {
    knowinfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询设备分类列表 */
function getClassList() {
  loading.value = true;
  listClassification(queryParams.value).then(response => {
    options.value = response.rows;
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
    knowId: null,
    classId: null,
    knowContent: null,
    knowName: null,
    imgUrl: null,
    knowAttAddresses:null
  };
  proxy.resetForm("knowinfoRef");
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
  ids.value = selection.map(item => item.knowId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  fileList.value = [];
  open.value = true;
  title.value = "添加运维知识台账";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const knowId = row.knowId || ids.value
  getKnowinfo(knowId).then(response => {
    form.value = response.data;
    fileList.value = response.data.unitKnowAttachmentList;
    open.value = true;
    title.value = "修改运维知识台账";
  });
}

/** 查看按钮操作 */
function handleLook(row) {
  reset();
  const knowId = row.knowId || ids.value
  getKnowinfo(knowId).then(response => {
    form.value = response.data;
    fileList.value = response.data.unitKnowAttachmentList;
    opencha.value = true;
    title.value = "运维知识台账";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["knowinfoRef"].validate(valid => {
    if (valid) {
      if (form.value.knowId != null) {
        console.log(fileList.value);
        console.log(form.value);
        if(fileList.value.length>0){
          fileList.value.forEach((i, index) => {
            if(form.value.knowAttAddresses!=null && form.value.knowAttAddresses!='' && form.value.knowAttAddresses!='undefined'){
              form.value.knowAttAddresses = form.value.knowAttAddresses+","+i.knowAttAddress;
            }else{
              form.value.knowAttAddresses = i.knowAttAddress;
            }
          })
        }
        updateKnowinfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addKnowinfo(form.value).then(response => {
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
  const knowIds = row.knowId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delKnowinfo(knowIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/knowinfo/export', {
    ...queryParams.value
  }, `knowinfo_${new Date().getTime()}.xlsx`)
}

getList();
getClassList();
</script>
<style scoped lang="scss">
.knowinfo {
  padding: 10px;
  background: #f3f3f3;
  height: calc(100vh - 84px);

  .box-card {
    .card-header {
      span {
        padding: 0 10px;
        border-left: 4px solid #09bec5;
        font-size: 18px;
      }
    }

    .seachform {
      .checkbtn {
        background: #09bec5;
        padding: 0 25px;
        border: 0;
        color: #fff;
      }
    }
  }
  .table{
    padding: 20px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 3px;
    height: calc(100% - 160px);
    position: relative;
    margin: 10px 0 0;

    .handlebtn{
      height: auto;border: 0;padding: 0;color: #09bec5;
    }

    :deep(.el-table) {

      .el-table__header-wrapper th{
        text-align: center;background: #09bec5 !important;color: #fff;border: 0;
      }
      .sort-caret.ascending{
        border-bottom-color: #fff !important;
      }
      .sort-caret.descending{
        border-top-color: #fff !important;
      }
      td.el-table__cell{text-align: center;border-color: #d2eef1;}
      .el-table__inner-wrapper::before{
        display: none;
      }
      .el-table__row--striped td.el-table__cell{
        background: #f6fcfc !important;
      }
      .el-table__row:hover  td.el-table__cell{
        background: #f6fcfc !important;
      }
    }
    :deep(.el-table--border::after) {
      display: none;
    }
    :deep(.el-table--border::before) {
      display: none;
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
          background: #09bec5;border-color: #09bec5;font-weight: normal;
        }
      }
      .pagebtn{
        position: absolute;right: 0;top: 0;
      }
    }
    .operation{
      padding: 0;
      border: none;
      background: transparent;
      --el-button-hover-text-color:#37c4cb;
    }
    .nav{
      text-align: right;
      margin-bottom: 10px;
    }
    .addtanchu{
      :deep(.el-dialog) {
        overflow: hidden;
        .el-dialog__header{
          box-shadow: 0 5px 10px #eee;
        }
      }
      .el-form {
        .el-select{
          width: 100%;
        }
      }
      .dialog-footer{
        display: block;width: 100%;text-align: center;margin-top: -20px;
        padding: 0 0 20px;
        .btn{
          width: 200px;
        }
        .green{background: #09bec5;color: #fff;border-color: #09bec5;}
      }
    }
  }

}
</style>
