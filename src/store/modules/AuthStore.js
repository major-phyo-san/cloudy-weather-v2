export default {
    state() {
        return {
            user: null,
            token: null,
            opwmKey: null,            
        }
    },

    mutations: {
        setUser(state, user){
            state.user = user;
        },

        setToken(state, token){
            state.token = token;
        },

        setOpwmKey(state, token){
            state.opwmKey = token;
        }
    },

    actions: {},

    getters: {
        getUser(state){
            return state.user;
        },

        getToken(state){
            return state.token;
        },

        getOpwmKey(state){
            return state.opwmKey;
        }
    }
};
