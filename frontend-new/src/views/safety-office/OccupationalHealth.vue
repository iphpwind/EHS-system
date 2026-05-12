<template>
  <div class="safety-office-page">
    <PageHeader title="职业健康" description="员工职业健康检查与档案管理" :icon="Avatar">
      <template #actions><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增体检记录</el-button></template>
    </PageHeader>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat,i) in stats" :key="stat.label">
        <div class="stat-icon" :style="{background:stat.bgColor,color:stat.color}"><el-icon :size="24"><component :is="statIcons[i]" /></el-icon></div>
        <div class="stat-content"><div class="stat-label">{{stat.label}}</div><div class="stat-value">{{stat.value}}</div></div>
      </div>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <el-input v-model="search.keyword" placeholder="搜索员工/编号" clearable style="width:240px" @clear="fetch" @keyup.enter="fetch" />
        <el-select v-model="search.healthType" placeholder="体检类型" clearable style="width:140px" @change="fetch"><el-option label="岗前" value="岗前" /><el-option label="在岗" value="在岗" /><el-option label="离岗" value="离岗" /><el-option label="应急" value="应急" /></el-select>
        <el-button type="primary" @click="fetch">查询</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="record_no" label="编号" width="150" />
        <el-table-column prop="user_name" label="姓名" width="100" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="health_type" label="体检类型" width="80"><template #default="{row}"><el-tag size="small">{{row.health_type}}</el-tag></template></el-table-column>
        <el-table-column prop="checkup_date" label="体检日期" width="100" />
        <el-table-column prop="checkup_organization" label="体检机构" width="160" show-overflow-tooltip />
        <el-table-column prop="is_normal" label="结果" width="70" align="center"><template #default="{row}"><el-tag :type="row.is_normal?'success':'danger'" size="small">{{row.is_normal?'正常':'异常'}}</el-tag></template></el-table-column>
        <el-table-column prop="hazard_factors" label="危害因素" width="140" show-overflow-tooltip />
        <el-table-column prop="next_checkup_date" label="下次体检" width="100" />
        <el-table-column label="操作" width="150" fixed="right"><template #default="{row}"><el-button link type="primary" @click="handleEdit(row)">编辑</el-button><el-button link type="danger" @click="handleDelete(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑体检记录':'新增体检记录'" width="700px">
      <el-form :model="form" label-width="100px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="员工" required><el-select v-model="form.userId" filterable style="width:100%"><el-option v-for="u in users" :key="u.id" :label="u.real_name" :value="u.id" /></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="体检类型" required><el-select v-model="form.healthType" style="width:100%"><el-option label="岗前" value="岗前" /><el-option label="在岗" value="在岗" /><el-option label="离岗" value="离岗" /><el-option label="应急" value="应急" /><el-option label="健康档案" value="健康档案" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="体检日期"><el-date-picker v-model="form.checkupDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col><el-col :span="12"><el-form-item label="体检机构"><el-input v-model="form.checkupOrganization" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="是否正常"><el-switch v-model="form.isNormal" /></el-form-item></el-col><el-col :span="12"><el-form-item label="下次体检"><el-date-picker v-model="form.nextCheckupDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col></el-row>
        <el-form-item label="接触危害因素"><el-input v-model="form.hazardFactors" /></el-form-item>
        <el-form-item label="体检结果"><el-input v-model="form.checkupResult" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="异常发现"><el-input v-model="form.abnormalFindings" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="医学建议"><el-input v-model="form.medicalAdvice" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,Avatar,CircleCheck,Clock,Warning } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons=[Avatar,CircleCheck,Warning,Clock]
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const list=ref<any[]>([]);const users=ref<any[]>([]);const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:'',healthType:''})
const stats=ref([{label:'体检总人次',value:0,color:'#ec4899',bgColor:'rgba(236,72,153,0.1)'},{label:'异常人次',value:0,color:'#ef4444',bgColor:'rgba(239,68,68,0.1)'},{label:'将到期体检',value:0,color:'#f59e0b',bgColor:'rgba(245,158,11,0.1)'},{label:'合格率',value:'100%',color:'#10b981',bgColor:'rgba(16,185,129,0.1)'}])
const form=reactive({userId:'',healthType:'岗前',checkupDate:null,checkupOrganization:'',checkupResult:'',hazardFactors:'',isNormal:true,abnormalFindings:'',medicalAdvice:'',nextCheckupDate:null,remark:''})
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/occupational-health',{params:{page:p.page,pageSize:p.pageSize,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{}finally{loading.value=false}}
const fetchStats=async()=>{try{const r=await request.get('/api/occupational-health/stats');if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;stats.value[1].value=d.abnormalCount;stats.value[2].value=d.upcomingCheckup;stats.value[3].value=d.totalCount>0?((d.totalCount-d.abnormalCount)/d.totalCount*100).toFixed(1)+'%':'100%'}}catch{}}
const fetchUsers=async()=>{try{const r=await request.get('/api/users');if(r.data?.success)users.value=r.data.data||[]}catch{}}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{userId:'',healthType:'岗前',checkupDate:null,checkupOrganization:'',checkupResult:'',hazardFactors:'',isNormal:true,abnormalFindings:'',medicalAdvice:'',nextCheckupDate:null,remark:''});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{userId:row.user_id,healthType:row.health_type,checkupDate:row.checkup_date||null,checkupOrganization:row.checkup_organization||'',checkupResult:row.checkup_result||'',hazardFactors:row.hazard_factors||'',isNormal:!!row.is_normal,abnormalFindings:row.abnormal_findings||'',medicalAdvice:row.medical_advice||'',nextCheckupDate:row.next_checkup_date||null,remark:row.remark||''});dialogVisible.value=true}
const handleSave=async()=>{if(!form.userId||!form.healthType)return ElMessage.warning('请选择员工和体检类型');saving.value=true;try{if(isEdit.value){await request.put(`/api/occupational-health/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/occupational-health',form);ElMessage.success('创建成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.user_id===form.userId&&r.health_type===form.healthType);return item?.id}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/occupational-health/${row.id}`);ElMessage.success('已删除');fetch();fetchStats()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
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
