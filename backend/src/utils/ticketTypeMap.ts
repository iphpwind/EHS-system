/**
 * 8种作业票子表映射配置 + GB30871-2022标准安全措施模板
 * 每种作业类型按级别区分安全措施，符合国家标准
 */

export const TICKET_TYPE_MAP: Record<string, {
  tableName: string;
  label: string;
  detailFields: string[];
}> = {
  'hot_work': {
    tableName: 'firework_tickets',
    label: '动火作业',
    detailFields: ['level_id', 'work_type', 'fire_location', 'gas_analysis_time', 'oxygen_content', 'combustible_gas', 'toxic_gas_h2s', 'toxic_gas_co', 'fire_guardian_name', 'fire_extinguisher', 'is_dangerous_work']
  },
  'high_work': {
    tableName: 'highwork_tickets',
    label: '高处作业',
    detailFields: ['work_height', 'level_id', 'fall_protection_type', 'harness_count', 'safety_net_set', 'warning_zone_set', 'scaffold_inspection', 'wind_force_level']
  },
  'limited_space': {
    tableName: 'restrictedwork_tickets',
    label: '受限空间作业',
    detailFields: ['medium_name', 'medium_content', 'oxygen_content', 'combustible_gas', 'toxic_gas_h2s', 'toxic_gas_co', 'isolation_method', 'cleaning_method', 'rescue_equipment', 'ventilation_method', 'guardian_name', 'entry_count']
  },
  'temporary_electricity': {
    tableName: 'electricwork_tickets',
    label: '临时用电作业',
    detailFields: ['power_source', 'voltage_level', 'total_power', 'distribution_box_no', 'leakage_protection', 'grounding_method', 'electrician_name', 'electrician_cert_no']
  },
  'blind_work': {
    tableName: 'blind_tickets',
    label: '盲板抽堵作业',
    detailFields: ['blind_no', 'blind_spec', 'blind_material', 'pipeline_medium', 'pipeline_pressure', 'work_way', 'operation_position', 'confirmation_person']
  },
  'road_work': {
    tableName: 'broken_tickets',
    label: '断路作业',
    detailFields: ['broken_no', 'broken_area', 'broken_reason', 'traffic_sign_set', 'fence_set', 'night_warning_light', 'traffic_diversion_plan', 'contact_person', 'contact_phone']
  },
  'hoisting_work': {
    tableName: 'hoisting_tickets',
    label: '吊装作业',
    detailFields: ['lift_weight', 'level_id', 'crane_type', 'crane_plate_no', 'spreader_type', 'spreader_check', 'commander_name', 'operator_name', 'operator_cert_no', 'wind_restriction']
  },
  'excavation_work': {
    tableName: 'earth_tickets',
    label: '动土作业',
    detailFields: ['dig_depth', 'dig_width', 'dig_length', 'work_way', 'underground_pipeline_probe', 'pipeline_type', 'support_plan', 'dewatering_measure', 'warning_sign_set', 'emergency_exit']
  }
};

// 级别标签映射
export const LEVEL_LABELS: Record<string, Record<string, string>> = {
  'hot_work': { 'special': '特级动火', 'level1': '一级动火', 'level2': '二级动火' },
  'high_work': { 'special': '特级高处(>30m)', 'level1': '一级高处(15-30m)', 'level2': '二级高处(5-15m)', 'level3': '三级高处(2-5m)' },
  'hoisting_work': { 'level1': '一级吊装(>100t)', 'level2': '二级吊装(40-100t)', 'level3': '三级吊装(<40t)' }
};

/**
 * 获取安全措施模板（按作业类型+级别）
 * GB30871-2022 标准安全措施项
 */
export const getSafetyMeasures = (ticketType: string, level?: string): { label: string; section: string }[] => {
  // 基础共有措施（无论级别都必须满足）
  const commonMeasures = getCommonMeasures(ticketType);
  // 级别特定措施
  const levelMeasures = getLevelMeasures(ticketType, level);
  return [...commonMeasures, ...levelMeasures];
};

/** 每种作业类型的通用安全措施 */
const getCommonMeasures = (type: string) => {
  const map: Record<string, { label: string; section: string }[]> = {
    'hot_work': [
      { label: '动火设备已检查合格，管线已清洗置换', section: '通用' },
      { label: '动火点周围易燃物已清理（半径15m内）', section: '通用' },
      { label: '消防器材已配备到位（灭火器/消防沙等）', section: '通用' },
      { label: '监火人已到位并经过消防安全培训', section: '通用' },
      { label: '作业人员持有效《特种作业操作证》', section: '通用' },
      { label: '动火点下方及周围孔洞、地沟已采取隔火措施', section: '通用' },
    ],
    'high_work': [
      { label: '作业人员身体健康，无高血压、心脏病等高处作业禁忌症', section: '通用' },
      { label: '安全带、安全绳已检查合格（双钩五点式）', section: '通用' },
      { label: '脚手架/梯具已检查合格并挂牌', section: '通用' },
      { label: '安全网已正确设置并检查', section: '通用' },
      { label: '警戒区已设置，下方无危险区域', section: '通用' },
      { label: '工具已采取防坠落措施（工具袋/安全绳）', section: '通用' },
      { label: '风力六级(含)以上禁止高处作业', section: '通用' },
      { label: '雷雨、大雾、冰雹等恶劣天气禁止作业', section: '通用' },
    ],
    'limited_space': [
      { label: '作业前已进行安全交底（方案/风险/应急）', section: '通用' },
      { label: '隔离措施已到位（盲板/切断/拆除管线）', section: '通用' },
      { label: '清洗置换合格（蒸煮/吹扫/置换）', section: '通用' },
      { label: '气体分析合格（O₂:19.5-23.5%vol，可燃气体≤0.5%LEL）', section: '通用' },
      { label: '有毒气体分析合格（H₂S≤10mg/m³，CO≤24ppm）', section: '通用' },
      { label: '连续机械通风已开启并正常运行', section: '通用' },
      { label: '救援设备已配备（三脚架/全身式安全带/救生索/通讯设备）', section: '通用' },
      { label: '监护人已到位并经过受限空间救援培训', section: '通用' },
      { label: '照明电压≤24V，电缆无接头且完好', section: '通用' },
      { label: '作业人员佩戴隔离式呼吸器（非过滤式防毒面具）', section: '通用' },
      { label: '每2小时重新检测气体并记录', section: '通用' },
    ],
    'temporary_electricity': [
      { label: '配电箱已检查合格并上锁管理', section: '通用' },
      { label: '漏电保护器已安装并测试动作可靠（动作电流≤30mA）', section: '通用' },
      { label: '接地保护已连接（TN-S系统，PE线连接可靠）', section: '通用' },
      { label: '电缆无破损、老化，敷设符合安全要求', section: '通用' },
      { label: '电气作业人员持有效《特种作业操作证》（电工证）', section: '通用' },
      { label: '防雨、防潮措施已到位', section: '通用' },
      { label: '线路架空高度≥2.5m（道路）或≥1.8m（其他）/埋地保护', section: '通用' },
      { label: '开关箱实行"一机一闸一漏一箱"原则', section: '通用' },
      { label: '危险爆炸区域使用防爆电气设备', section: '通用' },
    ],
    'blind_work': [
      { label: '管道/设备已泄压排空至常压', section: '通用' },
      { label: '盲板规格（公称压力/公称直径）符合工艺要求', section: '通用' },
      { label: '盲板材质符合介质耐腐蚀要求', section: '通用' },
      { label: '盲板位置已标注并编号，操作人员已熟悉盲板位置图', section: '通用' },
      { label: '已办理管线打开安全许可证（如需办理）', section: '通用' },
      { label: '上下游工序已沟通协调并确认', section: '通用' },
      { label: '防护用品已准备（防毒面具/防护面罩/防酸服等）', section: '通用' },
    ],
    'road_work': [
      { label: '交通警示标识已按GB/T 28934要求设置', section: '通用' },
      { label: '围栏/护栏已按要求设置并固定', section: '通用' },
      { label: '夜间警示灯/反光设施已配置', section: '通用' },
      { label: '交通疏导方案已制定，疏导员已安排', section: '通用' },
      { label: '消防应急通道已保留（宽度≥4m）', section: '通用' },
      { label: '绕行路线已公示并告知相关部门', section: '通用' },
      { label: '涉及地下管线已与产权单位确认并交底', section: '通用' },
      { label: '施工方案已审批通过并备案', section: '通用' },
    ],
    'hoisting_work': [
      { label: '吊装方案已审批，技术交底已完成', section: '通用' },
      { label: '吊车及吊索具已检查合格，检定证书在有效期内', section: '通用' },
      { label: '吊车支腿已完全伸出，地面承载力满足要求', section: '通用' },
      { label: '指挥信号（手势/旗语/对讲机）已明确并统一', section: '通用' },
      { label: '起重指挥人员和吊车司机持有效《特种设备作业人员证》', section: '通用' },
      { label: '吊物下方严禁站人、穿越、停留', section: '通用' },
      { label: '吊臂与架空电力线路保持安全距离', section: '通用' },
      { label: '风力六级(含)以上禁止吊装作业（大型吊装>200t五级以上）', section: '通用' },
    ],
    'excavation_work': [
      { label: '地下管线已探测并标注于施工图上', section: '通用' },
      { label: '相关管线（电缆/燃气/给排水）产权单位已现场确认', section: '通用' },
      { label: '挖掘方案已审批通过', section: '通用' },
      { label: '深度≥1.5m的基坑应制定专项支护方案', section: '通用' },
      { label: '地下水位以上需降水措施已到位', section: '通用' },
      { label: '警示标识和围栏已沿坑边设置', section: '通用' },
      { label: '堆土距坑边≥1m，堆土高度≤1.5m', section: '通用' },
      { label: '应急逃生通道已设置（水平间距≤50m）', section: '通用' },
    ],
  };
  return map[type] || [];
};

/** 级别附加安全措施 */
const getLevelMeasures = (type: string, level?: string) => {
  if (!level) return [];

  const levelMap: Record<string, Record<string, { label: string; section: string }[]>> = {
    'hot_work': {
      'special': [
        { label: '【特级】制定动火作业专项方案并经企业主要负责人审批', section: '附加' },
        { label: '【特级】企业主要负责人（厂长/总经理）到现场监督', section: '附加' },
        { label: '【特级】连续气体监测报警仪已就位，数据实时记录', section: '附加' },
        { label: '【特级】每2小时重新分析气体成分并记录', section: '附加' },
        { label: '【特级】作业中断超过30分钟，须重新进行分析', section: '附加' },
        { label: '【特级】专项应急预案已编制并完成桌面推演', section: '附加' },
      ],
      'level1': [
        { label: '【一级】气体分析合格（可燃气体≤0.5%LEL）', section: '附加' },
        { label: '【一级】涉及高处动火，防火毯已铺设', section: '附加' },
        { label: '【一级】动火点周围地沟、电缆井、排水沟已封堵', section: '附加' },
      ],
      'level2': [
        { label: '【二级】气体分析合格（可燃气体≤0.5%LEL）', section: '附加' },
        { label: '【二级】现场配备灭火器不少于2具', section: '附加' },
      ],
    },
    'high_work': {
      'special': [
        { label: '【特级>30m】作业方案经专家论证通过', section: '附加' },
        { label: '【特级>30m】通讯联络设备（对讲机）已配备', section: '附加' },
        { label: '【特级>30m】双人监护（监护+备用监护）', section: '附加' },
        { label: '【特级>30m】应急救援预案已编制并设备到位', section: '附加' },
        { label: '【特级>30m】作业人员已进行专项体检（含心电图）', section: '附加' },
      ],
      'level1': [
        { label: '【一级15-30m】专业监护人全程监护', section: '附加' },
        { label: '【一级15-30m】安全绳固定点独立设置（双锚点）', section: '附加' },
      ],
      'level2': [
        { label: '【二级5-15m】安全绳固定点可靠', section: '附加' },
      ],
      'level3': [
        { label: '【三级2-5m】安全带正确穿戴', section: '附加' },
      ],
    },
    'hoisting_work': {
      'level1': [
        { label: '【一级>100t】吊装方案经专家论证并通过审批', section: '附加' },
        { label: '【一级>100t】使用对讲机统一指挥信号', section: '附加' },
        { label: '【一级>100t】试吊检查确认安全后方可正式起吊', section: '附加' },
      ],
    },
  };

  return levelMap[type]?.[level] || [];
};

/**
 * 兼容旧接口：获取安全措施模板（仅按类型，不含级别）
 */
export const getSafetyMeasuresTemplate = (ticketType: string): string[] => {
  return getSafetyMeasures(ticketType).map(m => m.label);
};

/**
 * 根据ticket_type获取审批流程节点名称
 */
export const getApprovalFlowNodes = (ticketType: string, level?: string): string[] => {
  const flows: Record<string, string[]> = {
    'hot_work': ['申请人提交', '部门负责人审批', '安全员审批', '厂级领导审批'],
    'high_work': ['申请人提交', '部门负责人审批', '安全员审批'],
    'limited_space': ['申请人提交', '部门负责人审批', '安全员审批', '厂级领导审批'],
    'temporary_electricity': ['申请人提交', '电工确认', '安全员审批'],
    'blind_work': ['申请人提交', '部门负责人审批', '安全员审批'],
    'road_work': ['申请人提交', '部门负责人审批', '安全员审批'],
    'hoisting_work': ['申请人提交', '部门负责人审批', '安全员审批'],
    'excavation_work': ['申请人提交', '部门负责人审批', '安全员审批'],
  };
  return flows[ticketType] || ['申请人提交', '审批'];
};

/** 获取作业票级别选项列表 */
export const getLevelOptions = (ticketType: string) => {
  const levelMap: Record<string, { value: string; label: string }[]> = {
    'hot_work': [
      { value: 'special', label: '特级动火（在运行状态设备/禁区/易燃易爆场所）' },
      { value: 'level1', label: '一级动火（易燃易爆区域非禁区）' },
      { value: 'level2', label: '二级动火（非易燃易爆区域）' },
    ],
    'high_work': [
      { value: 'special', label: '特级高处作业（作业高度>30m）' },
      { value: 'level1', label: '一级高处作业（15m<作业高度≤30m）' },
      { value: 'level2', label: '二级高处作业（5m<作业高度≤15m）' },
      { value: 'level3', label: '三级高处作业（2m<作业高度≤5m）' },
    ],
    'hoisting_work': [
      { value: 'level1', label: '一级吊装（吊物重量>100t）' },
      { value: 'level2', label: '二级吊装（40t<吊物重量≤100t）' },
      { value: 'level3', label: '三级吊装（吊物重量≤40t）' },
    ],
  };
  return levelMap[ticketType] || [];
};
