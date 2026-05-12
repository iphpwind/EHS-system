<template>
    <div class="jdbg-container">
        <div style="height:70px;padding: 1%" class="dp-head">
            <div style="width:50%;float: left" class="time fl">
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
                    align="right"
                >
                </el-date-picker>
            </div>
            <div style="width:50%;float: left" class="anniu fl">
                <el-button type="primary" :disabled="baogaoShow" @click="clickGeneratePicture" v-print="'#baogao'">打印</el-button>
            </div>
        </div>
        <!--  -->
<!--         -->
<!--        <el-button ref="baogaoan" type="button" :disabled="baogaoShow" class="CustomPrint" icon="el-icon-printer" @click="clickGeneratePicture" v-print="'#baogao'"></el-button>-->
        <div id="baogao">
            <div>
                <div class="baogao baogao1">
                    <div>
                        <h2 style="text-align: center;font-size: 24px">忱工测温云服务周报</h2>
                    </div>
                    <div style="text-align: center;font-size: 16px;margin-bottom: 5px">
                        测温单位：{{teName}}
                    </div>
                    <div style="text-align: center;font-size: 16px;margin-bottom: 30px">
                        报告期间：{{kstime}}-{{jstime}}
                    </div>
                    <div style="font-size: 16px;margin-bottom: 20px">
                        本周是贵单位测温服务的第1周，本周共有{{jiance}}名员工进行过测温，累计有效测温{{cishu}}人次。
                    </div>
<!--                    <div style="font-size: 14px;margin-bottom: 5px">-->
<!--                        本周体温监测中，发现体温升高0人次，体温异常波动（较前一小时体温波动大于0.5℃）0人次。-->
<!--                    </div>-->
                    <div style="font-size: 16px;margin-bottom: 20px">
                        本周有效测温次数最多的员工是：{{first}}、{{ second }}
                    </div>
                    <div style="font-size: 16px;margin-bottom: 40px">
                        本周有{{ zong-jiance }}名员工未进行过测温，请及时了解原因并提醒员工正确测温。
                    </div>
                    <div style="font-size: 16px;margin-bottom: 15px">本周每天测温概况如下：</div>
                    <div id="sigeventTable">
                        <el-table
                            :data="serviceList"
                            border
                            style="width: 100%">
                            <el-table-column
                                prop="rq"
                                label="日期">
                                <template #default="scope">
                                    <span>{{chaifen(scope.row.rq)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="renshu"
                                label="测温人数">
                            </el-table-column>
                            <el-table-column
                                prop="yname"
                                label="测温率">
                                <template #default="scope">
                                    <span v-if="scope.row.renshu==0">0%</span>
                                    <span v-else>{{ (scope.row.renshu/zong*100).toFixed(1)}}%</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="renci"
                                label="测温人次">
                            </el-table-column>
                            <el-table-column
                                prop="yichang"
                                label="异常人次">
                            </el-table-column>
                            <el-table-column
                                prop="cnt"
                                label="异常率">
                                <template #default="scope">
                                    <span v-if="scope.row.yichang==0">0%</span>
                                    <span v-else>{{ (scope.row.yichang/scope.row.renci)*100}}%</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
// import {getSeTempList, getWendudata, tempDesc} from "@/api/table"
import { tempList, tempDesc } from "@/api/temperature/tempuser"
import { getWendudata } from "@/api/temperature/temperature"
    import html2canvas from "html2canvas";

    export default {
        name: "service",
        data() {
            return {
                iframeShow: true,
                paramquery: {
                    kstime:'',
                    jstime:''
                },
                jianceQuery: {
                    beginTime:'',
                    endTime:''
                },
                serviceList:[],
                value2: '',
                defaultTime2:[
                  new Date(2000, 1, 1, 0, 0, 0),
                  new Date(2000, 2, 1, 23, 59, 59),
                ],
                baogaoShow:true,
                jdbgRight:false,
                userList:[],
                zong:0,
                jiance:0,
                cishu:0,
                first:'',
                second:'',
                teName:'',
                kstime:'',
                jstime:''
            }
        },

        created() {
            this.teName = this.$store.state.user.user.secondDeptName
          // console.log(this.$store.state.user)
            // this.getList();
            // this.chaifen('220903')
        },
        methods: {
            gettime(val){
              console.log(val)

                if (val){
                    var startDate = new Date(val[0]).getTime()
                    var endDate = new Date(val[1]).getTime()
                    if(endDate - startDate > 6*24*60*60*1000){
                        this.$message({
                            message:"所选时间范围不能大于7天",
                            type:"warning"
                        })
                    }else {
                        this.kstime = this.dayjs(val[0]).format('YYYY-MM-DD')
                        this.jstime = this.dayjs(val[1]).format('YYYY-MM-DD')
                        this.paramquery.kstime = val[0]
                        this.paramquery.jstime = val[1]
                        this.jianceQuery.beginTime = val[0]
                        this.jianceQuery.endTime = val[1]
                        this.getList();
                        this.baogaoShow = false
                    }
                }


            },
            getList(){
                tempList(this.paramquery).then(res => {
                    console.log(res)
                    this.cishu = 0
                    this.serviceList = res.rows
                    for (let i = 0;i<this.serviceList.length;i++){
                        this.cishu+=Number(this.serviceList[i].youxiaocishu)
                    }
                })
                tempDesc(this.paramquery).then(res => {
                    this.userList = res.rows;
                    this.first = this.userList[0].tuUsername;
                    this.second = this.userList[1].tuUsername;
                })
                getWendudata(this.jianceQuery).then(response => {
                    console.log(response)
                    let list = response.rows;
                    this.zong = list[0].num;
                    this.jiance = list[1].num;
                }).catch(error => {
                    console.log(error);
                });
            },

            chaifen(data){
                const strArr = data.match(/.{1,2}/g);
                return strArr[0]+'.'+strArr[1]+'.'+strArr[2]
            },
            refer(){

            },
            xgbaogaoShow(){
                this.baogaoShow = false;
                setTimeout(() => {
                    this.jdbgRight = false;
                }, 5000);
            },
            /**
             * 将页面指定节点内容转为图片
             * 1.拿到想要转换为图片的内容节点DOM；
             * 2.转换，拿到转换后的canvas
             * 3.转换为图片
             */
            clickGeneratePicture() {

                this.iframeShow = false;

                // html2canvas(this.$refs.baogaoContent).then(canvas => {
                //     // 转成图片，生成图片地址
                //     this.imgUrl = canvas.toDataURL("image/png");
                //     console.log(imgUrl);
                //     console.log("》》》》》》》》》》》》》》》》》》》》》》》》》》》》");
                // });
            },

            iframeImage(id){
                let _this = this;

                let iframe = document.getElementById(id);
                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function() {
                        let iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
                        if(iframeWin.document.body){
                            setTimeout(function() {
                                html2canvas(iframeWin.document.body).then(canvas => {
                                    // 转成图片，生成图片地址
                                    let imgUrl = canvas.toDataURL("image/png");
                                    document.getElementById(id + "Parent").style.backgroundImage = `url('${imgUrl}')`;
                                });
                                _this.jdbgRight = false;
                            }, 2000);
                        }
                    });
                } else {
                    iframe.onload = function() {
                        let iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
                        if(iframeWin.document.body){
                            setTimeout(function() {
                                html2canvas(iframeWin.document.body).then(canvas => {
                                    // 转成图片，生成图片地址
                                    let imgUrl = canvas.toDataURL("image/png");
                                    document.getElementById(id + "Parent").style.backgroundImage = `url('${imgUrl}')`;
                                });
                                _this.jdbgRight = false;
                                console.log(_this);
                            }, 3000);
                        }
                    };
                }
            }
        },
    }
</script>
<style lang="scss">
    #sigeventTable{
        .el-table{
            thead{
                color: #000000!important;
                font-weight: 100!important;
                tr{
                    background: #eeeeee;
                }
            }
        }
    }

    .jdbg{
        &-container{
            iframe{
                position: relative;
                width: 100%;
                height: 100%;
                border: 0;
                padding: 0;
                margin: 0;
            }
            table {
                border-spacing: 0;
                border-collapse: collapse;
            }
            h4{
                margin-top: 10px;
                margin-bottom: 10px;
                font-family: inherit;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                font-size: 18px;
            }
            h3 {
                margin-bottom: 20px;
                margin-top: 20px;
                font-family: inherit;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                font-size: 24px;
            }
            &-left{
                position: fixed;
                width: 35%;
                padding: 10px;
                height: 95%;
                .el-card{
                    margin: 0 auto;
                    width: 350px;
                    height: 100%;
                    :deep(&__header) {
                        background-color: #01ada8;
                        color: #fff;
                        padding: 10px;
                    }
                    &__body{
                        .block{
                            padding-left: 10px;
                            padding-right: 10px;
                            padding-bottom: 15px;
                            .el-date-editor{
                                width: calc(100% - 74px);
                            }
                            .el-table{
                                :deep(&__row) {
                                    td{
                                        padding: 6px 0;
                                    }
                                }
                            }
                            .el-input{
                                :deep(input) {
                                    border-radius: 30px
                                }
                            }
                            .el-row{
                                .el-col{
                                    .pagination-container{
                                        padding: 8px 16px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            &-right{
                width: 55%;
                padding: 10px;
                margin-left: calc(35% + 20px);

            }
        }
    }
    #baogao{
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        h4{
            margin-top: 10px;
            margin-bottom: 10px;
            font-family: inherit;
            font-weight: 500;
            line-height: 1.1;
            color: inherit;
            font-size: 18px;
        }
        h3 {
            margin-bottom: 20px;
            margin-top: 20px;
            font-family: inherit;
            font-weight: 500;
            line-height: 1.1;
            color: inherit;
            font-size: 24px;
        }
        .baogao{
            width: 595px;
            height: 820px;
            clear: both;
            margin: 0 auto;
            padding: 30px;
            position: relative;
            border: 1px solid #000;
            margin-bottom: 10px;
            page-break-before: always;
            -webkit-print-color-adjust:exact;
            -moz-print-color-adjust:exact;
            -ms-print-color-adjust:exact;
            background-color: #fff;
            font-size: 14px;
            .daycurve,.daycurve2{
                width: 530px;
                height: 250px;
                margin-bottom: 10px;
                border: 1px solid #eee;
            }
        }
        .baogao1{
            h1{
                text-align: center;
                margin-top: 140px;
                font-size: 40px;
                font-weight: bold;
                margin-bottom: 80px;
            }
            .message{
                margin: 0 auto;
                width: 400px;
                padding: 10px;
                border: 1px solid #ccc;
                background-color: #eee;
                clear: both;
                tr{
                    td {
                        padding: 10px;
                        border: 1px solid #ccc;
                    }
                    td:first-child {
                        width: 95px;
                    }
                }
            }
        }
        .baogao2{
            table {
                text-align: center;
                td{
                    border: 1px solid #ddd;
                    padding: 8px;
                    line-height: 1.42857143;
                    vertical-align: top;
                }
            }
            .table-bordered {
                border: 1px solid #ddd;
            }
            .table {
                width: 100%;
                max-width: 100%;
                margin-bottom: 20px;
            }
            .daycurve-p2 {
                font-size: 15px;
                text-indent: 25px;
                line-height: 27px;
            }
            .powerContain {
                width: 500px;
                height: 350px;
                margin: 0 auto;
            }
        }
        .baogao3{
            .ranking {
                width: 530px;
                height: 280px;
                margin-bottom: 10px;
                border: solid 1px #eee;
            }
            .ranking-p {
                text-align: center;
            }
        }
        .baogao4{
            h4:first-child {
                font-size: 22px;
            }
            .daycurve-h4 {
                margin-top: 25px;
            }
        }
        .baogao5{

        }
    }
    .CustomPrint {
        position: fixed;
        right: 50px;
        top: 100px;
        width: 95px;
        height: 68px;
        padding: 0;
        border-radius: 5px;
        border: 0;
        color: #FFF;
        background-color: #01ada8;
        font-size: 40px;
    }
    .el-button.is-disabled{
        color: #C0C4CC;
        background-color: #FFF;
        border: solid 1px #EBEEF5;
    }
    @media screen and (max-width: 768px){
        #baogao .baogao .daycurve, #baogao .baogao .daycurve2 {
            width: 100%;
        }
        .jdbg-container-right {
            width: 100%;
            margin-left: 0px;
        }
        .jdbg-container-left {
            position: relative;
            width: 100%;
        }
        .jdbg-container-left .el-card{
            width: 100%;
        }
        #baogao .baogao{
            width: 100%;
        }
        #baogao .baogao1 .message{
            width: auto;
        }
        #baogao .baogao2 .powerContain{
            width: 100%;
        }
        .CustomPrint{
            display: none;
        }
        #baogao .baogao1 .message tr td{
            min-width: 100px;
        }
        #baogao .baogao3 .ranking{
            width: 100%;
            min-height: 200px;
            height: auto;
            border: none;
        }
        .monitorTable{
            :deep(table){
                width: auto!important;
            }
        }
    }
</style>

