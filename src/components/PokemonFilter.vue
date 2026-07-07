<script setup lang="ts">
import { POKEMONTYPES } from '@/constants/Pokemon';
import { ref } from 'vue';

const emit = defineEmits<{
  filter:[pokemonType: string]
}>()

const selectedTypeFilter = ref("")

const onFilter = () =>{
  emit("filter", selectedTypeFilter.value)
}

</script>
<template>
   <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-900/20 p-4 backdrop-blur-sm">
      <div class="flex items-center gap-2">
        <span 
          class="h-2 w-2 rounded-full transition-all duration-300"
          :class="selectedTypeFilter ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]' : 'bg-slate-600'"
        ></span>
        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
          Elemental Sort Matrix
        </label>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative w-full sm:w-48">

          <select v-model="selectedTypeFilter" @change="onFilter" class="w-full appearance-none cursor-pointer rounded-lg border border-cyan-900/50 bg-slate-950/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 shadow-inner outline-none transition-all duration-300 focus:border-cyan-400 pr-10 focus:shadow-[0_0_12px_rgba(34,211,238,0.15)]">
            <option value="">All Elements</option>
            <option v-for="type in POKEMONTYPES" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
         
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-3.5 w-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        <button v-if="selectedTypeFilter" @click="selectedTypeFilter = ''; onFilter()" class="cursor-pointer rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 transition-all duration-300 hover:bg-rose-500 hover:text-slate-950 hover:shadow-md hover:shadow-rose-500/20" title="Clear active matrix filter">
          Clear
        </button>
      </div>
    </div>
</template>