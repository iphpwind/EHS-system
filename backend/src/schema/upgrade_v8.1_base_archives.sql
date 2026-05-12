-- ============================================================
-- 安全生产管理系统 v8.1 升级脚本 - 基础档案扩展
-- ============================================================

USE `safety_system`;

-- ============================================================
-- 1. 化学品档案表
-- ============================================================
CREATE TABLE IF NOT EXISTS `chemical_archives` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `chemical_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '化学品编号',
    `name` VARCHAR(200) NOT NULL COMMENT '化学品名称',
    `alias` VARCHAR(200) COMMENT '别名',
    `cas_no` VARCHAR(50) COMMENT 'CAS号',
    `formula` VARCHAR(200) COMMENT '分子式',
    `danger_type` VARCHAR(100) COMMENT '危险类别(易燃/易爆/有毒/腐蚀等)',
    `danger_level` VARCHAR(20) COMMENT '危险等级',
    `ghs_symbols` JSON COMMENT 'GHS标识',
    `physical_state` VARCHAR(50) COMMENT '物理状态(固体/液体/气体)',
    `flash_point` VARCHAR(50) COMMENT '闪点',
    `melting_point` VARCHAR(50) COMMENT '熔点',
    `boiling_point` VARCHAR(50) COMMENT '沸点',
    `density` VARCHAR(50) COMMENT '密度',
    `explosion_limit` VARCHAR(50) COMMENT '爆炸极限',
    `toxicity` TEXT COMMENT '毒性说明',
    `hazard_statement` TEXT COMMENT '危险性说明',
    `precautionary_statement` TEXT COMMENT '防范说明',
    `storage_condition` TEXT COMMENT '储存条件',
    `emergency_measure` TEXT COMMENT '应急处置措施',
    `department` VARCHAR(100) COMMENT '使用部门',
    `responsible_person` VARCHAR(100) COMMENT '负责人',
    `quantity` DECIMAL(10,2) DEFAULT 0 COMMENT '数量(kg/L)',
    `max_storage` DECIMAL(10,2) COMMENT '最大储存量',
    `manufacturer` VARCHAR(200) COMMENT '生产厂家',
    `supplier` VARCHAR(200) COMMENT '供应商',
    `valid_until` DATE COMMENT '有效期',
    `msds_url` VARCHAR(500) COMMENT 'MSDS文件URL',
    `status` TINYINT DEFAULT 1 COMMENT '1=在库, 2=已用完, 3=已过期',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_chemical_no` (`chemical_no`),
    INDEX `idx_cas` (`cas_no`),
    INDEX `idx_danger_type` (`danger_type`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='化学品档案表';

-- ============================================================
-- 2. 区域档案表
-- ============================================================
CREATE TABLE IF NOT EXISTS `area_archives` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `area_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '区域编号',
    `name` VARCHAR(200) NOT NULL COMMENT '区域名称',
    `area_type` VARCHAR(50) COMMENT '区域类型(生产区/储存区/办公区/辅助区)',
    `parent_id` INT DEFAULT 0 COMMENT '上级区域',
    `location` VARCHAR(200) COMMENT '位置描述',
    `area_size` DECIMAL(10,2) COMMENT '面积(㎡)',
    `floor` VARCHAR(50) COMMENT '楼层',
    `fire_level` VARCHAR(50) COMMENT '防火等级',
    `explosion_hazard` VARCHAR(50) COMMENT '爆炸危险区域划分',
    `equipment_count` INT DEFAULT 0 COMMENT '设备数量',
    `personnel_count` INT DEFAULT 0 COMMENT '定员人数',
    `responsible_department` VARCHAR(100) COMMENT '责任部门',
    `responsible_person` VARCHAR(100) COMMENT '责任人',
    `contact_phone` VARCHAR(20) COMMENT '联系电话',
    `safety_level` VARCHAR(20) COMMENT '安全等级',
    `has_fire_fighting` TINYINT DEFAULT 0 COMMENT '是否配备消防设施',
    `has_monitoring` TINYINT DEFAULT 0 COMMENT '是否安装监控',
    `status` TINYINT DEFAULT 1 COMMENT '1=正常, 2=停用, 3=改造中',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_area_no` (`area_no`),
    INDEX `idx_type` (`area_type`),
    INDEX `idx_parent` (`parent_id`),
    INDEX `idx_safety_level` (`safety_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='区域档案表';

-- ============================================================
-- 3. 三同时档案表 (建设项目安全设施"三同时")
-- ============================================================
CREATE TABLE IF NOT EXISTS `three_simultaneous_archives` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `project_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '项目编号',
    `project_name` VARCHAR(200) NOT NULL COMMENT '项目名称',
    `project_type` VARCHAR(50) COMMENT '项目类型(新建/改建/扩建)',
    `investment_amount` DECIMAL(15,2) COMMENT '投资金额(万元)',
    `safety_investment` DECIMAL(15,2) COMMENT '安全投资金额(万元)',
    `project_leader` VARCHAR(100) COMMENT '项目负责人',
    `construction_unit` VARCHAR(200) COMMENT '建设单位',
    `design_unit` VARCHAR(200) COMMENT '设计单位',
    `supervision_unit` VARCHAR(200) COMMENT '监理单位',
    `start_date` DATE COMMENT '开工日期',
    `completion_date` DATE COMMENT '竣工日期',
    -- 三同时各阶段
    `feasibility_review_status` VARCHAR(20) DEFAULT 'pending' COMMENT '可行性研究审查(pending/passed/rejected)',
    `feasibility_review_date` DATE COMMENT '可行性审查日期',
    `feasibility_review_file` VARCHAR(500) COMMENT '可行性审查文件',
    `preliminary_design_status` VARCHAR(20) DEFAULT 'pending' COMMENT '初步设计审查(pending/passed/rejected)',
    `preliminary_design_date` DATE COMMENT '初步设计审查日期',
    `preliminary_design_file` VARCHAR(500) COMMENT '初步设计文件',
    `completion_acceptance_status` VARCHAR(20) DEFAULT 'pending' COMMENT '竣工验收(pending/passed/rejected)',
    `completion_acceptance_date` DATE COMMENT '竣工验收日期',
    `completion_acceptance_file` VARCHAR(500) COMMENT '竣工验收文件',
    `overall_status` VARCHAR(20) DEFAULT 'ongoing' COMMENT '总体状态(ongoing/completed/terminated)',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_project_no` (`project_no`),
    INDEX `idx_overall_status` (`overall_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='三同时档案表(建设项目安全设施)';

-- ============================================================
-- 4. 相关方档案表 (承包商/供应商/访客等)
-- ============================================================
CREATE TABLE IF NOT EXISTS `related_party_archives` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `party_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '编号',
    `name` VARCHAR(200) NOT NULL COMMENT '名称(单位/个人)',
    `party_type` VARCHAR(50) NOT NULL COMMENT '类型(承包商/供应商/服务商/访客/实习人员)',
    `party_level` VARCHAR(20) COMMENT '等级(A/B/C)',
    `legal_person` VARCHAR(100) COMMENT '法人代表',
    `contact_person` VARCHAR(100) COMMENT '联系人',
    `contact_phone` VARCHAR(20) COMMENT '联系电话',
    `email` VARCHAR(100) COMMENT '邮箱',
    `address` TEXT COMMENT '地址',
    `business_scope` TEXT COMMENT '经营范围',
    `qualification_cert` VARCHAR(500) COMMENT '资质证书URL',
    `qualification_valid_until` DATE COMMENT '资质有效期',
    `contract_no` VARCHAR(50) COMMENT '合同编号',
    `contract_start` DATE COMMENT '合同开始日期',
    `contract_end` DATE COMMENT '合同结束日期',
    `safety_agreement_signed` TINYINT DEFAULT 0 COMMENT '是否签订安全协议',
    `safety_training_done` TINYINT DEFAULT 0 COMMENT '是否完成安全培训',
    `insurance_doc` VARCHAR(500) COMMENT '保险文件URL',
    `has_accident_history` TINYINT DEFAULT 0 COMMENT '是否有事故记录',
    `evaluation_score` DECIMAL(5,2) COMMENT '安全评估分数',
    `evaluation_level` VARCHAR(20) COMMENT '评估等级',
    `status` TINYINT DEFAULT 1 COMMENT '1=合作中, 2=暂停合作, 3=已终止',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_party_no` (`party_no`),
    INDEX `idx_type` (`party_type`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='相关方档案表';

-- ============================================================
-- 5. 生产静态档案表
-- ============================================================
CREATE TABLE IF NOT EXISTS `production_static_archives` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `archive_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '档案编号',
    `name` VARCHAR(200) NOT NULL COMMENT '档案名称',
    `archive_type` VARCHAR(50) COMMENT '类型(工艺/设备/管线/仪表/电气/土建)',
    `code` VARCHAR(100) COMMENT '编码',
    `specification` TEXT COMMENT '规格参数',
    `material` VARCHAR(200) COMMENT '材质',
    `manufacturer` VARCHAR(200) COMMENT '制造单位',
    `install_date` DATE COMMENT '安装日期',
    `commission_date` DATE COMMENT '投用日期',
    `design_life` INT COMMENT '设计寿命(年)',
    `location` VARCHAR(200) COMMENT '所在位置(区域)',
    `department` VARCHAR(100) COMMENT '所属部门',
    `responsible_person` VARCHAR(100) COMMENT '负责人',
    `technical_doc_url` VARCHAR(500) COMMENT '技术文件URL',
    `drawing_url` VARCHAR(500) COMMENT '图纸URL',
    `maintenance_cycle` INT COMMENT '维护周期(天)',
    `last_maintenance_date` DATE COMMENT '最近维护日期',
    `next_maintenance_date` DATE COMMENT '下次维护日期',
    `status` TINYINT DEFAULT 1 COMMENT '1=正常运行, 2=停运, 3=检修, 4=报废',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_archive_no` (`archive_no`),
    INDEX `idx_type` (`archive_type`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='生产静态档案表';

-- ============================================================
-- 6. 安全生产档案表
-- ============================================================
CREATE TABLE IF NOT EXISTS `safety_production_archives` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `doc_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '文档编号',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `archive_type` VARCHAR(50) NOT NULL COMMENT '类型(制度/规程/预案/报告/证照/记录)',
    `archive_category` VARCHAR(100) COMMENT '分类',
    `issuing_department` VARCHAR(100) COMMENT '发布部门',
    `effective_date` DATE COMMENT '生效日期',
    `expiry_date` DATE COMMENT '失效日期',
    `signing_authority` VARCHAR(100) COMMENT '签发人',
    `doc_level` VARCHAR(20) COMMENT '文档级别(公司级/部门级/班组级)',
    `file_url` VARCHAR(500) COMMENT '文件URL',
    `keywords` TEXT COMMENT '关键词',
    `content_summary` TEXT COMMENT '内容摘要',
    `is_public` TINYINT DEFAULT 1 COMMENT '是否公开',
    `view_count` INT DEFAULT 0 COMMENT '浏览次数',
    `status` TINYINT DEFAULT 1 COMMENT '1=有效, 2=废止, 3=修订中',
    `created_by` INT COMMENT '创建人',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_doc_no` (`doc_no`),
    INDEX `idx_type` (`archive_type`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='安全生产档案表';

-- ============================================================
-- 7. 到期提醒设置表
-- ============================================================
CREATE TABLE IF NOT EXISTS `expiry_reminder_settings` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `reminder_type` VARCHAR(50) NOT NULL COMMENT '提醒类型(证书/设备检验/保险/资质/合同/其他)',
    `target_module` VARCHAR(50) COMMENT '目标模块',
    `target_table` VARCHAR(50) COMMENT '目标数据表',
    `target_field` VARCHAR(50) COMMENT '到期日期字段',
    `reminder_name` VARCHAR(200) NOT NULL COMMENT '提醒名称',
    `advance_days` INT DEFAULT 30 COMMENT '提前提醒天数',
    `reminder_interval` INT DEFAULT 7 COMMENT '提醒间隔(天)',
    `remind_method` VARCHAR(100) DEFAULT 'system' COMMENT '提醒方式(system/email/sms)',
    `remind_roles` JSON COMMENT '提醒角色',
    `remind_users` JSON COMMENT '提醒用户(可选特定用户)',
    `is_enabled` TINYINT DEFAULT 1 COMMENT '是否启用',
    `description` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_type` (`reminder_type`),
    INDEX `idx_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='到期提醒设置表';

-- 插入默认到期提醒设置
INSERT INTO `expiry_reminder_settings` (`reminder_type`, `target_module`, `target_table`, `target_field`, `reminder_name`, `advance_days`, `reminder_interval`, `is_enabled`, `description`) VALUES
('equipment', 'equipment', 'equipment', 'next_maintenance', '设备定期维护提醒', 30, 7, 1, '设备台账中的下次维护日期到期提醒'),
('certificate', 'training_records', 'training_records', 'certificate_valid_until', '培训证书到期提醒', 30, 7, 1, '培训证书有效期到期提醒'),
('contract', 'related_party', 'related_party_archives', 'contract_end', '相关方合同到期提醒', 30, 7, 1, '相关方合同到期提醒'),
('qualification', 'related_party', 'related_party_archives', 'qualification_valid_until', '相关方资质到期提醒', 30, 7, 1, '相关方资质证书到期提醒'),
('chemical_validity', 'chemical', 'chemical_archives', 'valid_until', '化学品有效期提醒', 30, 7, 1, '化学品有效期到期提醒');

SELECT '基础档案扩展表创建完成！' AS message;
