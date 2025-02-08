<template>
  <router-view />
</template>

<script>
import { defineComponent, nextTick } from 'vue';

export default defineComponent({
  name: 'App',
  created() {
    const storedPath = localStorage.getItem('currentPath');
    if (storedPath) {
      console.log(storedPath); // Confirm valid path retrieved
      nextTick(() => {
        const resolvedRoute = this.$router.resolve(storedPath);
        console.log(resolvedRoute); // Log to check if matched is correct
        if (resolvedRoute.route && resolvedRoute.route.matched.length > 0) {
          this.$router.push(storedPath);
        } else {
          this.$router.push('index');
        }
      });
    } else {
      this.$router.push('index');
    }
  }
});

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
