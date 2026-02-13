// hooks/use-variant-inventory.ts
import { fetchVariantInventory } from "@lib/data/products"
import { useQuery } from "@tanstack/react-query"

export function useVariantInventory(productId: string ,countryCode :string) {
  
  return useQuery({
    queryKey: ["variant-inventory", productId],
    queryFn: () => fetchVariantInventory({productId,countryCode }),
    enabled: !!productId,
    refetchOnWindowFocus: true
    // staleTime: 1000 * 60 * 5,
  })
}