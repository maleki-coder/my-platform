// useSheet.ts
"use client"
import { useState, useCallback, useEffect } from "react"

type SheetState = {
  open: boolean
  setOpen: (value: boolean) => void
  openSheet: () => void
  closeSheet: () => void
  toggleSheet: () => void
}

let globalOpen = false
const listeners = new Set<(open: boolean) => void>()

export function useSideBarSheet(): SheetState {
  const [open, setOpenState] = useState(globalOpen)

  const setOpen = useCallback((value: boolean) => {
    globalOpen = value
    listeners.forEach((fn) => fn(value))
    setOpenState(value)
  }, [])

  const openSheet = useCallback(() => setOpen(true), [setOpen])
  const closeSheet = useCallback(() => setOpen(false), [setOpen])
  const toggleSheet = useCallback(() => setOpen(!globalOpen), [setOpen])

  useEffect(() => {
    listeners.add(setOpenState)
    return () => {
      listeners.delete(setOpenState)
    }
  }, [])

  return { open, setOpen, openSheet, closeSheet, toggleSheet }
}
