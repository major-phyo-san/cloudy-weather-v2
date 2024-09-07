<template>
    <div class="home">
        <!-- Loading and Error States -->
        <div v-if="currentWeatherLoading" class="text-center text-gray-500">
            Loading current weather...
        </div>
        <div v-else-if="currentWeatherError" class="text-center text-red-500">
            {{ currentWeatherError }}
        </div>
        <!-- Current Weather Section -->
        <div v-if="currentWeather" class="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
            <div class="bg-[#4E63B1] text-white p-4 sm:p-6">
                <h1 class="text-2xl sm:text-3xl font-bold mb-2">{{ currentWeather.city }}</h1>
                <div class="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
                    <div class="flex items-center mb-4 sm:mb-0">                        
                        <img :src="`/img/weather-icons/${currentWeather.main_icon}`" with=80 height=80
                            class="w-16 h-16 sm:w-20 sm:h-20 mr-4" />
                        <!-- <img :src="`/img/weather-icons/rain/scattered-showers-night.svg`" with=80 height=80
                            class="w-16 h-16 sm:w-20 sm:h-20 mr-4" /> -->
                        <div>
                            <p class="text-5xl sm:text-6xl font-bold"> {{ currentWeather.temperature }} </p>
                            <p class="text-xl sm:text-2xl mt-2 flex flex-col sm:flex-row sm:items-center">
                                {{ currentWeather.main }}
                                <span
                                    class="mt-2 sm:mt-0 sm:ml-4 p-1 shadow-md rounded bg-[#2B4170] text-sm sm:text-lg inline-block">
                                    <span class="text-md">{{ currentWeather.temp_min }}</span>
                                    <span class="mx-1">/</span>
                                    <span class="text-md">{{ currentWeather.temp_max }}</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- start weather details -->
            <!-- <div class="bg-gray-100 p-6">                
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div class="max-w-4xl mx-auto">
                        <h3 class="text-lg font-semibold mb-2">Atmosphere</h3>
                        <div class="flex flex-wrap">
                            <div v-for="(value, key) in currentWeather.details.atmosphere" :key="key" class="w-1/2 p-2">
                                <p class="text-gray-500 text-sm">{{ key }}</p>
                                <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                            </div>
                        </div>
                        
                    </div>
                </div>                
            </div> -->

            <div class="bg-gray-100 p-6">
                <div class="max-w-4xl mx-auto">
                    <!-- <h3 class="text-lg font-semibold mb-4">Description</h3> -->
                    <div class="grid grid-cols-3 gap-4 rtl">
                        <div class="bg-white p-4 rounded-lg shadow col-span-3">

                            <p class="text-xl font-bold text-gray-800"> {{ currentWeather.description }} </p>
                            <p class="text-gray-500 text-sm font-semibold"> Feels Like {{ currentWeather.feels_like }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-lg font-semibold mb-4">Atmosphere</h3>
                    <div class="grid grid-cols-3 gap-4 rtl">
                        <div v-for="(value, key) in currentWeather.details.atmosphere" :key="key"
                            class="bg-white p-4 rounded-lg shadow">
                            <img v-if="key == 'Real Feel'" :src="`/img/weather-icons/${currentWeather.feels_like_icon}`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Humidity'" :src="`/img/weather-icons/measurements/humidity.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Dew Point'" :src="`/img/weather-icons/measurements/dewpoint.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Cloud Cover'" :src="`/img/weather-icons/cloudy/overcast-clouds-2.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Pressure' || key == 'Pressure (Sea level)'" :src="`/img/weather-icons/measurements/atm-pressure.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <p class="text-gray-500 text-sm">{{ key }}</p>
                            <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-lg font-semibold mb-4">Environment</h3>
                    <div class="grid grid-cols-3 gap-4 rtl">
                        <div v-for="(value, key) in currentWeather.details.environment" :key="key"
                            class="bg-white p-4 rounded-lg shadow">
                            <img v-if="key == 'Visibility'" :src="`/img/weather-icons/measurements/eye-slash.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Air Quality Index'" :src="`/img/weather-icons/measurements/smog.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'UV Index'" :src="`/img/weather-icons/measurements/sun.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <p class="text-gray-500 text-sm">{{ key }}</p>
                            <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-lg font-semibold mb-4">Wind</h3>
                    <div class="grid grid-cols-3 gap-4 rtl">
                        <div v-for="(value, key) in currentWeather.details.wind" :key="key"
                            class="bg-white p-4 rounded-lg shadow">
                            <img v-if="key == 'Speed'" :src="`/img/weather-icons/measurements/wind-turbine.svg`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Gust'" :src="`/img/weather-icons/${currentWeather.wind_gust_icon}`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <img v-else-if="key == 'Direction'" :src="`/img/weather-icons/${currentWeather.wind_direction_icon}`" width="12" height="12" class="w-8 h-8 sm:w-20 sm:h-20 mr-4" />
                            <p class="text-gray-500 text-sm">{{ key }}</p>
                            <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6" v-if="currentWeather.details.rain">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-lg font-semibold mb-4">Rain Precipitation Volume</h3>
                    <div class="grid grid-cols-2 gap-4 rtl">
                        <div v-for="(value, key) in currentWeather.details.rain" :key="key"
                            class="bg-white p-4 rounded-lg shadow">
                            <img :src="`/img/weather-icons/measurements/drizzle.svg`" class="w-4 h-4 inline mr-1" />
                            <p class="text-gray-500 text-sm">{{ key }}</p>
                            <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6" v-if="currentWeather.details.snow">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-lg font-semibold mb-4">Snow Precipitation Volume</h3>
                    <div class="grid grid-cols-2 gap-4 rtl">
                        <div v-for="(value, key) in currentWeather.details.snow" :key="key"
                            class="bg-white p-4 rounded-lg shadow">
                            <img :src="`/img/weather-icons/measurements/flurries.svg`" class="w-4 h-4 inline mr-1" />
                            <p class="text-gray-500 text-sm">{{ key }}</p>
                            <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6">
                <div class="max-w-4xl mx-auto">
                    <div class="grid grid-cols-3 gap-4 rtl">
                        <div class="bg-white p-4 rounded-lg shadow col-span-3">
                            <p class="text-gray-500 text-sm"> Weather info last updated on </p>
                            <p class="text-xl font-semibold text-gray-800"> {{ currentWeather.updated_on }} </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <p> Rain </p>
                <div v-for="(value, key) in currentWeather.details" :key="key" class="text-center">
                    <p class="text-gray-500 text-sm">{{ key }}</p>
                    <p class="text-xl font-semibold text-gray-800">{{ value }}</p>
                </div>
            </div> -->

            <!-- end weather details -->
        </div>

        <!-- Loading and Error States -->
        <div v-if="forecastLoading" class="text-center text-gray-500">
            Loading forecast...
        </div>
        <div v-else-if="forecastError" class="text-center text-red-500">
            {{ forecastError }}
        </div>

        <!-- Hourly Forecast Section -->
        <!-- <div class="shadow-xl rounded-lg overflow-hidden bg-[#CADBF9]">
            <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
                <div class="space-y-4">
                    <div v-for="(day, index) in fiveDayForecast" :key="index" class="bg-white rounded-lg p-4 shadow">
                        <h3 class="font-bold text-lg text-gray-800 mb-2">{{ day.date }}</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div v-for="(forecast, forecastIndex) in day.forecasts" :key="forecastIndex"
                                class="bg-red-100 flex flex-col items-center ">
                                <span class="text-gray-600 text-sm">{{ forecast.time }}</span>
                                <component :is="getWeatherIcon(hour.icon)" class="w-8 h-8 my-1 text-blue-600" />
                                <img src="/img/weather-icons/clear/clear-night.svg"
                                    class="w-8 h-8 my-1 text-blue-600" />
                                <span class="font-medium">{{ forecast.main.temp }}°C</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
            <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
                <div class="space-y-6">
                    <div v-for="(day, index) in fiveDayForecast" :key="index" class="bg-gray-50 rounded-lg p-4 shadow">
                        <h3 class="font-bold text-xl text-gray-800 mb-4">{{ day.date }}</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div v-for="(hour, hourIndex) in day.forecasts" :key="hourIndex"
                                class="bg-white rounded-lg p-4 shadow-sm">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-600 font-medium">{{ hour.time }}</span>
                                    <img :src="`/img/weather-icons/${hour.main_icon}`" class="w-8 h-8 my-1 text-blue-600" />
                                    <!-- <component :is="getWeatherIcon(hour.icon)" class="w-8 h-8 text-blue-600" /> -->
                                </div>
                                <div class="flex justify-between items-center mb-2 font-semibold"> {{ hour.main_text }} </div>
                                <p class="text-2xl font-bold text-gray-800 mb-2">
                                    {{ hour.temperature }}
                                    <span class="text-sm font-light"> {{ hour.description }} </span>
                                </p>
                                <div class="space-y-1 text-sm">                                    
                                    <p class="text-gray-600" v-for="(value, key) in hour.details" :key="key">
                                        <img v-if="key == 'Wind Speed'" :src="`/img/weather-icons/${hour.wind_direction_icon}`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Rain (3Hr vol)' || key == 'Rain (1Hr vol)'" :src="`/img/weather-icons/measurements/drizzle.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Snow (3Hr vol)' || key == 'Snow (1Hr vol)'" :src="`/img/weather-icons/measurements/flurries.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Gust'" :src="`/img/weather-icons/${hour.wind_gust_icon}`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Feels Like'" :src="`/img/weather-icons/${hour.feels_like_icon}`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Dew Point'" :src="`/img/weather-icons/measurements/dewpoint.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Humidity'" :src="`/img/weather-icons/measurements/humidity.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Visibility'" :src="`/img/weather-icons/measurements/eye-slash.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Cloud Cover'" :src="`/img/weather-icons/cloudy/overcast-clouds-1.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Pressure' || key == 'Pressure (Sea level)'" :src="`/img/weather-icons/measurements/atm-pressure.svg`" class="w-4 h-4 inline mr-1" />
                                        <img v-else-if="key == 'Chance of Rain'" :src="`/img/weather-icons/${hour.chance_of_rain_icon}`" class="w-4 h-4 inline mr-1" />
                                        <!-- <img v-else :src="`/img/weather-icons/measurements/wind-night.svg`" class="w-4 h-4 inline mr-1" /> -->
                                        {{ key }} : {{ value }}
                                    </p>       
                                </div>
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
import { calculateDewpoint } from '@/utilities/data-calculation-helpers';
import { getCurrentDateTime, convertToFriendlyDateTime } from '@/utilities/datetime-helpers';
import { makeFormattedCurrentWeatherData, makeFormattedWeatherForecastData } from '@/utilities/data-format-helpers';
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
            toast: useToast(),
            loading: true,
            currentWeatherLoading: true,
            currentWeatherError: null,
            error: null,
            currentWeather: null,

            fiveDayForecast: [],
            forecastLoading: true,
            forecastError: null,
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
                        let currentLocation = {
                            latitude: latitude,
                            longitude: longitude,
                            last_updated: new Date().getTime(),
                            validity_duration: 3 * 60 * 1000
                        };
                        this.setCurrentLocation(currentLocation);
                        this.toast.info("Location granted.");
                        this.fetchWeather(currentLocation.latitude, currentLocation.longitude);
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
            try{
                let currentWeatherResposeData = null;
                let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.getOpwmKey()}`;
                let response = await getApiData({url: url});
                if(response.success){
                    currentWeatherResposeData = response.data;
                }

                let uviResponseData = null;
                url = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${this.getOpwmKey()}`;
                let uviResponse = await getApiData({url: url});
                if(uviResponse.success){                        
                    uviResponseData = uviResponse.data;                       
                }

                let aqiResponseData = null;
                url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${this.getOpwmKey()}`;
                let aqiResponse = await getApiData({url: url});
                if(aqiResponse.success){
                    aqiResponseData = aqiResponse.data;
                }

                let forecastResponseData = null;
                url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.getOpwmKey()}`;
                let forecastResponse = await getApiData({url: url});
                if(forecastResponse.success){
                    forecastResponseData = forecastResponse.data;
                    this.forecast = await makeFormattedWeatherForecastData(forecastResponseData);
                    // console.log(forecastResponseData);
                }

                if(currentWeatherResposeData && uviResponseData && aqiResponseData && forecastResponseData){
                    this.currentWeather = await makeFormattedCurrentWeatherData(currentWeatherResposeData, uviResponseData, aqiResponseData, null);
                    this.fiveDayForecast = await makeFormattedWeatherForecastData(forecastResponseData, null);
                    this.forecast.forEach((forecastByDate)=>{
                        // console.log(forecastByDate);
                    });
                }else{
                    // throw (new Excepton)
                    console.log(`error no data`);
                }                
            }catch(error){
                this.currentWeatherError = "Failed to fetch weather data.";
                this.toast.error("Failed to fetch weather data.");

                this.forecastError = "Failed to fetch forecast data.";
                this.toast.error("Failed to fetch forecast data.");
            }finally{
                this.currentWeatherLoading = false;
                this.forecastLoading = false;
            }
        },
    },

    mounted(){
        // this.fetchWeather(51.509865, -0.118092);
        //9.02497 38.74689
        // this.fetchWeather(9.02497, 38.74689);
        let currentLocation = this.getCurrentLocation();
        if(!currentLocation){
            currentLocation = this.requestBrowserLocation();
        }
        if(currentLocation && (currentLocation.latitude && currentLocation.latitude)){
            this.fetchWeather(currentLocation.latitude, currentLocation.longitude);
        }               
    },
}
</script>