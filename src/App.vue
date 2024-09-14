<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Data variables 
const launches = ref([]);

// State
const showModal = ref(false);
const selectedLaunch = ref(null);
const sortAsc = ref({
  name: true,
  date: true,
  crew: true,
  status: true
});

// Fetch data from API
const fetchLaunches = async () => {
  const response = await axios.get('https://api.spacexdata.com/v4/launches');
  launches.value = response.data;
}

onMounted(() => {
  fetchLaunches();
})

// Sort launches by field
const sortByField = (field) => {
  launches.value.sort((a, b) => {
    let fieldA, fieldB;

    if (field === 'date') {
      fieldA = new Date(a.date_utc);
      fieldB = new Date(b.date_utc);
    } else {
      fieldA = a[field];
      fieldB = b[field];
    }

    return sortAsc.value[field] ? (fieldA > fieldB ? 1 : -1) : (fieldA < fieldB ? 1 : -1);
  });
  sortAsc.value[field] = !sortAsc.value[field]; 
};

// Open and Close Modal 
const openModal = (launch) => {
  selectedLaunch.value = launch;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-white">SpaceX Rocket Launch Schedule</h1>

    <div class="flex justify-center">
      <div class="table-container bg-glass rounded-xl overflow-hidden shadow-lg">
        <table class="w-full border-none">
          <thead class="bg-glass">
            <tr>
              <th class="p-4 border-b border-r border-white border-opacity-20 cursor-pointer" @click="sortByField('name')">Rocket Name</th>
              <th class="p-4 border-b border-r border-white border-opacity-20 cursor-pointer" @click="sortByField('date')">Launch Date</th>
              <th class="p-4 border-b border-r border-white border-opacity-20">Launch Time</th>
              <th class="p-4 border-b border-r border-white border-opacity-20">Images</th>
              <th class="p-4 border-b border-r border-white border-opacity-20 cursor-pointer" @click="sortByField('crew')">Crew</th>
              <th class="p-4 border-b border-white border-opacity-20 cursor-pointer" @click="sortByField('success')">Rocket Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="launch in launches" :key="launch.id" class="hover:bg-gray-50 cursor-pointer" @click="openModal(launch)">
              <td class="p-4 border border-white border-opacity-20">{{ launch.name }}</td>
              <td class="p-4 border border-white border-opacity-20">{{ new Date(launch.date_utc).toLocaleDateString() }}</td>
              <td class="p-4 border border-white border-opacity-20">{{ new Date(launch.date_utc).toLocaleTimeString() }}</td>
              <td class="p-4 border border-white border-opacity-20">
                <img :src="launch.links.patch.small" alt="Rocket Image" class="w-16 h-16 rounded-lg object-cover"/> 
              </td>
              <td class="p-4 border border-white border-opacity-20">{{ launch.crew.length }}</td>
              <td class="p-4 border border-white border-opacity-20">
                <span v-if="launch.success" class="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded">Success</span>
                <span v-else class="bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded">Failure</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 min-h-screen bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div class="bg-white opacity-90 w-full max-w-2xl p-8 rounded-lg shadow-lg relative">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <h2 class="text-2xl font-bold mb-4">{{ selectedLaunch?.name }}</h2>
      <p class="text-gray-700 mb-2"><strong>Date:</strong> {{ new Date(selectedLaunch?.date_utc).toLocaleString() }}</p>
      <p class="text-gray-700 mb-2"><strong>Details:</strong> {{ selectedLaunch?.details || 'No details available' }}</p>
      <p class="text-gray-700 mb-2"><strong>Rocket:</strong> {{ selectedLaunch?.rocket }}</p>
      <p class="text-gray-700 mb-2"><strong>Launchpad:</strong> {{ selectedLaunch?.launchpad }}</p>
      <p class="text-gray-700 mb-2"><strong>Crew ID:</strong>
        <ol v-if="selectedLaunch?.crew.length" class="list-decimal pl-5 text-gray-700">
          <li v-for="crewId in selectedLaunch.crew" :key="crewId">{{ crewId }}</li>
        </ol>
        <span v-else> No Data about Crew</span>
      </p>
      
      <div class="flex justify-end mt-6">
        <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(10px); 
}

.table-container {
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(10px); 
  border-radius: 1rem; 
  overflow: hidden;
}

.bg-glass {
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(10px);
}

th {
  background: rgba(255, 255, 255, 0.2); 
}

tr:hover {
  background: rgba(255, 255, 255, 0.2); 
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); 
}


</style>

