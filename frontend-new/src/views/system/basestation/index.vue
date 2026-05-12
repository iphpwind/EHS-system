<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="positioningcardList">
      <el-table-column label="${comment}" align="center" v-if="false" prop="id"/>
      <el-table-column label="设备编号" align="center" prop="deviceId"/>
      <el-table-column label="状态" align="center" prop="state"></el-table-column>
      <el-table-column label="最后在线时间" align="center" prop="lastInLine"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-map-location"
              @click="location(scope.row)"
          >位置信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <el-dialog title="位置信息" width="70%" height="60%" v-model="showDialog" v-if="showDialog" center>
      <location :params="params" @doClose="showDialog=false"></location>
    </el-dialog>
  </div>
</template>

<script>
import {baseStationListPage} from '@/api/system/device'
import location from './location.vue'

export default {
  name: 'Positioningcard',
  components: {
    location
  },
  data() {
    return {
      showDialog: false,
      params: {
        lat: null,
        lng: null
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 定位卡表格数据
      positioningcardList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        number: null,
        type: null,
        edition: null,
        car: null,
        state: null,
        power: null,
        zhenyuanId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询定位卡列表 */
    getList() {
      this.loading = true
      baseStationListPage(this.queryParams).then(response => {
        console.log(response)
        //this.positioningcardList = response.data.data.records
        for (let i = 0; i < response.data.data.records.length; i++) {
          let options = JSON.parse(response.data.data.records[i].options)
          let state = options.state === 0 ? '在线' : '离线'
          this.positioningcardList.push({
            lastInLine: response.data.data.records[i].timeStr,
            id: response.data.data.records[i].id,
            deviceId: response.data.data.records[i].deviceId,
            state: state,
            longitude: response.data.data.records[i].longitude,
            latitude: response.data.data.records[i].latitude,
          })
        }
        this.total = response.data.data.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        number: null,
        type: null,
        edition: null,
        car: null,
        state: null,
        power: null,
        createTime: null,
        updateTime: null,
        zhenyuanId: null
      }
      this.resetForm('form')
    },
    location(row) {
      this.params.lng = row.longitude
      this.params.lat = row.latitude
      this.showDialog = true
    },
  }
}
</script>
