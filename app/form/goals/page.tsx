"use client"

import { useForm } from "../form-context"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, BookOpen, Zap, PenTool, Lightbulb, Check } from "lucide-react"
import { useState } from "react"

const goals = [
    {
        id: "learn",
        label: "Learn New Skills",
        desc: "I want to master new technologies or subjects.",
        icon: BookOpen,
        gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
    },
    {
        id: "code",
        label: "Get Coding Help",
        desc: "I need help debugging and writing code.",
        icon: Code,
        gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)"
    },
    {
        id: "productivity",
        label: "Boost Productivity",
        desc: "I want to organize my life and work faster.",
        icon: Zap,
        gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
    },
    {
        id: "create",
        label: "Create Content",
        desc: "I need help writing, editing, or brainstorming.",
        icon: PenTool,
        gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)"
    },
    {
        id: "explore",
        label: "Just Exploring",
        desc: "I'm curious about what AI can do.",
        icon: Lightbulb,
        gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
    },
]

export default function GoalsPage() {
    const { data, updateData } = useForm()
    const router = useRouter()
    const [selected, setSelected] = useState(data.goal || "")

    const handleSelect = (id: string) => {
        setSelected(id)
        updateData("goal", id)
    }

    const handleNext = () => {
        if (selected) {
            router.push("/form/expertise")
        }
    }

    return (
        <div className="w-full flex justify-center px-4 sm:px-10 py-10 md:p-12">
            <div className="max-w-3xl w-full">
                <div className="space-y-12 mt-12 md:mt-20 flex flex-col items-center justify-center">
                    <div className="text-center mb-12" style={{ padding: '5px' }}>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                            What brings{' '}
                            <span className="gradient-text">you here?</span>
                        </h2>
                        <p className="text-lg md:text-xl" style={{ color: 'var(--foreground-secondary)' }}>
                            Pick your primary goal to get started.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6" style={{ padding: '20px' }}>
                        {goals.map((goal, idx) => {
                            const Icon = goal.icon;
                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`p-4 sm:p-6 md:p-10 cursor-pointer transition-all duration-300 border-2 flex items-center gap-4 md:gap-8 rounded-2xl sm:rounded-[2rem] ${selected === goal.id
                                            ? "shadow-xl"
                                            : "hover:shadow-lg"
                                            }`}
                                        style={{
                                            borderColor: selected === goal.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                            background: selected === goal.id ? 'hsl(var(--primary) / 0.05)' : 'var(--card)', padding: '14px'
                                        }}
                                        onClick={() => handleSelect(goal.id)}
                                    >
                                        <div
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center transition-all shadow-inner"
                                            style={{
                                                background: selected === goal.id ? goal.gradient : 'var(--muted)', padding: '10px'
                                            }}
                                        >
                                            <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: selected === goal.id ? 'white' : 'var(--foreground-secondary)' }} />
                                        </div>
                                        <div className="flex-1">
                                            <h6 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2" style={{ color: 'var(--foreground)' }}>
                                                {goal.label}
                                            </h6>
                                            <p className="text-sm sm:text-base" style={{ color: 'var(--foreground-secondary)' }}>
                                                {goal.desc}
                                            </p>
                                        </div>
                                        {selected === goal.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200 }}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                                                    style={{ background: '#72bf6a' }}
                                                >
                                                    <Check className="w-6 h-6 text-white" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center pt-12" style={{ padding: '16px' }}>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={!selected}
                            className="w-full md:w-auto min-w-[240px] px-10 rounded-full h-14 text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            style={{ background: selected ? 'var(--gradient-hero)' : 'var(--muted)' }}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
