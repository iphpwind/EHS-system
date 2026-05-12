<template>
  <div class="safety-office-page">
    <PageHeader title="文件管理" description="管理制度/通知/报告等文件统一管理" :icon="DocumentCopy">
      <template #actions><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>上传文件</el-button></template>
    </PageHeader>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat,i) in stats" :key="stat.label">
        <div class="stat-icon" :style="{background:stat.bgColor,color:stat.color}"><el-icon :size="24"><component :is="statIcons[i]" /></el-icon></div>
        <div class="stat-content"><div class="stat-label">{{stat.label}}</div><div class="stat-value">{{stat.value}}</div></div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <el-input v-model="search.keyword" placeholder="搜索标题/编号" clearable style="width:240px" @clear="fetch" @keyup.enter="fetch" />
        <el-select v-model="search.fileType" placeholder="文件类型" clearable style="width:140px" @change="fetch"><el-option v-for="t in ['制度','通知','报告','记录','表单','其他']" :key="t" :label="t" :value="t" /></el-select>
        <el-button type="primary" @click="fetch">查询</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="doc_no" label="编号" width="150" />
        <el-table-column prop="title" label="文件标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="file_type" label="类型" width="80"><template #default="{row}"><el-tag size="small">{{row.file_type}}</el-tag></template></el-table-column>
        <el-table-column prop="version" label="版本" width="70" align="center" />
        <el-table-column prop="issuing_department" label="发布部门" width="120" />
        <el-table-column prop="effective_date" label="生效日期" width="100" />
        <el-table-column prop="expiry_date" label="失效日期" width="100" />
        <el-table-column prop="download_count" label="下载" width="60" align="center" />
        <el-table-column prop="status" label="状态" width="70"><template #default="{row}"><el-tag :type="row.status===1?'success':row.status===2?'info':'warning'" size="small">{{{1:'有效',2:'废止',3:'草稿'}[row.status]}}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="150" fixed="right"><template #default="{row}"><el-button link type="primary" @click="handleEdit(row)">编辑</el-button><el-button link type="danger" @click="handleDelete(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑文件':'上传文件'" width="600px">
      <el-form :model="form" label-width="100px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="文件标题" required><el-input v-model="form.title" /></el-form-item></el-col><el-col :span="12"><el-form-item label="文件类型" required><el-select v-model="form.fileType" style="width:100%"><el-option v-for="t in ['制度','通知','报告','记录','表单','其他']" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="分类"><el-input v-model="form.category" /></el-form-item></el-col><el-col :span="12"><el-form-item label="版本"><el-input v-model="form.version" placeholder="V1.0" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="生效日期"><el-date-picker v-model="form.effectiveDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col><el-col :span="12"><el-form-item label="失效日期"><el-date-picker v-model="form.expiryDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col></el-row>
        <el-form-item label="发布部门"><el-input v-model="form.issuingDepartment" /></el-form-item>
        <el-form-item label="文件路径"><el-input v-model="form.filePath" placeholder="文件存储路径或URL" /></el-form-item>
        <el-form-item label="关键词"><el-input v-model="form.keywords" placeholder="用逗号分隔" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="是否公开"><el-switch v-model="form.isPublic" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'上传'}}</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,DocumentCopy,CircleCheck,Clock,Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons=[DocumentCopy,CircleCheck,Clock,Download]
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const list=ref<any[]>([]);const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:'',fileType:''})
const stats=ref([{label:'文件总数',value:0,color:'#0891b2',bgColor:'rgba(8,145,178,0.1)'},{label:'有效文件',value:0,color:'#10b981',bgColor:'rgba(16,185,129,0.1)'},{label:'即将失效',value:0,color:'#f59e0b',bgColor:'rgba(245,158,11,0.1)'},{label:'总下载',value:0,color:'#7c3aed',bgColor:'rgba(124,58,237,0.1)'}])
const form=reactive({title:'',fileType:'',category:'',keywords:'',filePath:'',version:'V1.0',issuingDepartment:'',effectiveDate:null,expiryDate:null,isPublic:true,description:''})
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/documents',{params:{page:p.page,pageSize:p.pageSize,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{}finally{loading.value=false}}
const fetchStats=async()=>{try{const r=await request.get('/api/documents/stats');if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;const bt=d.byType||[];stats.value[1].value=bt.reduce((s:number,t:any)=>s+t.count,0);stats.value[2].value=d.expiringCount;stats.value[3].value=list.value.reduce((s:number,r:any)=>s+(r.download_count||0),0)}}catch{}}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{title:'',fileType:'',category:'',keywords:'',filePath:'',version:'V1.0',issuingDepartment:'',effectiveDate:null,expiryDate:null,isPublic:true,description:''});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{title:row.title,fileType:row.file_type||'',category:row.category||'',keywords:row.keywords||'',filePath:row.file_path||'',version:row.version||'V1.0',issuingDepartment:row.issuing_department||'',effectiveDate:row.effective_date||null,expiryDate:row.expiry_date||null,isPublic:!!row.is_public,description:row.description||''});dialogVisible.value=true}
const handleSave=async()=>{if(!form.title||!form.fileType)return ElMessage.warning('标题和类型不能为空');saving.value=true;try{if(isEdit.value){await request.put(`/api/documents/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/documents',form);ElMessage.success('上传成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.title===form.title);return item?.id}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/documents/${row.id}`);ElMessage.success('已删除');fetch();fetchStats()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
onMounted(()=>{fetch();fetchStats()})
</script>
<style scoped>
.safety-office-page{padding:24px;background:var(--bg);min-height:100vh}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:24px}
.stat-card{display:flex;align-items:center;gap:16px;padding:20px;background:var(--surface);border-radius:16px;box-shadow:var(--shadow-sm);transition:all .3s}
.stat-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.stat-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stat-content{flex:1}
.stat-label{font-size:14px;color:var(--text-muted);margin-bottom:4px}
.stat-value{font-size:28px;font-weight:700;color:var(--text-primary);line-height:1}
.table-toolbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
.table-pagination{display:flex;justify-content:flex-end;padding:16px 0}
@media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr}}
</style>
