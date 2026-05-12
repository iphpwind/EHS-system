<template>
    <div class="app-container">
      <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="计划编码" prop="planCode">
          <el-input
            v-model="queryParams.planCode"
            placeholder="请输入计划编码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input
            v-model="queryParams.planName"
            placeholder="请输入计划名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-date-picker clearable
            v-model="queryParams.year"
            type="year"
            value-format="YYYY"
            placeholder="请选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form> -->
  
      <!-- <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['safework:onlinePlan:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['safework:onlinePlan:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['safework:onlinePlan:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:onlinePlan:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row> -->
  
      <el-table v-loading="loading" :data="onlinePlanList" @selection-change="handleSelectionChange">
        <el-table-column label="员工号" align="center" prop="staffId" />
        <el-table-column label="姓名" align="center" prop="staffName" />
        <el-table-column label="所属部门" align="center" prop="deptName" width="180"/>
        <el-table-column label="计划课程数" align="center" prop="courseNum" />
        <el-table-column label="计划课程完成数" align="center" prop="pass" />	
        <el-table-column label="计划课程完成率" align="center" >
          <template #default="scope">
            <span>{{ (scope.row.pass / scope.row.courseNum*100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划课程学习总时长" align="center" prop="time" width="180"/>
        <el-table-column label="自修课程数" align="center" prop="selfStudyCourseNum" width="180"/>
        <el-table-column label="自修课程总时长" align="center" prop="selfTime" >
          <template #default="scope">
            <span v-if="scope.row.selfTime != null" >{{ scope.row.selfTime }}</span>
            <span v-else >0</span>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加题目弹出 -->
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </template>
  
  <script setup name="classHour">
  import { getClassHourList} from "@/api/safework/onlinePlan";
  
  
  
  const { proxy } = getCurrentInstance();
  const { status } = proxy.useDict('status');
  const { courseLevel } = proxy.useDict('courseLevel');
  
  const onlinePlanList = ref([]);
  const open = ref(false);
//   const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
  const deptNodeAll = ref(false);
  const deptOptions = ref([]);
  const deptRef = ref(null); 
  const onlineCourseList = ref([]);
  const dialogAddtimu = ref(false);
  const courseTableData = ref([]);
  const courseArr = ref([]);
  const courseData = ref([]);
  const childDepts = ref([]);
  const userOptions = ref([]);
  const postOption = ref(undefined);
  const data = reactive({
    form: {},
    queryParams: {
      
    },
  });
  
  const { queryParams, form, rules,quarters,categoryList,dialogQueryParams,staffQueryParams,postQueryParams,deptQueryParams } = toRefs(data);
  
  /** 查询岗位列表 */
  function getList() {
    getClassHourList().then(response => {
      console.log(response);
      onlinePlanList.value = response.rows;
    });
  }
  
  
  getList();
  </script>
  <style scoped lang="scss">
      .timutable{
          width: 100%;
          
      }
      .tags{
          .el-tag{
              margin: 10px 10px 0 0
          }
      }
  </style>
  