-- 气体监测记录表（支持IoT自动上报和手动录入）
-- 用于受限空间、动火作业等场景的气体检测记录

DROP TABLE IF EXISTS `gas_monitor`;
CREATE TABLE `gas_monitor` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ticket_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联作业票ID（可为NULL，IoT独立监测时）',
  `location_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '监测区域ID',
  `data_source` VARCHAR(20) NOT NULL DEFAULT 'manual' COMMENT '数据来源：iot自动上报 / manual手动录入',
  `device_id` VARCHAR(100) DEFAULT '' COMMENT 'IoT设备ID',
  `device_code` VARCHAR(100) DEFAULT '' COMMENT 'IoT设备编号',
  `check_type` VARCHAR(20) DEFAULT 'before' COMMENT '检测时机：before作业前/during作业中/after作业后',
  `oxygen_percent` DECIMAL(5,2) DEFAULT 0 COMMENT '氧气浓度%',
  `flammable_percent` DECIMAL(8,4) DEFAULT 0 COMMENT '可燃气体%LEL',
  `toxic_ppm` DECIMAL(10,2) DEFAULT 0 COMMENT '有毒气体ppm',
  `toxic_type` VARCHAR(100) DEFAULT '' COMMENT '有毒气体种类（如CO、H2S等）',
  `temperature` DECIMAL(5,2) DEFAULT NULL COMMENT '温度℃',
  `humidity` DECIMAL(5,2) DEFAULT NULL COMMENT '湿度%',
  `pressure` DECIMAL(8,2) DEFAULT NULL COMMENT '气压kPa',
  `check_result` TINYINT DEFAULT 1 COMMENT '检测结果：1合格 0不合格',
  `check_location` VARCHAR(200) DEFAULT '' COMMENT '检测地点',
  `check_time` TIMESTAMP NULL COMMENT '检测时间',
  `checker_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '检测人ID（手动录入时）',
  `checker_name` VARCHAR(50) DEFAULT '' COMMENT '检测人姓名',
  `device_photo` VARCHAR(500) DEFAULT '' COMMENT '检测仪照片URL',
  `scene_photo` VARCHAR(500) DEFAULT '' COMMENT '现场照片URL',
  `remark` VARCHAR(500) DEFAULT '' COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_ticket` (`ticket_id`),
  INDEX `idx_location` (`location_id`),
  INDEX `idx_source` (`data_source`),
  INDEX `idx_check_time` (`check_time`),
  INDEX `idx_device` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='气体监测记录表';

-- IoT设备管理表
DROP TABLE IF EXISTS `gas_devices`;
CREATE TABLE `gas_devices` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `device_code` VARCHAR(100) NOT NULL COMMENT '设备编号',
  `device_name` VARCHAR(200) DEFAULT '' COMMENT '设备名称',
  `device_type` VARCHAR(50) DEFAULT 'fixed' COMMENT '设备类型：fixed固定式/portable便携式',
  `location_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '安装位置ID',
  `api_key` VARCHAR(100) DEFAULT '' COMMENT 'API密钥（用于IoT上报认证）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0停用 1启用',
  `lel_threshold` DECIMAL(5,2) DEFAULT 50 COMMENT 'LEL报警阈值%',
  `toxic_threshold` DECIMAL(10,2) DEFAULT 10 COMMENT '有毒气体报警阈值ppm',
  `oxygen_min` DECIMAL(5,2) DEFAULT 18 COMMENT '氧气浓度下限%',
  `oxygen_max` DECIMAL(5,2) DEFAULT 23 COMMENT '氧气浓度上限%',
  `last_heartbeat` TIMESTAMP NULL COMMENT '最后心跳时间',
  `remark` VARCHAR(500) DEFAULT '' COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_code` (`device_code`),
  INDEX `idx_location` (`location_id`),
  INDEX `idx_api_key` (`api_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='IoT气体监测设备表';

-- 监测区域配置表
DROP TABLE IF EXISTS `gas_monitor_areas`;
CREATE TABLE `gas_monitor_areas` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `area_code` VARCHAR(50) NOT NULL COMMENT '区域编码',
  `area_name` VARCHAR(200) NOT NULL COMMENT '区域名称',
  `area_type` VARCHAR(50) DEFAULT '' COMMENT '区域类型：confined_space受限空间/tank储罐区/pipeline管廊等',
  `lel_threshold` DECIMAL(5,2) DEFAULT 50 COMMENT 'LEL报警阈值%',
  `toxic_threshold` DECIMAL(10,2) DEFAULT 10 COMMENT '有毒气体报警阈值ppm',
  `oxygen_min` DECIMAL(5,2) DEFAULT 18 COMMENT '氧气浓度下限%',
  `oxygen_max` DECIMAL(5,2) DEFAULT 23 COMMENT '氧气浓度上限%',
  `parent_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '父区域ID',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0停用 1启用',
  `remark` VARCHAR(500) DEFAULT '' COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_code` (`area_code`),
  INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='气体监测区域配置表';

-- 插入示例数据
INSERT INTO `gas_monitor_areas` (`area_code`, `area_name`, `area_type`, `lel_threshold`, `toxic_threshold`) VALUES
('AREA001', '1号储罐区', 'tank', 50, 10),
('AREA002', '2号储罐区', 'tank', 50, 10),
('AREA003', '反应釜A区', 'confined_space', 30, 5),
('AREA004', '管廊西区', 'pipeline', 50, 10),
('AREA005', '污水处理区', 'confined_space', 30, 20);
