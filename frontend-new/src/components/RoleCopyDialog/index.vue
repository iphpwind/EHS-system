<template>
  <el-dialog title="复制角色" v-model="visible" width="500px" @close="handleClose">
    <el-form ref="copyRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="源角色" prop="sourceRoleId">
        <el-select v-model="form.sourceRoleId" placeholder="请选择要复制的源角色" filterable>
          <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="新角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入新角色名称" maxlength="30" />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="form.roleKey" placeholder="请输入权限字符" maxlength="100" />
        <div class="form-tip">将自动在源角色权限字符后加 _copy</div>
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="form.roleSort" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listRole } from '@/api/system/role'
import { copyRole } from '@/api/system/role'

const emit = defineEmits(['success'])

const visible = ref(false)
const loading = ref(false)
const roleOptions = ref([])

const data = reactive({
  form: {
    sourceRoleId: null,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0'
  },
  rules: {
    sourceRoleId: [{ required: true, message: '请选择源角色', trigger: 'change' }],
    roleName: [{ required: true, message: '请输入新角色名称', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(data)
const copyRef = ref(null)

function open() {
  visible.value = true
  loadRoles()
}

function loadRoles() {
  listRole({ pageNum: 1, pageSize: 1000 }).then(res => {
    roleOptions.value = res.rows || res.data || []
  }).catch(() => {})
}

function handleClose() {
  visible.value = false
  resetForm()
}

function resetForm() {
  data.form = {
    sourceRoleId: null,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0'
  }
  if (copyRef.value) copyRef.value.resetFields()
}

async function handleSubmit() {
  if (!copyRef.value) return
  await copyRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await copyRole(form.value)
      ElMessage.success('复制成功')
      visible.value = false
      emit('success')
    } catch (error) {
      console.error('复制角色失败:', error)
    } finally {
      loading.value = false
    }
  })
}

defineExpose({ open })
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
