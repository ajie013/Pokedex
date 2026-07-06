<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";


</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-tech-bg via-tech-panel to-tech-bg text-white">
    
    <Navigation />

    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-tech-cyan/10 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-120 w-120 rounded-full bg-cyan-500/5 blur-3xl"></div>
    </div>

    <main class="mx-auto max-w-7xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>