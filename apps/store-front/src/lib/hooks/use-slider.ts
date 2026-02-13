import { fetchSlides } from '@lib/data/slider'
import { useQuery } from '@tanstack/react-query'

export function useSlider() {
  return useQuery({
    queryKey: ['homepage', 'slides'],
    queryFn: fetchSlides,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}