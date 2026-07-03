<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

interface NavLink {
  name: string
  path: string
  icon: string
}

const navLinks = ref<NavLink[]>([
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Pokedex', path: '/pokedex', icon: 'ball' },
  { name: 'Favorites', path: '/favorite', icon: 'heart' }
])

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

</script>

<template>
  <nav class="sticky top-0 z-40 w-full border-b border-tech-cyan/40 bg-tech-bg px-4 shadow-[0_4px_30px_rgba(0,0,0,0.9)] backdrop-blur-md">
    <div class="mx-auto max-w-6xl">
      <div class="flex h-16 items-center justify-between">
        
        <RouterLink to="/" @click="closeSidebar" class="flex items-center space-x-3 group">
          <div class="relative flex h-8 w-8 items-center justify-center rounded-sm border border-tech-cyan bg-transparent shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-transform group-hover:rotate-90 duration-500">
            <div class="absolute inset-0 border border-tech-cyan/20 rotate-45 scale-75"></div>
            <div class="h-2 w-2 bg-tech-cyan shadow-[0_0_8px_#22d3ee]"></div>
          </div>
          <span class="font-mono text-base font-black tracking-widest text-slate-100 uppercase">
            MON<span class="text-tech-cyan font-bold font-sans">.POKE</span>
          </span>
        </RouterLink>

        <div class="hidden md:flex items-center space-x-2 bg-tech-panel p-1 rounded-md border border-slate-800/80">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 border border-transparent text-slate-400 hover:text-tech-cyan hover:bg-tech-cyan-hover/40 hover:border-tech-cyan-border/50"
            active-class="!text-white !bg-tech-active !border-tech-cyan shadow-[0_0_15px_rgba(34,211,238,0.25)]"
          >
            <component :is="link.icon === 'home' ? 'svg-home' : link.icon === 'ball' ? 'svg-ball' : 'svg-heart'" />
            <span>{{ link.name }}</span>
          </RouterLink>
        </div>

        <button 
          @click="toggleSidebar"
          class="cursor-pointer flex md:hidden items-center justify-center p-2 rounded-md border border-tech-cyan-border/50 text-tech-cyan hover:bg-tech-cyan-hover/30 transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path v-if="!isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  </nav>

  <div>
    <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"></div>

    <aside :class="['fixed top-0 bottom-0 left-0 z-50 w-64 bg-tech-bg border-r border-tech-cyan/30 p-5 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <span class="font-mono text-xs tracking-widest text-slate-500 uppercase">NAV_MATRIX_v4.0</span>
        <button @click="closeSidebar" class="text-slate-400 hover:text-tech-cyan cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex flex-col space-y-2 grow">
        <RouterLink v-for="link in navLinks" :key="link.name":to="link.path" @click="closeSidebar"
          class="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 border border-transparent text-slate-400 hover:text-tech-cyan hover:bg-tech-cyan-hover/30"
          active-class="!text-white !bg-tech-active !border-tech-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <svg v-if="link.icon === 'home'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <svg v-if="link.icon === 'ball'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" class="text-tech-bg" />
          </svg>
          <svg v-if="link.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <span>{{ link.name }}</span>
        </RouterLink>
      </nav>
      
      <div class="border-t border-slate-800 pt-4 text-[10px] font-mono text-slate-600 space-y-1">
        <div>BATTERY: 100%</div>
        <div>SIGNAL: CONNECTED</div>
      </div>
    </aside>
  </div>
</template>