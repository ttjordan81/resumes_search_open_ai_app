<template>
  <GuestLayout>
    <!-- Top Navigation -->
    <GuestHeader />
    <div>
      <h2>Test Page for Guests</h2>
      <p>This is another test page for guests.</p>
    </div>
  </GuestLayout>
</template>

<script>
import GuestLayout from '@/layouts/GuestLayout.vue';
import GuestHeader from '@/components/GuestHeader.vue';

export default {
  name: 'TestPageGuest',
  components: {
    GuestLayout,
    GuestHeader,
  },
};
</script>
