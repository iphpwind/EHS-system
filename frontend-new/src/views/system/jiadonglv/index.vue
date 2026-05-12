<template>
  <div class="jiadonglv">
    <div class="topbox">
      <el-form  ref="queryRef" :inline="true" label-width="68px" v-show="showSearch">
          <el-form-item label="所属部门" prop="deptId">
            <tree-select
                v-model:value="queryParams.deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
                :objMap="{ value: 'id', label: 'label', children: 'children' }"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      <el-row :gutter="10">
        
        <el-col :span="12">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">整厂稼动率</div>
            </template>
            <div class="progress">
              <el-row>
                <el-col :span="6">
                  <el-progress class="prog1"
                               type="circle"
                               :percentage="percent1"
                               :stroke-width="10"
                               :color="color1">
                    <template #default="{ percentage }">
                      <span>{{ dataList.activationPercent }}%</span>
                    </template>
                  </el-progress>
                  <h5>今日稼动率</h5>
                </el-col>
                <el-col :span="6">
                  <el-progress class="prog2"
                               type="circle"
                               :percentage="percent2"
                               :stroke-width="10"
                               :color="color2">
                    <template #default="{ percentage }">
                      <span>{{ dataList.activationPercent_yes }}%</span>
                    </template>
                  </el-progress>
                  <h5>昨日稼动率</h5>
                </el-col>
                <el-col :span="6">
                  <el-progress class="prog3"
                               type="circle"
                               :percentage="percent3"
                               :stroke-width="10"
                               :color="color3">
                    <template #default="{ percentage }">
                      <span>{{ dataList.activationPercent_nowweek }}%</span>
                    </template>
                  </el-progress>
                  <h5>本周稼动率</h5>
                </el-col>
                <el-col :span="6">
                  <el-progress class="prog4"
                               type="circle"
                               :percentage="percent4"
                               :stroke-width="10"
                               :color="color4">
                    <template #default="{ percentage }">
                      <span>{{ dataList.activationPercent_lastweek }}%</span>
                    </template>
                  </el-progress>
                  <h5>上周稼动率</h5>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card topcard">
            <template #header>
              <div class="card-header">设备状态分布</div>
            </template>
            <div id="echarts" class="echarts"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="botbox">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">细部稼动率</div>
        </template>
        <div class="tools">
          <!--          <el-button-group>
                      <el-button :autofocus="true" type="success" @click="timechose(1)">今日</el-button>
                      <el-button @click="timechose(2)">昨日</el-button>
                      <el-button @click="timechose(3)">前日</el-button>
                    </el-button-group>-->
          <el-radio-group v-model="radio3" size="medium" @change="timechose">
            <el-radio-button label="今天"></el-radio-button>
            <el-radio-button label="昨天"></el-radio-button>
            <el-radio-button label="前天"></el-radio-button>
          </el-radio-group>
          <div class="daypick">
            <el-date-picker
                v-model="queryParams.date"
                type="day"
                placeholder="选择日期"
                @change="ctimeonfirm1"
            />
          </div>
          <el-button @click="handleExport"><el-icon><MessageBox /></el-icon>导出</el-button>
        </div>
        <div class="table">
          <!-- 占位表头 -->
          <el-table :data="tablebiaotou"
                    :fit="false"
                    stripe
                    border
                    style="width:calc(100% - 5px)"
                    id="tablezhanwei"
          >
            <el-table-column prop="name" label="设备名称" width="10%" />
            <el-table-column prop="percent" label="稼动率" width="6%"/>
            <el-table-column label="上午">
              <el-table-column prop="zero" label="0" width="3.5%" />
              <el-table-column prop="one" label="1" width="3.5%" />
              <el-table-column prop="two" label="2" width="3.5%" />
              <el-table-column prop="three" label="3" width="3.5%" />
              <el-table-column prop="four" label="4" width="3.5%" />
              <el-table-column prop="five" label="5" width="3.5%" />
              <el-table-column prop="six" label="6" width="3.5%" />
              <el-table-column prop="seven" label="7" width="3.5%" />
              <el-table-column prop="eight" label="8" width="3.5%" />
              <el-table-column prop="nine" label="9" width="3.5%" />
              <el-table-column prop="ten" label="10" width="3.5%" />
              <el-table-column prop="eleven" label="11" width="3.5%" />
            </el-table-column>
            <el-table-column label="下午">
              <el-table-column prop="twelve" label="12" width="3.5%" />
              <el-table-column prop="thirteen" label="13" width="3.5%" />
              <el-table-column prop="fourteen" label="14" width="3.5%" />
              <el-table-column prop="fifteen" label="15" width="3.5%" />
              <el-table-column prop="sixteen" label="16" width="3.5%" />
              <el-table-column prop="seventeen" label="17" width="3.5%" />
              <el-table-column prop="eighteen" label="18" width="3.5%" />
              <el-table-column prop="nineteen" label="19" width="3.5%" />
              <el-table-column prop="twenty" label="20" width="3.5%" />
              <el-table-column prop="twentyone" label="21" width="3.5%" />
              <el-table-column prop="twentytwo" label="22" width="3.5%" />
              <el-table-column prop="twentythree" label="23" width="3.5%" />
            </el-table-column>
          </el-table>
          <div class="scroll">
            <el-table :data="tableData"
                      :fit="false"
                      stripe
                      border
                      style="width: 100%"
            >
              <el-table-column prop="name" label="设备名称" width="10%" />
              <el-table-column prop="percent" label="稼动率" width="6%">
                <template #default="scope">
                  <span>{{scope.row.percent}}</span>
                  <el-button link @click="detailInfo(scope.row)" class="btn">明细</el-button>
                </template>
              </el-table-column>
              <el-table-column label="上午">
                <el-table-column prop="zero" label="0" width="3.5%" />
                <el-table-column prop="one" label="1" width="3.5%" />
                <el-table-column prop="two" label="2" width="3.5%" />
                <el-table-column prop="three" label="3" width="3.5%" />
                <el-table-column prop="four" label="4" width="3.5%" />
                <el-table-column prop="five" label="5" width="3.5%" />
                <el-table-column prop="six" label="6" width="3.5%" />
                <el-table-column prop="seven" label="7" width="3.5%" />
                <el-table-column prop="eight" label="8" width="3.5%" />
                <el-table-column prop="nine" label="9" width="3.5%" />
                <el-table-column prop="ten" label="10" width="3.5%" />
                <el-table-column prop="eleven" label="11" width="3.5%" />
              </el-table-column>
              <el-table-column label="下午">
                <el-table-column prop="twelve" label="12" width="3.5%" />
                <el-table-column prop="thirteen" label="13" width="3.5%" />
                <el-table-column prop="fourteen" label="14" width="3.5%" />
                <el-table-column prop="fifteen" label="15" width="3.5%" />
                <el-table-column prop="sixteen" label="16" width="3.5%" />
                <el-table-column prop="seventeen" label="17" width="3.5%" />
                <el-table-column prop="eighteen" label="18" width="3.5%" />
                <el-table-column prop="nineteen" label="19" width="3.5%" />
                <el-table-column prop="twenty" label="20" width="3.5%" />
                <el-table-column prop="twentyone" label="21" width="3.5%" />
                <el-table-column prop="twentytwo" label="22" width="3.5%" />
                <el-table-column prop="twentythree" label="23" width="3.5%" />
              </el-table-column>
            </el-table>
            <div class="colorline">
              <div id="colorline"></div>
            </div>
          </div>

        </div>
      </el-card>
    </div>
		
		<div class="mingxibox">
			<el-dialog title="稼动率明细" v-model="spotcheckopen" width="50%">
				<div>
					<el-row>
						<el-col :span="12">
							<div class="tit">
								<div><span>设备：</span>{{eqParams.equipName}}</div>
								<div><span>总计：</span>{{totalcount}}分钟</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="tools">
								<el-radio-group v-model="radio4" size="medium" @change="statuschose">
									<el-radio-button label="运行"></el-radio-button>
									<el-radio-button label="断电"></el-radio-button>
									<el-radio-button label="停止"></el-radio-button>
									<el-radio-button label="告警"></el-radio-button>
								</el-radio-group>
							</div>
						</el-col>
					</el-row>
				</div>
				
				<el-table
						:data="persentList"
						stripe="true"
						border
						style="width: 100%"
						v-loading="loading"
						height="calc(100% - 72px)"
				>
					<el-table-column prop="startvalue" label="开始"/>
					<el-table-column prop="endvalue" label="结束"/>
					<el-table-column prop="name" label="状态"/>
					<el-table-column prop="durtime" label="时长(分钟)"/>
				</el-table>
			</el-dialog>
		</div>
  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {parseTime} from "@/utils/ruoyi";
import {getAllStatusPercent,getStatusPercentList,getDetailPercentList,getDetailPercentListByeqid} from "@/api/industry/statusPercent";
import {reactive} from "vue";
import {treeselect} from "@/api/system/dept";
export default {
  name: "稼动率",
  data() {
    return {
      color1: '#09bec5',
      percent1: '30',
      color2: '#3a99f2',
      percent2: '20',
      color3: '#33cf92',
      percent3: '37',
      color4: '#fdb002',
      percent4: '34',
      tableData: [],
      tableLength: '',
      date: '',
      dataList:[],
      dataList1:[],
      dataList2:[],
      dataList3:[],
      dataList4:[],
      dataList5:[],
      dataList6:[],
      detailList:[],
      equList: [],
      statusDetail:[],
      statusDetail1:[],
      persentList:[],
      oldpersentList:[],
      queryParams: {
        datess: '',
        equipId:'',
        deptId:'',
      },
      eqParams:{
        equipName:null,
        equipId:null,
        datess: '',
        status:'',
      },
      tablebiaotou:[],
      radio3: '今天',
      radio4: '',
      spotcheckopen:false,
      starttimeresult:null,
      totalcount:0,
      showSearch: false,
      deptOptions: [],
    }
  },

  props: {
    /** 模块ID */
    eId: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
  },

  watch: {
    eId(val) {
      if(this.eId!=null && this.eId!=undefined && this.eId!=''){
        this.queryParams.equipId = val;
      }
      this.getAllData();//整场稼动率
      this.getStatusList();//设备状态分布
      this.getdetail();
    },
  },
  created() {

  },

  mounted: function () {
    if(this.eId!=null && this.eId!=undefined && this.eId!=''){
      this.queryParams.equipId = this.eId;
    }
    this.getTreeselect();
    this.getAllData();//整场稼动率
    this.getStatusList();//设备状态分布
    this.getdetail();
  },

  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptId = '';
      this.handleQuery();
    },
     /** 节点单击事件 */
    handleQuery() {
      this.getAllData();//整场稼动率
      this.getStatusList();//设备状态分布
      this.getdetail();
    },
     /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        let data = response.data;
        if(data.length > 1 || typeof (data[0].children) !== 'undefined'){
          this.showSearch = true;
        }
        this.deptOptions = response.data;
      });
    },
    //运行状态筛选
    statuschose(val){
     let persentList2 = [];
      if(val == '运行'){
        this.radio4 = '运行';
        this.eqParams.status=1;
      }
      if(val == '断电'){
        this.radio4 = '断电';
        this.eqParams.status=0;
      }
      if(val == '停止'){
        this.radio4 = '停止';
        this.eqParams.status=2;
      }
      if(val == '告警'){
        this.radio4 = '告警';
        this.eqParams.status=3;
      }
      this.totalcount = 0;
      this.oldpersentList.forEach((j, index) => {
        if(j.sta==this.eqParams.status){
          persentList2.push({
            name: j.name,
            sta: j.sta,
            startvalue: j.startvalue,
            endvalue:j.endvalue,
            equname: j.equname,
            equid: j.equid,
            durtime:Number(j.durtime).toFixed(4)
          });
          this.totalcount = this.totalcount + j.durtime;
        }
      })
      this.totalcount = Number(this.totalcount).toFixed(4);
      this.persentList = persentList2;
    },

    //筛选时间确认
    ctimeonfirm1(val){
      this.radio3 = '';
      this.starttimeresult = this.timeFormat1(val);
      this.datePicker = false;
      this.queryParams.datess = this.starttimeresult

      this.getdetail(this.starttimeresult,this.timeFormat(val));
    },

    timeFormat(time) { // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + '/' + month + '/' + day;
    },

    timeFormat1(time) { // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + '-' + month + '-' + day;
    },

    timechose(date){
      this.queryParams.date='';
      var date1;
      var durdate;
      if(date == '今天'){
        this.radio3 = '今天';
        date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        date1 = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();

      }
      if(date == '昨天'){
        this.radio3 = '昨天';
        date = new Date();
        date.setDate(date.getDate() - 1);
        durdate = date;
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        date1 = durdate.getFullYear() + '/' + (durdate.getMonth() + 1) + '/' + durdate.getDate();
      }
      if(date == '前天'){
        this.radio3 = '前天';
        date = new Date();
        date.setDate(date.getDate() - 2);
        durdate = date;
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        date1 = durdate.getFullYear() + '/' + (durdate.getMonth() + 1) + '/' + durdate.getDate();
      }
      this.starttimeresult = date;
      this.getdetail(date,date1);
    },

    //  秒数转化为时分秒
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var h = date.getHours()<10 ? '0'+date.getHours() : date.getHours();
      var m = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes();
      var s = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
      return h+':'+m+':'+s;
    },

    getAllData(){
      getAllStatusPercent(this.queryParams).then(response => {
        this.dataList = response.data;
        this.percent1 = response.data.activationPercent;
        this.percent2 = response.data.activationPercent_yes;
        this.percent3 = response.data.activationPercent_nowweek;
        this.percent4 = response.data.activationPercent_lastweek;
      });
    },

    getStatusList() {
      getStatusPercentList(this.queryParams).then(response => {
        if(response.rows.length > 0){
          this.dataList1=response.rows;
          this.dataList2=[];
          this.dataList3=[];
          this.dataList4=[];
          this.dataList5=[];
          this.dataList6=[];
          this.dataList1.forEach((i, index) => {
            this.dataList2.push(i.date);
            this.dataList3.push(i.runPercent);
            this.dataList4.push(i.stopPercent);
            this.dataList5.push(i.outagePercent);
            this.dataList6.push(i.warnPercent);
          })
        }
        this.$nextTick(() => {
          this.echarts();
        })

      });
    },

    getdetail(date,date1){
      const chartDom = document.getElementById('colorline');
      chartDom.removeAttribute('_echarts_instance_');
      var myChart = echarts.init(chartDom);
      this.equList = [];
      this.statusDetail1 = [];
      this.tableData = [];
      if(date==null || date=='' || date==undefined){
        date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
        date1 = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();
      }
      this.queryParams.datess = date;
      getDetailPercentList(this.queryParams).then(response => {
        this.detailList = response.rows;
        this.tableLength = this.detailList.length;

        //图表高度
        document.getElementById('colorline').style.height = this.tableLength * 40 + 'px';


        this.detailList.forEach((i, index) => {
          this.tableData.push({
            id:i.equipId,
            name: i.equipName,
            percent: i.activationPercent+'%'
          });
          this.equList.push(i.equipId);

          if(i.statusDetail!=null){
            i.statusDetail.forEach((j, index) => {
              this.statusDetail1.push({
                name: j.statusName,
                sta: j.status,
                startvalue: j.date,
                equname: j.equipName,
                equid: j.equipId
              });
            })
          }
        })

        this.$nextTick(() => {
          this.colorline(date,date1);
        })
      });
    },

    detailInfo(row){
      this.persentList=[];
      this.oldpersentList=[];
      this.radio4='';
      this.eqParams.equipName = row.name;
      this.eqParams.equipId = row.id;
      if(this.starttimeresult==null || this.starttimeresult==''){
        this.starttimeresult = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
      }
      this.eqParams.datess = this.starttimeresult;
      let today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
      let nowdatetime = new Date().getTime().toString().substring(0,10);//当前时间时间戳
      let nowdaytime = +Math.round((+new Date(+new Date(new Date(this.starttimeresult).toLocaleDateString()) + 24 * 60 * 60 * 1000 - 1)).toString().substring(0,10));//当天23点59分59秒时间戳
      let tempersentList=[];
      let dur = 0;
      this.totalcount = 0;
      getDetailPercentListByeqid(this.eqParams).then(response => {
        tempersentList = response.rows;
        if(tempersentList.length>0){
          tempersentList[0].statusDetail.forEach((j, index) => {
            if(this.eqParams.datess == today){
              dur = tempersentList[0].statusDetail[index+1]==null ? (nowdatetime - j.date) * 0.0166667 : (tempersentList[0].statusDetail[index+1].date - j.date) * 0.0166667;
              this.persentList.push({
                name: j.statusName,
                sta: j.status,
                startvalue: this.timestampToTime(j.date),
                endvalue:tempersentList[0].statusDetail[index+1]==null ? this.timestampToTime(nowdatetime) : this.timestampToTime(tempersentList[0].statusDetail[index+1].date),
                equname: j.equipName,
                equid: j.equipId,
                durtime:Number(dur.toFixed(4))
              });
            }else{
              dur = tempersentList[0].statusDetail[index+1]==null ? (nowdaytime - j.date) * 0.0166667 : (tempersentList[0].statusDetail[index+1].date - j.date) * 0.0166667;
              this.persentList.push({
                name: j.statusName,
                sta: j.status,
                startvalue: this.timestampToTime(j.date),
                endvalue:tempersentList[0].statusDetail[index+1]==null ? this.timestampToTime(nowdaytime) : this.timestampToTime(tempersentList[0].statusDetail[index+1].date),
                equname: j.equipName,
                equid: j.equipId,
                durtime:Number(dur.toFixed(4))
              });
            }

            this.totalcount = this.totalcount + dur;
          })
        }
        this.totalcount = Number(this.totalcount).toFixed(4);
        this.oldpersentList = this.persentList;
        this.spotcheckopen = true;
      });
    },

    echarts() {
      const chartDom = document.getElementById('echarts');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            var html = params[0].name + "<br>";
            // params[i].marker：对应数据的圆点样式
            for (var i = 0; i < params.length; i++) {
              html += params[i].marker + params[i].seriesName + ":" + params[i].value + '%'+ "<br>";
            }
            return html;
          }
        },
        barWidth: 15,
        color: ['#f39800','#b5b5b5', '#22ac38', '#d9031e'],
        legend: {
          icon: "circle",
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 20,
          right:0,
          top: '15px',
          textStyle: {
            fontSize: 12
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.dataList2
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel:{
              formatter: "{value}%",
            },
          }
        ],
        series: [
          {
            name: '闲置',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.dataList4
          },
          {
            name: '断电',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.dataList5
          },
          {
            name: '加工',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.dataList3
          },
          {
            name: '警示',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.dataList6
          }
        ]
      };

      option && myChart.setOption(option);
    },
    colorline(date,date1) {
      const chartDom = document.getElementById('colorline');
      chartDom.removeAttribute('_echarts_instance_');
      var myChart = echarts.init(chartDom);
      var option;
      var list = this.statusDetail1;
      var data = [];
      var categories = [];
      let localeDate = date1;
      let aaa = (+new Date(new Date(localeDate).getTime())).toString().substring(0,10);
      let endTime = Math.round((+new Date(+new Date(new Date(localeDate).toLocaleDateString()) + 24 * 60 * 60 * 1000 - 1)).toString().substring(0,10));
      var startTime = Math.round(aaa);
      var baseTime;
      categories = this.equList;
      var types = [
        { name: '加工', color: '#22ac38' },
        { name: '闲置', color: '#f39800' },
        { name: '离线', color: '#b5b5b5' },
        { name: '警示', color: '#d9031e' }
      ];
      // Generate mock data
      categories.forEach(function (category, index) {
        baseTime = startTime;
        var typeI = 0;
        var typename = "断电";
        for(let yx of list){
          if(category==yx.equid){
            var startvalue = Math.round(yx.startvalue);
            var typeItem_color
            var duration = Math.round(startvalue-baseTime);
            if(typeI=='1'){
              typeItem_color = '#22ac38';
            }
            if(typeI=='0'){
              typeItem_color = '#b5b5b5';
            }
            if(typeI=='2'){
              typeItem_color = '#f39800';
            }
            if(typeI=='3'){
              typeItem_color = '#d9031e';
            }
            data.push({
              name: typename,
              //baseTime应该固定不变，为查询时间的00:00:00
              value: [(categories.length-index-1), baseTime,  (baseTime += duration), duration],
              // value: [index, baseTime, (baseTime += duration), duration],

              itemStyle: {
                normal: {
                  color: typeItem_color
                }
              }
            });
          }
          if(startvalue!=undefined && startvalue!=null){
            typeI = yx.sta;
            typename = yx.name;
          }
        }

        //增加一个结束data
        if(date == new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()){//今天
          data.push({
            name: '',
            //baseTime应该固定不变，为查询时间的00:00:00
            value: [(categories.length-index-1), baseTime,  endTime, (endTime - baseTime)],
            // value: [index, baseTime, (baseTime += duration), duration],

            itemStyle: {
              normal: {
                color: 'transparent'
              }
            }
          });
        }else{
          data.push({
            name: '断电',
            //baseTime应该固定不变，为查询时间的00:00:00
            value: [(categories.length-index-1), baseTime,  endTime, (endTime - baseTime)],
            // value: [index, baseTime, (baseTime += duration), duration],

            itemStyle: {
              normal: {
                color: '#b5b5b5'
              }
            }
          });
        }
      });
      let renderitemNum=0 // 测试循环次数计数，可进行删除
      function renderItem(params, api) {
        renderitemNum+=1
        var categoryIndex = api.value(0);
        var start = api.coord([api.value(1), categoryIndex]);
        var end = api.coord([api.value(2), categoryIndex]);
        var height = api.size([0, 1])[1] * 0.6;
        var rectShape = echarts.graphic.clipRectByRect(
            {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
            },
            {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            }
        );
        return (
            rectShape && {
              type: 'rect',
              transition: ['shape'],
              shape: rectShape,
              style: api.style()
            }
        );
      }
      option = {
        tooltip: {
          formatter: function (params) {
            return params.marker + params.name;
          }
        },
        grid: {
          top: '0',
          right: '0',
          left: '0',
          bottom: '0'
        },
        xAxis: {
          min: startTime,
          max:endTime,
          axisLabel: {
            show: true,
          }
        },
        yAxis: {
          data: categories,
          axisTick:{
            show:false // 不显示坐标轴刻度线
          },
          axisLine: {
            show: false, // 不显示坐标轴线
          },
          axisLabel: {
            show: false, // 不显示坐标轴上的文字
          },
          splitLine:{
            show:false // 不显示网格线
          },
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            name:'关',
            itemStyle: {

            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: data
          },
          {
            type: 'custom',
            name:'开',
          }
        ]
      };

      option && myChart.setOption(option);
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('industry/statusPercent/export', {
        ...this.queryParams
      }, `设备稼动率${this.timeFormat1(new Date())}.xlsx`)
    },
  },


}
</script>


<style scoped lang="scss">
.jiadonglv {
  background: #f1f1f1;
  height: calc(100vh - 84px);
  padding: 10px;
  :deep(.el-row) {height: 100%;}
  :deep(.el-col) {height: 100%;}
  .box-card{
    padding: 15px;
    .card-header{
      padding-left: 10px;border-left: 5px solid #09bec5;
      line-height: 1;
    }
    .prog1 :deep(path:first-child) {
      stroke: #cef2f3;
    }
    .prog2 :deep(path:first-child) {
      stroke: #d8ebfc;
    }
    .prog3 :deep(path:first-child) {
      stroke: #d6f5e9;
    }
    .prog4 :deep(path:first-child) {
      stroke: #ffefcc;
    }
    .progress{
      text-align: center;height: 100%;
      h5{font-size: 14px;margin: 15px 0 0;}
      transform: translate(0, 15%);
      padding: 0 30px;
    }
    .echarts{
      height: calc(100% - 16px);
    }
  }
  .topbox{
    height: 36%;
  }
  :deep(.el-card) {
    height: 100%;
    .el-card__header{
      padding: 0 0 15px;
    }
    .el-card__body{
      height: calc(100% - 16px);padding: 0;
    }
  }
  .botbox{
    height: calc(64% - 10px);
    margin: 10px 0 0;
    :deep(.el-card .el-card__body) {
      height: calc(100% - 48px);
    }
  }
  .tools{
    margin: 12px 0;text-align: right;
    .daypick{
      margin: 0 10px;display: inline-block;vertical-align: middle;
      width: 140px;
      :deep(.el-input) {
        width: 100%;
        .el-input__inner{padding-right: 10px;}
      }
    }
  }
  .table{
    position: relative;
    height:calc(100% - 40px);
    .scroll{
      position: relative;z-index: 1;
      height: 100%;overflow-y: auto;
    }
    .scroll::-webkit-scrollbar{
      width: 5px;
    }
    .scroll::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: rgba(0,0,0,0.2);
    }
    .scroll::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);
    }
    #tablezhanwei{
      position: absolute;
      left: 0;top: 0;z-index: 2;
      :deep(.el-table__body-wrapper) {
        display: none;
      }
    }
    :deep(.el-table) {
      .el-table__empty-block{
        width:100% !important
      }
      .el-table__header{
        width: 100% !important;
      }
      .el-table__body{
        width: 100% !important;
      }
      th.el-table__cell{
        background: #09bec5 !important;
        color: #fff;
        text-align: center;
        height:35px !important;padding:3px 0;
      }
      .is-group tr:last-child th.el-table__cell{
        background: #fff !important;
        color: #09bec5;
      }
      .cell{
        text-align: center;padding:0;
      }
      .el-table__body tr.el-table__row--striped td.el-table__cell{
        background: #f6fcfc;
      }
      .el-table--border, .el-table--group {
        border: 2px solid #dff3f5!important;
      }
    }
    .colorline{
      position: absolute;
      right: 0;top: 70px;
      height: calc(100% - 80px);
      width: 81.8%;
      // background: #000;
      z-index: 9;
      pointer-events: none;
      //overflow-y: auto;
      #colorline{height: 100%;}
    }
  }
  .btn{
    height: auto;border: 0;padding: 0;color: #09bec5;
  }


  .dianjian{
    padding: 10px;
    background: #f3f3f3;
    height: calc(100vh - 84px);

    .box-card{
      .seachform{
        .checkbtn{
          background: #09bec5;padding: 0 15px;border: 0;color: #fff;
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
	.mingxibox{
		
		:deep(.el-dialog) {
			height: 88vh;
			.el-dialog__body{
				padding: 15px;
				height: calc(100% - 50px);
			}
		}
		.tit{
			font-size: 14px;
			span{font-weight: bold;}
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
	}
}

</style>




