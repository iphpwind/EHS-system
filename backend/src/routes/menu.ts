import express from 'express';
import { getConnection } from '../config/database';

const router = express.Router();

// 获取路由菜单
router.get('/menu/getRouters', async (req: express.Request, res: express.Response) => {
  try {
    // 获取启用的模块配置
    let enabledModules: string[] = [];
    let conn;
    try {
      conn = await getConnection();
      const [rows] = await conn.execute('SELECT module_key FROM module_config WHERE enabled = 1');
      enabledModules = (rows as any[]).map(r => r.module_key);
    } catch (e) {
      console.error('Module config query error:', e);
      enabledModules = ['safework', 'system', 'equipment', 'sensor', 'hazard', 'monitor'];
    } finally {
      if (conn) conn.release();
    }

    // 返回完整菜单结构
    let menus: any[] = [
      {
        name: '首页',
        path: '/index',
        hidden: false,
        component: 'Layout',
        alwaysShow: true,
        meta: { title: '首页', icon: 'dashboard', noCache: false, link: null },
        children: [
          { name: 'HomeIndex', path: 'index', hidden: false, component: 'index', meta: { title: '首页', icon: 'chart', noCache: false, link: null } }
        ]
      },
      {
        name: 'Safework',
        path: '/safework',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '安全作业', icon: 'guide', noCache: false, link: null },
        children: [
          { name: 'SafeworkHazareport', path: 'hazareport', hidden: false, component: 'safework/hazareport/index', meta: { title: '隐患上报', icon: 'form', noCache: false, link: null } },
          { name: 'SafeworkTask', path: 'task', hidden: false, component: 'safework/task/index', meta: { title: '安全检查', icon: 'edit', noCache: false, link: null } },
          { name: 'SafeworkHazardList', path: 'hazard', hidden: false, component: 'safework/hazareport/index', meta: { title: '隐患列表', icon: 'list', noCache: false, link: null } },
          { name: 'SafeworkFirework', path: 'firework', hidden: false, component: 'safework/firework/index', meta: { title: '动火作业', icon: 'fire', noCache: false, link: null } },
          { name: 'SafeworkHighwork', path: 'highwork', hidden: false, component: 'safework/highwork/index', meta: { title: '高处作业', icon: 'top', noCache: false, link: null } },
          { name: 'SafeworkRestrictedwork', path: 'restrictedwork', hidden: false, component: 'safework/restrictedwork/index', meta: { title: '受限空间', icon: 'lock', noCache: false, link: null } },
          { name: 'SafeworkElectricwork', path: 'electricwork', hidden: false, component: 'safework/electricwork/index', meta: { title: '临时用电', icon: 'eleme', noCache: false, link: null } },
          { name: 'SafeworkBlindinfo', path: 'blindinfo', hidden: false, component: 'safework/blindinfo/index', meta: { title: '盲板抽堵', icon: 'circle-close', noCache: false, link: null } },
          { name: 'SafeworkBrokenInfo', path: 'brokenInfo', hidden: false, component: 'safework/brokenInfo/index', meta: { title: '断路作业', icon: 'warning', noCache: false, link: null } },
          { name: 'SafeworkHoistingwork', path: 'hoistingwork', hidden: false, component: 'safework/hoistingwork/index', meta: { title: '吊装作业', icon: 'upload', noCache: false, link: null } },
          { name: 'SafeworkEarth', path: 'earth', hidden: false, component: 'safework/earth/index', meta: { title: '动土作业', icon: 's-tools', noCache: false, link: null } },
          { name: 'SafeworkOperationPlan', path: 'operationPlan', hidden: false, component: 'safework/operationPlan/index', meta: { title: '作业计划', icon: 'date', noCache: false, link: null } },
          { name: 'SafeworkOperationTemplate', path: 'operationTemplate', hidden: false, component: 'safework/operationTemplate/index', meta: { title: '作业模板', icon: 'document', noCache: false, link: null } },
          { name: 'SafeworkSettings', path: 'settings', hidden: false, component: 'safework/settings/index', meta: { title: '作业设置', icon: 'setting', noCache: false, link: null } },
          { name: 'SafeworkBigscreen', path: 'bigscreen', hidden: false, component: 'safework/bigscreen/index', meta: { title: '作业大屏', icon: 'monitor', noCache: false, link: null } }
        ]
      },
      {
        name: 'Training',
        path: '/training',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '培训教育', icon: 'education', noCache: false, link: null },
        children: [
          { name: 'TrainingEducation', path: 'education', hidden: false, component: 'safework/education/index', meta: { title: '培训看板', icon: 'dashboard', noCache: false, link: null } },
          { name: 'TrainingPlan', path: 'plan', hidden: false, component: 'safework/plan/index', meta: { title: '线下培训', icon: 'date', noCache: false, link: null } },
          { name: 'TrainingOnlinePlan', path: 'onlinePlan', hidden: false, component: 'safework/onlinePlan/index', meta: { title: '线上培训计划', icon: 'video-play', noCache: false, link: null } },
          { name: 'TrainingOnlineCourse', path: 'onlineCourse', hidden: false, component: 'safework/onlineCourse/index', meta: { title: '线上课程', icon: 'film', noCache: false, link: null } },
          { name: 'TrainingPaper', path: 'paper', hidden: false, component: 'safework/paper/index', meta: { title: '试卷管理', icon: 'document-copy', noCache: false, link: null } },
          { name: 'TrainingResult', path: 'result', hidden: false, component: 'safework/result/index', meta: { title: '培训结果', icon: 'trophy', noCache: false, link: null } },
          { name: 'TrainingTestStat', path: 'testStat', hidden: false, component: 'safework/testStat/index', meta: { title: '考试统计', icon: 'data-line', noCache: false, link: null } },
          { name: 'TrainingClassHour', path: 'classHour', hidden: false, component: 'safework/classHour/index', meta: { title: '学时管理', icon: 'time', noCache: false, link: null } },
          { name: 'TrainingCategory', path: 'category', hidden: false, component: 'safework/category/index', meta: { title: '培训分类', icon: 'folder', noCache: false, link: null } },
          { name: 'TrainingGuardian', path: 'guardian', hidden: false, component: 'safework/guardian/index', meta: { title: '监护人管理', icon: 'user-solid', noCache: false, link: null } },
          { name: 'TrainingStatistics', path: 'statistics', hidden: false, component: 'training/Statistics', meta: { title: '培训统计', icon: 'data-analysis', noCache: false, link: null } }
        ]
      },
      {
        name: 'Emergency',
        path: '/emergency',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '应急管理', icon: 'first-aid-kit', noCache: false, link: null },
        children: [
          { name: 'EmergencyPlan', path: 'plan', hidden: false, component: 'safework/emergencyplan/index', meta: { title: '应急预案', icon: 'document', noCache: false, link: null } },
          { name: 'EmergencyDrill', path: 'drill', hidden: false, component: 'safework/drill/index', meta: { title: '应急演练', icon: 'alarm-clock', noCache: false, link: null } },
          { name: 'EmergencySupplies', path: 'supplies', hidden: false, component: 'safework/supplies/index', meta: { title: '应急物资', icon: 'box', noCache: false, link: null } },
          { name: 'EmergencyYingji', path: 'yingjiguanli', hidden: false, component: 'safework/yingjiguanli/index', meta: { title: '应急综合管理', icon: 'first-aid-kit', noCache: false, link: null } }
        ]
      },
      {
        name: 'Contractor',
        path: '/contractor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '承包商管理', icon: 'office-building', noCache: false, link: null },
        children: [
          { name: 'ContractorUnit', path: 'unit', hidden: false, component: 'contractorManage/contractor/index', meta: { title: '承包商单位', icon: 'office-building', noCache: false, link: null } },
          { name: 'ContractorPersonnel', path: 'personnel', hidden: false, component: 'contractorManage/personnel/index', meta: { title: '承包商人员', icon: 'user', noCache: false, link: null } },
          { name: 'ContractorCertificate', path: 'certificate', hidden: false, component: 'contractorManage/certificate/index', meta: { title: '承包商证件', icon: 'postcard', noCache: false, link: null } },
          { name: 'ContractorTypeDic', path: 'typeDic', hidden: false, component: 'contractorManage/contractorTypeDic/index', meta: { title: '承包商类型', icon: 'collection', noCache: false, link: null } }
        ]
      },
      {
        name: 'Certificate',
        path: '/certificate',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '证书管理', icon: 'postcard', noCache: false, link: null },
        children: [
          { name: 'CertificateList', path: 'list', hidden: false, component: 'certificateManage/certificate/index', meta: { title: '员工证书', icon: 'postcard', noCache: false, link: null } },
          { name: 'CertificateTypeDic', path: 'typeDic', hidden: false, component: 'certificateManage/certificateTypeDic/index', meta: { title: '证书类型', icon: 'collection-tag', noCache: false, link: null } }
        ]
      },
      {
        name: 'Visitor',
        path: '/visitor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '访客管理', icon: 'user', noCache: false, link: null },
        children: [
          { name: 'VisitorList', path: 'visitor', hidden: false, component: 'safework/visitor/index', meta: { title: '访客登记', icon: 'user', noCache: false, link: null } },
          { name: 'VisitorUser', path: 'visitorUser', hidden: false, component: 'safework/visitorUser/index', meta: { title: '访客用户', icon: 'user-solid', noCache: false, link: null } },
          { name: 'VisitReservation', path: 'visitReservation', hidden: false, component: 'safework/visitReservation/index', meta: { title: '预约管理', icon: 'calendar', noCache: false, link: null } }
        ]
      },
      {
        name: 'Law',
        path: '/law',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '法律法规', icon: 'reading', noCache: false, link: null },
        children: [
          { name: 'LawManage', path: 'lawManage', hidden: false, component: 'safework/lawManage/index', meta: { title: '法规管理', icon: 'document', noCache: false, link: null } },
          { name: 'LawType', path: 'lawType', hidden: false, component: 'safework/lawType/index', meta: { title: '法规类型', icon: 'folder-opened', noCache: false, link: null } }
        ]
      },
      {
        name: 'Chemical',
        path: '/chemical',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '危化品管理', icon: 'warning', noCache: false, link: null },
        children: [
          { name: 'Chemicals', path: 'chemicals', hidden: false, component: 'safework/chemicals/index', meta: { title: '危化品台账', icon: 'notebook', noCache: false, link: null } },
          { name: 'ChemicalFinal', path: 'finalProduction', hidden: false, component: 'safework/chemicalFinalProduction/index', meta: { title: '最终产品', icon: 'finished', noCache: false, link: null } },
          { name: 'ChemicalIntermediate', path: 'intermediateProduction', hidden: false, component: 'safework/chemicalIntermediateProduction/index', meta: { title: '中间产品', icon: 'help', noCache: false, link: null } },
          { name: 'ChemicalMaterial', path: 'productionMaterial', hidden: false, component: 'safework/chemicalProductionMaterial/index', meta: { title: '原材料', icon: 'goods', noCache: false, link: null } }
        ]
      },
      {
        name: 'System',
        path: '/system',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '系统管理', icon: 'system', noCache: false, link: null },
        children: [
          { name: 'User', path: 'user', hidden: false, component: 'system/user/index', meta: { title: '用户管理', icon: 'user', noCache: false, link: null } },
          { name: 'Role', path: 'role', hidden: false, component: 'system/role/index', meta: { title: '角色管理', icon: 'peoples', noCache: false, link: null } },
          { name: 'ModuleConfig', path: 'module', hidden: false, component: 'system/module/index', meta: { title: '模块开关', icon: 'switch', noCache: false, link: null } },
          { name: 'Config', path: 'config', hidden: false, component: 'system/config/index', meta: { title: '系统配置', icon: 'edit', noCache: false, link: null } }
        ]
      },
      {
        name: 'Equipment',
        path: '/equipment',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '设备管理', icon: 'cascader', noCache: false, link: null },
        children: [
          { name: 'EquipmentList', path: 'equipment', hidden: false, component: 'equipment/equipment/index', meta: { title: '设备列表', icon: 'list', noCache: false, link: null } },
          { name: 'SpotCheckMonth', path: 'spotCheckMonth', hidden: false, component: 'equipment/spotCheckMonth/index', meta: { title: '设备点检', icon: 'form', noCache: false, link: null } },
          { name: 'SpotCheckDay', path: 'spotCheckDay', hidden: false, component: 'equipment/spotCheck/index', meta: { title: '日常点检', icon: 'form', noCache: false, link: null } }
        ]
      },
      {
        name: 'Sensor',
        path: '/sensor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '传感器管理', icon: 'monitor', noCache: false, link: null },
        children: [
          { name: 'SensorList', path: 'sensor', hidden: false, component: 'sensor/sensor/index', meta: { title: '传感器列表', icon: 'list', noCache: false, link: null } }
        ]
      },
      {
        name: 'Hazard',
        path: '/hazard',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '隐患管理', icon: 'warning', noCache: false, link: null },
        children: [
          { name: 'HazardList', path: 'list', hidden: false, component: 'safework/hazard/index', meta: { title: '隐患列表', icon: 'list', noCache: false, link: null } }
        ]
      },
      {
        name: 'Monitor',
        path: '/monitor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '系统监控', icon: 'monitor', noCache: false, link: null },
        children: [
          { name: 'Online', path: 'online', hidden: false, component: 'monitor/online/index', meta: { title: '在线用户', icon: 'online', noCache: false, link: null } },
          { name: 'Job', path: 'job', hidden: false, component: 'monitor/job/index', meta: { title: '定时任务', icon: 'job', noCache: false, link: null } },
          { name: 'Log', path: 'log', hidden: false, component: 'monitor/log/index', meta: { title: '操作日志', icon: 'log', noCache: false, link: null } }
        ]
      }
    ];

    // 根据模块开关过滤菜单
    const modulePathMap: Record<string, string[]> = {
      'safework': ['/safework'],
      'training': ['/training'],
      'emergency': ['/emergency'],
      'contractor': ['/contractor'],
      'certificate': ['/certificate'],
      'visitor': ['/visitor'],
      'law': ['/law'],
      'chemical': ['/chemical'],
      'system': ['/system'],
      'equipment': ['/equipment'],
      'sensor': ['/sensor'],
      'hazard': ['/hazard'],
      'monitor': ['/monitor']
    };
    menus = menus.filter(menu => {
      for (const [modKey, paths] of Object.entries(modulePathMap)) {
        if (!enabledModules.includes(modKey)) {
          for (const p of paths) {
            if (menu.path && menu.path.startsWith(p)) return false;
          }
        }
      }
      return true;
    });

    res.json({
      code: 200,
      msg: 'success',
      data: menus
    });
  } catch (error) {
    console.error('GetRouters error:', error);
    res.json({
      code: 200,
      msg: 'success',
      data: []
    });
  }
});

export default router;