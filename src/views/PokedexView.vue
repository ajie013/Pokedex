<script setup lang="ts">
import { useFetch } from '@/composables/useFetch';
import type { Pokemon, PokemonCard, PokemonType } from '@/types/Pokemon';
import { onMounted, reactive, ref, watch } from 'vue';

const currentOffSet = ref(0); 
const limit = ref(20);

const pokemonCards = ref<PokemonCard[]>([]);

const { data, loading, error } = useFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon?limit=${limit.value}&offset=${currentOffSet.value}`);

const fetchPokemonDetails = async () => {
  if (data.value) {
    const cards: PokemonCard[] = [];

    for (const pokemon of data.value) {
      try {
        const response = await fetch(pokemon.url);
        const detailData = await response.json();

        console.log(detailData)
        const newPokemon: PokemonCard = {
          name: detailData.name,
          types: detailData.types.map((t: PokemonType) => ({
            slot: t.slot,
            type:{
              name: t.type.name,
              url: t.type.url
            }
          })),
          sprites: {
            other: {
              'official-artwork': {
                front_default: detailData.sprites.other['official-artwork'].front_default,
                front_shiny: detailData.sprites.other['official-artwork'].front_shiny
              }
            }
          }
        };
        
        cards.push(newPokemon);
      } catch (err) {
        console.error(`Failed to fetch details for ${pokemon.name}`, err);
      }
    }
    
    pokemonCards.value = [...cards];
  }
};

watch(data, (newData) => {
  if (newData) {
    fetchPokemonDetails();
  }
}, { immediate: true });

watch(currentOffSet, () =>{
  fetchPokemonDetails();
}, { immediate: true })

const nextPage = () => {
  currentOffSet.value += limit.value;
  fetchPokemonDetails();
};

const prevPage = () => {
  if (currentOffSet.value >= limit.value) {
    currentOffSet.value -= limit.value;
  }
};

watch([data, currentOffSet], () => {
  fetchPokemonDetails();
});

const typeColors: any = reactive({
  grass: "bg-green-600",
  fire: "bg-red-500",
  poison: 'bg-purple-600',
  water: "bg-blue-500",
  flying: "bg-black",
  bug: 'bg-orange-500',
  normal: 'bg-yellow-500'
})

</script>

<template>
  <div v-if="loading" class="text-center py-8 text-gray-500 text-sm">Loading Pokémon list...</div>
  <div v-else-if="error" class="text-center py-8 text-red-500 text-sm">Error loading data.</div>
  
  <div v-else class="p-4 max-w-5xl mx-auto">
  
    <div class="flex text-black flex-wrap gap-3 justify-center">
      <div v-for="pokemon in pokemonCards" :key="pokemon.name" class="border border-gray-200 rounded-lg p-3 w-36 bg-white shadow-sm flex flex-col items-center justify-between text-center">
        <img :src="pokemon.sprites.other['official-artwork'].front_default" :alt="pokemon.name" class="w-20 h-20 object-contain mb-2"/>
        
        <div>
          <h3 class="capitalize font-bold text-sm text-gray-800 mb-1">{{ pokemon.name }}</h3>
          
          <div class="flex flex-wrap gap-1 justify-center">
            <span 
              v-for="t in pokemon.types" 
              :key="t.type.name" 
              :class="typeColors[t.type.name.toLowerCase()]"
              class="text-[10px] text-white px-1.5 py-0.5 rounded capitalize font-medium"
            >
            {{ t.type.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-100">
      <button @click="prevPage" :disabled="currentOffSet === 0"
        class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>
      <span class="text-xs text-gray-500">Offset: {{ currentOffSet }}</span>
      <button @click="nextPage" class="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition">
        Next
      </button>
    </div>
  </div>
</template>