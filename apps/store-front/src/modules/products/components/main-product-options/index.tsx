"use client"

import { getProductMainOptions } from "@lib/data/products"
import { useEffect, useState } from "react"

type MainCharacterOptionsProps = {
  productId: string
}

const MainCharacterOptions = ({ productId }: MainCharacterOptionsProps) => {
  const [options, setOptions] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true; // Prevents state updates if component unmounts

    const fetchVIPs = async () => {
      setLoading(true)
      const result = await getProductMainOptions(productId)
      
      if (isMounted) {
        if (result.success && result.main_options) {
          setOptions(result.main_options)
        } else {
          setError(result.error || "Failed to summon the main characters.")
        }
        setLoading(false)
      }
    }

    fetchVIPs()

    return () => {
      isMounted = false
    }
  }, [productId])

  if (loading) {
    return <div className="animate-pulse text-sm text-gray-500 py-4">Loading VIP options... $O(1)$ magic happening! ✨</div>
  }

  if (error) {
    return <div className="text-sm text-red-500 py-4">{error}</div>
  }

  if (options.length === 0) {
    return null // Hide entirely if no main characters exist!
  }

  return (
    <div className="my-6 border rounded-xl overflow-hidden shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              VIP Feature
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Available Options
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {options.map((opt) => (
            <tr key={opt.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {opt.title} ⭐️
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex gap-2">
                {opt.values?.map((val: any) => (
                  <span key={val.value} className="px-2 py-1 bg-gray-100 rounded-md border text-xs">
                    {val.value}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MainCharacterOptions
