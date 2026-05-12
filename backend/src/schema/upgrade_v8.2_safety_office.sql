-- ============================================================
-- 安全生产管理系统 v8.2 升级脚本 - 安全办公模块
-- ============================================================

USE `safety_system`;

-- ============================================================
-- 1. 员工考核表
-- ============================================================
CREATE TABLE IF NOT EXISTS `employee_assessments` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `assessment_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '考核编号',
    `user_id` INT NOT NULL COMMENT '被考核人ID',
    `assessment_type` VARCHAR(50) NOT NULL COMMENT '考核类型(月度/季度/年度/专项)',
    `assessment_date` DATE COMMENT '考核日期',
    `assessor_id` INT COMMENT '考核人ID',
    `safety_knowledge` DECIMAL(5,2) COMMENT '安全知识(分)',
    `safety_operation` DECIMAL(5,2) COMMENT '安全操作(分)',
    `safety_attitude` DECIMAL(5,2) COMMENT '安全态度(分)',
    `violation_count` INT DEFAULT 0 COMMENT '违章次数',
    `hidden_danger_found` INT DEFAULT 0 COMMENT '发现隐患数',
    `total_score` DECIMAL(5,2) COMMENT '总分',
    `grade` VARCHAR(20) COMMENT '等级(优秀/良好/合格/不合格)',
    `assessment_content` TEXT COMMENT '考核内容',
    `improvement_suggestion` TEXT COMMENT '改进建议',
    `status` TINYINT DEFAULT 1 COMMENT '1=已考核, 2=已确认, 3=已归档',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_assessment_no` (`assessment_no`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_type` (`assessment_type`),
    INDEX `idx_grade` (`grade`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`assessor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工考核表';

-- ============================================================
-- 2. 文件管理表
-- ============================================================
CREATE TABLE IF NOT EXISTS `document_management` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `doc_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '文件编号',
    `title` VARCHAR(200) NOT NULL COMMENT '文件标题',
    `file_type` VARCHAR(50) NOT NULL COMMENT '文件类型(制度/通知/报告/记录/表单/其他)',
    `category` VARCHAR(100) COMMENT '分类',
    `keywords` TEXT COMMENT '关键词',
    `file_path` VARCHAR(500) COMMENT '文件路径',
    `file_size` INT COMMENT '文件大小(字节)',
    `file_format` VARCHAR(20) COMMENT '文件格式(pdf/doc/xls/...)',
    `version` VARCHAR(20) DEFAULT 'V1.0' COMMENT '版本号',
    `issuing_department` VARCHAR(100) COMMENT '发布部门',
    `issuer_id` INT COMMENT '发布人ID',
    `effective_date` DATE COMMENT '生效日期',
    `expiry_date` DATE COMMENT '失效日期',
    `is_public` TINYINT DEFAULT 1 COMMENT '是否公开',
    `download_count` INT DEFAULT 0 COMMENT '下载次数',
    `status` TINYINT DEFAULT 1 COMMENT '1=有效, 2=废止, 3=草稿',
    `description` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_doc_no` (`doc_no`),
    INDEX `idx_file_type` (`file_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_issuer` (`issuer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件管理表';

-- ============================================================
-- 3. 目标与责任书表
-- ============================================================
CREATE TABLE IF NOT EXISTS `target_responsibility` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `target_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '编号',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `target_type` VARCHAR(50) NOT NULL COMMENT '类型(年度目标/季度目标/专项目标/责任书)',
    `target_year` INT COMMENT '目标年度',
    `responsible_department` VARCHAR(100) COMMENT '责任部门',
    `responsible_person` VARCHAR(100) COMMENT '责任人',
    `signing_date` DATE COMMENT '签订日期',
    `expiry_date` DATE COMMENT '到期日期',
    `target_content` TEXT COMMENT '目标内容',
    `key_indicators` JSON COMMENT '关键指标(JSON)',
    `completion_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '完成率(%)',
    `assessment_result` TEXT COMMENT '考核结果',
    `signature_url_a` VARCHAR(500) COMMENT '甲方签字URL',
    `signature_url_b` VARCHAR(500) COMMENT '乙方签字URL',
    `status` TINYINT DEFAULT 1 COMMENT '1=待签订, 2=执行中, 3=已完成, 4=已过期',
    `remark` TEXT,
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_target_no` (`target_no`),
    INDEX `idx_type` (`target_type`),
    INDEX `idx_department` (`responsible_department`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='目标与责任书表';

-- ============================================================
-- 4. 职业健康表
-- ============================================================
CREATE TABLE IF NOT EXISTS `occupational_health` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `record_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '记录编号',
    `user_id` INT NOT NULL COMMENT '员工ID',
    `health_type` VARCHAR(50) NOT NULL COMMENT '类型(岗前/在岗/离岗/应急/健康档案)',
    `checkup_date` DATE COMMENT '体检日期',
    `checkup_organization` VARCHAR(200) COMMENT '体检机构',
    `checkup_result` TEXT COMMENT '体检结果',
    `hazard_factors` TEXT COMMENT '接触危害因素',
    `is_normal` TINYINT DEFAULT 1 COMMENT '是否正常',
    `abnormal_findings` TEXT COMMENT '异常发现',
    `medical_advice` TEXT COMMENT '医学建议',
    `occupational_disease` VARCHAR(200) COMMENT '职业病诊断',
    `file_url` VARCHAR(500) COMMENT '体检报告URL',
    `next_checkup_date` DATE COMMENT '下次体检日期',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_record_no` (`record_no`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_type` (`health_type`),
    INDEX `idx_checkup_date` (`checkup_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职业健康表';

-- ============================================================
-- 5. 会议与公告表
-- ============================================================
CREATE TABLE IF NOT EXISTS `meetings_announcements` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `content_type` VARCHAR(20) NOT NULL COMMENT '类型(meeting/announcement)',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `content` TEXT COMMENT '内容',
    `meeting_date` DATETIME COMMENT '会议时间',
    `meeting_location` VARCHAR(200) COMMENT '会议地点',
    `organizer` VARCHAR(100) COMMENT '组织者',
    `participants` JSON COMMENT '参会人员',
    `minutes` TEXT COMMENT '会议纪要',
    `attachments` JSON COMMENT '附件',
    `priority` VARCHAR(20) DEFAULT 'normal' COMMENT '优先级(normal/important/urgent)',
    `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶',
    `publish_date` DATETIME COMMENT '发布日期',
    `publish_status` TINYINT DEFAULT 0 COMMENT '0=草稿, 1=已发布',
    `read_count` INT DEFAULT 0 COMMENT '阅读次数',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_type` (`content_type`),
    INDEX `idx_publish_status` (`publish_status`),
    INDEX `idx_priority` (`priority`),
    INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会议与公告表';

-- ============================================================
-- 6. 安全生产知识库表
-- ============================================================
CREATE TABLE IF NOT EXISTS `safety_knowledge_base` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `knowledge_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '编号',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `knowledge_type` VARCHAR(50) NOT NULL COMMENT '类型(法规/标准/规范/案例/技术/操作/其他)',
    `category` VARCHAR(100) COMMENT '分类',
    `tags` TEXT COMMENT '标签',
    `content` LONGTEXT COMMENT '内容(富文本/Markdown)',
    `summary` TEXT COMMENT '摘要',
    `source` VARCHAR(200) COMMENT '来源',
    `reference_url` VARCHAR(500) COMMENT '参考链接',
    `attachments` JSON COMMENT '附件',
    `is_public` TINYINT DEFAULT 1 COMMENT '是否公开',
    `view_count` INT DEFAULT 0 COMMENT '浏览次数',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `status` TINYINT DEFAULT 1 COMMENT '1=已发布, 2=草稿, 3=已归档',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_knowledge_no` (`knowledge_no`),
    INDEX `idx_type` (`knowledge_type`),
    INDEX `idx_status` (`status`),
    FULLTEXT INDEX `ft_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='安全生产知识库表';

-- ============================================================
-- 7. 安全生产投入表
-- ============================================================
CREATE TABLE IF NOT EXISTS `safety_investment` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `investment_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '编号',
    `investment_type` VARCHAR(50) NOT NULL COMMENT '投入类型(设备/培训/防护/检测/保险/其他)',
    `project_name` VARCHAR(200) NOT NULL COMMENT '项目名称',
    `amount` DECIMAL(15,2) NOT NULL COMMENT '金额(元)',
    `budget_source` VARCHAR(100) COMMENT '预算来源',
    `investment_date` DATE COMMENT '投入日期',
    `responsible_department` VARCHAR(100) COMMENT '责任部门',
    `responsible_person` VARCHAR(100) COMMENT '负责人',
    `vendor` VARCHAR(200) COMMENT '供应商/服务商',
    `description` TEXT COMMENT '投入说明',
    `files` JSON COMMENT '凭证文件',
    `effect_evaluation` TEXT COMMENT '效果评估',
    `status` TINYINT DEFAULT 1 COMMENT '1=已投入, 2=计划中, 3=已取消',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_investment_no` (`investment_no`),
    INDEX `idx_type` (`investment_type`),
    INDEX `idx_date` (`investment_date`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='安全生产投入表';

-- ============================================================
-- 8. 变更管理表
-- ============================================================
CREATE TABLE IF NOT EXISTS `change_management` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `change_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '变更编号',
    `change_title` VARCHAR(200) NOT NULL COMMENT '变更标题',
    `change_type` VARCHAR(50) NOT NULL COMMENT '变更类型(工艺/设备/人员/材料/规程/其他)',
    `change_level` VARCHAR(20) COMMENT '变更等级(I/II/III)',
    `applicant_id` INT COMMENT '申请人ID',
    `apply_date` DATE COMMENT '申请日期',
    `description` TEXT COMMENT '变更描述',
    `reason` TEXT COMMENT '变更原因',
    `risk_assessment` TEXT COMMENT '风险评估',
    `safety_measures` TEXT COMMENT '安全措施',
    -- 审批流程
    `proposer_id` INT COMMENT '提出人',
    `reviewer_id` INT COMMENT '审核人',
    `approver_id` INT COMMENT '批准人',
    `review_comment` TEXT COMMENT '审核意见',
    `approval_comment` TEXT COMMENT '批准意见',
    `review_date` DATE COMMENT '审核日期',
    `approval_date` DATE COMMENT '批准日期',
    -- 实施
    `implementation_plan` TEXT COMMENT '实施方案',
    `implementer` VARCHAR(100) COMMENT '实施人',
    `implement_date` DATE COMMENT '实施日期',
    `completion_date` DATE COMMENT '完成日期',
    `verification_result` TEXT COMMENT '验证结果',
    `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/reviewing/approved/implementing/completed/rejected',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_change_no` (`change_no`),
    INDEX `idx_type` (`change_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_applicant` (`applicant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='变更管理表';

SELECT '安全办公模块表创建完成！' AS message;
