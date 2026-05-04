"use client"

import { ReactNode } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@lib/components/ui/button"
import { Spinner } from "@lib/components/ui/spinner"

interface AnimatedCartButtonProps {
    isInCart: boolean
    isAdding: boolean    
    isNavigating: boolean
    isRemoving: boolean  
    onAdd: () => void
    onRemove: (e: React.MouseEvent) => void
    onNavigate: () => void
    addLabel: string
    navigateLabel: string
    AddIcon: ReactNode
    NavigateIcon: ReactNode
    activeClasses: string
    inactiveClasses: string
    baseClasses?: string
}

export default function AnimatedCartButton({
    isInCart,
    isAdding,
    isNavigating,
    isRemoving,
    onAdd,
    onRemove,
    onNavigate,
    addLabel,
    navigateLabel,
    AddIcon,
    NavigateIcon,
    activeClasses,
    inactiveClasses,
    baseClasses = "rounded-xl font-medium h-12 flex items-center justify-center relative",
}: AnimatedCartButtonProps) {
    // A helper variable to disable interactions while ANY action is processing
    const isAnyActionLoading = isAdding || isNavigating || isRemoving;

    return (
        <div className="relative w-full h-12">  
            {/* --- STATE 1: ADD TO CART --- */}
            <div
                className={`absolute inset-0 w-full transition-opacity duration-500 ease-in-out ${
                    isInCart ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                }`}
            >
                <Button
                    onClick={onAdd}
                    disabled={isAnyActionLoading}
                    className={`w-full h-full cursor-pointer ${inactiveClasses} ${baseClasses}`}
                >
                    {isAdding ? (
                        <Spinner />
                    ) : (
                        <>
                            <span>{addLabel}</span>
                            <div className="absolute left-3.5">{AddIcon}</div>
                        </>
                    )}
                </Button>
            </div>

            {/* --- STATE 2: GO TO CART & REMOVE --- */}
            <div
                className={`absolute inset-0 w-full flex gap-x-2 transition-opacity duration-500 ease-in-out ${
                    isInCart ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >

                {/* Remove Button */}
                <Button
                    onClick={onRemove}
                    disabled={isAnyActionLoading}
                    title="Remove"
                    className="cursor-pointer w-14 h-full flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-70"
                >
                    {isRemoving ? (
                        <Spinner className="w-5 h-5 text-red-600" />
                    ) : (
                        <Trash2 size={22} className="shrink-0" />
                    )}
                </Button>
                {/* Navigation Button */}
                <Button
                    onClick={onNavigate}
                    disabled={isAnyActionLoading}
                    className={`flex-1 h-full cursor-pointer ${activeClasses} ${baseClasses}`}
                >
                    {isNavigating ? (
                        <Spinner />
                    ) : (
                        <>
                            <span>{navigateLabel}</span>
                            <div className="absolute left-3.5">{NavigateIcon}</div>
                        </>
                    )}
                </Button>
            </div>

        </div>
    )
}
