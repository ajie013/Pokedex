<script setup lang="ts">
import { ref, computed } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import { usePokemonStore } from '@/stores/usePokemonStore';
import Header from '@/components/Header.vue';
import PokemonFilter from '@/components/PokemonFilter.vue';

const store = usePokemonStore();

const favoritedPokemons = computed(() => store.pokemonList.filter((item) => item.isFavorite));

const selectedFilter = ref("");

const onFilter = (type: string) => {
  selectedFilter.value = type;
};

const displayedPokemons = computed(() => {
  if (selectedFilter.value === "") {
    return favoritedPokemons.value;
  }
  return favoritedPokemons.value.filter((item) =>
    item.types.some((t) => t.type.name === selectedFilter.value.toLowerCase())
  );
});
</script>

<template>
  <section class="space-y-8">
    <Header 
      sub="Personal Storage" 
      title-first="Poké" 
      title-second="Favorites" 
      content="Browse and manage your carefully curated list of favorite Pokémon saved directly to your system matrix."
    />

    <PokemonFilter v-if="favoritedPokemons.length > 0" @filter="onFilter" />

    <div v-if="favoritedPokemons.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 p-16 text-center backdrop-blur-md animate-fade-in">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </div>
      <p class="text-xs font-bold text-slate-300 uppercase tracking-widest">No Favorites Linked</p>
      <p class="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto uppercase">Go to the main Pokédex system to synchronize data fields.</p>
    </div>

    <div v-else-if="displayedPokemons.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 p-16 text-center backdrop-blur-md animate-fade-in">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 class="text-xs font-bold uppercase tracking-widest text-slate-300">No Target Elements Pinned</h3>
      <p class="text-[11px] text-slate-500 uppercase mt-1">You haven't pinned any {{ selectedFilter }} types to your active favorite vault yet.</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-fade-in">
      <PokemonCard v-for="pokemon in displayedPokemons" :key="pokemon.id" :pokemon="pokemon" />
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>