import { onMounted, readonly, ref, type WatchSource } from 'vue'

export const useFetch = <T>(urlSource: string | (() => string)) => {
  const data = ref<T>() 
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    try {
      loading.value = true
      
      const url = typeof urlSource === 'function' ? urlSource() : urlSource
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Fetch failed')
      }
      const datas = await response.json()
      data.value = datas.results
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      console.log('Something went wrong')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchData()
  })

  return {
    data: readonly(data),
    loading,
    error,
    fetchData
  }
}