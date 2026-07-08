<script setup lang="ts">
import { ref, watch, computed } from "vue";

import { useFetch } from "@/composables/useFetch";

import type { Pokemon, PokemonCard as PokemonCardType } from "@/types/Pokemon";
import PokemonCard from "@/components/PokemonCard.vue";
import { usePokemonStore } from "@/stores/usePokemonStore";
import Header from "@/components/Header.vue";
import PokemonFilter from "@/components/PokemonFilter.vue";
import { formatPokemonDetails } from "@/utils/PokemonFormatter";

const store = usePokemonStore();
const currentOffSet = ref(0);
const limit = ref(20);
const loadingDetails = ref(false);
const searchInput = ref(""); 

const { data, loading, error, fetchData } = useFetch<Pokemon[]>(
  () => `https://pokeapi.co/api/v2/pokemon?limit=${limit.value}&offset=${currentOffSet.value}`
);

const selectedFilter = ref("");

const filteredPokemonList = computed(() => {
  const query = searchInput.value.trim().toLowerCase();
  const filterType = selectedFilter.value.trim().toLowerCase();

  let filtered = store.pokemonList;

  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query)
    );
  }

  if (filterType) {
    filtered = filtered.filter(p =>
      p.types.some(t => t.type.name.toLowerCase() === filterType)
    );
  }

  return filtered;
});

const displayedPokemonList = computed(() => {
  return filteredPokemonList.value.slice(
    currentOffSet.value,
    currentOffSet.value + limit.value
  );
});

const fetchPokemonDetails = async () => {
  if (!data.value) return;

  loadingDetails.value = true;

  try {
    const cards = await Promise.all(
      data.value.map(store.getOrFetchPokemon)
    )
    
    store.addPokemonCards(cards);  
  } catch (err) {
    console.error(err);
  } finally {
    loadingDetails.value = false;
  }
};

watch(data, (newData) => {
    if (newData) {
      fetchPokemonDetails();
    }
  },
  { immediate: true }
);

watch(currentOffSet, () => {
    if (displayedPokemonList.value.length === limit.value) {
      return; 
    }
    fetchData();
  },
  { immediate: true }
);

// const hasNextPage = computed(() => {
//   return currentOffSet.value + limit.value < filteredPokemonList.value.length;
// });

const nextPage = () => {
  // if (!hasNextPage.value) return;
  currentOffSet.value += limit.value;
};

const prevPage = () => {
  if (currentOffSet.value >= limit.value) {
    currentOffSet.value -= limit.value;
  }
};

const onFilter = (type: string) =>{
  selectedFilter.value = type;
  currentOffSet.value = 0
};

const searchPokemon = async () => {
  const inputValue = searchInput.value.trim();

  if(!inputValue) return;

  loadingDetails.value = true; 

  try {
    const pokemons = store.searchIndex.filter((item) => 
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    const cards = await Promise.all(
      pokemons.map(store.getOrFetchPokemon)
    );

    store.addPokemonCards(cards);
     console.log(store.pokemonList)
  } catch (err) {
    console.error(err);
  } finally {
    loadingDetails.value = false; 
  }
};

let searchTimeout: ReturnType<typeof setTimeout>;

watch(searchInput, () =>{
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
      searchPokemon();
      currentOffSet.value = 0;
  }, 300);
}, {immediate: true})


</script>

<template>
  <section class="space-y-8">

    <Header sub="Pokémon Database" title-first="Poké" title-second="Dex" content="Browse Pokémon with official artwork, typing vectors, and indexed memory matrices. Clean, responsive, and fully powered by PokéAPI.">
      <div class="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-2.5 backdrop-blur-sm shadow-inner self-start lg:self-center">
        <button @click="prevPage" :disabled="currentOffSet === 0" 
          class="cursor-pointer rounded-lg border border-cyan-900/50 bg-slate-800/80 px-4 py-1.5 text-xs font-bold uppercase text-slate-300 transition-all hover:border-cyan-400 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30">
          ← Prev
        </button>

        <div class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-black font-mono tracking-widest text-cyan-400 uppercase">
          IDX {{ Math.floor(currentOffSet / limit) + 1 }}
        </div>

        <button @click="nextPage" class="cursor-pointer rounded-lg bg-cyan-400 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-300 hover:shadow-md hover:shadow-cyan-400/30">
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

        <input type="text" v-model="searchInput" @keydown.enter="searchPokemon"placeholder="ENTER POKÉMON SIGNATURE..." class="w-full bg-transparent py-2 text-sm font-medium tracking-wide text-slate-200 placeholder-slate-500 outline-none uppercase font-mono"/>

        <button @click="searchPokemon" class="cursor-pointer whitespace-nowrap rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 text-xs font-black uppercase tracking-widest text-cyan-400 font-mono transition-all hover:bg-cyan-400 hover:text-slate-950 hover:shadow-md hover:shadow-cyan-400/20 active:scale-98">
          Execute Search
        </button>
      </div>
    </div>
    <PokemonFilter @filter="onFilter"/>

    <div v-if="loading || loadingDetails" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 py-24 text-center backdrop-blur-md">
      <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
      <p class="text-xs font-bold uppercase tracking-widest text-cyan-400 animate-pulse">Syncing Database Elements...</p>
    </div>

    <div v-else-if="error" class="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-16 text-center backdrop-blur-md">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h2 class="text-sm font-black uppercase tracking-widest text-rose-400">Matrix Error</h2>
      <p class="mt-1 text-xs text-slate-400 uppercase">Failed to retrieve API datasets. Please reboot interface link later.</p>
    </div>

    <div v-else-if="displayedPokemonList.length === 0 && !loadingDetails && !loading" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 p-16 text-center backdrop-blur-md animate-fade-in">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 class="text-xs font-bold uppercase tracking-widest text-slate-300">No Signatures Identified</h3>
      <p class="text-[11px] text-slate-500 uppercase mt-1">No {{ selectedFilter }} types match inside this indexed page scope.</p>
    </div>

    <div v-else class="grid grid-cols-2 auto-rows-fr gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard v-for="pokemon in displayedPokemonList" :key="pokemon.name" :pokemon="pokemon"/>
    </div>

  </section>
</template>