<!-- <template>
    <div class="min-h-screen bg-gray-100">
        <nav class="bg-blue-600 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/" class="text-white text-xl font-bold">WeatherApp</router-link>
                    </div>
                    <div class="flex">
                        <a href="/" class="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            Weather
                        </a>
                        <a href="/" class="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            Profile
                        </a>
                        <a href="/" class="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            About
                        </a>
                        <router-link to="/"
                            class="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Weather</router-link>
                        <router-link to="/profile"
                            class="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</router-link>
                        <router-link to="/about"
                            class="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</router-link>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <router-view></router-view>
        </main>
    </div>
</template> -->

<template>
    <div class="min-h-screen flex flex-col">
        <header class="bg-blue-800 text-white ">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-2xl font-bold">My Weather App</h1>
                <nav class="flex space-x-4">
                    <!-- <router-link to="/" class="text-white hover:text-gray-300">Home</router-link> -->
                    <router-link to="/about" class="text-white hover:text-gray-300">Home</router-link>
                    <router-link to="/profile" class="text-white hover:text-gray-300">Profile</router-link>
                    <router-link to="/about" class="text-white hover:text-gray-300">About</router-link>
                    <!-- <router-link to="/weather" class="text-white hover:text-gray-300">Weather</router-link> -->                    
                </nav>
            </div>
        </header>
        <main class="flex-grow container mx-auto p-4">
            <router-view></router-view>
        </main>
        <footer class="bg-gray-800 text-white p-4 mt-4">
            <div class="container mx-auto text-center">
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