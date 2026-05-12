<template>
    <div class="index">
        <div class="index-head">
         <div class="head-top">
            <el-row class="container">
                <el-col :sm="16" :md="16" :lg="16" :xl="16">
                    <div>
<!--                        <span class="fl logo"><img alt="logo" src="../../assets/jc-dp/cw-logo.png"></span>-->
                        <h4 class="fl">{{tenName}}</h4>
                    </div>
                </el-col>
                <el-col :sm="8" :md="8" :lg="8" :xl="8">
                    <div class="text-right fr">
                        <span class="fl fenzuico"><img alt="分组" src="@/assets/jc-dp/cw-fenzu-ico.png"></span>
                        <div class="fl fenzu">分组：
                            <el-select v-model="value" clearable placeholder="全部" @change="reset">
                                <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.groupName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="head-top2">
            <el-row class="container">
                <el-col :sm="5" :md="4" :lg="4" :xl="4">
                    <div class="time-con">
                        <h4 class="time">{{nowtime}}</h4>
                        <div class="data">{{nowDate}}</div>
                    </div>
                </el-col>
                <el-col :sm="19" :md="20" :lg="20" :xl="20">
                    <div class="head2-con">
                        <el-row :gutter="10">
                            <!--  检测人数-->
                            <el-col :sm="8" :md="8" :lg="8" :xl="8">
                                <div class="head2-conli">
                                    <div class="fl ico"><img alt="检测人数" src="@/assets/jc-dp/cw-jcrs.png"></div>
                                    <div class="fl nr">检测人数：<b>{{zong}}</b><span>人</span></div>
                                </div>
                            </el-col>
                            <!--  本日测温-->
                            <el-col :sm="8" :md="8" :lg="8" :xl="8">
                                <div class="head2-conli">
                                    <div class="fl ico"><img alt="检测人数" src="@/assets/jc-dp/cw-brcw.png"></div>
                                    <div class="fl nr">本日测温：<b>{{jiance}}</b><span>人</span></div>
                                </div>
                            </el-col>
                            <!--  体温异常-->
                            <el-col :sm="8" :md="8" :lg="8" :xl="8">
                                <div class="head2-conli">
                                    <div class="fl ico"><img alt="检测人数" src="@/assets/jc-dp/cw-twyc.png"></div>
                                    <div class="fl nr">体温异常：<b>{{yichang}}</b><span>人</span></div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
         </div>
        <div class="h-210"></div>

        <!--内容展示-->
        <div class="index-con">
            <div class="container">
                <el-row :gutter="20">
                    <el-col :sm="8" :md="6" :lg="6" :xl="6" v-for="item in temlist" v-bind:key="item.tuId">
                        <div class="index-conli" @click="tanchu(item.tuId)">
                            <div class=" green-con">
                                <div v-if="(item.wenDu>temtop||item.wenDu<temdown)&&item.wenDu" class="index-contop row red">
                                    <div class="fl wendu">{{item.wenDu||"-"}}<span>℃</span></div>
                                    <div class="fr">最新体温</div>
                                </div>
                                <div v-else class="index-contop row green">
                                    <div class="fl wendu">{{item.wenDu||"-"}}<span>℃</span></div>
                                    <div class="fr">最新体温</div>
                                </div>
                                <div class="index-connr row">
                                    <div class="fl">{{item.tuUsername}}</div>
                                    <div class="fr chuangw">{{item.remark}}</div>
                                </div>
                                <div class="index-conbotm row">
                                    <div class="">性别：{{item.tuSex==1?'男':'女'}}</div>
                                    <div class="">测温时间：{{this.dayjs(item.testTime).format('YYYY-MM-DD HH:mm:ss')||'暂无'}}</div>

                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            custom-class="dialogClass"
            append-to-body
            width="300px">
            <div class="tc-top">
                <h4>{{user.remark}}</h4>
                <div class="yuan">
                    <p class="dqtw">当前体温：</p>
                    <p class="wd">{{user.wenDu}}<span>℃</span></p>
                    <p class="time">检测时间</p>
                    <p class="data">{{this.dayjs(user.testTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
                </div>
                <el-row class="xinxi">
                    <el-col :span="8">
                        <div class="xinxili">
                            <h4>{{user.tuUsername}}</h4>
                            <p>姓名</p>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="xinxili">
                            <h4>{{user.tuSex == 1?'男':'女'}}</h4>
                            <p>性别</p>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="xinxili">
                            <h4>{{user.age}}岁</h4>
                            <p>年龄</p>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--历史温度-->
            <div class="lswd">
                <el-row>
                    <el-col :span="12">
                        <div class="lswd-tit">
                            <h4>历史温度</h4>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="xiala">
                            <el-dropdown trigger="click" @command="changedate">
                              <span class="el-dropdown-link ">
                                {{date}}<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item command="24">24小时</el-dropdown-item>
                                  <el-dropdown-item command="7">近7天</el-dropdown-item>
                                  <el-dropdown-item command="15">近15天</el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>
                <LineMarker
                    ref="tubiao111"
                    width="100%"
                    height="200px"></LineMarker>
            </div>
        </el-dialog>
    </div>
</template>




<script>
import {parseTime} from "@/utils";
// import {getWendudata,getList,getByTuId,getHourList} from "@/api/table";
import { getWendudata } from "@/api/temperature/temperature"
import { listTempuser,getByTuId } from "@/api/temperature/tempuser"
import { listTemphour } from "@/api/temperature/temphour"
import { listTempshezhi } from "@/api/temperature/tempshezhi"
import { listTempgroup } from "@/api/temperature/tempgroup"
import LineMarker from "@/components/Charts/LineMarker";
export default {
    name: "summary",
    data() {
        return {
            dialogVisible: false,
            nowDate: '',
            nowtime: '',
            listQuery: {
              beginTime:'',
              endTime:''
            },
            zong:0,
            jiance:0,
            yichang:0,
            timer:'',
            lister:'',
            temlist:[],
            user:[],
            date:"24小时",
            queryParams: {
                pageNum: 1,
                pageSize: 1500,
                tUid: null,
                kstime:"",
                jstime:""
                // params:{
                //     kstime:"",
                //     jstime:""
                // }
            },
            type:24,
            options: [],
            value: '',
            group:[],
            shezhi:[],
            temtop:37.8,
            temdown:35,
            tenName:'',
            djs:30
        };
    },
    components: {LineMarker},
    created() {
        let _this = this

        // _this.lister = setInterval(() => {
        //     _this.getWendudata()
        //     _this.getlist()
        // },10000)
        // setTimeout(function () {
        //     // _this.options = _this.$store.state.table.group
        //     // _this.temtop = _this.$store.state.table.shezhi[0].alarmup
        //     // _this.temdown = _this.$store.state.table.shezhi[0].alarmdown
        //     // _this.tenName = _this.$store.state.user.tenantName
        //     _this.getbase();
        //     _this.getDate()
        //     _this.getWendudata()
        //     _this.getlist()
        //     console.log(_this.options)
        // }, 1000)
      _this.getbase();
      _this.getDate()
      _this.getWendudata()
      _this.getlist()
    },
    destroyed() {
        clearInterval(this.lister);
        clearInterval(this.timer);
    },
    mounted() {

        this.timer = setInterval(() => {
            this.setNowTimes()
        }, 500);
    },
    methods: {
        getbase(){
          // _this.options = _this.$store.state.table.group
          // _this.temtop = _this.$store.state.table.shezhi[0].alarmup
          // _this.temdown = _this.$store.state.table.shezhi[0].alarmdown
          listTempgroup().then(res => {
            if(res.rows.length > 0){
              this.options = res.rows;
            }
          })
          listTempshezhi().then(res => {
            if(res.rows.length > 0){
              this.temtop = res.rows[0].alarmup
              this.temdown = res.rows[0].alarmdown
            }

          })
        },

        setNowTimes() { // 获取日期
            let myDate = new Date();
            this.nowDate = parseTime(myDate, '{y}年{m}月{d}日')
            this.nowtime = parseTime(myDate, '{h}:{i}:{s}')
        },
        getWendudata() {
            // this.listLoading = true;
            getWendudata(this.listQuery).then(response => {
                console.log(response)
                let list = response.rows;
                this.zong = list[0].num;
                this.jiance = list[1].num;
                this.yichang = list[2].num;
                // for (var i=0;i<3;i++){
                //     if
                // }
            }).catch(error => {
                console.log(error);
            });
        },
        getDate() {
            var dt = new Date()
            var y = dt.getFullYear()
            var mt = dt.getMonth()+1
            var d = dt.getDate()
            this.listQuery.beginTime=y+'-'+mt+'-'+d+' 00:00:00';
            dt.setDate(dt.getDate() + 1);//获取1天前的日期
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            var day = dt.getDate();
            this.listQuery.endTime = year + "-" + month + "-" + day+' 00:00:00';
        },
        getlist(id) {
          listTempuser({groupId:id}).then(res => {
                this.temlist = res.rows;
                console.log(this.temlist)
            })
        },
        tanchu(id) {
          console.log(id)
            this.queryParams.tUid = id
            getByTuId({'tuId':id}).then(res => {
                console.log(res)
                this.user = res.user;
            })

            this.bindPickerChange(24)
            this.dialogVisible = true
            //this.tubiao()

        },
        tubiao(){
            let _this = this;
            listTemphour(_this.queryParams).then(res => {
                let xData = [];
                let yData = [];

                if(res.code == 0 && res.total > 0){
                    let datas = res.rows;
                    for (let key in datas) {
                        if (this.type == 24){
                            xData.push(this.formathour(datas[key]['createTime']));
                        }else {
                            xData.push(this.formatData(datas[key]['createTime']));
                        }

                        yData.push(datas[key]['temp'])
                    }
                }
                console.log(yData)
                console.log(xData)
                let opoption = {
                    grid: {
                        left: '20%',
                        top: '10%',
                        right: '10%',
                        bottom: '10%'
                    },
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
                        max: 42,
                        min: 35
                    },
                    series: [{
                        data: yData,
                        itemStyle:{
                            normal:{
                                color:'#01c8db', //折点颜色
                                lineStyle:{
                                    color:'#01c8db' //折线颜色
                                }
                            }
                        },
                        type: 'line'
                    }]
                };

                // _this.$refs[`tubiao`].chart.setOption(option)
              _this.$refs[`tubiao111`].chart.setOption(opoption)

            }).catch((err) => {
                console.log(err);
            })
        },
        reset(value){
            console.log(value)
            this.getlist(value)
        },
        changedate(command){
            console.log(command)
            this.type = command
            if (command == 24){
                this.date = "24小时"
            }else if(command == 7){
                this.date = "近7天"
            }else {
                this.date = "近15天"
            }
            this.bindPickerChange(command)
        },
        bindPickerChange(e) {
            var dt = new Date()
            var y = dt.getFullYear()
            var mt = dt.getMonth()+1
            var day = dt.getDate()
            var h =dt.getHours()
            var mi =dt.getMinutes()
            var s =dt.getSeconds()
            var date=y+'-'+mt+'-'+day;
            dt.setDate(dt.getDate() - 1);//获取1天前的日期
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            if( month <10){
                month = '0' + month;
            }
            var day = dt.getDate();
            if( day < 10){
                day = '0' + day;
            }
            var lastday = year + "-" + month + "-" + day;
            dt.setDate(dt.getDate() - 6);//获取七天前的日期
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            if( month <10){
                month = '0' + month;
            }
            var day = dt.getDate();
            if( day < 10){
                day = '0' + day;
            }
            var sevenday = year + "-" + month + "-" + day;
            dt.setDate(dt.getDate() - 8);//获取15天前的日期
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            if( month <10){
                month = '0' + month;
            }
            var day = dt.getDate();
            if( day < 10){
                day = '0' + day;
            }
            var last15 = year + "-" + month + "-" + day;
            var enddate=date+" "+h + ":" + mi + ":" + s;
            //this.queryParams.params.endTime=enddate
            var startdate
            if(e==24){
                startdate=lastday+" "+h + ":" + mi + ":" + s;
            }else if(this.index==7){

                startdate=sevenday;
            }else{

                startdate=last15
            }
            //this.queryParams.params.beginTime=startdate;
            this.queryParams.jstime = enddate
            this.queryParams.kstime = startdate
            this.tubiao()
        },
        formathour(data){
            const nDate=new Date(data)
            const year= nDate.getFullYear()
            const month=(nDate.getMonth()+1).toString().padStart(2,0)
            const day=nDate.getDate().toString()
            const hours=nDate.getHours().toString()
            const mini=nDate.getMinutes().toString()
            //return hours+":"+mini
            return hours
        },
        formatData(data){
            const nDate=new Date(data)
            const year= nDate.getFullYear()
            const month=(nDate.getMonth()+1).toString().padStart(2,0)
            const day=nDate.getDate().toString()
            const hours=nDate.getHours().toString()
            const mini=nDate.getMinutes().toString()
            return month+'/'+day
        },
    }
}
</script>

<style lang="scss" scoped>
p {
    margin: 0;
    padding: 0;
}
h4{
    margin: 0;
    padding: 0;
}
.container{
    //width: 1200px;
    //margin: 0 auto;
    padding: 0 4%;
}
.fl{
    float: left;
}
.fr{
    float: right;
}
.text-right{
    text-align: right;
}
.row::before,.row::after{
    display: table;
    clear: both;
    content: '';
}
.h-210{height: 170px;}

/*平板*/
@media screen and (max-width: 1440px) and (min-width: 767px){
.h-210{height:150px!important;}
.index{
    .index-con{
        min-height: calc(100vh - 170px) !important;
    }
    .head-top{
        h4{
            font-size: 20px!important;
            padding-top: 17px!important;
        }
        .logo{
            margin-top: 17px!important;
            img{
                width: 60px;
            }
        }
        .fenzu{
            font-size: 16px!important;
            .el-select{
              :deep(.el-input__inner){
                    font-size: 16px!important;
                    width: 100px!important;
                }
            }
        }
        .fenzuico{
            margin-top: 18px!important;
            margin-right: 4px!important;
            img{
                width: 26px;
            }

        }
    }
    .head-top2{
        height: 90px!important;
        .time-con{
            margin-top: 20px!important;
            .time{
                font-size: 26px!important;
            }
            .data{
                font-size: 14px!important;
            }
        }
        .head2-conli{
            .ico{
                margin-top: 17%!important;
            }
            img{
                width: 40px!important;
            }
            .nr{
                font-size: 14px!important;
                line-height: 90px!important;
                b{
                    font-size: 20px!important;
                    padding-left: 4px!important;
                }
                span{
                    font-size: 16px!important;
                }
            }
        }
    }
    .index-con{
        .green-con:before{
            width: 30px!important;
            height: 36px!important;
        }
        .red-con:before{
            width: 30px!important;
            height: 36px!important;
        }
        .index-conli{
            border-radius: 10px!important;
            .index-contop{
                font-size: 16px!important;
                height: 60px!important;
                line-height: 60px!important;
                .wendu{
                    font-size: 26px!important;
                    span{
                        font-size: 20px!important;
                    }
                }
            }
            .index-connr{
                font-size: 16px!important;
                height: 40px!important;
                line-height: 40px!important;
                .chuangw{
                    font-size: 18px!important;
                    span{
                        font-size: 14px!important;
                    }
                }
            }
            .index-conbotm{
                font-size: 12px!important;
            }
        }
    }

}

}
/*平板end*/
.index{
    .index-head{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
    }
    .head-top{
        background: url("../../../assets/jc-dp/cw-head-1.jpg") no-repeat center center;
        height: 60px;
        background-size: 100% 100%;
        .fenzu{
            font-size: 18px;
            padding-top: 10px;
            color: #2ba132;
            .el-select{
               :deep(.el-input__inner){
                    border: none;
                    background: transparent;
                    font-size: 18px;
                    width: 120px;
                    color: #2ba132;
                   padding: 0;
                }
            }
        }
        .logo{
            margin-top: 13px;
            margin-right: 10px;
            img{
                width: 70px;
            }
        }
        h4{
            font-size: 24px;
            color: #33a031;
            padding-top: 16px;
            font-weight: inherit;
        }
        .fenzuico{
            margin-top: 10px;
            margin-right: 10px;
        }
    }
    .head-top2{
        background: url("../../../assets/jc-dp/cw-head-2.png") no-repeat center center;
        height:110px;
        .time-con{
            margin-top: 6%;
            .time{
                font-size: 40px;
            }
            .data{
                font-size: 22px;
            }
        }
        .head2-con{
            .el-col:nth-child(2){
                .head2-conli{
                    b{
                        color: #00ab54;
                    }
                }
            }
            .el-col:nth-child(3){
                .head2-conli{
                    b{
                        color: #ff4842;
                    }
                }
            }
            .head2-conli{
                display: table;
                margin: 0 auto;

                .ico{
                    margin-top: 13%;
                    margin-right: 10px;
                    img{
                        width: 50px;
                    }
                }
                .nr{
                    font-size: 24px;
                    line-height: 110px;
                    b{
                        font-size: 40px;
                        color: #1890ff;
                        padding-left: 15px;
                    }
                    span{
                        font-size: 22px;
                        color: #9eaab5;
                    }
                }

            }
        }

    }
    .index-con{
        background: url("../../../assets/jc-dp/cw-con.jpg") no-repeat center center;
        background-size: cover;
        min-height: calc(100vh - 210px);
        padding-top: 1%;
        .green-con:before{
            content:" ";
            background-image: url("../../../assets/jc-dp/cw-ico-green.png");
            background-size: cover;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 70px;
            height: 76px;
            background-repeat: no-repeat;
        }
        .red-con:before{
            content:" ";
            background-image: url("../../../assets/jc-dp/cw-ico-red.png");
            background-size: cover;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 70px;
            height: 76px;
            background-repeat: no-repeat;
        }
        .index-conli{
            background: #fff;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            margin-bottom: 4%;
            cursor:pointer;
            .index-contop{
                padding: 0 5%;
                height: 90px;
                line-height: 90px;
                font-size: 20px;
                color: #080d1a;
                .wendu{
                    font-size:40px;
                    span{
                        font-size: 36px;
                    }
                }
            }
            .index-connr{
                padding:0 5%;
                height: 50px;
                line-height: 50px;
                font-size: 20px;
                color: #080d1a;
                .chuangw{
                    font-size: 26px;
                    span{
                        font-size: 20px;
                        color: #999999;
                        padding-left: 6px;
                    }
                }

            }
            .index-conbotm{
                padding:2% 5% 4%;
                color: #999999;
                font-size: 18px;
                div{
                    padding-bottom: 1%;
                }
            }
            .green{
                background: #f4fcf7;
                .wendu{
                    color: #2ba132;
                }
            }
            .red{
                background: #ffe3e2;
                .wendu{
                    color: #ff423c;
                }
            }
        }



    }
    .dialogClass{
        //:deep(.el-dialog){
            border-radius: 15px;
            overflow: hidden;
            border: 8px solid #fff;
            box-shadow: #dedede 0px 0px 10px 5px inset;
        //}
        :deep(.el-dialog__body){
            padding: 0!important;
        }
        :deep(.el-dialog__header){
            padding: 0!important;
        }

        //弹出
        .tc-top{
            background: url("../../../assets/jc-dp/tc-top-bg.png") no-repeat center center;
            background-size: 100% 100%;
            color: #ffffff;
            min-height: 470px;
            font-size: 24px;
            text-align: center;
            padding: 20px;
            h4{
                padding: 6px;
                font-weight: normal;

            }
            .xinxi{
                margin-top: 20px;
                .xinxili{
                    text-align: center;
                    border-right:1px dashed #00edec;
                    p{
                        font-size: 18px;
                        color: #dcdddd;
                    }
                }
                .el-col:last-child{
                    .xinxili{
                        border-right: none;
                    }
                }
            }
            .yuan{
                background: url("../../../assets/jc-dp/quan.png") no-repeat center center;
                height: 255px;
                width: 255px;
                margin: 0 auto;
                .dqtw{
                    font-size: 18px;
                    padding-top: 60px;
                }
                .wd{
                    font-size: 55px;
                    span{
                        font-size: 18px;
                    }
                }
                .time{
                    font-size: 18px;
                    padding: 4px 0;
                }
                .data{
                    font-size:18px;
                }
            }

        }
        .lswd{
            padding: 20px;
            .lswd-tit{
                h4{
                    font-size: 20px;
                    position: relative;
                    padding-left: 15px;
                    font-weight: inherit;
                }
                h4:before{
                    content:" ";
                    background-color:#31c1e4 ;
                    position: absolute;
                    left: 0;
                    top: 6px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50px;
                }
            }
            .xiala{
                .el-dropdown{
                    background: #31c1e4;
                    color: #fff;
                    border-radius: 10px;
                    padding: 2px 8px;
                    float: right;

                }
            }


        }
    }
}

</style>
