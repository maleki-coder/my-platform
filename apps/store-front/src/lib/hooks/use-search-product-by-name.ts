"use client";

import { useQuery } from "@tanstack/react-query";
import { HttpTypes } from "@medusajs/types";
import { queryProducts } from "@lib/data/products";

export const useSearchProductsByName = (name: string) => {
  return useQuery<Array<HttpTypes.StoreProduct>>({
    queryKey: ["products", name],
    queryFn: () => queryProducts(name),
    enabled: !!name, // only fetch if name is not empty
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
    gcTime: 1000 * 60 * 30, // keep in memory 30 minutes
    refetchOnWindowFocus: false,
    placeholderData : []
  });
};
