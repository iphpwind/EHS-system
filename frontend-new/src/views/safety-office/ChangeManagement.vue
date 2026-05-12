<template>
  <div class="safety-office-page">
    <PageHeader title="变更管理" description="工艺/设备/人员等变更的申请、审批与实施管理" :icon="Edit">
      <template #actions><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增变更</el-button></template>
    </PageHeader>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat,i) in stats" :key="stat.label">
        <div class="stat-icon" :style="{background:stat.bgColor,color:stat.color}"><el-icon :size="24"><component :is="statIcons[i]" /></el-icon></div>
        <div class="stat-content"><div class="stat-label">{{stat.label}}</div><div class="stat-value">{{stat.value}}</div></div>
      </div>
    </div>
    <el-tabs v-model="activeTab" @tab-change="fetch">
      <el-tab-pane label="全部" name="" />
      <el-tab-pane label="待审核" name="pending" />
      <el-tab-pane label="审核中" name="reviewing" />
      <el-tab-pane label="已批准" name="approved" />
      <el-tab-pane label="实施中" name="implementing" />
      <el-tab-pane label="已完成" name="completed" />
    </el-tabs>
    <div class="table-card">
      <div class="table-toolbar">
        <el-input v-model="search.keyword" placeholder="搜索标题/编号" clearable style="width:240px" @clear="fetch" @keyup.enter="fetch" />
        <el-select v-model="search.changeType" placeholder="变更类型" clearable style="width:140px" @change="fetch"><el-option v-for="t in changeTypes" :key="t" :label="t" :value="t" /></el-select>
        <el-button type="primary" @click="fetch">查询</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="change_no" label="变更编号" width="150" />
        <el-table-column prop="change_title" label="变更标题" min-width="200" />
        <el-table-column prop="change_type" label="类型" width="80"><template #default="{row}"><el-tag size="small">{{row.change_type}}</el-tag></template></el-table-column>
        <el-table-column prop="change_level" label="等级" width="60" align="center"><template #default="{row}"><el-tag :type="row.change_level==='I'?'danger':row.change_level==='II'?'warning':'info'" size="small">{{row.change_level}}</el-tag></template></el-table-column>
        <el-table-column prop="applicant_name" label="申请人" width="100" />
        <el-table-column prop="apply_date" label="申请日期" width="100" />
        <el-table-column label="审核/批准" width="120"><template #default="{row}"><span style="font-size:12px;color:var(--text-muted)">{{row.reviewer_name||'-'}} / {{row.approver_name||'-'}}</span></template></el-table-column>
        <el-table-column prop="implementer" label="实施人" width="100" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{row}"><el-tag :type="statusTagType(row.status)" size="small">{{statusText(row.status)}}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{row}">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleStatusAction(row)" v-if="canAction(row)">{{statusActionText(row)}}</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑变更':'新增变更'" width="750px">
      <el-form :model="form" label-width="110px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="变更标题" required><el-input v-model="form.changeTitle" /></el-form-item></el-col><el-col :span="12"><el-form-item label="变更类型" required><el-select v-model="form.changeType" style="width:100%"><el-option v-for="t in changeTypes" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="变更等级"><el-select v-model="form.changeLevel" style="width:100%"><el-option label="I级(重大)" value="I" /><el-option label="II级(较大)" value="II" /><el-option label="III级(一般)" value="III" /></el-select></el-form-item></el-col></el-row>
        <el-form-item label="变更描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="变更原因"><el-input v-model="form.reason" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="风险评估"><el-input v-model="form.riskAssessment" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="安全措施"><el-input v-model="form.safetyMeasures" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="实施方案"><el-input v-model="form.implementationPlan" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'提交'}}</el-button></template>
    </el-dialog>
    <el-dialog v-model="statusDialogVisible" :title="statusDialogTitle" width="450px">
      <el-form label-width="100px" size="small">
        <el-form-item label="意见"><el-input v-model="statusComment" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="statusDialogVisible=false">取消</el-button><el-button type="primary" @click="handleStatusSave">确认</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,computed,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,Edit,CircleCheck,Clock,Warning } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons=[Edit,CircleCheck,Warning,Clock]
const changeTypes=['工艺变更','设备变更','人员变更','材料变更','规程变更','其他']
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const statusDialogVisible=ref(false);const statusDialogTitle=ref('');const statusAction=ref('');const statusCurrentId=ref(0);const statusComment=ref('')
const list=ref<any[]>([]);const activeTab=ref('');const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:'',changeType:''})
const stats=ref([{label:'变更总数',value:0,color:'#6366f1',bgColor:'rgba(99,102,241,0.1)'},{label:'进行中',value:0,color:'#3b82f6',bgColor:'rgba(59,130,246,0.1)'},{label:'已完成',value:0,color:'#10b981',bgColor:'rgba(16,185,129,0.1)'},{label:'待审核',value:0,color:'#f59e0b',bgColor:'rgba(245,158,11,0.1)'}])
const form=reactive({changeTitle:'',changeType:'',changeLevel:'',description:'',reason:'',riskAssessment:'',safetyMeasures:'',implementationPlan:''})
const statusText=(s:string)=>({pending:'待审核',reviewing:'审核中',approved:'已批准',implementing:'实施中',completed:'已完成',rejected:'已驳回'})[s]||s
const statusTagType=(s:string)=>({pending:'warning',reviewing:'primary',approved:'success',implementing:'',completed:'success',rejected:'danger'})[s]||'info'
const canAction=(row:any)=>['pending','reviewing','approved','implementing'].includes(row.status)
const statusActionText=(row:any)=>({pending:'提交审核',reviewing:'批准',approved:'开始实施',implementing:'完成实施'})[row.status]||''
const nextStatus=(s:string)=>({pending:'reviewing',reviewing:'approved',approved:'implementing',implementing:'completed'})[s]||''
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/changes',{params:{page:p.page,pageSize:p.pageSize,status:activeTab.value,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{}finally{loading.value=false}}
const fetchStats=async()=>{try{const r=await request.get('/api/changes/stats');if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;const bs=d.byStatus||[];stats.value[1].value=bs.find((s:any)=>s.status==='implementing'||s.status==='reviewing'||s.status==='approved')?.count||0;stats.value[2].value=bs.find((s:any)=>s.status==='completed')?.count||0;stats.value[3].value=bs.find((s:any)=>s.status==='pending')?.count||0}}catch{}}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{changeTitle:'',changeType:'',changeLevel:'',description:'',reason:'',riskAssessment:'',safetyMeasures:'',implementationPlan:''});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{changeTitle:row.change_title,changeType:row.change_type||'',changeLevel:row.change_level||'',description:row.description||'',reason:row.reason||'',riskAssessment:row.risk_assessment||'',safetyMeasures:row.safety_measures||'',implementationPlan:row.implementation_plan||''});dialogVisible.value=true}
const handleSave=async()=>{if(!form.changeTitle||!form.changeType)return ElMessage.warning('标题和类型不能为空');saving.value=true;try{if(isEdit.value){await request.put(`/api/changes/${getEditId()}/status`,form);ElMessage.success('更新成功')}else{await request.post('/api/changes',form);ElMessage.success('提交成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.change_title===form.changeTitle);return item?.id}
const handleStatusAction=(row:any)=>{statusCurrentId.value=row.id;statusAction.value=nextStatus(row.status);statusDialogTitle.value=`${statusActionText(row)} - ${row.change_title}`;statusComment.value='';statusDialogVisible.value=true}
const handleStatusSave=async()=>{saving.value=true;try{const payload:any={status:statusAction.value};if(statusAction.value==='reviewing'){payload.reviewComment=statusComment.value}else if(statusAction.value==='approved'){payload.approvalComment=statusComment.value}else{payload.comment=statusComment.value};await request.put(`/api/changes/${statusCurrentId.value}/status`,payload);ElMessage.success('状态更新成功');statusDialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error('操作失败')}finally{saving.value=false}}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/changes/${row.id}`);ElMessage.success('已删除');fetch();fetchStats()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
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
