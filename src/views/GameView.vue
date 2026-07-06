<script setup lang="ts">
import { ref, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import type {
  Pokemon,
  PokemonCard,
} from "@/types/Pokemon";
import type { GamePokemonDetail } from "@/types/Game";

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

interface GameCard extends GamePokemonDetail {
  uuid: string;
  flipped: boolean;
  matched: boolean;
}

const randomNumber = Math.floor(Math.random() * 1000);
const pokemonList = ref<GamePokemonDetail[]>([]);
const gameBoard = ref<GameCard[]>([]);
const score = ref(0)
const selectedCard = ref<{
  first: GameCard | null;
  second: GameCard | null;
}>({
  first: null,
  second: null,
});

const { data, loading, error } = useFetch<PokemonListResponse>(
  () => `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${randomNumber}`
);

const formatPokemonDetails = (details: PokemonCard): GamePokemonDetail => ({
  id: details.id,
  name: details.name,
  sprites: {
    other: {
      "official-artwork": {
        front_default: details.sprites.other["official-artwork"].front_default,
        front_shiny: details.sprites.other["official-artwork"].front_shiny,
      },
    },
  },
});

const isChecking = ref(false);

const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const fetchPokemonDetails = async () => {
  if (!data.value) return;

  try {
    const cards = await Promise.all(
      data.value.map(async (pokemon: Pokemon) => {
        const response = await fetch(pokemon.url);
        if (!response.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
        const details: PokemonCard = await response.json();
        return formatPokemonDetails(details);
      })
    );

    pokemonList.value = cards;
    resetGame();
  } catch (err) {
    console.error(err);
  }
};

const match = (card: GameCard) => {
  if (isChecking.value) return;
  if (card.flipped || card.matched) {
    return;
  }

  card.flipped = true;

  if (!selectedCard.value.first) {
    selectedCard.value.first = card;
    return;
  }

  selectedCard.value.second = card;
  isChecking.value = true;

  const first = selectedCard.value.first;
  const second = selectedCard.value.second;

  if (first.id === second.id) {
    first.matched = true;
    second.matched = true;

    score.value++;

    selectedCard.value.first = null;
    selectedCard.value.second = null;

    isChecking.value = false;
  } else {
    setTimeout(() => {
      first.flipped = false;
      second.flipped = false;

      selectedCard.value.first = null;
      selectedCard.value.second = null;

      isChecking.value = false;
    }, 1000);
  }
};

const resetGame = () => {
  selectedCard.value.first = null;
  selectedCard.value.second = null;
  score.value = 0
  
  gameBoard.value = shuffle(
    [...pokemonList.value, ...pokemonList.value].map((pokemon) => ({
      ...pokemon,
      uuid: crypto.randomUUID(),
      flipped: false,
      matched: false,
    }))
  );
};

watch(
  data,
  async (newData) => {
    if (!newData) return;
    await fetchPokemonDetails();
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-dvh overflow-hidden bg-tech-bg text-slate-100 font-mono flex flex-col">
    <header class="text-center py-3 px-4 shrink-0">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-tech-cyan uppercase">
        &lt;PokeMatch /&gt;
      </h1>

      <p class="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase">Initialize memory matrix pairing sequence...</p>
    </header>

    <div v-if="loading" class="flex-1 flex flex-col justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tech-cyan"></div>
      <p class="mt-4 text-xs uppercase">Loading...</p>
    </div>

    <div v-else-if="error" class="flex-1 flex justify-center items-center p-4">{{ error }}</div>

    <div v-else class="flex-1 flex flex-col px-3 pb-3 overflow-hidden">
      <div class="flex justify-between items-center">
        <p>Score: {{ score }}</p>

        <button class=" cursor-pointer mb-3 self-center px-5 py-2 border-2 border-tech-cyan rounded text-xs uppercase shrink-0" @click="resetGame">
          Reset Game
        </button>
      </div>
    

      <div class="flex-1 grid grid-cols-4 grid-rows-5 gap-2">
        <div v-for="card in gameBoard" :key="card.uuid" class="card-container cursor-pointer" @click="match(card)">
          <div class="card-inner" :class="{'is-flipped': card.flipped || card.matched,'is-matched': card.matched}">
            <div class="card-back rounded-lg border border-tech-cyan-border/40 bg-tech-panel">
              <span class="text-lg sm:text-xl opacity-30">//</span>
            </div>

            <div class="card-front rounded-lg border-2 border-tech-cyan bg-tech-panel p-2">
              <img
                class="w-[65%] h-[65%] object-contain"
                :src="card.sprites.other['official-artwork'].front_default"
                :alt="card.name"
              />

              <span class="mt-1 text-[8px] sm:text-[10px] uppercase truncate w-full text-center">{{ card.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;

  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;

  transition: transform 0.4s;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(0deg);
}

.card-front {
  transform: rotateY(180deg);
}
</style>