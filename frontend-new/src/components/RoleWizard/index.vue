<template>
  <el-dialog
      :title="title"
      v-model="visible"
      width="780px"
      :close-on-click-modal="false"
      append-to-body
      @close="handleClose"
  >
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success" align-center class="mb20">
      <el-step title="基本信息" />
      <el-step title="菜单权限" />
      <el-step title="数据权限" />
      <el-step title="确认保存" />
    </el-steps>

    <!-- Step 0: 基本信息 -->
    <div v-if="activeStep === 0" class="step-content">
      <el-form ref="basicRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" maxlength="30" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入权限字符，如：admin" maxlength="100" />
          <div class="form-tip">控制器中 @PreAuthorize("hasRole('admin')") 使用的权限字符</div>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" :min="0" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </div>

    <!-- Step 1: 菜单权限 -->
    <div v-else-if="activeStep === 1" class="step-content">
      <div class="menu-tree-wrapper">
        <div class="menu-toolbar">
          <el-input v-model="menuFilterText" placeholder="搜索菜单（支持模糊搜索）" clearable prefix-icon="Search" />
          <div class="toolbar-actions">
            <el-button size="small" text @click="expandAllMenus">展开全部</el-button>
            <el-button size="small" text @click="collapseAllMenus">折叠全部</el-button>
            <el-button size="small" text @click="checkAllMenus">全选</el-button>
            <el-button size="small" text @click="uncheckAllMenus">全不选</el-button>
          </div>
        </div>
        <div class="menu-tree-body">
          <el-tree
              ref="menuTreeRef"
              :data="menuOptions"
              :props="{ label: 'label', children: 'children' }"
              show-checkbox
              node-key="id"
              :filter-node-method="filterMenuNode"
              :default-checked-keys="checkedMenuIds"
              highlight-current
              class="role-menu-tree"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon v-if="data.icon" class="tree-icon"><svg-icon :icon-class="data.icon" /></el-icon>
                <span>{{ node.label }}</span>
                <el-tag v-if="data.perms" size="small" type="info" class="tree-perms">{{ data.perms }}</el-tag>
              </span>
            </template>
          </el-tree>
        </div>
        <div class="menu-footer-tip">
          已选 <strong>{{ checkedMenuCount }}</strong> 个菜单
        </div>
      </div>
    </div>

    <!-- Step 2: 数据权限 -->
    <div v-else-if="activeStep === 2" class="step-content">
      <el-form :model="form" label-width="100px">
        <el-form-item label="数据权限范围">
          <el-radio-group v-model="form.dataScope" class="data-scope-group">
            <el-radio :label="1" class="scope-radio">
              <div class="scope-item">
                <strong>全部数据</strong>
                <span class="scope-desc">可查看系统中的所有数据（超级管理员）</span>
              </div>
            </el-radio>
            <el-radio :label="2" class="scope-radio">
              <div class="scope-item">
                <strong>自定义数据权限</strong>
                <span class="scope-desc">可查看指定部门的数据</span>
              </div>
            </el-radio>
            <el-radio :label="3" class="scope-radio">
              <div class="scope-item">
                <strong>本部门数据</strong>
                <span class="scope-desc">只能查看本部门的数据</span>
              </div>
            </el-radio>
            <el-radio :label="4" class="scope-radio">
              <div class="scope-item">
                <strong>本部门及以下数据</strong>
                <span class="scope-desc">可查看本部门及其子部门的数据</span>
              </div>
            </el-radio>
            <el-radio :label="5" class="scope-radio">
              <div class="scope-item">
                <strong>仅本人数据</strong>
                <span class="scope-desc">只能查看自己创建的数据</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.dataScope === 2" label="选择部门">
          <div class="dept-tree-wrapper">
            <el-input v-model="deptFilterText" placeholder="搜索部门" clearable prefix-icon="Search" class="mb12" />
            <el-tree
                ref="deptTreeRef"
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                show-checkbox
                node-key="id"
                :filter-node-method="filterDeptNode"
                highlight-current
                class="role-dept-tree"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- Step 3: 确认保存 -->
    <div v-else-if="activeStep === 3" class="step-content">
      <el-result icon="info" :title="'确认创建角色：' + form.roleName">
        <template #sub-title>
          <div class="confirm-summary">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="角色名称">{{ form.roleName }}</el-descriptions-item>
              <el-descriptions-item label="权限字符">{{ form.roleKey }}</el-descriptions-item>
              <el-descriptions-item label="角色顺序">{{ form.roleSort }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ form.status === '0' ? '正常' : '停用' }}</el-descriptions-item>
              <el-descriptions-item label="菜单权限" :span="2">
                {{ checkedMenuCount }} 个菜单被选中
              </el-descriptions-item>
              <el-descriptions-item label="数据权限" :span="2">
                {{ dataScopeLabel }}
              </el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">
                {{ form.remark || '无' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-result>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
        <el-button v-if="activeStep < 3" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="activeStep === 3" type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addRole, updateRole, getRole } from '@/api/system/role'
import { roleMenuTreeselect as getMenuTreeselect } from '@/api/system/menu'
import { treeselect as getDeptTreeselect } from '@/api/system/dept'

const props = defineProps({
  // 是否为编辑模式
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['success'])

// 状态
const visible = ref(false)
const activeStep = ref(0)
const submitLoading = ref(false)
const title = ref('新增角色')

// 表单
const basicRef = ref(null)
const form = reactive({
  roleId: undefined,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
  dataScope: 1,
  remark: '',
  menuIds: [],
  deptIds: []
})

const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
}

// 菜单权限
const menuTreeRef = ref(null)
const menuFilterText = ref('')
const menuOptions = ref([])
const checkedMenuIds = ref([])

const checkedMenuCount = computed(() => {
  if (!menuTreeRef.value) return 0
  return menuTreeRef.value.getCheckedKeys().length
})

// 数据权限
const deptTreeRef = ref(null)
const deptFilterText = ref('')
const deptOptions = ref([])

const dataScopeLabel = computed(() => {
  const map = {
    1: '全部数据',
    2: '自定义数据权限',
    3: '本部门数据',
    4: '本部门及以下数据',
    5: '仅本人数据'
  }
  return map[form.dataScope] || '未知'
})

// 搜索过滤
watch(menuFilterText, (val) => {
  if (menuTreeRef.value) {
    menuTreeRef.value.filter(val)
  }
})

watch(deptFilterText, (val) => {
  if (deptTreeRef.value) {
    deptTreeRef.value.filter(val)
  }
})

function filterMenuNode(value, data) {
  if (!value) return true
  return data.label && data.label.includes(value)
}

function filterDeptNode(value, data) {
  if (!value) return true
  return data.label && data.label.includes(value)
}

// 菜单树操作
function expandAllMenus() {
  setAllTreeExpand(menuTreeRef.value, true)
}

function collapseAllMenus() {
  setAllTreeExpand(menuTreeRef.value, false)
}

function checkAllMenus() {
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedNodes(menuOptions.value)
  }
}

function uncheckAllMenus() {
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }
}

function setAllTreeExpand(treeRef, expanded) {
  if (!treeRef) return
  const nodes = treeRef.store.nodesMap
  Object.keys(nodes).forEach(key => {
    nodes[key].expanded = expanded
  })
}

// 步骤导航
function nextStep() {
  if (activeStep.value === 0) {
    // 验证基本信息
    basicRef.value.validate((valid) => {
      if (valid) {
        activeStep.value++
      }
    })
  } else if (activeStep.value === 1) {
    // 至少选择一个菜单
    const checked = menuTreeRef.value.getCheckedKeys()
    if (checked.length === 0) {
      ElMessage.warning('请至少选择一个菜单权限')
      return
    }
    activeStep.value++
  } else {
    activeStep.value++
  }
}

function prevStep() {
  activeStep.value--
}

// 提交
async function submitForm() {
  submitLoading.value = true
  try {
    // 收集菜单权限
    const checkedKeys = menuTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
    form.menuIds = checkedKeys.concat(halfCheckedKeys)

    // 收集部门权限
    if (form.dataScope === 2 && deptTreeRef.value) {
      const deptCheckedKeys = deptTreeRef.value.getCheckedKeys()
      const deptHalfCheckedKeys = deptTreeRef.value.getHalfCheckedKeys()
      form.deptIds = deptCheckedKeys.concat(deptHalfCheckedKeys)
    } else {
      form.deptIds = []
    }

    if (props.isEdit && form.roleId) {
      await updateRole(form.roleId, form)
      ElMessage.success('修改成功')
    } else {
      await addRole(form)
      ElMessage.success('新增成功')
    }

    visible.value = false
    emit('success')
  } catch (error) {
    console.error('保存角色失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 打开对话框（新增）
function openAdd() {
  resetForm()
  activeStep.value = 0
  title.value = '新增角色'
  visible.value = true
  loadMenuTree()
}

// 打开对话框（编辑）
async function openEdit(roleId) {
  resetForm()
  activeStep.value = 0
  title.value = '修改角色'
  visible.value = true

  try {
    // 并行加载
    const [roleRes, menuRes] = await Promise.all([
      getRole(roleId),
      roleMenuTreeselect(roleId)
    ])

    Object.assign(form, roleRes.data)
    menuOptions.value = menuRes.data.menus
    checkedMenuIds.value = menuRes.data.checkedKeys || []

    // 等待树渲染后设置选中
    await nextTick()
    if (menuTreeRef.value && checkedMenuIds.value.length > 0) {
      checkedMenuIds.value.forEach(id => {
        nextTick(() => {
          try { menuTreeRef.value.setChecked(id, true, false) } catch (e) {}
        })
      })
    }

    // 加载部门树（如果是自定义数据权限）
    if (form.dataScope === 2) {
      loadDeptTree()
    }
  } catch (error) {
    console.error('加载角色数据失败:', error)
  }
}

function resetForm() {
  Object.assign(form, {
    roleId: undefined,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: '0',
    dataScope: 1,
    remark: '',
    menuIds: [],
    deptIds: []
  })
  checkedMenuIds.value = []
  activeStep.value = 0
  menuFilterText.value = ''
  deptFilterText.value = ''
}

function handleClose() {
  visible.value = false
  resetForm()
}

// 加载菜单树
async function loadMenuTree() {
  try {
    const res = await getMenuTreeselect()
    menuOptions.value = res.data.menus || res.data || []
  } catch (error) {
    console.error('加载菜单树失败:', error)
  }
}

// 加载部门树
async function loadDeptTree() {
  try {
    const res = await getDeptTreeselect()
    deptOptions.value = res.data.depts || res.data || []
  } catch (error) {
    console.error('加载部门树失败:', error)
  }
}

// 监听数据权限变化，自定义时加载部门树
watch(() => form.dataScope, (val) => {
  if (val === 2 && deptOptions.value.length === 0) {
    loadDeptTree()
  }
})

// 暴露方法
defineExpose({
  openAdd,
  openEdit
})
</script>

<style scoped>
.mb20 {
  margin-bottom: 20px;
}

.step-content {
  min-height: 350px;
  max-height: 450px;
  overflow-y: auto;
  padding: 0 10px;
}

.menu-tree-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toolbar-actions {
  display: flex;
  gap: 4px;
}

.menu-tree-body {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
  background: #fafafa;
}

.role-menu-tree {
  font-size: 14px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.tree-icon {
  font-size: 16px;
  color: #409eff;
}

.tree-perms {
  margin-left: auto;
  font-size: 12px;
}

.menu-footer-tip {
  font-size: 13px;
  color: #606266;
  padding: 4px 0;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}

.data-scope-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scope-radio {
  height: auto;
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  margin: 0 !important;
  width: 100%;
}

.scope-radio.is-checked {
  border-color: #409eff;
  background: #f0f9ff;
}

.scope-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 8px;
}

.scope-desc {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.dept-tree-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.confirm-summary {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
