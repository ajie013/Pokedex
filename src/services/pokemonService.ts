import type { ApiResponse } from "@/types/ApiResult"
import { api } from "./api"
import type { EvolutionChainResponse, Pokemon, PokemonCard, PokemonSpecies, PokemonTypeDetails } from "@/types/Pokemon"

export const getPokemonList = () =>{
  return api<ApiResponse>("https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0")
}

export const getRandomPokemon = (randomNum: number) =>{
  return api<ApiResponse>(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${randomNum}`)
}

export const getPokemonDetails = (url: string) =>{
  return api<PokemonCard>(url)
}

export const getPokemonSpecie = (url: string) =>{
  return api<PokemonSpecies>(url)
}

export const getEvolutionChain = (url: string) =>{
  return api<EvolutionChainResponse>(url)
}

export const getPokemonType = (url: string) =>{
  return api<PokemonTypeDetails>(url)
}

