-- ============================================================
-- EHS安全生产管理系统 - Phase2 数据库迁移脚本
-- 创建时间: 2026-05-10
-- 包含: 操作审计链、国标校验规则、合规评分、安全积分、数据域隔离
-- 字符集: utf8mb4 / 存储引擎: InnoDB
-- ============================================================

USE `safety_system`;

-- ============================================================
-- 1. 操作审计链表 (OperationTrace 快照表)
-- ============================================================
CREATE TABLE IF NOT EXISTS `operation_traces` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `entity_type` VARCHAR(50) NOT NULL COMMENT '实体类型: work_ticket/hazard/training/user',
    `entity_id` INT NOT NULL COMMENT '实体ID',
    `entity_no` VARCHAR(100) COMMENT '实体编号(如作业票号)',
    `action` VARCHAR(50) NOT NULL COMMENT '操作动作: create/submit/dept_approve/safety_approve/final_approve/start/finish/close/reject',
    `action_label` VARCHAR(100) COMMENT '操作中文标签',
    `operator_id` INT NOT NULL COMMENT '操作人ID',
    `operator_name` VARCHAR(100) COMMENT '操作人姓名',
    `operator_ip` VARCHAR(45) COMMENT '操作IP',
    `snapshot_before` JSON COMMENT '变更前快照(JSON)',
    `snapshot_after` JSON COMMENT '变更后快照(JSON)',
    `remarks` TEXT COMMENT '备注/操作说明',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_entity` (`entity_type`, `entity_id`),
    INDEX `idx_operator` (`operator_id`),
    INDEX `idx_action` (`action`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作审计链-快照表';

-- ============================================================
-- 2. 国标校验规则表 (GB30871-2022 规则引擎)
-- ============================================================
CREATE TABLE IF NOT EXISTS `national_standards` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL COMMENT '标准编号: GB30871-2022',
    `ticket_type` VARCHAR(50) NOT NULL COMMENT '适用作业类型: hot_work/high_work/confined_space/hoisting/earth/broken/blind/electric',
    `rule_key` VARCHAR(100) NOT NULL COMMENT '规则键: safety_measures_complete/risk_analysis_done/gas_detection_passed/guardian_assigned',
    `operator` VARCHAR(20) NOT NULL DEFAULT 'exists' COMMENT '校验操作符: exists/not_empty/ge/le/eq/in/contain',
    `rule_value` VARCHAR(500) DEFAULT NULL COMMENT '校验阈值或比较值',
    `field_path` VARCHAR(200) NOT NULL COMMENT '校验字段路径: safety_measures/gas_detection.oxygen/risk_level',
    `severity` VARCHAR(20) DEFAULT 'error' COMMENT '严重级别: error(阻断)/warning(警告提示)',
    `description` TEXT COMMENT '规则描述',
    `tip_message` VARCHAR(500) COMMENT '提示信息模板',
    `enabled` TINYINT DEFAULT 1 COMMENT '是否启用',
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_rule` (`ticket_type`, `rule_key`),
    INDEX `idx_type` (`ticket_type`),
    INDEX `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='国标校验规则表';

-- ============================================================
-- 3. 合规评分表
-- ============================================================
CREATE TABLE IF NOT EXISTS `compliance_scores` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `org_id` INT DEFAULT 1 COMMENT '组织ID',
    `user_id` INT DEFAULT NULL COMMENT '用户ID(个人评分时)',
    `dimension` VARCHAR(50) NOT NULL COMMENT '评分维度: work_compliance/hazard_closure/training_rate/emergency_drill/equipment_check',
    `dimension_label` VARCHAR(100) COMMENT '维度中文名',
    `score` DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '得分(百分制)',
    `total_items` INT DEFAULT 0 COMMENT '考核项总数',
    `passed_items` INT DEFAULT 0 COMMENT '达标项数',
    `period` VARCHAR(20) DEFAULT 'month' COMMENT '周期: day/week/month/quarter/year',
    `period_start` DATE COMMENT '周期起始',
    `period_end` DATE COMMENT '周期截止',
    `reason` TEXT COMMENT '评分依据说明',
    `detail` JSON COMMENT '评分明细JSON',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_org_period` (`org_id`, `period`),
    INDEX `idx_user_period` (`user_id`, `period`),
    INDEX `idx_dimension` (`dimension`),
    INDEX `idx_period` (`period_start`, `period_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合规评分表';

-- ============================================================
-- 4. 安全积分表
-- ============================================================
CREATE TABLE IF NOT EXISTS `safety_points` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT '用户ID',
    `user_name` VARCHAR(100) COMMENT '用户名(冗余)',
    `points_change` INT NOT NULL COMMENT '积分变更(+正/-负)',
    `balance_after` INT NOT NULL DEFAULT 0 COMMENT '变更后余额',
    `reason` VARCHAR(200) NOT NULL COMMENT '积分原因',
    `type` VARCHAR(50) NOT NULL COMMENT '积分类型: hazard_report/training_complete/work_safe/approve_timely/penalty_violation/correct_reward',
    `type_label` VARCHAR(100) COMMENT '类型中文标签',
    `related_entity` VARCHAR(100) COMMENT '关联实体类型',
    `related_id` INT DEFAULT NULL COMMENT '关联实体ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user` (`user_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='安全积分表';

-- ============================================================
-- 5. 安全积分规则配置表
-- ============================================================
CREATE TABLE IF NOT EXISTS `safety_point_rules` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `rule_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '规则编码',
    `rule_name` VARCHAR(100) NOT NULL COMMENT '规则名称',
    `type` VARCHAR(50) NOT NULL COMMENT '积分类型',
    `points` INT NOT NULL COMMENT '积分数值(+/-)',
    `daily_limit` INT DEFAULT 0 COMMENT '每日上限(0=不限)',
    `description` VARCHAR(300) COMMENT '规则描述',
    `enabled` TINYINT DEFAULT 1,
    `sort_order` INT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='安全积分规则配置表';

-- ============================================================
-- 6. 数据域隔离 - 为核心表添加 org_id 字段
-- ============================================================

-- 6.1 work_permits 添加组织ID
ALTER TABLE `work_permits` 
    ADD COLUMN IF NOT EXISTS `org_id` INT DEFAULT 1 COMMENT '组织ID' AFTER `id`,
    ADD INDEX IF NOT EXISTS `idx_org` (`org_id`);

-- 6.2 hazard_inspection 添加组织ID
ALTER TABLE `hazard_inspection` 
    ADD COLUMN IF NOT EXISTS `org_id` INT DEFAULT 1 COMMENT '组织ID' AFTER `id`,
    ADD INDEX IF NOT EXISTS `idx_org` (`org_id`);

-- 6.3 training_records 添加组织ID
ALTER TABLE `training_records` 
    ADD COLUMN IF NOT EXISTS `org_id` INT DEFAULT 1 COMMENT '组织ID' AFTER `id`,
    ADD INDEX IF NOT EXISTS `idx_org` (`org_id`);

-- ============================================================
-- 种子数据: GB30871-2022 国标校验规则
-- ============================================================

-- 动火作业规则
INSERT IGNORE INTO `national_standards` (`code`, `ticket_type`, `rule_key`, `operator`, `rule_value`, `field_path`, `severity`, `description`, `tip_message`, `enabled`, `sort_order`) VALUES
('GB30871-2022', 'hot_work', 'risk_analysis_done', 'not_empty', NULL, 'risk_analysis', 'error', '动火作业必须进行风险分析', '动火作业前需完成风险分析（GB30871-2022 5.1）', 1, 1),
('GB30871-2022', 'hot_work', 'fire_level_assigned', 'not_empty', NULL, 'fire_level', 'error', '必须明确动火级别', '请指定动火级别（特级/一级/二级）（GB30871-2022 5.2）', 1, 2),
('GB30871-2022', 'hot_work', 'guardian_assigned', 'not_empty', NULL, 'guardian_name', 'error', '必须指定监护人', '动火作业须配备专职监护人（GB30871-2022 5.3）', 1, 3),
('GB30871-2022', 'hot_work', 'fire_extinguisher_ready', 'contain', '灭火器', 'safety_measures', 'error', '现场需配备灭火器材', '请确认现场灭火器材已就位（GB30871-2022 5.5）', 1, 4),
('GB30871-2022', 'hot_work', 'gas_detection_required', 'eq', '1', 'requires_gas_detection', 'warning', '动火前建议进行可燃气体检测', '建议动火前进行可燃气体检测（GB30871-2022 5.6）', 1, 5);

-- 高处作业规则
INSERT IGNORE INTO `national_standards` (`code`, `ticket_type`, `rule_key`, `operator`, `rule_value`, `field_path`, `severity`, `description`, `tip_message`, `enabled`, `sort_order`) VALUES
('GB30871-2022', 'high_work', 'height_specified', 'not_empty', NULL, 'work_height', 'error', '必须指定作业高度', '请明确作业高度（GB30871-2022 8.1）', 1, 1),
('GB30871-2022', 'high_work', 'safety_belt_required', 'contain', '安全带', 'safety_measures', 'error', '高处作业必须使用安全带', '高处作业须佩戴安全带（GB30871-2022 8.2）', 1, 2),
('GB30871-2022', 'high_work', 'guardrail_required', 'contain', '护栏', 'safety_measures', 'warning', '建议搭设安全护栏或安全网', '建议搭设护栏/安全网（GB30871-2022 8.3）', 1, 3),
('GB30871-2022', 'high_work', 'weather_check', 'not_empty', NULL, 'weather_condition', 'warning', '需关注天气条件', '高处作业注意风速和天气（GB30871-2022 8.4）', 1, 4);

-- 受限空间规则
INSERT IGNORE INTO `national_standards` (`code`, `ticket_type`, `rule_key`, `operator`, `rule_value`, `field_path`, `severity`, `description`, `tip_message`, `enabled`, `sort_order`) VALUES
('GB30871-2022', 'confined_space', 'gas_detection_mandatory', 'not_empty', NULL, 'gas_detection', 'error', '必须进行气体检测', '受限空间进入前须检测氧气/有毒气体/可燃气体（GB30871-2022 7.1）', 1, 1),
('GB30871-2022', 'confined_space', 'ventilation_required', 'contain', '通风', 'safety_measures', 'error', '必须有机械通风', '受限空间须保持强制通风（GB30871-2022 7.2）', 1, 2),
('GB30871-2022', 'confined_space', 'rescue_plan', 'not_empty', NULL, 'rescue_plan', 'error', '须制定应急救援预案', '受限空间作业须制定应急救援方案（GB30871-2022 7.5）', 1, 3),
('GB30871-2022', 'confined_space', 'guardian_outside', 'contain', '外部监护人', 'safety_measures', 'error', '须有外部监护人', '受限空间作业须配备外部监护人（GB30871-2022 7.3）', 1, 4);

-- 吊装作业规则
INSERT IGNORE INTO `national_standards` (`code`, `ticket_type`, `rule_key`, `operator`, `rule_value`, `field_path`, `severity`, `description`, `tip_message`, `enabled`, `sort_order`) VALUES
('GB30871-2022', 'hoisting', 'load_weight_specified', 'not_empty', NULL, 'load_weight', 'error', '必须明确吊装重量', '吊装作业须明确吊物重量（GB30871-2022 9.1）', 1, 1),
('GB30871-2022', 'hoisting', 'equipment_inspection', 'not_empty', NULL, 'equipment_check', 'warning', '吊装设备需检查合格', '吊装前需确认设备检测合格（GB30871-2022 9.2）', 1, 2),
('GB30871-2022', 'hoisting', 'signal_person', 'not_empty', NULL, 'signal_person', 'error', '需指定指挥信号人员', '吊装作业须有专人指挥（GB30871-2022 9.3）', 1, 3),
('GB30871-2022', 'hoisting', 'warning_zone', 'contain', '警戒区', 'safety_measures', 'error', '吊装区域须设警戒区', '吊装区域须设置警戒隔离（GB30871-2022 9.4）', 1, 4);

-- 通用规则(适用于所有作业类型)
INSERT IGNORE INTO `national_standards` (`code`, `ticket_type`, `rule_key`, `operator`, `rule_value`, `field_path`, `severity`, `description`, `tip_message`, `enabled`, `sort_order`) VALUES
('GB30871-2022', 'hot_work', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'high_work', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'confined_space', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'hoisting', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'earth', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'broken', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'blind', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10),
('GB30871-2022', 'electric', 'safety_measures_not_empty', 'not_empty', NULL, 'safety_measures', 'error', '安全措施不能为空', '请至少填写一项安全措施（GB30871-2022 4.1）', 1, 10);

-- ============================================================
-- 种子数据: 安全积分规则
-- ============================================================
INSERT IGNORE INTO `safety_point_rules` (`rule_code`, `rule_name`, `type`, `points`, `daily_limit`, `description`, `enabled`, `sort_order`) VALUES
('HAZARD_REPORT', '上报安全隐患', 'hazard_report', 5, 20, '每上报一条有效隐患获得5积分', 1, 1),
('HAZARD_VERIFIED', '隐患经核实有效', 'hazard_report', 3, 15, '隐患被核实为有效追加3积分', 1, 2),
('TRAINING_COMPLETE', '完成安全培训', 'training_complete', 10, 30, '每完成一门培训课程并考核通过', 1, 3),
('TRAINING_PERFECT', '培训满分通过', 'training_complete', 5, 15, '考试100分额外奖励', 1, 4),
('WORK_SAFE_DONE', '安全完成作业', 'work_safe', 3, 15, '作业票安全闭环归档', 1, 5),
('APPROVE_TIMELY', '及时审批处理', 'approve_timely', 2, 10, '2小时内完成审批处理', 1, 6),
('CORRECT_DONE', '按时完成整改', 'correct_reward', 5, 15, '隐患整改按时完成', 1, 7),
('PATROL_DONE', '完成巡检任务', 'correct_reward', 2, 10, '完成一次安全巡检', 1, 8),
('EMERGENCY_DRILL', '参加应急演练', 'training_complete', 8, 16, '参与应急演练获得8积分', 1, 9),
('PENALTY_VIOLATION', '违规操作处罚', 'penalty_violation', -20, 0, '发生违规操作或事故处罚', 1, 10),
('PENALTY_EXPIRED', '证书过期未续', 'penalty_violation', -10, 0, '安全证书过期未续期', 1, 11),
('PENALTY_OVERDUE', '隐患整改超期', 'penalty_violation', -5, -20, '隐患整改超期每天扣5分', 1, 12);

COMMIT;
