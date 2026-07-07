<script setup lang="ts">
import type { PokemonCard } from "@/types/Pokemon";
import Modal from "./Modal.vue";
import { ref } from "vue";
import { TYPECOLORS } from "@/constants/Pokemon.ts";
import PokemonDetails from "./PokemonDetails.vue";

defineProps<{
  pokemon: PokemonCard;
}>();

const showViewModal = ref(false)

const viewPokemon = () =>{
  showViewModal.value = true
}

const onToggleFavorite = (item: PokemonCard) =>{

}
</script>

<template>
  <div 
    @click="viewPokemon"
    class="group  cursor-pointer overflow-hidden rounded-3xl border border-cyan-900/30 bg-linear-to-b from-slate-900 to-slate-950 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
    <div class="relative flex h-44 items-center justify-center overflow-hidden border-b border-cyan-900/20 bg-linear-to-br from-slate-800 via-slate-900 to-slate-950" >
      <div class="absolute h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/20" ></div>
      <p class="absolute top-2 left-2 font-light  text-[0.6rem] text-slate-400 font-mono tracking-wider text-xs mt-4">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
      <img :src="pokemon.sprites.other['official-artwork'].front_default" :alt="pokemon.name" class="relative z-10 h-32 w-32 object-contain transition duration-300 group-hover:scale-110"/>
      
      <div v-if="pokemon.isFavorite" class=" object-contain absolute top-3 right-2 hover:scale-3d transition-all">
          <img src="../../public/heart-shade.svg" class="h-3 w-6" alt="">
        </div>
    </div>

    <div class="space-y-4 p-5">

      <div class="text-center">
        <h2 class="text-lg font-bold capitalize tracking-wide text-white">{{ pokemon.name }}</h2>
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        <span
          v-for="type in pokemon.types"
          :key="type.type.name"
          :class="[
            'rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
            TYPECOLORS[type.type.name.toUpperCase()] || 'bg-slate-600 text-white'
          ]"
        >
          {{ type.type.name }}
        </span>
      </div>

    </div>
  </div>

<Modal v-if="showViewModal" @close="showViewModal = false">
  <PokemonDetails :pokemon="pokemon" @toggle-update="onToggleFavorite"/>
</Modal>

</template>