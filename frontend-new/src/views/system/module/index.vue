<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>模块开关管理</span>
              <el-button type="primary" size="small" @click="saveModules">保存设置</el-button>
            </div>
          </template>
          <el-alert
            title="提示：关闭模块后，该模块的菜单和功能将不再显示"
            type="info"
            :closable="false"
            style="margin-bottom: 15px;"
          />
          <el-table :data="moduleList" border style="width: 100%">
            <el-table-column prop="module_name" label="模块名称" min-width="150" />
            <el-table-column prop="module_desc" label="模块描述" min-width="250" />
            <el-table-column prop="module_key" label="标识" min-width="120" />
            <el-table-column label="状态" width="120" align="center">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="开启"
                  inactive-text="关闭"
                  @change="handleChange(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="ModuleConfig">
import { listModules, updateModuleStatus } from '@/api/system/moduleConfig'
import { ElMessage } from 'element-plus'

const moduleList = ref([])
const loading = ref(false)

function getList() {
  loading.value = true
  listModules().then(res => {
    moduleList.value = res.data || []
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

function handleChange(row) {
  updateModuleStatus(row.module_key, row.enabled).then(() => {
    ElMessage.success('模块状态已更新')
  }).catch(() => {
    row.enabled = row.enabled === 1 ? 0 : 1
    ElMessage.error('更新失败')
  })
}

function saveModules() {
  ElMessage.success('设置已保存，刷新页面后生效')
}

getList()
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
