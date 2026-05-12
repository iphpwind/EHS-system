-- =====================================================
-- 化工企业培训合规增强迁移 (2026-05-12)
-- 
-- 功能：
-- 1. training_records 增加 credit_hours/learning_minutes 字段
-- 2. 三级安全教育模板表 (three_level_templates)
-- 3. 人员三级教育记录表 (three_level_education_records)
-- 4. 初始化化工企业标准72学时三级教育模板
-- =====================================================

-- ======== 1. 增强 training_records（兼容MySQL 5.7） ========
-- 先检查并添加 learning_minutes（放在 pass_status 后面）
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'training_records' AND COLUMN_NAME = 'learning_minutes');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE training_records ADD COLUMN learning_minutes INT DEFAULT 0 COMMENT ''累计学习分钟数'' AFTER pass_status', 'SELECT ''learning_minutes已存在'' as msg');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 先检查并添加 credit_hours
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'training_records' AND COLUMN_NAME = 'credit_hours');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE training_records ADD COLUMN credit_hours DECIMAL(5,2) DEFAULT 0 COMMENT ''累计学分学时(45分钟=1学时)'' AFTER learning_minutes', 'SELECT ''credit_hours已存在'' as msg');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ======== 2. 三级安全教育模板表 ========
CREATE TABLE IF NOT EXISTS `three_level_templates` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `level` ENUM('factory','workshop','team') NOT NULL COMMENT '教育级别: factory=厂级,workshop=车间级,team=班组级',
  `name` VARCHAR(100) NOT NULL COMMENT '模板名称',
  `required_hours` DECIMAL(5,2) DEFAULT 24 COMMENT '要求学时(化工企业标准24学时/级)',
  `content` TEXT COMMENT '教育内容大纲',
  `course_ids` JSON COMMENT '关联课程ID列表',
  `is_default` TINYINT DEFAULT 1 COMMENT '是否默认模板',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='三级安全教育模板表';

-- ======== 3. 人员三级教育记录表 ========
CREATE TABLE IF NOT EXISTS `three_level_education_records` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '员工ID',
  `project_id` INT NULL COMMENT '关联三同时项目ID',
  `factory_hours` DECIMAL(5,2) DEFAULT 0 COMMENT '厂级已完成学时',
  `workshop_hours` DECIMAL(5,2) DEFAULT 0 COMMENT '车间级已完成学时',
  `team_hours` DECIMAL(5,2) DEFAULT 0 COMMENT '班组级已完成学时',
  `total_hours` DECIMAL(5,2) DEFAULT 0 COMMENT '总学时(程序自动计算: factory+workshop+team)',
  `status` ENUM('pending','in_progress','completed') DEFAULT 'pending' COMMENT '状态',
  `completed_at` DATETIME NULL COMMENT '全部完成时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user` (`user_id`),
  INDEX `idx_project` (`project_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人员三级安全教育记录表(化工企业72学时合规)';

-- ======== 4. 初始化化工企业标准72学时模板 ========
INSERT INTO `three_level_templates` (`level`, `name`, `required_hours`, `content`, `is_default`, `sort_order`) VALUES
('factory', '厂级安全教育（一级）', 24, '安全生产方针政策与法律法规、本单位安全生产规章制度和劳动纪律、从业人员安全生产权利和义务、事故应急救援/应急预案演练及防范措施、有关事故案例', 1, 1),
('workshop', '车间级安全教育（二级）', 24, '工作环境及危险因素、所从事工种可能遭受的职业伤害和伤亡事故、所从事工种的安全职责/操作技能及强制性标准、自救互救/急救方法/疏散和现场紧急情况的处理、安全设备设施/个人防护用品的使用和维护、本车间安全生产状况及规章制度、预防事故和职业危害的措施及应注意的安全事项、有关事故案例', 1, 2),
('team', '班组级安全教育（三级）', 24, '岗位安全操作规程、岗位之间工作衔接配合的安全与职业卫生事项、岗位典型事故案例、劳动防护用品（用具）的性能及正确使用方法、岗位隐患排查方法与要点', 1, 3)
ON DUPLICATE KEY UPDATE `content` = VALUES(`content`);
