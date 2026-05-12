-- 巡检计划表
CREATE TABLE IF NOT EXISTS patrol_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_no VARCHAR(50) NOT NULL COMMENT '计划编号',
  name VARCHAR(100) NOT NULL COMMENT '计划名称',
  type VARCHAR(20) DEFAULT 'daily' COMMENT '巡检类型 daily/special/night',
  frequency VARCHAR(20) DEFAULT '每日' COMMENT '频次',
  executor VARCHAR(50) COMMENT '执行人',
  points TEXT COMMENT '巡检点',
  content TEXT COMMENT '巡检内容',
  status VARCHAR(20) DEFAULT 'active' COMMENT '状态 active/inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='巡检计划表';

-- 门禁设备表
CREATE TABLE IF NOT EXISTS enclosed_devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_no VARCHAR(50) NOT NULL COMMENT '设备编号',
  name VARCHAR(100) NOT NULL COMMENT '设备名称',
  location VARCHAR(200) COMMENT '安装位置',
  device_type VARCHAR(20) DEFAULT 'face' COMMENT '设备类型 face/card/plate/barrier',
  status VARCHAR(20) DEFAULT 'online' COMMENT '状态 online/offline/fault',
  last_online TIMESTAMP NULL COMMENT '最后在线时间',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门禁设备表';

-- 监控设备表
CREATE TABLE IF NOT EXISTS iot_video_devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_no VARCHAR(50) NOT NULL COMMENT '设备编号',
  name VARCHAR(100) NOT NULL COMMENT '设备名称',
  location VARCHAR(200) COMMENT '安装位置',
  ip_address VARCHAR(50) COMMENT 'IP地址',
  channel_count INT DEFAULT 1 COMMENT '通道数',
  status VARCHAR(20) DEFAULT 'online' COMMENT '状态 online/offline/fault',
  last_online TIMESTAMP NULL COMMENT '最后在线时间',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='监控设备表';
