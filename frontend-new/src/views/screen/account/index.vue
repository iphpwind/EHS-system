<template>
  <div class="index-con">
    <div class="pad-10px">
      <div class="index-top">
        <el-row>
          <el-col :span="12">
            <div class="idnex-title">
              运行监控
            </div>
          </el-col>
          <el-col :span="12">
            <div class="text-right right-time">最新统计时间：{{ nowDate }}
							<el-button circle @click="dataTanchu = true">
								<el-icon><Document /></el-icon>
							</el-button>
						</div>
						<div class="dataTanchu">
							<el-dialog
								v-model="dataTanchu"
								title="数据纵览"
								width="50%"
							>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">服务企业数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云企业数: {{cloudCompNum}}</div>
											<div class="child">私有化企业数: {{localCompNum}}</div>
										</el-col>
									</el-row>
								</div>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">服务用户数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云用户数: {{ cloudUserNum }}</div>
											<div class="child">私有化用户数: {{ localUserNum }}</div>
										</el-col>
									</el-row>
								</div>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">服务设备数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云设备总数: {{ serviceCloudEquipNum }}</div>
											<div class="child">私有设备总数: {{ serviceLocalEquipNum }}</div>
										</el-col>
									</el-row>
								</div>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">接入设备数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云设备数: {{ accessCloudEquipNum  }}</div>
											<div class="child">私有化设备数: {{ accessLocalEquipNum }}</div>
										</el-col>
									</el-row>
								</div>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">接入点位数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云点位数: {{ point_number }}</div>
											<div class="child">私有化点位数: {{ accessLocalPointNum }}</div>
										</el-col>
									</el-row>
								</div>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">上月新增设备数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云设备: {{lastmonthdata}}</div>
											<div class="child">私有化设备: {{lastMonthLocalEquipNum}}</div>
										</el-col>
									</el-row>
								</div>
								<div class="item">
									<el-row>
										<el-col :span="6">
											<div class="tit">年度新增设备数</div>
										</el-col>
										<el-col :span="18">
											<div class="child">上云设备: {{thisyear}}</div>
											<div class="child">私有化设备: {{thisYearLocalEquipNum}}</div>
										</el-col>
									</el-row>
								</div>
								
								<template #footer>
									<span class="dialog-footer">
										<el-button @click="dataTanchu = false">关闭</el-button>
									</span>
								</template>
							</el-dialog>
						</div>
          </el-col>
        </el-row>

        <div class="index-ul">
          <el-row>
            <!-- 服务企业数量-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ parseInt(cloudCompNum) + parseInt(localCompNum)}}</div>
                <div class="title">服务企业数量</div>
                <div class="ico">
                  <img src="@/assets/images/ico-1.png" alt="" class="indexImg">
                </div>
              </div>
            </el-col>
            <!-- 平台用户数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ parseInt(cloudUserNum) + parseInt(localUserNum)}}</div>
                <div class="title">平台用户数</div>
                <div class="ico"><img src="@/assets/images/ico-2.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 接入设备总数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ parseInt(accessCloudEquipNum) + parseInt(accessLocalEquipNum) }}</div>
                <div class="title">接入设备总数</div>
                <div class="ico"><img src="@/assets/images/ico-3.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 在线设备数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ online }}</div>
                <div class="title">在线设备数</div>
                <div class="ico"><img src="@/assets/images/ico-4.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 接入点位数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ parseInt(point_number) + parseInt(accessLocalPointNum) }}</div>
                <div class="title">接入点位数</div>
                <div class="ico"><img src="@/assets/images/ico-5.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 本日处理数据-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ data_number }}</div>
                <div class="title">本日处理数据</div>
                <div class="ico"><img src="@/assets/images/ico-6.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 已处理告警-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ alarm }}</div>
                <div class="title">已处理告警</div>
                <div class="ico"><img src="@/assets/images/ico-7.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 待处理告警-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">{{ completed_alarm }}</div>
                <div class="title">待处理告警</div>
                <div class="ico"><img src="@/assets/images/ico-8.png" class="indexImg"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="index-nr">
        <div class="index-nr-con">
          <el-row :gutter="10">
            <!-- 设备分布-->
            <el-col :span="6" class="index-nrli">
              <div class="sbfb index-nrliboder">
                <div class="index-titliheight">
                  <div class="idnex-title">设备分布</div>
                </div>
                <div class="index-nrliheight" id="sbfb">
                  <!--            <img src="@/assets/images/ditu.jpg" style="width: 100%; height: 100%;">-->
                </div>
              </div>
            </el-col>
            <!-- 设备接入趋势-->
            <el-col :span="12" class="index-nrli">
              <div class="shebeijr index-nrliboder">
                <div class="index-titliheight">
                  <div class="idnex-title">设备接入趋势</div>
                </div>
                <div class="index-nrliheight">
                  <div class="zhexiantu" id="shebeijr"></div>
                  <div class="zhexiantuli">
                    <el-row :gutter="20">
                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but1.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">在线设备</div>
                                <div class="digital">{{ online }}</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but2.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">上月新增</div>
                                <div class="digital">{{ lastmonthdata }}</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but3.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">年度新增</div>
                                <div class="digital">{{ thisyear }}</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but4.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">设备总数</div>
                                <div class="digital">{{ all }}</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>
                    </el-row>


                  </div>
                </div>
              </div>
            </el-col>
            <!-- 设备类型-->
            <el-col :span="6" class="index-nrli">
              <div class="sbfb index-nrliboder">
                <div class="index-titliheight">
                  <div class="idnex-title">设备类型</div>
                </div>
                <div class="index-nrliheight">
                  <div class="shebeilx" id="shebeilx"></div>
                  <div class="shebeilxli">
                    <el-table :data="tableData" border :header-cell-style="{ background: '#f5f7fd' }" style="width: 100%">
                      <el-table-column align="center" prop="sblxname" label="设备类型">
                      </el-table-column>
                      <el-table-column prop="percentage" align="center" label="百分比">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  <!-- <baidu-map class="bm-view" ak="XlhteYuKu0i3CnCRzCheI7rLh5nshkIj">
  </baidu-map> -->
</template>
<script>
import 'echarts/extension/bmap/bmap'
import { yxjk, equimentType, trend, city_total, getPoint,getLocalEquipAndPointData,getServiceCompanyInfo,getCloudUserNum,getEquipTotalByLastMonthAndYear } from "@/api/screen/screen";
import { listEquipment,getTodayDataNum } from "@/api/equipment/equipment"; // 获取设备总数 -设备台账的数量  传参store 0 、1 0：私有 1：上云

// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
  //  components: {
  //   BaiduMap
  // },
  name: "index",
  data() {
    return {
      cloudCompNum:0,// 上云企业数
      localCompNum:0,// 私有化企业数
      cloudUserNum:0,// 上云用户数
      localUserNum:0,//私有化用户数
      serviceCloudEquipNum:0,//上云服务设备数
      serviceLocalEquipNum:0,//私有化服务设备数
      accessCloudEquipNum:0,//上云接入设备数
      accessLocalEquipNum:0,//私有化接入设备数
      accessCloudPointNum:0,//上云接入点位数
      accessLocalPointNum:0,//私有化接入点位数
      lastMonthCloudEquipNum:0,//上月新增上云设备 传感器
      lastMonthLocalEquipNum:0,//上月新增私有化设备  设备台账
      thisYearCloudEquipNum:0,// 年度新增上云设备 传感器
      thisYearLocalEquipNum:0,// 年度新增私有化设备 设备台账


      nowDate: '',
      com_number: '',
      user_number: '',
      data_number: '',
      all: '',// 接入设备总数 、、上云设备总数的传感器数量
      online: '',
      offline: '',
      alarm: '',
      completed_alarm: '',
      point_number: '', //上云点位数
			dataTanchu: false,
      tableData: [{
        sblxname: '电力设备',
        percentage: '32.01%',
      }, {
        sblxname: '消防设备',
        percentage: '21.96%',
      }, {
        sblxname: '数控机床',
        percentage: '16.00%',
      }, {
        sblxname: '蒸汽锅炉',
        percentage: '10.00%',
      }, {
        sblxname: 'AGV设备',
        percentage: '8.00%',
      }, {
        sblxname: '数控机床2',
        percentage: '7.00%',
      }, {
        sblxname: '其他',
        percentage: '5.00%',
      }],
      shebeilxdata: [
        { value: 1048, name: '电力设备' },
        { value: 735, name: '消防设备' },
        { value: 580, name: '数控机床' },
        { value: 580, name: '蒸汽锅炉' },
        { value: 580, name: 'AGV设备' },
        { value: 484, name: '数控机床2' },
        { value: 300, name: '其他' }
      ],

      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthsdata: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      lastmonthdata: 0, // 上月上云设备  传感器
      thisyear: 0, // 年度上云设备  传感器
      dataaddress: [
        { name: '北京', value: 80 },
        { name: '上海', value: 80 },
        { name: '杭州', value: 80 },
        { name: '成都', value: 80 },
        { name: '深圳', value: 80 },
        { name: '沈阳', value: 80 },
        { name: '大连', value: 80 },
        { name: '天津', value: 80 },
        { name: '南京', value: 80 },
        { name: '西安', value: 80 },
        { name: '合肥', value: 80 },
        { name: '嘉兴', value: 80 },
        { name: '宁波', value: 80 },
        { name: '温州', value: 80 },
        { name: '福州', value: 80 },
        { name: '长沙', value: 80 },
        { name: '重庆', value: 80 },
      ],
      geoCoordMap: {
        // 北京: [116.46, 39.92],
        // 上海: [121.48, 31.22],
        // 杭州: [120.19, 30.26],
        // 成都: [104.06, 30.67],
        // 深圳: [114.07, 22.62],
        // 沈阳: [123.38, 41.8],
        // 大连: [121.62, 38.92],
        // 天津: [117.2, 39.13],
        // 南京: [118.78, 32.04],
        // 合肥: [117.27, 31.86],
        // 西安: [108.95, 34.27],
        // 嘉兴: [120.76, 30.77],
        // 宁波: [121.56, 29.86],
        // 温州: [120.65, 28.01],
        临沂市: [106.54, 29.59],
        泰安市: [113, 28.21],
        烟台市: [119.3, 26.08],
      },
    }
  },
  mounted() {

    //this.sbfb()
    this.shebeijr()
    //this.shebeilx()
    this.setNowTimes()
    this.yxjkdata()
    this.getequimentType()
    this.shebeitrend()
    this.baidu()
    this.getServiceCompanyInfo()
    this.getCloudUserNum()
    
    this.listEquipmentLocal()
    this.listEquipmentAccessCloud()
    this.listEquipmentAccessLocal()
    this.getEquipTotalByLastMonthAndYear()
    this.getTodayDataNum()
  },
  filters: {
    num: (val) => {
      val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
  },
  methods: {

    //
    getTodayDataNum(){
      getTodayDataNum().then(res =>{
        this.data_number = res.data
      })
    },

    // 上云企业 私有化企业 私有化用户数
    getServiceCompanyInfo(){
      getServiceCompanyInfo().then(res =>{
        this.cloudCompNum = res.data.cloud;
        this.localCompNum = res.data.local;
        this.localUserNum = res.data.userNum;
      })
    },

    // 上云用户数
    getCloudUserNum(){
      getCloudUserNum().then(res =>{
        this.cloudUserNum = res.total
      })
    },
    
    // 上云设备总数
    listEquipment(){
      let params = {
        store : "1" // 上云
      }
      listEquipment(params).then(res=>{
        this.serviceCloudEquipNum = res.total + this.all  // 设备台账+传感器
      })
    },

    // 私有设备总数 
    listEquipmentLocal(){
      let params = {
        store : "0" // 私有
      }
      listEquipment(params).then(res=>{
        this.serviceLocalEquipNum = res.total  // 设备台账
      })
      // 私有设备总数、网关接入设备
      getLocalEquipAndPointData(params).then(res =>{
        if(res.data != null ){
          this.serviceLocalEquipNum = this.serviceLocalEquipNum+res.data.equipTotal
        }
      })
    },

    // 上云设备数 接入设备
    listEquipmentAccessCloud(){
      let params = {
        store : "1" // 上云
      }
      // 上云设备总数、网关接入设备
      getLocalEquipAndPointData(params).then(res =>{
        if(res.data != null ){
          this.accessCloudEquipNum = res.data.equipTotal
        }
      })
    },
    // 私有化设备数 接入设备
    listEquipmentAccessLocal(){
      let params = {
        store : "0" // 私有化
      }
      // 私有化设备总数、网关接入设备
      getLocalEquipAndPointData(params).then(res =>{
        if(res.data != null ){
          this.accessLocalEquipNum = res.data.equipTotal
        }
      })
    },

    // 私有化点位数 接入点位数
    listEquipmentAccessLocal(){
      let params = {
        store : "0" // 私有化
      }
      // 私有化点位数据
      getLocalEquipAndPointData(params).then(res =>{
        if(res.data != null ){
          this.accessLocalPointNum = res.data.equipPointTotal
        }
      })
    },

    // 年度 月度 私有化设备
    getEquipTotalByLastMonthAndYear(){
      let params = {
        store : "0" // 私有化
      }
      getEquipTotalByLastMonthAndYear(params).then(res=>{
        this.lastMonthLocalEquipNum = res.data.cloudLastMonthNum
        this.thisYearLocalEquipNum = res.data.cloudThisYearNums
      })
    },

    num(val) {
      val = '' + val // 转换成字符串
      
      let int = val
      int = int.split('').reverse().join('') // 翻转整数
      let temp = '' // 临时变量
      for (let i = 0; i < int.length; i++) {
        temp += int[i]
        if ((i + 1) % 3 === 0 && i !== int.length - 1) {
          temp += ',' // 每隔三个数字拼接一个逗号
        }
      }
      temp = temp.split('').reverse().join('') // 加完逗号之后翻转

      return temp // 返回
    },

    setNowTimes() { // 获取日期
      var dt = new Date()
      var y = dt.getFullYear()
      var mt = dt.getMonth() + 1
      var d = dt.getDate()
      this.nowDate = y + '年' + mt + '月' + d + '日'
    },

    convertData(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    },

    baidu() {  //设备分布

      city_total().then(res => {
        let data1 = []

        res.data.citylist.forEach((i, index) => {
         
        data1.push({ name: i.areaName, value: [i.lng, i.lat, i.total] })

        })
        let that =this 
       
          that.sbfb(data1)

      })

    },
    // 运行监控
    yxjkdata() {
      yxjk().then(res => {
        this.com_number = res.data.com_number;
        this.user_number = res.data.user_number;
        this.all = res.data.all;
        this.online = res.data.online;
        this.offline = res.data.offline;
        this.alarm = res.data.alarm;
        this.completed_alarm = res.data.completed_alarm;
        this.point_number = res.data.point_number;
        // var data_number = res.data.data_number;
        // this.data_number = this.num(data_number);
        this.listEquipment()
      })

      //  this.shebeilxdata=res.data;

    },

    // 设备趋势
    shebeitrend() {
      trend().then(res => {
        this.months = res.data.months.reverse();
        this.monthsdata = res.data.totalarray.reverse();
        this.lastmonthdata = res.data.lastmonth;
        this.thisyear = res.data.thisyear;
        this.shebeijr()
      })

    },
    getequimentType() {
      equimentType().then(res => {

        this.tableData = {};
        let total = 0;
        let lxdata = []
        res.data.forEach((i, index) => {
          lxdata.push({ value: i.num, name: i.name })
          total = total + parseInt(i.num);
        })
      
        let data = [];
        res.data.forEach((i, index) => {
          data.push({ percentage: parseInt(i.num * 100 / total) + "%", sblxname: i.name })
        })
        this.tableData = data;

        this.shebeilxdata = lxdata;
        this.shebeilx();
      })
    },

    sbfb(data) {
      const chartmaindom = document.getElementById('sbfb');
      chartmaindom.removeAttribute('_echarts_instance_');
      let myChart = this.echarts.init(document.getElementById('sbfb'))
      myChart.setOption({

        tooltip: {
          trigger: 'item'
        },
        bmap: {
          center: [164.114129, 33.550339],
          zoom: 5,//当前视角的缩放比例
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: 'water',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'land',
                elementType: 'all',
                stylers: {
                  color: '#f3f3f3'
                }
              },
              {
                featureType: 'railway',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'highway',
                elementType: 'all',
                stylers: {
                  color: '#fdfdfd'
                }
              },
              {
                featureType: 'highway',
                elementType: 'labels',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'geometry',
                stylers: {
                  color: '#fefefe'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'geometry.fill',
                stylers: {
                  color: '#fefefe'
                }
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'green',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'subway',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'manmade',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'local',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'labels',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'boundary',
                elementType: 'all',
                stylers: {
                  color: '#fefefe'
                }
              },
              {
                featureType: 'building',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'label',
                elementType: 'labels.text.fill',
                stylers: {
                  color: '#999999'
                }
              }
            ]
          }
        },
        series: [
          {
            // name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: data,
            symbolSize: function (val) {
              return val[2] / 10;
            },
            encode: {
              value: 2
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: true//显示名称
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            // name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: 
              data
                // .sort(function (a, b) {
                //   return b.value - a.value;
                // })
                // .slice(0, 6)
            ,
            symbolSize: function (val) {
              return val[2] / 1;
            },
            encode: {
              value: 2
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            },
            emphasis: {
              scale: true
            },
            zlevel: 1
          }
        ]
      });



    },
    shebeijr() {
      // 设备接入趋势
      const chartmaindom = document.getElementById('shebeijr');
      chartmaindom.removeAttribute('_echarts_instance_');
      let myChart = this.echarts.init(document.getElementById('shebeijr'))
      myChart.setOption({
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数量',
            type: 'line',
            stack: '总量1',
            areaStyle: {//覆盖区域的渐变色
              normal: {
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: 'rgba(9,190,197, 0.8)' // 0% 处的颜色
                    },
                    {
                      offset: 1, color: 'rgba(9,190,197, 0)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                },
              }
            },
            data: this.monthsdata,
            itemStyle: {//线条的渐变
              normal: {
                color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1, color: '#09bec5' // 0% 处的颜色
                  },
                  {
                    offset: 0.3, color: '#09bec5' // 100% 处的颜色
                  },
                  {
                    offset: 0.1, color: '#09bec5' // 100% 处的颜色
                  }
                ]
                ),  //背景渐变色
              }
            }
          }
        ]
      });
      // 绘制图表
    },
    shebeilx() {
      // 设备接入趋势
      const chartmaindom = document.getElementById('shebeilx');
      chartmaindom.removeAttribute('_echarts_instance_');
      let myChart = this.echarts.init(document.getElementById('shebeilx'))
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 25,
          bottom: 20,
          itemHeight: 10,
          itemWidth: 10,
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['37%', '50%'],
            label: {
              show: false
            },
            data: this.shebeilxdata,
            // emphasis: {
            //   label: {
            //     show: true
            //   }
            // },
          }
        ]
      });
      // 绘制图表
    },
  }
}
</script>

<style lang="scss" scoped>
.index-con {
  background: #f3f3f4;
  width: 100%;
  height: calc(100vh - 84px);


  .idnex-title {
    font-size: 18px;
    border-left: 4px solid #09bec5;
    padding-left: 10px;

  }

  .index-top {
    background: #fff;
    border: 1px solid #e9e9e9;
    padding: 15px 10px;
    box-sizing: border-box;
    border-radius: 6px;

    .right-time {
      color: #778ca2;
      text-align: right;

    }

    .index-ul {
      padding: 30px 0 20px;

      .index-li {
        border-left: 1px solid #f3f5fb;

        .digital {
          font-size: 36px;
          color: #3a8fea;
          font-weight: bold;
          transform: scale(0.9, 1);
        }

        .title {
          font-size: 16px;
          padding: 4px 0 20px;
        }
      }

      .index-li:nth-child(2) {
        .digital {
          color: #6ccac9;
        }
      }

      .index-li:nth-child(3) {
        .digital {
          color: #57c8f2;
        }
      }

      .index-li:nth-child(4) {
        .digital {
          color: #57bf67;
        }
      }

      .index-li:nth-child(5) {
        .digital {
          color: #3a8fea;
        }
      }

      .index-li:nth-child(6) {
        .digital {
          color: #9564e2;
        }
      }

      .index-li:nth-child(7) {
        .digital {
          color: #f09a33;
        }
      }

      .index-li:nth-child(8) {
        border-left: none;

        .digital {
          color: #ff5722;
        }
      }

    }
		
		.dataTanchu{
			:deep(.el-dialog) {
				.el-dialog__header{
					border-bottom: 1px solid #eee;
				}
			}
			.item{
				border-bottom: 1px solid #eee;
				padding: 10px 0;font-size: 18px;
				.tit{
					color: #09bec5;font-weight: bold;
				}
				.child{
					font-size: 16px;
					width: 50%;float: left;
				}
			}
		}

  }

  .index-nr {
    height: calc(100vh - 380px);

    .index-nr-con {
      height: 100%;

      .el-row {
        height: 100%;
      }

      .index-nrli {
        height: 100%;

        .index-nrliboder {
          height: 100%;
          background: #fff;
          border: 1px solid #e9e9e9;
          padding: 15px 10px;
          box-sizing: border-box;
          border-radius: 6px;
          margin-top: 10px;

          .index-titliheight {
            height: 5%;
          }

          .index-nrliheight {
            height: 95%;
          }
        }

        .shebeijr {
          .zhexiantu {
            height: 80%;
          }

          .zhexiantuli {
            height: 20%;
            padding: 0 8%;

            .zhexiantuli-nr {
              background: #eff2fa;
              padding: 10px;

              .ico {
                text-align: center;
              }

              .name {
                font-size: 14px;
                color: #778ca2;
              }

              .digital {
                font-size: 20px;
              }
            }
          }
        }

        .sbfb {
          .shebeilx {
            height: 40%;
          }

          .shebeilxli {
            height: 60%;

            :deep(.el-table__cell) {
              padding: 5px 0;
            }
          }
        }
      }

    }
  }

}

@media screen and (max-width: 1440px) and (min-width: 769px) {
  .idnex-title {
    font-size: 15px !important;
  }

  .index-con {
    .index-top {
      padding: 10px 4px;

      .right-time {
        font-size: 14px;
      }

      .index-ul {
        padding: 15px 0 10px;

        .index-li {
          .digital {
            font-size: 22px;
          }

          .title {
            font-size: 14px;
            padding: 3px 0 10px;
          }

          .ico {
            img {
              width: 30px;
            }
          }
        }
      }
    }

    .index-nr {
      height: calc(100vh - 275px);

      .index-nrli {
        .index-titliheight {
          height: 6% !important;
        }

        .sbfb {
          .shebeilxli {
            :deep(.el-table) {
              .el-table__cell {
                padding: 0 !important;
                height: auto !important;
                font-size: 12px;

                .cell {
                  line-height: inherit;
                }
              }
            }

          }
        }

        .shebeijr {
          .zhexiantuli {
            padding: 0 2% !important;

            .zhexiantuli-nr {
              .ico {
                width: 30%;
                flex: 0 0 30%;

                img {
                  width: 80%;
                  text-align: center;
                }
              }

              .wenzi {
                width: 70%;
                flex: 0 0 70%;

                .name {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
