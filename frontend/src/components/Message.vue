<template>
    <!-- loop through chat message and chose user or bot -->
    <div v-for="(value, key) in chatMessages" :key="key" class="grid grid-cols-12 gap-y-2">

        <div v-if="value.type == 'user'" class="col-start-1 col-end-10 p-3 rounded-lg">
        <div class="flex flex-row items-center">
            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 flex-shrink-0">
                U
            </div>
            <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                <div>{{ value.message }}</div>
            </div>
            </div>
        </div>

        <div v-if="value.type == 'bot'"  class="col-start-3 col-end-13 p-3 rounded-lg">
            <div class="flex items-center justify-start flex-row-reverse">
                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 flex-shrink-0">
                    B
                </div>
                <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                    <div>
                        {{ value.message }}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template> 


<script>
export default {
    name: 'Message',
    props: [
        'chatMessages'
    ]
}
</script>