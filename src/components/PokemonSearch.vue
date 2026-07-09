<script setup lang="ts">

const searchInput = defineModel("search")
const loadingSearch = defineModel("loading", {
  default: false
})
</script>

<template>
  <div class="max-w-2xl mx-auto w-full">
      <div class="relative flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/40 p-2 backdrop-blur-sm shadow-lg focus-within:border-cyan-500/50 transition-all group duration-300">
        <div class="pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
        </div>
        <input type="text" v-model="searchInput" placeholder="ENTER POKÉMON SIGNATURE..." class="w-full bg-transparent py-2 text-sm font-medium tracking-wide text-slate-200 placeholder-slate-500 outline-none uppercase font-mono"/>
        
        <div v-if="loadingSearch" class="pr-3 animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
      </div>
    </div>
</template>