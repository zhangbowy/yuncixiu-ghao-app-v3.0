import { login, logout, getInfo, checkLogin, loginDev } from '@/api/user'
import { setStatus, removeStatus } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    name: '',
    avatar: '',
    userInfo: {},
    isLogin: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_LOGIN_STATUS: (state, status) => {
    state.isLogin = status
  }
}

const actions = {
  // Wechat login
  login({ commit }) {
    return new Promise((resolve, reject) => {
      login().then(response => {
        window.location.href = response.data
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // General browser debugging login
  loginDev({ commit }) {
    return new Promise((resolve, reject) => {
      loginDev().then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          location.reload()
          reject('验证失败，请重新登录！')
        }
        const { nickname, headimgurl } = data
        commit('SET_NAME', nickname)
        commit('SET_AVATAR', headimgurl)
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        resetRouter()
        removeStatus()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // check login
  checkLogin({ commit, state }) {
    return new Promise((resolve, reject) => {
      checkLogin().then((response) => {
        if (response.code === 402) {
          resolve(false)
        } else {
          setStatus(true)
          commit('SET_LOGIN_STATUS', true)
          resolve(true)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_LOGIN_STATUS', '')
      removeStatus()
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

