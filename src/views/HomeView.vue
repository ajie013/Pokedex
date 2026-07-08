<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePokemonStore } from '@/stores/usePokemonStore';

const store = usePokemonStore();

const totalSynced = computed(() => store.pokemonList.length);
const totalFavorites = computed(() => store.pokemonList.filter(p => p.isFavorite).length);

onMounted(async () => {
  await store.fetchSearchIndex(); 
  
  //store.startBackgroundSync(); 
});
</script>

<template>
  <div class="space-y-10 animate-fade-in max-w-6xl mx-auto">
    
    <section class="relative overflow-hidden rounded-2xl border border-cyan-900/40 bg-slate-900/60 p-8 md:p-12 shadow-2xl backdrop-blur-md">
      <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div class="absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-sky-500/5 blur-3xl"></div>

      <div class="relative max-w-2xl">
        <p class="mb-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-400">System Link: Online</p>
        <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl uppercase">Poké<span class="text-cyan-400 font-mono">Matrix</span> OS</h1>
        <p class="mt-4 text-sm text-slate-400 leading-relaxed max-w-xl">
          Welcome to your centralized tactical environment. Access the complete Pokémon indexing registry, review flagged high-priority data cores, or calibrate memory arrays.
        </p>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-800/80 bg-slate-900/30 p-5 backdrop-blur-sm flex flex-col justify-between">
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Database Cores</span>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-4xl font-black font-mono tracking-wider text-white">{{ totalSynced ? totalSynced.toString().padStart(3, '0') : '00' }}</span>
          <span class="text-xs font-bold font-mono text-cyan-400/70">SYNCED</span>
        </div>
      </div>

      <div class="rounded-xl border border-cyan-900/30 bg-cyan-950/10 p-5 backdrop-blur-sm flex flex-col justify-between shadow-inner">
        <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Pinned Signals</span>
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-4xl font-black font-mono tracking-wider text-cyan-400">{{ totalFavorites.toString().padStart(2, '0') }}</span>
          <span class="text-xs font-bold font-mono text-cyan-500/50">FAVORITES</span>
        </div>
      </div>

      <div class="rounded-xl border border-slate-800/80 bg-slate-900/30 p-5 backdrop-blur-sm flex flex-col justify-between">
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Encryption Status</span>
        <div class="mt-4 flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
          <span class="text-lg font-black font-mono tracking-widest text-slate-200 uppercase">SECURE_LINK</span>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 pl-1">Access Terminals</h2>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">     
        <RouterLink to="/pokedex" class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/40">
          <div class="absolute -right-6 -bottom-6 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
            </svg>
          </div>
          <h3 class="text-base font-black uppercase tracking-wider text-white group-hover:text-cyan-400 transition-colors">Database Registry</h3>
          <p class="mt-2 text-xs text-slate-400 leading-relaxed">Query standard indexes, research elemental strengths, or analyze evolution metrics.</p>
          <div class="mt-4 text-[10px] font-bold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Initialize Core Link →</div>
        </RouterLink>

        <RouterLink to="/favorite" class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/40">
          <div class="absolute -right-6 -bottom-6 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <h3 class="text-base font-black uppercase tracking-wider text-white group-hover:text-cyan-400 transition-colors">Storage Matrix</h3>
          <p class="mt-2 text-xs text-slate-400 leading-relaxed">Examine individual records locked down for rapid, customized inspection sequences.</p>
          <div class="mt-4 text-[10px] font-bold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Unlock Array →</div>
        </RouterLink>

        <RouterLink to="/game" class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/40">
          <div class="absolute -right-6 -bottom-6 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-10 text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <h3 class="text-base font-black uppercase tracking-wider text-white group-hover:text-cyan-400 transition-colors">Memory Grid</h3>
          <p class="mt-2 text-xs text-slate-400 leading-relaxed">Synchronize cerebral tracking mechanics by running target node pairing protocols.</p>
          <div class="mt-4 text-[10px] font-bold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Boot Protocol →</div>
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>