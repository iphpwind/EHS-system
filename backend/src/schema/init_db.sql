-- 安全生产管理系统数据库 Schema（MySQL 8.0）
-- 字符集：utf8mb4
-- 存储引擎：InnoDB

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 删除已存在的表（按依赖顺序）
DROP TABLE IF EXISTS `ticket_approvals`;
DROP TABLE IF EXISTS `ticket_persons`;
DROP TABLE IF EXISTS `work_tickets`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `departments`;

-- 部门表
CREATE TABLE `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT '部门名称',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '上级部门ID',
  `leader` VARCHAR(50) DEFAULT '' COMMENT '部门负责人',
  `phone` VARCHAR(20) DEFAULT '' COMMENT '联系电话',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 用户表
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `real_name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
  `department` VARCHAR(100) DEFAULT '' COMMENT '部门名称',
  `phone` VARCHAR(20) DEFAULT '' COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT '' COMMENT '邮箱',
  `role_id` INT DEFAULT 5 COMMENT '角色ID，关联roles表',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `last_login_time` TIMESTAMP NULL COMMENT '最后登录时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 作业票主表
CREATE TABLE `work_tickets` (
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
  `status` VARCHAR(20) DEFAULT 'draft' COMMENT '状态',
  `applicant_id` INT UNSIGNED NOT NULL COMMENT '申请人ID',
  `apply_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `start_time` TIMESTAMP NULL COMMENT '计划开始时间',
  `end_time` TIMESTAMP NULL COMMENT '计划结束时间',
  `actual_start_time` TIMESTAMP NULL COMMENT '实际开始时间',
  `actual_end_time` TIMESTAMP NULL COMMENT '实际结束时间',
  `bind_jsa_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '绑定JSA分析ID',
  `flow_config` JSON COMMENT '流程配置（JSON）',
  `current_node` INT DEFAULT 1 COMMENT '当前审批节点',
  `safety_measures` JSON COMMENT '安全措施（JSON）',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  INDEX `idx_ticket_no` (`ticket_no`),
  INDEX `idx_status` (`status`),
  INDEX `idx_applicant` (`applicant_id`),
  INDEX `idx_apply_time` (`apply_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业票主表';

-- 作业人员关联表
CREATE TABLE `ticket_persons` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票ID',
  `person_id` INT UNSIGNED DEFAULT 0 COMMENT '人员ID',
  `person_name` VARCHAR(50) NOT NULL COMMENT '人员姓名',
  `role` VARCHAR(20) NOT NULL COMMENT '角色',
  `cert_name` VARCHAR(100) DEFAULT '' COMMENT '证书名称',
  `cert_no` VARCHAR(50) DEFAULT '' COMMENT '证书编号',
  `cert_expiry_date` DATE NULL COMMENT '证书有效期',
  `is_required_cert` BOOLEAN DEFAULT TRUE COMMENT '是否要求持证',
  `signed_at` TIMESTAMP NULL COMMENT '签字时间',
  `signature` TEXT COMMENT '电子签名',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_ticket_person_role` (`ticket_id`, `person_id`, `role`),
  INDEX `idx_ticket` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业人员关联表';

-- 审批记录表
CREATE TABLE `ticket_approvals` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票ID',
  `node_id` INT NOT NULL COMMENT '节点ID',
  `node_name` VARCHAR(50) NOT NULL COMMENT '节点名称',
  `approver_id` INT UNSIGNED NOT NULL COMMENT '审批人ID',
  `approver_name` VARCHAR(50) NOT NULL COMMENT '审批人姓名',
  `approval_result` VARCHAR(10) NOT NULL COMMENT '审批结果',
  `approval_opinion` TEXT COMMENT '审批意见',
  `approval_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '审批时间',
  `signature_data` JSON COMMENT '签名数据',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ticket` (`ticket_id`),
  INDEX `idx_approver` (`approver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审批记录表';

-- 插入初始数据

-- 默认部门
INSERT INTO `departments` (`name`, `leader`) VALUES
('总经理室', ''),
('安全生产部', ''),
('生产技术部', ''),
('设备工程部', ''),
('运营部', '');

-- 默认管理员账号（密码：admin123）
INSERT INTO `users` (`username`, `password`, `real_name`, `role`) VALUES
('admin', '$2b$10$iq.RX/IVXnyjpxIK8IrVNeS1JP7ZZtnxg1wh28odYeIvmD0WdzYYq', '管理员', 1);

SET FOREIGN_KEY_CHECKS = 1;
