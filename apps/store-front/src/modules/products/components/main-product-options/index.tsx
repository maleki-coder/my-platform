"use client"

import { Spinner } from "@lib/components/ui/spinner"
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
    let isMounted = true

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
    return <Spinner />
  }

  if (error) {
    return <div className="text-sm text-red-500 py-4">{error}</div>
  }

  if (options.length === 0) {
    return null
  }

  return (
   <div className="border rounded-xl overflow-hidden shadow-sm">
  <table className="w-full table-fixed divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {/* FIX: Set colSpan={3} so the header spans all 3 conceptual columns */}
        <th
          scope="col"
          colSpan={3}
          className="w-full px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          ویژگی های اصلی
        </th>
      </tr>
    </thead>

    <tbody className="bg-white divide-y divide-gray-200">
      {options.map((opt) => (
        <tr key={opt.id} className="hover:bg-gray-50 transition-colors">
          
          {/* FIX: Title takes 1 column (w-1/3) */}
          <td 
            colSpan={1} 
            className="w-1/3 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate"
          >
            {opt.title}
          </td>

          {/* 🚀 FIX: Values take 2 columns (colSpan={2} and w-2/3) */}
          <td 
            colSpan={2} 
            className="w-2/3 px-6 py-4 text-sm text-gray-600"
          >
            <div className="flex flex-wrap gap-2">
              {opt.values?.map((val: any) => (
                <span
                  key={val.value}
                  className="px-2 py-1 bg-gray-100 rounded-md border text-xs break-words max-w-full"
                >
                  {val.value}
                </span>
              ))}
            </div>
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

  )
}

export default MainCharacterOptions
