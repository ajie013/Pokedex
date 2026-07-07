import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PokemonCard } from '@/types/Pokemon';

export const usePokemonStore = defineStore('pokemons', () => {
  const pokemonList = ref<PokemonCard[]>([])

  const addPokemonCards = (newCards: PokemonCard[]) => {
    newCards.forEach((card) => {
      const exists = pokemonList.value.some((p) => p.id === card.id)
      if (!exists) {
        pokemonList.value.push(card)
      }
    })
  }

  return {
    pokemonList,
    addPokemonCards
  }
});