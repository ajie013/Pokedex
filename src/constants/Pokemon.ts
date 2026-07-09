import { ref } from "vue";

export const TYPECOLORS: Record<string, string> = {
  NORMAL: "bg-slate-500 text-white",
  FIRE: "bg-red-500 text-white",
  WATER: "bg-sky-500 text-white",
  ELECTRIC: "bg-yellow-400 text-slate-900",
  GRASS: "bg-green-500 text-white",
  ICE: "bg-cyan-300 text-slate-900",
  FIGHTING: "bg-orange-700 text-white",
  POISON: "bg-purple-500 text-white",
  GROUND: "bg-amber-600 text-white",
  FLYING: "bg-indigo-400 text-white",
  PSYCHIC: "bg-pink-500 text-white",
  BUG: "bg-lime-600 text-white",
  ROCK: "bg-stone-500 text-white",
  GHOST: "bg-violet-600 text-white",
  DRAGON: "bg-indigo-700 text-white",
  DARK: "bg-slate-700 text-white",
  STEEL: "bg-gray-400 text-slate-900",
  FAIRY: "bg-pink-300 text-slate-900",
};

export const POKEMONTYPES = ref([
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy'
])
