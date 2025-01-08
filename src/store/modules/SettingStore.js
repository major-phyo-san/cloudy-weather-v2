export default{
    state() {
        return {
            unit_settings: {},
            language: 'en',
            theme: 'light',
        };
    },
    getters: {
        getUnitSettings(state){
            return state.unit_settings;
        }
    },
    mutations: {
        setUnitSettings(state, unit_settings){
            state.unit_settings = unit_settings;
            return true;
        },
    }
}