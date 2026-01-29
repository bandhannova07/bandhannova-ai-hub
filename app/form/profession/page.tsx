"use client"

import { useForm } from "../form-context"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Briefcase, GraduationCap, Code2, PenTool, LayoutTemplate, Building2, User } from "lucide-react"
import { useState } from "react"

const professions = [
    { id: "student", label: "Student", icon: GraduationCap, gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
    { id: "developer", label: "Developer", icon: Code2, gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)" },
    { id: "designer", label: "Designer", icon: PenTool, gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    { id: "creative", label: "Content Creator", icon: LayoutTemplate, gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
    { id: "business", label: "Business Owner", icon: Building2, gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)" },
    { id: "other", label: "Other", icon: User, gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" },
]

export default function ProfessionPage() {
    const { data, updateData } = useForm()
    const router = useRouter()
    const [selected, setSelected] = useState(data.profession || "")
    const [customRole, setCustomRole] = useState(data.role || "")

    const handleSelect = (id: string) => {
        setSelected(id)
        updateData("profession", id)
    }

    const handleCustomRole = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomRole(e.target.value)
        updateData("role", e.target.value)
    }

    const handleNext = () => {
        if (selected) {
            router.push("/form/goals")
        }
    }

    return (
        <div className="w-full flex justify-center px-4 sm:px-10 py-10 md:p-12">
            <div className="max-w-4xl w-full">
                <div className="space-y-12 mt-12 md:mt-20 flex flex-col items-center justify-center">
                    <div className="text-center mb-12" style={{ padding: '5px' }}>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                            What do{' '}
                            <span className="gradient-text">you do?</span>
                        </h2>
                        <p className="text-lg md:text-xl" style={{ color: 'var(--foreground-secondary)' }}>
                            We'll adapt our answers to your field.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-2 sm:px-6" style={{ padding: '20px' }}>
                        {professions.map((prof, idx) => {
                            const Icon = prof.icon;
                            return (
                                <motion.div
                                    key={prof.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`p-4 sm:p-6 md:p-10 cursor-pointer transition-all duration-300 border-2 flex flex-col items-center justify-center gap-3 sm:gap-6 text-center min-h-[120px] sm:min-h-[140px] md:h-56 rounded-2xl sm:rounded-[2rem] ${selected === prof.id
                                            ? "shadow-xl"
                                            : "hover:shadow-lg"
                                            }`}
                                        style={{
                                            borderColor: selected === prof.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                            background: selected === prof.id ? 'hsl(var(--primary) / 0.05)' : 'var(--card)', padding: '14px'
                                        }}
                                        onClick={() => handleSelect(prof.id)}
                                    >
                                        <div
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-inner"
                                            style={{
                                                background: selected === prof.id ? prof.gradient : 'var(--muted)',
                                            }}
                                        >
                                            <Icon className={`w-6 h-6 md:w-8 md:h-8 ${selected === prof.id ? 'text-white' : ''}`} style={{ color: selected === prof.id ? 'white' : 'var(--foreground-secondary)' }} />
                                        </div>
                                        <span className="font-bold text-xs sm:text-base md:text-lg" style={{ color: 'var(--foreground)' }}>{prof.label}</span>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <Label htmlFor="role" className="text-md font-medium block" style={{ color: 'var(--foreground)', margin: '20px' }}>
                            Specific Role (Optional)
                        </Label>
                        <Input
                            id="role"
                            placeholder="e.g. Frontend Engineer, Biology Student..."
                            className="mt-3 h-14 w-full rounded-2xl sm:rounded-3xl border-2 transition-all focus:scale-[1.01] text-base md:text-lg px-6"
                            style={{ borderColor: 'var(--background-tertiary)', padding: '10px' }}
                            value={customRole}
                            onChange={handleCustomRole}
                        />
                    </motion.div>

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
