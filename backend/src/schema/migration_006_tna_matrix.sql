-- ============================================
-- 迁移006：培训需求矩阵 TNA (Training Needs Analysis)
-- 创建岗位-课程映射表和培训任务表
-- ============================================

-- 岗位与课程映射表
CREATE TABLE IF NOT EXISTS position_course_mapping (
  id INT PRIMARY KEY AUTO_INCREMENT,
  position_name VARCHAR(100) NOT NULL COMMENT '岗位名称（与 users.position 对应，"全员"表示所有岗位）',
  course_id INT NOT NULL COMMENT '课程ID',
  requirement_level ENUM('required','recommended') DEFAULT 'required' COMMENT '必修/推荐',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_position_course (position_name, course_id),
  FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='岗位课程映射表';

-- 培训任务表（自动触发的培训任务）
CREATE TABLE IF NOT EXISTS training_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '被分配用户ID',
  course_id INT NOT NULL COMMENT '课程ID',
  task_type ENUM('onboarding','position_change','moc','periodic','manual') DEFAULT 'manual' COMMENT '任务来源',
  status ENUM('pending','in_progress','completed','expired') DEFAULT 'pending',
  due_date DATE COMMENT '截止日期',
  assigned_by INT COMMENT '分配人ID（系统自动为0）',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES training_courses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培训任务表';

-- 初始数据：全员必修课示例
INSERT IGNORE INTO position_course_mapping (position_name, course_id, requirement_level)
SELECT '全员', id, 'required' FROM training_courses WHERE title LIKE '%安全%' OR title LIKE '%消防%' LIMIT 3;
