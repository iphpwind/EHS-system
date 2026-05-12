import {createWebHistory, createRouter} from 'vue-router'
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    {
        path: '/display',
        component: () => import('@/views/system/yunxingjk/display'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/register'),
        hidden: true
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/index'),
                name: 'Index',
                meta: {title: '首页', icon: 'dashboard', affix: true}
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'profile',
                component: () => import('@/views/system/user/profile/index'),
                name: 'Profile',
                meta: {title: '个人中心', icon: 'user'}
            }
        ]
    },
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole'),
                name: 'AuthRole',
                meta: {title: '分配角色', activeMenu: '/system/user'}
            }
        ]
    },
    {
        path: '/system/role-auth',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser'),
                name: 'AuthUser',
                meta: {title: '分配用户', activeMenu: '/system/role'}
            }
        ]
    },
    {
        path: '/system/dict-data',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:dictId(\\d+)',
                component: () => import('@/views/system/dict/data'),
                name: 'Data',
                meta: {title: '字典数据', activeMenu: '/system/dict'}
            }
        ]
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index',
                component: () => import('@/views/monitor/job/log'),
                name: 'JobLog',
                meta: {title: '调度日志', activeMenu: '/monitor/job'}
            }
        ]
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:tableId(\\d+)',
                component: () => import('@/views/tool/gen/editTable'),
                name: 'GenEdit',
                meta: {title: '修改生成配置', activeMenu: '/tool/gen'}
            }
        ]
    },
    {
        path: '/system/positioning',
        component: () => import('@/views/system/positioning'),
        name: 'positioning',
        meta: { hideTop: true }
    },
    {
        path: '/system/hazardsource',
        component: () => import('@/views/system/hazardsource'),
        name: 'hazardsource',
        meta: { hideTop: true }
    },{
        path: '/chanxian',
        component: () => import('@/views/chanxian/index'),
        name: 'chanxian'
    },
    {
        path: '/sensor/modalYc',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:modalCode(\\d+)',
                component: () => import('@/views/sensor/modalYc'),
                name: 'modalYc',
                meta: {title: '遥测模板', activeMenu: '/sensor/modal'}
            }
       ]
    },
    {
        path: '/sensor/modalYx',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:modalCode(\\d+)',
                component: () => import('@/views/sensor/modalYx'),
                name: 'modalYx',
                meta: {title: '遥信模板', activeMenu: '/sensor/modal'}
            }
       ]
    },
    {
        path: '/sensor/modalYk',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:modalCode(\\d+)',
                component: () => import('@/views/sensor/modalYk'),
                name: 'modalYk',
                meta: {title: '遥控模板', activeMenu: '/sensor/modal'}
            }
       ]
    },
    {
        path: '/sensor/modalYxStatus',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:modalCode(\\d+)',
                component: () => import('@/views/sensor/modalYxStatus'),
                name: 'modalYxStatus',
                meta: {title: '运行状态模板', activeMenu: '/sensor/modal'}
            }
        ]
    },
    {
        path: '/sensor/sensorYc',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:equipmentId(\\d+)',
                component: () => import('@/views/sensor/sensorYc'),
                name: 'sensorYc',
                meta: {title: '遥测点位', activeMenu: '/sensor/sensor'}
            }
       ]
    },
    {
        path: '/sensor/sensorYk',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:equipmentId(\\d+)',
                component: () => import('@/views/sensor/sensorYk'),
                name: 'sensorYk',
                meta: {title: '遥控点位', activeMenu: '/sensor/sensor'}
            }
       ]
    },
    {
        path: '/sensor/sensorYx',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:equipmentId(\\d+)',
                component: () => import('@/views/sensor/sensorYx'),
                name: 'sensorYx',
                meta: {title: '遥信点位', activeMenu: '/sensor/sensor'}
            }
       ]
    },
    {
        path: '/sensor/sensorYxStatus',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:equipmentId(\\d+)',
                component: () => import('@/views/sensor/sensorYxStatus'),
                name: 'sensorYxStatus',
                meta: {title: '运行状态', activeMenu: '/sensor/sensor'}
            }
        ]
    },
    {
        path: '/map/mapconfig',
        component: () => import('@/views/system/mapconfig'),
        name: 'mapconfig'
    },
		/*{
			path: '/unitmanage/site-plan',
			component: Layout,
			hidden: true,
			children: [
					{
							path: 'index/:siteId(\\d+)',
							component: () => import('@/views/unitmanage/site/plan'),
							name: 'Plan',
							meta: {title: '单元巡检计划', activeMenu: '/unitmanage/site'}
					}
			]
		},*/
    {
        path: '/unitmanage/site-plan',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'index/:siteId(\\d+)',
                component: () => import('@/views/unitmanage/site/plan'),
                name: 'plan',
                meta: {title: '单元巡检计划', activeMenu: '/unitmanage/site'}
            }
        ]
    },
		{
			path: '/unitmanage/site-task',
			component: Layout,
			hidden: true,
			children: [
					{
							path: 'index/:siteId(\\d+)',
							component: () => import('@/views/unitmanage/site/task'),
							name: 'siteTask',
							meta: {title: '单元巡检任务', activeMenu: '/unitmanage/site'}
					}
			]
		},
		{
			path: '/energy/diagram-peidiantu',
			component: Layout,
			hidden: true,
			children: [
					{
							path: 'index/:id(\\d+)',
							component: () => import('@/views/energy/diagram/peidiantu'),
							name: 'peidiantu',
							meta: {title: '配电图', activeMenu: '/energy/diagram'}
					}
			]
		},
        {
			path: '/industry/hxhb',
			component: Layout,
			hidden: true,
			children: [
					{
							path: 'taoci',
							component: () => import('@/views/industry/configure/hxhb/taoci'),
							name: 'taoci',
							meta: {title: '额尔古纳诚诚矿业', activeMenu: '/industry/hxhb'}
					},
                    {
                        path: 'index',
                        component: () => import('@/views/industry/configure/hxhb/index'),
                        name: 'index',
                        meta: {title: '迁安市马兰庄镇南山铁矿', activeMenu: '/industry/hxhb'}
                },
                    {
                        path: 'taoci2',
                        component: () => import('@/views/industry/configure/hxhb/taoci2'),
                        name: 'taoci2',
                        meta: {title: '灵宝市金瑞选矿设备', activeMenu: '/industry/hxhb'}
                  },
                  {
                    path: 'gxxq',
                    component: () => import('@/views/industry/configure/hxhb/gxxq'),
                    name: 'gxxq',
                    meta: {title: '广西鑫琪矿业', activeMenu: '/industry/hxhb'}
            }
			]
		},
		{
			path: '/system/yunxingjk/display',
			component: () => import('@/views/system/yunxingjk/display'),
			name: 'display'
		},
        {
            path: '/display_v2',
            component: () => import('@/views/display_v2'),
            name: 'display_v2'
        },
		{
			path: '/equipment/spotCheckMonth-detail',
			component: Layout,
			hidden: true,
			children: [
					{
							path: 'index/:id(\\d+)',
							component: () => import('@/views/equipment/spotCheck/detail'),
							name: 'Plan',
							meta: {title: '设备点检记录单', activeMenu: '/equipment/spotCheckMonth'}
					}
			]
		},
        {
            path: '/system/visitor/index',
            component: () => import('@/views/system/visitor/index.vue'),
        },
        {
            path: '/system/visitor/form',
            component: () => import('@/views/system/visitor/form.vue'),
        },

        {
            path: '/system/visitor/card',
            component: () => import('@/views/system/visitor/card.vue'),
        },
        // {
		// 	path: '/industry/hxhb/taoci2',
		// 	component: Layout,
		// 	hidden: true,
		// 	children: [

		// 	]
		// },
        // {
	// 	path: '/industry/hxhb/gxxq',
	// 	component: Layout,
	// 	hidden: true,
	// 	children: [
            
	// 	]
	// }
    ,
    {
        path: '/training',
        component: Layout,
        redirect: '/training/plan',
        name: 'Training',
        meta: { title: '培训教育', icon: 'education' },
        children: [
            { path: 'plan', component: () => import('@/views/training/PlanList.vue'), name: 'TrainingPlan', meta: { title: '培训计划' } },
            { path: 'course', component: () => import('@/views/training/CourseList.vue'), name: 'TrainingCourse', meta: { title: '课程管理' } },
            { path: 'exam/:id(\\d+)', component: () => import('@/views/training/ExamRoom.vue'), name: 'TrainingExam', meta: { title: '在线考试' }, hidden: true },
            { path: 'my', component: () => import('@/views/training/MyTraining.vue'), name: 'MyTraining', meta: { title: '我的学习' } },
            { path: 'certificate', component: () => import('@/views/training/CertificateList.vue'), name: 'TrainingCertificate', meta: { title: '证书管理' } },
            { path: 'statistics', component: () => import('@/views/training/Statistics.vue'), name: 'TrainingStatistics', meta: { title: '培训统计' } }
        ]
    },
    // 统一作业票管理（GB 30871-2022）hidden路由，通过现有菜单跳转
    {
        path: '/safework',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'apply',
                component: () => import('@/views/safework/apply/index.vue'),
                name: 'WorkTicketApply',
                meta: { title: '作业票申请' }
            },
            {
                path: 'detail',
                component: () => import('@/views/safework/WorkTicketDetail.vue'),
                name: 'WorkTicketDetail',
                meta: { title: '作业票详情' }
            },
            {
                path: 'list',
                component: () => import('@/views/safework/WorkTicketList.vue'),
                name: 'WorkTicketList',
                meta: { title: '作业票列表' }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {top: 0}
        }
    },
});

export default router;
