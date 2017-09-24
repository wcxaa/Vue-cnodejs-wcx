export default {
    namespaced: true,
    state: {
        messageNotReadCount: 0
    },
    mutations: {
        setMessageNotReadCount(state, count) {
            state.messageNotReadCount = count
        }
    }
}