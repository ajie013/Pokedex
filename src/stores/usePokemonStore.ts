import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PokemonCard, Stat, Ability, PokemonType, Pokemon } from '@/types/Pokemon';
import { formatPokemonDetails } from '@/utils/PokemonFormatter';
import { useFetch } from '@/composables/useFetch';
import type { ApiResponse } from '@/types/ApiResult';

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonList = ref<PokemonCard[]>([]);
  const searchIndex = ref<{ name: string; url: string }[]>([]);
  const isIndexLoaded = ref(false);
  const isIndexing = ref(false);
  const isBackgroundSyncing = ref(false);
  const pokemonMap = ref(new Map<string, PokemonCard>());

  const addPokemonCards = (cards: PokemonCard[]) => {
    cards.forEach(card => {
      if (!pokemonMap.value.has(card.name)) {
        pokemonList.value.push(card);
        pokemonMap.value.set(card.name, card);
      }
    });

    pokemonList.value.sort((a, b) => a.id - b.id);
  };

  const getPokemon = (name: string) => {
    return pokemonMap.value.get(name);
  }

  const setIndexData = (results: { name: string; url: string }[]) => {
    searchIndex.value = results;
    isIndexLoaded.value = true;
  };

  //after fetching all pokemons, this function gets each pokemon's detail in the background
  const startBackgroundSync = async () => {
    if (isBackgroundSyncing.value) return;

    isBackgroundSyncing.value = true;

    for (const item of searchIndex.value) {
      const alreadyLoaded = pokemonList.value.some(p => p.name === item.name);
      
      if (!alreadyLoaded) {
        try {
          const res = await fetch(item.url);
          if (!res.ok) continue;
          
          const rawDetails = await res.json();
          addPokemonCards([formatPokemonDetails(rawDetails)]);

          await new Promise(resolve => setTimeout(resolve, 120));
        } catch (err) {
          console.error(`Background fetch failed for ${item.name}:`, err);
        }
      }
    }

    isBackgroundSyncing.value = false;
  };

  //check if pokemon is already in the store, returns the existing data if yes
  //continue fetching if no
  //adds the new pokemon in the store
  const getOrFetchPokemon = async (item: Pokemon) => {
    const existing = pokemonMap.value.get(item.name);

    if (existing) {
        return existing;
    }

    const response = await fetch(item.url);

    if (!response.ok) {
        throw new Error("Failed");
    }

    const raw = await response.json();
    const card = formatPokemonDetails(raw);

    addPokemonCards([card]);

    return card;
  };

  return { 
    pokemonList, 
    searchIndex, 
    isIndexLoaded,
    isBackgroundSyncing, 
    addPokemonCards, 
    setIndexData, 
    startBackgroundSync,
    getOrFetchPokemon,
    getPokemon
  };
});