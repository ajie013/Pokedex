import type { PokemonCard } from "@/types/Pokemon";
import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";

export const useImageLoader = (imageUrl: Ref<string>, lazy = true) =>{
  const retryCount = ref(0);
  const MAX_RETRIES = 3;
  const cardRef = ref<HTMLElement | null>(null);;
  const imageSrc = ref("");
  const imageLoading = ref(true);
  const imageError = ref(false);
  let observer: IntersectionObserver | null = null;

 onMounted(() => {
  if (!lazy) {
    imageSrc.value = imageUrl.value;
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) return;

      imageSrc.value = imageUrl.value;

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
});

watch(imageUrl, () => {
    imageLoading.value = true;
    imageError.value = false;
    imageSrc.value = imageUrl.value;
});

  const onImageLoad = () => {
    imageLoading.value = false;
    imageError.value = false;
    retryCount.value = 0;
  };

  onUnmounted(() => {
    observer?.disconnect();
  });

  const retryImage = (event: Event) => {
    if (retryCount.value >= MAX_RETRIES) {
      imageLoading.value = false;
      imageError.value = true; 
      return;
    }

    retryCount.value++;
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

  return{
    retryImage,
    onImageLoad,
    imageError,
    imageLoading,
    imageSrc,
    cardRef
  }

}
