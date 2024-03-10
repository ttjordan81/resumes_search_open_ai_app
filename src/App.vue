<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- Main Content -->
  <RouterView />
</template>

<script>

export default {
  components: {
    RouterLink,
    RouterView,
  },
  data() {
    return {
      // ...
    }
  },
}

</script>