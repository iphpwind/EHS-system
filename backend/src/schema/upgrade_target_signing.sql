-- ============================================================
-- 安全生产管理系统 - 目标责任书增强升级脚本
-- 1. 责任书模板表
-- 2. 签订记录表
-- ============================================================

-- 责任书模板表
CREATE TABLE IF NOT EXISTS `target_templates` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `template_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '模板编号',
    `title` VARCHAR(200) NOT NULL COMMENT '模板名称',
    `target_type` VARCHAR(50) DEFAULT '责任书' COMMENT '类型(安全目标/责任书/承诺书)',
    `position_type` VARCHAR(100) DEFAULT '' COMMENT '适用岗位类型',
    `department` VARCHAR(100) DEFAULT '' COMMENT '适用部门',
    `content` TEXT COMMENT '模板内容(富文本/JSON)',
    `file_url` VARCHAR(500) DEFAULT '' COMMENT '模板文件URL',
    `status` TINYINT DEFAULT 1,
    `created_by` INT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='责任书模板表';

-- 签订记录表
CREATE TABLE IF NOT EXISTS `target_signings` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `target_id` INT NOT NULL COMMENT '关联目标/责任书ID',
    `template_id` INT DEFAULT NULL COMMENT '关联模板ID',
    `initiator_id` INT DEFAULT NULL COMMENT '发起人(管理员)',
    `target_user_id` INT DEFAULT NULL COMMENT '目标责任人',
    `target_department` VARCHAR(100) DEFAULT '' COMMENT '目标部门',
    `sign_status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending待签/confirmed已确认/approved已批准/rejected已驳回',
    `confirm_time` DATETIME DEFAULT NULL COMMENT '确认时间',
    `approve_time` DATETIME DEFAULT NULL COMMENT '批准时间',
    `reject_reason` VARCHAR(500) DEFAULT '' COMMENT '驳回原因',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_target` (`target_id`),
    INDEX `idx_status` (`sign_status`),
    INDEX `idx_user` (`target_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签订记录表';

SELECT '目标责任书增强表创建完成！' AS message;
