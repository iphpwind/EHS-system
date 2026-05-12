<template>
  <div class="yinhuantongji">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="部门" prop="deptIdss">
        <el-select
          ref="selectTree"
          v-model="valueName"
          :value="valueMultiple"
          multiple
          clearable
          @remove-tag="changeValue"
          @clear="clearHandle"
          placeholder="请选择"
        >
          <el-option :value="valueName" style="height: auto; background: #fff">
            <el-tree
              show-checkbox
              :data="deptOptions"
              ref="deptRef"
              node-key="id"
              id="tree-option"
              default-expand-all
              :props="{ label: 'label', children: 'children' }"
              check-strictly="true"
              @check-change="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="时间范围" prop="daterange">
				<el-date-picker v-model="daterange" type="daterange" align="right" unlink-panels range-separator="至"
					start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
					value-format="YYYY-MM-DD">
				</el-date-picker>
			</el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="floor">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-card :body-style="{ padding: '10px' }">
            <div class="clearfix header">
              <span class="card-tit">排查任务完成情况</span>
              <div class="gailan-right">
                <el-button
                  class="btn changeCharBtn"
                  :type="selectlast"
                  @click="changeChar(1)"
                  >上月</el-button
                >
                <el-button
                  class="btn changeCharBtn"
                  :type="selecttoday"
                  @click="changeChar(2)"
                  >本周</el-button
                >
                <el-button
                  class="btn changeCharBtn"
                  :type="selectweek"
                  @click="changeChar(3)"
                  >本月</el-button
                >
              </div>
            </div>
            <div class="wanchengqk">
              <ul>
                <li>
                  <img src="@/assets/images/scyftj-ico1.png" />
                  <h5>应排查</h5>
                  <span class="blue">{{ task.total }}</span>
                </li>
                <li>
                  <img src="@/assets/images/scyftj-ico2.png" />
                  <h5>已排查</h5>
                  <span class="green">{{ task.finish }}</span>
                </li>
                <li>
                  <img src="@/assets/images/scyftj-ico3.png" />
                  <h5>超期未排查</h5>
                  <span class="orange">{{ task.ot }}</span>
                </li>
                <li>
                  <img src="@/assets/images/scyftj-ico4.png" />
                  <h5>排查异常</h5>
                  <span class="red">{{ task.abn }}</span>
                </li>
                <li>
                  <img src="@/assets/images/scyftj-ico5.png" />
                  <h5>排查完成率</h5>
                  <span class="purple">{{ task.ratio }}</span>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '10px' }">
            <div class="clearfix header">
              <span class="card-tit">排查任务完成情况</span>
            </div>
            <div class="wanchengqk" id="echart1"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="floor">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-card :body-style="{ padding: '10px' }">
            <div class="clearfix header">
              <span class="card-tit">隐患治理情况</span>
              <div class="gailan-right">
                <el-button
                  class="btn changeCharBtn"
                  :type="selectlast2"
                  @click="changeChar2(1)"
                  >上月</el-button
                >
                <el-button
                  class="btn changeCharBtn"
                  :type="selecttoday2"
                  @click="changeChar2(2)"
                  >本周</el-button
                >
                <el-button
                  class="btn changeCharBtn"
                  :type="selectweek2"
                  @click="changeChar2(3)"
                  >本月</el-button
                >
              </div>
            </div>
            <div class="wanchengqk yinhuanzhili">
              <ul>
                <li>
                  <h5>存量隐患</h5>
                  <span>{{ hazdra.total }}</span>
                </li>
                <li>
                  <h5>新增隐患</h5>
                  <span>{{ hazdra.newTotal }}</span>
                </li>
                <li>
                  <h5>待整改</h5>
                  <span>{{ hazdra.tbr }}</span>
                </li>
                <li>
                  <h5>整改中</h5>
                  <span>{{ hazdra.ur }}</span>
                </li>
                <li>
                  <h5>超期未整改</h5>
                  <span>{{ hazdra.ot }}</span>
                </li>
                <li>
                  <h5>待验收</h5>
                  <span>{{ hazdra.tba }}</span>
                </li>
                <li>
                  <h5>验收完成</h5>
                  <span>{{ hazdra.caa }}</span>
                </li>
                <li>
                  <h5>隐患整改完成率</h5>
                  <span>{{ hazdra.ratio }}</span>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '10px' }">
            <div class="clearfix header">
              <span class="card-tit">隐患增长情况（原近七天隐患）</span>
            </div>
            <div class="wanchengqk" id="echart2"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="floor">
      <el-row :gutter="10">
        <el-col :span="16">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">隐患类型</span>
                </div>
                <div class="wanchengqk" id="echart3"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">隐患来源</span>
                </div>
                <div class="wanchengqk" id="echart4"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">隐患等级</span>
                </div>
                <div class="wanchengqk" id="echart5"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '10px' }">
            <div class="clearfix header">
              <span class="card-tit">隐患整改率</span>
            </div>
            <div class="wanchengqk" id="echart6"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {
  getSafeInvestigateTaskData,
  getSafeInvestigateTaskDataNew,
  getLast7DaysSafeInvestigateTaskData,
  getSafeHazardReportData,
  getLast7DaysSafeHazardReportData,
  getSafeHazardReportDataByType,
  getHazardReportDataBySourceForEchart,
  getHazardReportDataByLevelForEchart,
} from "@/api/system/safework/index";
import { treeselect, listDept } from "@/api/system/dept";
export default {
  name: "隐患统计",
  data() {
    return {
      showSearch: true,
      deptOptions: null,
      valueName: null,
      valueMultiple: null,
      daterange: null,
      choosedValue: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },

      queryParams: {
        deptIdss: null,
        // daterange: null,
        // startDateStr: '',
        // endDateStr: ''
      },
      selectlast: "",
      selecttoday: "success",
      selectweek: "",
      charType: 1,
      selectlast2: "",
      selecttoday2: "success",
      selectweek2: "",
      charType2: 1,
      yhtypedata: [
        { value: 1048, name: "专业性排查" },
        { value: 735, name: "综合性排查" },
        { value: 580, name: "日常排查" },
        { value: 484, name: "季节性排查" },
      ],
      yhlydata: [
        { value: 1048, name: "其他" },
        { value: 735, name: "管理" },
        { value: 580, name: "管路" },
        { value: 484, name: "消防" },
        { value: 300, name: "电气" },
        { value: 300, name: "仪表" },
        { value: 300, name: "设备" },
        { value: 300, name: "建构基础" },
        { value: 300, name: "安全" },
        { value: 300, name: "工艺" },
      ],
      dengjidata: [
        { value: 1048, name: "未评估" },
        { value: 735, name: "一般隐患" },
        { value: 580, name: "重大隐患" },
      ],
      task: {
        total: 0,
        finish: 0,
        ot: 0,
        abn: 0,
        ratio: 0,
      },
      hazdra: {
        total: 0,
        newTotal: 0,
        tbr: 0,
        ur: 0,
        ot: 0,
        tba: 0,
        caa: 0,
        ratio: 0,
      },
      tabActive: "week",
      tabActive2: "week",
      last7DaysTaskData: {
        dtList: [],
        finish: [],
        total: [],
      },
      last7DaysHazardData: {
        dtList: [],
        totalList: [],
        caaList: [],
      },
    };
  },

  watch: {},
  created() {},

  mounted: function() {
    this.getTreeselect();
    this.getSafeInvestigateTaskData();
    this.getSafeHazardReportData();
    this.getSafeHazardReportDataByType();
    this.getLast7DaysSafeInvestigateTaskData();
    this.getLast7DaysSafeHazardReportData();
    this.getHazardReportDataBySourceForEchart();
    this.getHazardReportDataByLevelForEchart();
  },

  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    handleNodeClick(node, checked) {
      if (checked) {
        // if (node.children == null || node.children == undefined) {
        let num = 0;
        this.valueName.forEach((item) => {
          item == node["label"] ? num++ : num;
        });
        if (num == 0) {
          this.valueName.push(node["label"]);
          this.choosedValue.push(node["id"]);
          this.choosedValue = [...new Set(this.choosedValue)];
          this.valueName = [...new Set(this.valueName)];
        }
        // }
      } else {
        // if (node.children == null || node.children == undefined) {
        this.valueName.map((item, index) => {
          if (node.label == item) {
            this.valueName.splice(index, 1);
          }
        });
        this.choosedValue.map((item, index) => {
          if (node.id == item) {
            this.choosedValue.splice(index, 1);
          }
        });
        // }
      }
    },
    // 删除单个标签
    changeValue(val) {
      const a = this.findItemByName(this.deptOptions, val);
      console.log(a);
      this.choosedValue.forEach((item, index) => {
        if (item == a.id) {
          this.choosedValue.splice(index, 1);
        }
      });
      let newvalue = [];
      if (this.choosedValue.length > 0) {
        this.choosedValue.forEach((item, index) => {
          newvalue.push(parseInt(item));
        });
      }
      console.log(newvalue);
      this.deptRef.setCheckedKeys(newvalue);
      // deptRef.value.setCheckedKeys([parseInt(332),333]);
    },

    // 递归找到符合的元素
    findItemByName(items, targetName) {
      for (let i = 0; i < items.length; i++) {
        const currentItem = items[i];
        if (currentItem.label === targetName) {
          return currentItem;
        }

        if (currentItem.children) {
          const foundItem = this.findItemByName(
            currentItem.children,
            targetName
          );
          if (foundItem) {
            return foundItem;
          }
        }
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      let newvalue = [];
      this.queryParams.deptIdss = "";
      if (this.choosedValue.length > 0) {
        this.choosedValue.forEach((item, index) => {
          newvalue.push(parseInt(item));
        });
        this.queryParams.deptIdss = newvalue.join(",");
      }
      // if (this.daterange.length > 0) {
      // 	this.queryParams.endDateStr = this.daterange[1];
      // 	this.queryParams.startDateStr = this.daterange[0];
      // }

      console.log(this.queryParams);

      this.getSafeInvestigateTaskDataNew(this.queryParams);
      this.getSafeHazardReportData();
      this.getSafeHazardReportDataByType();
      this.getLast7DaysSafeInvestigateTaskData();
      this.getLast7DaysSafeHazardReportData();
      this.getHazardReportDataBySourceForEchart();
      this.getHazardReportDataByLevelForEchart();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryRef.resetFields();
      this.clearHandle();
      this.handleQuery();
    },

    // 清空所有标签
    clearHandle() {
      this.valueName = [];
      this.mychecked = false;
      this.allchecked = false;
      this.choosedValue = [];
      //this.clearSelected();
    },

    clearSelected() {
      this.$refs.tree.setCheckedKeys([]);
    },
    getSafeInvestigateTaskData() {
      getSafeInvestigateTaskData(this.tabActive).then((response) => {
        this.task = response.data;
      });
    },
    // 时间获取
    getSafeInvestigateTaskDataNew(param) {
      getSafeInvestigateTaskDataNew(param).then((response) => {
        this.task = response.data;
      });
    },

    getSafeHazardReportData() {
      getSafeHazardReportData(this.tabActive2, this.queryParams).then(
        (response) => {
          this.hazdra = response.data;
        }
      );
    },
    getSafeHazardReportDataByType() {
      this.yhlydata = [];
      getSafeHazardReportDataByType(this.queryParams).then((response) => {
        for (let item of response.data) {
          var arr = {
            value: item.ratio,
            name: item.troubleTypeName == null ? "other" : item.troubleTypeName,
          };
          this.yhlydata.push(arr);
        }
        this.echartThree();
      });
    },
    getLast7DaysSafeInvestigateTaskData() {
      getLast7DaysSafeInvestigateTaskData(this.queryParams).then((response) => {
        this.last7DaysTaskData = response.data;
        this.echartOne();
      });
    },
    getLast7DaysSafeHazardReportData() {
      getLast7DaysSafeHazardReportData(this.queryParams).then((response) => {
        this.last7DaysHazardData = response.data;
        this.echartTwo();
        this.echartSix();
      });
    },
    getHazardReportDataBySourceForEchart() {
      this.yhtypedata = [];
      getHazardReportDataBySourceForEchart(this.queryParams).then(
        (response) => {
          for (let item of response.data) {
            var arr = { value: item.num, name: item.name };
            this.yhtypedata.push(arr);
          }
          this.echartFour();
        }
      );
    },
    getHazardReportDataByLevelForEchart() {
      this.dengjidata = [];
      getHazardReportDataByLevelForEchart(this.queryParams).then((response) => {
        for (let item of response.data) {
          var arr = { value: item.num, name: item.name };
          this.dengjidata.push(arr);
        }
        this.echartFive();
      });
    },
    changeChar(type) {
      this.charType = type;
      if (this.charType === 1) {
        this.selectlast = "success";
        this.selecttoday = "";
        this.selectweek = "";
        this.tabActive = "lastMonth";
      } else if (this.charType === 2) {
        this.selectlast = "";
        this.selecttoday = "success";
        this.selectweek = "";
        this.tabActive = "week";
      } else {
        this.selectlast = "";
        this.selecttoday = "";
        this.selectweek = "success";
        this.tabActive = "currMonth";
      }
      this.getSafeInvestigateTaskData();
    },
    changeChar2(type) {
      this.charType2 = type;
      if (this.charType2 === 1) {
        this.selectlast2 = "success";
        this.selecttoday2 = "";
        this.selectweek2 = "";
        this.tabActive2 = "lastMonth";
      } else if (this.charType2 === 2) {
        this.selectlast2 = "";
        this.selecttoday2 = "success";
        this.selectweek2 = "";
        this.tabActive2 = "week";
      } else {
        this.selectlast2 = "";
        this.selecttoday2 = "";
        this.selectweek2 = "success";
        this.tabActive2 = "currMonth";
      }
      this.getSafeHazardReportData();
    },
    echartOne() {
      let chartDom = document.getElementById("echart1");
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        grid: {
          top: "18%",
          bottom: "15%",
          left: "12%",
          right: "5%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            crossStyle: {
              color: "#999",
            },
          },
        },
        color: ["#00a1e9"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.last7DaysTaskData.dtList,
        },
        yAxis: {
          type: "value",
          name: "单位：个",
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            data: this.last7DaysTaskData.total,
            type: "line",
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#00a1e9", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(0,161,233,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            symbol: "circle",
            symbolSize: 6,
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2,
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    echartTwo() {
      let chartDom = document.getElementById("echart2");
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        grid: {
          top: "18%",
          bottom: "15%",
          left: "12%",
          right: "5%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            crossStyle: {
              color: "#999",
            },
          },
        },
        color: ["#35e0d7"],
        xAxis: {
          type: "category",
          data: this.last7DaysHazardData.dtList,
        },
        yAxis: {
          type: "value",
          name: "单位：个",
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            data: this.last7DaysHazardData.totalList,
            type: "bar",
            itemStyle: {
              borderRadius: [20, 20, 0, 0],
            },
            barWidth: 15,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    echartThree() {
      let chartDom = document.getElementById("echart3");
      let myChart = echarts.init(chartDom);
      let option;
      let that = this;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          right: "1%",
          orient: "vertical",
          itemGap: 6,
          itemWidth: 10,
          icon: "circle",
          formatter: function(name) {
            var total = 0; // 用于计算总数
            var target; // 遍历拿到数据
            for (var i = 0; i < that.yhlydata.length; i++) {
              total += that.yhlydata[i].value;
              //console.log(total);
              if (that.yhlydata[i].name == name) {
                target = that.yhlydata[i].value;
              }
            }
            return name + "(" + `${target}` + ")";
          },
        },
        color: [
          "#4381e6",
          "#9733cb",
          "#c722a5",
          "#2159d0",
          "#24a4eb",
          "#ffb400",
          "#90ed7b",
          "#e24c4b",
          "#23cdda",
          "#30ab36",
        ],
        series: [
          {
            //name: 'Access From',
            type: "pie",
            radius: ["35%", "60%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.yhlydata,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    echartFour() {
      let chartDom = document.getElementById("echart4");
      let myChart = echarts.init(chartDom);
      let option;
      let imgSrc = "../../src/assets/images/scyftj-piebg.png";
      let that = this;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "0%",
          left: "center",
          itemHeight: 6,
          itemWidth: 15,
          formatter: function(name) {
            var total = 0; // 用于计算总数
            var target; // 遍历拿到数据
            for (var i = 0; i < that.yhtypedata.length; i++) {
              total += that.yhtypedata[i].value;
              //console.log(total);
              if (that.yhtypedata[i].name == name) {
                target = that.yhtypedata[i].value;
              }
            }
            return name + " : " + `${target}`;
          },
        },
        color: ["#f49545", "#91ed7e", "#11b9f8", "#ffc600"],
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: imgSrc,
                width: 80,
                height: 80,
              },
              left: "center",
              top: "middle",
              bounding: "raw",
            },
          ],
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.yhtypedata,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    echartFive() {
      let chartDom = document.getElementById("echart5");
      let myChart = echarts.init(chartDom);
      let option;
      let that = this;

      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "25%",
          right: "1%",
          orient: "vertical",
          itemGap: 6,
          itemWidth: 10,
          icon: "circle",
          formatter: function(name) {
            var total = 0; // 用于计算总数
            var target; // 遍历拿到数据
            for (var i = 0; i < that.dengjidata.length; i++) {
              total += that.dengjidata[i].value;
              console.log(total);
              if (that.dengjidata[i].name == name) {
                target = that.dengjidata[i].value;
              }
            }
            return name + "(" + `${target}` + ")";
          },
        },
        color: ["#25cbdb", "#25a4eb", "#9dccf8"],
        series: [
          {
            type: "pie",
            radius: ["0%", "60%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: this.dengjidata,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    echartSix() {
      let chartDom = document.getElementById("echart6");
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        grid: {
          top: "18%",
          bottom: "15%",
          left: "12%",
          right: "5%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            crossStyle: {
              color: "#999",
            },
          },
        },
        color: ["#f59701"],
        smooth: true,
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.last7DaysHazardData.dtList,
        },
        yAxis: {
          type: "value",
          name: "单位：个",
          axisLine: {
            show: true,
          },
        },
        series: [
          {
            data: this.last7DaysHazardData.caaList,
            type: "line",
            symbol: "circle",
            symbolSize: 6,
            smooth: true,
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2,
              color: "#91c11d",
            },
            lineStyle: {
              color: "#f59701",
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.yinhuantongji {
  background: #f3f3f4;
  padding: 10px;
  background-size: cover;
  height: calc(100vh - 84px);

  .floor {
    height: calc(33.3% - 10px);
    margin: 0 0 10px;

    :deep(.el-row) {
      height: 100%;

      .el-col {
        height: 100%;
      }
    }

    .header {
      padding: 0 0 10px;
      border-bottom: 1px solid #f0f0f0;
    }

    :deep(.el-card) {
      height: 100%;

      .el-card__body {
        height: 100%;
      }
    }

    .card-tit {
      padding-left: 10px;
      border-left: 5px solid #09bec5;
      font-size: 18px;
    }

    .gailan-right {
      display: inline-block;
      float: right;

      //显示时按钮样式
      .el-button:hover {
        background: transparent !important;
        color: #09bec5 !important;
      }

      .el-button--success {
        //需要更改的按钮类型
        color: #09bec5 !important;
        background: transparent !important;
      }

      //移入时按钮样式
      .el-button--success:hover {
        background: transparent !important;
      }

      .btn {
        border: 0;
        padding: 0 5px;
        height: 24px;
      }

      .active {
        color: #fff;
        background: #09bec5;
      }
    }

    .wanchengqk {
      height: calc(100% - 25px);
      position: relative;

      ul::before,
      ul::after {
        content: "";
        clear: both;
        display: table;
      }

      ul {
        list-style: none;
        width: 100%;
        margin: 0;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);

        li {
          width: 20%;
          float: left;
          text-align: center;

          img {
            width: 65px;
          }

          h5 {
            font-size: 16px;
            color: #555;
            margin: 10px 0;
          }

          span {
            display: block;
            font-size: 40px;
            font-weight: bold;
            transform: scale(0.8, 1);
          }

          span.blue {
            color: #51bdff;
          }

          span.green {
            color: #60cd7b;
          }

          span.orange {
            color: #ffb400;
          }

          span.red {
            color: #e9664b;
          }

          span.purple {
            color: #8881f0;
          }
        }
      }
    }

    .yinhuanzhili {
      ul {
        li {
          width: 25%;
          text-align: left;

          span {
            transform-origin: 0 50%;
          }
        }
      }
    }
  }

  #echart3 {
  }

  #echart4 {
    margin-top: -10%;
    // height: 110%;
  }
}
</style>
