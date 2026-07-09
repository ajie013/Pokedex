import type { Pokemon } from "./Pokemon"

export interface ApiResponse{
  count: number
  next: string
  previous: null | string | number,
  results: Pokemon[]
}