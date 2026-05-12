<template>
  <div class="safety-office-page">
    <PageHeader title="目标与责任书" description="安全生产目标管理与责任书签订" :icon="Flag">
      <template #actions>
        <el-button @click="handleAddTemplate"><el-icon><Document /></el-icon>模板管理</el-button>
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增目标</el-button>
      </template>
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
        <el-select v-model="search.targetType" placeholder="类型" clearable style="width:140px" @change="fetch"><el-option label="年度目标" value="年度目标" /><el-option label="季度目标" value="季度目标" /><el-option label="专项目标" value="专项目标" /><el-option label="责任书" value="责任书" /></el-select>
        <el-button type="primary" @click="fetch">查询</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="target_no" label="编号" width="150" />
        <el-table-column prop="title" label="标题/名称" min-width="200" />
        <el-table-column prop="target_type" label="类型" width="80"><template #default="{row}"><el-tag size="small">{{row.target_type}}</el-tag></template></el-table-column>
        <el-table-column prop="target_year" label="年度" width="70" align="center" />
        <el-table-column prop="responsible_department" label="责任部门" width="120" />
        <el-table-column prop="responsible_person" label="责任人" width="100" />
        <el-table-column prop="signing_date" label="签订日期" width="100" />
        <el-table-column prop="expiry_date" label="到期日期" width="100" />
        <el-table-column prop="completion_rate" label="完成率" width="80" align="center"><template #default="{row}"><el-progress :percentage="row.completion_rate||0" :stroke-width="12" size="small" /></template></el-table-column>
        <el-table-column label="签订状态" width="90" align="center">
          <template #default="{row}">
            <el-tag :type="getSignStatus(row).type" size="small">{{getSignStatus(row).text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{row}">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.target_type==='责任书'&&row.status!==5" link type="success" size="small" @click="handleInitiateSign(row)">发起签订</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑目标':'新增目标'" width="700px">
      <el-form :model="form" label-width="110px" size="small" v-loading="saving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="标题" required><el-input v-model="form.title" /></el-form-item></el-col><el-col :span="12"><el-form-item label="类型" required><el-select v-model="form.targetType" style="width:100%"><el-option label="年度目标" value="年度目标" /><el-option label="季度目标" value="季度目标" /><el-option label="专项目标" value="专项目标" /><el-option label="责任书" value="责任书" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="8"><el-form-item label="年度"><el-input-number v-model="form.targetYear" :min="2020" :max="2030" style="width:100%" /></el-form-item></el-col><el-col :span="8"><el-form-item label="签订日期"><el-date-picker v-model="form.signingDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col><el-col :span="8"><el-form-item label="到期日期"><el-date-picker v-model="form.expiryDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="责任部门"><el-input v-model="form.responsibleDepartment" /></el-form-item></el-col><el-col :span="12"><el-form-item label="责任人"><el-input v-model="form.responsiblePerson" /></el-form-item></el-col></el-row>
        <el-form-item label="目标内容"><el-input v-model="form.targetContent" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>

    <!-- 模板管理弹窗 -->
    <el-dialog v-model="tmplVisible" :title="tmplIsEdit?'编辑模板':'新增模板'" width="650px">
      <el-form :model="tmplForm" label-width="100px" size="small" v-loading="tmplSaving">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="模板名称" required><el-input v-model="tmplForm.title" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="类型"><el-select v-model="tmplForm.targetType" style="width:100%"><el-option label="安全目标" value="安全目标" /><el-option label="责任书" value="责任书" /><el-option label="承诺书" value="承诺书" /></el-select></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="适用岗位"><el-input v-model="tmplForm.positionType" placeholder="如:车间主任/安全员" /></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="适用部门"><el-input v-model="tmplForm.department" /></el-form-item></el-col></el-row>
        <el-form-item label="模板内容"><el-input v-model="tmplForm.content" type="textarea" :rows="6" /></el-form-item>
        <el-form-item label="文件链接"><el-input v-model="tmplForm.fileUrl" placeholder="上传模板文件后的URL" /></el-form-item>
      </el-form>
      <div style="margin-top:12px">
        <el-table :data="tmplList" stripe size="small" max-height="200" v-if="!tmplIsEdit && tmplList.length">
          <el-table-column prop="template_no" label="编号" width="130" />
          <el-table-column prop="title" label="模板名称" min-width="150" />
          <el-table-column prop="position_type" label="适用岗位" width="120" />
          <el-table-column label="操作" width="100">
            <template #default="{row}"><el-button link type="primary" size="small" @click="handleEditTemplate(row)">编辑</el-button><el-button link type="danger" size="small" @click="handleDeleteTemplate(row)">删除</el-button></template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="!tmplIsEdit && tmplP.total>tmplP.pageSize" v-model:current-page="tmplP.page" v-model:page-size="tmplP.pageSize" :total="tmplP.total" small layout="total,prev,pager,next" @current-change="fetchTemplates" style="margin-top:8px" />
      </div>
      <template #footer><el-button @click="tmplVisible=false">关闭</el-button><el-button type="primary" @click="handleSaveTemplate" :loading="tmplSaving">{{tmplIsEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>

    <!-- 发起签订弹窗 -->
    <el-dialog v-model="signVisible" title="发起签订" width="500px">
      <el-form label-width="100px" size="small">
        <el-form-item label="选择模板">
          <el-select v-model="signTemplateId" placeholder="可不选模板" clearable style="width:100%">
            <el-option v-for="t in tmplList" :key="t.id" :label="t.title" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标用户" required>
          <el-select v-model="signUserId" placeholder="选择责任人" style="width:100%">
            <el-option v-for="u in userList" :key="u.id" :label="`${u.real_name||u.name||u.username} (${u.department||'-'})`" :value="u.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="signVisible=false">取消</el-button><el-button type="primary" @click="handleDoInitiate">确认发起</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,onMounted } from 'vue'
import { ElMessage,ElMessageBox,ElInput } from 'element-plus'
import { Plus,Flag,CircleCheck,Clock,DataAnalysis,Upload,Document } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const statIcons=[Flag,CircleCheck,DataAnalysis,Clock]
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false)
const list=ref<any[]>([]);const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:'',targetType:''})
const stats=ref([{label:'目标总数',value:0,color:'#dc2626',bgColor:'rgba(220,38,38,0.1)'},{label:'已完成',value:0,color:'#10b981',bgColor:'rgba(16,185,129,0.1)'},{label:'执行中',value:0,color:'#3b82f6',bgColor:'rgba(59,130,246,0.1)'},{label:'平均完成率',value:'0%',color:'#7c3aed',bgColor:'rgba(124,58,237,0.1)'}])
const form=reactive({title:'',targetType:'',targetYear:new Date().getFullYear(),responsibleDepartment:'',responsiblePerson:'',signingDate:null,expiryDate:null,targetContent:'',remark:''})

// 模板管理
const tmplVisible=ref(false);const tmplList=ref<any[]>([]);const tmplForm=reactive({title:'',targetType:'责任书',positionType:'',department:'',content:'',fileUrl:''})
const tmplSaving=ref(false);const tmplIsEdit=ref(false);const tmplP=reactive({page:1,pageSize:50,total:0})
const userList=ref<any[]>([])

// 签订
const signVisible=ref(false);const signTargetId=ref(0);const signTemplateId=ref('');const signUserId=ref('')

const fetch=async()=>{
  loading.value=true;try{
    const r=await request.get('/api/targets',{params:{page:p.page,pageSize:p.pageSize,...search}})
    if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}
  }catch(e:any){console.error(e)}finally{loading.value=false}}
const fetchStats=async()=>{try{
  const r=await request.get('/api/targets/stats')
  if(r.data?.success){const d=r.data.data;stats.value[0].value=d.totalCount;const bs=d.byStatus||[]
  stats.value[1].value=bs.find((s:any)=>s.status==3)?.count||0;stats.value[2].value=bs.find((s:any)=>s.status==2)?.count||0
  stats.value[3].value=d.avgCompletionRate?Number(d.avgCompletionRate).toFixed(1)+'%':'0%'}
}catch(e:any){console.error(e)}}
const handleAdd=()=>{isEdit.value=false;Object.assign(form,{title:'',targetType:'',targetYear:new Date().getFullYear(),responsibleDepartment:'',responsiblePerson:'',signingDate:null,expiryDate:null,targetContent:'',remark:''});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{title:row.title,targetType:row.target_type||'',targetYear:row.target_year||new Date().getFullYear(),responsibleDepartment:row.responsible_department||'',responsiblePerson:row.responsible_person||'',signingDate:row.signing_date||null,expiryDate:row.expiry_date||null,targetContent:row.target_content||'',remark:row.remark||''});dialogVisible.value=true}
const handleSave=async()=>{if(!form.title||!form.targetType)return ElMessage.warning('标题和类型不能为空');saving.value=true;try{if(isEdit.value){await request.put(`/api/targets/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/targets',form);ElMessage.success('创建成功')}dialogVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.title===form.title);return item?.id}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/targets/${row.id}`);ElMessage.success('已删除');fetch();fetchStats()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
const getSignStatus=(row:any)=>{if(row.status===5)return{type:'success',text:'已签订'};return{type:'info',text:'未签订'}}
const getSignStatusValue=(row:any)=>{return row.status===5?'已签订':'未签订'}

// ===== 模板管理 =====
const fetchTemplates=async()=>{
  try{const r=await request.get('/api/targets/templates/list',{params:{page:tmplP.page,pageSize:tmplP.pageSize}})
  if(r.data?.success){tmplList.value=r.data.data.list||[];tmplP.total=r.data.data.pagination?.total||0}}catch(e:any){console.error(e)}}
const handleAddTemplate=()=>{tmplIsEdit.value=false;Object.assign(tmplForm,{title:'',targetType:'责任书',positionType:'',department:'',content:'',fileUrl:''});tmplVisible.value=true}
const handleEditTemplate=(row:any)=>{tmplIsEdit.value=true;Object.assign(tmplForm,{title:row.title,targetType:row.target_type||'责任书',positionType:row.position_type||'',department:row.department||'',content:row.content||'',fileUrl:row.file_url||''});tmplVisible.value=true;tmplForm._id=row.id}
const handleSaveTemplate=async()=>{if(!tmplForm.title)return ElMessage.warning('模板名称必填');tmplSaving.value=true;try{if(tmplForm._id){await request.put(`/api/targets/templates/${tmplForm._id}`,tmplForm);ElMessage.success('模板更新成功')}else{await request.post('/api/targets/templates',tmplForm);ElMessage.success('模板创建成功')}tmplVisible.value=false;fetchTemplates()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{tmplSaving.value=false}}
const handleDeleteTemplate=async(row:any)=>{try{await ElMessageBox.confirm('确定删除此模板？');await request.delete(`/api/targets/templates/${row.id}`);ElMessage.success('已删除');fetchTemplates()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}

// ===== 签订流程 =====
const fetchUsers=async()=>{try{const r=await request.get('/api/users',{params:{pageSize:100}});if(r.data?.success)userList.value=r.data.data.list||[]}catch{}}
const handleInitiateSign=(row:any)=>{signTargetId.value=row.id;signTemplateId.value='';signUserId.value='';fetchUsers();fetchTemplates();signVisible.value=true}
const handleDoInitiate=async()=>{if(!signUserId.value)return ElMessage.warning('请选择目标用户');try{await request.post('/api/targets/signings/initiate',{targetId:signTargetId.value,templateId:signTemplateId.value||null,targetUserId:signUserId.value});ElMessage.success('已发起签订');signVisible.value=false;fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'发起失败')}}
const handleApproveSign=async(row:any)=>{try{await request.post(`/api/targets/signings/${row._signId}/approve`);ElMessage.success('已批准');fetch();fetchStats()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}}

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
