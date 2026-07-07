<script setup lang="ts">
import { computed } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';
import { usePokemonStore } from '@/stores/usePokemonStore';

const store = usePokemonStore();

const filteredPokemons = computed(() => store.pokemonList.filter((item) => item.isFavorite));
</script>

<template>
  <section class="space-y-8">
    <div class="relative overflow-hidden rounded-3xl border border-cyan-900/40 bg-slate-900/80 p-8 shadow-xl backdrop-blur">
      <div class="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl"></div>

      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-white lg:text-5xl">
            Poké<span class="text-cyan-400">Favorites</span>
          </h1>

          <p class="mt-4 max-w-xl text-slate-400">
            Browse and manage your carefully curated list of favorite Pokémon.
          </p>
        </div>
      </div>
    </div>

    <div v-if="filteredPokemons.length === 0" class="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 py-20 text-center">
      <p class="text-lg font-medium text-slate-400">No favorite Pokémon added yet.</p>
      <p class="text-sm text-slate-500 mt-1">Go to the main Pokédex and catch some details!</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard v-for="pokemon in filteredPokemons" :key="pokemon.id" :pokemon="pokemon"/>
    </div>
  </section>
</template>