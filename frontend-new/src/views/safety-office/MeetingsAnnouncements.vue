<template>
  <div class="safety-office-page">
    <PageHeader title="会议与公告" description="安全会议记录与通知公告发布" :icon="ChatLineSquare">
      <template #actions><el-button type="primary" @click="handleAdd('announcement')"><el-icon><Plus /></el-icon>发布公告</el-button><el-button @click="handleAdd('meeting')"><el-icon><Plus /></el-icon>记录会议</el-button></template>
    </PageHeader>
    <el-tabs v-model="activeTab" @tab-change="fetch"><el-tab-pane label="公告通知" name="announcement" /><el-tab-pane label="会议记录" name="meeting" /></el-tabs>
    <div class="table-card">
      <div class="table-toolbar"><el-input v-model="search.keyword" placeholder="搜索标题" clearable style="width:260px" @clear="fetch" @keyup.enter="fetch" /><el-button type="primary" @click="fetch">查询</el-button></div>
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip>
          <template #default="{row}"><span v-if="row.is_top" style="color:var(--danger);margin-right:4px">[置顶]</span>{{row.title}}</template>
        </el-table-column>
        <el-table-column prop="content_type" label="类型" width="80"><template #default="{row}"><el-tag :type="row.content_type==='announcement'?'success':'primary'" size="small">{{row.content_type==='announcement'?'公告':'会议'}}</el-tag></template></el-table-column>
        <el-table-column label="内容摘要" min-width="200" show-overflow-tooltip><template #default="{row}">{{ (row.content||'').slice(0,50) }}</template></el-table-column>
        <el-table-column prop="priority" label="优先级" width="80"><template #default="{row}"><el-tag :type="row.priority==='urgent'?'danger':row.priority==='important'?'warning':'info'" size="small">{{{urgent:'紧急',important:'重要',normal:'普通'}[row.priority]||row.priority}}</el-tag></template></el-table-column>
        <el-table-column prop="publish_date" label="发布日期" width="100" />
        <el-table-column prop="read_count" label="阅读" width="60" align="center" />
        <el-table-column label="操作" width="200" fixed="right"><template #default="{row}"><el-button link type="primary" @click="handleEdit(row)">编辑</el-button><el-button link type="primary" @click="handlePublish(row)" v-if="!row.publish_status">发布</el-button><el-button link type="danger" @click="handleDelete(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="table-pagination"><el-pagination v-model:current-page="p.page" v-model:page-size="p.pageSize" :total="p.total" layout="total,prev,pager,next" @current-change="fetch" /></div>
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form :model="form" label-width="80px" size="small" v-loading="saving">
        <el-form-item label="标题" required><el-input v-model="form.title" /></el-form-item>
        <el-row :gutter="20"><el-col :span="8"><el-form-item label="优先级"><el-select v-model="form.priority"><el-option label="普通" value="normal" /><el-option label="重要" value="important" /><el-option label="紧急" value="urgent" /></el-select></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="置顶"><el-switch v-model="form.isTop" /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="发布日期"><el-date-picker v-model="form.publishDate" type="date" style="width:100%" value-format="YYYY-MM-DD" /></el-form-item></el-col></el-row>
        <el-form-item v-if="form.contentType==='meeting'" label="会议时间"><el-date-picker v-model="form.meetingDate" type="datetime" style="width:100%" value-format="YYYY-MM-DD HH:mm:ss" /></el-form-item>
        <el-form-item v-if="form.contentType==='meeting'" label="会议地点"><el-input v-model="form.meetingLocation" /></el-form-item>
        <el-form-item v-if="form.contentType==='meeting'" label="组织者"><el-input v-model="form.organizer" /></el-form-item>
        <el-form-item v-if="form.contentType==='meeting'" label="会议纪要"><el-input v-model="form.minutes" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="form.content" type="textarea" :rows="5" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave" :loading="saving">{{isEdit?'更新':'创建'}}</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive,computed,onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus,ChatLineSquare,CircleCheck,Clock,Warning } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import request from '@/utils/request'
const loading=ref(false);const saving=ref(false);const dialogVisible=ref(false);const isEdit=ref(false);const activeTab=ref('announcement')
const list=ref<any[]>([]);const p=reactive({page:1,pageSize:20,total:0});const search=reactive({keyword:''})
const dialogTitle=computed(()=>{const t=form.contentType==='announcement'?'公告':'会议';return isEdit.value?`编辑${t}`:`新增${t}`})
const form=reactive({contentType:'announcement',title:'',content:'',meetingDate:null,meetingLocation:'',organizer:'',minutes:'',priority:'normal',isTop:false,publishDate:null})
const fetch=async()=>{loading.value=true;try{const r=await request.get('/api/meetings',{params:{page:p.page,pageSize:p.pageSize,contentType:activeTab.value,...search}});if(r.data?.success){list.value=r.data.data.list||[];p.total=r.data.data.pagination?.total||0}}catch{}finally{loading.value=false}}
const handleAdd=(type:string)=>{isEdit.value=false;Object.assign(form,{contentType:type,title:'',content:'',meetingDate:null,meetingLocation:'',organizer:'',minutes:'',priority:'normal',isTop:false,publishDate:null});dialogVisible.value=true}
const handleEdit=(row:any)=>{isEdit.value=true;Object.assign(form,{contentType:row.content_type,title:row.title,content:row.content||'',meetingDate:row.meeting_date||null,meetingLocation:row.meeting_location||'',organizer:row.organizer||'',minutes:row.minutes||'',priority:row.priority||'normal',isTop:!!row.is_top,publishDate:row.publish_date||null});dialogVisible.value=true}
const handleSave=async()=>{if(!form.title)return ElMessage.warning('标题不能为空');saving.value=true;try{if(isEdit.value){await request.put(`/api/meetings/${getEditId()}`,form);ElMessage.success('更新成功')}else{await request.post('/api/meetings',form);ElMessage.success('创建成功')}dialogVisible.value=false;fetch()}catch(e:any){ElMessage.error(e?.response?.data?.message||'操作失败')}finally{saving.value=false}}
const getEditId=()=>{const item=list.value.find((r:any)=>r.title===form.title);return item?.id}
const handlePublish=async(row:any)=>{try{await request.put(`/api/meetings/${row.id}`,{publishStatus:1,publishDate:new Date().toISOString().split('T')[0]});ElMessage.success('已发布');fetch()}catch{ElMessage.error('发布失败')}}
const handleDelete=async(row:any)=>{try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'});await request.delete(`/api/meetings/${row.id}`);ElMessage.success('已删除');fetch()}catch(e:any){if(e!=='cancel')ElMessage.error('删除失败')}}
onMounted(()=>{fetch()})
</script>
<style scoped>
.safety-office-page{padding:24px;background:var(--bg);min-height:100vh}
.table-toolbar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
.table-pagination{display:flex;justify-content:flex-end;padding:16px 0}
</style>
