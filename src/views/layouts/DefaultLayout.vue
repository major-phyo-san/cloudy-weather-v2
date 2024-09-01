<template>    
    <div class="min-h-screen flex flex-col">        
        <header class="px-4 py-2 bg-sky-900 text-white ">
            <div class=" flex justify-between items-center">
                <h1 class="text-xl font-semibold">Cloudy Weather</h1>
                <nav class="flex space-x-4">
                    <!-- <router-link to="/" class="text-white hover:text-gray-300">Home</router-link> -->
                    <router-link to="/about" class="text-white hover:text-gray-300">Home</router-link>
                    <router-link to="/cities" class="text-white hover:text-gray-300">Cities</router-link>
                    <router-link to="/settings" class="text-white hover:text-gray-300">Settings</router-link>                    
                    <router-link to="/about" class="text-white hover:text-gray-300">About</router-link>
                    <!-- <router-link to="/weather" class="text-white hover:text-gray-300">Weather</router-link> -->                    
                </nav>
            </div>
            <div>  </div>    
        </header>
        
        <main class="flex-grow p-4 bg-[#EFE8F5]">
            <router-view></router-view>
        </main>

        <footer class="bg-blue-700 text-white text-center p-4 mt-0">
            <div class=" text-center">
                <p>&copy; 2023 My Weather App</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout'
};
</script>