<template>
  <div class="report" v-loading="loading">
    <button class="topbtn" @click="edit" v-if="!editFlag">编辑</button>
    <button class="topbtn" @click="cancel" v-if="editFlag"  style="background-color: grey;">取消</button>
    <button class="topbtn" @click="submitForm" v-if="editFlag">保存</button>
    <div class="reportbox" id="myprint">
      <div class="tit">企业基础信息</div>
      <table>
        <tr>
          <td colspan="4" class="property">企业名称</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.name }}<el-input v-if="editFlag" v-model="form.name"></el-input></td>
          <td colspan="4" class="property">成立日期</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.establishDate }}<el-date-picker v-if="editFlag" v-model="form.establishDate"></el-date-picker></td>
        </tr>
        <tr>
          <td colspan="4" class="property">企业id</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.code }}<el-input v-if="editFlag" v-model="form.code"></el-input></td>
          <td colspan="4" class="property">法定代表人</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.legalRepresentative }}<el-input v-if="editFlag" v-model="form.legalRepresentative"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">统一社会信用代码</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.socialCreditCode }}<el-input v-if="editFlag" v-model="form.socialCreditCode"></el-input></td>
          <td colspan="4" class="property">企业固定电话</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.fixedPhone }}<el-input v-if="editFlag" v-model="form.fixedPhone"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">行政区划</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.administrativeArea }}<el-input v-if="editFlag" v-model="form.administrativeArea"></el-input></td>
          <td colspan="4" class="property">安全值班电话</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyDutyPhone }}<el-input v-if="editFlag" v-model="form.safetyDutyPhone"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">所在省</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.provinceName }}
						<el-select v-if="editFlag" v-model="form.provinceId" clear @change="getCityList">
							<el-option
									v-for="item in provinceList"
									:key="item.areaid"
									:label="item.areaname"
									:value="item.areaid"
							/>
						</el-select>
					</td>
          <td colspan="4" class="property">电子邮箱</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.email }}<el-input v-if="editFlag" v-model="form.email"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">所在市</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.cityName }}
						<el-select v-if="editFlag" v-model="form.cityId" clear @change="getAreaList">
							<el-option
									v-for="item in cityList"
									:key="item.areaid"
									:label="item.areaname"
									:value="item.areaid"
							/>
						</el-select>
					</td>
          <td colspan="4" class="property">联系QQ号</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.qq }}<el-input v-if="editFlag" v-model="form.qq"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">所在县（市、区）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.areaName }}
						<el-select v-if="editFlag" v-model="form.areaId" clear>
							<el-option
									v-for="item in areaList"
									:key="item.areaid"
									:label="item.areaname"
									:value="item.areaid"
							/>
						</el-select>
					</td>
          <td colspan="4" class="property">官方网站地址</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.officialWebsiteAddress }}<el-input v-if="editFlag" v-model="form.officialWebsiteAddress"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">所在乡镇（街道）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.township }}<el-input v-if="editFlag" v-model="form.township"></el-input></td>
          <td colspan="4" class="property">单位传真</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.fax }}<el-input v-if="editFlag" v-model="form.fax"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">所在村（社区）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.community }}<el-input v-if="editFlag" v-model="form.community"></el-input></td>
          <td colspan="4" class="property">邮政编码</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.postCode }}<el-input v-if="editFlag" v-model="form.postCode"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">所在园区（开发区）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.park }}<el-input v-if="editFlag" v-model="form.park"></el-input></td>
          <td colspan="4" class="property">经营状态</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.businessStatus }}<el-input v-if="editFlag" v-model="form.businessStatus"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">工商注册地址</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.registrationAddress }}<el-input v-if="editFlag" v-model="form.registrationAddress"></el-input></td>
          <td colspan="4" class="property">注册资金（万元）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.registeredCapital }}<el-input v-if="editFlag" v-model="form.registeredCapital"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">生产经营地址</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.operationAddress }}<el-input v-if="editFlag" v-model="form.operationAddress"></el-input></td>
          <td colspan="4" class="property">占地面积（m²）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.floorSpace }}<el-input v-if="editFlag" v-model="form.floorSpace"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">经营范围</td>
          <td colspan="20" class="content2">{{ editFlag ? "":form.businessScope }}<el-input v-if="editFlag" v-model="form.businessScope"></el-input></td>
        </tr>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="4" class="property">主要负责人</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.head }}<el-input v-if="editFlag" v-model="form.head"></el-input></td>
          <td colspan="4" class="property">特种作业人员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.specialOperatorNum }}<el-input v-if="editFlag" v-model="form.specialOperatorNum"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">主要负责人固定电话</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.headFixedPhone }}<el-input v-if="editFlag" v-model="form.headFixedPhone"></el-input></td>
          <td colspan="4" class="property">专职安全生产管理人员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.fullTimeSafetyManagerNum }}<el-input v-if="editFlag" v-model="form.fullTimeSafetyManagerNum"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">主要负责人移动电话</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.headPhone }}<el-input v-if="editFlag" v-model="form.headPhone"></el-input></td>
          <td colspan="4" class="property">兼职安全生产管理人员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.partTimeSafetyManagerNum }}<el-input v-if="editFlag" v-model="form.partTimeSafetyManagerNum"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">主要负责人电子邮箱</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.headEmail }}<el-input v-if="editFlag" v-model="form.headEmail"></el-input></td>
          <td colspan="4" class="property">专职应急管理人员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.fullTimeContingencyManagerNum }}<el-input v-if="editFlag" v-model="form.fullTimeContingencyManagerNum"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">安全负责人</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyManager }}<el-input v-if="editFlag" v-model="form.safetyManager"></el-input></td>
          <td colspan="4" class="property">注册安全工程师人员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.registeredSafetyEngineerNum }}<el-input v-if="editFlag" v-model="form.registeredSafetyEngineerNum"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">安全负责人固定电话</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyFixedPhone }}<el-input v-if="editFlag" v-model="form.safetyFixedPhone"></el-input></td>
          <td colspan="4" class="property">是否有专门安全机构</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyOrganizationExist == 0 ? "否":"是" }}
						<el-select v-if="editFlag" v-model="form.safetyOrganizationExist" clear>
							<el-option key="0" label="否" value="0"/>
							<el-option key="1" label="是" value="1"/>
						</el-select>
					</td>
        </tr>
        <tr>
          <td colspan="4" class="property">安全负责人移动电话</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyPhone }}<el-input v-if="editFlag" v-model="form.safetyPhone"></el-input></td>
          <td colspan="4" class="property">安全负责人电子邮箱</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyEmail }}<el-input v-if="editFlag" v-model="form.safetyEmail"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">安全管理机构名称</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyOrganization }}<el-input v-if="editFlag" v-model="form.safetyOrganization"></el-input></td>
          <td colspan="4" class="property">安全管理机构职责</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyOrganizationResponsibility }}<el-input v-if="editFlag" v-model="form.safetyOrganizationResponsibility"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">从业人员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.employeesNum }}<el-input v-if="editFlag" v-model="form.employeesNum"></el-input></td>
          <td colspan="4" class="property">安全管理机构成员数量</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyOrganizationMemberNum }}<el-input v-if="editFlag" v-model="form.safetyOrganizationMemberNum"></el-input></td>
        </tr>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="4" class="property">企业规模</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.enterpriseSize }}<el-input v-if="editFlag" v-model="form.enterpriseSize"></el-input></td>
          <td colspan="4" class="property">经济类型大类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.economicCategoryLarge }}<el-input v-if="editFlag" v-model="form.economicCategoryLarge"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">规模情况</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.scaleSituation }}<el-input v-if="editFlag" v-model="form.scaleSituation"></el-input></td>
          <td colspan="4" class="property">经济类型小类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.economicCategoryMinor }}<el-input v-if="editFlag" v-model="form.economicCategoryMinor"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">是否有母公司</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.parentCompanyExist == 0 ? "否":"是" }}
						<el-select v-if="editFlag" v-model="form.parentCompanyExist" clear>
							<el-option key="0" label="否" value="0"/>
							<el-option key="1" label="是" value="1"/>
						</el-select>
					</td>
          <td colspan="4" class="property">行业类别门类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.industryCategory }}<el-input v-if="editFlag" v-model="form.industryCategory"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">母公司名称</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.parentCompanyName }}<el-input v-if="editFlag" v-model="form.parentCompanyName"></el-input></td>
          <td colspan="4" class="property">行业类别大类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.industryCategoryLarge }}<el-input v-if="editFlag" v-model="form.industryCategoryLarge"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">集团公司名称</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.groupCompanyName }}<el-input v-if="editFlag" v-model="form.groupCompanyName"></el-input></td>
          <td colspan="4" class="property">行业类别中类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.industryCategoryMedium }}<el-input v-if="editFlag" v-model="form.industryCategoryMedium"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">安全标准化等级</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetyStandardizationLevel }}<el-input v-if="editFlag" v-model="form.safetyStandardizationLevel"></el-input></td>
          <td colspan="4" class="property">行业类别小类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.industryCategoryMinor }}<el-input v-if="editFlag" v-model="form.industryCategoryMinor"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">标准化证书有效期起始日期</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.certificateStartDate }}<el-date-picker type="datetime" v-if="editFlag" v-model="form.certificateStartDate" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker></td>
          <td colspan="4" class="property">行业监管大类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.industryRegulationCategoryLarge }}<el-input v-if="editFlag" v-model="form.industryRegulationCategoryLarge"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">标准化证书有效期终止日期</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.certificateEndDate }}<el-date-picker type="datetime" v-if="editFlag" v-model="form.certificateEndDate" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker></td>
          <td colspan="4" class="property">行业监管小类</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.industryRegulationCategoryMinor }}<el-input v-if="editFlag" v-model="form.industryRegulationCategoryMinor"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">安全监管等级</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.safetySupervisionLevel }}<el-input v-if="editFlag" v-model="form.safetySupervisionLevel"></el-input></td>
          <td colspan="4" class="property">专项治理类别</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.specialGovernanceCategory }}<el-input v-if="editFlag" v-model="form.specialGovernanceCategory"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">是否存在重大危险源</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.majorHazardExist == 0 ? "否":"是" }}
						<el-select v-if="editFlag" v-model="form.majorHazardExist" clear>
							<el-option key="0" label="否" value="0"/>
							<el-option key="1" label="是" value="1"/>
						</el-select>
					</td>
          <td colspan="4" class="property">是否为国有企业</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.stateOwnedEnterpriseFlag == 0 ? "否":"是" }}
						<el-select v-if="editFlag" v-model="form.stateOwnedEnterpriseFlag" clear>
							<el-option key="0" label="否" value="0"/>
							<el-option key="1" label="是" value="1"/>
						</el-select>
					</td>
        </tr>
        <tr>
          <td colspan="4" class="property">重大危险源等级</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.majorHazardLevel }}<el-input v-if="editFlag" v-model="form.majorHazardLevel"></el-input></td>
          <td colspan="4" class="property">隶属关系</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.affiliation }}<el-input v-if="editFlag" v-model="form.affiliation"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">经度（度）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.lng }}<el-input v-if="editFlag" v-model="form.lng"></el-input></td>
          <td colspan="4" class="property">纬度（度）</td>
          <td colspan="8" class="content">{{ editFlag ? "":form.lat }}<el-input v-if="editFlag" v-model="form.lat"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">备注</td>
          <td colspan="20" class="content2">{{ editFlag ? "":form.remark }}<el-input v-if="editFlag" v-model="form.remark"></el-input></td>
        </tr>
        <tr>
          <td colspan="4" class="property">企业2平面图</td>
          <td colspan="20" class="content2">
						<img v-if="!editFlag" :src="form.planeFigureUrl">
						<ImageUpload
								v-if="editFlag"
								v-model="form.planeFigureUrl"
								:limit = "1"
						/>
					</td>
        </tr>
        <tr>
          <td colspan="4" class="property">企业营业执照</td>
          <td colspan="20" class="content2">
						<img v-if="!editFlag" :src="form.businessLicenseUrl">
						<ImageUpload
								v-if="editFlag"
								v-model="form.businessLicenseUrl"
								:limit = "1"
						/>
					</td>
        </tr>
        <tr>
          <td colspan="4" class="property">组织机构图</td>
          <td colspan="20" class="content2">
						<img v-if="!editFlag" :src="form.organizationChartUrl">
						<ImageUpload
								v-if="editFlag"
								v-model="form.organizationChartUrl"
								:limit = "1"
						/>
					</td>
        </tr>
			</table>
		</div>
  </div>
</template>

<script setup name="EnterpriseInformation">
import { listEnterpriseInformation, getEnterpriseInformation, delEnterpriseInformation, addEnterpriseInformation, updateEnterpriseInformation } from "@/api/system/enterpriseInformation";
import { listArea } from "@/api/system/area";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const enterpriseInformationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const editFlag = ref(false);
const provinceList = ref([]);
const cityList = ref([]);
const areaList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
  },
  rules: {
    deptId: [
      { required: true, message: "所属部门不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "企业名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询企业信息列表 */
function getList() {
  loading.value = true;
  listEnterpriseInformation(queryParams.value).then(response => {
    //enterpriseInformationList.value = response.rows;
		if(response.rows.length>0){
			form.value = response.rows[0];
		}
		loading.value = false;
  });
}

// 取消按钮
function cancel() {
  editFlag.value = false;
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deptId: null,
    name: null,
    establishDate: null,
    code: null,
    legalRepresentative: null,
    socialCreditCode: null,
    fixedPhone: null,
    administrativeArea: null,
    provinceId: null,
    cityId: null,
    areaId: null,
    township: null,
    community: null,
    park: null,
    email: null,
    safetyDutyPhone: null,
    officialWebsiteAddress: null,
    fax: null,
    registeredCapital: null,
    qq: null,
    postCode: null,
    businessStatus: "0",
    registrationAddress: null,
    operationAddress: null,
    floorSpace: null,
    businessScope: null,
    head: null,
    headFixedPhone: null,
    headPhone: null,
    headEmail: null,
    safetyManager: null,
    safetyFixedPhone: null,
    safetyPhone: null,
    safetyEmail: null,
    specialOperatorNum: null,
    fullTimeSafetyManagerNum: null,
    partTimeSafetyManagerNum: null,
    fullTimeContingencyManagerNum: null,
    registeredSafetyEngineerNum: null,
    safetyOrganizationExist: null,
    safetyOrganization: null,
    safetyOrganizationResponsibility: null,
    safetyOrganizationMemberNum: null,
    employeesNum: null,
    enterpriseSize: null,
    scaleSituation: null,
    parentCompanyExist: null,
    parentCompanyName: null,
    groupCompanyName: null,
    safetyStandardizationLevel: null,
    certificateStartDate: null,
    certificateEndDate: null,
    safetySupervisionLevel: null,
    majorHazardExist: null,
    majorHazardLevel: null,
    economicCategoryLarge: null,
    economicCategoryMinor: null,
    industryCategory: null,
    industryCategoryLarge: null,
    industryCategoryMedium: null,
    industryCategoryMinor: null,
    industryRegulationCategoryLarge: null,
    industryRegulationCategoryMinor: null,
    specialGovernanceCategory: null,
    stateOwnedEnterpriseFlag: null,
    affiliation: null,
    lng: null,
    lat: null,
    planeFigureUrl: null,
    businessLicenseUrl: null,
    organizationChartUrl: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("enterpriseInformationRef");
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
  title.value = "添加企业信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEnterpriseInformation(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业信息";
  });
}

function edit() {
	editFlag.value = true;
}

/** 提交按钮 */
function submitForm() {
	if(form.value.name == null || form.value.name == ""){
		proxy.$modal.msgError("企业名称必填");
		return;
	}

	if (form.value.id != null) {
		updateEnterpriseInformation(form.value).then(response => {
			proxy.$modal.msgSuccess("修改成功");
			editFlag.value = false;
			getList();
		});
	} else {
		addEnterpriseInformation(form.value).then(response => {
			proxy.$modal.msgSuccess("新增成功");
			editFlag.value = false;
			getList();
		});
	}
}

/** 删除按钮操作 */
function handleDelete(row) {
  const ids = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delEnterpriseInformation(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/enterpriseInformation/export', {
    ...queryParams.value
  }, `enterpriseInformation_${new Date().getTime()}.xlsx`)
}

function getProvinceList() {
	listArea({level:1}).then(response => {
		provinceList.value = response.data;
	});
}

function getCityList(val) {
	listArea({level:2,parentid:val}).then(response => {
		cityList.value = response.data;
	});
}

function getAreaList(val) {
	listArea({level:3,parentid:val}).then(response => {
		areaList.value = response.data;
	});
}

getProvinceList();
getCityList();
getAreaList();
getList();
</script>

<style scoped lang="scss">
.report{
  padding: 15px 15px;
  height: 100%;overflow: auto;
}
.tit{
	height: 70px;
	line-height: 70px;
  text-align: center;
  font-size: 24px;
	margin:0 0;
  position: relative;
	background: #d8e4ec;
	padding-left: 20px;
	border: 1px solid #dde2e8;
}
.topbtn{
  float: right;color: #fff;
  background: #09bec5;border-radius: 3px;padding: 5px 10px;
  border: 0;cursor: pointer;
  z-index: 999;position: relative;
  top: 20px;right: 40px;outline: none;
	margin-left: 5px;
}
.localpic{
  width: 80%;max-width: 950px;
  margin: 0 auto 20px;
}
.reportbox table{
  margin: 0 0;width: 100%;
  border-collapse: collapse;
  td{
    border: 1px solid #dde2e8;padding: 5px 10px;
    line-height: 2;font-size: 14px;
		height: 43px;
  }
	.property{
		width: 17%;
		text-align: right;
    padding-right: 15px;
    background: #f2f3f5;
	}
	.content{
		width: 33%;
	}
	.content2{
		width: 83%;
    img{
      max-width:100%
    }
	}
  .noborder-lf{
    border-left: 0;
  }
  .noborder-rt{
    border-right: 0;
  }
  .noborder-tp{
    border-top: 0;
  }
  .noborder-bt{
    border-bottom: 0;
  }
  .noborder{
    border: 0;
  }
  .jingshi{
    display: inline-block;
  }
  .qianming{
    height: 25px;margin-right: 15px;
    vertical-align: middle;
  }
  tr.tablelayout{
		background: #d8e4ec;
		height: 20px;
    border: 0;
    td{
      border: 0;
    }
  }
}
@media print {
  .reportbox table{
    width: 100%;
  }
  .localpic{
    width: 100%;
  }
}
</style>




