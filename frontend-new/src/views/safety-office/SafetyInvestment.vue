<template>
  <div class="safety-office-page">
    <PageHeader title="安全生产投入" description="安全生产费用投入记录与统计分析" :icon="Coin">
      <template #actions><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增投入记录</el-button></template>
    </PageHeader>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat,i) in stats" :key="stat.label">
        <div class="stat-icon" :style="{background:stat.bgColor,color:stat.color}"><el-icon :size="24"><component :is="statIcons[i]" /></el-icon></div>
        <div class="stat-content"><div class="stat-label">{{stat.label}}</div><div class="stat-value">{{stat.value}}</div></div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <el-input v-model="search.keyword" placeholder="搜索项目名称" clearable style="width:240px" @clear="fetch" @keyup.enter="fetch" />
        <el-select v-model="search.investmentType" placeholder="投入类型" clearable style="width:140px" @change="fetch"><el-option v-for="t in ['设备','培训','防护','检测','保险','其他']" :key="t" :label="t" :value="t" /></el-select>
        <el-button type="primary" @click="fetch">查询</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="investment_no" label="编号" width="150" />
        <el-table-column prop="project_name" label="项目名称" min-width="200" />
        <el-table-column prop="investment_type" label="类型" width="80"><template #default="{row}"><el-tag size="small">{{row.investment_type}}</el-tag></template></el-table-column>
        <el-table-column prop="amount" label="金额(元)" width="130" align="right"><template #default="{row}"><span style="font-weight:600;color:var(--danger)">{{Number(row.amount).toLocaleString()}}</span></template></el-table-column>
        <el-table-column prop="investment_date" label="投入日期" width="100" />
        <el-table-column prop="responsible_department" label="责任部门" width="120" />
        <el-table-column prop="responsible_person" label="负责人" width="100" />
        <el-table-column prop="vendor" label="供应商" width="140" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right"><template #default="{row}"><el-button link type="primary" @click="handleEdit(row)">编辑</el-button><el-button link type="danger" @click="handleDelete(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑投入记录':'新增投入记录'" width="700px">
      <el-form :model="form" label-width="110px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="项目名称" required><el-input v-model="form.projectName" /></el-form-item></el-col><el-col :span="12"><el-form-item label="投入类型" required><el-select v-model="form.investmentType" style="width:100%"><el-option v-for="t in ['设备','培训','防护','检测','保险','其他']" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="金额(元)" required><el-input-number v-model="form.amount" :min="0" :precision="2" style="width:100%" /></el-form-item></el-col><el-col :span="12"><el-form-item label="投入日期"><el-date-picker v-model="form.investmentDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="预算来源"><el-input v-model="form.budgetSource" /></el-form-item></el-col><el-col :span="12"><el-form-item label="责任部门"><el-input v-model="form.responsibleDepartment" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="负责人"><el-input v-model="form.responsiblePerson" /></el-form-item></el-col><el-col :span="12"><el-form-item label="供应商"><el-input v-model="form.vendor" /></el-form-item></el-col></el-row>
        <el-form-item label="投入说明"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="效果评估"><el-input v-model="form.effectEvaluation" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,Coin,CircleCheck,TrendCharts,DataLine } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons=[Coin,TrendCharts,CircleCheck,DataLine]
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const list=ref<any[]>([]);const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:'',investmentType:''})
const stats=ref([{label:'投入总次数',value:0,color:'#dc2626',bgColor:'rgba(220,38,38,0.1)'},{label:'总金额(元)',value:'0',color:'#f59e0b',bgColor:'rgba(245,158,11,0.1)'},{label:'平均金额',value:'0',color:'#7c3aed',bgColor:'rgba(124,58,237,0.1)'},{label:'设备投入',value:'0',color:'#0891b2',bgColor:'rgba(8,145,178,0.1)'}])
const form=reactive({projectName:'',investmentType:'',amount:0,budgetSource:'',investmentDate:null,responsibleDepartment:'',responsiblePerson:'',vendor:'',description:'',effectEvaluation:''})
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/investments',{params:{page:p.page,pageSize:p.pageSize,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{}finally{loading.value=false}}
const fetchStats=async()=>{try{const r=await request.get('/api/investments/stats');if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;stats.value[1].value=Number(d.totalAmount).toLocaleString();stats.value[2].value=Number(d.avgAmount).toLocaleString();const bt=d.byType||[];const eq=bt.find((t:any)=>t.investment_type==='设备');stats.value[3].value=eq?Number(eq.amount).toLocaleString():'0'}}catch{}}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{projectName:'',investmentType:'',amount:0,budgetSource:'',investmentDate:null,responsibleDepartment:'',responsiblePerson:'',vendor:'',description:'',effectEvaluation:''});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{projectName:row.project_name,investmentType:row.investment_type||'',amount:row.amount||0,budgetSource:row.budget_source||'',investmentDate:row.investment_date||null,responsibleDepartment:row.responsible_department||'',responsiblePerson:row.responsible_person||'',vendor:row.vendor||'',description:row.description||'',effectEvaluation:row.effect_evaluation||''});dialogVisible.value=true}
const handleSave=async()=>{if(!form.projectName||!form.investmentType||!form.amount)return ElMessage.warning('项目名称、类型和金额不能为空');saving.value=true;try{if(isEdit.value){await request.put(`/api/investments/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/investments',form);ElMessage.success('创建成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.project_name===form.projectName);return item?.id}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/investments/${row.id}`);ElMessage.success('已删除');fetch();fetchStats()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
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
