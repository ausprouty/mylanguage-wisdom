<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'App',
  onMounted() {
    const currentPath = window.location.pathname;  // Get the real URL directly
    const storedPath = localStorage.getItem('currentPath');

    // Check if the user manually entered a URL
    if (currentPath && currentPath !== '/' && currentPath !== '/index') {
      console.log('Manual URL entered:', currentPath);
      localStorage.setItem('currentPath', currentPath);  // Update stored path to latest
      return;  // Do nothing further, since the user specified a route manually
    }

    // Otherwise, check stored path and validate it
    if (storedPath) {
      const resolvedRoute = this.$router.resolve(storedPath);
      if (resolvedRoute.route && resolvedRoute.route.matched.length > 0) {
        this.$router.push(storedPath);
      } else {
        this.$router.push('/index');  // Invalid stored path, default to /index
      }
    } else {
      this.$router.push('/index');  // No stored path, default to /index
    }
  }
});
</script>

<style>
.q-header {
  max-width: 600px;
}
.q-page {
  margin: 10px;
  background-color: white;
}
</style>
