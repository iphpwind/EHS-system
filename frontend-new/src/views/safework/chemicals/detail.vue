<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint">
      <div class="tit">化学安全技术说明书</div>
			<table>
				<tr>
					<td colspan="2" class="tbtit">第一部分：化学品名称</td>
				</tr>
				<tr>
					<td class="tbleft">化学品中文名称</td>
					<td>{{ form.chineseName }}</td>
				</tr>
				<tr>
					<td class="tbleft">化学品英文名称</td>
					<td>{{ form.englishName }}</td>
				</tr>
				<tr>
					<td class="tbleft">中文名称2</td>
					<td>{{ form.chineseName2 }}</td>
				</tr>
				<tr>
					<td class="tbleft">英文名称2</td>
					<td>{{ form.englishName2 }}</td>
				</tr>
				<tr>
					<td class="tbleft">技术说明书编码</td>
					<td>{{ form.technicalSpecificationNumber }}</td>
				</tr>
				<tr>
					<td class="tbleft">CAS NO</td>
					<td>{{ form.casNumber }}</td>
				</tr>
				<tr>
					<td class="tbleft">分子式</td>
					<td>{{ form.molecularFormula }}</td>
				</tr>
				<tr>
					<td class="tbleft">分子量</td>
					<td>{{ form.molecularWeight }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第二部分：成分/组成信息</td>
				</tr>
				<tr>
					<td class="tbleft">含量</td>
					<td>{{ form.content }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第三部分：危险性描述</td>
				</tr>
				<tr>
					<td class="tbleft">健康危害</td>
					<td>{{ form.healthHazard }}</td>
				</tr>
				<tr>
					<td class="tbleft">环境危害</td>
					<td>{{ form.environmentalHazard }}</td>
				</tr>
				<tr>
					<td class="tbleft">燃爆危害</td>
					<td>{{ form.fireExplosionHazard }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第四部分：急救措施</td>
				</tr>
				<tr>
					<td class="tbleft">皮肤接触</td>
					<td>{{ form.skinContact }}</td>
				</tr>
				<tr>
					<td class="tbleft">眼睛接触</td>
					<td>{{ form.eyeContact }}</td>
				</tr>
				<tr>
					<td class="tbleft">吸入</td>
					<td>{{ form.inhalation }}</td>
				</tr>
				<tr>
					<td class="tbleft">食入</td>
					<td>{{ form.ingestion }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第五部分：消防</td>
				</tr>
				<tr>
					<td class="tbleft">危险特性</td>
					<td>{{ form.hazardCharacteristics }}</td>
				</tr>
				<tr>
					<td class="tbleft">有害燃烧产物</td>
					<td>{{ form.harmfulCombustionProducts }}</td>
				</tr>
				<tr>
					<td class="tbleft">灭火方法</td>
					<td>{{ form.extinguishingMethod }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第六部分：泄漏应急处理</td>
				</tr>
				<tr>
					<td class="tbleft">应急处理</td>
					<td>{{ form.emergencyHandling }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第七部分：操作处理与储存</td>
				</tr>
				<tr>
					<td class="tbleft">操作注意事项</td>
					<td>{{ form.operationPrecautions }}</td>
				</tr>
				<tr>
					<td class="tbleft">储存注意事项</td>
					<td>{{ form.storagePrecautions }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第八部分：接触控制/个体防护</td>
				</tr>
				<tr>
					<td class="tbleft">中国MAC(mg/m3)</td>
					<td>{{ form.chinaMac }}</td>
				</tr>
				<tr>
					<td class="tbleft">前苏联MAC(mg/m3)</td>
					<td>{{ form.formerSovietUnion }}</td>
				</tr>
				<tr>
					<td class="tbleft">TLVTN</td>
					<td>{{ form.tlvtN }}</td>
				</tr>
				<tr>
					<td class="tbleft">TLVWN</td>
					<td>{{ form.tlvwN }}</td>
				</tr>
				<tr>
					<td class="tbleft">工程控制</td>
					<td>{{ form.engineeringControls }}</td>
				</tr>
				<tr>
					<td class="tbleft">呼吸系统防护</td>
					<td>{{ form.respiratoryProtection }}</td>
				</tr>
				<tr>
					<td class="tbleft">眼睛防护</td>
					<td>{{ form.eyeProtection }}</td>
				</tr>
				<tr>
					<td class="tbleft">身体防护</td>
					<td>{{ form.bodyProtection }}</td>
				</tr>
				<tr>
					<td class="tbleft">手防护</td>
					<td>{{ form.handProtection }}</td>
				</tr>
				<tr>
					<td class="tbleft">其他防护</td>
					<td>{{ form.otherProtection }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第九部分：理化特性</td>
				</tr>
				<tr>
					<td class="tbleft">主要成分</td>
					<td>{{ form.mainComponents }}</td>
				</tr>
				<tr>
					<td class="tbleft">外观与形状</td>
					<td>{{ form.appearanceAndCharacteristics }}</td>
				</tr>
				<tr>
					<td class="tbleft">>熔点（℃）</td>
					<td>{{ form.meltingPoint }}</td>
				</tr>
				<tr>
					<td class="tbleft">沸点（℃）</td>
					<td>{{ form.boilingPoint }}</td>
				</tr>
				<tr>
					<td class="tbleft">相对密度（水=1）</td>
					<td>{{ form.relativeDensity }}</td>
				</tr>
				<tr>
					<td class="tbleft">相对蒸气密度（空气=1）</td>
					<td>{{ form.relativeVaporDensity }}</td>
				</tr>
				<tr>
					<td class="tbleft">饱和蒸气压（kPa）</td>
					<td>{{ form.saturatedVaporPressure }}</td>
				</tr>
				<tr>
					<td class="tbleft">燃烧热（kJ/mol）</td>
					<td>{{ form.combustionHeat }}</td>
				</tr>
				<tr>
					<td class="tbleft">临界温度（℃）</td>
					<td>{{ form.criticalTemperature }}</td>
				</tr>
				<tr>
					<td class="tbleft">临界压力（MPa）</td>
					<td>{{ form.criticalPressure }}</td>
				</tr>
				<tr>
					<td class="tbleft">辛醇/水分配系数的对数值</td>
					<td>{{ form.logarithmOfPartitionCoefficient }}</td>
				</tr>
				<tr>
					<td class="tbleft">闪点（℃）</td>
					<td>{{ form.flashPoint }}</td>
				</tr>
				<tr>
					<td class="tbleft">引燃温度（℃）</td>
					<td>{{ form.ignitionTemperature }}</td>
				</tr>
				<tr>
					<td class="tbleft">爆炸上限%（V/V）</td>
					<td>{{ form.upperExplosiveLimit }}</td>
				</tr>
				<tr>
					<td class="tbleft">爆炸下限%（V/V）</td>
					<td>{{ form.lowerExplosiveLimit }}</td>
				</tr>
				<tr>
					<td class="tbleft">主要用途</td>
					<td>{{ form.mainUses }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第十部分：稳定性和反应活性</td>
				</tr>
				<tr>
					<td class="tbleft">禁配物</td>
					<td>{{ form.forbiddenSubstances }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第十一部分：毒理学资料</td>
				</tr>
				<tr>
					<td class="tbleft">急性毒性LD50</td>
					<td>{{ form.acuteToxicityLd50 }}</td>
				</tr>
				<tr>
					<td class="tbleft">禁配急性毒性LC50物</td>
					<td>{{ form.acuteToxicityLc50 }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第十二部分：生态学资料</td>
				</tr>
				<tr>
					<td class="tbleft">其他有害作用</td>
					<td>{{ form.otherHarmfulEffects }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第十四部分：废弃处置</td>
				</tr>
				<tr>
					<td class="tbleft">废弃物性质废弃处置方法</td>
					<td>{{ form.wastePropertiesAndDisposalMethods }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第十四部分：运输信息</td>
				</tr>
				<tr>
					<td class="tbleft">危险货物编号</td>
					<td>{{ form.dangerousGoodsNumber }}</td>
				</tr>
				<tr>
					<td class="tbleft">UN编码</td>
					<td>{{ form.unNumber }}</td>
				</tr>
				<tr>
					<td class="tbleft">包装分类</td>
					<td>{{ form.packingGroup }}</td>
				</tr>
				<tr>
					<td class="tbleft">包装方法</td>
					<td>{{ form.packingMethod }}</td>
				</tr>
				<tr>
					<td class="tbleft">运输注意事项</td>
					<td>{{ form.transportationPrecautions }}</td>
				</tr>
				<tr>
					<td colspan="2" class="tbtit">第十五部分：法规信息</td>
				</tr>
				<tr>
					<td class="tbleft">法规信息</td>
					<td>{{ form.regulatoryInformation }}</td>
				</tr>
			</table>
		</div>
  </div>
</template>

<script>
import {getChemicals} from "@/api/safework/chemicals";
export default {
  name: "化学安全技术说明书",
  data() {
    return {
      title: '基础信息',
      form:{
				
      },
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.getInfo();
  },

  mounted: function () {
  },

  methods: {
    getInfo(){
      getChemicals(this.id).then(response => {
        this.form = response.data;
      })
    }
  },

}
</script>


<style scoped lang="scss">
.report{
  padding: 15px 15px;
  height: 100%;overflow: auto;
}
.tit{
  text-align: center;font-weight: bold;
  font-size: 20px;margin:20px 0;
  position: relative;
}
.topbtn{
  float: right;color: #fff;
  background: #09bec5;border-radius: 3px;padding: 5px 10px;
  border: 0;cursor: pointer;
  z-index: 999;position: relative;
  top: 20px;right: 40px;outline: none;
}
.localpic{
  width: 80%;max-width: 950px;
  margin: 0 auto 20px;
}
.reportbox table{
  margin: 0 auto 20px;width: 80%;
  max-width: 950px;
  border-collapse: collapse;
  td{
    border: 1px solid #aaa;padding: 6px 14px;
    line-height: 2;font-size: 14px;
  }
	td.tbtit{
		background: #d8e4ec;font-weight: bold;
		font-size: 16px;text-align: center;
	}
	td.tbleft{
		background: #f2f3f5;font-weight: bold;
		font-size: 14px;width: 30%;
		text-align: right;
	}
  .qianming{
    height: 25px;margin-right: 15px;
    vertical-align: middle;
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