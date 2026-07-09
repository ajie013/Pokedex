<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";
import PokemonCard from "@/components/PokemonCard.vue";
import { usePokemonStore } from "@/stores/usePokemonStore";
import Header from "@/components/Header.vue";
import PokemonFilter from "@/components/PokemonFilter.vue";
import type { Pokemon } from "@/types/Pokemon";

const store = usePokemonStore();
const currentOffset = ref(0);
const LIMIT = 20;
const loadingSearch = ref(false); 
const searchInput = ref(""); 
const selectedFilter = ref("");
let searchTimeout: ReturnType<typeof setTimeout>;

// 1. Fast-tracked search pipeline utilizing the verified index
const searchPokemonOnDemand = async () => {
  const inputValue = searchInput.value.trim().toLowerCase();
  if (!inputValue) return;

  loadingSearch.value = true; 
  try {
    const matchedIndexItems: Pokemon[] = store.searchIndex.filter((item) => 
      item.name.toLowerCase().includes(inputValue)
    );

    await Promise.all(matchedIndexItems.map(store.getOrFetchPokemon));
  } catch (err) {
    console.error("Failed to fetch searched pokemon details:", err);
  } finally {
    loadingSearch.value = false;
  }
};

// Debounce local inputs
watch(searchInput, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (searchInput.value.trim()) {
      await searchPokemonOnDemand();
    }
    currentOffset.value = 0; 
  }, 300);
});

watch(selectedFilter, () => {
  currentOffset.value = 0;
});

// 2. Compute reactive local lists based on background updates
const filteredPokemonList = computed(() => {
  const query = searchInput.value.trim().toLowerCase();
  const filterType = selectedFilter.value.trim().toLowerCase();

  let filtered = [...store.pokemonList];

  if (query) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
  }
  
  if (filterType) {
    filtered = filtered.filter(p => p.types.some(t => t.type.name.toLowerCase() === filterType));
  }

  return filtered;
});

// 3. Build presentation window
const displayedPokemonList = computed(() => {
  if (searchInput.value.trim() || selectedFilter.value) {
    return filteredPokemonList.value;
  }
  return filteredPokemonList.value.slice(currentOffset.value, currentOffset.value + LIMIT);
});

// Pagination Nav Actions
const nextPage = () => { currentOffset.value += LIMIT; };
const prevPage = () => { if (currentOffset.value >= LIMIT) currentOffset.value -= LIMIT; };

const hasNextPage = computed(() => {
  const totalCount = store.searchIndex.length || 1300;
  return currentOffset.value + LIMIT < totalCount;
});

onUnmounted(() => {
  clearTimeout(searchTimeout);
});
</script>

<template>
  <section class="space-y-8">

    <Header sub="Pokémon Database" title-first="Poké" title-second="Dex" content="Browse Pokémon with official artwork, typing vectors, and indexed memory matrices. Clean, responsive, and fully powered by PokéAPI.">
      <div class="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-2.5 backdrop-blur-sm shadow-inner self-start lg:self-center">
        <button @click="prevPage" :disabled="currentOffset === 0" 
          class="cursor-pointer rounded-lg border border-cyan-900/50 bg-slate-800/80 px-4 py-1.5 text-xs font-bold uppercase text-slate-300 transition-all hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30">
          ← Prev
        </button>

        <div class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-black font-mono tracking-widest text-cyan-400 uppercase">
          IDX {{ Math.floor(currentOffset / LIMIT) + 1 }}
        </div>

        <button @click="nextPage" :disabled="!hasNextPage" class="cursor-pointer rounded-lg bg-cyan-400 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-300 hover:shadow-md hover:shadow-cyan-400/30">
          Next →
        </button>
      </div>
    </Header>

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
    
    <PokemonFilter v-model="selectedFilter"/>

    <div v-if="!store.isIndexLoaded && store.pokemonList.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 py-24 text-center backdrop-blur-md">
      <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
      <p class="text-xs font-bold uppercase tracking-widest text-cyan-400 animate-pulse">Syncing Database Matrix Indices...</p>
    </div>

    <div v-else-if="displayedPokemonList.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 p-16 text-center backdrop-blur-md animate-fade-in">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 class="text-xs font-bold uppercase tracking-widest text-slate-300">No Signatures Identified</h3>
      <p class="text-[11px] text-slate-500 uppercase mt-1">No matches found for "{{ searchInput }}" within selected filters.</p>
    </div>

    <div v-else class="grid grid-cols-2 auto-rows-fr gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard v-for="pokemon in displayedPokemonList" :key="pokemon.name" :pokemon="pokemon"/>
    </div>

  </section>
</template>