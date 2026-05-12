-- 模块配置表：用于系统设置中的模块开关
CREATE TABLE IF NOT EXISTS module_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  module_key VARCHAR(64) NOT NULL UNIQUE COMMENT '模块唯一标识',
  module_name VARCHAR(128) NOT NULL COMMENT '模块显示名称',
  module_desc VARCHAR(256) DEFAULT NULL COMMENT '模块描述',
  enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用: 1启用, 0禁用',
  icon VARCHAR(64) DEFAULT NULL COMMENT '模块图标',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统模块配置表';

-- 初始化模块数据
INSERT INTO module_config (module_key, module_name, module_desc, icon, sort_order) VALUES
('safework', '安全作业', '安全作业票管理、JSA分析等', 'ticket', 1),
('hazard', '隐患管理', '隐患排查、整改、验收', 'warning', 2),
('equipment', '设备管理', '设备台账、点检、保养', 'device', 3),
('training', '教育培训', '培训计划、考试、证书', 'education', 4),
('emergency', '应急管理', '应急预案、演练、物资', 'first-aid', 5),
('contractor', '承包商管理', '承包商准入、评价', 'user-group', 6),
('energy', '能源管理', '能耗监测、分析', 'lightning', 7),
('environment', '环保管理', '环保监测、排污', 'tree', 8),
('sensor', '物联监测', '传感器、视频监控', 'monitor', 9),
('system', '系统管理', '用户、角色、部门、菜单', 'system', 99)
ON DUPLICATE KEY UPDATE module_name=VALUES(module_name);
