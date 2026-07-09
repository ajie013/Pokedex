<script setup lang="ts">
import type { NavLink } from "@/types/Navigation";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const isSidebarOpen = ref(false);
const navLinks = ref<NavLink[]>([
  { name: "Home", path: "/", icon: "home" },
  { name: "Pokédex", path: "/pokedex", icon: "ball" },
  { name: "Favorites", path: "/favorite", icon: "heart" },
  { name: "Game Matrix", path: "/pokematch", icon: "gamepad" }
]);

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };
const closeSidebar = () => { isSidebarOpen.value = false; };
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-cyan-900/40 bg-slate-900/80 backdrop-blur-md shadow-lg">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      
      <RouterLink to="/" @click="closeSidebar" class="flex items-center gap-3 group">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:border-cyan-400 transition-all duration-300">
          <div class="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"></div>
        </div>
        <div class="leading-none">
          <h1 class="text-lg font-black tracking-wider text-white uppercase">
            Poké<span class="text-cyan-400 font-mono">Matrix</span>
          </h1>
          <p class="text-[9px] uppercase tracking-[0.25em] text-slate-400 mt-0.5">System Core</p>
        </div>
      </RouterLink>
      
      <div class="hidden items-center gap-1.5 rounded-xl border border-cyan-900/30 bg-slate-950/40 p-1.5 md:flex">
        <RouterLink v-for="link in navLinks" :key="link.name" :to="link.path" class="flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-100 border border-transparent transition-all duration-300 hover:text-white group" active-class="bg-cyan-950/60 border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-950">
          <svg v-if="link.icon === 'home'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 0 0 5.625 21H9.75v-4.875A1.125 1.125 0 0 1 10.875 15h2.25a1.125 1.125 0 0 1 1.125 1.125V21h4.125A1.125 1.125 0 0 0 19.5 19.875V9.75" /></svg>
          <svg v-if="link.icon === 'ball'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><circle cx="12" cy="12" r="2.5" fill="currentColor" /></svg>
          <svg v-if="link.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25C21 5.903 19.097 4 16.75 4c-1.657 0-3.097.948-3.75 2.333C12.347 4.948 10.907 4 9.25 4 6.903 4 5 5.903 5 8.25 5 15 13 20 13 20s8-5 8-11.75Z" /></svg>
          <svg v-if="link.icon === 'gamepad'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" stroke-linecap="round" stroke-linejoin="round" /></svg>
          {{ link.name }}
        </RouterLink>
      </div>

      <button @click="toggleSidebar" class="cursor-pointer rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-400 md:hidden">
        <svg v-if="!isSidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  </nav>

  <div v-if="isSidebarOpen" class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in" @click="closeSidebar"></div>
  
  <aside :class="['fixed right-0 top-0 z-50 flex h-full w-64 flex-col border-l border-cyan-900/40 bg-slate-950/95 p-4 backdrop-blur-lg transition-transform duration-300 md:hidden', isSidebarOpen ? 'translate-x-0' : 'translate-x-full']">
    <div class="border-b border-cyan-900/30 pb-4 pt-2 flex justify-between items-center">
      <div>
        <h2 class="text-sm font-black uppercase tracking-widest text-white">Poké<span class="text-cyan-400">Matrix</span></h2>
        <p class="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">Terminal Index</p>
      </div>
      <button @click="closeSidebar" class="text-slate-400 hover:text-red-500 cursor-pointer p-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <nav class="flex flex-1 flex-col gap-2 pt-6">
      <RouterLink v-for="link in navLinks" :key="link.name" :to="link.path" @click="closeSidebar" class="rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-100 border border-transparent transition-all" active-class="bg-cyan-950/50 border-cyan-500/30 text-cyan-400">
        {{ link.name }}
      </RouterLink>
    </nav>

    <div class="border-t border-cyan-900/30 pt-4 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
      OS_CORE // v1.0.4
    </div>
  </aside>
</template>

<style scoped>

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>