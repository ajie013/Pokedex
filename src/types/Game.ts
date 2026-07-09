import type { Pokemon } from "./Pokemon";

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface GameCard extends GamePokemonDetail {
  uuid: string;
  flipped: boolean;
  matched: boolean;
}


export interface GamePokemonDetail{
  id: number  
  name: string,
  sprites:{
  other:{
      'official-artwork':{
        front_default: string,
        front_shiny: string
      }
    }
  }
}