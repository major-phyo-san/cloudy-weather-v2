export default {
    state() {
        return {
            current_location: {},            
        };
    },
    getters: {
        getCurrentLocation(state) {
            const currentTime = new Date().getTime();
            if((currentTime - state.current_location.last_updated) > state.current_location.validity_duration){
                state.current_location = null;
                return null;
            }
            return state.current_location;
        }        
    },
    mutations: {
        setCurrentLocation(state, location) {
            state.current_location = location;
        }        
    },

    actions: {},
};
