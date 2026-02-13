import { listHeroCategories } from "@lib/data/categories"
import { useQuery } from "@tanstack/react-query"

export function useFetchHeroCategories(
  metadataTag?: string,
  query?: Record<string, any>
) {
  return useQuery({
    queryKey: ["hero-categories", metadataTag, query?.limit || 100],
    queryFn: () => listHeroCategories(metadataTag, query),
    staleTime: 0, // 5 minutes
  })
}
