"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" />
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light")
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="glass rounded-xl w-10 h-10 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg flex items-center justify-center group hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
        >
            <div className="relative flex items-center justify-center">
                <Sun className={`h-5 w-5 transition-all duration-500 ${resolvedTheme === 'dark' ? 'translate-y-10 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0'}`} />
                <Moon className={`absolute h-5 w-5 transition-all duration-500 text-primary-purple ${resolvedTheme === 'light' ? '-translate-y-10 opacity-0 -rotate-90' : 'translate-y-0 opacity-100 rotate-0'}`} />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
