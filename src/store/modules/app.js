const state = {
    userName: '',
  }
  const mutations = {
    //设置用户名
    SET_USER_NAME(state, name) {
      state.userName = name
    },
  }
  const actions = {
    // 设置name
    setUserName({ commit }, name) {
      commit('SET_USER_NAME', name)
    },
  }
  export default {
    state,
    mutations,
    actions
  }
  