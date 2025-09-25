"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Laptop },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {themes.map((item) => (
        <Button
          key={item.value}
          variant="outline"
          size="sm"
          onClick={() => setTheme(item.value)}
          className={cn(
            "justify-center h-12",
            theme === item.value && "bg-primary/20 border-primary"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.name}
        </Button>
      ))}
    </div>
  )
}
