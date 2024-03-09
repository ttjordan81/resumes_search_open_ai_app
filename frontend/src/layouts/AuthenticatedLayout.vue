<template>
    <div>
        <AuthenticatedHeader />
      <main>
        <slot></slot>
      </main>
      <footer>
        <!-- Add your authenticated footer here -->
      </footer>
    </div>
  </template>
  
  <script>
  import AuthenticatedHeader from '@/components/AuthenticatedHeader.vue'
  
  export default {
    name: 'AuthenticatedLayout',
    components: {
      AuthenticatedHeader
    }
  }
  </script>