<template>
    <div class="home">
        <!-- Current Weather Section -->
        <div class="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
            <div class="bg-[#4E63B1] text-white p-6">
                <h1 class="text-3xl font-bold mb-2">{{ currentWeather.city }}</h1>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <!-- <CloudIcon class="w-20 h-20 mr-4" /> -->
                        <div>
                            <p class="text-6xl font-bold">{{ currentWeather.temperature }}°C</p>
                            <p class="text-2xl">{{ currentWeather.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-100 p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="(value, key) in currentWeather.details" :key="key" class="text-center">
                    <p class="text-gray-500 text-sm">{{ key }}</p>
                    <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                </div>
            </div>
            <div class="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="(value, key) in currentWeather.details" :key="key" class="text-center">
                    <p class="text-gray-500 text-sm">{{ key }}</p>
                    <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                </div>
            </div>
        </div>

        <!-- Hourly Forecast Section -->
        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
            <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
                <div class="space-y-4">
                    <div v-for="(day, index) in forecast" :key="index" class="bg-[#CADBF9] rounded-lg p-4 shadow">
                        <h3 class="font-bold text-lg text-gray-800 mb-2">{{ day.date }}</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div v-for="(hour, hourIndex) in day.hours" :key="hourIndex"
                                class="flex flex-col items-center">
                                <span class="text-gray-600 text-sm">{{ hour.time }}</span>
                                <!-- <component :is="getWeatherIcon(hour.icon)" class="w-8 h-8 my-1 text-blue-600" /> -->
                                <span class="font-medium">{{ hour.temperature }}°C</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import { ref, onMounted } from 'vue';
// import { useStore } from 'vuex';
// import { db } from '../firebaseConfig';
// import { collection, getDocs } from 'firebase/firestore';
import { mapGetters, mapMutations } from 'vuex';
import { getApiData } from '@/utilities/ajax-helpers';
import { useToast } from 'vue-toastification';

export default {
    name: 'HomePage',
    // setup(){
    //     const store = useStore();
    //     const loading = ref(true);
    //     const error = ref(null);
    // },
    data(){
        return {
            latitude: null,
            longitude: null,            
            toast: useToast(),
            currentWeather: {
                city: 'New York',
                temperature: 22,
                description: 'Partly Cloudy',
                details: {
                    'Feels Like': '23°C',
                    'Humidity': '60%',
                    'Wind': '12 km/h',
                    'Pressure': '1015 hPa',
                    'Visibility': '10 km',
                    'UV Index': '5 of 10',
                    'Dew Point': '14°C',
                    'Cloud Cover': '40%'
                }
            },

            forecast: [
            {
                date: 'Today',
                hours: [
                { time: '6 AM', temperature: 18, icon: 'sun' },
                { time: '12 PM', temperature: 22, icon: 'sun' },
                { time: '6 PM', temperature: 21, icon: 'cloud' },
                { time: '12 AM', temperature: 19, icon: 'moon' }
                ]
            },
            {
                date: 'Tomorrow',
                hours: [
                { time: '6 AM', temperature: 17, icon: 'cloud' },
                { time: '12 PM', temperature: 23, icon: 'sun' },
                { time: '6 PM', temperature: 22, icon: 'cloud' },
                { time: '12 AM', temperature: 18, icon: 'moon' }
                ]
            },
            {
                date: 'Wed',
                hours: [
                { time: '6 AM', temperature: 16, icon: 'cloud' },
                { time: '12 PM', temperature: 25, icon: 'sun' },
                { time: '6 PM', temperature: 23, icon: 'cloud' },
                { time: '12 AM', temperature: 20, icon: 'moon' }
                ]
            },
            {
                date: 'Thu',
                hours: [
                { time: '6 AM', temperature: 19, icon: 'cloud-rain' },
                { time: '12 PM', temperature: 21, icon: 'cloud-rain' },
                { time: '6 PM', temperature: 20, icon: 'cloud' },
                { time: '12 AM', temperature: 18, icon: 'cloud' }
                ]
            },
            {
                date: 'Fri',
                hours: [
                { time: '6 AM', temperature: 20, icon: 'cloud-lightning' },
                { time: '12 PM', temperature: 23, icon: 'cloud-lightning' },
                { time: '6 PM', temperature: 21, icon: 'cloud-rain' },
                { time: '12 AM', temperature: 19, icon: 'cloud' }
                ]
            }
            ]
        }
    },

    methods: {
        ...mapGetters(['getOpwmKey', 'getCurrentLocation']),
        ...mapMutations(['setCurrentLocation']),

        requestBrowserLocation() {            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.latitude = latitude;
                        this.longitude = longitude;
                        let currentLocation = {
                            latitude: latitude,
                            longitude: longitude,
                            last_updated: new Date().getTime(),
                            validity_duration: 3 * 60 * 1000
                        };
                        this.setCurrentLocation(currentLocation);
                        this.toast.info("Location granted.");
                        return currentLocation;
                    },
                    (err) => {                        
                        this.toast.error("Location permission denied.");
                        return null;
                    }
                );
            } else {                
                this.toast.error("Geolocation is not supported by this browser.");
                return null;
            }            
        },  

        async fetchWeather(latitude, longitude){            
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.getOpwmKey()}`;
            let response = await getApiData({url: url});
            if(response){
                console.log(response);
            }
        },

        fetchForecast(latitude, longitude){
            let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.getOpwmKey()}`;
        },
    },

    mounted(){
        let currentLocation = this.getCurrentLocation();
        if(!currentLocation){
            currentLocation = this.requestBrowserLocation();
        }
        console.log(currentLocation);
        
    },
}
</script>