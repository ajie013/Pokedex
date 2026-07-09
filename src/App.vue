<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import { usePokemonStore } from "./stores/usePokemonStore.ts";
import type { ApiResponse } from "./types/ApiResult.ts";
import { useFetch } from "./composables/useFetch.ts";

const store = usePokemonStore();
//fetches all the pokemon (name and url)
const { data, loading, error } = useFetch<ApiResponse>(
  "https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0"
);

watch(data, (newData) => {
  if (newData?.results) {
    store.setIndexData([...newData.results]);
    store.startBackgroundSync(); //fetch pokemons details
  }
});

const isVisible = ref(false);

const handleScroll = () => {
  if (typeof window !== "undefined") {
    isVisible.value = window.scrollY > 100;
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  // Removed old manual store fetching methods since useFetch handles it synchronously now!
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-tech-bg via-tech-panel to-tech-bg text-white relative">
    
    <Navigation />

    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-tech-cyan/10 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-120 w-120 rounded-full bg-cyan-500/5 blur-3xl"></div>
    </div>

    <main class="mx-auto max-w-7xl px-6 py-8">
      <RouterView />
    </main>

    <button @click="scrollToTop" class="fixed bottom-6 right-6 z-50 p-3 rounded-xl border cursor-pointer transition-all duration-300 shadow-lg backdrop-blur-md flex items-center justify-center group" :class="isVisible 
        ? 'opacity-100 translate-y-0 pointer-events-auto bg-slate-900/60 border-cyan-500/30 text-cyan-400 shadow-cyan-950/40 hover:border-cyan-400 hover:bg-cyan-950/30 hover:-translate-y-1' : 'opacity-0 translate-y-4 pointer-events-none'" aria-label="Back to top">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
      </svg>
    </button>

  </div>
</template>