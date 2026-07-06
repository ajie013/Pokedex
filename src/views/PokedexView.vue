<script setup lang="ts">
import { ref, watch } from "vue";

import { useFetch } from "@/composables/useFetch";
import type { Ability, Pokemon, PokemonCard as PokemonCardType, PokemonType, Stat } from "@/types/Pokemon";
import PokemonCard from "@/components/PokemonCard.vue";


const currentOffSet = ref(0);
const limit = ref(30);

const pokemonList = ref<PokemonCardType[]>([]);
const loadingDetails = ref(false);

const { data, loading, error, fetchData } = useFetch<Pokemon>(
  () =>`https://pokeapi.co/api/v2/pokemon?limit=${limit.value}&offset=${currentOffSet.value}`
);

const formatPokemonDetails = (details: PokemonCardType): PokemonCardType => ({
  id: details.id,
  name: details.name,
  cries:{
    latest: details.cries.latest,
    legacy: details.cries.legacy
  },
  base_experience: details.base_experience,
  height: details.height,
  weight: details.weight,
  species:{
    name: details.species.name,
    url: details.species.url
  },
  stats: details.stats.map((stat: Stat) => ({
    base_stat: stat.base_stat,
    effort: stat.effort,
    stat: {
      name: stat.stat.name,
      url: stat.stat.url,
    },
  })),
  abilities: details.abilities.map((ability: Ability) => ({
    ability:{
      name: ability.ability.name,
      url: ability.ability.url
    },
    is_hidden: ability.is_hidden,
    slot: ability.slot
  })),
  types: details.types.map((t: PokemonType) => ({
    slot: t.slot,
    type: {
      name: t.type.name,
      url: t.type.url,
    },
  })),
  sprites: {
    other: {
      "official-artwork": {
        front_default:
          details.sprites.other["official-artwork"].front_default,
        front_shiny:
          details.sprites.other["official-artwork"].front_shiny,
      },
    },
  },
});

const fetchPokemonDetails = async () => {
  if (!data.value) return;

  loadingDetails.value = true;

  try {
    const cards = await Promise.all(
      data.value.map(async (pokemon: Pokemon) => {
        const response = await fetch(pokemon.url);

        if (!response.ok) {
          throw new Error("Failed to fetch Pokémon");
        }

        const details: PokemonCardType = await response.json();

        return formatPokemonDetails(details);
      })
    );

    pokemonList.value = cards;
  } catch (err) {
    console.error(err);
  } finally {
    loadingDetails.value = false;
  }
};

watch( data, (newData) => {
    if (newData) {
      fetchPokemonDetails();
    }
  },
  { immediate: true }
);

watch(currentOffSet, () => {
    fetchData();
  },
  { immediate: true }
);

const nextPage = () => {
  currentOffSet.value += limit.value;
};

const prevPage = () => {
  if (currentOffSet.value >= limit.value) {
    currentOffSet.value -= limit.value;
  }
};
</script>

<template>
  <section class="space-y-8">

    <div class="relative overflow-hidden rounded-3xl border border-cyan-900/40 bg-slate-900/80 p-8 shadow-xl backdrop-blur">
      <div class="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl"></div>

      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400"> Pokémon Database
          </p>

          <h1 class="text-4xl font-black tracking-tight text-white lg:text-5xl">
            Poké<span class="text-cyan-400">Dex</span>
          </h1>

          <p class="mt-4 max-w-xl text-slate-400">
            Browse Pokémon with official artwork, typing and pagination.
            Clean, responsive and powered by PokéAPI.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-cyan-900/40 bg-slate-950/70 p-3">
          <button @click="prevPage" :disabled="currentOffSet === 0"
            class="rounded-xl border border-cyan-900/50 bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:bg-cyan-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <div
            class="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-bold text-cyan-300"
          >
            Page {{ Math.floor(currentOffSet / limit) + 1 }}
          </div>

          <button @click="nextPage"
            class="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Next →
          </button>
        </div>

      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading || loadingDetails" class="rounded-3xl border border-cyan-900/40 bg-slate-900 py-24 text-center">
      <div class="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>

      <p class="text-lg font-medium text-slate-300"> Loading Pokémon...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-3xl border border-red-500/30 bg-red-500/10 p-12 text-center">
      <h2 class="text-xl font-bold text-red-300">
        Failed to load Pokémon.
      </h2>

      <p class="mt-2 text-red-200">
        Please try again later.
      </p>
    </div>

    <!-- Cards -->
    <div v-else class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <PokemonCard
        v-for="pokemon in pokemonList"
        :key="pokemon.name"
        :pokemon="pokemon"
      />
    </div>

  </section>
</template>