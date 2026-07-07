<script setup lang="ts">
import { computed } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import { usePokemonStore } from '@/stores/usePokemonStore';
import Header from '@/components/Header.vue';

const store = usePokemonStore();

const filteredPokemons = computed(() => store.pokemonList.filter((item) => item.isFavorite));
</script>

<template>
  <section class="space-y-8">
    <Header 
      sub="Personal Storage" 
      title-first="Poké" 
      title-second="Favorites" 
      content="Browse and manage your carefully curated list of favorite Pokémon saved directly to your system matrix."
    />

    <div v-if="filteredPokemons.length === 0" class="rounded-2xl border border-cyan-900/30 bg-slate-900/40 p-16 text-center backdrop-blur-md">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </div>
      <p class="text-base font-bold text-slate-300 uppercase tracking-wider">No Favorites Linked</p>
      <p class="text-xs text-slate-500 mt-2 max-w-xs mx-auto uppercase">Go to the main Pokédex system to synchronize data fields.</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard v-for="pokemon in filteredPokemons" :key="pokemon.id" :pokemon="pokemon"/>
    </div>
  </section>
</template>