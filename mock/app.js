const Koa = require('koa');
const app = new Koa();
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    await next();
});

const mockProjects = {
    total: 200,
    list: [
        {
            id: 1,
            name: 'Project1',
            description: 'description',
        },
        {
            id: 2,
            name: 'Project2',
            description: 'description',
        },

    ]
}

app.use(async (ctx, next) => {
    const url = ctx.url;
    switch (url) {
        case '/api/login':
            ctx.body = {
                token: '123abcdefg',
                username: '石晓波',
                role: 'admin',
            };
            break;
        case '/api/current/user':
            ctx.body = {
                username: '石晓波',
                role: 'admin',
            }
            break;
        case '/api/current/menu':
            ctx.body = [
                {
                    path: '/home',
                    name: '主页',
                    icon: 'home',
                },
                {
                    path: '/model',
                    name: '模型',
                    icon: 'model',
                },
                {
                    path: '/data',
                    name: '数据',
                    icon: 'data',
                },
                {
                    path: '/arithmetic',
                    name: '算法',
                    icon: 'arithmetic',
                },
                {
                    path: '/sample',
                    name: '案例',
                    icon: 'sample',
                },
                // {
                //     path: '/project',
                //     name: 'Project',
                //     icon: 'smile',
                //     locale: 'menu.project',
                //     children: [
                //         {
                //             path: '/project/list',
                //             name: 'Project List',
                //             locale: 'menu.project.list',
                //             icon: 'smile',
                //         },
                //     ],
                // },
                // {
                //     path: '/permission',
                //     name: 'permission',
                //     locale: 'menu.permission',
                //     icon: 'smile',
                //     children: [
                //         {
                //             path: '/permission/list',
                //             name: 'permission list',
                //             locale: 'menu.permission.list',
                //             icon: 'smile',
                //         },
                //     ],
                // },
                // {
                //     path: '/404',
                //     name: '404',
                //     locale: 'menu.notfound',
                //     icon: 'frown',
                // }

            ]

            break;
        case '/api/current/notice':
            break;
        case '/api/projects?offset=0&limit=10':
            ctx.body = mockProjects;
            if (ctx.method === 'get') {

            } else {

            }
            break;
        case '/api/home/list':
            ctx.body = [
                {
                    title: "建模工具集",
                    href: '/model',
                    count: 4,
                    content: [
                        {
                            imgUrl: '',
                            title: '装备保障',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧城市',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧园区',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧交通',
                            id: '1'
                        },
                    ],
                },
                {
                    title: "核心数据集",
                    href: '/data',
                    count: 10,
                    content: [
                        {
                            imgUrl: '',
                            title: '智慧城市数据集',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧园区数据集',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: 'AI城市挑战赛',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '全球空气质量数据',
                            id: '1'
                        },
                    ],
                },
                {
                    title: "代表算法集",
                    count: 18,
                    href: '/arithmetic',
                    content: [
                        {
                            imgUrl: '',
                            title: '分类算法',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '聚类算法',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '异常算法',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '异常检测算法',
                            id: '1'
                        },
                    ],
                },
                {
                    title: "典型案例",
                    count: 6,
                    href: '/sample',
                    content: [
                        {
                            imgUrl: '',
                            title: '装备保障案例',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧城市案例',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧园区案例',
                            id: '1'
                        },
                        {
                            imgUrl: '',
                            title: '智慧交通案例',
                            id: '1'
                        },
                    ],
                },
            ];
            break;
        case '/api/data/list':
            ctx.body = {
                type: 'success',
                total: 200,
                data: [
                    {
                        id: 1,
                        imgUrl: 'https://scpic.chinaz.net/files/pic/pic9/202108/hpic4371.jpg',
                        name: '嘉兴园区案例数据集',
                        type: '类型1',
                        number: 10,
                        collectionTime: '2021-07-15  15:15',
                    }
                ]
            }
            break;
        case '/api/data/detail':
            ctx.body = {
                type: 'success',
                data: {
                    id: '111111',
                    name: '嘉兴园区案例数据集',
                    imgUrl: '',
                    DataList:[
                        {
                            id: '11234556',
                            summary: '危险品储罐监测传感器的基本信息：传感器编号、储藏危险品种、安装位置、泄漏报警阈值等',
                            summaryImg: '',
                            detailImg: '',
                            detail: '(1) 危险品储罐监测传感器的基本信息：传感器编号、储藏危险品种、安装位置、泄漏报警阈值等<br/>(2) 危险品储罐监测传感器的实测数据：传感器编号、实测值、采样时间等，采样周期为1分钟。'
                        }
                    ]
                }
            }
            break;
        default:
            // await new Promise((resolve) => {setTimeout(() => {resolve()}, 5000)})
            ctx.response.status = 404;
            ctx.body = {
                type: 'error'
            };

            break;
    }
    next();
})

app.listen(3333)