"use client";
import { useSidebar } from "@lib/components/ui/sidebar";
import { useEffect, useState } from "react";

interface HeaderNavBarButtomProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeaderNavBarBottom({
  children,
  className = "",
}: HeaderNavBarButtomProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const { open: sidebarOpen } = useSidebar();
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll < 0) return; // safety

      // if scrolling up or at top → show
      if (currentScroll < lastScroll || currentScroll === 0) {
        setIsVisible(true);
      } else {
        // scrolling down → hide
        setIsVisible(false);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);
  // Always show when sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      setTimeout(() => {
        setIsVisible(true);
      });
    }
  }, [sidebarOpen]);
  return (
    <nav
      className={`
        w-full flex flex-wrap items-center transition-all ease-in-out duration-300
        ${isVisible
          ? "h-9 opacity-100 visible mt-[3px] mb-[9px]"
          : "h-0 opacity-0 invisible mt-0 mb-0"
        }
        ${className}
      `}
    >
      {children}
    </nav>
  );
}
