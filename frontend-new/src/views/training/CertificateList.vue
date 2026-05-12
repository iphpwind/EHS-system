<template>
  <div class="app-container">
    <el-card>
      <h2 class="mb-4">证书管理</h2>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="certificateNo" label="证书编号" />
        <el-table-column prop="userName" label="持证人" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="issueDate" label="颁发日期" width="120" />
        <el-table-column prop="expiryDate" label="到期日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === 'valid' ? 'success' : 'danger'">
              {{ row.status === 'valid' ? '有效' : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button type="primary" link @click="downloadCert(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="query.page" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCertificates } from '@/api/training'
import type { QueryParams } from './types'

const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const query = ref<QueryParams>({ page: 1, limit: 10 })

const getList = async () => {
  loading.value = true
  try {
    const res = await getCertificates(query.value)
    tableData.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取证书列表失败:', error)
    ElMessage.error('获取证书列表失败')
  } finally {
    loading.value = false
  }
}

const downloadCert = (row: any) => {
  ElMessage.info('下载证书功能待实现')
}

onMounted(getList)
</script>
