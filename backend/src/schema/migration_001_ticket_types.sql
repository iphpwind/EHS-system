-- ============================================================
-- 安全生产管理系统 v9.0 升级脚本 - 8种作业票子表
-- 依据 GB30871-2022 标准 + 聚通云参考系统字段设计
-- ============================================================

USE `safety_system`;

-- ============================================================
-- 1. 动火作业子表 (firework_tickets)
-- 特有字段：动火级别、动火方式、气体分析、监火人
-- ============================================================
CREATE TABLE IF NOT EXISTS `firework_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `level_id` VARCHAR(20) DEFAULT '' COMMENT '动火级别(一级/二级/三级/特级)',
    `work_type` VARCHAR(100) DEFAULT '' COMMENT '动火方式(电焊/气焊/切割/打磨等)',
    `fire_location` VARCHAR(200) DEFAULT '' COMMENT '动火部位',
    `gas_analysis_time` DATETIME NULL COMMENT '气体分析时间',
    `oxygen_content` DECIMAL(5,2) COMMENT '氧气含量(%)',
    `combustible_gas` DECIMAL(8,4) COMMENT '可燃气体浓度(%LEL)',
    `toxic_gas_h2s` DECIMAL(8,4) COMMENT '有毒气体H2S(ppm)',
    `toxic_gas_co` DECIMAL(8,4) COMMENT '有毒气体CO(ppm)',
    `analyst_id` INT COMMENT '分析人ID',
    `analyst_name` VARCHAR(50) COMMENT '分析人姓名',
    `analyst_sign` TEXT COMMENT '分析人签字(base64)',
    `fire_guardian_id` INT COMMENT '监火人ID',
    `fire_guardian_name` VARCHAR(50) COMMENT '监火人姓名',
    `fire_guardian_sign` TEXT COMMENT '监火人签字(base64)',
    `fire_extinguisher` VARCHAR(200) DEFAULT '' COMMENT '灭火器材配置',
    `fire_blanket` TINYINT DEFAULT 0 COMMENT '是否使用防火毯',
    `fire_proof_screen` TINYINT DEFAULT 0 COMMENT '是否使用防火屏',
    `clean_fire_area` VARCHAR(200) DEFAULT '' COMMENT '动火区域清理范围',
    `emergency_water` TINYINT DEFAULT 0 COMMENT '是否配备消防水',
    `reanalysis_interval` INT DEFAULT 30 COMMENT '复测间隔(分钟)',
    `is_dangerous_work` TINYINT DEFAULT 0 COMMENT '是否特级动火(带压/易燃易爆)',
    `dept_head_approval` TINYINT DEFAULT 0 COMMENT '部门负责人是否已确认',
    `safety_officer_approval` TINYINT DEFAULT 0 COMMENT '安全员是否已确认',
    `plant_manager_approval` TINYINT DEFAULT 0 COMMENT '厂级领导是否已审批(特级)',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_level` (`level_id`),
    INDEX `idx_guardian` (`fire_guardian_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动火作业子表(GB30871-2022)';

-- ============================================================
-- 2. 高处作业子表 (highwork_tickets)
-- 特有字段：作业高度、坠落防护、安全网
-- ============================================================
CREATE TABLE IF NOT EXISTS `highwork_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `work_height` DECIMAL(6,1) DEFAULT 0 COMMENT '作业高度(米)',
    `level_id` VARCHAR(20) DEFAULT '' COMMENT '级别(I/II/III/IV)',
    `fall_protection_type` VARCHAR(100) DEFAULT '' COMMENT '坠落防护类型(安全带/安全绳/防坠器)',
    `harness_count` INT DEFAULT 0 COMMENT '安全带数量',
    `safety_net_set` TINYINT DEFAULT 0 COMMENT '是否设置安全网',
    `safety_net_spec` VARCHAR(100) DEFAULT '' COMMENT '安全网规格',
    `warning_zone_set` TINYINT DEFAULT 0 COMMENT '是否设置警戒区',
    `warning_sign_set` TINYINT DEFAULT 0 COMMENT '是否设置警示标识',
    `ladder_inspection` TINYINT DEFAULT 0 COMMENT '梯具是否检查合格',
    `scaffold_inspection` TINYINT DEFAULT 0 COMMENT '脚手架是否检查合格',
    `scaffold_type` VARCHAR(100) DEFAULT '' COMMENT '脚手架类型',
    `wind_force_level` VARCHAR(20) DEFAULT '' COMMENT '风力等级(六级以上禁止)',
    `is_thunderstorm` TINYINT DEFAULT 0 COMMENT '是否雷雨天气',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_height` (`work_height`),
    INDEX `idx_level` (`level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='高处作业子表(GB30871-2022)';

-- ============================================================
-- 3. 受限空间作业子表 (restrictedwork_tickets)
-- 特有字段：介质、氧含量、有毒气体、隔离、救援
-- ============================================================
CREATE TABLE IF NOT EXISTS `restrictedwork_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `medium_name` VARCHAR(200) DEFAULT '' COMMENT '原有介质名称',
    `medium_content` TEXT COMMENT '介质成分说明',
    `oxygen_content` DECIMAL(5,2) COMMENT '氧含量(%)(19.5-23.5)',
    `combustible_gas` DECIMAL(8,4) COMMENT '可燃气体浓度(%LEL)',
    `toxic_gas_h2s` DECIMAL(8,4) COMMENT '硫化氢(ppm)',
    `toxic_gas_co` DECIMAL(8,4) COMMENT '一氧化碳(ppm)',
    `other_gas_name` VARCHAR(100) DEFAULT '' COMMENT '其他气体名称',
    `other_gas_value` VARCHAR(50) DEFAULT '' COMMENT '其他气体测量值',
    `isolation_method` VARCHAR(200) DEFAULT '' COMMENT '隔离方式(盲板/切断/拆除)',
    `isolation_position` VARCHAR(200) DEFAULT '' COMMENT '隔离位置',
    `isolation_verified` TINYINT DEFAULT 0 COMMENT '隔离是否已确认',
    `cleaning_method` VARCHAR(200) DEFAULT '' COMMENT '清洗置换方式',
    `cleaning_verified` TINYINT DEFAULT 0 COMMENT '清洗是否合格',
    `lighting_voltage` VARCHAR(50) DEFAULT '' COMMENT '照明电压(V)',
    `lighting_type` VARCHAR(100) DEFAULT '' COMMENT '照明类型(安全电压/防爆)',
    `rescue_equipment` TEXT COMMENT '救援设备(三脚架/安全带/救生绳等)',
    `rescue_plan` TEXT COMMENT '应急救援方案',
    `ventilation_method` VARCHAR(200) DEFAULT '' COMMENT '通风方式(机械/自然)',
    `ventilation_duration` INT DEFAULT 0 COMMENT '通风时长(分钟)',
    `continuous_monitoring` TINYINT DEFAULT 0 COMMENT '是否连续监测',
    `analyst_name` VARCHAR(50) DEFAULT '' COMMENT '分析人姓名',
    `analysis_time` DATETIME NULL COMMENT '分析时间',
    `analyst_sign` TEXT COMMENT '分析人签字(base64)',
    `guardian_name` VARCHAR(50) DEFAULT '' COMMENT '监护人姓名',
    `guardian_sign` TEXT COMMENT '监护人签字(base64)',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `entry_personnel` TEXT COMMENT '进入人员名单',
    `entry_count` INT DEFAULT 0 COMMENT '进入人数',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_guardian` (`guardian_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='受限空间作业子表(GB30871-2022)';

-- ============================================================
-- 4. 临时用电作业子表 (electricwork_tickets)
-- 特有字段：电源接入点、电压、功率、漏电保护
-- ============================================================
CREATE TABLE IF NOT EXISTS `electricwork_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `power_source` VARCHAR(200) DEFAULT '' COMMENT '电源接入点',
    `voltage_level` VARCHAR(50) DEFAULT '' COMMENT '电压等级(220V/380V/10kV)',
    `total_power` DECIMAL(10,2) DEFAULT 0 COMMENT '总功率(kW)',
    `electric_meter_no` VARCHAR(100) DEFAULT '' COMMENT '电表编号',
    `distribution_box_no` VARCHAR(100) DEFAULT '' COMMENT '配电箱编号',
    `line_length` DECIMAL(8,1) DEFAULT 0 COMMENT '线路长度(米)',
    `cable_spec` VARCHAR(100) DEFAULT '' COMMENT '电缆规格',
    `cable_route` TEXT COMMENT '电缆敷设路径',
    `leakage_protection` TINYINT DEFAULT 0 COMMENT '是否安装漏电保护器',
    `leakage_protector_spec` VARCHAR(100) DEFAULT '' COMMENT '漏电保护器规格',
    `grounding_method` VARCHAR(200) DEFAULT '' COMMENT '接地方式',
    `grounding_resistance` DECIMAL(8,2) COMMENT '接地电阻(Ω)',
    `is_explosion_proof` TINYINT DEFAULT 0 COMMENT '是否防爆区域',
    `explosion_proof_level` VARCHAR(50) DEFAULT '' COMMENT '防爆等级',
    `rain_proof_measure` TEXT COMMENT '防雨措施',
    `electrician_id` INT COMMENT '电工ID',
    `electrician_name` VARCHAR(50) DEFAULT '' COMMENT '电工姓名',
    `electrician_cert_no` VARCHAR(100) DEFAULT '' COMMENT '电工证编号',
    `electrician_sign` TEXT COMMENT '电工签字(base64)',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_electrician` (`electrician_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时用电作业子表(GB30871-2022)';

-- ============================================================
-- 5. 盲板抽堵作业子表 (blind_tickets)
-- 特有字段：盲板规格、管道介质、盲板编号
-- ============================================================
CREATE TABLE IF NOT EXISTS `blind_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `blind_no` VARCHAR(100) DEFAULT '' COMMENT '盲板编号',
    `blind_spec` VARCHAR(200) DEFAULT '' COMMENT '盲板规格(DN/PN)',
    `blind_material` VARCHAR(100) DEFAULT '' COMMENT '盲板材质',
    `blind_position_img` TEXT COMMENT '盲板位置图(base64)',
    `pipeline_medium` VARCHAR(200) DEFAULT '' COMMENT '管道介质',
    `pipeline_pressure` VARCHAR(50) DEFAULT '' COMMENT '管道压力(MPa)',
    `pipeline_temp` VARCHAR(50) DEFAULT '' COMMENT '管道温度(℃)',
    `pipeline_spec` VARCHAR(200) DEFAULT '' COMMENT '管道规格(DN)',
    `work_way` VARCHAR(100) DEFAULT '' COMMENT '作业方式(抽/堵)',
    `operation_position` VARCHAR(200) DEFAULT '' COMMENT '操作位置',
    `blind_count` INT DEFAULT 0 COMMENT '盲板数量',
    `operation_type` VARCHAR(50) DEFAULT '' COMMENT '操作类型(盲板抽/盲板堵)',
    `is_high_pressure` TINYINT DEFAULT 0 COMMENT '是否高压管道',
    `is_toxic_medium` TINYINT DEFAULT 0 COMMENT '是否有毒介质',
    `pressure_relief` TINYINT DEFAULT 0 COMMENT '是否已泄压',
    `drain_done` TINYINT DEFAULT 0 COMMENT '是否已排空',
    `confirmation_person` VARCHAR(50) DEFAULT '' COMMENT '确认人姓名',
    `confirmation_sign` TEXT COMMENT '确认人签字(base64)',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_blind_no` (`blind_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='盲板抽堵作业子表(GB30871-2022)';

-- ============================================================
-- 6. 断路作业子表 (broken_tickets)
-- 特有字段：断路区域、断路时间、标识设置、交通疏导
-- ============================================================
CREATE TABLE IF NOT EXISTS `broken_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `broken_no` VARCHAR(100) DEFAULT '' COMMENT '断路编号',
    `broken_area` VARCHAR(500) DEFAULT '' COMMENT '断路区域(详细描述+范围)',
    `broken_reason` TEXT COMMENT '断路原因',
    `broken_start_time` DATETIME NULL COMMENT '断路开始时间',
    `broken_end_time` DATETIME NULL COMMENT '断路结束时间',
    `broken_explain` TEXT COMMENT '断路相关说明',
    `traffic_sign_set` TINYINT DEFAULT 0 COMMENT '是否设置交通警示标识',
    `traffic_sign_desc` TEXT COMMENT '交通标识设置说明',
    `fence_set` TINYINT DEFAULT 0 COMMENT '是否设置围栏',
    `fence_desc` VARCHAR(200) DEFAULT '' COMMENT '围栏设置说明',
    `night_warning_light` TINYINT DEFAULT 0 COMMENT '是否设置夜间警示灯',
    `traffic_diversion_plan` TEXT COMMENT '交通疏导方案',
    `detour_route` TEXT COMMENT '绕行路线说明',
    `emergency_access` TINYINT DEFAULT 0 COMMENT '是否保留应急通道',
    `emergency_access_desc` VARCHAR(200) DEFAULT '' COMMENT '应急通道说明',
    `contact_person` VARCHAR(50) DEFAULT '' COMMENT '联系人',
    `contact_phone` VARCHAR(20) DEFAULT '' COMMENT '联系电话',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_broken_no` (`broken_no`),
    INDEX `idx_broken_time` (`broken_start_time`, `broken_end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='断路作业子表(GB30871-2022)';

-- ============================================================
-- 7. 吊装作业子表 (hoisting_tickets)
-- 特有字段：吊物重量、级别、吊具类型、指挥信号
-- ============================================================
CREATE TABLE IF NOT EXISTS `hoisting_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `lift_weight` DECIMAL(10,2) DEFAULT 0 COMMENT '吊物重量(吨)',
    `level_id` VARCHAR(20) DEFAULT '' COMMENT '吊装级别(一级>40t/二级15-40t/三级<15t)',
    `lift_dimension` VARCHAR(100) DEFAULT '' COMMENT '吊物尺寸(长x宽x高)',
    `crane_type` VARCHAR(100) DEFAULT '' COMMENT '吊车型号/类型',
    `crane_plate_no` VARCHAR(50) DEFAULT '' COMMENT '吊车车牌号',
    `spreader_type` VARCHAR(100) DEFAULT '' COMMENT '吊具类型(吊钩/钢丝绳/吊带/卸扣等)',
    `spreader_spec` VARCHAR(100) DEFAULT '' COMMENT '吊具规格',
    `spreader_check` TINYINT DEFAULT 0 COMMENT '吊索具是否检查合格',
    `spreader_check_detail` TEXT COMMENT '吊索具检查详情',
    `command_signal_method` VARCHAR(200) DEFAULT '' COMMENT '指挥信号方式(旗语/口哨/对讲机)',
    `commander_name` VARCHAR(50) DEFAULT '' COMMENT '指挥人员姓名',
    `commander_cert_no` VARCHAR(100) DEFAULT '' COMMENT '指挥人员证号',
    `operator_name` VARCHAR(50) DEFAULT '' COMMENT '起重机司机姓名',
    `operator_cert_no` VARCHAR(100) DEFAULT '' COMMENT '起重机司机证号',
    `operator_sign` TEXT COMMENT '司机签字(base64)',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `wind_restriction` VARCHAR(50) DEFAULT '' COMMENT '风力限制(通常五级以下)',
    `outrigger_condition` TEXT COMMENT '支腿情况',
    `ground_condition` TEXT COMMENT '地面承载条件',
    `safety_distance` VARCHAR(100) DEFAULT '' COMMENT '与架空线路安全距离',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_level` (`level_id`),
    INDEX `idx_weight` (`lift_weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='吊装作业子表(GB30871-2022)';

-- ============================================================
-- 8. 动土作业子表 (earth_tickets)
-- 特有字段：挖掘深度、地下管线探测、支护方案
-- ============================================================
CREATE TABLE IF NOT EXISTS `earth_tickets` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '关联主票ID(work_tickets)',
    `dig_depth` DECIMAL(6,1) DEFAULT 0 COMMENT '挖掘深度(米)',
    `dig_width` DECIMAL(6,1) DEFAULT 0 COMMENT '挖掘宽度(米)',
    `dig_length` DECIMAL(8,1) DEFAULT 0 COMMENT '挖掘长度(米)',
    `dig_area` VARCHAR(500) DEFAULT '' COMMENT '挖掘范围描述',
    `work_way` VARCHAR(200) DEFAULT '' COMMENT '作业方式(人工/机械)',
    `work_scope` TEXT COMMENT '作业范围详细说明',
    `work_img` TEXT COMMENT '作业简图(base64)',
    `underground_pipeline_probe` TINYINT DEFAULT 0 COMMENT '是否已进行地下管线探测',
    `pipeline_probe_result` TEXT COMMENT '管线探测结果',
    `pipeline_type` VARCHAR(200) DEFAULT '' COMMENT '地下管线类型(电缆/燃气/水管等)',
    `pipeline_depth` DECIMAL(6,1) COMMENT '管线埋深(米)',
    `pipeline_owner` VARCHAR(200) DEFAULT '' COMMENT '管线归属单位',
    `support_plan` TEXT COMMENT '支护方案',
    `support_type` VARCHAR(100) DEFAULT '' COMMENT '支护类型(钢板桩/放坡/支撑等)',
    `dewatering_measure` TEXT COMMENT '降水措施',
    `dewatering_method` VARCHAR(200) DEFAULT '' COMMENT '降水方式',
    `warning_sign_set` TINYINT DEFAULT 0 COMMENT '是否设置警示标识',
    `night_warning_light` TINYINT DEFAULT 0 COMMENT '是否设置夜间警示灯',
    `fence_set` TINYINT DEFAULT 0 COMMENT '是否设置围栏',
    `emergency_exit` VARCHAR(200) DEFAULT '' COMMENT '应急逃生通道',
    `soil_stack_distance` DECIMAL(6,1) COMMENT '堆土距离坑边(米)',
    `worker_sign` TEXT COMMENT '作业人签字(base64)',
    `remark` TEXT COMMENT '备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket` (`ticket_id`),
    INDEX `idx_depth` (`dig_depth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动土作业子表(GB30871-2022)';

-- ============================================================
-- 9. 作业票与子表关联视图 (统一查询用)
-- ============================================================
CREATE OR REPLACE VIEW `v_ticket_with_type_detail` AS
SELECT 
    t.*,
    COALESCE(f.id, h.id, r.id, e.id, b.id, br.id, ho.id, ea.id) AS sub_id,
    CASE t.ticket_type
        WHEN 'hot_work' THEN f.work_type
        WHEN 'high_work' THEN CONCAT(h.work_height, 'm')
        WHEN 'limited_space' THEN r.medium_name
        WHEN 'temporary_electricity' THEN e.voltage_level
        WHEN 'blind_work' THEN b.blind_spec
        WHEN 'road_work' THEN br.broken_area
        WHEN 'hoisting_work' THEN CONCAT(ho.lift_weight, 't')
        WHEN 'excavation_work' THEN CONCAT(ea.dig_depth, 'm')
    END AS type_detail,
    COALESCE(f.level_id, h.level_id, ho.level_id, '') AS level_name,
    COALESCE(f.fire_guardian_name, r.guardian_name, '') AS guardian_name
FROM work_permits t
LEFT JOIN firework_tickets f ON t.id = f.ticket_id AND t.ticket_type = 'hot_work'
LEFT JOIN highwork_tickets h ON t.id = h.ticket_id AND t.ticket_type = 'high_work'
LEFT JOIN restrictedwork_tickets r ON t.id = r.ticket_id AND t.ticket_type = 'limited_space'
LEFT JOIN electricwork_tickets e ON t.id = e.ticket_id AND t.ticket_type = 'temporary_electricity'
LEFT JOIN blind_tickets b ON t.id = b.ticket_id AND t.ticket_type = 'blind_work'
LEFT JOIN broken_tickets br ON t.id = br.ticket_id AND t.ticket_type = 'road_work'
LEFT JOIN hoisting_tickets ho ON t.id = ho.ticket_id AND t.ticket_type = 'hoisting_work'
LEFT JOIN earth_tickets ea ON t.id = ea.ticket_id AND t.ticket_type = 'excavation_work';

-- ============================================================
-- 10. 数据字典表 (统一管理所有下拉选项)
-- ============================================================
CREATE TABLE IF NOT EXISTS `sys_dict_type` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `dict_name` VARCHAR(100) NOT NULL COMMENT '字典名称',
    `dict_code` VARCHAR(100) NOT NULL UNIQUE COMMENT '字典编码',
    `status` TINYINT DEFAULT 1 COMMENT '状态(0停用1启用)',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_dict_code` (`dict_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典类型表';

CREATE TABLE IF NOT EXISTS `sys_dict_data` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `dict_code` VARCHAR(100) NOT NULL COMMENT '字典编码',
    `dict_label` VARCHAR(100) NOT NULL COMMENT '字典标签(显示值)',
    `dict_value` VARCHAR(100) NOT NULL COMMENT '字典键值(存储值)',
    `dict_sort` INT DEFAULT 0 COMMENT '排序',
    `css_class` VARCHAR(100) DEFAULT '' COMMENT '样式属性(tag颜色等)',
    `status` TINYINT DEFAULT 1 COMMENT '状态(0停用1启用)',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_dict_code` (`dict_code`),
    INDEX `idx_sort` (`dict_sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典数据表';

-- ============================================================
-- 插入初始字典数据
-- ============================================================

-- 作业类型字典
INSERT INTO `sys_dict_type` (`dict_name`, `dict_code`, `remark`) VALUES
('作业类型', 'work_ticket_type', 'GB30871-2022 八大特殊作业类型'),
('作业级别', 'work_ticket_level', '各作业类型的级别划分'),
('动火方式', 'firework_work_type', '动火作业的具体方式'),
('作业状态', 'work_ticket_status', '作业票通用状态'),
('吊具类型', 'hoisting_spreader_type', '吊装作业吊具类型'),
('断路原因', 'broken_reason_type', '断路作业原因分类');

INSERT INTO `sys_dict_data` (`dict_code`, `dict_label`, `dict_value`, `dict_sort`, `css_class`) VALUES
-- 作业类型
('work_ticket_type', '动火作业', 'hot_work', 1, 'danger'),
('work_ticket_type', '高处作业', 'high_work', 2, 'warning'),
('work_ticket_type', '受限空间作业', 'limited_space', 3, 'danger'),
('work_ticket_type', '临时用电作业', 'temporary_electricity', 4, 'warning'),
('work_ticket_type', '盲板抽堵作业', 'blind_work', 5, 'primary'),
('work_ticket_type', '断路作业', 'road_work', 6, 'info'),
('work_ticket_type', '吊装作业', 'hoisting_work', 7, 'warning'),
('work_ticket_type', '动土作业', 'excavation_work', 8, 'primary'),

-- 动火级别
('work_ticket_level', '特级动火', 'special', 1, 'danger'),
('work_ticket_level', '一级动火', 'level1', 2, 'danger'),
('work_ticket_level', '二级动火', 'level2', 3, 'warning'),
('work_ticket_level', '三级动火', 'level3', 4, 'warning'),

-- 动火方式
('firework_work_type', '电焊', 'electric_welding', 1, ''),
('firework_work_type', '气焊', 'gas_welding', 2, ''),
('firework_work_type', '气割', 'gas_cutting', 3, ''),
('firework_work_type', '打磨', 'grinding', 4, ''),
('firework_work_type', '切割', 'cutting', 5, ''),
('firework_work_type', '其他动火', 'other', 99, ''),

-- 作业状态
('work_ticket_status', '草稿', 'draft', 1, 'info'),
('work_ticket_status', '待审批', 'pending', 2, 'warning'),
('work_ticket_status', '已批准', 'approved', 3, 'primary'),
('work_ticket_status', '执行中', 'executing', 4, 'success'),
('work_ticket_status', '已完成', 'completed', 5, 'success'),
('work_ticket_status', '已关闭', 'closed', 6, 'info'),
('work_ticket_status', '已终止', 'terminated', 7, 'danger'),
('work_ticket_status', '已作废', 'cancelled', 8, 'danger');

SELECT '8种作业票子表及数据字典创建完成！' AS message;
