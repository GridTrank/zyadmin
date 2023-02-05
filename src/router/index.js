import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


const router =  new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/User',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/usermanagement',
                    component: () => import(/* webpackChunkName: "table" */ '../components/user/index.vue'),
                    meta: { title: '后台用户管理' }
                },
                {
                    path: '/Serve2488V6',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/servehome/Serve2488V6.vue'),
                    meta: { title: '商品数据修改' }
                },
                {
                    path: '/brands',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Brands.vue'),
                    meta: { title: '品牌添加' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: '产品添加' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: '产品添加' }
                },
                {
                    path: '/order',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/order'),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/stock',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/stock'),
                    meta: { title: '库存管理' }
                },
                {
                    path: '/image',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/image'),
                    meta: { title: '图片管理' }
                },
                {
                    path: '/VIP',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/order/EditInfo.vue'),
                    meta: { title: '会员等级管理' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/register.vue'),
            meta: { title: '注册' }
        },
        {
            path: '/jian',
            component: () => import(/* webpackChunkName: "login" */ '../components/servehome/jian.vue'),
            meta: { title: '兼容性' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
router.beforeEach((to,from,next)=>{
    //to 将要访问的路径
    //form 代表从哪个路径跳转而来
    //next 是一个函数  表示放行
    //next()放行  next('/login)强制跳转

    // 如果用户访问的路径是登录页,则直接放行
    if (to.path==='/login') return next()
    // if (to.path==='/register') return next()
    //否则用户就没有访问登录页,那我们就需要先获取token
    // 通过token有木有值来判断,是否给用户进行强制跳转
    //获取token
    const tokenStr=window.localStorage.getItem('ms_token')
    //如果tokenStr不存在,就强制跳转到登录页
    if (!tokenStr) return next('/login')
    // 如果没有return出去,证明tokenStr存在,直接放行
    // $message.success('登录成功');
    next()
})
export default router