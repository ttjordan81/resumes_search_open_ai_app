<template>
  <section class="text-gray-600 body-font mt-32">

    <div class="flex flex-col items-center justify-center w-full md:w-5/12 m-auto p-5 md:p-0">
     
      <img src="@/assets/newyork.png" class="w-full md:w-3/4 mb-10">

    </div>

    <SearchPageLink />

  </section>
</template>

<script>

import { RouterLink } from 'vue-router'
import SearchPageLink from '@/components/SearchPageLink.vue'

export default {
  components: {

    RouterLink,
    SearchPageLink
  },
}
</script>

