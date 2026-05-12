<template>
  <div class="shangmeilijia">
    <div class="top">
      <div class="title">尚美丽家能源管理云平台</div>
      <img src="@/assets/images/soar/toptit.png" @load="topimageLoaded"/>
			<div class="fangda">
			  <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
			  <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
			      src="@/assets/images/suoxiao.png"></i>
			</div>
		</div>
    <div class="weather"><!--<img src="picture/weather.png"><span>多云转小雨</span>--><span id="showTime"></span></div>
    <el-row class="main" :style="{ height: maniHt}" :gutter="10">
      <el-col :span="5">
        <div class="left">
          <div class="box databox">
            <el-row class="dataitem">
              <el-col :span="8">
                <img src="@/assets/images/soar/smlj-data-ico.png"/>
              </el-col>
              <el-col :span="16">
                <div class="datart">
                  <h4>客户数量</h4>
                  <h5>{{ custNums }}</h5>
                </div>
              </el-col>
            </el-row>
						<el-row class="datadata">
						  <el-col :span="8">
						    总设备数：<i>{{ equipTotal }}</i>
						  </el-col>
						  <el-col :span="8">
						    连接数量：<i>{{ sensorAll }}</i>
						  </el-col>
							<el-col :span="8">
							  在线：<i>{{ sensorOnline }}</i>
							</el-col>
							<el-col :span="8">
							  离线：<i>{{sensorOffline }}</i>
							</el-col>
						</el-row>
						<el-row class="databot">
						  <el-col :span="12">
						    <img src="../../assets/images/soar/smlj-data-ico1.png"/>
								<div class="databot-right">
									<h5>累计节碳</h5>
									<h4>{{carbon}}<span>kg</span></h4>
								</div>
						  </el-col>
							<el-col :span="12">
							  <img src="../../assets/images/soar/smlj-data-ico2.png"/>
								<div class="databot-right">
									<h5>供暖面积</h5>
									<h4>{{ area }}<span>㎡</span></h4>
								</div>
							</el-col>
						</el-row>
            
          </div>
          <div class="box p15">
            <div class="boxtit">
              <h4>近15日故障/告警趋势</h4>
              <img src="@/assets/images/soar/box-tit.png"/>
            </div>
            <div id="ecahrt1" class="ecahrt1"></div>
          </div>
          <div class="box p15" style="margin: 0;">
            <div class="boxtit">
              <h4>近15日告警分类</h4>
              <img src="@/assets/images/soar/box-tit.png"/>
            </div>
            <div id="ecahrt2" class="ecahrt2"></div>
          </div>
        </div>

      </el-col>
      <el-col :span="14">
        <div class="map4">
					<button @click="back" class="goback">返回上一级</button>
					<button @click="mapinfo" class="goback" style="left: 100px;">右侧变更</button>
					<button @click="mapinfoclose" class="goback" style="left: 200px;">右侧关闭</button>
					<div id="map_1"></div>
				</div>
      </el-col>
      <el-col :span="5">
        <div class="right" :style="[rightdefault==true? 'display:block':'display:none']">
          <div class="box p15">
            <div class="boxtit">
              <h4>设备运行信息</h4>
              <img src="@/assets/images/soar/box-tit.png"/>
            </div>
            <el-table :data="sensorList" stripe ref="table1"
			style="width: 100%"
			height="calc(100% - 30px)"
			@mouseenter="mouseenter(this.timers1)"
			@mouseleave="mouseleave(1)"
			>
				<el-table-column prop="equipmentName" label="设备名称" />
				<el-table-column label="传感器模型" align="center" prop="modalName" width="110"/>
				<el-table-column label="状态" align="center" prop="equipmentCurr">
					<template #default="scope">
						<span v-if="scope.row.equipmentCurr == 0">离线</span>
						<span v-if="scope.row.equipmentCurr == 1">在线</span>
					</template>
				</el-table-column>
				<el-table-column label="最后通信时间" align="center" prop="equipmentCommtime" width="180">
					<template #default="scope">
					<span>{{ parseTime(scope.row.equipmentCommtime) }}</span>
					</template>
				</el-table-column>
			</el-table>
          </div>
			<div class="box p15">
				<div class="boxtit">
				<h4>最新告警</h4>
				<img src="@/assets/images/soar/box-tit.png"/>
				</div>
				<el-table
					:data="alramlist"
					stripe ref="table2"
					height="calc(100% - 30px)"
					style="width: 100%"
					@mouseenter="mouseenter(this.timers2)"
					@mouseleave="mouseleave(2)">
					<el-table-column
						prop="eqname"
						label="智能设备名称">
					</el-table-column>
					<el-table-column
						prop="pointName"
						label="测点名称">
					</el-table-column>
					<el-table-column
						prop="state"
						label="告警内容">
					</el-table-column>
					<el-table-column
						prop="dt"
						label="告警时间">
					</el-table-column>
					<el-table-column prop="handle" label="操作" width="60" align="center">
						<template #default="scope">
							<el-button class="btn" @click="warnclick(scope.row)">
								处理 <el-icon><Right /></el-icon>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="box p15">
				<div class="boxtit">
				<h4>新增设备</h4>
				<img src="@/assets/images/soar/box-tit.png"/>
				</div>
				<el-table :data="lastMonthNewlyAddedData" stripe ref="table3"
				style="width: 100%"
				height="calc(100% - 30px)"
				@mouseenter="mouseenter(this.timers3)"
				@mouseleave="mouseleave(3)"
				>
					<el-table-column prop="eqName" label="设备名称" />
					<el-table-column prop="className" label="设备分类" align="center" />
					<el-table-column prop="createTime" label="创建日期" align="center"/>
				</el-table>
			</div>
        </div>
				<div class="right" :style="[rightmap==true? 'display:block':'display:none']">
					<div class="box p15 mapbox">
					  <div class="boxtit">
					    <h4>客户信息</h4>
					    <img src="@/assets/images/soar/box-tit.png"/>
					  </div>
					  <el-table :data="childDepts" stripe ref="table4"
						style="width: 100%"
						height="calc(100% - 30px)"
						@mouseenter="mouseenter(this.timers4)"
						@mouseleave="mouseleave(4)"
						>
							<el-table-column prop="deptName" label="客户名称" />
							<el-table-column prop="delFlag" label="状态" align="center">
					  			<template #default="scope">
									<span v-if="scope.row.delFlag == 0">正常</span>
									<span v-if="scope.row.delFlag == 1">停用</span>
								</template>
							</el-table-column>
							<el-table-column prop="handle" label="操作" width="60" align="center">
								<template #default="scope">
									<el-button class="btn" @click="deptDetailBtn(scope.$index, scope.row)">
										详情 <el-icon><Warning /></el-icon>
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="box p15 mapbox">
					  <div class="boxtit">
					    <h4>设备信息</h4>
					    <img src="@/assets/images/soar/box-tit.png"/>
					  </div>
					  <el-table :data="rightEquipList" stripe ref="table5"
						style="width: 100%"
						height="calc(100% - 30px)"
						@mouseenter="mouseenter(this.timers5)"
						@mouseleave="mouseleave(5)"
						>
							<el-table-column prop="eqName" label="设备名称" />
							<el-table-column prop="eqCode" label="设备编号" align="center" />
							<el-table-column prop="className" label="所属分类" align="center" />
							<el-table-column prop="handle" label="操作" width="60" align="center">
								<template #default="scope">
									<el-button class="btn" @click="warnBtn(scope.row)">
										详情 <el-icon><Warning /></el-icon>
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				

				<el-dialog
					v-model="deptWarnDialog"
					width="50%"
					align-center=ture
				>
					<div class="dialogtit">
						<el-icon class="btn1"><WarningFilled /></el-icon>
						详情
					</div>
					<div class="diatop">
						<!-- <div class="logo"></div> -->
						<div class="name">
							<h5>客户名称</h5>
							<h3>{{ currRowDeptDetail.deptName }}</h3>
						</div>
						<div class="add">
							客户地址：{{ currRowDeptDetail.province }}{{ currRowDeptDetail.city }}{{ currRowDeptDetail.district }}
						</div>
					</div>
					<div class="info">
						<div class="item">
							邮箱 <span>{{ currRowDeptDetail.email }}</span>
						</div>
						<div class="item">
							是否服务上云 <span v-if="currRowDeptDetail.store == 1">是</span><span v-if="currRowDeptDetail.store == 0">否</span>
						</div>
					</div>
					<div class="contact">
						<h4>联系方式</h4>
						<div class="item">
							联系人 <span>{{ currRowDeptDetail.leader }}</span>
						</div>
						<div class="item">
							联系电话 <span>{{ currRowDeptDetail.phone }}</span>
						</div>
					</div>
				</el-dialog>
				<!-- 弹出框 -->
				<el-dialog
					v-model="warnDialog"
					width="50%"
					align-center=ture
				>
					<div class="dialogtit">
						<el-icon class="btn1"><WarningFilled /></el-icon>
						详情
					</div>
					<div class="diatop">
						<!-- <div class="logo"></div> -->
						<div class="name">
							<h5>设备名称</h5>
							<h3>{{rightEquipDetailData.equip.eqName}}</h3>
						</div>
						<div class="add">
							{{rightEquipDetailData.equip.deptName}}
						</div>
					</div>
					<div class="info" style="height: 191px;">
						<div class="item">
							设备类别 <span>{{ rightEquipDetailData.equip.className }}</span>
						</div>
						<div class="item" v-for="(item, index) in rightEquipDetailData.eqAttributesList" :key="index" >
							设备属性 <span>{{ item.attrName }}</span> &nbsp;&nbsp;属性值 <span>{{ item.attrValue }}</span>
						</div>
						<div class="picture">
							<h4>设备照片</h4>
							<img :src="rightEquipDetailData.equip.imgUrl"
							@click=" warnDialogPicture = true "
							/>
						</div>
					</div>
				</el-dialog>
				<el-dialog
					v-model="warnDialogPicture"
					width="70%"
					align-center=ture
					custom-class="warnpic"
				>
					<img :src="rightEquipDetailData.equip.imgUrl" />
				</el-dialog>
				
      </el-col>
    </el-row>
	<!-- 告警详情弹出 -->
	<div class="warndetail">
    <el-dialog
        v-model="warndetbox"
        title="告警处理"
        width="30%"
    >
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>智能设备名称</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ eqNameClick }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>测点名称</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ ycNameClick }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>告警内容</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ alarmContent }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-row>
          <el-col :span="6">
            <h4>告警时间</h4>
          </el-col>
          <el-col :span="18">
            <div class="info">{{ alarmDate }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="inforow">
        <el-form :model="form" label-width="120px">
          <el-row>
            <el-col :span="6">
              <h4>处理信息</h4>
            </el-col>
            <el-col :span="18">
              <el-input v-model="form.info" type="textarea"/>
            </el-col>
          </el-row>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form>
      </div>

    </el-dialog>
  </div>
  </div>
</template>

<script>
import 'echarts/extension/bmap/bmap'
import axios from 'axios'
import {parseTime} from '@/utils/ruoyi'
import * as echarts from '@/utils/echarts'
import cityMap from '@/utils/china-main-city-map.js'
import {
  listSensor,
  getSMDeptCounts,
  getSensorCountByArea,
  getEquipCountsByDeptId,
  getAlertCountsByTypeForLast15Days,
  getAlertDataByTypeForLast15Days
} from "@/api/sensor/sensor";
import geoCoordMap from '@/utils/area.js'
import {alarmTrend} from '@/api/index'
import { listEquipment,getCarbonAndAreaCountData,getEquipment} from "@/api/equipment/equipment";
import {equimentCount} from '@/api/index'
// import {allAlertList,handler} from '@/api/system/alarm';
import {getChildsByAncestors} from '@/api/system/dept';
import { listEquipAttributes } from "@/api/equipment/equipattributes";
export default {
  name: "尚美丽家",
  data() {
    return {
      maniHt: '',
			size: 'small',
			isFullscreen: false,
      //中国地图（第一级地图）的ID、Name、Json数据
      chinaId: 100000,
      chinaName: 'china',
      chinaJson: null,
      //记录父级ID、Name
      mapStack: [],
      parentId: null,
      parentName: null,
      //Echarts地图全局变量，主要是在返回上级地图的方法中会用到
      myChart: null,
      //计数判断是省还是市
      mapClickCount: 0,
      mapName: '',
      custNums: 0,
      eqAll: 0,
      currentMonthCount: 0,
      lastMonthCount: 0,
      todayStataCount: 0,
      todayOutCount: 0,
      todayOfflineCount: 0,
      currStataCount: 0,
      currOutCount: 0,
      currOfflineCount: 0,
      last15DaysData: [],
      history: [],
      cityName: this.chinaName,
      cityId: this.chinaId,
		size: 'small',
		mapzoom: 1.2,
		scroll1: 0,
		timers1: null,
		scroll2: 0,
		timers2: null,
		scroll3: 0,
		timers3: null,
		scroll4: 0,
		timers4: null,
		scroll5: 0,
		timers5: null,
		rightdefault: true,
		rightmap: false,
		warnDialog: false,
		deptWarnDialog:false,
		warnid: '',
		warnDialogPicture: false,
		equipTotal:0,
		queryParams: {
			pageNum: 1,
			pageSize: 10,
		},
		sensorAll: 0,
		sensorOnline: 0,
		sensorOffline: 0,
		sensorAlarm: 0,
		alarmTrendData:{
			date:[],
			out:[],
			stata:[],
			offline:[]
		},
		alramlist:[],
		warndetbox:false,
		ycNameClick:'',
		eqNameClick:'',
		alarmContent:'',
		alarmDate:'',
		checkId:'',
		checkType:'',
		deal:'',
		form:{
  			info: ''
		},
		sensorQueryParams:{
			pageNum: 1,
			pageSize: 100,
		},
		sensorList:[],
		lastMonthNewlyAddedData:[],
		carbon:0,
		area:0,
		childDepts:[],
		currRowDeptDetail:[],
		rightEquipList:[],
		rightEquipDetailData:{
			equip:{},
			eqAttributesList:{}
		},
	}
  },

  watch: {},
  created() {
    this.history.push({cityName: this.chinaName, cityId: this.chinaId})
    const store = useStore();
    const getters = computed(() => store.getters);

		setTimeout(() => {
		  this.deptName = store.getters.user.dept.deptName + '云平台';
		}, 500)
  },

  mounted: function () {
    var t = null
    t = setTimeout(time, 1000)//開始运行
    function time() {
      clearTimeout(t)//清除定时器
      var dt = new Date()
      var y = dt.getFullYear()
      var mt = dt.getMonth() + 1
      var day = dt.getDate()
      var h = dt.getHours()//获取时
      var m = dt.getMinutes()//获取分
      var s = dt.getSeconds()//获取秒
      document.getElementById('showTime').innerHTML = y + '年' + mt + '月' + day + '日 ' + h + '时' + m + '分' + s + '秒'
      t = setTimeout(time, 1000) //设定定时器，循环运行
    }

    //地图
    this.map()
    //告警信息
    //改变导航颜色
    this.navcolorchange();
	this.topimageLoaded();
    // this.getEqNums();
    // this.getAlarmTrend();
    // this.getLastMonthAlarmData();
    // this.getCurrentMonthAlarmData();
    
    // this.getCurrentAlertCountsByTypeFor();
    // this.getTodayAlertCountsByTypeFor();


	setTimeout(()=>{
		this.tableScroll1();
		this.tableScroll2();
		this.tableScroll3();
	},1000)


	this.getDeptCounts();
	this.getEquipCount();
	this.getSensorData();
	this.getAlertDataByTypeForLast15Days();
	this.getAlertCountsByTypeForLast15Days();
	this.gettotalAlarm();
	this.getSensorList();
	this.getLastMonthNewlyAddedEquipList();
	this.getCarbonAndAreaCountData();
	this.getChildsByParentId();
  },

  methods: {
	
	warnBtn(row) {
		this.warnDialog = true;
		const eqId = row.eqId
		getEquipment(eqId).then(response => {
			this.rightEquipDetailData.equip = response.data;
			listEquipAttributes({eqId:eqId}).then(res => {
				this.rightEquipDetailData.eqAttributesList = res.rows
			})
		});
	},
	// 客户信息
	getChildsByParentId(){
    getChildsByAncestors().then(response =>{
			this.childDepts = response.data;
		})
	},
	//累计节碳 供暖面积
	getCarbonAndAreaCountData(){
		getCarbonAndAreaCountData().then(response =>{
			this.carbon = response.data.carbon
			this.area = response.data.area
		})
	},
	formatDate() {
		let date = new Date();  //当天
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;
		let beforeTime = new Date(date.getTime() - 24 * 60 * 60 * 1000 * 30); //一个月前
		return parseTime(beforeTime,'{y}-{m}-{d}');
	},
	//最近一个月新增设备
	getLastMonthNewlyAddedEquipList(){
		this.queryParams.startDate = this.formatDate();
		this.queryParams.endDate = parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}');
		this.queryParams.pageSize = 100
		listEquipment(this.queryParams).then(response => {
			this.lastMonthNewlyAddedData = response.rows;
		})
	},
	/** 查询传感器管理列表 */
	getSensorList() {
		listSensor(this.sensorQueryParams).then(response => {
			this.sensorList = response.rows;
		});
	},
	// 告警弹窗
	warnclick(row) {
		this.ycNameClick = row.pointName;
		this.eqNameClick = row.eqname;
		this.alarmContent = row.state;
		this.alarmDate = row.dt;
		this.checkId = row.id
		this.deal = row.deal
		this.checkType = row.type
		this.warndetbox = true;
	},
	//告警处理
	onSubmit() {
		let handlerList = [{
			id: this.checkId,
			deal: this.deal,
			yuexDealbz: this.form.info,
			type: this.checkType
		}]
		handler(handlerList).then(res => {
			this.warndetbox = false;
			gettotalAlarm()
		})
	},
	//客户数量
	getDeptCounts() {
    getSMDeptCounts().then(response => {
        this.custNums = response.data
      })
    },
	//总设备数
	getEquipCount(){
		listEquipment(this.queryParams).then(response => {
			this.rightEquipList = response.rows;
			this.equipTotal = response.total;
		})
	},
	// 传感器数量
	getSensorData(){
		equimentCount().then(res => {
			this.sensorAll = res.data.all
			this.sensorOffline = res.data.offline
			this.sensorOnline = res.data.online
			this.sensorAlarm = res.data.alarm
		})
	},
	// 近15日故障/告警趋势
	getAlertDataByTypeForLast15Days(){
		getAlertDataByTypeForLast15Days('15').then(res => {
			var data = res.data;
			this.alarmTrendData.date = data.date;
			this.alarmTrendData.offline = data.offline;
			this.alarmTrendData.state = data.state;
			this.alarmTrendData.out = data.out;
			this.gjqs();
		})
	},
	// 近15日告警分类
	getAlertCountsByTypeForLast15Days() {
      getAlertCountsByTypeForLast15Days("15").then(res => {
        this.last15DaysData = res.data;
			this.$nextTick(() => {
				this.echartsTwo();
			})
      })
    },
	// 右侧 最新告警
	gettotalAlarm() {
		// allAlertList().then(response => {
		// 	this.alramlist = response.rows;
		// })
	},
	deptDetailBtn(index, row) {
		this.deptWarnDialog = true
		this.currRowDeptDetail = [];
		this.currRowDeptDetail = row;
		this.warnid = index;
	},
		
		mapinfo() {
			this.rightdefault = false;
			this.rightmap = true;
			this.$nextTick(() => {
				setTimeout(()=>{
					this.tableScroll4();
					this.tableScroll5();
				},1000)
			})
			
		},
		mapinfoclose() {
			this.rightdefault = true;
			this.rightmap = false;
		},
		mouseenter(i) {
			clearInterval(i);
		},
		mouseleave(i) {
			if(i==1){
				this.tableScroll1();
			}
			if(i==2){
				this.tableScroll2();
			}
			if(i==3){
				this.tableScroll3();
			}
			if(i==4){
				this.tableScroll4();
			}
			if(i==5){
				this.tableScroll5();
			}
		},
		tableScroll1() {
			const table = this.$refs.table1.$refs;
			const divData = table.scrollWrapper;
			var num = this.scroll1;
			var scrolllength = table.tableBody.$el.offsetHeight;
			var tableHt = JSON.parse(JSON.stringify(divData)).height;
				//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
				//console.log(scrolllength, tableHt)
				if(scrolllength>tableHt){
					this.timers1 = window.setInterval(() => {
						// 元素自增距离顶部1像素
						num--;
						this.scroll1 = num;
						table.tableBody.$el.style.marginTop = num + 'px';
						// 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
						if (table.tableBody.$el.offsetHeight + num <= 0) {
							// 重置table距离顶部距离
							table.tableBody.$el.style.marginTop = 0;
							num = 0;
							this.scroll1 = num;
						}
					}, 100);
				}
			
			
			
		},
		tableScroll2() {
			const table = this.$refs.table2.$refs;
			const divData = table.scrollWrapper;
			var num = this.scroll2; 
			var scrolllength = table.tableBody.$el.offsetHeight;
			var tableHt = JSON.parse(JSON.stringify(divData)).height;
				//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
				//console.log(scrolllength, tableHt)
				if(scrolllength>tableHt){
					this.timers2 = window.setInterval(() => {
						num--;
						this.scroll2 = num;
						table.tableBody.$el.style.marginTop = num + 'px';
						if (table.tableBody.$el.offsetHeight + num <= 0) {
							table.tableBody.$el.style.marginTop = 0;
							num = 0;
							this.scroll2 = num;
						}
					}, 100);
			}
		},
		tableScroll3() {
			const table = this.$refs.table3.$refs;
			const divData = table.scrollWrapper;
			var num = this.scroll3;
			var scrolllength = table.tableBody.$el.offsetHeight;
			var tableHt = JSON.parse(JSON.stringify(divData)).height;
				//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
				//console.log(scrolllength, tableHt)
				if(scrolllength>tableHt){
					this.timers3 = window.setInterval(() => {
						num--;
						this.scroll3 = num;
						table.tableBody.$el.style.marginTop = num + 'px';
						if (table.tableBody.$el.offsetHeight + num <= 0) {
							table.tableBody.$el.style.marginTop = 0;
							num = 0;
							this.scroll3 = num;
						}
					}, 100);
			}
		},
		tableScroll4() {
			const table = this.$refs.table4.$refs;
			const divData = table.scrollWrapper;
			var num = this.scroll4;
			var scrolllength = table.tableBody.$el.offsetHeight;
			var tableHt = JSON.parse(JSON.stringify(divData)).height;
				//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
				//console.log(scrolllength, tableHt)
				if(scrolllength>tableHt){
					this.timers4 = window.setInterval(() => {
						num--;
						this.scroll4 = num;
						table.tableBody.$el.style.marginTop = num + 'px';
						if (table.tableBody.$el.offsetHeight + num <= 0) {
							table.tableBody.$el.style.marginTop = 0;
							num = 0;
							this.scroll4 = num;
						}
					}, 100);
			}
		},
		tableScroll5() {
			const table = this.$refs.table5.$refs;
			const divData = table.scrollWrapper;
			var num = this.scroll5;
			var scrolllength = table.tableBody.$el.offsetHeight;
			var tableHt = JSON.parse(JSON.stringify(divData)).height;
				//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
				//console.log(scrolllength, tableHt)
				if(scrolllength>tableHt){
					this.timers5 = window.setInterval(() => {
						num--;
						this.scroll5 = num;
						table.tableBody.$el.style.marginTop = num + 'px';
						if (table.tableBody.$el.offsetHeight + num <= 0) {
							table.tableBody.$el.style.marginTop = 0;
							num = 0;
							this.scroll5 = num;
						}
					}, 100);
			}
		},
		toggleScreen() {
		  // 切换全屏r
		  // 如果当前未开启 点击就开启  如果已开启 点击关闭全屏
		  if (this.isFullScreen) {
		    // 关闭
		    document.exitFullscreen()
		  } else {
		    // 打开
		    document.documentElement.requestFullscreen()
		  }
		  this.isFullScreen = !this.isFullScreen
		},
		changeSize() {
		  this.toggleScreen()
		  if (this.size == 'small') {
		    this.size = 'big'
		    document.querySelector('.sidebar-container').style = "width:0!important";
		    document.querySelector('.main-container').style = "margin-left:0!important";
		    document.querySelector('.app-main').style.minHeight = '100vh';
		    document.querySelector('.shangmeilijia').style.minHeight = '100vh';
		    document.querySelector('.navbar').style.display = 'none';
		    document.querySelector('.tags-view-container').style.display = 'none';
		    var winWd = document.body.clientWidth;
				if(winWd>1366){
					document.querySelector('#map_1').style="margin-left:5%"
				}else{
					document.querySelector('#map_1').style="margin-left:8%"
				}
		  } else if (this.size == 'big') {
		    this.size = 'small'
		    document.querySelector('.sidebar-container').style.width = "";
		    document.querySelector('.main-container').style.marginLeft = "";
		    document.querySelector('.navbar').style.display = 'block';
		    document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.shangmeilijia').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.tags-view-container').style.display = 'block'
		    document.querySelector('#map_1').style="margin-left:0"
		  }
		},
    back() {
      let _this = this
			_this.mapzoom = 0.9
      if (this.history.length === 1) {
        return
      }
			if (this.history.length <= 2) {
				_this.mapzoom = 1.2
				_this.rightdefault = true
				_this.rightmap = false
				
			}else{
				_this.mapzoom = 0.9
			}
      this.history.pop()
      this.cityName = this.history[this.history.length - 1].cityName
      this.cityId = this.history[this.history.length - 1].cityId
      axios
          .get('/assets/map/' + this.cityId + '.json', {})
          .then(response => {
            const mapJson = response.data
            _this.registerAndsetOption(
                _this.myChart,
                this.cityId,
                this.cityName,
                mapJson,
                false,
								_this.mapzoom
            )
          })
      this.mapClickCount -= 1
    },
    
    getCurrentAlertCountsByTypeFor() {
      getAlertCountsByTypeForLast15Days("current").then(res => {
        this.currStataCount = res.data[0].num
        this.currOfflineCount = res.data[2].num
        this.currOutCount = res.data[1].num
      })
    },
    getTodayAlertCountsByTypeFor() {
      getAlertCountsByTypeForLast15Days("today").then(res => {
        this.todayStataCount = res.data[0].num
        this.todayOfflineCount = res.data[2].num
        this.todayOutCount = res.data[1].num
      })
    },
    getLastMonthAlarmData() {
      getAlertCountsByTypeForLast15Days("lastMonth").then(res => {
        res.data.forEach((item, index) => {
          this.lastMonthCount += item.num
        })
        // this.lastMonthCount = res.data.length;
      })
    },
    getCurrentMonthAlarmData() {
      getAlertCountsByTypeForLast15Days("currentMonth").then(res => {
        res.data.forEach((item, index) => {
          this.currentMonthCount += item.num
        })
      })
    },
    getAlarmTrend() {
      alarmTrend({"interval": "15"}).then(res => {
        let dataArray = [];
        let data = [];
        res.data.forEach((i, index) => {
          data.push(i.num)
          dataArray.push(parseTime(i.dt, '{m}-{d}'))
        })
        this.gjqs(dataArray, data);
      })
    },
    /*告警趋势*/
    gjqs() {
      const chartmaindom = document.getElementById('ecahrt1');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('ecahrt1'))
      myChart.setOption({
        xAxis: {
          type: 'category',
          /*改变x轴颜色*/
          axisLine: {
            lineStyle: {
              color: '#224471',
              width: 1, //这里是为了突出显示加上的
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: "10",
							color: "#fff"
            },
          },
          axisTick: {
            show: false
          },
          data: this.alarmTrendData.date
        },
		legend: {
			data: ['变位','越限','离线'],
			right: 0,
			padding: [15, 15,0,0],
			itemHeight: 5,
			itemWidth: 15,
			textStyle: {
				color: '#fff'
			}
		},
		tooltip: {
			trigger: 'axis',
		},
		color:[ '#3db8ff', '#f8fc09' ],
        grid: [
          {
            bottom: '10%',
            top: '20%',
            right: '5%',
						left: '20%'
          },
        ],
        yAxis: {
          show: true,
          splitLine: {
            lineStyle: {
              color: "rgba(190, 228, 248, .1)"
            }
          },
          axisLine: {
			show:true,
            lineStyle: {
              color: '#224471',
              width: 1, //这里是为了突出显示加上的
            }
          },
		  axisLabel: {
			color:"#fff"
		  },
          type: 'value'
        },
        series: [
          {
			name: '变位',
            data: this.alarmTrendData.state,
            type: 'line',
            smooth: true
          },
		  {
			name: '越限',
			data: this.alarmTrendData.out,
			type: 'bar',
			barWidth: 8,
			itemStyle: {
				borderRadius: [10,10,0,0]
			}
		 },
		 {
			name: '离线',
            data: this.alarmTrendData.offline,
            type: 'line',
            smooth: true
          },
        ]
      });
      // 绘制图表
    },
    getEqNums() {
      getEquipCountsByDeptId().then(res => {
        this.eqAll = res.data.data.length
      })
    },
    
    map() {
			setTimeout(() => {
			  this.mapChart('map_1')
			}, 500)

    },
    /**
     * Echarts地图
     */
    mapChart(divid) {
      let _this = this
      axios.get('/assets/map/' + _this.chinaId + '.json', {}).then(response => {
        const mapJson = response.data
        _this.chinaJson = mapJson
        const pieEchart = document.getElementById(divid)
        pieEchart.removeAttribute('_echarts_instance_')
        _this.myChart = _this.echarts.init(pieEchart)
        _this.registerAndsetOption(_this.myChart, _this.chinaId, _this.chinaName, mapJson, false, _this.mapzoom)
        _this.parentId = _this.chinaId
        _this.parentName = 'china'
        _this.myChart.on('click', function (param) {
          var cityId = cityMap[param.name]
          if (cityId) {
            _this.mapClickCount++
            _this.mapName = param.name
            //代表有下级地图
            axios
                .get('/assets/map/' + cityId + '.json', {})
                .then(response => {
                  const mapJson = response.data
                  _this.registerAndsetOption(
                      _this.myChart,
                      cityId,
                      param.name,
                      mapJson,
                      true,
											0.9
                  )
                  _this.history.push({
                    cityId: cityId,
                    cityName: param.name
                  })
                })
          } else {
            if (param.componentType === 'geo') {
              _this.mapClickCount = 0
              _this.mapName = ''
              // //没有下级地图，回到一级中国地图，并将_this.mapStack清空
              // _this.registerAndsetOption(_this.myChart, _this.chinaId, _this.chinaName, _this.chinaJson, false)
              //_this.mapStack = []
              //_this.history =  [{cityName: _this.chinaName, cityId: _this.chinaId}]
              let cityNames = []
              _this.history.forEach((item, index) => {
                if (index !== 0) {
                  cityNames.push(item.cityName)
                }
              })
              cityNames.push(param.name)
              _this.$router.push({
                path: '/industry/parameter',
                query: {
                  cityNames: cityNames
                }
              })
            }

          }
        })
      })
    },
    /**
     *
     * @param {*} myChart
     * @param {*} id        省市县Id
     * @param {*} name      省市县名称
     * @param {*} mapJson   地图Json数据
     * @param {*} flag      是否往this.mapStack里添加this.parentId，this.parentName
     */
    registerAndsetOption(myChart, id, name, mapJson, flag, mapzoom) {

      let _this = this
      var data = {}
      _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
      if (_this.mapClickCount == 0) {
        getSensorCountByArea({level: 1}).then(response => {
          var data = {}
          for (let row of response.data) {
            data[row.areaName] = row.cnt
          }
          _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
        }).catch(error => {
          console.log(error)
        })
      } else if (_this.mapClickCount == 1) {
        if (name.indexOf('北京') >= 0 || name.indexOf('上海') >= 0 || name.indexOf('天津') >= 0 || name.indexOf('重庆') >= 0
            || name.indexOf('香港') >= 0 || name.indexOf('澳门') >= 0 || name.indexOf('台湾') >= 0) {
          getSensorCountByArea({level: 3}).then(response => {
            var data = {}
            for (let row of response.data) {
              data[row.areaName] = row.cnt
            }
            _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
          }).catch(error => {
            console.log(error)
          })
        } else {
          getSensorCountByArea({level: 2}).then(response => {
            var data = {}
            for (let row of response.data) {
              data[row.areaName] = row.cnt
            }
            _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
          }).catch(error => {
            console.log(error)
          })
        }
      } else if (_this.mapClickCount == 2) {
        getSensorCountByArea({level: 3}).then(response => {
          var data = {}
          for (let row of response.data) {
            data[row.areaName] = row.cnt
          }
          _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
        }).catch(error => {
          console.log(error)
        })
      }
    },
    registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom) {

      let _this = this

      var convertData = function (data) {
        var res = {}
        for (let k in data) {
          var geoCoord = geoCoordMap[k]
          if (geoCoord) {
            res[k] = geoCoord.concat(data[k])
          }
        }
        return res
      }
      var convertData1 = function (data) {
        var res = []
        for (let k in data) {
          var geoCoord = geoCoordMap[k]
          if (geoCoord) {
            res.push({
              name: k,
              value: data[k]
            })
          }
        }
        return res
      }
      let option = {
        layoutCenter: ['50%', '50%'],//位置
        layoutSize: '100%',//大小
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (typeof (params.value)[2] == 'undefined') {
              return params.name + ' : ' + params.value
            } else {
              return params.name + ' : ' + params.value[2]
            }
          }
        },
        geo: {
          type: 'map',
          map: name,
          aspectScale: 0.75,
          zoom: mapzoom,
          //   roam:true,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: false
            }
          },
          //   roam: false,//禁止其放大缩小
          itemStyle: {
            normal: {
              areaColor: '#4c60ff',
              borderColor: '#002097'
            },
            emphasis: {
              areaColor: '#293fff'
            }
          }
        },
        series: [
          {
            name: 'map',
            type: 'scatter', // 显示精确分布点
            coordinateSystem: 'geo',
            data: [],
            symbol: 'image://' + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAABhCAYAAADm6pBeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZjdiNmRhZi05MzU0LTlhNGEtYWQwMi01NzA0NmU2ZjUyOWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEZCRkExODYyQ0JEMTFFREEwNDk5RTI5M0E1NDI0RTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEZCRkExODUyQ0JEMTFFREEwNDk5RTI5M0E1NDI0RTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M2FlMzY1MTctY2JiMS01ZTQ0LTgyMzgtMmRkOTY3Y2Y0ZjZiIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRmN2I2ZGFmLTkzNTQtOWE0YS1hZDAyLTU3MDQ2ZTZmNTI5YiIv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',
            z: 2,
            symbolSize: [12, 80],
            label: {
              normal: {
                show: true,
                formatter: function (params) { //标签内容
                  return params.value[2];
                },
                position: 'top',
                borderWidth: '1',
                padding: [10, 10],
                color: '#5ccaff',
                fontSize: 24,
                fontWeight: '600',
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#ffeb7b'
              }
            }
          }
        ]
      }
      let ndata = convertData(data)
      if (id == '100000') {
        let dd = convertData1(ndata)
        option.series[0].data = dd
      } else {
        let dd = _this.initMapData(mapJson, ndata)
        option.series[0].data = dd
      }

      this.echarts.registerMap(name, mapJson)
      myChart.setOption(option)

      if (flag) {
        //往this.mapStack里添加this.parentId，this.parentName,返回上一级使用
        _this.mapStack.push({
          mapId: _this.parentId,
          mapName: _this.parentName
        })
        _this.parentId = id
        _this.parentName = name
      }
    },
    initMapData(mapJson, data) {
      var mapData = []
      for (var i = 0; i < mapJson.features.length; i++) {
        mapData.push({
          name: mapJson.features[i].properties.name,
          value: data[mapJson.features[i].properties.name]
          //id:mapJson.features[i].id
        })
      }
      return mapData
    },
    navcolorchange() {
      document.querySelector('.navbar').style.background = '#243547';
      document.querySelector('.tags-view-container').style.background = '#1e2d3e';
    },
    topimageLoaded() {
      let topHt = document.querySelector('.top').clientHeight + 'px';
      this.maniHt = 'calc(100% - ' + topHt + ' - 30px)';
      // this.$nextTick(() => {
      // 	// this.echartsTwo();
      // })
    },
    echartsTwo() {
      let chartDom2 = document.getElementById('ecahrt2');
      let myChart2 = echarts.init(chartDom2);
      let option;

      option = {
        title: {
          text: '告警\n类型',
					top: 'center',
					    left: 'center',
          textStyle: {
            color: '#fff',
            height: '100%',
            width: '100%',
            background: '#000',

						textAlign: 'center'
          },
        },
				grid: {
					left: 0,
					right:0,
				},
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: '30%',
          right: 0,
          width: 80,
          align: 'left',
          itemHeight: 6,
          itemWidth: 15,
          textStyle: {
            color: '#fff'
          }
        },
        color: ['#ff9d4d', '#e51fde', '#fff100'],
        series: [
          {
            //name: '报警类型',
            type: 'pie',
            radius: ['60%', '72%'],
            minAngle: 15,//最小角度
            startAngle: 240, //起始角度
            avoidLabelOverlap: true,
            center: ['50%', '50%'],
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 10
            },
            label: {
              show: false,
              position: 'outside',
              color: '#fff',
              formatter: '{b}\n {c}',
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10,
            },
            data: [
              {value: this.last15DaysData[0].num, name: '变位'},
              {value: this.last15DaysData[1].num, name: '越限'},
              {value: this.last15DaysData[2].num, name: '离线'},
            ],
          }
        ]
      };

      option && myChart2.setOption(option);
    }

  },

}
</script>


<style scoped lang="scss">
.shangmeilijia {
  background: url('@/assets/images/soar/screenbg.jpg') no-repeat center;
  background-size: cover;
  height: calc(100vh - 84px);
	.fangda {
	  position: absolute;
	  right: 20px;
	  top: 20px;
	  font-size: 18px;
	  color: #2aa7d3;
	}

  :deep(.el-col) {
    height: 100%;
  }

  .top {
    width: 100%;
    position: relative;
		.fangda {
		  position: absolute;
		  right: 20px;
		  top: 20px;
		  font-size: 18px;
		  color: #2aa7d3;
		}
    img {
      max-width: 100%;
      display: block;
      margin: 0 auto;
    }

    .title {
      color: white;
      font-weight: bold;
      text-align: center;
      position: absolute;
      top: calc(50% - 25px);
      font-size: 36px;
      width: 100%;
      line-height: 1;
      background: linear-gradient(to bottom, #06d4f5, #1b4fc3);
      -webkit-background-clip: text;
      color: transparent;
    }
  }

  .weather {
    position: absolute;
    left: 1.8rem;
    top: 0;
    line-height: 4rem;
  }

  .weather img {
    width: 2.22rem;
    display: inline-block;
    vertical-align: middle;
  }

  .weather span {
    color: #2aa7d3;
    font-size: 14px;
    padding-right: .6rem;
  }

  .main {
    padding: 0 20px;
    margin: 20px 0 0;

    .box {
      background: rgba(5, 24, 73, .6);
      border: 1px solid #2373b0;
      position: relative;
    }

    .box:before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: -1px;
      pointer-events: none;
      background: url('@/assets/images/soar/boxbg-top.png') no-repeat top;
      background-size: 100%;
    }

    .box::after {
      content: '';
      height: 100%;
      position: absolute;
      bottom: -1px;
      left: -1px;
      right: -1px;
      pointer-events: none;
      background: url('@/assets/images/soar/boxbg-bottom.png') no-repeat bottom;
      background-size: 100%;
    }

    .p15 {
      padding: 15px;
    }

    .boxtit {
      padding: 0 10px;
      border-left: 5px solid #00e4ff;
      color: #00e4ff;

      h4 {
        display: inline-block;
        line-height: 1;
        margin: 0 10px 0 0;
      }

      img {
        height: 16px;
        vertical-align: middle;
        display: inline-block;
				position: absolute;
      }
    }

    .left {
      height: 100%;

      .box {
        height: calc(33.3% - 10px);
        margin-bottom: 10px;
      }

      .databox {
        padding: 0px 15px 0;

        .dataitem {
          height: 38%;
          text-align: right;

          .datart {
            top: 50%;
            position: relative;
            transform: translateY(-50%);
          }

          img {
            max-width: 100%;
						height: 80%;
            display: block;
            top: 50%;
            position: relative;
            transform: translateY(-50%);
          }

          h4 {
            color: #fff;
            margin: 0 0 6px;
            font-size: 14px;
          }

          h5 {
            font-size: 30px;
            font-weight: bold;
            letter-spacing: -2px;
            margin: 0;
            padding-right: 1px;
            background-image: -webkit-linear-gradient(bottom, #5ccaff, #b1e9fe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
				.datadata{
					font-size: 12px;
					line-height: 2;color: #fff;
					i{
						font-size: 18px;
					}
					.el-col{
						white-space: nowrap;
					}
				}
				.databot{
					padding: 0 5px;background: rgba(255,255,255,0.1);
					border:1px solid rgba(255,255,255,0.2);
					border-radius: 5px;
					margin: 5px 0 0;
					.databot-right{
						width: calc(100% - 60px);float: left;
					}
					img{
						width: 60px;float: left;
					}
					h5{
						font-size: 12px;color:#08bdf2;
						margin:10px 0 5px
					}
					h4{
						color: #92deff;font-size: 16px;font-weight: bold;
						margin:0;white-space: nowrap;
						span{
							font-size: 12px;font-weight: normal;
						}
					}
				}
      }

      .ecahrt1 {
        height: calc(100% - 15px);  
        width: calc(100% + 30px);
        margin-left: -15px;
      }

      .ecahrt2 {
        height: calc(100% - 15px);
        width: 130%;
				margin-left: -30%;
      }
    }

		.map4 {
		  height: 100%;
			position: relative;
			width: 100%;
			//overflow: hidden;
			.goback{
				position: absolute;left: 0;top: 0;
				background: transparent;
				border: 1px solid #00e4ff;
				color: #00e4ff;
				padding: 5px 10px;border-radius: 5px;
				cursor: pointer;z-index: 999;
				outline: none;
			}
			.goback:hover{
				opacity: 0.8;
			}
		}

    #map_1{
    	height: 105%;
			width: 100%;
			position: relative;
			top: -3%;
    }

    .right {
      height: 100%;
			
			.boxtit{
				margin:0 0 15px
			}
      .box {
        height: calc(33.3% - 10px);margin-bottom: 10px;
				:deep(.el-table) {
					background: transparent;
					.el-table__header-wrapper th{
						height: 25px !important;
						background: #1d5c97 !important;
						color: #00f6ff;
						padding:0;border: 0;
					}
					.el-table__header{
						width: auto !important;
					}
					th.el-table__cell>.cell{
						color: #00f6ff;
					}
					.el-table__body{
						width: auto !important;
					}
					tr{
						background: transparent;
					}
					tr:hover td.el-table__cell{
						background: transparent;
					}
					tr.el-table__row--striped td.el-table__cell{
						background: rgba(255, 255, 255, 0.1);
					}
					.cell{
						font-size: 12px;color: #fff;padding:0 5px;
					}
					td.el-table__cell{
						border: 0;
					}
					.el-table__inner-wrapper::before{
						display: none;
					}
					.el-table__empty-block{
						width: auto !important;
					}
					.btn{
						font-size: 12px;border: 0;height: auto;
						padding: 3px 5px;border-radius: 20px;
						background:repeating-linear-gradient(to bottom,#45a9d0,#1671e3);
						color: #fff;
						transform: scale(0.8,0.8);
					}
				}
      }
			.mapbox{
				height: calc(50% - 10px);
			}
    }

  }
	:deep(.el-dialog) {
		background: #020b2d;
		border-top: 5px solid #00a3ff;
		margin:0 !important;
	  position:absolute;
	  top:50%;
	  left:50%;
	  transform:translate(-50%,-50%);
		.el-dialog__headerbtn .el-dialog__close{
			font-size: 24px;color: #4082f7;
			top: -10px;right: -10px;
		}
		.dialogtit{
			position: absolute;top: 10px;left: 15px;
			font-size: 18px;color: #fff;
			.btn1{
				font-size: 20px;color: #1fafff;
				vertical-align: text-top;
			}
		}
		.diatop{
			background: rgba(255, 255, 255, 0.1);
			border: 1px solid #09609c;
			padding: 15px 20px;
			.logo{
				width: 70px;height: 70px;
				border-radius: 5px;
				background: #73b7ec;
				float: left;margin-right: 20px;
			}
			.name{
				width: calc(100% - 90px);
				float: left;
				h5{
					font-size: 16px;color: #05a6ff;margin:0 0 20px;
					font-weight: bold;
				}
				h3{
					font-size: 22px;font-weight: bold;
					color: #fff;margin:0;
				}
			}
			.add{
				clear: both;
				font-size: 16px;color: #05a6ff;
				padding: 20px 0 10px;font-weight: bold;
			}
		}
		.item{
			font-size: 16px;color: #05a6ff;
			height: 48px;line-height: 48px;font-weight: bold;
			padding: 0 20px;
			border-bottom: 1px solid #09609c;
			span{
				color: #fff;margin-left: 15px;
				font-weight: normal;
			}
		}
		.info{
			border: 1px solid #09609c;
			position: relative;
			.picture{
				height: 191px;background: #020b2d;
				border-left: 1px solid #09609c;
				border-bottom: 1px solid #09609c;
				width: 50%;
				position: absolute;top: 0;right: 0;
				padding: 15px 20px 20px;
				h4{
					font-size: 16px;color: #05a6ff;font-weight: bold;
					margin: 0 0 5px;
				}
				img{
					max-width: 100%;max-height: calc(100% - 20px);
					display: block;margin: 0 auto;
					cursor: pointer;
				}
			}
		}
		.contact{
			h4{
				font-size: 16px;color: #05a6ff;
				margin: 20px 0 10px;font-weight: bold;
			}
			.item{
				width: 50%;float: left;
				border: 1px solid #09609c;
			}
		}
		.contact:before,.contact::after{
			content: '';clear: both;display: table;
		}
	}
	.warnpic{
		img{
			max-width: 100%;
			max-height: 100%;
		}
	}
}

@media screen and (max-width: 1367px) {
.shangmeilijia .main #map_1{
		height: 88%;
	}
	.shangmeilijia .main .right .rightitem{
		padding: 0 10px;
	}
	.shangmeilijia .main .right .rightitem .up .updata h4{
		white-space: nowrap;
	}
	.shangmeilijia .main .left .databox{
		padding: 0 15px;
	}
}

</style>




