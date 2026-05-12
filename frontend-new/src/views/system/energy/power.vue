<template>
  <div class="power">
    <div class="power-con">
      <el-card :body-style="{ padding: '10px' }">
        <el-row :gutter="15">
          <el-col :span="24">
            <!--区域设备导航-->
            <el-row :gutter="30">
              <el-col :span="5">
                <div class="qysb">

                  <div class="tree">
                    <h4>设备导航</h4>
                    <div class="head-container">
                      <el-input
                          v-model="deptName"
                          placeholder="请输入部门名称"
                          clearable
                          prefix-icon="Search"
                          style="margin-bottom: 10px"
                      />
                    </div>
                    </div>
                    <div class="head-container down-tree">
                      <el-tree
                          :data="data"
                          :props="{ label: 'label', children: 'children' }"
                          :expand-on-click-node="false"
                          :filter-node-method="filterNode"
                          ref="deptTreeRef"
                          default-expand-all
                          @node-click="handleNodeClick"
                      />
                  </div>
                </div>
              </el-col>
              <el-col :span="19" class="left-border">

                <div class="pad10">
                  <el-row>
                    <el-col :span="24">
                      <div class="header">
                        <div class="card-tit">电力数据</div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="freeze-con">
                    <el-col :span="24">
                      <!--          <div class="button-ico">-->
                      <!--            <el-button class="btn active" round>A相电压</el-button>-->
                      <!--            <el-button class="btn" round>B相电压</el-button>-->
                      <!--            <el-button class="btn" round>C相电压</el-button>-->
                      <!--          </div>-->
                    </el-col>
                    <el-col :span="24" class="freeze-nr">
                      <div class="fl pading10">
                        <div class="fl tit">日期</div>
                        <div class="fl">
                          <el-date-picker
                              v-model="value1"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="选择日期">
                          </el-date-picker>
                        </div>
                      </div>
                      <div class="fl pading10">
                        <div class="fl tit">数据类别</div>
                        <div class="fl">
                          <el-select v-model="value" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="fl pading10">
                        <div class="fl tit">设备名称</div>
                        <div class="fl">
                          <el-select v-model="sensorSelect" placeholder="请选择">
                            <el-option
                                v-for="item in sensorOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="fl pading10">
                        <el-button class="inquirebtn" @click="search">查询</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>

								<div class="pad10" v-if="show">
									<el-row>
										<el-radio-group v-model="tabPosition" size="small" fill="#09bec5">
											<el-radio-button label="tubiao">图表</el-radio-button>
											<el-radio-button label="biaodan">表单</el-radio-button>
										</el-radio-group>
									</el-row>
								</div>

                <div class="chart-con" id="chart" v-show="tabPosition == 'tubiao'">

                </div>
								<div class="chart-con" v-show="tabPosition == 'biaodan'">
									<el-table
											:data="allList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
											style="width: 100%;" height="95%"
											:row-style="{height: '55px'}"
											>
										<el-table-column
												prop="name"
												label="测点">
										</el-table-column>
										<el-table-column
												prop="value"
												label="值">
										</el-table-column>
										<el-table-column
												prop="date"
												label="时间">
										</el-table-column>
									</el-table>
									<el-pagination
											@size-change="handleSizeChange"
											@current-change="handleCurrentChange"
											:current-page="currentPage"
											:page-sizes="[5,10,20,40]"
											:page-size="pagesize"
											layout="total,sizes,prev,pager,next,jumper"
											:total="allList.length"

									>
									</el-pagination>
								</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>

  </div>
</template>

<script>
import {dataCategoryList, totalAreaEnergy, electricAreaId} from '@/api/system/power'
import {areatreeselect} from "@/api/energy/area";
import {ElMessageBox} from "element-plus";
import {parseTime} from "@/utils/ruoyi";
import {deptAndElectricAreaTreeSelect} from "@/api/energy/energyoverview";

export default {
  name: "power",
  data() {
    return {
      value1: '',
      options: [],
      value: '',
      sensorSelect: [],
      sensorOptions: [],
      // tree
      data: [],
      chartList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dataList: [],
      legendData: [],
      myChart: null,
      unit:'',
			tabPosition:'tubiao',
			show: false,
			allList: [],
			currentPage:1,   //默认页码为1
			pagesize:10,  //默认一页显示10条
      filterNode: (value, data) => {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      deptName:'',
    }
  },
  watch: {
    deptName:{
      handler: function(newValue, oldValue) {
        this.$refs["deptTreeRef"].filter(newValue);
      },
      deep: true, // 深度监听
    }
  },
  mounted() {
    for (let i = 0; i < 24; i++) {
      this.chartList.push(i)
    }
    //this.chart();
    this.selectInit()
    this.getTreeSelect()
  },
  methods: {
    search() {
      if (this.value1 == '') {
        ElMessageBox.alert('请先选择日期', '系统提示')
        return
      }
      this.legendData = [];
      this.dataList = [];
			this.allList = [];
			this.show = true;
			this.total = 0;
      totalAreaEnergy(this.sensorSelect, this.value, this.value1).then(res => {
        let data = res.data.list;
        this.unit = data[0].ycunit;
        for (let i = 0; i < data.length; i++) {
          this.legendData.push(data[i].ycName)
          this.dataList.push({
            name: data[i].ycName,
            type: 'line',
            showSymbol: false,
            lineStyle: {
              width: 1
            },
            data: data[i].value
          })
					for(let j = 0; j < data[i].value.length; j++){
						let date = parseTime(data[i].value[j].name)
						this.allList.push({
							name: data[i].ycName,
							value: data[i].value[j].value[1]+ (this.unit != null ? this.unit:""),
							dateValue: data[i].value[j].name,
							date: date
						})
					}
					this.allList.sort(function(a,b){
						return b.dateValue-a.dateValue;//	降序，升序则反之
					});
        }

				this.chart()
      })
    },
     /** 节点单击事件 */
    handleNodeClick(data) {
      let areaId = '';
      let deptId = '';
      if(data.type != null){
        areaId = data.id;
      }else{
        deptId = data.id;
      }
      let params = {
        areaId : areaId,
        deptId : deptId
      }
      electricAreaId(params).then(res => {
        this.sensorOptions = [];
        for (let i = 0; i < res.data.length; i++) {
          this.sensorOptions.push({
            value: res.data[i].sensorId,
            label: res.data[i].sensorName
          })
        }
      })
    },
    selectInit() {
      dataCategoryList().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.options.push({
            value: res.data[i].id,
            label: res.data[i].categoryName
          })
        }
      })
    },
    getTreeSelect() {
      deptAndElectricAreaTreeSelect({status: "0", delFlag: '0'}).then(response => {
        this.data = response.data
      });
    },
		handleSizeChange(size){   //一页显示多少条
				this.pagesize = size;
		},
		handleCurrentChange(currentPage){  //页码更改方法
				this.currentPage = currentPage;
		},
    chart() {
      // 绘制图表
      // 基于准备好的dom，初始化echarts实例
      const chartmaindom = document.getElementById('chart');
      let myChart = this.echarts.init(document.getElementById('chart'))
      myChart.clear()
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          right: '3%',
          data: this.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: function (value, index) {
              var date = new Date(value);
              var hour = date.getHours();
              var minutes = date.getMinutes();
              if (hour < 10) {
                hour = '0' + hour;
              }
              if (minutes < 10) {
                minutes = '0' + minutes;
              }
              return hour + ':' + minutes;
            },
          },
          boundaryGap: false,
          //data: this.chartList
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show:true,
            //Y轴数值可添加百分号
            formatter: '{value}'+ (this.unit != null ? this.unit:""),
          },
        },
        series: this.dataList
      });
    }
    ,
  },


}
</script>

<style lang="scss" scoped>
.fl {
  float: left;
}

.text-right {
  text-align: right;
}

.pading10 {
  padding: 10px 5px 0 0;
}

.power {
  padding: 15px;

  .header {
    padding: 0 0 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }

  .freeze-con {
    padding: 15px;

    .button-ico {
      .btn {
        border: 0;
        padding: 0 20px;
        height: 24px;
      }

      .active {
        color: #fff;
        background: #09bec5;
      }
    }
  }

  .freeze-nr {
    .tit {
      line-height: 32px;
      padding-right: 6px;
    }

    .inquirebtn {
      background: #09bec5;
      color: #fff;
      border: none;
    }
  }

  .power-con {

    .qysb {
      .qysb-head {
        margin: 10px 0;

        .title {
          color: #333333;
          font-size: 18px;
        }

        .ico {
          margin-top: 4px;
        }
      }


    }
  }

  .left-border {
    border-left: 1px solid #e7e8ed;

    .pad10 {
      padding: 10px;
    }
  }

  .chart-con {
    height: calc(100vh - 310px);

  }
}
//1366屏幕响应
@media screen and (max-width: 1366px) {
  .power {
    .freeze-con{
      padding: 15px 0;
    }
    .freeze-nr {
      .tit{
        font-size: 14px;
      }
    }
  }
}
</style>
