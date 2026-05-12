<template>
  <div class="dianjian">
    <el-card class="box-card">
      <div class="seachform">
        <el-form :model="queryParams">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="设备类型">
                <el-select v-model="queryParams.classId" placeholder="请选择" @change="seleeq">
                  <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
<!--            <el-col :span="18">
              <el-form-item>
                <el-button class="checkbtn" @click="save">保存</el-button>
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
          <div class="addbtn" @click="add">
            <el-icon><CirclePlus /></el-icon> 添加
          </div>
        </div>
      </template>

      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
          height="100%"
      >
        <el-table-column prop="orderNum" label="排序" width="100"/>
        <el-table-column prop="dictName" label="点检项目"/>
        <el-table-column label="操作" width="400">
          <template #default="scope">
<!--            <el-button class="handlebtn">上移</el-button>
            <el-button class="handlebtn">下移</el-button>-->
            <el-button class="handlebtn" @click="edit(scope.row)">编辑</el-button>
            <el-button class="handlebtn" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <div class="pages">
        <el-pagination
            background
            :total="10"
            ref="page"
        />
        <el-button @click="confirm1" class="pagebtn">确定</el-button>
      </div>
    </el-card>

    <!-- 添加、编辑弹出 -->
    <div class="tanchu">
      <el-dialog
          v-model="dialogVisible"
          title="添加/编辑"
          width="30%"
      >
        <el-form ref="spotCheckDictRef" :model="form" :rules="rules"  label-width="120px">
          <el-form-item label="点检项目" prop="dictName">
            <el-input v-model="form.dictName" />
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
            <el-input v-model="form.orderNum" type="number"/>
          </el-form-item>
        </el-form>
        <template #footer>
					<span class="dialog-footer">
						<el-button @click="confirm">确认</el-button>
					</span>
        </template>
      </el-dialog>
    </div>

  </div>

</template>

<script>
import { listSpotCheckDict, getSpotCheckDict, delSpotCheckDict, addSpotCheckDict, updateSpotCheckDict, changeOrderNum } from "@/api/equipment/spotCheckDict";
import { listClassification } from "@/api/equipment/classification";
export default {
  name: "巡检统计",
  data() {
    return {
      value : '',
      options: [
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
      ],
      tableData: [],
      dialogVisible: false,
      dictName: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: null,
        classId: null,
        delFlag:0,
      },
      form:{
        dictName:'',
        dictId:null,
        classId:null,
        orderNum:null,
      },
      rules: {
        dictName: [
          { required: true, message: '请输入点检项目', trigger: 'blur' }
        ],
        orderNum: [
          {required: true, message: '请输入点检排序', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    this.getList();
    this.getClassList();
  },
  methods: {
    add(){
      if(this.queryParams.classId!=null && this.queryParams.classId!=''){
        this.dialogVisible = true;
      }else{
        this.$message({
          type: 'error',
          message: `先选择设备类型！`
        });
      }
    },

    confirm() {
      this.$refs["spotCheckDictRef"].validate((valid) => {
        if (valid) {
          if (this.form.dictId != null) {
            updateSpotCheckDict(this.form).then(response => {
              this.$message({
                type: 'success',
                message: `修改成功！`
              });
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            addSpotCheckDict(this.form).then(response => {
              this.$message({
                type: 'success',
                message: `新增成功！`
              });
              this.dialogVisible = false;
              this.getList();
            });
          }
        } else {
          return false;
        }
      });
    },
    edit(row){
      if(this.queryParams.classId!=null && this.queryParams.classId!=''){
        this.reset();
        const dictId = row.dictId || this.ids
        getSpotCheckDict(dictId).then(response => {
          this.form = response.data;
          this.dialogVisible = true
        });
      }else{
        this.$message({
          type: 'error',
          message: `先选择设备类型！`
        });
      }
    },
    /** 删除按钮操作 */
    del(row) {
    const dictIds = row.dictId || this.ids
    this.$confirm('是否确认删除点检字典编号为"' + dictIds + '"的数据项？').then(function() {
      return delSpotCheckDict(dictIds);
    }).then(() => {
      this.getList();
      this.$message({
        type: 'success',
        message: `删除成功！`
      });
    }).catch(() => {});
  },

// 表单重置
    reset() {
      this.form = {
        dictName: '',
        orderNum:null
      };
    },
    getList(){
      if(this.queryParams.classId!=null && this.queryParams.classId!=''){
        this.loading = true;
        listSpotCheckDict(this.queryParams).then(response => {
          this.tableData = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    /** 查询设备分类列表 */
    getClassList() {
      this.loading = true;
      listClassification(this.queryParams).then(response => {
        this.options = response.rows;
      });
    },
    seleeq(val){
      this.getList();
      this.form.classId=val;
    }
  }
}


</script>

<style scoped lang="scss">
.dianjian{
  padding: 10px;
  background: #f3f3f3;
  height: calc(100vh - 84px);

  .box-card{
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }
      :deep(.el-form-item--default) {margin: 0;}
    }
  }
  .tablebox{
    margin: 10px 0 0;padding: 0;position: relative;
    height: calc(100% - 80px);
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
    }
    .addbtn{
      float: right;color: #09bec5;font-size: 14px;
      display: block;margin: 5px 0 0;cursor:pointer;
      :deep(.el-icon) {
        vertical-align: middle;font-size: 16px;
      }
    }
    .handlebtn{
      height: auto;border: 0;padding: 0;color: #09bec5;
      position: relative;margin-right: 15px;
    }
    .handlebtn:hover{
      background: transparent;
    }
    .handlebtn+.handlebtn::after{
      content: '|';
      position: absolute;left: -14px;top: -1px;color: #09bec5;
    }
    :deep(.el-card__body) {
      height: calc(100% - 75px);
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
  }
}
</style>