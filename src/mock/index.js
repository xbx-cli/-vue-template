import Mock from 'mockjs'

import {
    UserXKEnterprisePCAdminLogin,
    getUserInfo,
    authorization
} from './response/user'

// const Random = Mock.Random

Mock.mock(/\login/, 'post', UserXKEnterprisePCAdminLogin)
Mock.mock(/\getUserInfo/, 'post', getUserInfo)


// Mock.setup({
//     timeout: 0
// })

// Random
//     .extend({
//         fruit() {
//             const fruit = ['apple', 'banana']
//             return this.pick(fruit)
//         }
//     })


export default Mock
