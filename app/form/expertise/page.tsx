"use client"

import { useForm } from "../form-context"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Check, Sparkle } from "lucide-react"

const interestsList = [
    "Web Development", "AI & ML", "Data Science", "Mobile Apps",
    "Design", "Writing", "Marketing", "Business", "Finance",
    "Health", "Gaming", "Music", "Art", "Science"
]

const expertiseLevels = [
    {
        id: "Beginner",
        label: "Beginner",
        desc: "I'm just starting out.",
        icon: Sparkle,
        gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
    },
    {
        id: "Intermediate",
        label: "Intermediate",
        desc: "I have some experience.",
        icon: Sparkle,
        gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)"
    },
    {
        id: "Expert",
        label: "Expert",
        desc: "I'm a pro in my field.",
        icon: Sparkle,
        gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
    }
];

export default function ExpertisePage() {
    const { data, updateData } = useForm()
    const router = useRouter()
    const [selected, setSelected] = useState(data.expertise || "")
    const [selectedInterests, setSelectedInterests] = useState<string[]>(data.interests || [])

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest)
            } else {
                if (prev.length >= 5) return prev
                return [...prev, interest]
            }
        })
    }

    const handleNext = () => {
        if (selected) {
            updateData("expertise", selected)
            updateData("interests", selectedInterests)
            router.push("/form/preferences")
        }
    }

    return (
        <div className="w-full flex justify-center px-4 sm:px-10 py-10 md:p-12">
            <div className="max-w-3xl w-full">
                <div className="space-y-12 md:space-y-20 mt-12 md:mt-20 flex flex-col items-center justify-center">
                    <div className="text-center mb-10" style={{ padding: '5px' }}>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                            How much do{' '}
                            <span className="gradient-text">you know?</span>
                        </h2>
                        <p className="text-lg md:text-xl" style={{ color: 'var(--foreground-secondary)' }}>
                            And what are you interested in?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6" style={{ padding: '16px' }}>
                        {expertiseLevels.map((expertiseLevel, idx) => {
                            const Icon = expertiseLevel.icon;
                            return (
                                <motion.div
                                    key={expertiseLevel.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`p-4 sm:p-6 md:p-10 cursor-pointer transition-all duration-300 border-2 flex items-center gap-4 md:gap-8 rounded-2xl sm:rounded-[2rem] ${selected === expertiseLevel.id
                                            ? "shadow-xl"
                                            : "hover:shadow-lg"
                                            }`}
                                        style={{
                                            borderColor: selected === expertiseLevel.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                            background: selected === expertiseLevel.id ? 'hsl(var(--primary) / 0.05)' : 'var(--card)', padding: '14px'
                                        }}
                                        onClick={() => setSelected(expertiseLevel.id)}
                                    >
                                        <div
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center transition-all shadow-inner"
                                            style={{
                                                background: selected === expertiseLevel.id ? expertiseLevel.gradient : 'var(--muted)', padding: '10px'
                                            }}
                                        >
                                            <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: selected === expertiseLevel.id ? 'white' : 'var(--foreground-secondary)' }} />
                                        </div>
                                        <div className="flex-1">
                                            <h6 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2" style={{ color: 'var(--foreground)' }}>
                                                {expertiseLevel.label}
                                            </h6>
                                            <p className="text-sm sm:text-base" style={{ color: 'var(--foreground-secondary)' }}>
                                                {expertiseLevel.desc}
                                            </p>
                                        </div>
                                        {selected === expertiseLevel.id && (
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

                    {/* Interests Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl" style={{ color: 'var(--foreground)', margin: '20px' }}>
                                Topics of Interest
                            </h3>
                            <span className="text-base font-medium" style={{ color: 'var(--foreground-tertiary)' }}>
                                {selectedInterests.length}/5 selected
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3" style={{ padding: '20px' }}>
                            {interestsList.map((interest, idx) => {
                                const isSelected = selectedInterests.includes(interest);
                                return (
                                    <motion.div
                                        key={interest}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.03 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Badge
                                            variant={isSelected ? "default" : "outline"}
                                            className={`text-sm md:text-base py-2 md:py-3 px-4 md:px-6 cursor-pointer transition-all duration-300 rounded-full ${isSelected ? "shadow-lg scale-105" : "hover:shadow-md"
                                                }`}
                                            style={{
                                                background: isSelected ? 'var(--gradient-hero)' : 'transparent',
                                                borderColor: isSelected ? 'transparent' : 'var(--background-tertiary)',
                                                color: isSelected ? 'white' : 'var(--foreground)',
                                                padding: '5px'
                                            }}
                                            onClick={() => handleInterestToggle(interest)}
                                        >
                                            {interest}
                                            {isSelected && <Check className="w-4 h-4 ml-2 inline-block" />}
                                        </Badge>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className="flex justify-center pt-16" style={{ padding: '16px' }}>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={!selected}
                            className="w-full md:w-auto min-w-[240px] px-10 rounded-full h-14 text-lg transition-all duration-300 hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
