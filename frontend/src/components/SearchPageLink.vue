<template>
    <main class="w-3/4 m-auto mt-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-gray-700">


            <a href="/toolkits"
                class="appbackground border-[1.4px] border-app-purple rounded-full dark:border-gray-600 h-16 flex items-center justify-center hover:shadow-md gap-2">
                <span class="material-symbols-outlined">service_toolbox</span>
                <span>Toolkits</span>
            </a>
            <a href="/regional-workforce"
                class="appbackground border-[1.4px] border-app-purple rounded-full dark:border-gray-600 h-16 flex items-center justify-center hover:shadow-md gap-2">
                <span class="material-symbols-outlined">work</span>
                <span>Regional Workforce</span>
            </a>
            <a href="/provider-insights/ProviderByCounty"
                class="appbackground border-[1.4px] border-app-purple rounded-full dark:border-gray-600 h-16 flex items-center justify-center hover:shadow-md gap-2">
                <span class="material-symbols-outlined">group</span>
                <span>Provider Network</span>
            </a>
            <a href="/public-health-data-reporting"
                class="appbackground border-[1.4px] border-app-purple rounded-full dark:border-gray-600 h-16 flex items-center justify-center hover:shadow-md gap-2">
                <span class="material-symbols-outlined">lab_profile</span>
                <span>Public Health Data Reporting</span>
            </a>
        </div>

       
        <div class="w-full pt-5">
            <!-- 
            <div class="flex gap-1 pb-1">Review Datasets...
                <span v-if="selectedValue"><b>{{ selectedValue }}</b> dataset.</span>
                <svg v-show="selectedShow" @click="removeSelectedValue"
                    class="cursor-pointer w-4 h-4 mt-1 text-app-blue dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                </svg>
            </div>
            
            <div class="flex items-center">
                <div class="wrapper shadow">
                    <span class="menu-icon">
                        <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>

                    </span>
                    <div class="slide">
                        <ul>
                            <li v-for="(value, index) in values" :key="index" v-on:click="selectValue(value)">
                                {{ value }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="selectedValue === 'State/County'" class="flex items-center">
                    <div class="typing-select-item ml-3">
                        Great, tell us which county you are interested in:
                    </div>
                    <select v-model="selectedCounty" class="ml-3 rounded-md border-app-purple h-10 shadow">
                        <option disabled value="">Select a County</option>
                        <option v-for="(county, index) in counties" :key="index" :value="county">{{ county }}</option>
                    </select>
                </div>
            </div>
            -->


            <!-- Show County Select Drop down -->
            <div v-if="selectedValue === 'State/County'">
                <div v-if="selectedCounty != ''" class="mt-5 border-t-2 ">
                    <p class="mt-4">Ok, we have a dataset (18) for {{ selectedCounty }}. Which dataset should we prepare?
                    </p>
                </div>

                <!-- create a loop that show 8 boxes with gray background -->
                <div v-if="selectedCounty != ''" class="flex flex-col gap-4 mb-4 mt-4">
                    <div v-for="n in 18" :key="n"
                        class="flex border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 w-full p-4">
                        <p>Some dataset...</p>
                        <div></div>

                    </div>
                </div>
            </div>

            <!-- Show Provider Select Drop down -->
            <div v-if="selectedValue === 'Provider'">
                <div class="mt-5 border-t-2 ">
                    <!---
            <p class="mt-4">Take advantage of the AI-powered search capabilities to make your query more efficient</p>

            <label class="relative inline-flex items-center cursor-pointer mt-4">
              <input type="checkbox" v-model="enbled_ai" class="sr-only peer">
              <div
                class="w-11 h-6 mr-2 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
              </div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable AI </span>
            </label>
            -->
                </div>
                <div
                    class="flex border-2 mt-4 border-dashed justify-between border-gray-300 rounded-lg dark:border-gray-600 w-full p-4">
                    <p>
                        Medicaid Enrolled Provider Listing

                    </p>
                    <div>
                        <a href="https://health.data.ny.gov/Health/Medicaid-Enrolled-Provider-Listing/keti-qx5t/data_preview"
                            class="text-app-blue dark:text-white">Data Source</a>
                    </div>

                    <div v-if="enbled_ai">
                        <RouterLink to="/provider-ai" class="text-app-blue dark:text-white">View data</RouterLink>
                    </div>
                    <div v-else>
                        <RouterLink to="/provider" class="text-app-blue dark:text-white">View data</RouterLink>
                    </div>

                </div>
            </div>
        </div>

    </main>
</template>

<script>

import { RouterLink } from 'vue-router'

export default {
    components: {

        RouterLink
    },
    data() {
        return {
            isDropdownVisible: false,
            values: ['State/County', 'Provider', 'Public Health Data Reporting', 'News'], // Replace with your values
            counties: ['Alameda', 'Contra Costa', 'Marin', 'Napa', 'San Francisco', 'San Mateo', 'Santa Clara', 'Solano', 'Sonoma'],
            selectedShow: false,
            selectedValue: '',
            selectedCounty: '',
            enbled_ai: false,
        }
    },
    watch: {
        enbled_ai() {
            this.checkIfAIEnabled()
        }
    },
    methods: {
        selectValue(value) {
            this.selectedValue = value
            this.selectedShow = true
        },
        removeSelectedValue() {
            this.selectedValue = ''
            this.selectedShow = false
        },
        checkIfAIEnabled() {
            if (this.enbled_ai) {
                console.log('AI is enabled')
            } else {
                console.log('AI is disabled')
            }
        }
    },

}
</script>

<style scoped>
.wrapper {
    position: relative;
    overflow: hidden;
    width: 36px;
    height: 36px;
    border: 1px solid #663399;
    border-radius: 20%;
}

.wrapper:hover {
    width: 130px;
    height: 130px;
    transition: .2s;
    top: 0;
    cursor: pointer;
}

.slide {
    position: absolute;
    top: -100px;
    left: 0;
    width: 100%;
    height: 100px;
}

.wrapper:hover .slide {
    padding: 5px;
    top: 10px;
    left: 0px;
}

.menu-icon {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 5px;
    width: 35px;
    height: 35px;
    text-align: center;
}

.wrapper:hover .menu-icon {
    display: none;
}

.slide ul li {
    padding-left: 8px;
}

.slide ul li:hover {
    display: block;
    border-left: 1px solid #663399;
    padding-left: 8px;
}

.appbackground:hover {
    background-color: rgb(237, 237, 237);
}
</style>
