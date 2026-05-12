-- ============================================================
-- 安全生产管理系统 v9.0 升级脚本 - 在线教育培训系统
-- 包含：课程管理、题库管理、试卷管理、在线考试、证书管理
-- ============================================================

USE `safety_system`;

-- ============================================================
-- 1. 课程分类表
-- ============================================================
CREATE TABLE IF NOT EXISTS `course_categories` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `parent_id` INT DEFAULT 0 COMMENT '上级分类',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程分类表';

-- ============================================================
-- 2. 在线课程表
-- ============================================================
CREATE TABLE IF NOT EXISTS `training_courses` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `course_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '课程编号',
    `title` VARCHAR(200) NOT NULL COMMENT '课程标题',
    `category_id` INT COMMENT '分类ID',
    `course_type` VARCHAR(50) DEFAULT 'video' COMMENT '课程类型(video/document/mixed)',
    `description` TEXT COMMENT '课程描述',
    `duration` INT DEFAULT 0 COMMENT '课程时长(分钟)',
    `video_url` VARCHAR(500) COMMENT '视频URL',
    `cover_url` VARCHAR(500) COMMENT '封面图URL',
    `document_url` VARCHAR(500) COMMENT '文档URL',
    `instructor` VARCHAR(100) COMMENT '讲师',
    `instructor_intro` TEXT COMMENT '讲师简介',
    `difficulty` VARCHAR(20) DEFAULT 'medium' COMMENT '难度(easy/medium/hard)',
    `total_sections` INT DEFAULT 0 COMMENT '总章节数',
    `is_mandatory` TINYINT DEFAULT 0 COMMENT '是否必修',
    `target_departments` JSON COMMENT '目标部门',
    `view_count` INT DEFAULT 0 COMMENT '观看次数',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `status` TINYINT DEFAULT 1 COMMENT '1=上架, 2=下架, 3=草稿',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_course_no` (`course_no`),
    INDEX `idx_category` (`category_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_type` (`course_type`),
    FOREIGN KEY (`category_id`) REFERENCES `course_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='在线课程表';

-- ============================================================
-- 3. 课程章节表
-- ============================================================
CREATE TABLE IF NOT EXISTS `course_sections` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `course_id` INT NOT NULL COMMENT '课程ID',
    `section_no` INT DEFAULT 0 COMMENT '章节序号',
    `title` VARCHAR(200) NOT NULL COMMENT '章节标题',
    `duration` INT DEFAULT 0 COMMENT '章节时长(秒)',
    `video_url` VARCHAR(500) COMMENT '章节视频URL',
    `content_type` VARCHAR(20) DEFAULT 'video' COMMENT '内容类型(video/text/quiz)',
    `content_text` LONGTEXT COMMENT '文本内容',
    `allow_preview` TINYINT DEFAULT 0 COMMENT '是否允许预览',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_course` (`course_id`),
    INDEX `idx_section_no` (`course_id`, `section_no`),
    FOREIGN KEY (`course_id`) REFERENCES `training_courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程章节表';

-- ============================================================
-- 4. 学习进度表
-- ============================================================
CREATE TABLE IF NOT EXISTS `learning_progress` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT '用户ID',
    `course_id` INT NOT NULL COMMENT '课程ID',
    `section_id` INT COMMENT '当前章节ID',
    `watched_seconds` INT DEFAULT 0 COMMENT '已观看秒数',
    `last_position` INT DEFAULT 0 COMMENT '上次播放位置(秒)',
    `completion_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '完成率(%)',
    `is_completed` TINYINT DEFAULT 0 COMMENT '是否完成',
    `completed_at` DATETIME NULL COMMENT '完成时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_course` (`course_id`),
    INDEX `idx_completed` (`is_completed`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `training_courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习进度表';

-- ============================================================
-- 5. 题库分类字典表
-- ============================================================
CREATE TABLE IF NOT EXISTS `question_categories` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `parent_id` INT DEFAULT 0 COMMENT '上级分类',
    `description` TEXT,
    `sort_order` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题库分类表';

-- ============================================================
-- 6. 题库表
-- ============================================================
CREATE TABLE IF NOT EXISTS `education_questions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `question_type` VARCHAR(20) NOT NULL COMMENT '题型(single/true_false/multi/fill/essay)',
    `category_id` INT COMMENT '分类ID',
    `difficulty` VARCHAR(20) DEFAULT 'medium' COMMENT '难度(easy/medium/hard)',
    `question_content` TEXT NOT NULL COMMENT '题目内容',
    `options` JSON COMMENT '选项(JSON, 单选/多选时使用)',
    `correct_answer` TEXT NOT NULL COMMENT '正确答案',
    `analysis` TEXT COMMENT '解析',
    `score` DECIMAL(5,1) DEFAULT 1 COMMENT '分值',
    `tags` TEXT COMMENT '标签',
    `status` TINYINT DEFAULT 1 COMMENT '1=启用, 2=禁用',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_type` (`question_type`),
    INDEX `idx_category` (`category_id`),
    INDEX `idx_difficulty` (`difficulty`),
    INDEX `idx_status` (`status`),
    FULLTEXT INDEX `ft_content` (`question_content`),
    FOREIGN KEY (`category_id`) REFERENCES `question_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题库表';

-- ============================================================
-- 7. 试卷表
-- ============================================================
CREATE TABLE IF NOT EXISTS `exam_papers` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `paper_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '试卷编号',
    `title` VARCHAR(200) NOT NULL COMMENT '试卷标题',
    `description` TEXT COMMENT '试卷说明',
    `category_id` INT COMMENT '关联分类',
    `total_score` DECIMAL(6,1) DEFAULT 100 COMMENT '总分',
    `pass_score` DECIMAL(6,1) DEFAULT 60 COMMENT '及格分',
    `duration_minutes` INT DEFAULT 60 COMMENT '考试时长(分钟)',
    `question_count` INT DEFAULT 0 COMMENT '题目总数',
    `is_random` TINYINT DEFAULT 0 COMMENT '是否随机出题',
    `random_rule` JSON COMMENT '随机规则(各题型数量配置)',
    `fixed_questions` JSON COMMENT '固定题目ID列表',
    `allow_retake` TINYINT DEFAULT 1 COMMENT '是否允许重考',
    `max_attempts` INT DEFAULT 3 COMMENT '最大考试次数',
    `status` TINYINT DEFAULT 1 COMMENT '1=启用, 2=草稿, 3=归档',
    `created_by` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_paper_no` (`paper_no`),
    INDEX `idx_category` (`category_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷表';

-- ============================================================
-- 8. 考试记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS `exam_results` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT '用户ID',
    `paper_id` INT NOT NULL COMMENT '试卷ID',
    `attempt_no` INT DEFAULT 1 COMMENT '第几次考试',
    `score` DECIMAL(6,1) DEFAULT 0 COMMENT '得分',
    `total_score` DECIMAL(6,1) DEFAULT 100 COMMENT '总分',
    `is_passed` TINYINT DEFAULT 0 COMMENT '是否及格',
    `answers_json` JSON COMMENT '答题详情(JSON, 含每题答案和得分)',
    `start_time` DATETIME NULL COMMENT '开始时间',
    `submit_time` DATETIME NULL COMMENT '提交时间',
    `duration_seconds` INT DEFAULT 0 COMMENT '用时(秒)',
    `auto_grade` TINYINT DEFAULT 1 COMMENT '是否自动评分',
    `status` VARCHAR(20) DEFAULT 'in_progress' COMMENT '状态(in_progress/completed/expired)',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user` (`user_id`),
    INDEX `idx_paper` (`paper_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_passed` (`is_passed`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`paper_id`) REFERENCES `exam_papers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考试记录表';

-- ============================================================
-- 9. 证书类型字典表
-- ============================================================
CREATE TABLE IF NOT EXISTS `certificate_type_dict` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT '证书类型名称',
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT '证书类型编码',
    `description` TEXT COMMENT '说明',
    `validity_days` INT DEFAULT 365 COMMENT '有效期(天)',
    `renewal_advance_days` INT DEFAULT 30 COMMENT '提前续期天数',
    `requires_exam` TINYINT DEFAULT 0 COMMENT '是否需要考试',
    `exam_paper_id` INT COMMENT '关联考试试卷ID',
    `sort_order` INT DEFAULT 0,
    `status` TINYINT DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_code` (`code`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='证书类型字典表';

-- ============================================================
-- 10. 证书表
-- ============================================================
CREATE TABLE IF NOT EXISTS `certificates` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `cert_no` VARCHAR(100) NOT NULL UNIQUE COMMENT '证书编号',
    `user_id` INT NOT NULL COMMENT '持有人ID',
    `cert_type_id` INT COMMENT '证书类型ID',
    `cert_name` VARCHAR(200) COMMENT '证书名称',
    `issue_date` DATE COMMENT '发证日期',
    `expire_date` DATE COMMENT '到期日期',
    `issue_authority` VARCHAR(200) COMMENT '发证机关',
    `exam_result_id` INT COMMENT '关联考试记录ID',
    `training_plan_id` INT COMMENT '关联培训计划ID',
    `attachment_url` VARCHAR(500) COMMENT '证书附件URL',
    `is_renewed` TINYINT DEFAULT 0 COMMENT '是否已续期',
    `renewed_from_id` INT COMMENT '续期来源证书ID',
    `status` TINYINT DEFAULT 1 COMMENT '1=有效, 2=即将到期, 3=已过期, 4=已作废',
    `remark` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_cert_no` (`cert_no`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_type` (`cert_type_id`),
    INDEX `idx_expire` (`expire_date`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`cert_type_id`) REFERENCES `certificate_type_dict`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='证书表';

-- ============================================================
-- 11. 学时记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS `learning_hours` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT '用户ID',
    `course_id` INT COMMENT '课程ID',
    `training_plan_id` INT COMMENT '培训计划ID',
    `learning_type` VARCHAR(50) NOT NULL COMMENT '学习类型(online_course/offline_training/exam)',
    `hours` DECIMAL(5,2) DEFAULT 0 COMMENT '学时(小时)',
    `learning_date` DATE COMMENT '学习日期',
    `description` TEXT,
    `verified_by` INT COMMENT '审核人ID',
    `verified_at` DATETIME NULL COMMENT '审核时间',
    `status` TINYINT DEFAULT 0 COMMENT '0=待审核, 1=已确认',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user` (`user_id`),
    INDEX `idx_type` (`learning_type`),
    INDEX `idx_date` (`learning_date`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学时记录表';

-- 初始化课程分类
INSERT INTO `course_categories` (`name`, `parent_id`, `sort_order`) VALUES
('安全法规', 0, 1),
('安全技术', 0, 2),
('应急处置', 0, 3),
('职业健康', 0, 4),
('消防安全', 0, 5);

-- 初始化题库分类
INSERT INTO `question_categories` (`name`, `parent_id`, `sort_order`) VALUES
('安全生产法', 0, 1),
('消防安全知识', 0, 2),
('应急处置知识', 0, 3),
('职业健康知识', 0, 4),
('特殊作业安全', 0, 5),
('机械安全知识', 0, 6);

SELECT '在线教育培训系统表创建完成！' AS message;
