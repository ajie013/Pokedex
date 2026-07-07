<script setup lang="ts">
defineProps<{
  sub?: string;
  titleFirst: string;
  titleSecond: string;
  content: string;
}>();
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl border border-cyan-900/40 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
    <div class="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
    <div class="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl"></div>

    <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex-1">
        <p v-if="sub" class="mb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">{{ sub }}</p>
        <h1 class="text-3xl font-black tracking-tight text-white lg:text-4xl">
          {{ titleFirst }}<span class="text-cyan-400">{{ titleSecond }}</span>
        </h1>
        <p class="mt-2 max-w-xl text-xs text-slate-400 leading-relaxed">
          {{ content }}
        </p>
      </div>

      <div class="shrink-0">
        <slot />
      </div>
    </div>
  </div>
</template>