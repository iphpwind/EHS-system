USE safety_system;

INSERT INTO module_config (module_key, module_name, enabled, sort_order) VALUES
('training', '培训教育', 1, 3),
('emergency', '应急管理', 1, 4),
('contractor', '承包商管理', 1, 5),
('certificate', '证书管理', 1, 6),
('visitor', '访客管理', 1, 7),
('law', '法律法规', 1, 8),
('chemical', '危化品管理', 1, 9)
ON DUPLICATE KEY UPDATE enabled=1;

SELECT * FROM module_config ORDER BY sort_order;
