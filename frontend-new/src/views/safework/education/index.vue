<template>
  <div class="education">
    <!-- <el-card class="box-card">
      <div class="seachform">
        <el-form :inline="true" :model="formInline" >
          <el-form-item label="所属机构">
            <el-input v-model="formInline.number" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="适用部门">
            <el-select v-model="formInline.facility" placeholder="设备">
              <el-option label="全部" value=""></el-option>
              <el-option label="部门" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card> -->

    <div class="part2">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>课程资料</span>
            </div>
            <div class="kczl">
              <div id="kczl"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>课目分类</span>
            </div>
            <div class="kcfl">
              <div id="kcfl"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>试卷命题方式</span>
            </div>
            <div class="sjmtfl">
              <div id="sjmtfl"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>课程适用对象</span>
            </div>
            <div class="kcsydx">
              <div id="kcsydx"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>

    <el-card class="box-card time">
      <div class="seachform ">
        <el-form :inline="true" ref="form" :model="form" >
          <span class="demonstration">默认</span>
          <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
          <el-form-item class="timebtn">
            <el-button type="primary" @click="onSubmit" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <div class="part3">
      <el-row :gutter="10">
        <el-col :span="18">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>考试合格率（%）</span>
            </div>
            <div class="kshgl">
              <div id="kshgl"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>计划完成度</span>
            </div>
            <div class="jhwcd">
              <div id="jhwcd"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="part4">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-form ref="form" :inline="true" :model="form1">
                <el-form-item label="内部职员培训计划">
                  <el-input v-model="form1.planName"></el-input>
                </el-form-item>
                <el-form-item class="timebtn">
                  <el-button type="primary" @click="planSearch" class="checkbtn">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table">
              <el-table
                  :data="tableData" height="250"
                  style="width: 100%">
                <el-table-column
                    prop="planName"
                    label="培训计划名称"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="planUserNum"
                    label="计划人数"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="passNum"
                    label="通过人数"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="rate"
                    label="通过率"
                    sortable>
                </el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                  <template slot-scope="scope" class="chakn">
                    <el-button type="text"  @click="handleClick(scope.row)"  size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-form ref="form" :inline="true" :model="form2">
                <el-form-item label="内部职员自修课程">
                  <el-input v-model="form2.courseName"></el-input>
                </el-form-item>
                <el-form-item class="timebtn">
                  <el-button type="primary" @click="courseSearch" class="checkbtn">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table">
              <el-table
                  :data="tableData2" height="250"
                  style="width: 100%">
                <el-table-column
                    prop="courseName"
                    label="自修课程名称"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="testCount"
                    label="参与人数"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="passNum"
                    label="通过人次"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="rate"
                    label="通过率"
                    sortable>
                </el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                  <template slot-scope="scope" class="chakn">
                    <el-button type="text"  @click="handleClick(scope.row)"  size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- <div class="part4">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-form ref="form" :inline="true" :model="form3">
                <el-form-item label="承包商">
                  <el-input v-model="form3.name"></el-input>
                </el-form-item>
                <el-form-item class="timebtn">
                  <el-button type="primary" @click="onSubmit" class="checkbtn">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table">
              <el-table
                  :data="tableData3" height="250"
                  style="width: 100%">
                <el-table-column
                    prop="name"
                    label="培训计划名称"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="jhnumber"
                    label="计划人数"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="tgnumber"
                    label="通过人数"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="rate"
                    label="通过率"
                    sortable>
                </el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                  <template slot-scope="scope" class="chakn">
                    <el-button type="text"  @click="handleClick(scope.row)"  size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-form ref="form" :inline="true" :model="form4">
                <el-form-item label="访客课程">
                  <el-input v-model="form4.name"></el-input>
                </el-form-item>
                <el-form-item class="timebtn">
                  <el-button type="primary" @click="onSubmit" class="checkbtn">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table">
              <el-table
                  :data="tableData4" height="250"
                  style="width: 100%">
                <el-table-column
                    prop="name"
                    label="培训计划名称"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="jhnumber"
                    label="计划人数"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="tgnumber"
                    label="通过人数"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="rate"
                    label="通过率"
                    sortable>
                </el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                  <template slot-scope="scope" class="chakn">
                    <el-button type="text"  @click="handleClick(scope.row)"  size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div> -->

  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {getCourseCountByCategory,getQuestionCountByCategory,getTestCountByMethod,getCourseCountByTarget,getPlanCountByState,getPlanTestPassRate,getPlanTestPassList,getSSCourseCount} from "@/api/safework/onlinePlan";

export default {
  name: "index",
  data() {
    return {
      formInline: {
        number: '',
        facility: '',
      },
      form1: {
        planName: '',
      },
      form2: {
        courseName: '',
      },
      form3: {
        name: '',
      },
      form4: {
        name: '',
      },
      value1: '',
      piedata: [],
      kczldata:[],
      kcfldata:[],
      sjmtfldata:[],
      jhwcddata:[],

      tableData: [],
      tableData2: [],
      totalCourseNum:0,
      totalQuestionNum:0,
      methodNum:0,
      courseNum:0,
      totalPlanNum:0,
      planNameData:[],
      planTestData:[],
    }
  },

  mounted: function () {

    // setTimeout(() => {
    //   this.kcsydxChart();
    //   this.kcflChart();
    //   this.kczlChart();
    //   this.sjmtflChart();
      // this.kshglChart();
    //   this.jhwcdChart();

    // }, 600)
  },
  created(){
    this.getCourseCountByCategory();
    this.getQuestionCountByCategory();
    this.getTestCountByMethod();
    this.getCourseCountByTarget();
    this.getPlanCountByState();
    this.getPlanTestPassRate();
    this.getPlanTestPassList();
    this.getSSCourseCount();
  },
  methods: {
    planSearch(){
      this.getPlanTestPassList();
    },
    courseSearch(){
      this.getSSCourseCount();
    },
    getSSCourseCount(){
      getSSCourseCount(this.form2).then(response =>{
       this.tableData2 = response.rows
      })
    },
    getPlanTestPassList(){
      getPlanTestPassList(this.form1).then(response =>{
       this.tableData = response.rows
      })
    },
    getPlanTestPassRate(){
      getPlanTestPassRate().then(response =>{
        response.rows.forEach(element => {
          this.planNameData.push(element.planName);
          this.planTestData.push(element.rate);
          this.kshglChart();
        });
      })
    },
    getPlanCountByState(){
      getPlanCountByState().then(response =>{
        this.jhwcddata = [];
        var pass = { value: response.pass, name: '已完成' };
        var fail = { value: response.fail, name: '未完成' };
        this.jhwcddata.push(pass)
        this.jhwcddata.push(fail)
        this.totalPlanNum = response.total  
        this.jhwcdChart();
      })
    },
    getCourseCountByTarget(){
      getCourseCountByTarget().then(response =>{
        this.piedata = [];
        response.rows.forEach(element => {
          var course = { value: element.targetNum, name: element.name };
          this.piedata.push(course)
        });
        this.courseNum = response.rows[0].total  
        this.kcsydxChart();
      })
    },
    getTestCountByMethod(){
      getTestCountByMethod().then(response =>{
        this.sjmtfldata = [];
        response.rows.forEach(element => {
          var course = { value: element.typeNum, name: element.name };
          this.sjmtfldata.push(course)
        });
        this.methodNum = response.rows[0].total  
        this.sjmtflChart();
      })
    },
    getQuestionCountByCategory(){
      getQuestionCountByCategory().then(response =>{
        this.kcfldata = [];
        response.rows.forEach(element => {
          var course = { value: element.categoryNum, name: element.categoryName };
          this.kcfldata.push(course)
        });
        this.totalQuestionNum = response.rows[0].total  
        this.kcflChart();
      })
    },
    getCourseCountByCategory(){
      getCourseCountByCategory().then(response =>{
        this.kczldata = [];
        response.rows.forEach(element => {
          var course = { value: element.categoryNum, name: element.categoryName };
          this.kczldata.push(course)
        });
        this.totalCourseNum = response.rows[0].total  
        this.kczlChart();
      })
    },
    kcsydxChart() {
      let chartDom = document.getElementById('kcsydx');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "25%",
          right: "0%",
          left: "auto",
          textStyle: {
            color: "#333"
          },
          icon: "circle",
          itemWidth: 8,

        },
        title: {
          text: this.courseNum,
          subtext: "课程总数",
          left: "center",
          top: "center",
          itemGap: 0,
          textStyle: {
            fontSize: 26,
            color: '#333'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#999'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: this.piedata
          }
        ]
      };
      option && myChart.setOption(option);
    },

    kcflChart() {
      let chartDom = document.getElementById('kcfl');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },

        title: {
          text: this.totalQuestionNum,
          subtext: "题目分类",
          left: "center",
          top: "center",
          itemGap: 0,
          textStyle: {
            fontSize: 26,
            color: '#333'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#999'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: this.kcfldata
          }
        ]
      };
      option && myChart.setOption(option);
    },

    kczlChart() {
      let chartDom = document.getElementById('kczl');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },

        title: {
          text: this.totalCourseNum,
          subtext: "课程总数",
          left: "center",
          top: "center",
          itemGap: 0,
          textStyle: {
            fontSize: 26,
            color: '#333'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#999'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: this.kczldata
          }
        ]
      };
      option && myChart.setOption(option);
    },

    sjmtflChart() {
      let chartDom = document.getElementById('sjmtfl');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "30%",
          right: "0%",
          left: "auto",
          textStyle: {
            color: "#333"
          },
          icon: "circle",
          itemWidth: 8,

        },
        title: {
          text: this.methodNum,
          subtext: "试卷总数",
          left: "center",
          top: "center",
          itemGap: 0,
          textStyle: {
            fontSize: 26,
            color: '#333'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#999'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: this.sjmtfldata
          }
        ]
      };
      option && myChart.setOption(option);
    },


// 考试合格率
    kshglChart() {
      let chartDom = document.getElementById('kshgl');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
         tooltip: {
          trigger: 'item',
          formatter: "{b} : 已完成 ({c}%)"
        },
        xAxis: {
          type: 'category',
          data: this.planNameData
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          right: "2%",
          left: "3%",
          top:"10%",
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 90,
            handleSize: 8,
            handleStyle: {
              color: '#ddd'
            }
          }
        ],
        series: [
          {
            data: this.planTestData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
    // 计划完成度
    jhwcdChart() {
      let chartDom = document.getElementById('jhwcd');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "30%",
          right: "0%",
          left: "auto",
          textStyle: {
            color: "#333"
          },
          icon: "circle",
          itemWidth: 8,

        },

        title: {
          text: this.totalPlanNum,
          subtext: "发布计划总数",
          left: "center",
          top: "center",
          itemGap: 0,
          textStyle: {
            fontSize: 26,
            color: '#333'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#999'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: this.jhwcddata
          }
        ]
      };
      option && myChart.setOption(option);
    },


    onSubmit() {

    },
    handleClick(row) {
      console.log(row);
    }

  }

}
</script>

<style scoped lang="scss">

.education{
  height: 100%;
  overflow: auto;
  padding: 10px;
  background: #f3f3f3;
  .checkbtn{
    background: #09bec5;padding: 0 25px;border: 0;color: #fff;
  }
  .seachform{
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .part2{
    margin-top: 10px;
    .clearfix{
      border-bottom: 1px solid #e3e3e3;
      padding: 0 10px 10px 0;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .kcsydx{
      height: 180px;
      #kcsydx{
        height: 100%;
        width: 100%;
        margin-left: -20%;
      }
    }
    .kcfl{
      height: 180px;
      #kcfl{
        height: 100%;
        width: 100%;
      }
    }
    .kczl{
      height: 180px;
      #kczl{
        height: 100%;
        width: 100%;
      }
    }
    .sjmtfl{
      height: 180px;
      #sjmtfl{
        height: 100%;
        width: 100%;
        margin-left: -20%;
      }
    }


  }
  .time{
    margin-top: 10px;
    .demonstration{
      flex: 0 0 auto;
      text-align: right;
      font-size: var(--el-form-label-font-size);
      color: var(--el-text-color-regular);
      line-height: 32px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
      font-weight: bold;
    }
    .timebtn{
      margin-left: 10px;
      margin-top: -3px;
    }
  }

  .part3{
    margin-top: 20px;
    .clearfix{
      border-bottom: 1px solid #e3e3e3;
      padding: 0 10px 10px 0;
    }
    .kshgl{
      height: 180px;
      #kshgl{
        height: 100%;
        width: 100%;

      }
    }
    .jhwcd{
      height: 180px;
      #jhwcd{
        height: 100%;
        width: 100%;
        margin-left: -20%;
      }
    }
  }
  .part4 {
    margin-top: 20px;

    .clearfix {
      border-bottom: 1px solid #e3e3e3;
      padding: 0 10px 10px 0;
    }
    .table{
      .chakn{
        display: block;
      }
    }
    .el-form-item{
      margin-bottom: 0;
    }
  }

}
</style>
