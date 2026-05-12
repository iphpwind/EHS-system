<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams">
      <el-form-item label="角色名称">
        <el-input v-model="queryParams.keyword" placeholder="角色名称/编码" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
        <el-button type="success" icon="Plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="角色编码" prop="code" />
      <el-table-column label="数据范围" width="120">
        <template #default="{row}">
          <el-tag>{{ dataScopeLabel(row.data_scope) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{row}">
          <el-tag :type="row.status===1?'success':'danger'">{{ row.status===1?'启用':'禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" width="220">
        <template #default="{row}">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleMenu(row)">分配菜单</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑 -->
    <el-dialog :title="title" v-model="open" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="数据范围">
          <el-select v-model="form.data_scope" style="width:100%">
            <el-option label="全部数据" :value="1" />
            <el-option label="本部门数据" :value="2" />
            <el-option label="本人数据" :value="3" />
            <el-option label="自定义" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 分配菜单 -->
    <el-dialog title="分配菜单" v-model="menuOpen" width="400px">
      <el-tree ref="menuTreeRef" :data="menuTree" show-checkbox node-key="id" :props="{label:'label',children:'children'}" />
      <template #footer>
        <el-button type="primary" @click="submitMenu">确 定</el-button>
        <el-button @click="menuOpen=false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="RoleV2">
import { ref, reactive, getCurrentInstance } from 'vue'
import { listRole, addRole, updateRole, delRole, listMenuTree, getRoleMenus, assignRoleMenus } from '@/api/rbac'

const { proxy } = getCurrentInstance()
const loading = ref(false)
const list = ref([])
const total = ref(0)
const open = ref(false)
const title = ref('')
const menuOpen = ref(false)
const menuTree = ref([])
const menuTreeRef = ref(null)
const currentRoleId = ref(null)

const queryParams = reactive({ pageNum: 1, pageSize: 10, keyword: '' })
const form = reactive({ name: '', code: '', data_scope: 2, status: 1, remark: '' })
const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

function dataScopeLabel(v) {
  const map = { 1:'全部', 2:'本部门', 3:'本人', 4:'自定义' }
  return map[v] || v
}
function getList() {
  loading.value = true
  listRole(queryParams).then(res => {
    list.value = res.data || []
    total.value = res.total || 0
    loading.value = false
  }).catch(() => { loading.value = false })
}
function reset() {
  Object.assign(form, { id: null, name: '', code: '', data_scope: 2, status: 1, remark: '' })
}
function handleAdd() { reset(); open.value = true; title.value = '新增角色' }
function handleEdit(row) {
  Object.assign(form, row)
  open.value = true
  title.value = '编辑角色'
}
function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (!valid) return
    if (form.id) {
      updateRole(form.id, form).then(() => { proxy.$modal.msgSuccess('修改成功'); open.value = false; getList() })
    } else {
      addRole(form).then(() => { proxy.$modal.msgSuccess('新增成功'); open.value = false; getList() })
    }
  })
}
function handleDelete(row) {
  proxy.$modal.confirm('确认删除该角色？').then(() => delRole(row.id)).then(() => { proxy.$modal.msgSuccess('删除成功'); getList() })
}
function handleMenu(row) {
  currentRoleId.value = row.id
  Promise.all([listMenuTree(), getRoleMenus(row.id)]).then(([treeRes, roleRes]) => {
    menuTree.value = treeRes.data || []
    menuOpen.value = true
    proxy.$nextTick(() => {
      menuTreeRef.value.setCheckedKeys(roleRes.data || [])
    })
  })
}
function submitMenu() {
  const keys = menuTreeRef.value.getCheckedKeys()
  assignRoleMenus(currentRoleId.value, { menuIds: keys }).then(() => {
    proxy.$modal.msgSuccess('分配成功')
    menuOpen.value = false
  })
}
getList()
</script>
