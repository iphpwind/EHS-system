-- 培训教育模块菜单SQL
-- 执行前请备份数据库：mysqldump -u root -p safety_system > backup.sql

USE safety_system;

-- 培训教育主菜单（一级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('培训教育', 'M', 'education', 8, 0, '/training', 'Layout', 1, NOW(), NOW());

-- 获取刚才插入的主菜单ID
SET @trainingMenuId = LAST_INSERT_ID();

-- 培训计划（二级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('培训计划', 'C', '', 1, @trainingMenuId, 'plan', 'training/PlanList.vue', 1, NOW(), NOW());

-- 课程管理（二级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('课程管理', 'C', '', 2, @trainingMenuId, 'course', 'training/CourseList.vue', 1, NOW(), NOW());

-- 在线考试（二级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('在线考试', 'C', '', 3, @trainingMenuId, 'exam', 'training/ExamRoom.vue', 1, NOW(), NOW());

-- 我的学习（二级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('我的学习', 'C', '', 4, @trainingMenuId, 'my', 'training/MyTraining.vue', 1, NOW(), NOW());

-- 证书管理（二级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('证书管理', 'C', '', 5, @trainingMenuId, 'certificate', 'training/CertificateList.vue', 1, NOW(), NOW());

-- 培训统计（二级菜单）
INSERT INTO system_menu (menu_name, menu_type, menu_icon, menu_order, parent_id, path, component, status, create_time, update_time)
VALUES 
('培训统计', 'C', '', 6, @trainingMenuId, 'statistics', 'training/Statistics.vue', 1, NOW(), NOW());

COMMIT;
