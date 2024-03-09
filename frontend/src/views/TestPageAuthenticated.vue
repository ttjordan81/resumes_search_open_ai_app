<template>
    <AuthenticatedLayout>
      <div>
        <h2>Test Page for Authenticated Users</h2>
        <p>This is a test page.</p>
      </div>
    </AuthenticatedLayout>
  </template>
  
  <script>
  import AuthenticatedLayout from './AuthenticatedLayout.vue';
  
  export default {
    name: 'TestPageAuthenticated',
    components: {
      AuthenticatedLayout,
    },
  };
  </script>