-- ============================================================
-- 安全生产管理系统 v9.0 升级脚本 - 应急/法规/承包商/危化品/隐患
-- 注意：已存在的表使用 CREATE TABLE IF NOT EXISTS
-- ============================================================

USE `safety_system`;

-- ============================================================
-- 1. 应急物资管理表 (新增)
-- ============================================================
CREATE TABLE IF NOT EXISTS `emergency_supplies` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `supply_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '物资编号',
    `name` VARCHAR(200) NOT NULL COMMENT '物资名称',
    `supply_type` VARCHAR(50) COMMENT '物资类型(消防/救援/防护/急救/其他)',
    `specification` VARCHAR(200) COMMENT '规格型号',
    `quantity` INT DEFAULT 0 COMMENT '库存数量',
    `unit` VARCHAR(20) COMMENT '单位(个/套/瓶/箱/台)',
    `location` VARCHAR(200) COMMENT '存放位置',
    `responsible_person` VARCHAR(100) COMMENT '责任人',
    `contact_phone` VARCHAR(20) COMMENT '联系电话',
    `expire_date` DATE COMMENT '有效期',
    `supplier` VARCHAR(200) COMMENT '供应商',
    `purchase_date` DATE COMMENT '采购日期',
    `last_check_date` DATE COMMENT '最近检查日期',
    `check_cycle` INT DEFAULT 30 COMMENT '检查周期(天)',
    `min_alert_quantity` INT DEFAULT 1 COMMENT '最低库存预警',
    `status` TINYINT DEFAULT 1 COMMENT '1=正常, 2=不足, 3=过期, 4=报废',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_supply_no` (`supply_no`),
    INDEX `idx_type` (`supply_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_expire` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应急物资表';

-- ============================================================
-- 2. 应急通讯录表 (新增)
-- ============================================================
CREATE TABLE IF NOT EXISTS `emergency_contacts` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `contact_type` VARCHAR(20) NOT NULL COMMENT '类型(internal内部/external外部)',
    `name` VARCHAR(100) NOT NULL COMMENT '姓名',
    `department` VARCHAR(100) COMMENT '部门/单位',
    `position` VARCHAR(100) COMMENT '职务',
    `phone` VARCHAR(20) NOT NULL COMMENT '电话',
    `phone2` VARCHAR(20) COMMENT '备用电话',
    `email` VARCHAR(100) COMMENT '邮箱',
    `priority` INT DEFAULT 0 COMMENT '优先级(数值越小越优先)',
    `duty_description` TEXT COMMENT '职责描述',
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_type` (`contact_type`),
    INDEX `idx_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应急通讯录表';

-- ============================================================
-- 3. 法律法规类型表 (新增)
-- ============================================================
CREATE TABLE IF NOT EXISTS `law_types` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT '类型名称',
    `code` VARCHAR(50) UNIQUE COMMENT '类型编码',
    `parent_id` INT DEFAULT 0,
    `sort_order` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='法律法规类型表';

-- ============================================================
-- 4. 法律法规条目表 (新增)
-- ============================================================
CREATE TABLE IF NOT EXISTS `laws_regulations` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL COMMENT '标题',
    `document_no` VARCHAR(100) COMMENT '文号',
    `law_type_id` INT COMMENT '类型ID',
    `issuing_authority` VARCHAR(200) COMMENT '发布机关',
    `publish_date` DATE COMMENT '发布日期',
    `effective_date` DATE COMMENT '生效日期',
    `abolish_date` DATE COMMENT '废止日期',
    `level` VARCHAR(20) COMMENT '法律层级(法律/法规/规章/标准/规范性文件)',
    `content` LONGTEXT COMMENT '内容',
    `summary` TEXT COMMENT '摘要',
    `keywords` TEXT COMMENT '关键词',
    `department_ids` JSON COMMENT '关联部门ID',
    `attachment_url` VARCHAR(500) COMMENT '附件URL',
    `version` VARCHAR(20) DEFAULT 'V1.0' COMMENT '版本号',
    `is_current` TINYINT DEFAULT 1 COMMENT '是否现行有效',
    `status` TINYINT DEFAULT 1 COMMENT '1=现行, 2=废止, 3=修订中',
    `view_count` INT DEFAULT 0 COMMENT '浏览次数',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_doc_no` (`document_no`),
    INDEX `idx_type` (`law_type_id`),
    INDEX `idx_level` (`level`),
    INDEX `idx_status` (`status`),
    INDEX `idx_effective` (`effective_date`),
    FULLTEXT INDEX `ft_search` (`title`, `content`, `summary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='法律法规表';

-- ============================================================
-- 5. 承包商人员管理表 (新增，补充related_party_archives)
-- ============================================================
CREATE TABLE IF NOT EXISTS `contractor_personnel` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `contractor_id` INT NOT NULL COMMENT '承包商ID(关联related_party_archives)',
    `name` VARCHAR(100) NOT NULL COMMENT '姓名',
    `id_card` VARCHAR(18) COMMENT '身份证号',
    `phone` VARCHAR(20) COMMENT '电话',
    `position` VARCHAR(100) COMMENT '职位',
    `entry_date` DATE COMMENT '入场日期',
    `exit_date` DATE COMMENT '离场日期',
    `trainings` JSON COMMENT '培训记录',
    `certificates` JSON COMMENT '证书信息',
    `safety_education` TINYINT DEFAULT 0 COMMENT '是否完成安全教育',
    `insurance_info` TEXT COMMENT '保险信息',
    `status` TINYINT DEFAULT 1 COMMENT '1=在场, 2=离场, 3=黑名单',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_contractor` (`contractor_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_entry` (`entry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='承包商人员表';

-- ============================================================
-- 6. 隐患举报/随手拍表 (新增)
-- ============================================================
CREATE TABLE IF NOT EXISTS `hazard_reports` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `report_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '举报编号',
    `reporter_id` INT COMMENT '举报人ID',
    `reporter_name` VARCHAR(100) COMMENT '举报人姓名(允许匿名)',
    `reporter_phone` VARCHAR(20) COMMENT '举报人电话',
    `is_anonymous` TINYINT DEFAULT 0 COMMENT '是否匿名',
    `hazard_location` VARCHAR(500) NOT NULL COMMENT '隐患位置',
    `hazard_description` TEXT NOT NULL COMMENT '隐患描述',
    `hazard_type` VARCHAR(50) COMMENT '隐患类型',
    `hazard_level` VARCHAR(20) COMMENT '隐患等级(一般/较大/重大)',
    `photos` JSON COMMENT '现场照片',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态(pending待处理/processing处理中/resolved已解决/rejected已驳回)',
    `review_opinion` TEXT COMMENT '审核意见',
    `reviewer_id` INT COMMENT '审核人',
    `review_time` DATETIME NULL,
    `reward_amount` DECIMAL(10,2) COMMENT '奖励金额',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_report_no` (`report_no`),
    INDEX `idx_reporter` (`reporter_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_level` (`hazard_level`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='隐患举报/随手拍表';

-- ============================================================
-- 7. 隐患整改与验收记录表 (增强)
-- ============================================================
CREATE TABLE IF NOT EXISTS `hazard_rectifications` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `hazard_id` INT NOT NULL COMMENT '隐患ID(关联hazard_inspection或hazard_reports)',
    `source_type` VARCHAR(20) DEFAULT 'inspection' COMMENT '来源类型(inspection/report)',
    `rectification_measure` TEXT COMMENT '整改措施',
    `rectification_plan` TEXT COMMENT '整改方案(详细)',
    `responsible_department` VARCHAR(100) COMMENT '责任部门',
    `responsible_person` VARCHAR(100) COMMENT '责任人',
    `deadline` DATE COMMENT '整改期限',
    `start_date` DATE COMMENT '开始日期',
    `completion_date` DATE COMMENT '完成日期',
    `actual_effect` TEXT COMMENT '实际效果',
    `cost_amount` DECIMAL(12,2) COMMENT '整改费用',
    `photos_before` JSON COMMENT '整改前照片',
    `photos_after` JSON COMMENT '整改后照片',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态(pending未开始/processing整改中/completed已完成/verified已验证)',
    `acceptance_result` TINYINT COMMENT '验收结果(1合格/2不合格)',
    `acceptance_opinion` TEXT COMMENT '验收意见',
    `acceptor_id` INT COMMENT '验收人',
    `acceptance_time` DATETIME NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_hazard` (`hazard_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_deadline` (`deadline`),
    INDEX `idx_responsible` (`responsible_person`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='隐患整改与验收记录表';

-- ============================================================
-- 8. 危化品出入库记录 (新增，补充chemical_archives)
-- ============================================================
CREATE TABLE IF NOT EXISTS `chemical_transactions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `chemical_id` INT NOT NULL COMMENT '化学品ID',
    `transaction_type` VARCHAR(10) NOT NULL COMMENT '类型(in入库/out出库)',
    `quantity` DECIMAL(10,2) NOT NULL COMMENT '数量',
    `unit` VARCHAR(20) COMMENT '单位',
    `operator_id` INT COMMENT '操作人ID',
    `operator_name` VARCHAR(100) COMMENT '操作人姓名',
    `transaction_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    `purpose` TEXT COMMENT '用途/去向',
    `supplier` VARCHAR(200) COMMENT '供应商(入库)',
    `recipient` VARCHAR(200) COMMENT '领用人(出库)',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_chemical` (`chemical_id`),
    INDEX `idx_type` (`transaction_type`),
    INDEX `idx_time` (`transaction_time`),
    FOREIGN KEY (`chemical_id`) REFERENCES `chemical_archives`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='化学品出入库记录表';

-- ============================================================
-- 初始化数据
-- ============================================================
INSERT INTO `law_types` (`name`, `code`, `sort_order`) VALUES
('国家法律', 'national_law', 1),
('行政法规', 'administrative_regulation', 2),
('地方性法规', 'local_regulation', 3),
('部门规章', 'departmental_rule', 4),
('国家标准', 'national_standard', 5),
('行业标准', 'industry_standard', 6),
('规范性文件', 'normative_doc', 7);

INSERT INTO `emergency_contacts` (`contact_type`, `name`, `department`, `position`, `phone`, `priority`, `duty_description`) VALUES
('external', '火警', '', '', '119', 1, '火灾报警'),
('external', '急救', '', '', '120', 2, '医疗急救'),
('external', '报警', '', '', '110', 3, '治安报警'),
('external', '安监部门', '应急管理局', '', '12350', 4, '安全生产举报'),
('internal', '应急指挥长', '安全生产部', '安全总监', '', 1, '应急总指挥'),
('internal', '安全管理员', '安全生产部', '安全员', '', 2, '现场应急处置');

SELECT '应急/法规/承包商/危化品/隐患增强表创建完成！' AS message;
