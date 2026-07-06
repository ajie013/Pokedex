<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

interface NavLink {
  name: string;
  path: string;
  icon: "home" | "ball" | "heart";
}

const navLinks = ref<NavLink[]>([
  { name: "Home", path: "/", icon: "home" },
  { name: "Pokédex", path: "/pokedex", icon: "ball" },
  { name: "Favorites", path: "/favorite", icon: "heart" },
]);

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-tech-cyan-border bg-tech-panel/95 backdrop-blur-xl shadow-lg">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

      <RouterLink to="/" @click="closeSidebar" class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-tech-cyan bg-tech-active shadow-[0_0_15px_rgba(34,211,238,.25)]" >
          <div class="h-3 w-3 rounded-full bg-tech-cyan"></div>
        </div>

        <div class="leading-none">
          <h1 class="text-xl font-black tracking-wide text-white">Poké<span class="text-tech-cyan">Dex</span></h1>

          <p class="text-[11px] uppercase tracking-[0.3em] text-gray-400">Generation Viewer</p>
        </div>
      </RouterLink>

      <div class="hidden items-center gap-2 rounded-xl border border-tech-cyan-border bg-tech-active/80 p-1 md:flex">
        <RouterLink v-for="link in navLinks" :key="link.name" :to="link.path"
          class="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-gray-200 transition-all duration-200 hover:bg-tech-cyan-hover hover:text-white"
          active-class="bg-tech-cyan text-black shadow-md"
        >
          <!-- HOME -->
          <svg
            v-if="link.icon === 'home'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 0 0 5.625 21H9.75v-4.875A1.125 1.125 0 0 1 10.875 15h2.25a1.125 1.125 0 0 1 1.125 1.125V21h4.125A1.125 1.125 0 0 0 19.5 19.875V9.75"
            />
          </svg>

          <!-- POKEDEX -->
          <svg
            v-if="link.icon === 'ball'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>

          <!-- FAVORITES -->
          <svg
            v-if="link.icon === 'heart'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25C21 5.903 19.097 4 16.75 4c-1.657 0-3.097.948-3.75 2.333C12.347 4.948 10.907 4 9.25 4 6.903 4 5 5.903 5 8.25 5 15 13 20 13 20s8-5 8-11.75Z"
            />
          </svg>

          {{ link.name }}
        </RouterLink>
      </div>

      <!-- MOBILE BUTTON -->
      <button
        @click="toggleSidebar"
        class="rounded-lg border border-tech-cyan-border bg-tech-active p-2 text-white transition hover:bg-tech-cyan-hover md:hidden"
      >
        <svg
          v-if="!isSidebarOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </nav>

  <!-- OVERLAY -->
  <div
    v-if="isSidebarOpen"
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
    @click="closeSidebar"
  ></div>

  <!-- MOBILE SIDEBAR -->
  <aside :class="['fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-tech-cyan-border bg-tech-panel transition-transform duration-300 md:hidden',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="border-b border-tech-cyan-border p-6">
      <h2 class="text-2xl font-bold text-white">
        Poké<span class="text-tech-cyan">Dex</span>
      </h2>

      <p class="mt-1 text-sm text-gray-400">
        Navigation
      </p>
    </div>

    <nav class="flex flex-1 flex-col gap-2 p-4">
      <RouterLink
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        @click="closeSidebar"
        class="rounded-lg px-4 py-3 font-medium text-gray-200 transition hover:bg-tech-cyan-hover hover:text-white"
        active-class="bg-tech-cyan text-black"
      >
        {{ link.name }}
      </RouterLink>
    </nav>

    <div
      class="border-t border-tech-cyan-border p-4 text-xs text-gray-500"
    >
      Pokédex v1.0
    </div>
  </aside>
</template>