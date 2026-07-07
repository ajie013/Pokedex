import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PokemonCard, Stat, Ability, PokemonType } from '@/types/Pokemon';
import { formatPokemonDetails } from '@/utils/PokemonFormatter';

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonList = ref<PokemonCard[]>([]);
  const searchIndex = ref<{ name: string; url: string }[]>([]);
  const isIndexLoaded = ref(false);
  const isIndexing = ref(false);
  const isBackgroundSyncing = ref(false);

  const addPokemonCards = (cards: PokemonCard[]) => {
    cards.forEach(card => {
      if (!pokemonList.value.some(p => p.id === card.id)) {
        pokemonList.value.push(card);
      }
    });

    pokemonList.value.sort((a, b) => a.id - b.id);
  };

  const fetchSearchIndex = async () => {
    if (isIndexLoaded.value || isIndexing.value) return;
    
    isIndexing.value = true;
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0');
      if (!res.ok) throw new Error("Failed global index aggregation");
      
      const data = await res.json();
      searchIndex.value = data.results;
      isIndexLoaded.value = true;
    } catch (err) {
      console.error("Failed to compile global search index matrix:", err);
    } finally {
      isIndexing.value = false;
    }
  };

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

  return { 
    pokemonList, 
    searchIndex, 
    isIndexLoaded,
    isBackgroundSyncing, 
    addPokemonCards, 
    fetchSearchIndex, 
    startBackgroundSync 
  };
});