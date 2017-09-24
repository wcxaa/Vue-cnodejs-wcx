export default {
    namespaced: true,
    state: {
        userInfo: {
            loginname: '',
            avatar_url: '',
            id: '',
            token: ''
        }
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        }
    }
}