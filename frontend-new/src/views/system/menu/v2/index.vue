<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header"><span>菜单列表</span><el-button type="primary" size="small" @click="handleAdd({id:0})">新增</el-button></div>
          </template>
          <el-tree :data="tree" :props="{label:'title',children:'children'}" @node-click="handleNodeClick" highlight-current default-expand-all />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header><span>{{ form.id ? '编辑菜单' : '新增菜单' }}</span></template>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="上级菜单">
              <el-tree-select v-model="form.parent_id" :data="treeSelectData" check-strictly :render-after-expand="false" style="width:100%" />
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="显示标题" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="菜单类型">
              <el-radio-group v-model="form.menu_type">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="路由路径" v-if="form.menu_type!=='F'">
              <el-input v-model="form.path" />
            </el-form-item>
            <el-form-item label="组件路径" v-if="form.menu_type==='C'">
              <el-input v-model="form.component" />
            </el-form-item>
            <el-form-item label="权限标识" v-if="form.menu_type==='F'">
              <el-input v-model="form.permission" placeholder="如：safework:firework:add" />
            </el-form-item>
            <el-form-item label="图标" v-if="form.menu_type!=='F'">
              <el-input v-model="form.icon" />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="form.sort_order" :min="0" />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button v-if="form.id" type="danger" @click="handleDelete">删 除</el-button>
              <el-button @click="reset">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="MenuV2">
import { ref, reactive, getCurrentInstance, computed } from 'vue'
import { listMenu, addMenu, updateMenu, delMenu } from '@/api/rbac'

const { proxy } = getCurrentInstance()
const tree = ref([])
const form = reactive({ id: null, parent_id: 0, name: '', title: '', path: '', component: '', permission: '', icon: '', menu_type: 'C', sort_order: 0, status: 1 })
const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  title: [{ required: true, message: '请输入显示标题', trigger: 'blur' }]
}

const treeSelectData = computed(() => {
  return [{ label: '顶级菜单', value: 0, children: buildTreeSelect(tree.value) }]
})

function buildTreeSelect(items) {
  if (!items) return []
  return items.map(i => ({ label: i.title, value: i.id, children: buildTreeSelect(i.children) }))
}

function load() {
  listMenu().then(res => {
    const rows = res.data || []
    tree.value = buildTree(rows, 0)
  })
}
function buildTree(items, pid) {
  return items.filter(i => i.parent_id === pid).map(i => ({
    ...i,
    children: buildTree(items, i.id)
  }))
}
function handleNodeClick(node) {
  Object.assign(form, node)
}
function handleAdd(parent) {
  reset()
  form.parent_id = parent ? parent.id : 0
}
function reset() {
  Object.assign(form, { id: null, parent_id: 0, name: '', title: '', path: '', component: '', permission: '', icon: '', menu_type: 'C', sort_order: 0, status: 1 })
}
function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (!valid) return
    if (form.id) {
      updateMenu(form.id, form).then(() => { proxy.$modal.msgSuccess('修改成功'); load() })
    } else {
      addMenu(form).then(() => { proxy.$modal.msgSuccess('新增成功'); reset(); load() })
    }
  })
}
function handleDelete() {
  proxy.$modal.confirm('确认删除？').then(() => delMenu(form.id)).then(() => { proxy.$modal.msgSuccess('删除成功'); reset(); load() })
}
load()
</script>
