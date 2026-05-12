<template>
  <div class="app-container">
        <el-card class="box-card">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="课程名称">
                <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" clearable />
              </el-form-item>
              <el-form-item label="所属分类">
              <el-select v-model="queryParams.category" clearable placeholder="请选择分类">
                <el-option
                    v-for="item in classificationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="适用对象">
              <el-select
                  v-model="queryParams.courseTarget"
                  placeholder="请选择适用对象"
                  clearable
              >
              <el-option
                v-for="dict in course_target"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="试卷名称">
              <el-input v-model="queryParams.title" placeholder="请输入试卷名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="box-card part2">
          <el-table v-loading="loading" :data="resultList" @selection-change="handleSelectionChange">
<!--            <el-table-column type="selection" width="55" />-->
            <el-table-column label="所属分类" sortable align="center" prop="categoryName" width="100" />
            <el-table-column label="课程名称" sortable align="center" prop="courseName" width="100"/>
            <el-table-column label="文件类型" sortable align="center" prop="type"  width="100">
              <template #default="scope">
                <span v-if="scope.row.type == 1 " >视频</span>
                <span v-if="scope.row.type == 2 " >音频</span>
                <span v-if="scope.row.type == 3 " >文档</span>
              </template>
            </el-table-column>
            <el-table-column label="适用对象" sortable align="center" prop="targetAudience" width="100" >
              <template #default="scope">
                <dict-tag :options="course_target" :value="scope.row.targetAudience"/>
              </template>
            </el-table-column>
            <el-table-column label="学习课程总次数" sortable align="center" prop="hits" width="150" />
            <el-table-column label="学习总时长" sortable align="center" prop="time" width="150"/>
            <el-table-column label="平均学习时长" sortable align="center" prop="avgStudyTime" width="150"/>
            <el-table-column label="试卷名称" sortable align="center" prop="title" width="150"/>
            <el-table-column label="命题方式" sortable align="center" prop="propositionMethod"  width="100">
              <template #default="scope">
                <span v-if="scope.row.propositionMethod == 0 " >固定命题</span>
                <span v-if="scope.row.propositionMethod == 1 " >随机命题</span>
              </template>
            </el-table-column>
            <el-table-column label="总题目数" sortable align="center" prop="questions"  width="100"/>
            <el-table-column label="总分" sortable align="center" prop="fraction"  width="100"/>
            <el-table-column label="及格分数" sortable align="center" prop="passing_mark"  width="100"/>
            <el-table-column label="考试总时长" sortable align="center" prop="testTime"   width="150"/>
            <el-table-column label="考试平均时长" sortable align="center" prop="avgTime"  width="150"/>
            <el-table-column label="参与人数" sortable align="center" prop="testCount"  width="100"/>
            <el-table-column label="通过人数" sortable align="center" prop="passNum"  width="150"/>
            <el-table-column label="通过率" sortable align="center"  width="100">
              <template #default="scope">
                <span>{{ (scope.row.passNum / scope.row.testCount*100).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" style="text-align: center;">
              <template #default="scope">
                <el-button text size="small"  @click="examination(scope.row)" >考试记录</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-card>


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
import { getTestResultList} from "@/api/safework/onlinePlan";
import { listCategory} from "@/api/safework/category";

const { proxy } = getCurrentInstance();
const { course_target } = proxy.useDict('course_target');
const classificationList = ref([]);
const resultList = ref([]);
const radio1 = ref('1')
const data = reactive({
  form: {},
  queryParams: {

  },
});
const formpxjh = reactive({
  evaluate: '',
  conclusion: '',
  personnel: '',
  data: '',
});

const formInline = reactive({
  region: '',
  schemer: '',
  sort: '',
  object: '',
  date: '',
  Paper:'',
})
const onSubmit = () => {
  getList();
}


const { queryParams, form, rules,quarters,categoryList,dialogQueryParams,staffQueryParams,postQueryParams,deptQueryParams } = toRefs(data);
function getClassList() {
  listCategory({state: 0}).then(res => {
    classificationList.value = res.rows
  })
}
/** 查询岗位列表 */
function getList() {
  getTestResultList(queryParams.value).then(response => {
    resultList.value = response.rows;
  });
};
function examination(row) {
  proxy.$router.push({
    path: '/allpervasive/education/testStat/indexjl',
    query:{
      id:row.id
    }
  })
}

getList();
getClassList();
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
.app-container{
  .part2{
    margin-top: 15px;

  }
}
.ksxq-con{
  .ksxq-top{
    background: #fafafa;
    border: 1px solid #e3e3e3;
    padding: 0 10px 20px;
    .martop{
      margin-top: 10px;
    }
    .textl{
      text-align: right;
    }
    .top-right{
      font-size: 30px;
      span{
        font-size: 14px;
      }
    }
    .fenshu{
      text-align: center;
      margin-top: 50px;
      img{
        width: 140px;
      }
    }
    .fenshutop{
      img{
        width: 50px;
      }
    }

  }
.ksxq-con{
  border: 1px solid #e3e3e3;
  margin-top: 10px;
  .textr{
    text-align: right;
  }
  .ksxq-title{
    padding: 10px;
    background: #fafafa;
    border-bottom: 1px solid #e3e3e3;
  }
  .neirong{
    padding: 10px;
    .daan{
      padding: 4px 0 8px;
      sapn{
        color: #1ab394;
      }
    }
    .jiexi{

    }

  }

}
}
.daochu{
  text-align: right;
  margin-bottom: 10px;
  margin-top: -20px;
}
</style>
