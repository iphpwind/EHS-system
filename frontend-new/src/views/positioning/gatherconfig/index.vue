<template>
  <div class="app-container">
    <el-form ref="mapconfigRef" :model="form" :rules="rules" label-width="80px">
      <el-dialog :title="title" v-model="openCesium" width="90%" append-to-body>
        <h3>请按顺时针或逆时针的顺序依次鼠标左键点击边界点位，完成后点击鼠标右键完成绘制。</h3>
        <div id="cesiumContent"></div>
      </el-dialog>
      <ul class="dengjiedit">
        <li>
          <label>所属机构：</label>
          <el-input v-model="deptName" readonly/>
        </li>
        <li>
          <label>边界：</label>
          <el-input type="teaxarea" v-model="form.polygon"/>
        </li>
        <li>
          <label>地址url：</label>
          <el-input v-model="form.fileUrl"/>
        </li>
        <li>
          <label>静默区域是否显示热力图：</label>
          <el-radio-group v-model="form.isHeatMap">
            <el-radio key="0" label="0">是</el-radio>
            <el-radio key="1" label="1">否</el-radio>
          </el-radio-group>
        </li>
				<li>
          <label>边界:</label>
          <el-input type="teaxarea" v-model="form.polygon" style="width: 210px"/>
          <el-button @click="openCesiumFunc" type="primary" plain style="margin-left: 15px;">绘制边界</el-button>
        </li>
        <li>
          <label>聚集服务ip:</label>
          <el-input v-model="form.fileUrl" style="width: 210px"/>
        </li>
<!--        <li>-->
<!--          静默区域是否显示热力图:-->
<!--          <el-radio-group v-model="form.isHeatMap">-->
<!--            <el-radio key="0" label="0">是</el-radio>-->
<!--            <el-radio key="1" label="1">否</el-radio>-->
<!--          </el-radio-group>-->
<!--        </li>-->
        <li>
          <label>以任何人员为中心，半径范围在</label>
          <el-input v-model="form.radius"/>
          <label>米内，持续聚集</label>
					<el-input v-model="form.time"/>
					<label>秒</label>
        </li>
      </ul>
			<div class="warnbox">
				<h3 class="yellow">黄色预警</h3>
				<label>聚集人数</label>
				<el-input v-model="form.yellowMin" style="width: 80px"/>
				&lt; X &lt;= <el-input v-model="form.yellowMax" style="width: 80px"/>人
				<span style="margin-left: 50px;">{{form.yellowNames}}</span>
				<el-button type="primary" plain size="medium" @click="selectStaff(1)">通知人管理</el-button>
			</div>
			<div class="warnbox">
				<h3 class="orange">橙色预警</h3>
				<label>聚集人数</label>
				<el-input v-model="form.orangeMin" style="width: 80px"/>
				&lt; X &lt;= <el-input v-model="form.orangeMax" style="width: 80px"/>人
				<span style="margin-left: 50px;">{{form.orangeNames}}</span>
				<el-button type="primary" plain size="medium" @click="selectStaff(2)">通知人管理</el-button>
			</div>
			<div class="warnbox">
				<h3 class="red">红色预警</h3>
				<label>聚集人数</label>
				<el-input v-model="form.redMin" style="width: 80px"/>
				&lt; X &lt;= <el-input v-model="form.redMax" style="width: 80px"/>人
				<span style="margin-left: 50px;">{{form.redNames}}</span>
				<el-button type="primary" plain size="medium" @click="selectStaff(3)">通知人管理</el-button>
			</div>
    </el-form>
    <div class="bottomSave">
      <el-button type="primary" @click="submitForm" size="large">保存</el-button>
    </div>

    <!-- 选择通知人管理人 -->
    <el-dialog title="选择通知人管理人" v-model="visible" width="800px" top="5vh" append-to-body>
      <el-row>
        <el-table @row-click="clickRow" ref="table" :data="staffOptions" @selection-change="handleSelectionChange2"
                  height="260px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="staffNo" label="员工工号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="staffName" label="人员名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deptName" label="部门" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleStaffids">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Mapconfig">
import { listGatherConfig, getGatherconfig, delGatherconfig, addGatherconfig, updateGatherconfig } from "@/api/positioning/mapconfig";
import { listStaff, getStaff, delStaff, addStaff, updateStaff } from "@/api/system/staff";
import {getMapConfig} from "@/api/system/positioning";
import Bjt3DClass from "@/utils/Bjt3DClass";
import {getImgSrc, getLayerColor, getRiskColor} from "@/utils/pointUtil";
const { proxy } = getCurrentInstance();
const store = useStore();
const getters = computed(() => store.getters);

const open = ref(false);
const bjt3D = ref(null);
const openCesium = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const staffOptions = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptName = ref(null);
const visible = ref(false);
const nowflag = ref(0);
const tables = ref([]);
const tableNames = ref([]);

const data = reactive({
  form: {

  },
  rules: {
  },
});

const { form, rules } = toRefs(data);


/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

function wancheng() {

}

function openCesiumFunc() {
  openCesium.value = true
  getMapConfig().then(res => {
    let data = res.data;
    bjt3D.value = new Bjt3DClass();
    bjt3D.value.init('cesiumContent', data.mapAddress, data, () => {
      bjt3D.value.layer(50, '', getLayerColor(getRiskColor('低风险')), (layer, id) => {
        form.value.polygon = JSON.stringify(layer)
        openCesium.value = false
      })
    })
  })
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.staffId);
  tableNames.value = selection.map(item => item.staffName);
}

/** 查询责任人列表 **/
function getUserList(){
  listStaff().then(response => {
    staffOptions.value = response.rows;
    getInfo();
  });
}

/** 选择人员确定按钮操作 */
function handleStaffids() {
  const staffIds = tables.value.join(",");
  const staffNames = tableNames.value.join(",");
  if (staffIds == "") {
    proxy.$modal.msgError("请选择人员");
    return;
  }
  switch(nowflag.value){
    case 1:
      form.value.yellowStaffids = staffIds;
      form.value.yellowNames = staffNames;
      break;
    case 2:
      form.value.orangeStaffids = staffIds;
      form.value.orangeNames = staffNames;
      break;
    case 3:
      form.value.redStaffids = staffIds;
      form.value.redNames = staffNames;
      break;
  }
  nowflag.value = 0;
  visible.value = false;
  proxy.$refs.table.clearSelection();
}

/** 选择通知人按钮 **/
function selectStaff(item){
  visible.value = true;
  switch (item){
    case 1:
      nowflag.value = 1;
      if(form.value.yellowStaffids != null && form.value.yellowStaffids != ""){
        const yellowids = form.value.yellowStaffids.split(",");

        proxy.$nextTick(() => {
          staffOptions.value.forEach((staff) => {
            yellowids.forEach(staffId => {
              if(Number(staffId) == staff.staffId){
                proxy.$refs.table.toggleRowSelection(staff,true);
              }
            })
          });
        })
      }else{
        proxy.$refs.table.clearSelection();
      }
      break;
    case 2:
      nowflag.value = 2;
      if(form.value.orangeStaffids != null && form.value.orangeStaffids != ""){
        const orangeids = form.value.orangeStaffids.split(",");

        proxy.$nextTick(() => {
          staffOptions.value.forEach((staff) => {
            orangeids.forEach(staffId => {
              if(Number(staffId) == staff.staffId){
                proxy.$refs.table.toggleRowSelection(staff,true);
              }
            })
          });
        })
      }else{
        proxy.$refs.table.clearSelection();
      }
      break;
    case 3:
      nowflag.value = 3;
      if(form.value.redStaffids != null && form.value.redStaffids != ""){
        const redids = form.value.redStaffids.split(",");

        proxy.$nextTick(() => {
          staffOptions.value.forEach((staff) => {
            redids.forEach(staffId => {
              if(Number(staffId) == staff.staffId){
                proxy.$refs.table.toggleRowSelection(staff,true);
              }
            })
          });
        })
      }else{
        proxy.$refs.table.clearSelection();
      }
      break;
  }
}

function getInfo(){
  listGatherConfig().then(response => {
    if(response.rows.length>0){
      if(response.rows[0].yellowStaffids != null && response.rows[0].yellowStaffids != ""){
        response.rows[0].yellowArray = response.rows[0].yellowStaffids.split(",");
        var yellowNames = [];
        for(let id of response.rows[0].yellowArray){
          for(let staff of staffOptions.value){
            if(Number(id) == staff.staffId){
              yellowNames.push(staff.staffName);
            }
          }
        }
        response.rows[0].yellowNames = yellowNames.join(',');
      }
      if(response.rows[0].orangeStaffids != null && response.rows[0].orangeStaffids != ""){
        response.rows[0].orangeArray = response.rows[0].orangeStaffids.split(",");
        var orangeNames = [];
        for(let id of response.rows[0].orangeArray){
          for(let staff of staffOptions.value){
            if(Number(id) == staff.staffId){
              orangeNames.push(staff.staffName);
            }
          }
        }
        response.rows[0].orangeNames = orangeNames.join(',');
      }
      if(response.rows[0].redStaffids != null && response.rows[0].redStaffids != ""){
        response.rows[0].redArray = response.rows[0].redStaffids.split(",");
        var redNames = [];
        for(let id of response.rows[0].redArray){
          for(let staff of staffOptions.value){
            if(Number(id) == staff.staffId){
              redNames.push(staff.staffName);
            }
          }
        }
        response.rows[0].redNames = redNames.join(',');
      }
      form.value = response.rows[0];
    }
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["mapconfigRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateGatherconfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addGatherconfig(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

getUserList();
form.value.isHeatMap = '0';
deptName.value = store.getters.user.thirdDeptName==null?store.getters.user.dept.deptName:store.getters.user.thirdDeptName
form.value.deptId = store.getters.user.thirdDeptId==null?store.getters.user.dept.deptId:store.getters.user.thirdDeptId

</script>

<style scoped lang="scss">

	.app-container{
		height: calc(100vh - 84px);
		background: #f9f9f9;
		padding: 10px;
	}

#cesiumContent {
  width: 100%;
  height: 700px;
}
.dengjiedit{
  list-style: none;
	background: #fff;
	margin: 0 0 15px;padding: 15px 0;
  li{
    margin: 0 10px 15px
  }
	label{
		font-size: 14px;color: #555;padding: 0 10px;
		min-width: 100px;
		display: inline-block;
		line-height: 32px;
	}
	label.el-radio{
		min-width: auto;
	}
  :deep .el-select{
    display: inline-block;width: 100px;
    margin: 0 5px;
  }
	:deep .el-input{
		width: 220px;
	}
}
.warnbox{
	background: #fff;margin: 10px 0;padding: 15px;
	font-size: 14px;color: #555;
	h3{
		margin: 0 0 20px;font-size: 16px;font-weight: bold;
		position: relative;padding-left: 24px;color: #333;
	}
	h3::before{
		content: '';width: 15px;height: 15px;border-radius: 50%;
		position: absolute;left: 0;top: 0;
	}
	h3.yellow::before{
		background: #e4c600;
	}
	h3.orange::before{
		background: #e48b00;
	}
	h3.red::before{
		background: #e40000;
	}
	label{
		font-size: 14px;color: #555;
	}
	:deep .el-input__inner{
		margin: 0 10px;
	}
}
.bottomSave{
	text-align: center;margin: 25px 0 0;
	:deep .el-button{
		width: 300px;
	}
	
}

</style>
