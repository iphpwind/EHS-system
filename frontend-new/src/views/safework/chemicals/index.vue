<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="化学品中文名" prop="chineseName">
        <el-input
          v-model="queryParams.chineseName"
          placeholder="请输入化学品中文名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="化学品英文名称" prop="englishName">
        <el-input
          v-model="queryParams.englishName"
          placeholder="请输入化学品英文名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="中文名称2" prop="chineseName2">
        <el-input
          v-model="queryParams.chineseName2"
          placeholder="请输入中文名称2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文名称2" prop="englishName2">
        <el-input
          v-model="queryParams.englishName2"
          placeholder="请输入英文名称2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="技术说明书编号" prop="technicalSpecificationNumber">
        <el-input
          v-model="queryParams.technicalSpecificationNumber"
          placeholder="请输入技术说明书编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="CASNo" prop="casNumber">
        <el-input
          v-model="queryParams.casNumber"
          placeholder="请输入CASNo"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分子式" prop="molecularFormula">
        <el-input
          v-model="queryParams.molecularFormula"
          placeholder="请输入分子式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分子量" prop="molecularWeight">
        <el-input
          v-model="queryParams.molecularWeight"
          placeholder="请输入分子量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="健康危害" prop="healthHazard">
        <el-input
          v-model="queryParams.healthHazard"
          placeholder="请输入健康危害"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="环境危害" prop="environmentalHazard">
        <el-input
          v-model="queryParams.environmentalHazard"
          placeholder="请输入环境危害"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="燃爆危险" prop="fireExplosionHazard">
        <el-input
          v-model="queryParams.fireExplosionHazard"
          placeholder="请输入燃爆危险"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="皮肤接触" prop="skinContact">
        <el-input
          v-model="queryParams.skinContact"
          placeholder="请输入皮肤接触"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="眼睛接触" prop="eyeContact">
        <el-input
          v-model="queryParams.eyeContact"
          placeholder="请输入眼睛接触"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="吸入" prop="inhalation">
        <el-input
          v-model="queryParams.inhalation"
          placeholder="请输入吸入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="食入" prop="ingestion">
        <el-input
          v-model="queryParams.ingestion"
          placeholder="请输入食入"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="危险特性" prop="hazardCharacteristics">
        <el-input
          v-model="queryParams.hazardCharacteristics"
          placeholder="请输入危险特性"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有害燃烧产物" prop="harmfulCombustionProducts">
        <el-input
          v-model="queryParams.harmfulCombustionProducts"
          placeholder="请输入有害燃烧产物"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="灭火方法" prop="extinguishingMethod">
        <el-input
          v-model="queryParams.extinguishingMethod"
          placeholder="请输入灭火方法"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应急处理" prop="emergencyHandling">
        <el-input
          v-model="queryParams.emergencyHandling"
          placeholder="请输入应急处理"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作注意事项" prop="operationPrecautions">
        <el-input
          v-model="queryParams.operationPrecautions"
          placeholder="请输入操作注意事项"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="储存注意事项" prop="storagePrecautions">
        <el-input
          v-model="queryParams.storagePrecautions"
          placeholder="请输入储存注意事项"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="中国MAC" prop="chinaMac">
        <el-input
          v-model="queryParams.chinaMac"
          placeholder="请输入中国MAC"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前苏联" prop="formerSovietUnion">
        <el-input
          v-model="queryParams.formerSovietUnion"
          placeholder="请输入前苏联"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="TLVTN" prop="tlvtN">
        <el-input
          v-model="queryParams.tlvtN"
          placeholder="请输入TLVTN"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="TLVWN" prop="tlvwN">
        <el-input
          v-model="queryParams.tlvwN"
          placeholder="请输入TLVWN"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工程控制" prop="engineeringControls">
        <el-input
          v-model="queryParams.engineeringControls"
          placeholder="请输入工程控制"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="呼吸系统防护" prop="respiratoryProtection">
        <el-input
          v-model="queryParams.respiratoryProtection"
          placeholder="请输入呼吸系统防护"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="眼睛防护" prop="eyeProtection">
        <el-input
          v-model="queryParams.eyeProtection"
          placeholder="请输入眼睛防护"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身体防护" prop="bodyProtection">
        <el-input
          v-model="queryParams.bodyProtection"
          placeholder="请输入身体防护"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手防护" prop="handProtection">
        <el-input
          v-model="queryParams.handProtection"
          placeholder="请输入手防护"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="其他防护" prop="otherProtection">
        <el-input
          v-model="queryParams.otherProtection"
          placeholder="请输入其他防护"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主要成分" prop="mainComponents">
        <el-input
          v-model="queryParams.mainComponents"
          placeholder="请输入主要成分"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外观与性状 " prop="appearanceAndCharacteristics">
        <el-input
          v-model="queryParams.appearanceAndCharacteristics"
          placeholder="请输入外观与性状 "
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="熔点" prop="meltingPoint">
        <el-input
          v-model="queryParams.meltingPoint"
          placeholder="请输入熔点"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="沸点" prop="boilingPoint">
        <el-input
          v-model="queryParams.boilingPoint"
          placeholder="请输入沸点"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相对密度" prop="relativeDensity">
        <el-input
          v-model="queryParams.relativeDensity"
          placeholder="请输入相对密度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相对蒸气密度" prop="relativeVaporDensity">
        <el-input
          v-model="queryParams.relativeVaporDensity"
          placeholder="请输入相对蒸气密度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="饱和蒸气压" prop="saturatedVaporPressure">
        <el-input
          v-model="queryParams.saturatedVaporPressure"
          placeholder="请输入饱和蒸气压"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="燃烧热" prop="combustionHeat">
        <el-input
          v-model="queryParams.combustionHeat"
          placeholder="请输入燃烧热"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="临界温度" prop="criticalTemperature">
        <el-input
          v-model="queryParams.criticalTemperature"
          placeholder="请输入临界温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="临界压力" prop="criticalPressure">
        <el-input
          v-model="queryParams.criticalPressure"
          placeholder="请输入临界压力"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水分配系数的对数值" prop="logarithmOfPartitionCoefficient">
        <el-input
          v-model="queryParams.logarithmOfPartitionCoefficient"
          placeholder="请输入水分配系数的对数值"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="闪点" prop="flashPoint">
        <el-input
          v-model="queryParams.flashPoint"
          placeholder="请输入闪点"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="引燃温度" prop="ignitionTemperature">
        <el-input
          v-model="queryParams.ignitionTemperature"
          placeholder="请输入引燃温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="爆炸上限" prop="upperExplosiveLimit">
        <el-input
          v-model="queryParams.upperExplosiveLimit"
          placeholder="请输入爆炸上限"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="爆炸下限" prop="lowerExplosiveLimit">
        <el-input
          v-model="queryParams.lowerExplosiveLimit"
          placeholder="请输入爆炸下限"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主要用途" prop="mainUses">
        <el-input
          v-model="queryParams.mainUses"
          placeholder="请输入主要用途"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="禁配物" prop="forbiddenSubstances">
        <el-input
          v-model="queryParams.forbiddenSubstances"
          placeholder="请输入禁配物"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="急性毒性LD50" prop="acuteToxicityLd50">
        <el-input
          v-model="queryParams.acuteToxicityLd50"
          placeholder="请输入急性毒性LD50"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="急性毒性LC50" prop="acuteToxicityLc50">
        <el-input
          v-model="queryParams.acuteToxicityLc50"
          placeholder="请输入急性毒性LC50"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="其它有害作用" prop="otherHarmfulEffects">
        <el-input
          v-model="queryParams.otherHarmfulEffects"
          placeholder="请输入其它有害作用"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="废弃物性质废弃处置方法" prop="wastePropertiesAndDisposalMethods">
        <el-input
          v-model="queryParams.wastePropertiesAndDisposalMethods"
          placeholder="请输入废弃物性质废弃处置方法"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="危险货物编号" prop="dangerousGoodsNumber">
        <el-input
          v-model="queryParams.dangerousGoodsNumber"
          placeholder="请输入危险货物编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="UN编号" prop="unNumber">
        <el-input
          v-model="queryParams.unNumber"
          placeholder="请输入UN编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包装类别" prop="packingGroup">
        <el-input
          v-model="queryParams.packingGroup"
          placeholder="请输入包装类别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包装方法" prop="packingMethod">
        <el-input
          v-model="queryParams.packingMethod"
          placeholder="请输入包装方法"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输注意事项" prop="transportationPrecautions">
        <el-input
          v-model="queryParams.transportationPrecautions"
          placeholder="请输入运输注意事项"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="法规信息" prop="regulatoryInformation">
        <el-input
          v-model="queryParams.regulatoryInformation"
          placeholder="请输入法规信息"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:chemicals:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:chemicals:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:chemicals:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:chemicals:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
				<el-button
						type="info"
						plain
						icon="Upload"
						@click="handleImport"
						v-hasPermi="['system:staff:import']"
				>导入
				</el-button>
			</el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="chemicalsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="id" align="center" prop="id" /> -->
      <el-table-column label="化学品中文名" align="center" prop="chineseName" />
      <el-table-column label="化学品英文名称" align="center" prop="englishName" />
      <el-table-column label="中文名称2" align="center" prop="chineseName2" />
      <el-table-column label="英文名称2" align="center" prop="englishName2" />
      <el-table-column label="技术说明书编号" align="center" prop="technicalSpecificationNumber" />
      <!-- <el-table-column label="CASNo" align="center" prop="casNumber" />
      <el-table-column label="分子式" align="center" prop="molecularFormula" />
      <el-table-column label="分子量" align="center" prop="molecularWeight" />
      <el-table-column label="含量" align="center" prop="content" />
      <el-table-column label="健康危害" align="center" prop="healthHazard" />
      <el-table-column label="环境危害" align="center" prop="environmentalHazard" />
      <el-table-column label="燃爆危险" align="center" prop="fireExplosionHazard" />
      <el-table-column label="皮肤接触" align="center" prop="skinContact" />
      <el-table-column label="眼睛接触" align="center" prop="eyeContact" />
      <el-table-column label="吸入" align="center" prop="inhalation" />
      <el-table-column label="食入" align="center" prop="ingestion" />
      <el-table-column label="危险特性" align="center" prop="hazardCharacteristics" />
      <el-table-column label="有害燃烧产物" align="center" prop="harmfulCombustionProducts" />
      <el-table-column label="灭火方法" align="center" prop="extinguishingMethod" />
      <el-table-column label="应急处理" align="center" prop="emergencyHandling" />
      <el-table-column label="操作注意事项" align="center" prop="operationPrecautions" />
      <el-table-column label="储存注意事项" align="center" prop="storagePrecautions" />
      <el-table-column label="中国MAC" align="center" prop="chinaMac" />
      <el-table-column label="前苏联" align="center" prop="formerSovietUnion" />
      <el-table-column label="TLVTN" align="center" prop="tlvtN" />
      <el-table-column label="TLVWN" align="center" prop="tlvwN" />
      <el-table-column label="工程控制" align="center" prop="engineeringControls" />
      <el-table-column label="呼吸系统防护" align="center" prop="respiratoryProtection" />
      <el-table-column label="眼睛防护" align="center" prop="eyeProtection" />
      <el-table-column label="身体防护" align="center" prop="bodyProtection" />
      <el-table-column label="手防护" align="center" prop="handProtection" />
      <el-table-column label="其他防护" align="center" prop="otherProtection" />
      <el-table-column label="主要成分" align="center" prop="mainComponents" />
      <el-table-column label="外观与性状 " align="center" prop="appearanceAndCharacteristics" />
      <el-table-column label="熔点" align="center" prop="meltingPoint" />
      <el-table-column label="沸点" align="center" prop="boilingPoint" />
      <el-table-column label="相对密度" align="center" prop="relativeDensity" />
      <el-table-column label="相对蒸气密度" align="center" prop="relativeVaporDensity" />
      <el-table-column label="饱和蒸气压" align="center" prop="saturatedVaporPressure" />
      <el-table-column label="燃烧热" align="center" prop="combustionHeat" />
      <el-table-column label="临界温度" align="center" prop="criticalTemperature" />
      <el-table-column label="临界压力" align="center" prop="criticalPressure" />
      <el-table-column label="水分配系数的对数值" align="center" prop="logarithmOfPartitionCoefficient" />
      <el-table-column label="闪点" align="center" prop="flashPoint" />
      <el-table-column label="引燃温度" align="center" prop="ignitionTemperature" />
      <el-table-column label="爆炸上限" align="center" prop="upperExplosiveLimit" />
      <el-table-column label="爆炸下限" align="center" prop="lowerExplosiveLimit" />
      <el-table-column label="主要用途" align="center" prop="mainUses" />
      <el-table-column label="禁配物" align="center" prop="forbiddenSubstances" />
      <el-table-column label="急性毒性LD50" align="center" prop="acuteToxicityLd50" />
      <el-table-column label="急性毒性LC50" align="center" prop="acuteToxicityLc50" />
      <el-table-column label="其它有害作用" align="center" prop="otherHarmfulEffects" />
      <el-table-column label="废弃物性质废弃处置方法" align="center" prop="wastePropertiesAndDisposalMethods" />
      <el-table-column label="危险货物编号" align="center" prop="dangerousGoodsNumber" />
      <el-table-column label="UN编号" align="center" prop="unNumber" />
      <el-table-column label="包装类别" align="center" prop="packingGroup" />
      <el-table-column label="包装方法" align="center" prop="packingMethod" />
      <el-table-column label="运输注意事项" align="center" prop="transportationPrecautions" />
      <el-table-column label="法规信息" align="center" prop="regulatoryInformation" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:chemicals:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:chemicals:remove']"
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
    />

    <!-- 添加或修改危险化学品管理档案对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="chemicalsRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="化学品中文名" prop="chineseName">
          <el-input v-model="form.chineseName" placeholder="请输入化学品中文名" />
        </el-form-item>
        <el-form-item label="化学品英文名称" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入化学品英文名称" />
        </el-form-item>
        <el-form-item label="中文名称2" prop="chineseName2">
          <el-input v-model="form.chineseName2" placeholder="请输入中文名称2" />
        </el-form-item>
        <el-form-item label="英文名称2" prop="englishName2">
          <el-input v-model="form.englishName2" placeholder="请输入英文名称2" />
        </el-form-item>
        <el-form-item label="技术说明书编号" prop="technicalSpecificationNumber">
          <el-input v-model="form.technicalSpecificationNumber" placeholder="请输入技术说明书编号" />
        </el-form-item>
        <el-form-item label="CASNo" prop="casNumber">
          <el-input v-model="form.casNumber" placeholder="请输入CASNo" />
        </el-form-item>
        <el-form-item label="分子式" prop="molecularFormula">
          <el-input v-model="form.molecularFormula" placeholder="请输入分子式" />
        </el-form-item>
        <el-form-item label="分子量" prop="molecularWeight">
          <el-input v-model="form.molecularWeight" placeholder="请输入分子量" />
        </el-form-item>
        <el-form-item label="含量">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="健康危害" prop="healthHazard">
          <el-input v-model="form.healthHazard" placeholder="请输入健康危害" />
        </el-form-item>
        <el-form-item label="环境危害" prop="environmentalHazard">
          <el-input v-model="form.environmentalHazard" placeholder="请输入环境危害" />
        </el-form-item>
        <el-form-item label="燃爆危险" prop="fireExplosionHazard">
          <el-input v-model="form.fireExplosionHazard" placeholder="请输入燃爆危险" />
        </el-form-item>
        <el-form-item label="皮肤接触" prop="skinContact">
          <el-input v-model="form.skinContact" placeholder="请输入皮肤接触" />
        </el-form-item>
        <el-form-item label="眼睛接触" prop="eyeContact">
          <el-input v-model="form.eyeContact" placeholder="请输入眼睛接触" />
        </el-form-item>
        <el-form-item label="吸入" prop="inhalation">
          <el-input v-model="form.inhalation" placeholder="请输入吸入" />
        </el-form-item>
        <el-form-item label="食入" prop="ingestion">
          <el-input v-model="form.ingestion" placeholder="请输入食入" />
        </el-form-item>
        <el-form-item label="危险特性" prop="hazardCharacteristics">
          <el-input v-model="form.hazardCharacteristics" placeholder="请输入危险特性" />
        </el-form-item>
        <el-form-item label="有害燃烧产物" prop="harmfulCombustionProducts">
          <el-input v-model="form.harmfulCombustionProducts" placeholder="请输入有害燃烧产物" />
        </el-form-item>
        <el-form-item label="灭火方法" prop="extinguishingMethod">
          <el-input v-model="form.extinguishingMethod" placeholder="请输入灭火方法" />
        </el-form-item>
        <el-form-item label="应急处理" prop="emergencyHandling">
          <el-input v-model="form.emergencyHandling" placeholder="请输入应急处理" />
        </el-form-item>
        <el-form-item label="操作注意事项" prop="operationPrecautions">
          <el-input v-model="form.operationPrecautions" placeholder="请输入操作注意事项" />
        </el-form-item>
        <el-form-item label="储存注意事项" prop="storagePrecautions">
          <el-input v-model="form.storagePrecautions" placeholder="请输入储存注意事项" />
        </el-form-item>
        <el-form-item label="中国MAC" prop="chinaMac">
          <el-input v-model="form.chinaMac" placeholder="请输入中国MAC" />
        </el-form-item>
        <el-form-item label="前苏联" prop="formerSovietUnion">
          <el-input v-model="form.formerSovietUnion" placeholder="请输入前苏联" />
        </el-form-item>
        <el-form-item label="TLVTN" prop="tlvtN">
          <el-input v-model="form.tlvtN" placeholder="请输入TLVTN" />
        </el-form-item>
        <el-form-item label="TLVWN" prop="tlvwN">
          <el-input v-model="form.tlvwN" placeholder="请输入TLVWN" />
        </el-form-item>
        <el-form-item label="工程控制" prop="engineeringControls">
          <el-input v-model="form.engineeringControls" placeholder="请输入工程控制" />
        </el-form-item>
        <el-form-item label="呼吸系统防护" prop="respiratoryProtection">
          <el-input v-model="form.respiratoryProtection" placeholder="请输入呼吸系统防护" />
        </el-form-item>
        <el-form-item label="眼睛防护" prop="eyeProtection">
          <el-input v-model="form.eyeProtection" placeholder="请输入眼睛防护" />
        </el-form-item>
        <el-form-item label="身体防护" prop="bodyProtection">
          <el-input v-model="form.bodyProtection" placeholder="请输入身体防护" />
        </el-form-item>
        <el-form-item label="手防护" prop="handProtection">
          <el-input v-model="form.handProtection" placeholder="请输入手防护" />
        </el-form-item>
        <el-form-item label="其他防护" prop="otherProtection">
          <el-input v-model="form.otherProtection" placeholder="请输入其他防护" />
        </el-form-item>
        <el-form-item label="主要成分" prop="mainComponents">
          <el-input v-model="form.mainComponents" placeholder="请输入主要成分" />
        </el-form-item>
        <el-form-item label="外观与性状 " prop="appearanceAndCharacteristics">
          <el-input v-model="form.appearanceAndCharacteristics" placeholder="请输入外观与性状 " />
        </el-form-item>
        <el-form-item label="熔点" prop="meltingPoint">
          <el-input v-model="form.meltingPoint" placeholder="请输入熔点" />
        </el-form-item>
        <el-form-item label="沸点" prop="boilingPoint">
          <el-input v-model="form.boilingPoint" placeholder="请输入沸点" />
        </el-form-item>
        <el-form-item label="相对密度" prop="relativeDensity">
          <el-input v-model="form.relativeDensity" placeholder="请输入相对密度" />
        </el-form-item>
        <el-form-item label="相对蒸气密度" prop="relativeVaporDensity">
          <el-input v-model="form.relativeVaporDensity" placeholder="请输入相对蒸气密度" />
        </el-form-item>
        <el-form-item label="饱和蒸气压" prop="saturatedVaporPressure">
          <el-input v-model="form.saturatedVaporPressure" placeholder="请输入饱和蒸气压" />
        </el-form-item>
        <el-form-item label="燃烧热" prop="combustionHeat">
          <el-input v-model="form.combustionHeat" placeholder="请输入燃烧热" />
        </el-form-item>
        <el-form-item label="临界温度" prop="criticalTemperature">
          <el-input v-model="form.criticalTemperature" placeholder="请输入临界温度" />
        </el-form-item>
        <el-form-item label="临界压力" prop="criticalPressure">
          <el-input v-model="form.criticalPressure" placeholder="请输入临界压力" />
        </el-form-item>
        <el-form-item label="水分配系数的对数值" prop="logarithmOfPartitionCoefficient">
          <el-input v-model="form.logarithmOfPartitionCoefficient" placeholder="请输入水分配系数的对数值" />
        </el-form-item>
        <el-form-item label="闪点" prop="flashPoint">
          <el-input v-model="form.flashPoint" placeholder="请输入闪点" />
        </el-form-item>
        <el-form-item label="引燃温度" prop="ignitionTemperature">
          <el-input v-model="form.ignitionTemperature" placeholder="请输入引燃温度" />
        </el-form-item>
        <el-form-item label="爆炸上限" prop="upperExplosiveLimit">
          <el-input v-model="form.upperExplosiveLimit" placeholder="请输入爆炸上限" />
        </el-form-item>
        <el-form-item label="爆炸下限" prop="lowerExplosiveLimit">
          <el-input v-model="form.lowerExplosiveLimit" placeholder="请输入爆炸下限" />
        </el-form-item>
        <el-form-item label="主要用途" prop="mainUses">
          <el-input v-model="form.mainUses" placeholder="请输入主要用途" />
        </el-form-item>
        <el-form-item label="禁配物" prop="forbiddenSubstances">
          <el-input v-model="form.forbiddenSubstances" placeholder="请输入禁配物" />
        </el-form-item>
        <el-form-item label="急性毒性LD50" prop="acuteToxicityLd50">
          <el-input v-model="form.acuteToxicityLd50" placeholder="请输入急性毒性LD50" />
        </el-form-item>
        <el-form-item label="急性毒性LC50" prop="acuteToxicityLc50">
          <el-input v-model="form.acuteToxicityLc50" placeholder="请输入急性毒性LC50" />
        </el-form-item>
        <el-form-item label="其它有害作用" prop="otherHarmfulEffects">
          <el-input v-model="form.otherHarmfulEffects" placeholder="请输入其它有害作用" />
        </el-form-item>
        <el-form-item label="废弃物性质废弃处置方法" prop="wastePropertiesAndDisposalMethods">
          <el-input v-model="form.wastePropertiesAndDisposalMethods" placeholder="请输入废弃物性质废弃处置方法" />
        </el-form-item>
        <el-form-item label="危险货物编号" prop="dangerousGoodsNumber">
          <el-input v-model="form.dangerousGoodsNumber" placeholder="请输入危险货物编号" />
        </el-form-item>
        <el-form-item label="UN编号" prop="unNumber">
          <el-input v-model="form.unNumber" placeholder="请输入UN编号" />
        </el-form-item>
        <el-form-item label="包装类别" prop="packingGroup">
          <el-input v-model="form.packingGroup" placeholder="请输入包装类别" />
        </el-form-item>
        <el-form-item label="包装方法" prop="packingMethod">
          <el-input v-model="form.packingMethod" placeholder="请输入包装方法" />
        </el-form-item>
        <el-form-item label="运输注意事项" prop="transportationPrecautions">
          <el-input v-model="form.transportationPrecautions" placeholder="请输入运输注意事项" />
        </el-form-item>
        <el-form-item label="法规信息" prop="regulatoryInformation">
          <el-input v-model="form.regulatoryInformation" placeholder="请输入法规信息" />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入状态 0 正常 1 停用" />
        </el-form-item> -->
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

     <!-- 导入对话框 -->
     <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Chemicals">
import { listChemicals, getChemicals, delChemicals, addChemicals, updateChemicals } from "@/api/safework/chemicals";
import {getToken} from "@/utils/auth";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const chemicalsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
/*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/chemicals/importData"
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    chineseName: null,
    englishName: null,
    chineseName2: null,
    englishName2: null,
    technicalSpecificationNumber: null,
    casNumber: null,
    molecularFormula: null,
    molecularWeight: null,
    content: null,
    healthHazard: null,
    environmentalHazard: null,
    fireExplosionHazard: null,
    skinContact: null,
    eyeContact: null,
    inhalation: null,
    ingestion: null,
    hazardCharacteristics: null,
    harmfulCombustionProducts: null,
    extinguishingMethod: null,
    emergencyHandling: null,
    operationPrecautions: null,
    storagePrecautions: null,
    chinaMac: null,
    formerSovietUnion: null,
    tlvtN: null,
    tlvwN: null,
    engineeringControls: null,
    respiratoryProtection: null,
    eyeProtection: null,
    bodyProtection: null,
    handProtection: null,
    otherProtection: null,
    mainComponents: null,
    appearanceAndCharacteristics: null,
    meltingPoint: null,
    boilingPoint: null,
    relativeDensity: null,
    relativeVaporDensity: null,
    saturatedVaporPressure: null,
    combustionHeat: null,
    criticalTemperature: null,
    criticalPressure: null,
    logarithmOfPartitionCoefficient: null,
    flashPoint: null,
    ignitionTemperature: null,
    upperExplosiveLimit: null,
    lowerExplosiveLimit: null,
    mainUses: null,
    forbiddenSubstances: null,
    acuteToxicityLd50: null,
    acuteToxicityLc50: null,
    otherHarmfulEffects: null,
    wastePropertiesAndDisposalMethods: null,
    dangerousGoodsNumber: null,
    unNumber: null,
    packingGroup: null,
    packingMethod: null,
    transportationPrecautions: null,
    regulatoryInformation: null,
    fileUrl: null,
  },
  rules: {
    chineseName: [
      { required: true, message: "化学品中文名不能为空", trigger: "blur" }
    ],
    englishName: [
      { required: true, message: "化学品英文名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 导入按钮操作 */
function handleImport() {
  upload.title = "危化品导入";
  upload.open = true;
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};
  /**文件上传中处理 */
function handleFileUploadProgress(event, file, fileList){
  upload.isUploading = true;
};
/** 文件上传成功处理 */
function handleFileSuccess(response, file, fileList){
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};
/** 查询危险化学品管理档案列表 */
function getList() {
  loading.value = true;
  listChemicals(queryParams.value).then(response => {
    chemicalsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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
    chineseName: null,
    englishName: null,
    chineseName2: null,
    englishName2: null,
    technicalSpecificationNumber: null,
    casNumber: null,
    molecularFormula: null,
    molecularWeight: null,
    content: null,
    healthHazard: null,
    environmentalHazard: null,
    fireExplosionHazard: null,
    skinContact: null,
    eyeContact: null,
    inhalation: null,
    ingestion: null,
    hazardCharacteristics: null,
    harmfulCombustionProducts: null,
    extinguishingMethod: null,
    emergencyHandling: null,
    operationPrecautions: null,
    storagePrecautions: null,
    chinaMac: null,
    formerSovietUnion: null,
    tlvtN: null,
    tlvwN: null,
    engineeringControls: null,
    respiratoryProtection: null,
    eyeProtection: null,
    bodyProtection: null,
    handProtection: null,
    otherProtection: null,
    mainComponents: null,
    appearanceAndCharacteristics: null,
    meltingPoint: null,
    boilingPoint: null,
    relativeDensity: null,
    relativeVaporDensity: null,
    saturatedVaporPressure: null,
    combustionHeat: null,
    criticalTemperature: null,
    criticalPressure: null,
    logarithmOfPartitionCoefficient: null,
    flashPoint: null,
    ignitionTemperature: null,
    upperExplosiveLimit: null,
    lowerExplosiveLimit: null,
    mainUses: null,
    forbiddenSubstances: null,
    acuteToxicityLd50: null,
    acuteToxicityLc50: null,
    otherHarmfulEffects: null,
    wastePropertiesAndDisposalMethods: null,
    dangerousGoodsNumber: null,
    unNumber: null,
    packingGroup: null,
    packingMethod: null,
    transportationPrecautions: null,
    regulatoryInformation: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    fileUrl: null,
  };
  proxy.resetForm("chemicalsRef");
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
  title.value = "添加危险化学品管理档案";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getChemicals(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改危险化学品管理档案";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["chemicalsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateChemicals(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addChemicals(form.value).then(response => {
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
    return delChemicals(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/chemicals/export', {
    ...queryParams.value
  }, `chemicals_${new Date().getTime()}.xlsx`)
}
function handleDetail(row){
  proxy.$router.push({
    path: '/safework/chemicalsDetail',
    query:{
      id:row.id
    }
  })
}

getList();
</script>
