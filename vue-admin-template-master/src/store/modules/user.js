import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        // 用户数据初始化
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    // user login的业务
    async login({ commit }, userInfo) {
        const { username, password } = userInfo
        let result = await login({ username: username.trim(), password: password })
        if (result.code == 20000) {
            commit('SET_TOKEN', result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    return reject('Verification failed, please Login again.')
                }

                const { name, avatar } = data

                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    async logout({ commit, state }) {
        // return new Promise((resolve, reject) => {
        //     logout(state.token).then(() => {
        //         removeToken() // must remove  token  first
        //         resetRouter()
        //         commit('RESET_STATE')
        //         resolve()
        //     }).catch(error => {
        //         reject(error)
        //     })
        // })
        let result = await logout(state.token)
            // console.log(result);
        if (result.code == 20000) {
            removeToken() //清除本地存储的token
            resetRouter()
            commit('RESET_STATE') //置空用户数据
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}