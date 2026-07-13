import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PokemonCard, Pokemon, PokemonSpecies } from '@/types/Pokemon';
import * as  pokemonService  from '@/services/pokemonService';
import { formatPokemonDetails, formatSpecie } from '../utils/pokemonFormatter';

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonList = ref<PokemonCard[]>([]);
  const searchIndex = ref<{ name: string; url: string }[]>([]);
  const isIndexLoaded = ref(false);
  const isBackgroundSyncing = ref(false);
  const pokemonMap = ref(new Map<string, PokemonCard>());
  const speciesMap = ref(new Map<string, PokemonSpecies>())
  const speciesRequests = new Map<string, Promise<PokemonSpecies>>();
  
  const addPokemonCards = (cards: PokemonCard[]) => {
    cards.forEach(card => {
      if (!pokemonMap.value.has(card.name)) {
        pokemonList.value.push(card);
        pokemonMap.value.set(card.name, card);
      }
    });

    pokemonList.value.sort((a, b) => a.id - b.id);
  };

  const fetchPokemonList = async () =>{
    const data = await pokemonService.getPokemonList()
    setIndexData([...data.results])
  }

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
          const rawDetails = await pokemonService.getPokemonDetails(item.url);
          addPokemonCards([formatPokemonDetails(rawDetails)]);

          await new Promise(resolve => setTimeout(resolve, 120));
        } catch (err) {
          console.error(`Background fetch failed for ${item.name}:`, err);
        }
      }
    }

    isBackgroundSyncing.value = false;
  };

  const getOrFetchSpecie = async (url: string) => {
    const existing = speciesMap.value.get(url);

    if (existing) return existing;

    const pendingRequest = speciesRequests.get(url);

    if (pendingRequest) {
      return pendingRequest;
    }

    const request = (async () => {
      const raw = await pokemonService.getPokemonSpecie(url)
      const species = formatSpecie(raw);

      speciesMap.value.set(url, species);

      return species;
    })();

    speciesRequests.set(url, request);

    try {
      return await request;
    } finally {
      speciesRequests.delete(url);
    }
  };
  
  //check if pokemon is already in the store, returns the existing data if yes
  //continue fetching if no
  //adds the new pokemon in the store
  const getOrFetchPokemon = async (item: Pokemon) => {
    const existing = pokemonMap.value.get(item.name);

    if (existing) {
        return existing;
    }

    const raw = await pokemonService.getPokemonDetails(item.url);
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
    getPokemon,
    getOrFetchSpecie,
    fetchPokemonList
  };
});