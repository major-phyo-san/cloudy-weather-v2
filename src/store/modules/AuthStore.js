export default {
    state() {
        return {
            user: null,
            token: null 
        }
    },

    mutations: {
        setUser(state, user){
            state.user = user;
        },

        setToken(state, token){
            state.token = token;
        }
    },

    actions: {},

    getters: {
        getUser(state){
            return state.user;
        },

        getToken(state){
            return state.token;
        }
    }
};
