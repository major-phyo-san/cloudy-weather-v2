<template>
    <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">App Settings</h2>
        
        <div class="contents" v-if="unitSettings">
          <!-- Temperature Unit -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Temperature Unit</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="unitSettings.tempUnit" value="c" class="form-radio text-blue-600" />                
                <span class="ml-2">Celsius (°C)</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="unitSettings.tempUnit" value="f" class="form-radio text-blue-600" />                
                <span class="ml-2">Fahrenheit (°F)</span>
              </label>
            </div>
          </div>

          <!-- Pressure Unit -->
          <div class="mb-6">
            <label for="pressureUnit" class="block text-sm font-medium text-gray-700 mb-2">Pressure Unit</label>
            <select id="pressureUnit" v-model="unitSettings.pressureUnit" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">              
              <option value="hpa">Hectopascals (hPa)</option>
              <option value="inhg">Inches of Mercury (inHg)</option>
              <option value="mbar">Millibars (mbar)</option>
              <option value="mmhg">Milimeters of Mercury (mmHg)</option>
              <option value="psi">Pounds per square inch (PSI)</option>
            </select>
          </div>

          <!-- Visibility Range Unit -->
          <div class="mb-6">
            <label for="visibilityUnit" class="block text-sm font-medium text-gray-700 mb-2">Visibility Range Unit</label>
            <select id="visibilityUnit" v-model="unitSettings.visibilityUnit" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">              
              <option value="m">Meters (m)</option>
              <option value="ft">Feet (ft)</option>
              <option value="km">Kilometers (km)</option>
              <option value="mi">Miles (mi)</option>
            </select>
          </div>

          <!-- Wind Speed Unit -->
          <div class="mb-6">
            <label for="windSpeedUnit" class="block text-sm font-medium text-gray-700 mb-2">Wind Speed Unit</label>
            <select id="windSpeedUnit" v-model="unitSettings.windspeedUnit" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">              
              <option value="ms">Meters per second (m/s)</option>
              <option value="kmh">Kilometers per hour (km/h)</option>
              <option value="mph">Miles per hour (mph)</option>
              <option value="knots">Knots</option>
              <option value="beau">Beaufort</option>
            </select>
          </div>
        </div>        

        <!-- Language Selection -->
        <div class="mb-6">
          <label for="language" class="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select id="language" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <!-- Add more language options as needed -->
          </select>
        </div>

        <!-- Theme Toggle -->
        <div class="mb-6">
          <label for="theme" class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <div class="flex items-center">
            <span class="mr-3 text-sm">Light</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            <span class="ml-3 text-sm">Dark</span>
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8">
          <button @click="saveSettings" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'SettingsPage',
  data() {
      return{
        toast: useToast(),
        unitSettings: null,
      }
  },

  methods: {
    ...mapGetters(['getUnitSettings']),
    ...mapMutations(['setUnitSettings']),

    retrieveStoredUnitSettings(){
      this.unitSettings = this.getUnitSettings();
      console.log(this.unitSettings);
    },

    saveSettings(){
      this.setUnitSettings(this.unitSettings);
      console.log(`settings saved`);
      // this.toast.success('Settings saved', {timeout: 200});
      // setTimeout(()=>{
      //   this.$router.replace('/');
      // }, 400);
      
    },
  },
  created(){
    this.retrieveStoredUnitSettings();
  },
}
</script>