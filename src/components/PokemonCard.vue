<script setup lang="ts">
import type { PokemonCard, PokemonSpecies } from "@/types/Pokemon";
import Modal from "./Modal.vue";
import { onMounted, onUnmounted, ref, computed } from "vue";
import {  TYPECOLORS } from "@/constants/Pokemon.ts";
import PokemonDetails from "./PokemonDetails.vue";

const props = defineProps<{
  pokemon: PokemonCard;
}>();

const showViewModal = ref(false)
const species = ref<PokemonSpecies | null>(null);
const viewPokemon = () =>{
  showViewModal.value = true
}
const retryCount = ref(0);
const MAX_RETRIES = 3;
const cardRef = ref<HTMLElement | null>(null);;
const imageSrc = ref("");
const imageLoading = ref(true);
const imageError = ref(false);
let observer: IntersectionObserver | null = null;

onMounted( async() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) return;

      imageSrc.value = props.pokemon.sprites.other["official-artwork"].front_default;

      imageLoading.value = true;
      imageError.value = false;

      observer?.disconnect();
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "100px",
    }
  );

  if (cardRef.value) {
    observer.observe(cardRef.value);
  }

  await getSpecies()
});



const getSpecies = async () =>{
  try {
    const response = await fetch(props.pokemon.species.url)
    const data = await response.json()
    species.value = formatSpecie(data)
  } catch (err) {
    console.error("Failed to parse species rarity metadata matrix:", err);
  }
}

const formatSpecie = (item: any): PokemonSpecies => ({
  gender_rate: item.gender_rate,
  hatch_counter: item.hatch_counter,
  egg_groups: item.egg_groups,
  evolution_chain: item.evolution_chain,
  is_legendary: item.is_legendary ?? false,
  is_mythical: item.is_mythical ?? false,
  generation: item.generation
});

const cardRarityClasses = computed(() => {
  if (!species.value) return 'border-cyan-900/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]';
  
  if (species.value.is_legendary) {
    return 'border-amber-500/50 legendary-fire';
  }
  
  if (species.value.is_mythical) {
    return 'border-purple-500/50 mythical-fire';
  }
  
  return 'border-cyan-900/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]';
});

onUnmounted(() => {
  observer?.disconnect();
});



const retryImage = (event: Event) => {
  if (retryCount.value >= MAX_RETRIES) {
    imageLoading.value = false;
    imageError.value = true; 
    return;
  }

  imageError.value = true;
  imageLoading.value = true;

  const img = event.target as HTMLImageElement;
  const src = img.src;

  setTimeout(() => {
    imageError.value = false;

    img.src = "";
    img.src = src;
  }, 2000 * retryCount.value);
};

const getTypeIcon = (type: string) => {
  return `/pokemon-types/${type.toLowerCase()}.png`;
};
</script>

<template>
  <div 
    :title="pokemon.name" 
    @click="viewPokemon" 
    :class="['group h-full flex flex-col cursor-pointer overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 to-slate-950 transition-all duration-300 hover:-translate-y-2', cardRarityClasses]"
  >
    <div class="relative flex h-44 items-center justify-center overflow-hidden border-b border-cyan-900/20 bg-linear-to-br from-slate-800 via-slate-900 to-slate-950">
     <div 
  v-if="species?.is_legendary || species?.is_mythical"
  :class="[
    'absolute inset-0 pointer-events-none mix-blend-screen opacity-75 group-hover:opacity-100 transition-opacity duration-200 z-0',
    species.is_legendary ? 'legendary-particles' : 'mythical-particles'
  ]"
></div>

      <p class="absolute top-2 left-2 mt-4 font-mono text-[0.6rem] tracking-wider text-slate-400">#{{ pokemon.id.toString().padStart(3, "0") }}</p>

      <div ref="cardRef" class="relative">
        <div v-if="imageLoading" class="absolute inset-0 z-20 flex flex-col items-center justify-center">
          <div :class="['h-6 w-6 animate-spin rounded-full border-2 border-t-transparent', species?.is_legendary ? 'border-amber-400' : species?.is_mythical ? 'border-purple-400' : 'border-cyan-400']"></div>
          <span class="mt-2 text-xs text-slate-400">
            {{ imageError ? "Retrying..." : "Loading..." }}
          </span>
        </div>

        <img v-if="imageSrc" :src="imageSrc" :alt="pokemon.name" loading="lazy" @load="imageLoading = false" @error="retryImage" class="relative z-10 h-32 w-32 object-contain transition duration-300 group-hover:scale-110"/>
      </div>

      <div v-if="pokemon.isFavorite" class="absolute top-3 right-2 transition-all hover:scale-110">
        <img src="../../public/heart-shade.svg" class="h-3 w-6" alt=""/>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h2 class="text-center text-lg font-bold capitalize tracking-wide text-white">
        {{ pokemon.name.length > 20 ? `${pokemon.name.substring(0, 20)}...` : pokemon.name}}
      </h2>

      <div v-if="species?.is_legendary || species?.is_mythical" class="text-center pt-1">
        <span :class="['text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border', species.is_legendary ? 'text-amber-400 border-amber-500/30 bg-amber-950/20' : 'text-purple-400 border-purple-500/30 bg-purple-950/20']">
          {{ species.is_legendary ? 'Legendary' : 'Mythical' }}
        </span>
      </div>
    <div class="mt-auto flex flex-wrap justify-center gap-2 pt-4">
      <span v-for="type in pokemon.types" :key="type.type.name" :class="['inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
          TYPECOLORS[type.type.name.toUpperCase()] || 'bg-slate-600 text-white']">
        <img
          :src="getTypeIcon(type.type.name)"
          :alt="type.type.name"
          class="h-4 w-4 object-contain"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />

        <span class="capitalize">
          {{ type.type.name }}
        </span>
      </span>
    </div>
    </div>
  </div>

  <Modal v-if="showViewModal" @close="showViewModal = false">
    <PokemonDetails :pokemon="pokemon" />
  </Modal>
</template>

<style scoped>
.legendary-fire {
  box-shadow: 
    0 -4px 12px rgba(252, 211, 77, 0.4),
    0 -10px 20px rgba(245, 158, 11, 0.3),
    0 -18px 35px rgba(239, 68, 68, 0.2); 
  animation: igniteLegendary 1.5s ease-in-out infinite alternate;
}

.legendary-fire:hover {
  animation: intenseIgniteLegendary 0.8s ease-in-out infinite alternate;
}

.mythical-fire {
  box-shadow: 
    0 -4px 12px rgba(192, 132, 252, 0.4), 
    0 -10px 20px rgba(168, 85, 247, 0.3), 
    0 -18px 35px rgba(236, 72, 153, 0.2);
  animation: igniteMythical 1.8s ease-in-out infinite alternate;
}

.mythical-fire:hover {
  animation: intenseIgniteMythical 0.9s ease-in-out infinite alternate;
}

@keyframes igniteLegendary {
  0% {
    box-shadow: 
      0 -2px 10px rgba(252, 211, 77, 0.35),
      0 -6px 18px rgba(245, 158, 11, 0.25),
      0 -14px 28px rgba(239, 68, 68, 0.15);
  }
  100% {
    box-shadow: 
      0 -5px 15px rgba(252, 211, 77, 0.5),
      0 -12px 25px rgba(245, 158, 11, 0.4),
      0 -22px 40px rgba(239, 68, 68, 0.25);
  }
}

@keyframes intenseIgniteLegendary {
  0% {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 
      0 -6px 18px rgba(252, 211, 77, 0.6),
      2px -12px 28px rgba(245, 158, 11, 0.45),
      -2px -25px 45px rgba(239, 68, 68, 0.35);
  }
  50% {
    box-shadow: 
      -1px -4px 14px rgba(252, 211, 77, 0.5),
      -3px -14px 32px rgba(245, 158, 11, 0.55),
      3px -20px 40px rgba(239, 68, 68, 0.3);
  }
  100% {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 
      2px -7px 22px rgba(252, 211, 77, 0.75),
      -1px -16px 35px rgba(245, 158, 11, 0.5),
      1px -30px 55px rgba(239, 68, 68, 0.45);
  }
}

@keyframes igniteMythical {
  0% {
    box-shadow: 
      0 -2px 10px rgba(192, 132, 252, 0.35),
      0 -6px 18px rgba(168, 85, 247, 0.25),
      0 -14px 28px rgba(236, 72, 153, 0.15);
  }
  100% {
    box-shadow: 
      0 -5px 15px rgba(192, 132, 252, 0.5),
      0 -12px 25px rgba(168, 85, 247, 0.4),
      0 -22px 40px rgba(236, 72, 153, 0.25);
  }
}

@keyframes intenseIgniteMythical {
  0% {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 
      0 -6px 18px rgba(192, 132, 252, 0.6),
      -2px -12px 28px rgba(168, 85, 247, 0.45),
      2px -25px 45px rgba(236, 72, 153, 0.35);
  }
  50% {
    box-shadow: 
      2px -4px 14px rgba(192, 132, 252, 0.5),
      3px -14px 32px rgba(168, 85, 247, 0.55),
      -3px -20px 40px rgba(236, 72, 153, 0.3);
  }
  100% {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 
      -2px -7px 22px rgba(192, 132, 252, 0.75),
      1px -16px 35px rgba(168, 85, 247, 0.5),
      -1px -30px 55px rgba(236, 72, 153, 0.45);
  }
}

</style>