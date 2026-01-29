"use client"

import { useForm } from "../form-context"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, MessageSquare, Mic, MessageCircleQuestionMark, Globe } from "lucide-react"
import { useState } from "react"

const tones = [
    { id: "friendly", label: "Friendly", desc: "Warm and approachable.", gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)" },
    { id: "casual", label: "Casual", desc: "Friendly and conversational.", gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
    { id: "formal", label: "Formal", desc: "Professional and structured.", gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" },
    { id: "creative", label: "Creative", desc: "Expressive and imaginative.", gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    { id: "concise", label: "Concise", desc: "Short and to the point.", gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
]

const languagesList = [
    { id: "English", label: "English", native: "English", gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" },
    { id: "Bengali", label: "Bengali", native: "বাংলা", gradient: "linear-gradient(135deg, #f43f96ff 0%, #aa71fbff 100%)" },
    { id: "Hindi", label: "Hindi", native: "हिन्दी", gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" },
    { id: "Tamil", label: "Tamil", native: "தமிழ்", gradient: "linear-gradient(135deg, #ec5b48ff 0%, #f4cf72ff 100%)" },
    { id: "Telugu", label: "Telugu", native: "తెలుగు", gradient: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)" },
    { id: "Marathi", label: "Marathi", native: "मराठी", gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)" },
    { id: "Gujarati", label: "Gujarati", native: "ગુજરાતી", gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" },
    { id: "Kannada", label: "Kannada", native: "ಕನ್ನಡ", gradient: "linear-gradient(135deg, #037a94ff 0%, #2dd4bf 100%)" },
    { id: "Malayalam", label: "Malayalam", native: "മലയാളം", gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
]

export default function PreferencesPage() {
    const { data, updateData } = useForm()
    const router = useRouter()
    const [selectedMessageTone, setSelectedMessageTone] = useState(data.message_tone || "")
    const [selectedLanguage, setSelectedLanguage] = useState(data.language || "English")
    const [selectedGender, setSelectedGender] = useState(data.voice_gender || "female")

    const handleNext = () => {
        if (selectedMessageTone && selectedLanguage) {
            updateData("message_tone", selectedMessageTone)
            updateData("language", selectedLanguage)
            updateData("voice_gender", selectedGender)
            router.push("/form/completion")
        }
    }

    return (
        <div className="w-full flex justify-center px-4 sm:px-10 py-10 md:p-12">
            <div className="max-w-4xl w-full" style={{ padding: '12px' }}>
                <div className="space-y-12 md:space-y-16 mt-12 md:mt-20 flex flex-col items-center justify-center">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                            How should{' '}
                            <span className="gradient-text">we talk?</span>
                        </h2>
                        <p className="text-lg md:text-xl" style={{ color: 'var(--foreground-secondary)' }}>
                            Customize the AI's personality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-10"
                        >
                            {/* Message tone */}
                            <div>
                                <div className="flex items-center gap-3 mb-4" style={{ padding: '16px' }}>
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                                    >
                                        <MessageCircleQuestionMark className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>
                                        Message Tone
                                    </h3>
                                </div>

                                <Card className="p-4 sm:p-6 md:p-10 glass border rounded-2xl shadow-xl" style={{ borderColor: 'var(--background-tertiary)', padding: '14px' }}>
                                    <Label className="text-base font-medium mb-3 block" style={{ color: 'var(--foreground-secondary)' }}>
                                        Select One
                                    </Label>
                                    <div className="grid grid-cols-1 gap-6" style={{ padding: '10px' }}>
                                        {tones.map((tone, idx) => {
                                            return (
                                                <motion.div
                                                    key={tone.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.08 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Card
                                                        className={`w-full p-4 sm:p-6 md:p-10 cursor-pointer transition-all duration-300 border-2 flex items-center gap-4 md:gap-8 rounded-2xl sm:rounded-[2rem] ${selectedMessageTone === tone.id
                                                            ? "shadow-xl"
                                                            : "hover:shadow-lg"
                                                            }`}
                                                        style={{
                                                            borderColor: selectedMessageTone === tone.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                            background: selectedMessageTone === tone.id ? 'hsl(var(--primary) / 0.05)' : 'var(--card)', padding: '14px'
                                                        }}
                                                        onClick={() => setSelectedMessageTone(tone.id)}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <h6 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2 truncate" style={{ color: 'var(--foreground)' }}>
                                                                {tone.label}
                                                            </h6>
                                                            <p className="text-sm sm:text-base line-clamp-2" style={{ color: 'var(--foreground-secondary)' }}>
                                                                {tone.desc}
                                                            </p>
                                                        </div>
                                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                                            {selectedMessageTone === tone.id && (
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
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>

                        {/* Language */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-10"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4" style={{ padding: '16px' }}>
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}
                                        >
                                            <Globe className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>
                                            Language
                                        </h3>
                                    </div>

                                    <Card className="p-4 sm:p-6 glass border rounded-3xl shadow-xl overflow-hidden" style={{ borderColor: 'var(--background-tertiary)', padding: '12px' }}>
                                        <Label className="text-base font-medium mb-6 block px-2" style={{ color: 'var(--foreground-secondary)', marginBottom: '10px' }}>
                                            Primary Language
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {languagesList.map((lang, idx) => {
                                                const isSelected = selectedLanguage === lang.id;
                                                return (
                                                    <motion.div
                                                        key={lang.id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.2 + idx * 0.03 }}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedLanguage(lang.id)}
                                                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden ${isSelected ? "shadow-lg scale-[1.02]" : "hover:shadow-md"
                                                            }`}
                                                        style={{
                                                            borderColor: isSelected ? 'transparent' : 'var(--background-tertiary)',
                                                            background: isSelected ? lang.gradient : 'var(--card)',
                                                            padding: '5px'
                                                        }}
                                                    >
                                                        <span
                                                            className={`text-lg font-bold transition-colors ${isSelected ? "text-white" : "text-[var(--foreground)]"}`}
                                                        >
                                                            {lang.native}
                                                        </span>
                                                        <span
                                                            className={`text-[10px] uppercase tracking-widest font-medium transition-colors ${isSelected ? "text-white/80" : "text-[var(--foreground-tertiary)]"}`}
                                                        >
                                                            {lang.label}
                                                        </span>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                                                            >
                                                                <Check className="w-3 h-3 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>

                            {/* Voice */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-10"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4" style={{ padding: '16px' }}>
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                                        >
                                            <Mic className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>
                                            AI Voice
                                        </h3>
                                    </div>

                                    <Card className="p-4 sm:p-6 md:p-10 glass border space-y-6 rounded-2xl shadow-xl" style={{ borderColor: 'var(--background-tertiary)', padding: '14px' }}>
                                        {/* Voice Gender */}
                                        <div>
                                            <Label className="text-base font-medium mb-3 block" style={{ color: 'var(--foreground-secondary)' }}>
                                                Voice Gender
                                            </Label>
                                            <div className="grid grid-cols-2 gap-4" style={{ padding: '20px' }}>
                                                {['male', 'female'].map((gender) => {
                                                    const isSelected = selectedGender === gender;
                                                    return (
                                                        <motion.div
                                                            key={gender}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setSelectedGender(gender)}
                                                            className={`p-6 rounded-2xl sm:rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex items-center justify-center gap-4 ${isSelected ? "shadow-xl" : "hover:shadow-lg"
                                                                }`}
                                                            style={{
                                                                borderColor: isSelected ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                                background: isSelected ? 'var(--gradient-hero)' : 'var(--card)',
                                                                color: isSelected ? 'white' : 'var(--foreground)',
                                                                padding: '5px'
                                                            }}
                                                        >
                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 200 }}
                                                                >
                                                                    <Check className="w-6 h-6" />
                                                                </motion.div>
                                                            )}
                                                            <span className="text-md font-bold">
                                                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                                            </span>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-12" style={{ padding: '16px' }}>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={!selectedMessageTone || !selectedLanguage}
                            className="w-full md:w-auto min-w-[240px] px-10 rounded-full h-14 text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                            style={{ background: (selectedMessageTone && selectedLanguage) ? 'var(--gradient-hero)' : 'var(--muted)' }}
                        >
                            Finish Setup
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    )
}
