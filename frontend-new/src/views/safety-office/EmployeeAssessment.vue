<template>
  <div class="safety-office-page">
    <PageHeader title="员工考核" description="员工安全绩效考核管理" :icon="UserFilled">
      <template #actions><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增考核</el-button></template>
    </PageHeader>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat,i) in stats" :key="stat.label">
        <div class="stat-icon" :style="{background:stat.bgColor,color:stat.color}"><el-icon :size="24"><component :is="statIcons[i]" /></el-icon></div>
        <div class="stat-content"><div class="stat-label">{{stat.label}}</div><div class="stat-value">{{stat.value}}</div></div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <el-input v-model="search.keyword" placeholder="搜索编号/姓名" clearable style="width:240px" @clear="fetch" @keyup.enter="fetch" />
        <el-select v-model="search.assessmentType" placeholder="考核类型" clearable style="width:140px" @change="fetch"><el-option label="月度" value="月度" /><el-option label="季度" value="季度" /><el-option label="年度" value="年度" /><el-option label="专项" value="专项" /></el-select>
        <el-button type="primary" @click="fetch">查询</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="assessment_no" label="编号" width="160" />
        <el-table-column prop="user_name" label="被考核人" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="assessment_type" label="类型" width="80"><template #default="{row}"><el-tag size="small">{{row.assessment_type}}</el-tag></template></el-table-column>
        <el-table-column prop="assessment_date" label="考核日期" width="110"><template #default="{row}">{{row.assessment_date||'-'}}</template></el-table-column>
        <el-table-column prop="total_score" label="总分" width="80" align="center"><template #default="{row}"><span :style="{color:row.total_score>=80?'#10b981':row.total_score>=60?'#f59e0b':'#ef4444',fontWeight:600}">{{row.total_score}}</span></template></el-table-column>
        <el-table-column prop="grade" label="等级" width="80"><template #default="{row}"><el-tag :type="row.grade==='优秀'?'success':row.grade==='良好'?'primary':row.grade==='合格'?'warning':'danger'" size="small">{{row.grade}}</el-tag></template></el-table-column>
        <el-table-column prop="violation_count" label="违章" width="60" align="center" />
        <el-table-column label="操作" width="150" fixed="right"><template #default="{row}"><el-button link type="primary" @click="handleEdit(row)">编辑</el-button><el-button link type="danger" @click="handleDelete(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑考核':'新增考核'" width="650px">
      <el-form :model="form" label-width="100px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="被考核人" required><el-select v-model="form.userId" filterable style="width:100%" placeholder="选择员工"><el-option v-for="u in users" :key="u.id" :label="u.real_name" :value="u.id" /></el-select></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="考核类型" required><el-select v-model="form.assessmentType" style="width:100%"><el-option label="月度" value="月度" /><el-option label="季度" value="季度" /><el-option label="年度" value="年度" /><el-option label="专项" value="专项" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="8"><el-form-item label="安全知识"><el-input-number v-model="form.safetyKnowledge" :min="0" :max="100" style="width:100%" /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="安全操作"><el-input-number v-model="form.safetyOperation" :min="0" :max="100" style="width:100%" /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="安全态度"><el-input-number v-model="form.safetyAttitude" :min="0" :max="100" style="width:100%" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="违章次数"><el-input-number v-model="form.violationCount" :min="0" style="width:100%" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="发现隐患数"><el-input-number v-model="form.hiddenDangerFound" :min="0" style="width:100%" /></el-form-item></el-col></el-row>
        <el-form-item label="考核日期"><el-date-picker v-model="form.assessmentDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="考核内容"><el-input v-model="form.assessmentContent" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="改进建议"><el-input v-model="form.improvementSuggestion" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,UserFilled,CircleCheck,Warning,Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons = [UserFilled,CircleCheck,Star,Warning]
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const list=ref<any[]>([]);const users=ref<any[]>([])
const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:'',assessmentType:''})
const stats=ref([{label:'考核总数',value:0,color:'#1e40af',bgColor:'rgba(30,64,175,0.1)'},{label:'平均分',value:'0',color:'#10b981',bgColor:'rgba(16,185,129,0.1)'},{label:'优秀率',value:'0%',color:'#7c3aed',bgColor:'rgba(124,58,237,0.1)'},{label:'不合格',value:0,color:'#ef4444',bgColor:'rgba(239,68,68,0.1)'}])
const form=reactive({userId:'',assessmentType:'',assessmentDate:null,safetyKnowledge:0,safetyOperation:0,safetyAttitude:0,violationCount:0,hiddenDangerFound:0,assessmentContent:'',improvementSuggestion:''})
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/assessments',{params:{page:p.page,pageSize:p.pageSize,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{ElMessage.error('加载失败')}finally{loading.value=false}}
const fetchStats=async()=>{try{const r=await request.get('/api/assessments/stats');if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;stats.value[1].value=d.avgScore?Number(d.avgScore).toFixed(1):'0';const g=d.gradeDistribution||[];const total=Math.max(g.reduce((s:number,t:any)=>s+t.count,0),1);const excellent=g.find((t:any)=>t.grade==='优秀');stats.value[2].value=excellent?((excellent.count/total*100).toFixed(1)+'%'):'0%';const fail=g.find((t:any)=>t.grade==='不合格');stats.value[3].value=fail?.count||0}}catch{}}
const fetchUsers=async()=>{try{const r=await request.get('/api/users');if(r.data?.success)users.value=r.data.data||[]}catch{}}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{userId:'',assessmentType:'',assessmentDate:null,safetyKnowledge:0,safetyOperation:0,safetyAttitude:0,violationCount:0,hiddenDangerFound:0,assessmentContent:'',improvementSuggestion:''});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{userId:row.user_id,assessmentType:row.assessment_type,assessmentDate:row.assessment_date||null,safetyKnowledge:row.safety_knowledge||0,safetyOperation:row.safety_operation||0,safetyAttitude:row.safety_attitude||0,violationCount:row.violation_count||0,hiddenDangerFound:row.hidden_danger_found||0,assessmentContent:row.assessment_content||'',improvementSuggestion:row.improvement_suggestion||''});dialogVisible.value=true}
const handleSave=async()=>{if(!form.userId||!form.assessmentType)return ElMessage.warning('请选择被考核人和考核类型');saving.value=true;try{if(isEdit.value){await request.put(`/api/assessments/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/assessments',form);ElMessage.success('创建成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.user_id===form.userId&&r.assessment_type===form.assessmentType);return item?.id}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/assessments/${row.id}`);ElMessage.success('已删除');fetch();fetchStats()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
onMounted(()=>{fetch();fetchStats();fetchUsers()})
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
