<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";
import PokemonCard from "@/components/PokemonCard.vue";
import { usePokemonStore } from "@/stores/usePokemonStore";
import Header from "@/components/Header.vue";
import PokemonFilter from "@/components/PokemonFilter.vue";
import type { Pokemon } from "@/types/Pokemon";
import PokemonSearch from "@/components/PokemonSearch.vue";
import { getNoPokemonFoundMessage } from "@/utils/PokemonErrorLabel";

const store = usePokemonStore();
const currentOffset = ref(0);
const LIMIT = 20;
const loadingSearch = ref(false); 
const searchInput = ref(""); 
const selectedFilter = ref("");
let searchTimeout: ReturnType<typeof setTimeout>;


//searches based on its name
//checks if pokemon is already in the store
//return existing pokemon, fetch pokemon if not yet 
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

// debounce local inputs
watch(searchInput, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    currentOffset.value = 0; 

    if (searchInput.value.trim()) {
      await searchPokemonOnDemand();
    }
   
  }, 300);
});

watch(selectedFilter, () => {
  currentOffset.value = 0;
});

//filter pokemon based on filter & search
const filteredPokemonList = computed(() => {
  const query = searchInput.value.trim().toLowerCase();
  const filterType = selectedFilter.value.trim().toLowerCase();

  let filtered = store.pokemonList

  if (query) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
  }
  
  if (filterType) {
    filtered = filtered.filter(p => p.types.some(t => t.type.name.toLowerCase() === filterType));
  }

  return filtered;
});

//for displaying pokemon cards
const displayedPokemonList = computed(() => {
  return filteredPokemonList.value.slice(
    currentOffset.value, 
    currentOffset.value + LIMIT
  );
});

// Pagination Nav Actions
const nextPage = () => { currentOffset.value += LIMIT; };
const prevPage = () => { if (currentOffset.value >= LIMIT) currentOffset.value -= LIMIT; };

const hasNextPage = computed(() => {
  const totalCount = store.pokemonList.length || 1300;
  return currentOffset.value + LIMIT < totalCount;
});

onUnmounted(() => {
  clearTimeout(searchTimeout);
});
</script>

<template>
  <section class="space-y-8">

     <!-- HEADER -->
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

    <!-- SEARCH -->
    <PokemonSearch v-model:search="searchInput" v-model:loading="loadingSearch"/>

    <!-- FILTER -->
    <PokemonFilter v-model="selectedFilter"/>

     <!-- LOADING -->
    <div v-if="!store.isIndexLoaded && store.pokemonList.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 py-24 text-center backdrop-blur-md">
      <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
      <p class="text-xs font-bold uppercase tracking-widest text-cyan-400 animate-pulse">Syncing Database Matrix Indices...</p>
    </div>

     <!-- NO POKEMON FOUND -->
    <div v-else-if="displayedPokemonList.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 p-16 text-center backdrop-blur-md animate-fade-in">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 class="text-xs font-bold uppercase tracking-widest text-slate-300">No Signatures Identified</h3>
      <p class="text-[11px] text-slate-500 uppercase mt-1">{{ getNoPokemonFoundMessage(searchInput.trim(), selectedFilter.trim()) }}</p>
    </div>

     <!-- POKEMON CARD LIST -->
    <div v-else class="grid grid-cols-2 auto-rows-fr gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard v-for="pokemon in displayedPokemonList" :key="pokemon.name" :pokemon="pokemon"/>
    </div>

  </section>
</template>