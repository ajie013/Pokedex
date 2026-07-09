import type { GamePokemonDetail } from "@/types/Game";
import type { Ability, PokemonCard, PokemonSpecies, PokemonType, Stat } from "@/types/Pokemon";

export const formatPokemonDetails = (details: PokemonCard): PokemonCard => ({
  id: details.id,
  name: details.name,
  isFavorite: false,
  cries: {
    latest: details.cries.latest,
    legacy: details.cries.legacy
  },
  base_experience: details.base_experience,
  height: details.height,
  weight: details.weight,
  species: {
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
    ability: {
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
          `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${details.id}.png`,
        front_shiny:
          `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/shiny/${details.id}.png`,
      },
    },
  },
});

export const formatPokemonGameBoard = (details: GamePokemonDetail): GamePokemonDetail => ({
  id: details.id,
  name: details.name,
  sprites: {
    other: {
      "official-artwork": {
        front_default: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${details.id}.png`,
        front_shiny: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/shiny/${details.id}.png`,
      },
    },
  },
})

export const formatSpecie = (item: PokemonSpecies): PokemonSpecies => ({
  gender_rate: item.gender_rate,
  hatch_counter: item.hatch_counter,
  egg_groups: item.egg_groups,
  evolution_chain: item.evolution_chain,
  is_legendary: item.is_legendary ?? false,
  is_mythical: item.is_mythical ?? false,
  generation: item.generation
});