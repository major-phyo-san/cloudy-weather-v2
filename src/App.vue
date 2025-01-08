<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view/>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';

  export default{
    methods: {
      ...mapMutations(['setOpwmKey', 'setUnitSettings']),
      ...mapGetters(['getOpwmKey', 'getUnitSettings']),

      setupOpwmApiKey(){
        let storedOpwmKey = this.getOpwmKey();
        if(!storedOpwmKey || (storedOpwmKey != import.meta.env.VITE_OPWM_KEY)){        
          console.log(`setting api key`);
          this.setOpwmKey(import.meta.env.VITE_OPWM_KEY);        
        }
      },

      setupUnitSettings(){
        let storedUnitSettings = this.getUnitSettings();
        if(!storedUnitSettings || Object.keys(storedUnitSettings).length === 0){
          console.log(`no stored unit settings`);
          let unitSettings = {
            tempUnit: 'c',
            pressureUnit: 'hpa',
            visibilityUnit: 'm',
            windspeedUnit: 'ms'
          };
          this.setUnitSettings(unitSettings);
        }
      },
    },

    created(){      
      this.setupOpwmApiKey();
      this.setupUnitSettings();
    },
  }
</script>
