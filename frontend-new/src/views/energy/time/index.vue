<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="时间段名称" prop="timeName">
        <el-input
          v-model="queryParams.timeName"
          placeholder="请输入电力时间段名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['energy:time:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['energy:time:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['energy:time:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['energy:time:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            @click="handleImport"
            v-hasPermi="['energy:time:export']"
        >峰谷平预设</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <!-- <el-table height="calc(100vh - 300px)" v-loading="loading" :data="timeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="时间段名称" align="center" prop="timeName" />
      <el-table-column label="时间段类型" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="energy_electric_time_type" :value="scope.row.timeType"/>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="beginTime" width="180" />
      <el-table-column label="结束时间" align="center" prop="endTime" width="180" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['energy:time:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['energy:time:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改电力尖峰平谷时间段对话框 -->
    <!-- <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="timeRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="时间段名称" prop="timeName">
          <el-input v-model="form.timeName" placeholder="请输入电力时间段名称" />
        </el-form-item>
        <el-form-item label="时间段类型">
          <el-radio-group v-model="form.timeType">
            <el-radio
              v-for="dict in energy_electric_time_type"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-time-picker clearable
            v-model="form.beginTime"
            type="time"
            value-format="HH:mm:ss"
            placeholder="请选择开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker clearable
            v-model="form.endTime"
            type="time"
            value-format="HH:mm:ss"
            placeholder="请选择结束时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in status"
              :key="dict.value"


:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog> -->
		
		<!-- 新的代码 -->
<!--		<div class="topchoose">-->
<!--			<el-row :gutter="15">-->
<!--				<el-col :span="3">-->
<!--					<el-select v-model="province" placeholder="请选择省份">-->
<!--						<el-option-->
<!--							v-for="item in provinces"-->
<!--							:key="item.value"-->
<!--							:label="item.label"-->
<!--							:value="item.value"-->
<!--						/>-->
<!--					</el-select>-->
<!--				</el-col>-->
<!--&lt;!&ndash;				<el-col :span="3">&ndash;&gt;-->
<!--&lt;!&ndash;					<el-button type="primary">峰谷平初始化</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;				</el-col>&ndash;&gt;-->
<!--			</el-row>-->
<!--		</div>-->
		<div class="mytable">
			<el-table :data="fgpData" border style="width: 100%">
				<el-table-column prop="season" label="季节" />
				<el-table-column label="月份">
					<template #default="scope">
						<div class="months">{{ scope.row.months }}</div>
						<el-button type="primary" plain @click="setMonth(scope.row)">设置</el-button>
					</template>
				</el-table-column>
				<el-table-column label="尖">
					<template #default="scope">
						<div class="time">{{ scope.row.jian }}</div>
						<el-button type="primary" plain @click="setTimes(scope.row, 'jian')">设置</el-button>
					</template>
				</el-table-column>
				<el-table-column label="峰">
					<template #default="scope">
						<div class="time">{{ scope.row.feng }}</div>
						<el-button type="primary" plain @click="setTimes(scope.row, 'feng')">设置</el-button>
					</template>
				</el-table-column>
				<el-table-column label="谷">
					<template #default="scope">
						<div class="time">{{ scope.row.gu }}</div>
						<el-button type="primary" plain @click="setTimes(scope.row, 'gu')">设置</el-button>
					</template>
				</el-table-column>
				<el-table-column label="深谷">
					<template #default="scope">
						<div class="time">{{ scope.row.shengu }}</div>
						<el-button type="primary" plain @click="setTimes(scope.row, 'shengu')">设置</el-button>
					</template>
				</el-table-column>
				<el-table-column label="平">
					<template #default="scope">
						<div class="time">{{ scope.row.ping }}</div>
						<el-button type="primary" plain @click="setTimes(scope.row, 'ping')">设置</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		
		<div class="mydialog">
			<el-dialog
				v-model="dialogMonth"
				title="选择月份"
				width="30%"
			>
				<el-checkbox-group v-model="monthChoose" @change="monthChange">
					<el-checkbox label="1" name="type" />
					<el-checkbox label="2" name="type" />
					<el-checkbox label="3" name="type" />
					<el-checkbox label="4" name="type" />
					<el-checkbox label="5" name="type" />
					<el-checkbox label="6" name="type" />
					<el-checkbox label="7" name="type" />
					<el-checkbox label="8" name="type" />
					<el-checkbox label="9" name="type" />
					<el-checkbox label="10" name="type" />
					<el-checkbox label="11" name="type" />
					<el-checkbox label="12" name="type" />
				</el-checkbox-group>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogMonth = false">取消</el-button>
						<el-button type="primary" @click="saveMonthSet(rowid)">
							保存
						</el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog
				v-model="dialogTimes"
				title="选择时间"
				width="30%"
			>
				<el-button @click="addTimes()" style="margin: 0 0 10px;">新增</el-button>
				<el-table :data="timesData" border style="width: 100%">
					<el-table-column prop="starttime" label="开始" />
					<el-table-column prop="endtime" label="结束" />
					<el-table-column label="操作">
						<template #default="scope">
							<div class="btn blue" @click="timeEdit(scope.row, scope.$index)">编辑</div>
							<div class="btn red" @click="timedelet(scope.$index)">删除</div>
						</template>
					</el-table-column>
				</el-table>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogTimes = false">取消</el-button>
						<el-button type="primary" @click="saveTimesSet(timesrow)">
							保存
						</el-button>
					</span>
				</template>
			</el-dialog>
			<el-dialog
				v-model="TimesEdit"
				title="新增/编辑时间"
				width="30%"
			>
				<el-form-item label="开始时间">
					<el-time-picker v-model="starttime" format="HH:mm" value-format="HH:mm" />
				</el-form-item>
				<el-form-item label="结束时间">
					<el-time-picker v-model="endtime" format="HH:mm" value-format="HH:mm" />
				</el-form-item>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="TimesEdit = false">取消</el-button>
						<el-button type="primary" @click="saveTimesEdit(timeeditrow)">
							确定
						</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
  </div>
</template>

<script setup name="Time">
import { listTime, getTime, delTime, addTime, updateTime, batchinsert, batchinsertList, tableTime } from "@/api/energy/time";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status,energy_electric_time_type } = proxy.useDict('status','energy_electric_time_type');

const timeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    timeName: null,
		timeType: null,
    status: null,
		delFlag: 0,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询电力尖峰平谷时间段列表 */
function getList() {
  loading.value = true;
  listTime(queryParams.value).then(response => {
    timeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
  tableTime(queryParams.value).then(response => {
    console.log('11111',response.data)
    fgpData.value = response.data
  })
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    timeName: null,
		timeType: null,
    beginTime: null,
    endTime: null,
    deptId: null,
    status: "0",
    delFlag: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("timeRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加电力尖峰平谷时间段";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getTime(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改电力尖峰平谷时间段";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["timeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTime(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTime(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delTime(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('energy/time/export', {
    ...queryParams.value
  }, `time_${new Date().getTime()}.xlsx`)
}

/** 导入按钮操作 */
function handleImport() {
  proxy.$modal.confirm('是否确认批量新增').then(function() {
    return batchinsert(form.value);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("操作成功");
  }).catch(() => {});
}

// 新的代码
const province = ref('');
const provinces = ref([
	{value: '河北省',label: '河北省'},
	{value: '山西省',label: '山西省'},
	{value: '辽宁省',label: '辽宁省'},
	{value: '吉林省',label: '吉林省'},
	{value: '黑龙江省',label: '黑龙江省'},
	{value: '江苏省',label: '江苏省'},
	{value: '浙江省',label: '浙江省'},
	{value: '安徽省',label: '安徽省'},
	{value: '福建省',label: '福建省'},
	{value: '江西省',label: '江西省'},
	{value: '山东省',label: '山东省'},
	{value: '河南省',label: '河南省'},
	{value: '湖北省',label: '湖北省'},
	{value: '湖南省',label: '湖南省'},
	{value: '广东省',label: '广东省'},
	{value: '海南省',label: '海南省'},
	{value: '四川省',label: '四川省'},
	{value: '贵州省',label: '贵州省'},
	{value: '云南省',label: '云南省'},
	{value: '陕西省',label: '陕西省'},
	{value: '甘肃省',label: '甘肃省'},
	{value: '青海省',label: '青海省'},
	{value: '内蒙古',label: '内蒙古'},
	{value: '北京市',label: '北京市'},
	{value: '上海市',label: '上海市'},
	{value: '天津市',label: '天津市'},
	{value: '重庆市',label: '重庆市'},
	{value: '宁夏',label: '宁夏'},
	{value: '新疆',label: '新疆'},
	{value: '西藏',label: '西藏'},
	{value: '广西',label: '广西'},
	{value: '香港',label: '香港'},
	{value: '澳门',label: '澳门'},
	{value: '台湾',label: '台湾'}
]);
const fgpData = ref([
	{
		season: '春季',
		months: '',
		jian: '',
		feng: '',
		gu: '',
		shengu: '',
		ping: ''
	},{
		season: '夏季',
		months: '',
		jian: '',
		feng: '',
		gu: '',
		shengu: '',
		ping: ''
	},{
		season: '秋季',
		months: '',
		jian: '',
		feng: '',
		gu: '',
		shengu: '',
		ping: ''
	},{
		season: '冬季',
		months: '',
		jian: '',
		feng: '',
		gu: '',
		shengu: '',
		ping: ''
	}
]);
const dialogMonth = ref(false);
const monthChoose = ref([]);
const rowid = ref(null);

function setMonth(row) {
	if(row.months!=''){
		monthChoose.value = row.months.split(',');
	}else{
		monthChoose.value = []
	}
	dialogMonth.value = true;
	rowid.value = row;
}
function monthChange() {
	//console.log('change', monthChoose.value);
}
function saveMonthSet(rowid){
	dialogMonth.value = false;
	rowid.months = '';
	monthSort(monthChoose.value);
	monthChoose.value.forEach((item, index) => {
		if(index === 0){
			rowid.months += item 
		}else{
			rowid.months += ',' + item
		}
	})
}
function monthSort(arr){  //月份排序
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = 0; j < arr.length - i; j++) {
			if(arr[j] > arr[j + 1]) {
				// 交换两个数的位置
				var temp = 0;
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
	}    
	return  arr;
}

const dialogTimes = ref(false);
const TimesEdit = ref(false);
const timesData = ref([]);
const starttime = ref('');
const endtime = ref('');
const addoredit = ref('');
const timeeditrow = ref();
const timesrow = ref();
const timesname = ref();
function setTimes(row, name){
	timesData.value = [];
	timesname.value = name;
	
	if(name === 'jian'&&row.jian!=''){
		let timesarr = row.jian.split('\n');
		timesarr.forEach((item, index) => {
			timesData.value.push({
				starttime: item.split('-')[0],
				endtime:  item.split('-')[1]
			})
		})
	}
	if(name === 'feng'&&row.feng!=''){
		let timesarr = row.feng.split('\n');
		timesarr.forEach((item, index) => {
			timesData.value.push({
				starttime: item.split('-')[0],
				endtime:  item.split('-')[1]
			})
		})
	}
	if(name === 'gu'&&row.gu!=''){
		let timesarr = row.gu.split('\n');
		timesarr.forEach((item, index) => {
			timesData.value.push({
				starttime: item.split('-')[0],
				endtime:  item.split('-')[1]
			})
		})
	}
	if(name === 'shengu'&&row.shengu!=''){
		let timesarr = row.shengu.split('\n');
		timesarr.forEach((item, index) => {
			timesData.value.push({
				starttime: item.split('-')[0],
				endtime:  item.split('-')[1]
			})
		})
	}
	if(name === 'ping'&&row.ping!=''){
		let timesarr = row.ping.split('\n');
		timesarr.forEach((item, index) => {
			timesData.value.push({
				starttime: item.split('-')[0],
				endtime:  item.split('-')[1]
			})
		})
	}
	
	dialogTimes.value = true;
	timesrow.value = row;
}
function saveTimesSet(timesrow){
	dialogTimes.value = false;
	
	if(timesname.value === 'jian'){
		timesrow.jian = '';
		timesData.value.forEach((item, index) => {
			if(index === 0){
				timesrow.jian += item.starttime + '-' +  item.endtime
			}else{
				timesrow.jian += '\n' + item.starttime + '-' +  item.endtime
			}
		})
	}
	if(timesname.value === 'feng'){
		timesrow.feng = '';
		timesData.value.forEach((item, index) => {
			if(index === 0){
				timesrow.feng += item.starttime + '-' +  item.endtime
			}else{
				timesrow.feng += '\n' + item.starttime + '-' +  item.endtime
			}
		})
	}
	if(timesname.value === 'gu'){
		timesrow.gu = '';
		timesData.value.forEach((item, index) => {
			if(index === 0){
				timesrow.gu += item.starttime + '-' +  item.endtime
			}else{
				timesrow.gu += '\n' + item.starttime + '-' +  item.endtime
			}
		})
	}
	if(timesname.value === 'shengu'){
		timesrow.shengu = '';
		timesData.value.forEach((item, index) => {
			if(index === 0){
				timesrow.shengu += item.starttime + '-' +  item.endtime
			}else{
				timesrow.shengu += '\n' + item.starttime + '-' +  item.endtime
			}
		})
	}
	if(timesname.value === 'ping'){
		timesrow.ping = '';
		timesData.value.forEach((item, index) => {
			if(index === 0){
				timesrow.ping += item.starttime + '-' +  item.endtime
			}else{
				timesrow.ping += '\n' + item.starttime + '-' +  item.endtime
			}
		})
	}
  submitParam()
}
function submitParam() {
  console.log(fgpData.value)
  let param = []
  fgpData.value.forEach(item => {
    let monthArray = item.months.split(",")
    monthArray.forEach(month => {
      let jianList = item.jian.split("\n")
      let fengList = item.feng.split("\n")
      let guList = item.gu.split("\n")
      let shenguList = item.shengu.split("\n")
      let pingList = item.ping.split("\n")
      jianList.forEach(jian => {
        if (jian != '' && null != jian) {
          let time = jian.split("-")
          param.push({
            month: month,
            timeType: 0,
            timeName: '尖',
            beginTime: time[0] + ':00',
            endTime: time[1] + ':00',
            status: 0,
            delFlag: 0,
            quarter: item.season
          })
        }
      })
      fengList.forEach(feng => {
        if (feng != '' && null != feng) {
          let time = feng.split("-")
          param.push({
            month: month,
            timeType: 1,
            timeName: '峰',
            beginTime: time[0] + ':00',
            endTime: time[1] + ':00',
            status: 0,
            delFlag: 0,
            quarter: item.season
          })
        }
      })
      guList.forEach(gu => {
        if (gu != '' && null != gu) {
          let time = gu.split("-")
          param.push({
            month: month,
            timeType: 2,
            timeName: '谷',
            beginTime: time[0] + ':00',
            endTime: time[1] + ':00',
            status: 0,
            delFlag: 0,
            quarter: item.season
          })
        }
      })
      pingList.forEach(ping => {
        if (ping != '' && null != ping) {
          let time = gu.split("-")
          ping.push({
            month: month,
            timeType: 3,
            timeName: '平',
            beginTime: time[0] + ':00',
            endTime: time[1] + ':00',
            status: 0,
            delFlag: 0,
            quarter: item.season
          })
        }
      })
    })
  })
  batchinsertList(param)
}
function addTimes() {
	TimesEdit.value = true;
	starttime.value = '';
	endtime.value = '';
	addoredit.value = 'add';
}
function saveTimesEdit() {
	if(starttime.value!=''&&endtime.value!=''){
		if(addoredit.value =='add'){
			timesData.value.push({
				starttime: starttime.value,
				endtime: endtime.value
			});
		}else{
			timesData.value[timeeditrow.value].starttime = starttime.value;
			timesData.value[timeeditrow.value].endtime = endtime.value;
		}
		TimesEdit.value = false;
	}else{
		alert('请填写完整开始和结束时间！')
	}
}
function timeEdit(row, index) {
	TimesEdit.value = true;
	addoredit.value = 'edit';
	timeeditrow.value = index;
	starttime.value = row.starttime;
	endtime.value = row.endtime;
}
function timedelet(index) {
	timesData.value.splice(index, 1);
}

getList();

</script>
<style scoped lang="scss">
.toolsline{
  height: 30px;
}
.mytable{
	margin: 10px 0 0;
	.time{
		white-space: pre-line;
	}
}
.mydialog{
	
	.btn{
		display: inline-block;
		cursor: pointer;
	}
	.btn.blue{
		color: #409eff;margin-right: 10px;
	}
	.btn.red{
		color: #e60000;
	}
	
}
</style>
