type ConvertToLocaleParams = {
  amount: number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  locale = "fa-IR",
}: ConvertToLocaleParams) => {
  return new Intl.NumberFormat(locale, {
    style: "decimal", // decimal style → no currency symbol
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}
