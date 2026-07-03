export interface Pokemon{
  name: string,
  url: string
}

export interface PokemonCard{
  name: string
  types: PokemonType[]
  sprites:{
    other:{
      'official-artwork':{
        front_default: string,
        front_shiny: string
      }
    }
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
