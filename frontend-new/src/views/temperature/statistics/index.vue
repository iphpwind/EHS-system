<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row :gutter="10">
                <el-col :span="6">
<!--                    <el-input v-model="listQuery.tuIdnumber" placeholder="请输入身份证号"></el-input>-->
                    <div class="block">
                        <span class="demonstration">日期</span>
                        <el-date-picker
                            v-model="value2"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            value-format="YYYY-MM-DD"
                            @change="datechange">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span="6">
                    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
                        搜索
                    </el-button>
                    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="exportexcel">
                        导出
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <br>
        <div class="total">
            <el-col :span="6">
                应测人数：{{listQuery.zong}}
            </el-col>
            <el-col :span="6">
                实测人数：{{listQuery.jiance}}
            </el-col>
            <el-col :span="6">
                单位：℃
            </el-col>
        </div>
        <el-table
            v-loading="listLoading"
            :data="tableData"
            border
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column fixed label="姓名" prop="username" align="center">
            </el-table-column>
            <el-table-column fixed label="分组" prop="fenzuname" align="center">
            </el-table-column>
            <el-table-column label="0" prop="ling" align="center">
                <template #default="scope">
                    <span v-if="scope.row.ling==0">--</span>
                    <span v-else>{{scope.row.ling}}</span>
                </template>
            </el-table-column>
            <el-table-column label="1" prop="yi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.yi==0">--</span>
                    <span v-else>{{scope.row.yi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="2" prop="er" align="center">
                <template #default="scope">
                    <span v-if="scope.row.er==0">--</span>
                    <span v-else>{{scope.row.er}}</span>
                </template>
            </el-table-column>
            <el-table-column label="3" prop="san" align="center">
                <template #default="scope">
                    <span v-if="scope.row.san==0">--</span>
                    <span v-else>{{scope.row.san}}</span>
                </template>
            </el-table-column>
            <el-table-column label="4" prop="si" align="center">
                <template #default="scope">
                    <span v-if="scope.row.si==0">--</span>
                    <span v-else>{{scope.row.si}}</span>
                </template>
            </el-table-column>
            <el-table-column label="5" prop="wu" align="center">
                <template #default="scope">
                    <span v-if="scope.row.wu==0">--</span>
                    <span v-else>{{scope.row.wu}}</span>
                </template>
            </el-table-column>
            <el-table-column label="6" prop="liu" align="center">
                <template #default="scope">
                    <span v-if="scope.row.liu==0">--</span>
                    <span v-else>{{scope.row.liu}}</span>
                </template>
            </el-table-column>
            <el-table-column label="7" prop="qi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.qi==0">--</span>
                    <span v-else>{{scope.row.qi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="8" prop="ba" align="center">
                <template #default="scope">
                    <span v-if="scope.row.ba==0">--</span>
                    <span v-else>{{scope.row.ba}}</span>
                </template>
            </el-table-column>
            <el-table-column label="9" prop="jiu" align="center">
                <template #default="scope">
                    <span v-if="scope.row.jiu==0">--</span>
                    <span v-else>{{scope.row.jiu}}</span>
                </template>
            </el-table-column>
            <el-table-column label="10" prop="shi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shi==0">--</span>
                    <span v-else>{{scope.row.shi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="11" prop="shiyi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shiyi==0">--</span>
                    <span v-else>{{scope.row.shiyi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="12" prop="shier" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shier==0">--</span>
                    <span v-else>{{scope.row.shier}}</span>
                </template>
            </el-table-column>
            <el-table-column label="13" prop="shisan" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shisan==0">--</span>
                    <span v-else>{{scope.row.shisan}}</span>
                </template>
            </el-table-column>
            <el-table-column label="14" prop="shisi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shisi==0">--</span>
                    <span v-else>{{scope.row.shisi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="15" prop="shiwu" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shiwu==0">--</span>
                    <span v-else>{{scope.row.shiwu}}</span>
                </template>
            </el-table-column>
            <el-table-column label="16" prop="shiliu" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shiliu==0">--</span>
                    <span v-else>{{scope.row.shiliu}}</span>
                </template>
            </el-table-column>
            <el-table-column label="17" prop="shiqi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shiqi==0">--</span>
                    <span v-else>{{scope.row.shiqi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="18" prop="shiba" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shiba==0">--</span>
                    <span v-else>{{scope.row.shiba}}</span>
                </template>
            </el-table-column>
            <el-table-column label="19" prop="shijiu" align="center">
                <template #default="scope">
                    <span v-if="scope.row.shijiu==0">--</span>
                    <span v-else>{{scope.row.shijiu}}</span>
                </template>
            </el-table-column>
            <el-table-column label="20" prop="ershi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.ershi==0">--</span>
                    <span v-else>{{scope.row.ershi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="21" prop="ershiyi" align="center">
                <template #default="scope">
                    <span v-if="scope.row.ershiyi==0">--</span>
                    <span v-else>{{scope.row.ershiyi}}</span>
                </template>
            </el-table-column>
            <el-table-column label="22" prop="ershier" align="center">
                <template #default="scope">
                    <span v-if="scope.row.ershier==0">--</span>
                    <span v-else>{{scope.row.ershier}}</span>
                </template>
            </el-table-column>
            <el-table-column label="23" prop="ershisan" align="center">
                <template #default="scope">
                    <span v-if="scope.row.ershisan==0">--</span>
                    <span v-else>{{scope.row.ershisan}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import waves from '@/directive/waves'
    // import { get24HourList,export24HourList,getWendudata } from "@/api/table"
    import { getWendudata } from "@/api/temperature/temperature"
    import { exportexcel,hourlist } from "@/api/temperature/temphour"
    // const { proxy } = getCurrentInstance();
    export default {
        name: "statistics",
        components: {Pagination},
        directives: {waves},
        data(){
            return{
                value2: '',
                listLoading: false,
                total: 0,
                tableKey: 0,
                tableData: [],
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                    temtime: '2022-04-27',
                    zong:0,
                    jiance:0,
                    kstime:'2022-04-27 00:00:00',
                    jstime:'2022-04-27 23:59:59'
                },
                jianceQuery: {
                    beginTime:'',
                    endTime:''
                }
            }
        },
        created() {
            let e = new Date();

            let a= this.dayjs(e).format('YYYY-MM-DD')
          this.value2 = a;

            console.log(a)
            this.listQuery.kstime = a+' 00:00:00'
            this.listQuery.temtime = a
            this.listQuery.jstime = a+' 23:59:59'
            this.jianceQuery.beginTime = a+' 00:00:00'
            this.jianceQuery.endTime = a+' 23:59:59'
            this.getList();
            this.getWendudata();
        },
        methods: {
            getList(){
                hourlist(this.listQuery).then(res => {
                    // console.log(res)
                    this.tableData = res.rows
                    this.total = res.total
                })
            },
            getWendudata() {
                // this.listLoading = true;
                getWendudata(this.jianceQuery).then(response => {
                    console.log(response)
                    let list = response.rows;
                    this.listQuery.zong = list[0].num;
                    this.listQuery.jiance = list[1].num;
                }).catch(error => {
                    console.log(error);
                });
            },
            exportexcel(){
                // exportexcel(this.listQuery).then(res => {
                //     if (res.code == 0){
                //         window.location.href = process.env.VUE_APP_BASE_API+"/common/datedownload?fileName=" + res.msg + "&delete=" + true;
                //     }
                //
                this.download('temperature/temphour/export', {
                  ...this.listQuery
                }, this.value2+`_测温统计表.xlsx`)
            },
            datechange(e){
                console.log(e)
                this.listQuery.kstime = e+' 00:00:00'
                this.listQuery.temtime = e
                this.listQuery.jstime = e+' 23:59:59'
                this.jianceQuery.beginTime = e+' 00:00:00'
                this.jianceQuery.endTime = e+' 23:59:59'
            },
            change(e){
                let a = '-'
                if (e!=0){
                    a=e
                }
                return a
            },
            search(){
                this.getList()
                this.getWendudata()
            }

        },
    }
</script>

<style lang="scss">
    .demonstration{
        padding-right: 10px;
    }
    .total{
        margin: 10px 0;
        padding-bottom: 20px;
    }
</style>
