-- 安全生产管理系统数据库初始化脚本 (MySQL 8.0+)
-- 创建时间: 2026-04-29
-- 字符集: utf8mb4
-- 存储引擎: InnoDB

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `safety_system` 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `safety_system`;

-- 设置SQL模式
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ============================================================
-- 1. 用户与权限模块
-- ============================================================

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `real_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100),
    `phone` VARCHAR(20),
    `department` VARCHAR(100),
    `position` VARCHAR(100),
    `role_id` INT DEFAULT 5,
    `status` TINYINT DEFAULT 1 COMMENT '1=启用, 0=禁用',
    `last_login` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_username` (`username`),
    INDEX `idx_department` (`department`),
    INDEX `idx_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS `roles` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255),
    `permissions` JSON,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 权限表
CREATE TABLE IF NOT EXISTS `permissions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `code` VARCHAR(100) NOT NULL UNIQUE,
    `module` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- ============================================================
-- 2. 基础档案模块
-- ============================================================

-- 企业信息表
CREATE TABLE IF NOT EXISTS `enterprise_info` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `code` VARCHAR(50) COMMENT '统一社会信用代码',
    `address` TEXT,
    `legal_person` VARCHAR(100),
    `contact_phone` VARCHAR(20),
    `email` VARCHAR(100),
    `website` VARCHAR(200),
    `established_date` DATE,
    `business_scope` TEXT,
    `logo_url` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业信息表';

-- 部门表
CREATE TABLE IF NOT EXISTS `departments` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(50),
    `parent_id` INT DEFAULT 0,
    `manager` VARCHAR(100),
    `contact` VARCHAR(20),
    `description` TEXT,
    `sort_order` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 设备台账表
CREATE TABLE IF NOT EXISTS `equipment` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `equipment_no` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(200) NOT NULL,
    `type` VARCHAR(100),
    `model` VARCHAR(100),
    `manufacturer` VARCHAR(200),
    `install_date` DATE,
    `location` VARCHAR(200),
    `department` VARCHAR(100),
    `responsible_person` VARCHAR(100),
    `status` TINYINT DEFAULT 1 COMMENT '1=正常, 2=维修中, 3=停用',
    `maintenance_cycle` INT COMMENT '维护周期(天)',
    `next_maintenance` DATE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_equipment_no` (`equipment_no`),
    INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备台账表';

-- ============================================================
-- 3. 作业管理模块（核心）
-- ============================================================

-- 作业票表
CREATE TABLE IF NOT EXISTS `work_permits` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `ticket_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '作业票编号',
    `ticket_type` VARCHAR(50) NOT NULL COMMENT '作业类型',
    `ticket_level` VARCHAR(20) COMMENT '作业级别',
    `project_name` VARCHAR(200) NOT NULL,
    `work_area_id` INT,
    `work_location` VARCHAR(200),
    `work_content` TEXT,
    `status` VARCHAR(20) DEFAULT 'draft' COMMENT 'draft/pending/approved/executing/completed/closed',
    `applicant_id` INT NOT NULL,
    `apply_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `start_time` DATETIME,
    `end_time` DATETIME,
    `bind_jsa_id` INT COMMENT '关联的JSA分析ID',
    `safety_measures` JSON COMMENT '安全措施',
    `flow_config` JSON COMMENT '流程配置',
    `current_node` INT DEFAULT 0,
    `gas_detection` JSON COMMENT '气体检测数据',
    `hazard_identification` JSON COMMENT '危害辨识',
    `applicant_signature` TEXT COMMENT '申请人签字(base64)',
    `guardian_signature` TEXT COMMENT '监护人签字(base64)',
    `approver_signature` TEXT COMMENT '审批人签字(base64)',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ticket_no` (`ticket_no`),
    INDEX `idx_applicant` (`applicant_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_type` (`ticket_type`),
    FOREIGN KEY (`applicant_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业票表';

-- 作业票类型配置表
CREATE TABLE IF NOT EXISTS `work_type_configs` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `type_code` VARCHAR(50) NOT NULL UNIQUE,
    `type_name` VARCHAR(100) NOT NULL,
    `is_dangerous` TINYINT DEFAULT 0 COMMENT '是否危险作业',
    `requires_jsa` TINYINT DEFAULT 0 COMMENT '是否需要JSA分析',
    `requires_gas_detection` TINYINT DEFAULT 0,
    `requires_permit` TINYINT DEFAULT 1 COMMENT '是否需要作业票',
    `validity_days` INT DEFAULT 1 COMMENT '票证有效期(天)',
    `approval_flow` JSON COMMENT '审批流程配置',
    `safety_measures_template` JSON COMMENT '安全措施模板',
    `sort_order` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业票类型配置表';

-- JSA分析表
CREATE TABLE IF NOT EXISTS `jsa_analysis` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `jsa_no` VARCHAR(50) NOT NULL UNIQUE,
    `project_name` VARCHAR(200) NOT NULL,
    `work_type` VARCHAR(50),
    `work_location` VARCHAR(200),
    `hazards` JSON COMMENT '危害因素',
    `control_measures` JSON COMMENT '控制措施',
    `risk_level` VARCHAR(20),
    `analyst_id` INT,
    `analysis_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` TINYINT DEFAULT 1 COMMENT '1=草稿, 2=已发布, 3=已归档',
    `related_permit_id` INT COMMENT '关联的作业票ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_jsa_no` (`jsa_no`),
    INDEX `idx_analyst` (`analyst_id`),
    FOREIGN KEY (`analyst_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='JSA分析表';

-- 作业预约表
CREATE TABLE IF NOT EXISTS `permit_reservations` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `reservation_no` VARCHAR(50) NOT NULL UNIQUE,
    `ticket_type` VARCHAR(50) NOT NULL,
    `project_name` VARCHAR(200),
    `expected_start` DATETIME,
    `expected_end` DATETIME,
    `work_location` VARCHAR(200),
    `applicant_id` INT,
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/approved/rejected/converted',
    `approval_comment` TEXT,
    `convert_to_permit` TINYINT DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_reservation_no` (`reservation_no`),
    INDEX `idx_applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业预约表';

-- 气体检测记录表
CREATE TABLE IF NOT EXISTS `permit_gas_detection` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `permit_id` INT,
    `detection_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `detected_by` INT,
    `o2` DECIMAL(5,2) COMMENT '氧气(%)',
    `lel` DECIMAL(5,2) COMMENT '可燃气体(%LEL)',
    `h2s` DECIMAL(8,4) COMMENT '硫化氢(ppm)',
    `co` DECIMAL(8,4) COMMENT '一氧化碳(ppm)',
    `other_gas` VARCHAR(100),
    `other_value` DECIMAL(8,4),
    `is_safe` TINYINT DEFAULT 1,
    `remarks` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_permit` (`permit_id`),
    FOREIGN KEY (`permit_id`) REFERENCES `work_permits`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='气体检测记录表';

-- 作业过程记录表
CREATE TABLE IF NOT EXISTS `permit_process_log` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `permit_id` INT,
    `log_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `log_type` VARCHAR(50) COMMENT 'start/pause/resume/complete/inspection',
    `operator_id` INT,
    `description` TEXT,
    `photos` JSON COMMENT '现场照片',
    `location` VARCHAR(200),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_permit` (`permit_id`),
    FOREIGN KEY (`permit_id`) REFERENCES `work_permits`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作业过程记录表';

-- ============================================================
-- 4. 双重预防机制
-- ============================================================

-- 风险分级管控表
CREATE TABLE IF NOT EXISTS `risk_control` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `risk_no` VARCHAR(50) NOT NULL UNIQUE,
    `risk_source` VARCHAR(200) NOT NULL COMMENT '危险源',
    `risk_type` VARCHAR(50) COMMENT '风险类型',
    `location` VARCHAR(200),
    `department` VARCHAR(100),
    `possibility` INT COMMENT '可能性(L)',
    `severity` INT COMMENT '严重性(S)',
    `risk_level` VARCHAR(20) COMMENT '风险等级',
    `control_measures` TEXT,
    `responsible_person` VARCHAR(100),
    `status` TINYINT DEFAULT 1 COMMENT '1=受控, 2=待改进, 3=失控',
    `assessment_date` DATE,
    `next_assessment` DATE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_risk_no` (`risk_no`),
    INDEX `idx_level` (`risk_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='风险分级管控表';

-- 隐患排查治理表
CREATE TABLE IF NOT EXISTS `hazard_inspection` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `inspection_no` VARCHAR(50) NOT NULL UNIQUE,
    `hazard_description` TEXT NOT NULL,
    `hazard_level` VARCHAR(20) COMMENT '重大/较大/一般/低',
    `location` VARCHAR(200),
    `department` VARCHAR(100),
    `discoverer_id` INT,
    `discovery_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` INT DEFAULT 1 COMMENT '1=待整改, 2=整改中, 3=待验收, 4=已闭环',
    `rectification_measure` TEXT,
    `rectification_deadline` DATE,
    `rectification_responsible` VARCHAR(100),
    `rectification_time` DATETIME,
    `verification_result` TINYINT COMMENT '1=合格, 2=不合格',
    `verifier_id` INT,
    `verification_time` DATETIME,
    `photos_before` JSON,
    `photos_after` JSON,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_inspection_no` (`inspection_no`),
    INDEX `idx_status` (`status`),
    INDEX `idx_level` (`hazard_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='隐患排查治理表';

-- ============================================================
-- 5. 教育培训模块
-- ============================================================

-- 培训计划表
CREATE TABLE IF NOT EXISTS `training_plans` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `plan_no` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(200) NOT NULL,
    `type` VARCHAR(50) COMMENT '入职/年度/专项/外来人员',
    `target_department` VARCHAR(100),
    `target_users` JSON,
    `start_date` DATE,
    `end_date` DATE,
    `hours` DECIMAL(5,2),
    `instructor` VARCHAR(100),
    `location` VARCHAR(200),
    `status` TINYINT DEFAULT 1 COMMENT '1=计划中, 2=进行中, 3=已完成, 4=已取消',
    `description` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_plan_no` (`plan_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培训计划表';

-- 培训记录表
CREATE TABLE IF NOT EXISTS `training_records` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `plan_id` INT,
    `user_id` INT,
    `attendance` TINYINT DEFAULT 1 COMMENT '是否出勤',
    `exam_score` DECIMAL(5,2),
    `is_passed` TINYINT DEFAULT 0,
    `certificate_no` VARCHAR(50),
    `certificate_valid_until` DATE,
    `remarks` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_plan_user` (`plan_id`, `user_id`),
    INDEX `idx_user` (`user_id`),
    FOREIGN KEY (`plan_id`) REFERENCES `training_plans`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培训记录表';

-- ============================================================
-- 6. 应急管理系统
-- ============================================================

-- 应急预案表
CREATE TABLE IF NOT EXISTS `emergency_plans` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `plan_no` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(200) NOT NULL,
    `type` VARCHAR(50) COMMENT '综合/专项/现场处置',
    `level` VARCHAR(20) COMMENT '公司级/部门级/班组级',
    `applicable_scenario` TEXT,
    `response_procedure` TEXT,
    `responsible_department` VARCHAR(100),
    `emergency_resources` JSON,
    `contact_list` JSON,
    `status` TINYINT DEFAULT 1,
    `effective_date` DATE,
    `expiry_date` DATE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_plan_no` (`plan_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应急预案表';

-- 应急演练表
CREATE TABLE IF NOT EXISTS `emergency_drills` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `drill_no` VARCHAR(50) NOT NULL UNIQUE,
    `plan_id` INT,
    `drill_name` VARCHAR(200),
    `drill_type` VARCHAR(50) COMMENT '桌面/实战/专项',
    `drill_date` DATE,
    `location` VARCHAR(200),
    `participants` JSON,
    `scenario_description` TEXT,
    `drill_result` TEXT,
    `problems_found` TEXT,
    `improvement_measures` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_drill_no` (`drill_no`),
    FOREIGN KEY (`plan_id`) REFERENCES `emergency_plans`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应急演练表';

-- ============================================================
-- 7. 电子巡检模块
-- ============================================================

-- 巡检计划表
CREATE TABLE IF NOT EXISTS `inspection_plans` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `plan_no` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(200) NOT NULL,
    `type` VARCHAR(50) COMMENT '日常/专项/季节性',
    `frequency` VARCHAR(50) COMMENT '每天/每周/每月/每季度',
    `route` JSON COMMENT '巡检路线',
    `checkpoints` JSON COMMENT '巡检点',
    `responsible_department` VARCHAR(100),
    `status` TINYINT DEFAULT 1,
    `start_date` DATE,
    `end_date` DATE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_plan_no` (`plan_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='巡检计划表';

-- 巡检任务表
CREATE TABLE IF NOT EXISTS `inspection_tasks` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `task_no` VARCHAR(50) NOT NULL UNIQUE,
    `plan_id` INT,
    `assignee_id` INT,
    `scheduled_date` DATE,
    `actual_start_time` DATETIME,
    `actual_end_time` DATETIME,
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/ongoing/completed/expired',
    `completion_rate` DECIMAL(5,2),
    `remarks` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_task_no` (`task_no`),
    INDEX `idx_assignee` (`assignee_id`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`plan_id`) REFERENCES `inspection_plans`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='巡检任务表';

-- ============================================================
-- 8. 系统管理模块
-- ============================================================

-- 操作日志表
CREATE TABLE IF NOT EXISTS `system_logs` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `username` VARCHAR(50),
    `action` VARCHAR(100),
    `module` VARCHAR(50),
    `description` TEXT,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user` (`user_id`),
    INDEX `idx_created` (`created_at`),
    INDEX `idx_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS `system_settings` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL UNIQUE,
    `value` TEXT,
    `type` VARCHAR(20) DEFAULT 'string' COMMENT 'string/number/boolean/json',
    `description` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- ============================================================
-- 初始化数据
-- ============================================================

-- 插入默认角色
INSERT INTO `roles` (`name`, `code`, `description`, `permissions`) VALUES
('超级管理员', 'super_admin', '系统超级管理员，拥有所有权限', JSON_ARRAY('*')),
('系统管理员', 'admin', '系统管理员，拥有大部分权限', JSON_ARRAY('system:*', 'user:*', 'log:*')),
('安全管理人员', 'safety_manager', '安全管理员', JSON_ARRAY('work:*', 'risk:*', 'inspection:*', 'emergency:*')),
('部门负责人', 'dept_manager', '部门负责人', JSON_ARRAY('work:approve', 'training:*', 'risk:view')),
('普通用户', 'user', '普通用户', JSON_ARRAY('work:apply', 'training:view', 'risk:report'));

-- 插入默认管理员账号 (密码: admin123)
INSERT INTO `users` (`username`, `password`, `real_name`, `email`, `role_id`) VALUES
('admin', '$2b$10$YourHashedPasswordHere', '系统管理员', 'admin@example.com', 1);

-- 插入作业票类型配置 (GB30871-2022标准)
INSERT INTO `work_type_configs` (`type_code`, `type_name`, `is_dangerous`, `requires_jsa`, `requires_gas_detection`, `validity_days`, `approval_flow`, `sort_order`) VALUES
('hot_work', '动火作业', 1, 1, 1, 1, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety', 'approval')), 1),
('limited_space', '受限空间作业', 1, 1, 1, 1, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety', 'approval')), 2),
('high_work', '高处作业', 1, 1, 0, 3, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety')), 3),
('hoisting_work', '吊装作业', 1, 1, 0, 1, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety')), 4),
('temporary_electricity', '临时用电作业', 1, 0, 0, 15, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'electrician', 'safety')), 5),
('blind_work', '盲板抽堵作业', 1, 0, 0, 3, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety')), 6),
('excavation_work', '动土作业', 1, 0, 0, 7, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety')), 7),
('road_work', '断路作业', 1, 0, 0, 7, JSON_OBJECT('nodes', JSON_ARRAY('applicant', 'department_head', 'safety')), 8);

-- 插入系统配置
INSERT INTO `system_settings` (`key`, `value`, `type`, `description`) VALUES
('site_name', '工业互联网安全生产管理平台', 'string', '系统名称'),
('logo_url', '/logo.png', 'string', '系统Logo'),
('enable_mysql_cache', '1', 'boolean', '是否启用MySQL查询缓存'),
('session_timeout', '7200', 'number', '会话超时时间(秒)'),
('password_policy', JSON_OBJECT('min_length', 8, 'require_number', 1, 'require_special_char', 1), 'json', '密码策略');

-- 创建视图：用户权限视图
CREATE OR REPLACE VIEW `v_user_permissions` AS
SELECT 
    u.id AS user_id,
    u.username,
    u.real_name,
    r.code AS role_code,
    r.permissions
FROM `users` u
LEFT JOIN `roles` r ON u.role_id = r.id;

-- 创建视图：作业票统计视图
CREATE OR REPLACE VIEW `v_work_permit_stats` AS
SELECT 
    DATE(created_at) AS date,
    ticket_type,
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
FROM `work_permits`
GROUP BY DATE(created_at), ticket_type;

COMMIT;

-- 完成提示
SELECT '数据库初始化完成！' AS message;
