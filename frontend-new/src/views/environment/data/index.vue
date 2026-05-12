<template>
  <!--设备数据-->
  <div class="paramenter">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="15">
        <el-col :span="24">
          <!--区域设备导航-->
          <el-row :gutter="30">
            <el-col :span="4">
              <div class="qysb">

                <div class="head-container tree">
                  <h4>导航</h4>
                  <el-input
                      v-model="deptName"
                      placeholder="请输入区域名称"
                      clearable
                      prefix-icon="Search"
                      style="margin-bottom: 20px"
                  />
                </div>
                <div class="head-container tree down-tree">
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

              </div>
            </el-col>

            <el-col :span="20" style="border-left: 1px solid rgb(231, 232, 237);">

              <div class="sbgl-com" style="min-height: calc(100vh - 220px);">
								<div class="sbgl-top">
									<!-- <el-select v-model="sbtype" suffix-icon="CaretTop">
										<el-option
											v-for="item in sboptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select> -->
									<div class="state">
                    <el-row>
                      <el-col :span="8"><div @click="change(null)" class="state-li"><i :class="{active:isActive == null}"></i>全部设备：<span>{{allEqNum}}</span></div></el-col>
                      <el-col :span="8"> <div @click="change(1)" class="state-li"><i :class="{active:isActive == 1}"></i>在线设备：<span class="green">{{onlineNum}}</span></div></el-col>
                      <el-col :span="8"> <div @click="change(0)" class="state-li"><i :class="{active:isActive == 0}"></i>离线设备：<span class="redcolor">{{ allEqNum - onlineNum }}</span></div></el-col>
                    </el-row>
<!--										<span @click="change(null)"><i></i>全部：{{allEqNum}}</span>-->
<!--										<span @click="change(1)"><i class="green"></i>在线：{{onlineNum}}</span>-->
<!--										<span @click="change(0)"><i class="red"></i>离线：{{ allEqNum - onlineNum }}</span>-->
									</div>
								</div>
                <el-row :gutter="12">
                  <el-col :lg="8" :xl="6" class="gl" v-for="item in environmentAreaSensorList">
                    <el-card :body-style="{ padding: '10px 15px 20px' }" @click.native="handleSensor(item)" v-hasPermi="['environment:environmentSensorData:list']">
                      <div class="li-title">
                      <el-row>
													<el-col :span="10">
                            <i v-if="item.sensorCurr == 1" ><img src="@/assets/images/name-icoz.png"></i>
                            <i v-else><img src="@/assets/images/name-icol.png"></i>
													</el-col>
													<el-col :span="14">
<!--															<h4>设备名称</h4>-->
															<div class="name">{{ item.sensorName }}</div>
                            <div class="li-subtit"><i v-if="item.sensorCurr == 1" class="i green">在线</i>
                              <i v-else class="i red">离线</i></div>
													</el-col>
												</el-row>
											</div>
<!--											<div class="li-subtit">-->
<!--												<el-row>-->
<!--													<el-col :span="20">-->
<!--															<span class="h4">设备详情</span>-->
<!--															<i v-if="item.sensorCurr == 1" class="i green">在线</i>-->
<!--															<i v-else class="i red">离线</i>-->
<!--													</el-col>-->
<!--													<el-col :span="4">-->
<!--															&lt;!&ndash; <el-popover placement="bottom" :width="200" trigger="click">-->
<!--																<template #reference>-->
<!--																	<el-icon><Operation /></el-icon>-->
<!--																</template>-->
<!--																<el-table :data="gridData">-->
<!--																	筛选项...-->
<!--																</el-table>-->
<!--															</el-popover> &ndash;&gt;-->
<!--													</el-col>-->
<!--												</el-row>-->
<!--											</div>-->
                      <div class="data-top" >
<!--                        <el-row>-->
<!--                          <el-col :span="10"><span>设备类型</span></el-col>-->
<!--                          <el-col :span="14"><span class="rt">电表</span></el-col>-->
<!--                        </el-row>-->
                        <el-row>
                          <el-col :span="10"><span>通信时间</span></el-col>
                          <el-col :span="14"><span class="rt">{{item.equipmentDt}}</span></el-col>
                        </el-row>
                      </div>
                      <div class="data" >
												<div class="dataitem zaixian" v-for="yc in item.equipmentYcList">
													<el-row v-if="yc.ifshow == '是'">
														<el-col :span="8"><span>{{yc.ycName}}</span></el-col>
														<el-col :span="16"><span class="rt">{{yc.ycValue}}&nbsp;{{yc.ycUnit}}</span></el-col>
													</el-row>
												</div>
                        <div class="dataitem" v-for="yx in item.equipmentYxList">
                          <el-row v-if="yx.ifshow == '是'">
                            <el-col :span="8"><span>{{yx.yxName}}</span></el-col>
                            <el-col :span="16"><span class="rt">{{yx.yxCurr}}</span></el-col>
                          </el-row>
                        </div>
												<!-- <div class="dataitem">
													<el-row>
														<el-col :span="12"><span>设备运行</span></el-col>
														<el-col :span="12"><span class="rt">所属区域</span></el-col>
													</el-row>
												</div> -->
                      </div>
                    </el-card>
                  </el-col>

                </el-row>
              </div>

              <pagination
                  v-show="total>0"
                  :total="total"
                  v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize"
                  @pagination="getList"
              />


            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </el-card>

    <el-dialog class="lborder" v-model="open" width="1200px">
      <div class="paramenter-on">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-card :body-style="{ padding: '10px' }">
              <div class="title">
                <span class="card-tit">设备概要</span>
              </div>
              <el-row class="sbgy-ul">
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico1.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备名称：<span>{{ sensorData.sensor.equipmentName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico2.png"></el-col>
                      <el-col :span="20">
                        <div class="name">所属区域：<span>{{ sensorData.environmentAreaSensor.areaName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico3.png"></el-col>
                      <el-col :span="20">
                        <div class="name">当前状态：<span>{{ sensorData.sensor.equipmentCurr == 1 ? '在线' : '离线' }}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico4.png"></el-col>
                      <el-col :span="20">
                        <div class="name">生产厂商：<span>{{ sensorData.sensor.equipmentFactory }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico5.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备编号：<span>{{ sensorData.sensor.equipmentId }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico6.png"></el-col>
                      <el-col :span="20">
                        <div class="name">所属岗位：<span>{{ sensorData.sensor.deptName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico7.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备类型：<span>{{ sensorData.sensor.termName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico8.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备规格：<span>{{ sensorData.sensor.modalName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>

        <div class="sbmx-nr">
          <el-row :gutter="15">
            <el-col :span="24">
              <el-card :body-style="{ padding: '10px' }">
                <div class="title">
                  <span class="card-tit">设备明细</span>
                </div>
                <div class="sbmx-con">
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="实时数据" name="first">
                      <el-table
                          :data="sensorData.realList"
                          stripe
                          style="width: 100%">
                        <el-table-column
                            prop="name"
                            label="名称">
                        </el-table-column>
												<el-table-column
														prop="value"
														label="本次数据">
												</el-table-column>
                        <el-table-column
                            prop="time"
                            label="本次时间">
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="历史数据" name="second">
                      <div class="pad10">
                        <el-row class="freeze-con">
                          <el-col :span="24">
                          </el-col>
                          <el-col :span="24" class="freeze-nr">
                            <div class="fl pading10">
                              <div class="fl tit">日期</div>
                              <div class="fl">
                                <el-date-picker
                                    v-model="queryParams2.day"
                                    type="date"
                                    value-format="YYYY-MM-DD"
                                    placeholder="选择日期">
                                </el-date-picker>
                              </div>
                            </div>
                            <div class="fl pading10">
                              <div class="fl tit">测点</div>
                              <div class="fl">
                                <el-select v-model="queryParams2.historyId" placeholder="请选择" @change="changeType">
                                  <el-option
                                      v-for="item in sensorData.historyList"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
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
													<el-radio-group v-model="tabPosition" size="small" fill="#09bec5" @change="chkCharts">
														<el-radio-button label="tubiao">图表</el-radio-button>
														<el-radio-button label="biaodan">表单</el-radio-button>
													</el-radio-group>
												</el-row>
											</div>

                      <div id="chart" v-show="tabPosition == 'tubiao'" style="height: calc(100vh - 310px)">

                      </div>
											<div class="chart-con" v-show="tabPosition == 'biaodan'">
													<el-table
															:data="allList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
															style="width: 100%;" height="464px"
															:row-style="{height: '42px'}">
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
                    </el-tab-pane>
                    <!--  <el-tab-pane label="设备档案" name="third">设备档案</el-tab-pane>-->
                  </el-tabs>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {treeselect} from "@/api/environment/environmentArea";
import {getUserProfile} from "@/api/system/user";
import {listRealEnvironmentAreaSensor} from "@/api/environment/environmentAreaSensor";
import {getEnvironmentSensorData, getYcHis,getYxHis} from "@/api/environment/environmentSensorData"
import { onLine } from "@/api/environment/base";
import {parseTime} from "@/utils/ruoyi";
import { deptAndEnvironmentAreaTreeSelect } from "@/api/environment/base";

export default {
  name: "index",
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        environmentAreaId: null,
        deptId:'',
      },
      queryParams2: {
				historyId: null,
				day: null,
				type: null
      },
      environmentAreaSensorList: [],
      areaOptions: [],
      user: {
        dept: {}
      },
      loading: true,
      total: 0,
      open: false,
      title: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      sensorData: {},
      activeName: 'first',
      dataList: [],
      allEqNum:'',
      onlineNum:'',
      unit:'',
			tabPosition:'tubiao',
			show: false,
			allList: [],
			currentPage:1,   //默认页码为1
			pagesize:10,  //默认一页显示10条
      isActive: null,
      lister:'',
      areaOptions: [],
      deptOptions: [],
      deptName: '',
      filterNode: (value, data) => {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    };
  },
  mounted() {
    this.getUser();
    this.getTreeSelect();
    this.getList();
    this.getOnline();
    this.lister = setInterval(() => {
      this.getOnline();
      this.getList();
    },30000)
  },
  beforeUnmount() {
    if (this.lister) {
      clearInterval(this.lister);
      this.lister = null;
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
  destroyed() {
    clearInterval(this.lister);
  },
  methods: {
    change(a) {
      this.isActive = a;
      this.queryParams.sensorCurr = a;
      this.queryParams.pageNum = 1;
      this.getList()
      this.getOnline()
    },
    getOnline() {
      onLine(this.queryParams).then(res => {
        let data = res.data
        if (null !== data && typeof data !== 'undefined') {
          this.allEqNum = data.allEq
          this.onlineNum = data.online
        }
      })
    },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
      });
    },
    handleNodeClick(data) {
      this.queryParams.deptId = '';
      this.queryParams.environmentAreaId = '';
      if(data.type != null){
        this.queryParams.environmentAreaId = data.id;
      }else{
        this.queryParams.deptId = data.id;
      }
      this.getList();
      this.getOnline()
    },
    getList() {
      this.loading = true;
      listRealEnvironmentAreaSensor(this.queryParams).then(response => {
        this.environmentAreaSensorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询区域下拉树结构 */
    getTreeSelect() {
      deptAndEnvironmentAreaTreeSelect({status: "0", delFlag: '0'}).then(response => {
        this.deptOptions = response.data;
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /** 数据概览按钮操作 */
    handleSensor(row) {
			this.show = false;
			this.dataList = [];
			this.allList = [];
			this.unit = null;
      getEnvironmentSensorData(row.id).then(response => {
        if (response.code == 200) {
					let realList = [];
					var historyList = [];
					if(response.data.equipmentYcList.length > 0){
						for(let yc of response.data.equipmentYcList){
							historyList.push({
								id:	yc.ycNo,
								name: yc.ycName,
								type: 'yc'
							})
							if(yc.ycValue == null){
								yc.ycValue = 0
							}
							realList.push({
								name: yc.ycName,
								value: yc.ycValue + yc.ycUnit,
								time: yc.ycDt
							})
						}
					}
					if(response.data.equipmentYxList.length > 0){
						for(let yx of response.data.equipmentYxList){
							historyList.push({
								id:	yx.yxNo,
								name: yx.yxName,
								type: 'yx'
							})
							let value  = "";
							if(response.data.equipmentYxList.length > 0 && yx.yxCurr != null){
								for(let yx2 of response.data.sensor.yxs){
									if(yx.yxNo == yx2.yxNo){
										switch(yx.yxCurr){
											case 0:
												value = yx2.yxDes0;
												break;
											case 1:
												value = yx2.yxDes1;
												break;
											case 2:
												value = yx2.yxDes2;
												break;
											case 3:
												value = yx2.yxDes3;
												break;
											case 4:
												value = yx2.yxDes4;
												break;
											case 5:
												value = yx2.yxDes5;
												break;
											case 6:
												value = yx2.yxDes6;
												break;
											case 7:
												value = yx2.yxDes7;
												break;
											case 8:
												value = yx2.yxDes8;
												break;
											case 9:
												value = yx2.yxDes9;
												break;
											case 10:
												value = yx2.yxDes10;
												break;
											default:
												break;
										}
										break;
									}
								}
							}
							realList.push({
								name: yx.yxName,
								value: value,
								time: yx.yxDt
							})
						}
					}
					response.data.realList = realList;
					response.data.historyList = historyList;
					this.sensorData = response.data;
        }
        this.open = true;
				this.activeName = "first";
				this.queryParams2.day = null;
				this.queryParams2.historyId = null;
				const chartmaindom = document.getElementById('chart');
				if(chartmaindom != null){
					chartmaindom.removeAttribute('_echarts_instance_');
				}
				let myChart = this.echarts.init(document.getElementById('chart'))
				myChart.clear()
      });
    },
		changeType(val){
			for(let history of this.sensorData.historyList){
				if(history.id == val){
					this.queryParams2.type = history.type;
				}
			}
		},
    search() {
      this.dataList = [];
			this.allList = [];
			this.show = true;
			this.unit = null;
			if(this.queryParams2.type == 'yc'){
				this.searchYc();
			}else if(this.queryParams2.type == 'yx'){
				this.searchYx();
			}
    },
		searchYc(){
			getYcHis(this.queryParams2).then(response => {
				let data = response.data.ycHisData;
				this.unit = response.data.ycunit
				this.dataList.push({
					type: 'line',
					showSymbol: false,
					lineStyle: {
						width: 1
					},
					data: response.data.ycHisData
				})
				for (let i = 0; i < data.length; i++) {
						let date = parseTime(data[i].name)
						this.allList.push({
							value: data[i].value[1]+ (this.unit != null ? this.unit:""),
							dateValue: data[i].name,
							date: date
						})
				}
				this.allList.sort(function(a,b){
					return b.dateValue-a.dateValue;//	降序，升序则反之
				});
				this.chart()//这个是绘制图形的函数
			});
		},
		searchYx(){
			getYxHis(this.queryParams2).then(response => {
				let data = response.data.yxHisData;
				this.dataList.push({
					type: 'line',
					showSymbol: false,
					lineStyle: {
						width: 1
					},
					data: response.data.yxHisData
				})
				for (let i = 0; i < data.length; i++) {
						let date = parseTime(data[i].name)
						this.allList.push({
							value: this.yxState(data[i].value[1]),
							dateValue: data[i].name,
							date: date
						})
				}
				this.allList.sort(function(a,b){
					return b.dateValue-a.dateValue;//	降序，升序则反之
				});
				this.chart()//这个是绘制图形的函数
			});
		},
		chkCharts(val){
			if(val == 'tubiao'){
				this.chart()//这个是绘制图形的函数
			}
		},
		handleSizeChange(size){   //一页显示多少条
				this.pagesize = size;
		},
		handleCurrentChange(currentPage){  //页码更改方法
				this.currentPage = currentPage;
		},
    chart() {
			var that = this;
      const chartmaindom = document.getElementById('chart');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('chart'))
      myChart.clear()
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
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
            formatter: function(value, index) {
							if(that.queryParams2.type == 'yc'){
								return value + (that.unit != null ? that.unit:"");
							}else if(that.queryParams2.type == 'yx'){
								return that.yxState(value)
							}
						}
          },
        },
        series: this.dataList
      });
      // 绘制图表
    },
		yxState(value){
			for(let yx of this.sensorData.sensor.yxs){
				if(yx.yxNo == this.queryParams2.historyId){
					switch(value){
						case 0:
							return yx.yxDes0;
						case 1:
							return yx.yxDes1;
						case 2:
							return yx.yxDes2;
						case 3:
							return yx.yxDes3;
						case 4:
							return yx.yxDes4;
						case 5:
							return yx.yxDes5;
						case 6:
							return yx.yxDes6;
						case 7:
							return yx.yxDes7;
						case 8:
							return yx.yxDes8;
						case 9:
							return yx.yxDes9;
						case 10:
							return yx.yxDes10;
						default:
							break;
					}
					break;
				}
			}
		}
  },
}
</script>

<style scoped lang="scss">
.paramenter {
  padding: 15px;

  .fl {
    float: left;
  }

  .text-right {
    text-align: right;
  }

  .pading10 {
    padding-left: 10px;
  }

  .greyline {
    width: 100%;
    border-top: 1px solid #f0f0f0;
  }

  .lborder {
    border-left: 1px solid #f0f0f0;

  }

  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }

  .qysb {
    .qysb-head {
      .title {
        color: #333333;
        font-size: 18px;
      }

      .ico {
        margin-top: 4px;
      }
    }

    .tree {
      h4 {
        margin: 20px 0 10px;
        color: #09bec5;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #e7e8ed;
        padding: 0 0 15px;
      }

    }

  }

  .head-tit {
    .ico {
      background: #09bec5;
      color: #fff;
      font-size: 12px;
      padding: 2px 12px;
      border-radius: 50px;
      margin-left: 10px;
    }

    .datetime {
      font-size: 14px;
      color: #5c5c5c;
    }

  }

  .paramenter-on {
    padding: 15px;
    height: 600px;
    overflow-y:scroll ;

    .title {
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 10px;

      .card-tit {
        padding-left: 10px;
        border-left: 5px solid #09bec5;
        font-size: 18px;
      }
    }

    .sbgy-ul {
      padding: 30px 0;

      .sbgy-li {
        padding: 10px 0;

        .ico {
          text-align: center;
        }

        .name {
          font-size: 15px;
          color: #a1aab7;
          line-height: 31px;

          span {
            color: #252631;
          }
        }

      }
    }

    .sbmx-nr {
      padding-top: 15px;
    }

    .echart-con {
      height: 300px;
    }
  }


	.sbgl-com{
		.sbgl-top{
			position: relative;text-align: center;
			padding-bottom: 10px;margin-bottom: 10px;
			border-bottom: 1px solid #eee;
			:deep(.el-select) {
				width: 120px;
				.el-input__inner{
					border: 0;font-size: 16px;color: #09bec5;
				}
				.el-icon{font-size: 16px;color: #09bec5;}
				.el-select-dropdown__item.selected{color: #09bec5;}
			}
      .state{
        // position: absolute;right: 0;top: 6px;
        //text-align: right;
        font-size: 18px;
        color: #5c5c5c;
        width: 60%;
        margin: 0 auto;
        span{color: #09bec5;
          font-size: 24px;}
        i{
          width: 12px;height: 12px;border-radius: 50%;margin-right: 5px;
          display: inline-block;    border: 2px solid #dcdcdc;
        }
        i.active {border: 4px solid #09bec5;}
        .state-li{
          cursor:pointer;
          .green{
            color:#22ac38;
          }
          .redcolor{
            color: #fc3a3a;
          }
        }
      }
		}
		.li-subtit{
			.h4{
				display: inline-block;margin-right: 5px;font-size: 14px;
			}
			.i{
				font-size: 12px;border-radius: 20px;display: inline-block;
				font-style: normal;color: #fff;padding: 0 5px;
			}
			.i.green{background: #22ad38;}
			.i.red{background: #fd3b3c;}
			:deep(.el-icon) {
				float: right;color: #5c5c5c;
			}
		}
    .data-top{
      span{
        display: block;color:#555;font-size: 14px;
      }
      span.rt{text-align: right;}
    }
		.data{
			//background: #f7f7f7;border-radius:5px;overflow-y: auto;
			//height: 180px;padding: 10px;margin: 10px 0 0;
			//line-height: 2;

      background: #f9ffff;border-radius:5px;
      height: 114px;padding: 10px;margin: 10px 0 0;
      line-height: 2;
      overflow-y: auto;
      border: 1px solid #f0f9f9;
      //.zaixian:first-child{
      //  span{
      //    font-size: 16px;
      //    color: #333333;
      //  }
      //  .rt{
      //    font-size: 18px;
      //    color: #1bb0d7;
      //    font-weight: bold;
      //
      //  }
      //}
			.dataitem{
				span{
					display: block;color:#555;font-size: 14px;
				}
				span.rt{text-align: right;}
			}
		}
    .gl{
      margin-bottom: 10px;
			:deep(.el-card) {cursor: pointer;}
    }
    .li-title{
      padding: 10px 0;
      text-align: right;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 10px;
      height: 71px;
			img{float: left;}
			h4{font-size: 14px;margin: 5px 0 10px;color: #666}
      .name{
        font-size: 20px;
        margin: 6px 0 0;
      }
    }
    .li-con{
      font-size: 12px;
      color: #5c5c5c;
      .li-con-nr{
        line-height: 30px;
        padding: 0 10px;
      }

    }
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

	.pad10 {
	  padding: 10px;
	}
}
</style>
