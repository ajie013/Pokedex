<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { TYPECOLORS } from '@/constants/Pokemon';
import type {
  PokemonCard,
  PokemonSpecies,
  EvolutionChainResponse,
  EvolutionNode,
  SpeciesReference,
  EvolutionPokemon,
  DamageRelationType,
  PokemonTypeDetails,
} from "@/types/Pokemon";
import {  usePokemonStore } from '@/stores/usePokemonStore';

const props = defineProps<{
  pokemon: PokemonCard;
}>();

const store = usePokemonStore();

const pokemon = computed(() => {
  return store.pokemonList.find(item => item.id === props.pokemon.id) || props.pokemon;
});

const showShiny = ref(false);
const species = ref<PokemonSpecies | null>(null);
const weaknesses = ref<{ name: string; multiplier: number }[]>([]);
const evolutionChain = ref<EvolutionPokemon[]>([]);

const toggleFavorites = () => {
  const storePokemon = store.pokemonList.find(item => item.id === props.pokemon.id);
  if (storePokemon) {
    storePokemon.isFavorite = !storePokemon.isFavorite;
  }
};

const playCry = (url: string) =>{
  const audio: HTMLAudioElement = new Audio(url);

  audio.volume = 0.5; 

  audio.play()
    .then(() => {
      console.log("Music is playing smoothly!");
    })
    .catch((error: Error) => {
      console.error("Playback failed. Ensure user interacted with the page first:", error);
    });
}

const flattenEvolution = ( node: EvolutionNode, list: SpeciesReference[] = []): SpeciesReference[] => {
  list.push(node.species);
  node.evolves_to.forEach(child => flattenEvolution(child, list));
  return list;
};

const fetchSpecies = async () => {
  try {
    const response = await fetch(props.pokemon.species.url);
    if (!response.ok) throw new Error("Failed to fetch species");
    
    species.value = await response.json();
    await fetchEvolutionChain();
  } catch (err) {
    console.error("Error fetching species data:", err);
  }
};

const fetchWeaknesses = async () => {
  try {
    const typeData: PokemonTypeDetails[] = await Promise.all(
      props.pokemon.types.map(async (type) => {
        const response = await fetch(type.type.url);
        return response.json();
      })
    );

    const multipliers = new Map<string, number>();

    const applyMultiplier = (types: DamageRelationType[], multiplier: number) => {
      types.forEach((type) => {
        const current = multipliers.get(type.name) ?? 1;
        multipliers.set(type.name, current * multiplier);
      });
    };

    typeData.forEach((type) => {
      applyMultiplier(type.damage_relations.double_damage_from, 2);
      applyMultiplier(type.damage_relations.half_damage_from, 0.5);
      applyMultiplier(type.damage_relations.no_damage_from, 0);
    });

    weaknesses.value = [...multipliers.entries()]
      .filter(([, multiplier]) => multiplier > 1)
      .map(([name, multiplier]) => ({ name, multiplier }))
      .sort((a, b) => b.multiplier - a.multiplier);
  } catch (err) {
    console.error("Error fetching weaknesses:", err);
  }
};

const fetchEvolutionChain = async () => {
  if (!species.value) return;

  try {
    const response = await fetch(species.value.evolution_chain.url);
    const data: EvolutionChainResponse = await response.json();
    const speciesList = flattenEvolution(data.chain);

    evolutionChain.value = await Promise.all(
      speciesList.map(async (pokemon) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        const details = await res.json();
        return {
          id: details.id,
          name: details.name,
          image: details.sprites.other["official-artwork"].front_default,
        };
      })
    );
  } catch (err) {
    console.error("Error fetching evolution chain:", err);
  }
};

const femaleRate = computed(() => {
  if (!species.value) return "--";

  return species.value.gender_rate === -1 ? "Genderless" : `${species.value.gender_rate * 12.5}%`;
});

const maleRate = computed(() => {
  if (!species.value) return "--";

  return species.value.gender_rate === -1 ? "Genderless" : `${100 - species.value.gender_rate * 12.5}%`;
});

const totalStats = computed(() => props.pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0));

onMounted(() => {
  fetchWeaknesses();
  fetchSpecies();
  playCry(props.pokemon.cries.latest)
});

</script>

<template>
  <div class="space-y-8 max-w-2xl mx-auto p-4">
    
    <section class="flex flex-col items-center relative rounded-3xl bg-slate-900/40 p-6 border border-slate-800/60 shadow-xl">
      
      <button @click="toggleFavorites" class="absolute top-4 left-4 z-10 p-2.5 rounded-xl border transition-all duration-300 group cursor-pointer shadow-md"
        :class="pokemon.isFavorite 
          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-400 hover:bg-cyan-900/50 hover:scale-110 shadow-cyan-950/50' 
          : 'bg-slate-900/80 border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:scale-110'"
        :title="pokemon.isFavorite ? 'Remove from favorites' : 'Add to favorites'">
        <svg xmlns="http://www.w3.org/2000/svg" :fill="pokemon.isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 transition-transform duration-300 group-hover:animate-pulse">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <div class="flex h-48 w-48 items-center justify-center rounded-3xl border border-cyan-900/40 bg-linear-to-br from-slate-800 to-slate-950 p-4 shadow-lg">
        <img :src="showShiny
            ? pokemon.sprites.other['official-artwork'].front_shiny
            : pokemon.sprites.other['official-artwork'].front_default"
          :alt="pokemon.name"
          class="w-full h-full object-contain"
        />
      </div>
      
      <button @click="showShiny = !showShiny" class="cursor-pointer mt-4 rounded-lg border border-cyan-600/50 bg-cyan-950/20 px-4 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-800/40">
        {{ showShiny ? 'Show Normal' : 'Show Shiny' }}
      </button>

      <p class="text-slate-400 font-mono tracking-wider text-xs mt-4">
        #{{ pokemon.id.toString().padStart(3, '0') }}
      </p>
      <h1 class="mt-1 text-3xl font-black capitalize text-white tracking-wide">
        {{ pokemon.name }}
      </h1>

      <div class="mt-3 flex flex-wrap justify-center gap-2">
        <span 
          v-for="type in pokemon.types" 
          :key="type.type.name" 
          :class="['rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm', TYPECOLORS[type.type.name.toUpperCase()]]"
        >
          {{ type.type.name }}
        </span>
      </div>
    </section>

    <section>
      <h2 class="mb-4 border-b border-cyan-900/40 pb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
        Basic Information
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Height</p>
          <p class="mt-1 text-lg font-bold text-white">{{ pokemon.height / 10 }} m</p>
        </div>
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Weight</p>
          <p class="mt-1 text-lg font-bold text-white">{{ pokemon.weight / 10 }} kg</p>
        </div>
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Base Exp</p>
          <p class="mt-1 text-lg font-bold text-white">{{ pokemon.base_experience }}</p>
        </div>
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Species</p>
          <p class="mt-1 text-lg font-bold capitalize text-white">{{ pokemon.species.name }}</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-4 border-b border-cyan-900/40 pb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
        Species Information
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Male Ratio</p>
          <p class="mt-1 text-lg font-bold text-sky-400">{{ maleRate }}</p>
        </div>
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Female Ratio</p>
          <p class="mt-1 text-lg font-bold text-pink-400">{{ femaleRate }}</p>
        </div>
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Hatch Counter</p>
          <p class="mt-1 text-lg font-bold text-white">{{ species?.hatch_counter ?? '--' }}</p>
        </div>
        <div class="rounded-xl bg-slate-800/60 p-4 border border-slate-700/30">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Egg Groups</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <span
              v-for="group in species?.egg_groups" :key="group.name" class="rounded-md bg-cyan-950/50 border border-cyan-800/30 px-2 py-0.5 text-xs capitalize font-medium text-cyan-300">
              {{ group.name }}
            </span>
            <span v-if="!species?.egg_groups?.length" class="text-sm text-slate-500">--</span>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-4 border-b border-cyan-900/40 pb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
        Abilities
      </h2>
      <div class="flex flex-wrap gap-3">
        <div v-for="ability in pokemon.abilities" :key="ability.ability.name" class="flex items-center rounded-xl border border-cyan-800/40 bg-slate-800/80 px-4 py-2 text-sm capitalize font-medium text-slate-200 shadow-sm">
          {{ ability.ability.name.replace('-', ' ') }}
          <span v-if="ability.is_hidden" class="ml-2 rounded bg-cyan-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-950">
            Hidden
          </span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-4 border-b border-cyan-900/40 pb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
        Weaknesses
      </h2>
      <div class="flex flex-wrap gap-2">
        <span v-for="weakness in weaknesses" :key="weakness.name" :class="['rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm', TYPECOLORS[weakness.name.toUpperCase()]]">
          {{ weakness.name }}
          <span class="ml-1 font-extrabold text-slate-900/80 bg-white/40 px-1 rounded-sm text-[10px]">×{{ weakness.multiplier }}</span>
        </span>
        <p v-if="!weaknesses.length" class="text-sm text-slate-400 italic">No notable elemental weaknesses.</p>
      </div>
    </section>

    <section>
      <h2 class="mb-5 border-b border-cyan-900/40 pb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
        Evolution Chain
      </h2>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <template v-for="(poke, index) in evolutionChain" :key="poke.id">
          <div class="flex w-28 flex-col items-center rounded-xl bg-slate-800/60 p-3 border border-slate-700/30 shadow-md">
            <img :src="poke.image" :alt="poke.name" class="h-16 w-16 object-contain filter drop-shadow-md">
            <p class="mt-2 text-[10px] font-mono text-slate-500">
              #{{ poke.id.toString().padStart(3, "0") }}
            </p>
            <p class="font-bold text-sm capitalize text-white truncate max-w-full">
              {{ poke.name }}
            </p>
          </div>

          <svg v-if="index !== evolutionChain.length - 1" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-500/70 animate-pulse hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </template>
        <p v-if="!evolutionChain.length" class="text-sm text-slate-400 italic">Loading evolution data...</p>
      </div>
    </section>

    <section>
      <h2 class="mb-5 border-b border-cyan-900/40 pb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
        Base Stats
      </h2>
      <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="mb-4">
        <div class="mb-1 flex justify-between items-end">
          <span class="capitalize text-xs font-medium tracking-wide text-slate-300">
            {{ stat.stat.name.replace('-', ' ') }}
          </span>
          <span class="font-bold text-sm text-cyan-400 font-mono">{{ stat.base_stat }}</span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
          <div 
            class="h-full rounded-full bg-linear-to-r from-cyan-500 to-sky-400 transition-all duration-500" 
            :style="{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
      
      <div class="mt-6 rounded-xl bg-cyan-950/40 border border-cyan-900/30 p-4 flex justify-between items-center shadow-inner">
        <span class="font-bold text-sm uppercase tracking-wider text-slate-300">Stat Total</span>
        <span class="text-cyan-400 font-black text-xl font-mono">{{ totalStats }}</span>
      </div>
    </section>

  </div>
</template>