<template>
  <router-view />
  <PrivacyConsent />
</template>

<script>
import PrivacyConsent from '@/shared/components/PrivacyConsent.vue';

export default {
  name: 'App',
  components: { PrivacyConsent },
};
</script>
