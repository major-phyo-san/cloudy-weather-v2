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
      ...mapMutations(['setOpwmKey']),
      ...mapGetters(['getOpwmKey']),
    },

    created(){      
      let storedOpwmKey = this.getOpwmKey();
      if(!storedOpwmKey || (storedOpwmKey != import.meta.env.VITE_OPWM_KEY)){        
        console.log(`setting api key`);
        this.setOpwmKey(import.meta.env.VITE_OPWM_KEY);        
      }      
    },
  }
</script>
