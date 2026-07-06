<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{
  (e: "close"): void;
}>();

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <Transition name="fade">
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
      <Transition name="drawer">
        
        <div class="absolute right-0 top-0 h-full w-full bg-slate-900 shadow-2xl md:w-107.5 flex flex-col overflow-hidden">

          <div class="flex h-full flex-col p-4 md:hidden">
            <div class="flex justify-end p-2">
              <button @click="emit('close')" class="cursor-pointer text-xl text-white hover:text-red-700">✕</button>
            </div>
            <div class="flex-1 overflow-y-auto px-2 pb-6">
              <div class="rounded-3xl border border-cyan-900/40 bg-slate-900 p-6 shadow-xl">
                <slot />
              </div>
            </div>
          </div>

          <div class="hidden h-full md:block relative flex-1 overflow-y-auto p-8">
            <button @click="emit('close')" class="text-[0.8rem] cursor-pointer absolute right-5 top-5 rounded-full p-1 text-white hover:text-red-700 z-10">✕</button>
            <slot />
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active{
    transition:opacity .25s;
}

.fade-enter-from,
.fade-leave-to{
    opacity:0;
}

.drawer-enter-active,
.drawer-leave-active{
    transition:transform .3s ease;
}

.drawer-enter-from,
.drawer-leave-to{
    transform:translateX(100%);
}

@media (max-width:768px){

.drawer-enter-from,
.drawer-leave-to{
    transform:scale(.9);
}
}
</style>