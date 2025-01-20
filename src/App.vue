<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  created() {
    // Retrieve the stored path from local storage
    const storedPath = localStorage.getItem('currentPath');

    if (storedPath) {
      // Navigate to the stored path
      this.$router.push(storedPath);
    }
    else{
      this.$router.push('index');
    }
  },
})
</script>
<style>
.q-header{
  max-width: 600px;
}
.q-page{
  margin:10px;
  background-color: white;
}
</style>
