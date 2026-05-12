<template>
  <!--设备数据-->
  <div class="device">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="15">
        <el-col :span="24">
          <!--区域设备导航-->
          <el-row :gutter="30">
            <el-col :span="4">
              <div class="qysb">
                <div class="tree">
                    <h4>区域设备导航</h4>
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
                      <el-col :span="8"> <div @click="change(0)" class="state-li"><i :class="{active:isActive == 0}"> </i>离线设备：<span class="redcolor">{{ allEqNum - onlineNum }}</span></div></el-col>
                    </el-row>
                  </div>
								</div>
                <el-row :gutter="12" style="height: calc(100vh - 270px);overflow-y: auto">
                  <el-col :xl="6" :lg="8" class="gl" v-for="item in ammeterList">
                    <el-card :body-style="{ padding: '6px 15px 10px' }" @click.native = "handleSensor(item)" v-hasPermi="['energy:sensorData:list']">
                      <div class="li-title">
												<el-row>
													<el-col :span="10">
                            <i v-if="item.sensorCurr == 1" ><img src="@/assets/images/name-icoz.png"></i>
                            <i v-else><img src="@/assets/images/name-icol.png"></i>
													</el-col>
													<el-col :span="14">
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
<!--&lt;!&ndash;													<el-col :span="4">&ndash;&gt;-->
<!--															&lt;!&ndash; <el-popover placement="bottom" :width="200" trigger="click">-->
<!--																<template #reference>-->
<!--																	<el-icon><Operation /></el-icon>-->
<!--																</template>-->
<!--																<el-table :data="gridData">-->
<!--																	筛选项...-->
<!--																</el-table>-->
<!--															</el-popover> &ndash;&gt;-->
<!--&lt;!&ndash;													</el-col>&ndash;&gt;-->
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
												<div class="dataitem  zaixian" v-for="yc in item.equipmentYcList">
													<el-row v-if="yc.ifshow == '是'">
														<el-col :span="12"><span>{{yc.ycName}}</span></el-col>
														<el-col :span="12"><span class="rt">{{yc.ycValue}}&nbsp;{{yc.ycUnit}}</span></el-col>
													</el-row>
												</div>
                        <div class="dataitem" v-for="yx in item.equipmentYxList">
                          <el-row v-if="yx.ifshow == '是'">
                            <el-col :span="12"><span>{{yx.yxName}}</span></el-col>
                            <el-col :span="12"><span class="rt">{{yx.yxCurr}}</span></el-col>
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


<!--							<el-table v-loading="loading" :data="ammeterList" >-->
<!--								<el-table-column label="序号" align="center" prop="id" />-->
<!--								<el-table-column label="电力区域" align="center" prop="areaName" />-->
<!--								<el-table-column label="传感器id" align="center" prop="sensorId" />-->
<!--								<el-table-column label="传感器名称" align="center" prop="sensorName" />-->
<!--								<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">-->
<!--								<template #default="scope">-->
<!--									<el-button-->
<!--									type="text"-->
<!--									icon="zoom-in"-->
<!--									@click="handleSensor(scope.row)"-->
<!--									v-hasPermi="['energy:sensorData:list']"-->
<!--									>数据概览</el-button>-->
<!--								</template>-->
<!--								</el-table-column>-->
<!--							</el-table>-->



						</el-col>
					</el-row>
        </el-col>
      </el-row>



    </el-card>

		<el-dialog class="lborder" v-model="open" width="1200px">
			<!--设备数据概览-->
			<div class="device-con">
				<el-row class="head-tit">
					<el-col :span="12">
						<div class="">
							<span class="card-tit">设备数据概览</span>
							<span class="ico">{{title}}</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="text-right">
							<span class="datetime">{{datetime}}</span>
						</div>
					</el-col>
				</el-row>
				<div class="shebeixq-tit">
					<h4>设备详情</h4>
					<span></span>
				</div>
				<div class="details">
					<el-row :gutter="12">
						<el-col :span="6" class="gl">
							<el-card :body-style="{ padding: '10px 10px 20px' }">
								<el-row>
									<el-col :span="24">
										<div class="li-title">
											<img src="@/assets/images/gonglv.png">
											<span>功率</span>
										 </div>
									</el-col>
								</el-row>
<!--								<el-row class="li-title-small">-->
<!--									<el-col :span="12"><div class="">额定功率&nbsp;<span v-if="sensorData.powerUnit != null">({{sensorData.powerUnit}})</span></div></el-col>-->
<!--									<el-col :span="12"><div class="text-right">10.0</div></el-col>-->
<!--								</el-row>-->

								<div class="li-con">
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">总有功功率</div></el-col>
										<el-col :span="12"><div class="text-right number">{{sensorData.activePower}}{{sensorData.powerUnit}}</div></el-col>
									</el-row>
                  <el-row class="li-con-nr">
                    <el-col :span="12"><div class="tit">A相有功功率</div></el-col>
                    <el-col :span="12"><div class="text-right number">{{sensorData.activePowerA}}{{sensorData.powerUnit}}</div></el-col>
                  </el-row>
                  <el-row class="li-con-nr">
                    <el-col :span="12"><div class="tit">B相有功功率</div></el-col>
                    <el-col :span="12"><div class="text-right number">{{sensorData.activePowerB}}{{sensorData.powerUnit}}</div></el-col>
                  </el-row>
                  <el-row class="li-con-nr">
                    <el-col :span="12"><div class="tit">C相有功功率</div></el-col>
                    <el-col :span="12"><div class="text-right number">{{sensorData.activePowerC}}{{sensorData.powerUnit}}</div></el-col>
                  </el-row>
<!--									<el-row class="li-con-nr">-->
<!--										<el-col :span="12"><div class="tit">无功功率</div></el-col>-->
<!--										<el-col :span="12"><div class="text-right number">{{sensorData.reactivePower}}</div></el-col>-->
<!--									</el-row>-->
<!--									<el-row class="li-con-nr">-->
<!--										<el-col :span="12"><div class="tit">有功功率/额定功率</div></el-col>-->
<!--										<el-col :span="12"><div class="text-right number">{{sensorData.activePowerRate}}</div></el-col>-->
<!--									</el-row>-->
								</div>
								<div class="wyc" v-if="!sensorData.powerYuex">
									<img src="@/assets/images/weiiyc.png">
									<span>未发现异常</span>
								</div>
								<div class="yc" v-if="sensorData.powerYuex">
									<img src="@/assets/images/yicang.png">
									<span>发现异常</span>
								</div>
							</el-card>
						</el-col>

						<el-col :span="6">
							<el-card :body-style="{ padding: '10px 10px 20px' }">
								<el-row>
									<el-col :span="24">
										<div class="li-title">
											<img src="@/assets/images/dianliu.png">
											<span>电流</span>
										</div>
									</el-col>
								</el-row>
<!--								<el-row class="li-title-small">-->
<!--									<el-col :span="12"><div class="">额定电流&nbsp;<span v-if="sensorData.currentUnit != null">({{sensorData.currentUnit}})</span></div></el-col>-->
<!--									<el-col :span="12"><div class="text-right">30</div></el-col>-->
<!--								</el-row>-->

								<div class="li-con">
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">A相电流</div></el-col>
										<el-col :span="12"><div class="text-right number dianliu">{{sensorData.currentA}}{{sensorData.currentUnit}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">B相电流</div></el-col>
										<el-col :span="12"><div class="text-right number dianliu">{{sensorData.currentB}}{{sensorData.currentUnit}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">C相电流</div></el-col>
										<el-col :span="12"><div class="text-right number dianliu">{{sensorData.currentC}}{{sensorData.currentUnit}}</div></el-col>
									</el-row>
								</div>
								<div class="wyc" v-if="!sensorData.currentYuex">
									<img src="@/assets/images/weiiyc.png">
									<span>未发现异常</span>
								</div>
								<div class="yc" v-if="sensorData.currentYuex">
									<img src="@/assets/images/yicang.png">
									<span>发现异常</span>
								</div>
							</el-card>
						</el-col>

						<el-col :span="6" >
							<el-card :body-style="{ padding: '10px 10px 20px' }">
								<el-row>
									<el-col :span="24">
										<div class="li-title">
											<img src="@/assets/images/dianya.png">
											<span>电压</span>
										</div>
									</el-col>
								</el-row>
<!--								<el-row class="li-title-small">-->
<!--									<el-col :span="12"><div class="">额定电压&nbsp;<span v-if="sensorData.voltageUnit != null">({{sensorData.voltageUnit}})</span></div></el-col>-->
<!--									<el-col :span="12"><div class="text-right">250</div></el-col>-->
<!--								</el-row>-->

								<div class="li-con">
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">A相电压</div></el-col>
										<el-col :span="12"><div class="text-right number dainya">{{sensorData.voltageA}}{{sensorData.voltageUnit}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">B相电压</div></el-col>
										<el-col :span="12"><div class="text-right number dainya">{{sensorData.voltageB}}{{sensorData.voltageUnit}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">C相电压</div></el-col>
										<el-col :span="12"><div class="text-right number dainya">{{sensorData.voltageC}}{{sensorData.voltageUnit}}</div></el-col>
									</el-row>
								</div>
								<div class="wyc" v-if="!sensorData.voltageYuex">
									<img src="@/assets/images/weiiyc.png">
									<span>未发现异常</span>
								</div>
								<div class="yc" v-if="sensorData.voltageYuex">
									<img src="@/assets/images/yicang.png">
									<span>发现异常</span>
								</div>
							</el-card>
						</el-col>

						<el-col :span="6" >
							<el-card :body-style="{ padding: '10px 10px 20px' }">
								<el-row>
									<el-col :span="24">
										<div class="li-title">
											<img src="@/assets/images/gonglv-04.png">
											<span>功率因数</span>
										</div>
									</el-col>
								</el-row>
<!--								<el-row class="li-title-small">-->
<!--									<el-col :span="12"><div class="">参见功率因数</div></el-col>-->
<!--									<el-col :span="12"><div class="text-right">250</div></el-col>-->
<!--								</el-row>-->

								<div class="li-con">
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">总功率因数</div></el-col>
										<el-col :span="12"><div class="text-right number gonglv">{{sensorData.powerFactorAll}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">A相功率因数</div></el-col>
										<el-col :span="12"><div class="text-right number gonglv">{{sensorData.powerFactorA}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">B相功率因数</div></el-col>
										<el-col :span="12"><div class="text-right number gonglv">{{sensorData.powerFactorB}}</div></el-col>
									</el-row>
									<el-row class="li-con-nr">
										<el-col :span="12"><div class="tit">C相功率因数</div></el-col>
										<el-col :span="12"><div class="text-right number gonglv">{{sensorData.powerFactorC}}</div></el-col>
									</el-row>
								</div>
								<div class="wyc" v-if="!sensorData.powerFactorYuex">
									<img src="@/assets/images/weiiyc.png">
									<span>未发现异常</span>
								</div>
								<div class="yc" v-if="sensorData.powerFactorYuex">
									<img src="@/assets/images/yicang.png">
									<span>发现异常</span>
								</div>
							</el-card>
						</el-col>

					</el-row>
				</div>

			</div>

			<div class="device-li">
				<el-row :gutter="12">
					<!-- 实时数据-->
					<el-col :span="12">
						<el-card :body-style="{ padding: '10px' }">
							<div class="title">
								<span class="card-tit">实时数据</span>
						</div>
							<div class="greyline"></div>
							<div class="shuju">
								<el-table
										:data="sensorData.realList"
										style="width: 100%;" height="200px">
									<el-table-column
											prop="time"
											label="变化时间">
									</el-table-column>
									<el-table-column
											prop="name"
											label="测点名称">
									</el-table-column>
									<el-table-column
											prop="value"
											label="测点值">
									</el-table-column>
								</el-table>
							</div>

						</el-card>
					</el-col>
					<!-- 设备告警-->
					<el-col :span="12">
						<el-card :body-style="{ padding: '10px' }">
							<div class="title">
								<span class="card-tit">设备告警</span>
							</div>
							<div class="greyline"></div>
							<div class="shuju">
								<el-table
										:data="sensorData.equipmentAlertList"
										style="width: 100%" height="200px">
									<el-table-column
											prop="alertDate"
											label="告警时间">
									</el-table-column>
									<el-table-column
											prop="alertName"
											label="事件">
									</el-table-column>
									<el-table-column
											prop="alertStatus"
											label="状态">
									</el-table-column>
								</el-table>
							</div>

						</el-card>
					</el-col>
				</el-row>
			</div>

		</el-dialog>

  </div>
</template>

<script>
import { areatreeselect } from "@/api/energy/area";
import { listRealAmmeter, getAmmeter, delAmmeter, addAmmeter, updateAmmeter } from "@/api/energy/ammeter";
import { getSensorData } from "@/api/energy/sensorData";
import {getUserProfile} from "@/api/system/user";
import { onLine } from "@/api/energy/energyoverview";
import {deptAndElectricAreaTreeSelect} from "@/api/energy/energyoverview";

export default {
  name: "index",
  data() {
    return {
			queryParams: {
				pageNum: 1,
				pageSize: 12,
				electricAreaId: null,
        sensorCurr:null,
        deptId:null
			},
      datetime: '',
      time: '',
      monthstart: '',
      monthday: '',
			loading: true,
			total: 0,
			ammeterList: [],
      // tree
      deptOptions: [],
			open: false,
			title: '',
			sensorData: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
			user:{
				dept:{}
			},
			sbtype: '类型1',
			sboptions: [
			  {
			    value: '类型1',
			    label: '类型1',
			  },
			  {
			    value: '类型2',
			    label: '类型2',
			  },
			],
      allEqNum:'',
      onlineNum:'',
      isActive: null,
      lister:'',
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
  methods: {
    change(a) {
      this.isActive = a;
      this.queryParams.sensorCurr = a;
      this.queryParams.pageNum = 1;
      this.getList()
      this.getOnline()
    },
		getUser() {
		  getUserProfile().then(response => {
		    this.user = response.data;
		  });
		},
    handleNodeClick(data) {
      this.queryParams.electricAreaId = null;
      this.queryParams.deptId = null;
      if(data.type != null){
        this.queryParams.electricAreaId = data.id;
      }else{
        this.queryParams.deptId = data.id;
      }

      this.getList();
      this.getOnline()
    },
		getList() {
		  this.loading = true;
		  listRealAmmeter(this.queryParams).then(response => {
		    this.ammeterList = response.rows;
		    this.total = response.total;
		    this.loading = false;
		  });
		},
		/** 查询区域下拉树结构 */
		getTreeSelect() {
			deptAndElectricAreaTreeSelect({status:"0",delFlag:'0'}).then(response => {
				this.deptOptions = response.data;
			});
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
		/** 数据概览按钮操作 */
		handleSensor(row){
			getSensorData(row.id).then(response => {
				if(response.code == 200){
					let realList = [];
					if(response.data.equipmentYcList.length > 0){
						for(let yc of response.data.equipmentYcList){
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
					response.data.realList = realList;
					this.sensorData = response.data;
					if(response.data != null && response.data.equipmentCurr != null){
						if(response.data.equipmentCurr == 1){
							this.title = "在线";
						}else{
							this.title = "离线";
						}
					}
				}
				this.open = true;
			});
		}
  },
  mounted() {
    //获取当前日期、时间、周几
    //当前年月日时分秒
    let yy = new Date().getFullYear();
    let mm = (new Date().getMonth()+1)<10 ? '0'+(new Date().getMonth()+1) : new Date().getMonth()+1;
    let dd = new Date().getDate()<10 ? '0'+new Date().getDate() : new Date().getDate();
    let hh = new Date().getHours();
    let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
    var gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
    //当前星期
    let wk = new Date().getDay();
    let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let week = weeks[wk];
    this.datetime = gettime + ' ' + week;   //年-月-日 时间 星期
    this.time = hh + ':' + mf;  						//时:分
    this.monthstart = mm + '-01';						//每个月1号
    this.monthday = mm + '-' + dd;					//今天，月-日

		this.getUser();
		this.getTreeSelect();
		this.getOnline();
		this.getList();


    // this.lister = setInterval(() => {
    //   this.getOnline();
    //   this.getList();
    // },30000)
  },
  destroyed() {
    clearInterval(this.lister);
  },
}

</script>

<style lang="scss" scoped>

.device{
  padding: 15px;
  .fl{
    float: left;
  }
  .text-right{
    text-align: right;
  }
  .pading10{
    padding-left: 10px;
  }
  .greyline{
    width: 100%;
    border-top: 1px solid #f0f0f0;
  }
  .lborder{
    border-left: 1px solid #f0f0f0;
  }
  .card-tit{
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }

  .qysb{
    .qysb-head{
      .title{
        color: #333333;
        font-size: 18px;
      }
      .ico{
        margin-top: 4px;
      }
    }
    .tree{
      h4{
        margin: 20px 0 10px;
        color: #09bec5;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #e7e8ed;
        padding: 0 0 15px;
      }

    }

  }
  .head-tit{
    .ico{
      background: #09bec5;
      color: #fff;
      font-size: 12px;
      padding: 2px 12px;
      border-radius: 50px;
      margin-left: 10px;
    }
    .datetime{
      font-size: 14px;
      color: #5c5c5c;
    }

  }

  .device-con{

    .shebeixq-tit{
      position: relative;
      margin-bottom: 10px;
      span
      {
        position: absolute;
        left: 16px;
        bottom: 0;
        width: 65px;
        height: 2px;
        background: #09bec5;
      }
      h4{
        font-size: 16px;
        color: #09bec5;
        border-bottom: 1px solid #f0f0f0;
        margin: 0;
        padding: 15px 16px 6px;
      }
    }

    .details{

      .li-title{
        border-bottom: 1px solid #e7e8ed;
        img{
          vertical-align: middle;
          margin-right: 10px;
          padding: 10px 0;
        }
        span{
          font-size: 16px;
        }
      }
      .li-title-small{
        color: #5c5c5c;
        font-size: 14px;
        border-bottom: 1px solid #e7e8ed;
        padding-bottom: 10px;
        margin-top: 10px;
      }
      .li-con{
        padding: 10px 0 10px;
        height: 210px;
        .li-con-nr{
          line-height: 36px;
          padding: 5px 0;
          .tit{
            font-size: 14px;
            color: #5c5c5c;
          }
          .number{
            font-size: 30px;
            color: #ffc100;
            white-space: nowrap;
            font-weight: bold;
            transform: scale(0.8, 1);
            float: right;
          }
        }
      }
      .wyc{
        border: 1px solid #09bec5;
        text-align: center;
        width: 80%;
        margin: 0 auto;
        border-radius: 50px;
        color: #09bec5;
        img{
          vertical-align: middle;
          margin-right: 10px;
          padding: 5px 0;
        }
        span{
          font-size: 15px;
        }
      }
      .yc{
        text-align: center;
        width: 80%;
        margin: 0 auto;
        border-radius: 50px;
        color: #ffffff;
        background: #f39800;
        img{
          vertical-align: middle;
          margin-right: 10px;
          padding: 5px 0;
        }
        span{
          font-size: 15px;
        }
      }

    .dianliu{
      color:#f39800!important ;
    }
     .dainya {
        color:#78cc4f!important;
      }
      .gonglv{
        color:#4f90cc!important;
      }



    }


  }

  .device-li{
    margin-top: 10px;
    .title{
      padding: 6px 0 10px;
    }
    .shuju{
      margin-top: 10px;
      margin-bottom: 20px;
      :deep(.el-table__inner-wrapper::before) {
        background-color:transparent;
      }
      :deep(.el-table__cell) {
        border-bottom: none;
      }
      :deep(.el-table__header-wrapper) {
        th {
          background-color: transparent !important;
          border-bottom: var(--el-table-border);
         font-weight: normal;
        }
      }
      :deep(.el-table) {
        .cell{
          text-align: center;
        }
      }

    }
  }
  .sbgl-com{
		:deep(.el-row) {
			align-content: start;
		}
    .sbgl-top{
      position: relative;text-align: center;
      padding: 5px 0 10px;margin-bottom: 10px;
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
        font-size: 16px;
        color: #5c5c5c;
        width: 60%;
        margin: 0 auto;
        span{color: #09bec5;
          font-size: 20px;}
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
			background: #f9ffff;border-radius:5px;
			height: 90px;padding: 10px;margin: 10px 0 0;
			line-height: 1.5;
      overflow-y: auto;
      border: 1px solid #f0f9f9;
			//overflow-y: hidden;//自动显示滚动条auto
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
				span.rt{text-align: right;font-weight: bold;
          color: #919191;}
			}
		}
    .gl{
      margin-bottom: 10px;
			:deep(.el-card) {cursor: pointer;}
    }
    .li-title{
      padding: 7px 0;
      text-align: right;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 10px;
      //height: 71px;
			img{float: left;}
			h4{font-size: 14px;margin: 5px 0 10px;color: #666}
      .name{
        font-size: 16px;
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

}
</style>
