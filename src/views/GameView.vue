<script setup lang="ts">
import { ref, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import type {
  Pokemon,
  PokemonCard,
} from "@/types/Pokemon";
import type { GamePokemonDetail } from "@/types/Game";
import Header from "@/components/Header.vue";

interface GameCard extends GamePokemonDetail {
  uuid: string;
  flipped: boolean;
  matched: boolean;
}

const randomNumber = Math.floor(Math.random() * 1000);
const pokemonList = ref<GamePokemonDetail[]>([]);
const gameBoard = ref<GameCard[]>([]);
const score = ref(0);
const isGameOver = ref(false);

const selectedCard = ref<{
  first: GameCard | null;
  second: GameCard | null;
}>({
  first: null,
  second: null,
});

const { data, loading, error } = useFetch<Pokemon[]>(
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
  if (isChecking.value || isGameOver.value) return;
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
  score.value = 0;
  isGameOver.value = false;
  
  gameBoard.value = shuffle(
    [...pokemonList.value, ...pokemonList.value].map((pokemon) => ({
      ...pokemon,
      uuid: crypto.randomUUID(),
      flipped: false,
      matched: false,
    }))
  );
};

watch( gameBoard, (newBoard) => {
    if (newBoard.length > 0 && newBoard.every((item) => item.matched)) {
      setTimeout(() => {
        isGameOver.value = true;
      }, 600);
    }
  },
  { deep: true }
);

watch(data, async (newData) => {
    if (!newData) return;
    await fetchPokemonDetails();
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-dvh overflow-hidden bg-tech-bg text-slate-100 flex flex-col relative">
    
    <div v-if="isGameOver" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="border-2 border-tech-cyan bg-tech-panel p-6 sm:p-8 max-w-sm w-full rounded-lg text-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        <h2 class="text-2xl sm:text-3xl font-black tracking-widest text-tech-cyan uppercase mb-2">
          COMPLETED
        </h2>
        <p class="text-xs text-slate-400 uppercase mb-6">
          Memory matrix successfully aligned.
        </p>
        <div class="bg-black/40 border border-tech-cyan-border/30 rounded py-3 mb-6">
          <p class="text-sm uppercase text-slate-300">Final Score</p>
          <p class="text-3xl font-bold text-tech-cyan mt-1">{{ score }}</p>
        </div>
        <button 
          class="cursor-pointer w-full py-3 bg-tech-cyan/10 hover:bg-tech-cyan/20 border-2 border-tech-cyan text-tech-cyan rounded text-sm font-bold uppercase tracking-wider transition-colors"
          @click="resetGame"
        >
          Initialize Next Run
        </button>
      </div>
    </div>

    <Header 
      sub="SYSTEM: ACTIVE" 
      title-first="<Poké" 
      title-second="Match />" 
      content="Initialize memory matrix pairing sequence... Select matching tiles to align the data grid."
      class=" shrink-0"
    >
      <div class="flex items-center gap-4 bg-slate-950/50 border border-cyan-500/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner min-w-[240px] justify-between self-start lg:self-center">
        <div class="flex flex-col">
          <span class="text-[10px] uppercase text-slate-400 tracking-wider">Current Score</span>
          <span class="text-3xl font-black text-cyan-400 font-mono tracking-widest leading-none mt-1">
            {{ score.toString().padStart(2, '0') }}
          </span>
        </div>
        
        <div class="h-8 w-px bg-cyan-500/20"></div>

        <button 
          class="group cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-cyan-950/30 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-400/40 hover:border-cyan-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[0_0_12px_rgba(34,211,238,0.4)]"
          @click="resetGame"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset
        </button>
      </div>
    </Header>

    <div v-if="loading" class="flex-1 flex flex-col justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tech-cyan"></div>
      <p class="mt-4 text-xs uppercase">Loading Grid Matrix...</p>
    </div>

    <div v-else-if="error" class="flex-1 flex justify-center items-center p-4">{{ error }}</div>

    <div v-else class="flex-1 flex flex-col px-3 pb-3 mt-2 overflow-hidden">
      <div class="flex-1 grid grid-cols-4 grid-rows-5 gap-2">
        <div v-for="card in gameBoard" :key="card.uuid" class="card-container cursor-pointer" @click="match(card)">
          <div class="card-inner" :class="{'is-flipped': card.flipped || card.matched,'is-matched': card.matched}">
            <div class="card-back rounded-lg border border-tech-cyan-border/40 bg-tech-panel">
              <span class="text-lg sm:text-xl opacity-30">//</span>
            </div>

            <div class="card-front rounded-lg border-2 border-tech-cyan bg-tech-panel p-2">
              <img class="w-[65%] h-[65%] object-contain" :src="card.sprites.other['official-artwork'].front_default" :alt="card.name"/>
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>