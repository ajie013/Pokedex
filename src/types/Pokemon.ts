export interface Pokemon{
  name: string,
  url: string
}

export interface PokemonCard{
  id: number  
  name: string,
  cries:{
    latest: string,
    legacy: string,
  }
  base_experience: number
  height: number
  weight: number
  species: Specie
  stats: Stat[]
  types: PokemonType[]
  sprites:{
    other:{
      'official-artwork':{
        front_default: string,
        front_shiny: string
      }
    }
  }
  abilities: Ability[]
  isFavorite: boolean
}

export interface Ability{
  ability:{
    name: string,
    url: string
  }
  is_hidden: boolean
  slot: number
}

export interface Stat{
  base_stat: number
  effort: number
  stat:{
    name: string,
    url: string
  }
}

export interface PokemonType{
  slot: number,
  type: {
    name: string,
    url: string
  }
}

export interface PokemonDetails{
  name: string
  id: number
  forms: Form
  species: Specie
}

export interface Specie{
  name: string,
  url: string
}

export interface Form{
  name: string
  url: string
}

export interface PokemonSpecies {
  gender_rate: number;
  hatch_counter: number;
  egg_groups: EggGroup[];
  evolution_chain: EvolutionChainUrl;
  is_legendary: boolean
  is_mythical: boolean

  generation: {
    name: string;
    url: string;
  };
}

export interface EggGroup {
  name: string;
  url: string;
}

export interface EvolutionChainUrl {
  url: string;
}

export interface EvolutionChainResponse {
  chain: EvolutionNode;
}

export interface EvolutionNode {
  species: SpeciesReference;
  evolves_to: EvolutionNode[];
}

export interface SpeciesReference {
  name: string;
  url: string;
}

export interface DamageRelationType {
  name: string;
  url: string;
}

export interface DamageRelations {
  double_damage_from: DamageRelationType[];
  half_damage_from: DamageRelationType[];
  no_damage_from: DamageRelationType[];
}

export interface PokemonTypeDetails {
  name: string;
  damage_relations: DamageRelations;
}

export interface EvolutionPokemon {
  id: number;
  name: string;
  image: string;
}