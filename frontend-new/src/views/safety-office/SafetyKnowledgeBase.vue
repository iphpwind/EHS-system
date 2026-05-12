<template>
  <div class="safety-office-page">
    <PageHeader title="安全生产知识库" description="法规标准/安全技术/事故案例等知识管理" :icon="Collection">
      <template #actions><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增知识</el-button></template>
    </PageHeader>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat,i) in stats" :key="stat.label">
        <div class="stat-icon" :style="{background:stat.bgColor,color:stat.color}"><el-icon :size="24"><component :is="statIcons[i]" /></el-icon></div>
        <div class="stat-content"><div class="stat-label">{{stat.label}}</div><div class="stat-value">{{stat.value}}</div></div>
      </div>
    </div>
    <div class="knowledge-layout">
      <div class="knowledge-sidebar">
        <el-input v-model="search.keyword" placeholder="搜索知识..." clearable @clear="fetch" @keyup.enter="fetch" style="margin-bottom:12px" />
        <el-menu :default-active="search.knowledgeType||'all'" @select="(idx:string)=>{search.knowledgeType=idx==='all'?'':idx;fetch()}">
          <el-menu-item index="all">全部</el-menu-item>
          <el-menu-item v-for="t in types" :key="t" :index="t">{{t}}</el-menu-item>
        </el-menu>
      </div>
      <div class="knowledge-main">
        <div class="knowledge-list" v-loading="loading">
          <div class="knowledge-item" v-for="item in list" :key="item.id" @click="handleView(item)">
            <div class="k-item-header"><el-tag size="small">{{item.knowledge_type}}</el-tag><span class="k-item-date">{{item.created_at?.slice(0,10)}}</span></div>
            <div class="k-item-title">{{item.title}}</div>
            <div class="k-item-summary">{{item.summary||item.content?.slice(0,100)}}</div>
            <div class="k-item-footer"><span class="k-item-stat"><el-icon><View /></el-icon>{{item.view_count||0}}</span><span class="k-item-stat"><el-icon><Star /></el-icon>{{item.like_count||0}}</span></div>
          </div>
          <el-empty v-if="!loading&&list.length===0" description="暂无知识条目" />
          <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑知识':'新增知识'" width="800px">
      <el-form :model="form" label-width="100px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="标题" required><el-input v-model="form.title" /></el-form-item></el-col><el-col :span="12"><el-form-item label="类型" required><el-select v-model="form.knowledgeType" style="width:100%"><el-option v-for="t in types" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="分类"><el-input v-model="form.category" /></el-form-item></el-col><el-col :span="12"><el-form-item label="来源"><el-input v-model="form.source" /></el-form-item></el-col></el-row>
        <el-form-item label="标签"><el-input v-model="form.tags" placeholder="用逗号分隔" /></el-form-item>
        <el-form-item label="摘要"><el-input v-model="form.summary" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="form.content" type="textarea" :rows="8" /></el-form-item>
        <el-form-item label="参考链接"><el-input v-model="form.referenceUrl" /></el-form-item>
        <el-form-item label="是否公开"><el-switch v-model="form.isPublic" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,Collection,CircleCheck,Star,View } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons=[Collection,CircleCheck,Star,View]
const types=['法规','标准','规范','案例','技术','操作','其他']
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const list=ref<any[]>([]);const p=reactive({page:1,pageSize:10,total:0})
const search=reactive({keyword:'',knowledgeType:''})
const stats=ref([{label:'知识总数',value:0,color:'#0891b2',bgColor:'rgba(8,145,178,0.1)'},{label:'已发布',value:0,color:'#10b981',bgColor:'rgba(16,185,129,0.1)'},{label:'总点赞',value:0,color:'#f59e0b',bgColor:'rgba(245,158,11,0.1)'},{label:'总浏览',value:0,color:'#7c3aed',bgColor:'rgba(124,58,237,0.1)'}])
const form=reactive({title:'',knowledgeType:'',category:'',tags:'',content:'',summary:'',source:'',referenceUrl:'',isPublic:true})
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/knowledge',{params:{page:p.page,pageSize:p.pageSize,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{}finally{loading.value=false}}
const fetchStats=async()=>{try{const r=await request.get('/api/knowledge/stats');if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;stats.value[1].value=(d.byType||[]).reduce((s:number,t:any)=>s+t.count,0);stats.value[2].value=0;stats.value[3].value=d.totalViews}}catch{}}
const handleView=(item:any)=>{ElMessage.info(`查看知识：${item.title}`)}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{title:'',knowledgeType:'',category:'',tags:'',content:'',summary:'',source:'',referenceUrl:'',isPublic:true});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{title:row.title,knowledgeType:row.knowledge_type||'',category:row.category||'',tags:row.tags||'',content:row.content||'',summary:row.summary||'',source:row.source||'',referenceUrl:row.reference_url||'',isPublic:!!row.is_public});dialogVisible.value=true}
const handleSave=async()=>{if(!form.title||!form.knowledgeType)return ElMessage.warning('标题和类型不能为空');saving.value=true;try{if(isEdit.value){await request.put(`/api/knowledge/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/knowledge',form);ElMessage.success('创建成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.title===form.title);return item?.id}
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
.knowledge-layout{display:flex;gap:20px}
.knowledge-sidebar{width:180px;flex-shrink:0}
.knowledge-sidebar .el-menu{border-right:none;border-radius:12px;overflow:hidden}
.knowledge-main{flex:1}
.knowledge-item{padding:16px 20px;background:var(--surface);border-radius:12px;margin-bottom:12px;cursor:pointer;transition:all .2s;box-shadow:var(--shadow-sm)}
.knowledge-item:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.k-item-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.k-item-date{font-size:12px;color:var(--text-muted)}
.k-item-title{font-size:16px;font-weight:600;color:var(--text-primary);margin-bottom:6px}
.k-item-summary{font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:8px}
.k-item-footer{display:flex;gap:16px}
.k-item-stat{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:4px}
.table-pagination{display:flex;justify-content:center;padding:16px 0}
@media(max-width:1200px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr}.knowledge-layout{flex-direction:column}.knowledge-sidebar{width:100%}}
</style>
