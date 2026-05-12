-- 安全生产管理系统数据库补充 Schema（MySQL 8.0）
-- 字符集：utf8mb4
-- 存储引擎：InnoDB
-- 说明：此文件包含主 schema 中缺失的表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================
-- 系统配置表
-- =====================================
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(50) NOT NULL UNIQUE COMMENT '配置键',
  `value` TEXT COMMENT '配置值',
  `description` VARCHAR(200) DEFAULT '' COMMENT '描述',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 插入默认配置
INSERT INTO `system_settings` (`key`, `value`, `description`) VALUES
('safety_days', '8353', '安全生产天数'),
('site_name', '聚通安全生产平台', '站点名称'),
('site_logo', '', '站点Logo'),
('login_captcha', '1', '登录验证码开关：1开启 0关闭');


-- =====================================
-- 隐患表（替代原 hazards 表）
-- =====================================
DROP TABLE IF EXISTS `hazard_inspection`;
CREATE TABLE `hazard_inspection` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `hazard_level` TINYINT NOT NULL COMMENT '隐患级别：1重大 2较大 3一般',
  `hazard_description` TEXT NOT NULL COMMENT '隐患描述',
  `discovery_time` DATETIME NOT NULL COMMENT '发现时间',
  `discoverer_id` INT UNSIGNED NOT NULL COMMENT '发现人ID',
  `department` VARCHAR(100) DEFAULT '' COMMENT '所属部门',
  `location` VARCHAR(200) DEFAULT '' COMMENT '隐患地点',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1待整改 2整改中 3已完成 4已关闭',
  `rectify_deadline` DATETIME NULL COMMENT '整改截止日期',
  `rectify_measures` TEXT COMMENT '整改措施',
  `rectify_result` TEXT COMMENT '整改结果',
  `rectify_time` DATETIME NULL COMMENT '整改完成时间',
  `rectify_person_id` INT UNSIGNED DEFAULT 0 COMMENT '整改人ID',
  `check_acceptor_id` INT UNSIGNED DEFAULT 0 COMMENT '验收人ID',
  `check_accept_result` TINYINT DEFAULT 0 COMMENT '验收结果：0未验收 1通过 2不通过',
  `check_accept_opinion` TEXT COMMENT '验收意见',
  `check_accept_time` DATETIME NULL COMMENT '验收时间',
  `attachment_urls` JSON COMMENT '附件URL数组',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_level` (`hazard_level`),
  INDEX `idx_status` (`status`),
  INDEX `idx_discoverer` (`discoverer_id`),
  INDEX `idx_discovery_time` (`discovery_time`),
  INDEX `idx_deadline` (`rectify_deadline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='隐患表';


-- =====================================
-- 作业票主表（替代原 work_tickets 表）
-- =====================================
DROP TABLE IF EXISTS `work_permits`;
CREATE TABLE `work_permits` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '作业证编号',
  `ticket_type` VARCHAR(20) NOT NULL COMMENT '作业类型',
  `ticket_level` VARCHAR(10) DEFAULT '' COMMENT '作业级别',
  `project_name` VARCHAR(200) NOT NULL COMMENT '项目名称',
  `work_area_id` INT DEFAULT 0 COMMENT '作业区域ID',
  `work_location` TEXT NOT NULL COMMENT '详细作业地点',
  `work_content` TEXT NOT NULL COMMENT '作业内容',
  `ticket_mode` VARCHAR(10) DEFAULT 'single' COMMENT '办票模式：single/multi',
  `need_upgrade` BOOLEAN DEFAULT FALSE COMMENT '是否涉及作业升级',
  `upgrade_reason` TEXT COMMENT '升级原因',
  `status` VARCHAR(20) DEFAULT 'draft' COMMENT '状态：draft/pending/approved/executing/completed/closed/cancelled/terminated',
  `applicant_id` INT UNSIGNED NOT NULL COMMENT '申请人ID',
  `apply_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `start_time` DATETIME NULL COMMENT '计划开始时间',
  `end_time` DATETIME NULL COMMENT '计划结束时间',
  `actual_start_time` DATETIME NULL COMMENT '实际开始时间',
  `actual_end_time` DATETIME NULL COMMENT '实际结束时间',
  `bind_jsa_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '绑定JSA分析ID',
  `flow_config` JSON COMMENT '流程配置（JSON）',
  `current_node` INT DEFAULT 1 COMMENT '当前审批节点',
  `safety_measures` JSON COMMENT '安全措施（JSON）',
  `deleted_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ticket_no` (`ticket_no`),
  INDEX `idx_ticket_type` (`ticket_type`),
  INDEX `idx_status` (`status`),
  INDEX `idx_applicant` (`applicant_id`),
  INDEX `idx_apply_time` (`apply_time`),
  INDEX `idx_end_time` (`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业票主表';


-- =====================================
-- 高处作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `highwork_tickets`;
CREATE TABLE `highwork_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `work_height` DECIMAL(5,2) DEFAULT 0 COMMENT '作业高度(m)',
  `work_level` VARCHAR(20) DEFAULT '' COMMENT '高处作业级别',
  `weather_condition` VARCHAR(100) DEFAULT '' COMMENT '天气条件',
  `has_ground_protection` BOOLEAN DEFAULT FALSE COMMENT '是否有地面防护',
  `has_safety_net` BOOLEAN DEFAULT FALSE COMMENT '是否设置安全网',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='高处作业票扩展表';


-- =====================================
-- 受限空间作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `restrictedwork_tickets`;
CREATE TABLE `restrictedwork_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `space_name` VARCHAR(200) DEFAULT '' COMMENT '受限空间名称',
  `space_type` VARCHAR(50) DEFAULT '' COMMENT '空间类型',
  `oxygen_content` DECIMAL(5,2) DEFAULT 0 COMMENT '氧气含量(%)',
  `toxic_content` VARCHAR(200) DEFAULT '' COMMENT '有毒有害物质含量',
  `ventilation_method` VARCHAR(200) DEFAULT '' COMMENT '通风方式',
  `power_isolation` BOOLEAN DEFAULT FALSE COMMENT '是否能量隔离',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='受限空间作业票扩展表';


-- =====================================
-- 临时用电作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `electricwork_tickets`;
CREATE TABLE `electricwork_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `voltage_level` VARCHAR(20) DEFAULT '' COMMENT '电压等级',
  `power_capacity` DECIMAL(10,2) DEFAULT 0 COMMENT '用电容量(kW)',
  `wiring_method` VARCHAR(200) DEFAULT '' COMMENT '接线方式',
  `has_ground_protection` BOOLEAN DEFAULT FALSE COMMENT '是否有接地保护',
  `has_leakage_protection` BOOLEAN DEFAULT FALSE COMMENT '是否有漏电保护',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='临时用电作业票扩展表';


-- =====================================
-- 盲板抽堵作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `blind_tickets`;
CREATE TABLE `blind_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `pipeline_name` VARCHAR(200) DEFAULT '' COMMENT '管道名称',
  `pipeline_spec` VARCHAR(100) DEFAULT '' COMMENT '管道规格',
  `medium` VARCHAR(100) DEFAULT '' COMMENT '介质',
  `temperature` DECIMAL(6,2) DEFAULT 0 COMMENT '温度(℃)',
  `pressure` DECIMAL(6,2) DEFAULT 0 COMMENT '压力(MPa)',
  `blind_spec` VARCHAR(100) DEFAULT '' COMMENT '盲板规格',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='盲板抽堵作业票扩展表';


-- =====================================
-- 断路作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `broken_tickets`;
CREATE TABLE `broken_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `road_name` VARCHAR(200) DEFAULT '' COMMENT '道路名称',
  `road_width` DECIMAL(6,2) DEFAULT 0 COMMENT '道路宽度(m)',
  `block_method` VARCHAR(200) DEFAULT '' COMMENT '封堵方式',
  `traffic_guide` VARCHAR(200) DEFAULT '' COMMENT '交通引导措施',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='断路作业票扩展表';


-- =====================================
-- 吊装作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `hoisting_tickets`;
CREATE TABLE `hoisting_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `hoisting_weight` DECIMAL(10,2) DEFAULT 0 COMMENT '吊装重量(t)',
  `hoisting_height` DECIMAL(6,2) DEFAULT 0 COMMENT '吊装高度(m)',
  `hoisting_radius` DECIMAL(6,2) DEFAULT 0 COMMENT '吊装半径(m)',
  `equipment_name` VARCHAR(200) DEFAULT '' COMMENT '吊装设备名称',
  `equipment_model` VARCHAR(100) DEFAULT '' COMMENT '设备型号',
  `has_ground_support` BOOLEAN DEFAULT FALSE COMMENT '是否有地面支撑',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='吊装作业票扩展表';


-- =====================================
-- 动土作业票扩展表
-- =====================================
DROP TABLE IF EXISTS `earth_tickets`;
CREATE TABLE `earth_tickets` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permit_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票主表ID',
  `excavation_depth` DECIMAL(6,2) DEFAULT 0 COMMENT '挖掘深度(m)',
  `excavation_area` DECIMAL(10,2) DEFAULT 0 COMMENT '挖掘面积(㎡)',
  `has_underground_facilities` BOOLEAN DEFAULT FALSE COMMENT '是否有地下设施',
  `facilities_desc` TEXT COMMENT '地下设施描述',
  `support_method` VARCHAR(200) DEFAULT '' COMMENT '支护方式',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_permit` (`permit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动土作业票扩展表';


-- =====================================
-- 预警表
-- =====================================
DROP TABLE IF EXISTS `warnings`;
CREATE TABLE `warnings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '接收用户ID',
  `warning_type` VARCHAR(50) NOT NULL COMMENT '预警类型：ticket_expiring/hazard_overdue/cert_expiring/equipment_overdue',
  `level` VARCHAR(20) DEFAULT 'info' COMMENT '级别：info/warning/danger',
  `title` VARCHAR(200) NOT NULL COMMENT '预警标题',
  `content` TEXT COMMENT '预警内容',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联记录ID',
  `related_type` VARCHAR(50) DEFAULT NULL COMMENT '关联记录类型',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：0未读 1已读',
  `read_time` DATETIME NULL COMMENT '读取时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_type` (`warning_type`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预警通知表';


-- =====================================
-- 证书表
-- =====================================
DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `cert_name` VARCHAR(100) NOT NULL COMMENT '证书名称',
  `cert_no` VARCHAR(50) DEFAULT '' COMMENT '证书编号',
  `issue_date` DATE NULL COMMENT '发证日期',
  `expiry_date` DATE NULL COMMENT '到期日期',
  `issuing_authority` VARCHAR(200) DEFAULT '' COMMENT '发证机关',
  `cert_file_url` VARCHAR(500) DEFAULT '' COMMENT '证书文件URL',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1有效 0无效',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_expiry` (`expiry_date`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户证书表';


-- =====================================
-- 用户登录日志表
-- =====================================
DROP TABLE IF EXISTS `user_logs`;
CREATE TABLE `user_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `login_time` DATETIME NOT NULL COMMENT '登录时间',
  `logout_time` DATETIME NULL COMMENT '退出时间',
  `ip_address` VARCHAR(50) DEFAULT '' COMMENT 'IP地址',
  `user_agent` TEXT COMMENT 'User Agent',
  `login_status` TINYINT DEFAULT 1 COMMENT '登录状态：1成功 0失败',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_login_time` (`login_time`),
  INDEX `idx_ip` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户登录日志表';


-- =====================================
-- 模块配置表
-- =====================================
DROP TABLE IF EXISTS `module_config`;
CREATE TABLE `module_config` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `module_key` VARCHAR(50) NOT NULL UNIQUE COMMENT '模块标识',
  `module_name` VARCHAR(100) NOT NULL COMMENT '模块名称',
  `enabled` TINYINT DEFAULT 1 COMMENT '是否启用：1启用 0禁用',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`module_key`),
  INDEX `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模块配置表';

-- 插入默认模块配置
INSERT INTO `module_config` (`module_key`, `module_name`, `enabled`, `sort_order`) VALUES
('safework', '安全作业', 1, 1),
('training', '培训教育', 1, 2),
('emergency', '应急管理', 1, 3),
('contractor', '承包商管理', 1, 4),
('certificate', '证书管理', 1, 5),
('visitor', '访客管理', 1, 6),
('law', '法律法规', 1, 7),
('chemical', '危化品管理', 1, 8),
('system', '系统管理', 1, 9),
('equipment', '设备管理', 1, 10),
('sensor', '传感器管理', 1, 11),
('hazard', '隐患管理', 1, 12),
('monitor', '系统监控', 1, 13);


SET FOREIGN_KEY_CHECKS = 1;
