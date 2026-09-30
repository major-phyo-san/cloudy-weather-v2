export default {
    state() {
        return {
            current_location: {},
            opwmKey: null,           
            saved_cities: [],
            home_city: null,
            privacy_storage_consent: null,
            location_consent: 'undecided',
        };
    },
    getters: {
        getCurrentLocation(state) {
            const location = state.current_location;
            if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
                return null;
            }
            if (location.source === 'city') return location;
            const currentTime = Date.now();
            const age = currentTime - Number(location.last_updated || 0);
            const validityDuration = Number(location.validity_duration || 0);
            return age >= 0 && age <= validityDuration ? location : null;
        },
        getOpwmKey(state){
            return state.opwmKey;
        },
        getSavedCities(state) {
            return state.saved_cities || [];
        },
        getHomeCity(state) {
            return state.home_city || null;
        },
        getLocationConsent(state) {
            return state.location_consent;
        },
    },
    mutations: {
        setCurrentLocation(state, location) {
            state.current_location = location;
        },

        setOpwmKey(state, token){
            state.opwmKey = token;
        },
        saveCity(state, city) {
            if (!state.saved_cities) state.saved_cities = [];
            if (!state.saved_cities.some(saved => saved.id === city.id)) {
                state.saved_cities.push(city);
            }
        },
        setHomeCity(state, city) {
            state.home_city = city;
        },
        clearHomeCity(state) {
            state.home_city = null;
        },
        recordStorageConsent(state, decision) {
            state.privacy_storage_consent = decision;
        },
        recordLocationConsent(state, decision) {
            state.location_consent = decision;
        },
        removeSavedCity(state, cityId) {
            state.saved_cities = state.saved_cities.filter(city => city.id !== cityId);
        },
    },

    actions: {},
};
