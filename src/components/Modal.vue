<script setup lang="ts">
const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <Transition name="fade">

    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
      <Transition name="drawer">
        <div class="absolute right-0 top-0 h-full w-full bg-slate-900 shadow-2xl md:w-107.5">

          <!-- Mobile -->
          <div class="flex h-full items-center justify-center p-5 md:hidden">
            <div class="relative w-full max-w-sm rounded-3xl border border-cyan-900/40 bg-slate-900 p-6">
              <button @click="emit('close')" class="absolute  cursor-pointer right-4 top-4 text-white hover:text-red-700">✕</button>

              <slot />
            </div>
          </div>

          <!-- Desktop -->
          <div class="hidden h-full md:block">
            <button @click="emit('close')" class=" text-[0.8rem] cursor-pointer absolute right-5 top-5 rounded-full p-1 text-white hover:text-red-700">✕</button>
            <div class="h-full overflow-y-auto p-8">
              <slot />
            </div>
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