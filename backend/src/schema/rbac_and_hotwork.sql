-- ============================================================
-- RBAC 权限系统 + GB30871 动火作业闭环 数据库迁移
-- 安全生产管理系统 - 企业级核心扩展
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 一、RBAC 权限系统
-- ============================================================

-- 角色表（扩展现有 roles）
DROP TABLE IF EXISTS `roles_v2`;
CREATE TABLE `roles_v2` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码（如：dept_manager, safety_officer）',
  `data_scope` TINYINT DEFAULT 1 COMMENT '数据范围：1全部 2本部门 3本人 4自定义',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `remark` VARCHAR(200) DEFAULT '' COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表V2';

-- 菜单权限表
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `title` VARCHAR(50) NOT NULL COMMENT '显示标题',
  `path` VARCHAR(200) DEFAULT '' COMMENT '路由路径',
  `component` VARCHAR(200) DEFAULT '' COMMENT '组件路径',
  `permission` VARCHAR(100) DEFAULT '' COMMENT '按钮权限标识（如：safework:firework:add）',
  `icon` VARCHAR(50) DEFAULT '' COMMENT '图标',
  `parent_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '父菜单ID',
  `menu_type` CHAR(1) DEFAULT 'M' COMMENT '菜单类型：M目录 C菜单 F按钮',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_parent` (`parent_id`),
  INDEX `idx_type` (`menu_type`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';

-- 用户角色关联表
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色菜单关联表
DROP TABLE IF EXISTS `role_menus`;
CREATE TABLE `role_menus` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `menu_id` BIGINT UNSIGNED NOT NULL COMMENT '菜单ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`),
  INDEX `idx_role` (`role_id`),
  INDEX `idx_menu` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- 用户部门扩展（现有 users 表已有 department_id，这里只做说明）
-- ALTER TABLE `users` ADD COLUMN `dept_id` INT UNSIGNED DEFAULT 0 COMMENT '部门ID' AFTER `real_name`;

-- ============================================================
-- 二、GB30871 动火作业闭环扩展表
-- ============================================================

-- 动火作业扩展表（关联 work_permits）
DROP TABLE IF EXISTS `hot_work_details`;
CREATE TABLE `hot_work_details` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票ID（关联 work_permits.id）',
  `fire_level` TINYINT DEFAULT 1 COMMENT '动火等级：1特级 2一级 3二级',
  `fire_area` VARCHAR(200) DEFAULT '' COMMENT '动火区域',
  `fire_type` VARCHAR(50) DEFAULT '' COMMENT '动火方式',
  `risk_analysis` TEXT COMMENT '风险分析内容',
  `risk_analysis_sign` TEXT COMMENT '风险分析签字（base64）',
  `risk_analysis_user_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '风险分析人ID',
  `risk_analysis_time` TIMESTAMP NULL COMMENT '风险分析时间',
  `safety_disclosure_sign` TEXT COMMENT '安全交底签字（base64）',
  `safety_disclosure_user_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '安全交底人ID',
  `safety_disclosure_time` TIMESTAMP NULL COMMENT '安全交底时间',
  `fire_worker_sign` TEXT COMMENT '动火人签字（base64）',
  `fire_worker_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '动火人ID',
  `guardian_sign` TEXT COMMENT '监护人签字（base64）',
  `guardian_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '监护人ID',
  `responsible_sign` TEXT COMMENT '作业负责人签字（base64）',
  `responsible_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '作业负责人ID',
  `acceptance_sign` TEXT COMMENT '验收签字（base64）',
  `acceptance_user_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '验收人ID',
  `acceptance_time` TIMESTAMP NULL COMMENT '验收时间',
  `status_flow` JSON COMMENT '状态流转记录',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_ticket` (`ticket_id`),
  INDEX `idx_fire_level` (`fire_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动火作业扩展表';

-- 气体检测记录表（GB30871 要求）
DROP TABLE IF EXISTS `gas_checks`;
CREATE TABLE `gas_checks` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` BIGINT UNSIGNED NOT NULL COMMENT '作业票ID',
  `check_type` VARCHAR(20) DEFAULT 'before' COMMENT '检测时机：before作业前 during作业中 after作业后',
  `oxygen_percent` DECIMAL(5,2) DEFAULT 0 COMMENT '氧气浓度%',
  `flammable_percent` DECIMAL(8,4) DEFAULT 0 COMMENT '可燃气体%LEL',
  `toxic_ppm` DECIMAL(10,2) DEFAULT 0 COMMENT '有毒气体ppm',
  `toxic_type` VARCHAR(50) DEFAULT '' COMMENT '有毒气体种类',
  `check_result` TINYINT DEFAULT 1 COMMENT '检测结果：1合格 0不合格',
  `check_location` VARCHAR(200) DEFAULT '' COMMENT '检测地点',
  `check_time` TIMESTAMP NULL COMMENT '检测时间',
  `checker_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '检测人ID',
  `checker_name` VARCHAR(50) DEFAULT '' COMMENT '检测人姓名',
  `checker_sign` TEXT COMMENT '检测人签字（base64）',
  `device_photo` VARCHAR(500) DEFAULT '' COMMENT '检测仪照片URL',
  `scene_photo` VARCHAR(500) DEFAULT '' COMMENT '现场照片URL',
  `remark` VARCHAR(500) DEFAULT '' COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ticket` (`ticket_id`),
  INDEX `idx_check_type` (`check_type`),
  INDEX `idx_check_time` (`check_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='气体检测记录表';

-- 签字记录表（通用）
DROP TABLE IF EXISTS `signatures`;
CREATE TABLE `signatures` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `biz_type` VARCHAR(50) NOT NULL COMMENT '业务类型：hot_work/confined_space/high_work 等',
  `biz_id` BIGINT UNSIGNED NOT NULL COMMENT '业务ID（作业票ID）',
  `sign_type` VARCHAR(50) NOT NULL COMMENT '签字类型：apply/dept_approve/safety_approve/gas_check/work/accept/close',
  `signer_id` BIGINT UNSIGNED NOT NULL COMMENT '签字人ID',
  `signer_name` VARCHAR(50) DEFAULT '' COMMENT '签字人姓名',
  `sign_image` LONGTEXT COMMENT '签字图片（base64 PNG）',
  `sign_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '签字时间',
  `ip_address` VARCHAR(50) DEFAULT '' COMMENT 'IP地址',
  `device_info` VARCHAR(200) DEFAULT '' COMMENT '设备信息（H5/PC）',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_biz` (`biz_type`, `biz_id`),
  INDEX `idx_signer` (`signer_id`),
  INDEX `idx_sign_type` (`sign_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签字记录表';

-- ============================================================
-- 三、初始化数据
-- ============================================================

-- 初始化角色
INSERT INTO `roles_v2` (`name`, `code`, `data_scope`, `status`, `remark`) VALUES
('系统管理员', 'admin', 1, 1, '全部数据权限'),
('安全主管', 'safety_manager', 1, 1, '安全审批权限'),
('部门负责人', 'dept_manager', 2, 1, '本部门数据权限'),
('作业负责人', 'work_leader', 3, 1, '本人数据权限'),
('监护人', 'guardian', 3, 1, '现场监护权限'),
('动火人', 'fire_worker', 3, 1, '作业执行权限'),
('普通员工', 'common', 3, 1, '查看权限');

-- 初始化菜单（安全作业 - 动火作业模块）
INSERT INTO `menus` (`name`, `title`, `path`, `component`, `permission`, `icon`, `parent_id`, `menu_type`, `sort_order`, `status`) VALUES
('Safework', '安全作业', '/safework', 'Layout', '', 'guide', 0, 'M', 10, 1),
('System', '系统管理', '/system', 'Layout', '', 'system', 0, 'M', 100, 1);

SET @safework_id = (SELECT id FROM menus WHERE name='Safework');
SET @system_id = (SELECT id FROM menus WHERE name='System');

INSERT INTO `menus` (`name`, `title`, `path`, `component`, `permission`, `icon`, `parent_id`, `menu_type`, `sort_order`, `status`) VALUES
('SafeworkFirework', '动火作业', 'firework', 'safework/firework/index', '', 'fire', @safework_id, 'C', 1, 1),
('SystemRole', '角色管理', 'role', 'system/role/index', '', 'peoples', @system_id, 'C', 1, 1),
('SystemMenu', '菜单管理', 'menu', 'system/menu/index', '', 'tree', @system_id, 'C', 2, 1);

SET @firework_id = (SELECT id FROM menus WHERE name='SafeworkFirework');

INSERT INTO `menus` (`name`, `title`, `path`, `component`, `permission`, `icon`, `parent_id`, `menu_type`, `sort_order`, `status`) VALUES
('SafeworkFireworkAdd', '新增动火作业', '', '', 'safework:firework:add', '', @firework_id, 'F', 1, 1),
('SafeworkFireworkEdit', '编辑动火作业', '', '', 'safework:firework:edit', '', @firework_id, 'F', 2, 1),
('SafeworkFireworkDelete', '删除动火作业', '', '', 'safework:firework:delete', '', @firework_id, 'F', 3, 1),
('SafeworkFireworkApprove', '审批动火作业', '', '', 'safework:firework:approve', '', @firework_id, 'F', 4, 1),
('SafeworkFireworkGas', '气体检测', '', '', 'safework:firework:gas', '', @firework_id, 'F', 5, 1),
('SafeworkFireworkSign', '电子签字', '', '', 'safework:firework:sign', '', @firework_id, 'F', 6, 1),
('SafeworkFireworkExport', '导出PDF', '', '', 'safework:firework:export', '', @firework_id, 'F', 7, 1);

-- 给管理员角色绑定所有菜单（简化：绑定动火作业相关）
SET @admin_role_id = (SELECT id FROM roles_v2 WHERE code='admin');
INSERT INTO `role_menus` (`role_id`, `menu_id`)
SELECT @admin_role_id, id FROM menus WHERE name LIKE '%Firework%' OR name LIKE '%System%';

-- 给默认管理员绑定 admin 角色
INSERT INTO `user_roles` (`user_id`, `role_id`)
SELECT u.id, r.id FROM users u, roles_v2 r WHERE u.username='admin' AND r.code='admin'
ON DUPLICATE KEY UPDATE user_id=user_id;

SET FOREIGN_KEY_CHECKS = 1;
