<template>    
    <div class="min-h-screen flex flex-col bg-slate-50">
        <header class="sticky top-3 z-50 mx-auto my-3 w-[calc(100%-1.5rem)] max-w-7xl rounded-2xl border border-white/60 bg-white/55 text-slate-900 shadow-lg backdrop-blur-2xl">
            <div class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <router-link to="/" class="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900" aria-label="Cloudy Weather home">
                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-white" aria-hidden="true">☁</span>
                    Cloudy Weather
                </router-link>
                <nav class="flex flex-wrap items-center gap-x-1 gap-y-1" aria-label="Main navigation">
                    <router-link to="/" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" exact-active-class="!bg-sky-50 !text-sky-800">Home</router-link>
                    <router-link to="/cities" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" exact-active-class="!bg-sky-50 !text-sky-800">Cities</router-link>
                    <router-link to="/settings" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" exact-active-class="!bg-sky-50 !text-sky-800">Settings</router-link>
                </nav>
            </div>
        </header>
        
        <main class="flex-grow px-4 py-5 sm:px-6">
            <router-view></router-view>
        </main>

        <footer class="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500">
            <div class="mx-auto max-w-7xl">
                <p>&copy; {{ new Date().getFullYear() }} Cloudy Weather</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout'
};
</script>
