<template>
    <div class="app-container">
<!--        <div class="filter-container">-->
<!--            <el-row :gutter="10">-->
<!--                <el-col :span="6">-->
<!--&lt;!&ndash;                    <el-input v-model="listQuery.tuIdnumber" placeholder="请输入身份证号"></el-input>&ndash;&gt;-->
<!--                    <div class="block">-->
<!--                        <span class="demonstration">日期</span>-->
<!--                        <el-date-picker-->
<!--                            v-model="value2"-->
<!--                            align="right"-->
<!--                            type="date"-->
<!--                            placeholder="选择日期"-->
<!--                            :picker-options="pickerOptions"-->
<!--                            value-format="yyyy-MM-dd"-->
<!--                            @change="datechange">-->
<!--                        </el-date-picker>-->
<!--                    </div>-->
<!--                </el-col>-->
<!--                <el-col :span="6">-->
<!--                    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">-->
<!--                        搜索-->
<!--                    </el-button>-->
<!--                    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="exportexcel">-->
<!--                        导出-->
<!--                    </el-button>-->
<!--                </el-col>-->
<!--            </el-row>-->
<!--        </div>-->
        <br>
        <el-table
            v-loading="listLoading"
            :data="tableData"
            border
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column fixed label="企业名" prop="tenname" align="center">
            </el-table-column>
            <el-table-column fixed label="姓名" prop="username" align="center">
            </el-table-column>
            <el-table-column fixed label="操作名" prop="operat" align="center">
            </el-table-column>
            <el-table-column fixed label="结果" prop="result" align="center">
            </el-table-column>
            <el-table-column fixed label="原因" prop="reason" align="center">
            </el-table-column>
            <el-table-column fixed label="时间" prop="createTime" align="center">
            </el-table-column>


        </el-table>
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import waves from '@/directive/waves'
    // import { getLog } from "@/api/table"
    import { listTemplog } from "@/api/temperature/templog"
    export default {
        name: "interact",
        components: {Pagination},
        directives: {waves},
        data(){
            return{
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                value2: '',
                listLoading: false,
                total: 0,
                tableKey: 0,
                tableData: [],
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                },
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList(){
                listTemplog(this.listQuery).then(res => {
                    // console.log(res)
                    this.tableData = res.rows
                    this.total = res.total
                })
            },

            search(){
                this.getList()
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
