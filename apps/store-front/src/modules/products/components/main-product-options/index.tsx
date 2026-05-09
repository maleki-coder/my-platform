"use client"

import { getProductMainOptions } from "@lib/data/products"
import { useEffect, useState } from "react"

type MainCharacterOptionsProps = {
  productId: string
}

const MAX_MAIN_OPTIONS = 4

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
          // Limit to first 4 options
          setOptions(result.main_options.slice(0, MAX_MAIN_OPTIONS))
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

  const handleViewAllSpecs = () => {
    // Dispatch custom event to scroll to technical specs
    window.dispatchEvent(new CustomEvent("scrollToTechnicalSpecs"))
  }

  if (loading) {
    return (
      <div className="overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                colSpan={3}
                className="w-full px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="h-4 bg-gray-200 animate-pulse w-32" />
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {[1, 2, 3].map((index) => (
              <tr key={index} className="animate-pulse">
                <td colSpan={1} className="w-1/3 px-6 py-4">
                  <div className="h-4 bg-gray-200 w-24" />
                </td>

                <td colSpan={2} className="w-2/3 px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="h-7 bg-gray-200 rounded-md w-20" />
                    <div className="h-7 bg-gray-200 rounded-md w-16" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-500 py-4">{error}</div>
  }

  if (options.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full table-fixed">
        <colgroup>
          <col span={1} />
          <col span={1} />
          <col span={1} />
          <col span={1} />
        </colgroup>
        <thead className="border-b border-gray-200">
          <tr>
            <th
              scope="col"
              colSpan={4}
              className="w-full px-6 py-3 text-right text-xs font-bold md:text-sm text-gray-500 uppercase tracking-wider"
            >
              ویژگی ها
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {options.map((opt) => (
            <tr key={opt.id} className="hover:bg-gray-50 transition-colors">
              <td
                colSpan={2}
                className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900"
              >
                {opt.title}
              </td>

              <td colSpan={2} className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                <div className="flex flex-wrap gap-2">
                  {opt.values?.map((val: any) => (
                    <span
                      key={val.value}
                      className="px-2 py-1 bg-gray-200 rounded-md border text-xs wrap-break-word max-w-full"
                    >
                      {val.value}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={4} className="py-3">
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 border-t-2 border-dotted"></div>
                <button
                  onClick={handleViewAllSpecs}
                  className="text-sm font-medium cursor-pointer border p-2 rounded-md whitespace-nowrap"
                >
                  مشاهده همه ویژگی ها
                </button>
                <div className="flex-1 border-t-2 border-dotted"></div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default MainCharacterOptions
