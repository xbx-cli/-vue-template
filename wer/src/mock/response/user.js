import Mock from 'mockjs'

const Random = Mock.Random

export const getUserInfo = options => {
    const template = {
            'str|2-4': 'lisons',
            'name|5': 'lis',
            'age|+2': 18,
            'num|4-10': 0,
            'float|4-10.2-5': 3,
            'bool|1': true,
            'bool2|1-9': true,
            'obj|2': {
                a: 'aa',
                b: 'bb',
                c: 'cc'
            },
            'obj|1-2': {
                a: 'aa',
                b: 'bb',
                c: 'cc'
            },
            'arr|2-3': [1, 2, 3],
            'arr2|2': ['a', 'b', 'c'],
            'func': () => {
                return 'this is a'
            },
            'reg': /[1-9][a-z]/,
            email: Mock.mock('@email'),
            range: Random.range(3, 10, 2),
            date: Random.date('yyyy-MM-dd'),
            time: Random.time('HH:mm'),
            datetime: Random.datetime('yyyy-MM-dd HH:mm'),
            now: Random.now('hour', 'yyyy-MM-dd HH:mm'), //返回当前时间
            img: Random.image('100x200', '#00ff00', '#fff', 'png', 'hello'),
            img_base64: Random.dataImage(),
            color: Random.color(),
            cword: Random.cword('哈颠三倒四你打算带你就撒开的', 2, 5),
            cname: Random.cname(),
            email2: Random.email('lison.com'),
            region: Random.region(), //返回一个大区
            province: Random.province(),
            city: Random.city(true),
            county: Random.county(true),
            zip: Random.zip(),
            upperFirstLetter: Random.capitalize('lison'),
            pick: Random.pick([1, 2, 3, 4, 5]),
            shuffie: Random.shuffle([1, 2, 3]), //乱序
            guid: Random.guid(),
            id: Random.id(),
            increment: Random.increment(), //生成序列号
            fruit: Random.fruit(),
            fruit2: '@fruit'
                // 'email':Random.email()
        }
        //    let i = 3
        //    let arr = []
        //    while(i--){
        //        arr.push(template)
        //    }
    return Mock.mock(template)
}

export const UserXKEnterprisePCAdminLogin = options => {
    const template = {
        code: '1000',
        data: {
            role: {
                role_name: '超级管理员'
            },
            enterpriseCode: Random.guid(),
            account: {
                'str|2-4': 'lisons',
                'name|5': 'lis',
                'age|+2': 18,
                'num|4-10': 0,
                'float|4-10.2-5': 3,
                datetime: Random.datetime('yyyy-MM-dd HH:mm'),
                now: Random.now('hour', 'yyyy-MM-dd HH:mm'), //返回当前时间
                img: Random.image('100x200', '#00ff00', '#fff', 'png', 'hello'),
                img_base64: Random.dataImage(),
                color: Random.color(),
                cword: Random.cword('哈颠三倒四你打算带你就撒开的', 2, 5),
                cname: Random.cname(),
                email2: Random.email('lison.com'),
            },

            token: Random.guid(),

        }

    }
    return Mock.mock(template)
}

// export const authorization = options => {
//     return {
//         code: 200,
//         data: {
//             token: 'xxxxxx',
//             rules: {
//                 page: {
//                     tree - select: true,
//                     account: true,
//                     commonProblems: true,
//                     contract: true,
//                     printCompleteInfo: true,
//                     businessAdmin: true,
//                     auditManage: true,
//                     manageMenber: true,
//                     register: true,
//                     agreement: true,
//                     home: true,
//                     test: true,
//                     application: true,
//                     tip: true,
//                     forget: true,
//                     authentication: true,
//                     complete: true,
//                     setPassword: true,
//                     account: true,
//                     acceptenceSettlement: true,
//                     promptPage: true,
//                     team: true,
//                     info: true,
//                     Createproject: true,
//                     signUp: true,
//                     project: true,
//                     home_index: true,
//                     about: true,
//                     argu: true,
//                     count_to: true,
//                     menu_page: true,
//                     upload: true,
//                     form: false,
//                     acceptenceSettlement: true,
//                     promptPage: true,
//                     folder_tree: true,
//                     table_page: true,
//                     params: true,
//                     component: true,
//                     render_page: true,
//                     split_pane: true,
//                     parent: true,
//                     child: true,
//                     named_view: true,
//                     store: true,
//                     main: true,
//                     icon_page: true,
//                     manage: true,
//                     addTask: true,
//                     addTaskList: true,
//                     createSuccess: true,
//                     createTask: true,
//                     teamList: true,
//                 },
//                 component: {
//                     edit_button: true,
//                     publish_button: true
//                 }
//             },
//             mes: ''
//         },

//     }
// }
