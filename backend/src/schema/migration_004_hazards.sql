-- 隐患排查表
CREATE TABLE IF NOT EXISTS `hazards` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `hazard_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '隐患编号',
    `title` VARCHAR(200) NOT NULL COMMENT '隐患标题',
    `description` TEXT COMMENT '隐患描述',
    `level` VARCHAR(20) DEFAULT '一般' COMMENT '隐患级别：重大/较大/一般',
    `location` VARCHAR(200) COMMENT '隐患位置',
    `department_id` INT COMMENT '所属部门ID',
    `found_by` INT COMMENT '发现人ID',
    `deadline` DATE COMMENT '整改期限',
    `images` JSON COMMENT '隐患图片',
    `measures` JSON COMMENT '整改措施',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending待整改/rectified已整改/closed已关闭',
    `rectify_measures` TEXT COMMENT '整改措施描述',
    `rectify_images` JSON COMMENT '整改图片',
    `rectify_cost` DECIMAL(10,2) DEFAULT 0 COMMENT '整改费用',
    `rectify_by` INT COMMENT '整改人ID',
    `rectify_at` DATETIME COMMENT '整改时间',
    `accept_result` VARCHAR(20) COMMENT '验收结果：pass/nopass',
    `accept_comment` TEXT COMMENT '验收意见',
    `accept_by` INT COMMENT '验收人ID',
    `accept_at` DATETIME COMMENT '验收时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_hazard_no` (`hazard_no`),
    INDEX `idx_status` (`status`),
    INDEX `idx_level` (`level`),
    INDEX `idx_department` (`department_id`),
    INDEX `idx_found_by` (`found_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='隐患排查表';

-- ============================================================
-- 隐患检查表 (兼容 hazardController 旧字段名)
-- ============================================================
CREATE TABLE IF NOT EXISTS `hazard_inspection` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `inspection_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '隐患编号',
    `hazard_description` TEXT NOT NULL COMMENT '隐患描述',
    `hazard_level` VARCHAR(20) DEFAULT 'general' COMMENT '隐患级别: major/major_risk/general',
    `location` VARCHAR(200) COMMENT '隐患位置',
    `department` VARCHAR(100) COMMENT '所属部门',
    `discoverer_id` INT COMMENT '发现人ID',
    `discovery_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发现时间',
    `rectification_deadline` DATE COMMENT '整改期限',
    `rectification_responsible` VARCHAR(100) COMMENT '整改责任人',
    `rectification_measure` TEXT COMMENT '整改措施',
    `rectification_time` DATETIME COMMENT '整改时间',
    `status` INT DEFAULT 1 COMMENT '状态: 1待整改 2整改中 3待验收 4已完成',
    `verification_result` TINYINT DEFAULT 1 COMMENT '验收结果: 1通过 0不通过',
    `verifier_id` INT COMMENT '验收人ID',
    `verification_time` DATETIME COMMENT '验收时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_inspection_no` (`inspection_no`),
    INDEX `idx_status` (`status`),
    INDEX `idx_level` (`hazard_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='隐患检查表(兼容版)';
