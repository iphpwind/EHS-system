<template>
  <div class="app-container">
    <el-card>
      <h2 class="mb-4">培训统计</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-card>
          <h3>培训完成率</h3>
          <div ref="chart1" style="height: 300px"></div>
        </el-card>
        <el-card>
          <h3>部门排名</h3>
          <div ref="chart2" style="height: 300px"></div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chart1 = ref<HTMLElement>()
const chart2 = ref<HTMLElement>()

onMounted(() => {
  if (chart1.value) {
    const chart = echarts.init(chart1.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        data: [
          { value: 60, name: '已完成' },
          { value: 40, name: '进行中' }
        ]
      }]
    })
  }
  if (chart2.value) {
    const chart = echarts.init(chart2.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['部门A', '部门B', '部门C'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [80, 65, 90] }]
    })
  }
})
</script>
