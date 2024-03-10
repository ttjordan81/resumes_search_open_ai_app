<template>
    <div>
      <GuestHeader />
      <main class="max-w-7xl m-auto mt-4">
        <slot></slot>
      </main>
      <footer>
        <!-- Add your guest footer here -->
      </footer>
    </div>
  </template>
  
<script>
import GuestHeader from '@/components/GuestHeader.vue';

export default {
    name: "GuestLayout",
    components: {
        GuestHeader
    },
};
</script>