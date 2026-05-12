<template>
    <div class="dp-con container">
        <div class="dp-head">
            <div class="time fl">
                <span class="demonstration">起止时间</span>
                <el-date-picker
                    v-model="value2"
                    type="datetimerange"
                    @change="gettime"
                    :default-time="defaultTime2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    align="right">
                </el-date-picker>
              <!--                    value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              <el-date-picker-->
<!--                  v-model="value2"-->
<!--                  type="daterange"-->
<!--                  unlink-panels-->
<!--                  range-separator="To"-->
<!--                  start-placeholder="Start date"-->
<!--                  end-placeholder="End date"-->
<!--                  :shortcuts="shortcuts"-->
<!--              />-->
            </div>
            <div class="sel fl">
                <span class="demonstration">姓名</span>
                <el-select v-model="value" filterable placeholder="请选择" @change="getperson">
                    <el-option
                        v-for="item in personlist"
                        :key="item.tuId"
                        :label="item.tuUsername"
                        :value="item.tuId">
                    </el-option>
                </el-select>
            </div>
            <div class="anniu fl">
                <el-button type="primary" @click="refer">确定</el-button>
            </div>
        </div>

        <div class="dp-nr">
            <div class="echart_bottom" >
                <LineMarker
                    ref="tubiao"
                    width="100%"
                    height="700px"></LineMarker>
            </div>

        </div>
    </div>
</template>


<script>
// import {getList,getTempList} from "@/api/table";
import { listTempuser } from "@/api/temperature/tempuser"
import { listTemperature } from "@/api/temperature/temperature"
import LineMarker from "@/components/Charts/LineMarker";
export default {
    name: "compare",
    data() {
        return {
            // 时间选择
              shortcuts: [
                {
                  text: '近一周',
                  value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    return [start, end]
                  },
                },
                {
                  text: '近一个月',
                  value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    return [start, end]
                  },
                },
                {
                  text: '近三个月',
                  value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    return [start, end]
                  },
                },
              ],
            value2: '',
            defaultTime2:[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 2, 1, 23, 59, 59),
            ],
            // 时间选择end
            // select下拉
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }],
            value: '',
            personlist:[],
            // select下拉end
            queryParams: {
                pageNum: 1,
                pageSize: 1500,
                tUid: '',
                endTime: "",
                beginTime: ""
            },
          videoOption: {}
        };
    },
    components: {LineMarker},
    mounted() {
        this.getpersonlist()
    },
    methods:{


        tubiao(){
            console.log(this.queryParams)
            let _this = this;
            listTemperature(_this.queryParams).then(res => {
                let xzData = [];
                let wxzData = [];
                let xData = [];

                if(res.total > 0) {
                  console.log(111)
                    let datas = res.rows;
                    for (let key in datas) {
                        xData.push(datas[key]['createTime']);

                        xzData.push(datas[key]['tXzWendu'].toFixed(1))
                        wxzData.push(datas[key]['tWendu'])
                    }
                }
              let option = {
                // tooltip: {
                //   trigger: 'axis'
                // },
                tooltip: {
                  trigger: 'axis',
                  // axisPointer: {
                  //   type: 'shadow'
                  // }
                },
                legend: {
                  data: ['未修正数据', '已修正数据']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: xData
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value} °C'
                  },
                  max: 40,
                  min: 20
                },
                series: [
                  {
                    name: '未修正数据',
                    type: 'line',
                    data: wxzData,
                    itemStyle: {
                      normal: {
                        color: '#01c8db', //折点颜色
                        lineStyle: {
                          color: '#01c8db' //折线颜色
                        }
                      }
                    },
                  },
                  {
                    name: '已修正数据',
                    type: 'line',
                    data: xzData,
                    itemStyle: {
                      normal: {
                        color: '#b17ab3', //折点颜色
                        lineStyle: {
                          color: '#b17ab3' //折线颜色
                        }
                      }
                    },
                  }
                ]
              };

              _this.$refs[`tubiao`].chart.setOption(option)
            }).catch((err) => {
                console.log(err);
            })
        },
        getpersonlist(){

          listTempuser().then(res => {
                this.personlist=res.rows;
            })
        },
        getperson(value){
            this.queryParams.tUid = value
        },
        gettime(val){
            this.queryParams.beginTime = val[0]
            this.queryParams.endTime = val[1]
          console.log(this.queryParams)
        },
        refer(){
            if(this.queryParams.tUid == "" || this.queryParams.beginTime == ""){
                this.$message({
                    type: 'error',
                    message: `请选择起始日期及人员！`
                });
            }else {
                this.tubiao()
            }
        }
    },


}
</script>

<style lang="scss" scoped>
p {
    margin: 0;
    padding: 0;
}

h4 {
    margin: 0;
    padding: 0;
}

.container {
    //width: 1200px;
    //margin: 0 auto;
    padding:15px;
}

.fl {
    float: left;
}

.fr {
    float: right;
}

.text-right {
    text-align: right;
}

.row::before, .row::after {
    display: table;
    clear: both;
    content: '';
}
.dp-con{
    height: 100%;
    .dp-head{
        height: 60px;
        padding: 10px;
        margin-bottom: 10px;
        .time{
            padding-right: 20px;
            .demonstration{
                padding-right: 10px;
            }
        }
        .sel{
            padding-right: 20px;
        }
        .anniu{

        }
    }
    .dp-nr{
        height: calc(100vh - 184px);
        .echart_bottom{
            height: 100%;
        }
    }
}



</style>
