<template>
    <div class="w-full relative">

        <input 
            class="search-input h-16 w-full shadow appearance-none border border-app-purple py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rounded-full"
            id="search" 
            type="text" 
            placeholder="Search in Behavioral Health Data Center" 
            v-model="searchQuery"
            @keyup="typeAhead"
            @keyup.enter="search"
            autocomplete="off"
            />

            <div v-if="searchResults.length != 0" class="absolute z-10 mt-2 py-4 w-full bg-slate-100  rounded-xl shadow-lg">
                <span class="block text-center py-1 pb-2 mb-2 font-semibold border-b-2 border-dashed">BHDC Data Center Search Results</span>
                <ul :class="{ 'pl-10 pt-2 pb-2  w-4/5 m-auto' : searchResults }" >
                    <li v-for="(result, index) in searchResults.slice(0, 10)" :key="index">
                     
                     <RouterLink :to="{ name: 'detailsView', params: { id: result.item._id } }" class="text-blue-500 hover:text-blue-600">
                        {{ result.item.Facility_Name }}
                    </RouterLink>

                    </li>
                </ul>
            </div>

    </div>
</template>
    
<script>

import Fuse from 'fuse.js'
import testData from '@/xls_hanys_training_dataset_12132023.json'
import { RouterLink } from 'vue-router'

export default {
    name: 'SearchBox',
    data() {
        return {
            searchResults: [],
            searchQuery: "",
            options: {
                keys: ['Facility_Name'],
                includeScore: true,
                threshold: 0.3, // Adjust this value as needed
            },
        };
    },
    methods: {
        typeAhead() {
            // check if this.searchQuery is empty
            if (this.searchQuery.trim().length > 0) {
                this.searchResults = [];
                const fuse = new Fuse(testData.behavioralHealthWorkforceDevelopment, this.options);
                this.searchResults = fuse.search(this.searchQuery);
                console.log(this.searchResults);
            }
            else {
                this.searchResults = [];
            }
        },
        search() {
            // send results to results page
            //this.$router.push({ name: 'results', query: { q: this.searchQuery } })
            if (this.searchQuery.trim().length > 0) {
                window.location.href = '/results?q=' + encodeURIComponent(this.searchQuery);
            }
        }
    },
    components: { RouterLink }
}
</script>
<style scoped>

.search-input {
    background-image: url('@/assets/icons8-search-50.svg');
    background-color: rgb(237, 237, 237);
    /* Replace with the path to your icon */
    background-position: 20px center;
    /* Adjust as needed */
    background-repeat: no-repeat;
    background-size: 20px 20px;
    /* Adjust as needed */
    padding-left: 50px;
    /* Adjust as needed */
    color: rgb(25, 117, 182);
    cursor: pointer;
}

</style>
    