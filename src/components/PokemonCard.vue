<script setup lang="ts">
import type { PokemonCard } from "@/types/Pokemon";
import Modal from "./Modal.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { TYPECOLORS } from "@/constants/Pokemon.ts";
import PokemonDetails from "./PokemonDetails.vue";

const props = defineProps<{
  pokemon: PokemonCard;
}>();

const showViewModal = ref(false)

const viewPokemon = () =>{
  showViewModal.value = true
}

const cardRef = ref<HTMLElement | null>(null);
const imageSrc = ref("");

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) return;

      imageSrc.value =
        props.pokemon.sprites.other["official-artwork"].front_default;

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
});

onUnmounted(() => {
  observer?.disconnect();
});

const retryImage = (event: Event) => {
  const img = event.target as HTMLImageElement;
  const src = img.src;

  setTimeout(() => {
    img.src = "";
    img.src = src;
  }, 1000);
};
// const retryImage = (e: Event) => {
//   const img = e.target as HTMLImageElement
//   const src = img.src

//   setTimeout(() => {
//     img.src = ""
//     img.src = src
//   }, 1000)
// }

</script>

<template>
  <div :title="pokemon.name" @click="viewPokemon" class="group h-full flex flex-col cursor-pointer overflow-hidden rounded-3xl border border-cyan-900/30 bg-linear-to-b from-slate-900 to-slate-950 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
    <div class="relative flex h-44 items-center justify-center overflow-hidden border-b border-cyan-900/20 bg-linear-to-br from-slate-800 via-slate-900 to-slate-950">
      <div class="absolute h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/20"></div>

      <p class="absolute top-2 left-2 mt-4 font-mono text-[0.6rem] tracking-wider text-slate-400">#{{ pokemon.id.toString().padStart(3, "0") }}</p>

      <div ref="cardRef">
        <img v-if="imageSrc" :src="imageSrc" :alt="pokemon.name" loading="lazy" @error="retryImage" class="relative z-10 h-32 w-32 object-contain transition duration-300 group-hover:scale-110"/>
      </div>

      <div v-if="pokemon.isFavorite" class="absolute top-3 right-2 transition-all hover:scale-110">
        <img src="../../public/heart-shade.svg" class="h-3 w-6" alt=""/>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h2 class="text-center text-lg font-bold capitalize tracking-wide text-white">
        {{ pokemon.name.length > 20 ? `${pokemon.name.substring(0, 20)}...` : pokemon.name}}
      </h2>

      <div class="mt-auto flex flex-wrap justify-center gap-2 pt-4">
        <span v-for="type in pokemon.types" :key="type.type.name" :class="['rounded-full px-3 py-1 text-xs font-semibold shadow-sm', TYPECOLORS[type.type.name.toUpperCase()] ||'bg-slate-600 text-white']">
          {{ type.type.name }}
        </span>
      </div>
    </div>
  </div>

  <Modal v-if="showViewModal" @close="showViewModal = false">
    <PokemonDetails :pokemon="pokemon" />
  </Modal>
</template>