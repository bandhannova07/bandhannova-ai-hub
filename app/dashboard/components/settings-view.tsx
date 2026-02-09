"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    User,
    Briefcase,
    BicepsFlexed,
    Goal,
    Brain,
    BookOpenCheck,
    MessageCircle,
    MessageCircleHeart,
    Globe,
    Mic,
    Check,
    Loader2,
    Save,
    X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth-simple'
import type { OnboardingData } from '@/app/form/form-context'

const professions = [
    { id: "student", label: "Student" },
    { id: "developer", label: "Developer" },
    { id: "designer", label: "Designer" },
    { id: "creative", label: "Content Creator" },
    { id: "business", label: "Business Owner" },
    { id: "other", label: "Other" },
]

const goals = [
    { id: "learn", label: "Learn New Skills" },
    { id: "code", label: "Get Coding Help" },
    { id: "productivity", label: "Boost Productivity" },
    { id: "create", label: "Create Content" },
    { id: "explore", label: "Just Exploring" },
]

const expertiseLevels = [
    { id: "Beginner", label: "Beginner" },
    { id: "Intermediate", label: "Intermediate" },
    { id: "Expert", label: "Expert" },
]

const interestsList = [
    "Web Development", "AI & ML", "Data Science", "Mobile Apps",
    "Design", "Writing", "Marketing", "Business", "Finance",
    "Health", "Gaming", "Music", "Art", "Science"
]

const tones = [
    { id: "friendly", label: "Friendly" },
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal" },
    { id: "creative", label: "Creative" },
    { id: "concise", label: "Concise" },
]

const languagesList = [
    { id: "English", label: "English", native: "English" },
    { id: "Bengali", label: "Bengali", native: "বাংলা" },
    { id: "Hindi", label: "Hindi", native: "हिन्दी" },
    { id: "Tamil", label: "Tamil", native: "தமிழ்" },
    { id: "Telugu", label: "Telugu", native: "తెలుగు" },
    { id: "Marathi", label: "Marathi", native: "मराठी" },
    { id: "Gujarati", label: "Gujarati", native: "ગુજરાતી" },
    { id: "Kannada", label: "Kannada", native: "ಕನ್ನಡ" },
    { id: "Malayalam", label: "Malayalam", native: "മലയാളം" },
]

export function SettingsView() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [hasChanges, setHasChanges] = useState(false)

    // Form state
    const [formData, setFormData] = useState<OnboardingData>({
        profession: "",
        role: "",
        goal: "",
        expertise: "",
        interests: [],
        message_tone: "",
        language: "English",
        voice_gender: "female",
        custom_instructions: "",
    })

    const [originalData, setOriginalData] = useState<OnboardingData | null>(null)

    useEffect(() => {
        loadUserData()
    }, [])

    useEffect(() => {
        // Check if form data has changed
        if (originalData) {
            const changed = JSON.stringify(formData) !== JSON.stringify(originalData)
            setHasChanges(changed)
        }
    }, [formData, originalData])

    async function loadUserData() {
        try {
            const { user: currentUser } = await getCurrentUser()
            if (!currentUser) return

            setUser(currentUser)

            // Fetch onboarding data
            const { data, error } = await supabase
                .from('user_onboarding')
                .select('*')
                .eq('user_id', currentUser.id)
                .single()

            if (data && !error) {
                const loadedData: OnboardingData = {
                    profession: data.profession || "",
                    role: data.role || "",
                    goal: data.goal || "",
                    expertise: data.expertise || "",
                    interests: data.interests || [],
                    message_tone: data.message_tone || "",
                    language: data.language || "English",
                    voice_gender: data.voice_gender || "female",
                    custom_instructions: data.custom_instructions || "",
                }
                setFormData(loadedData)
                setOriginalData(loadedData)
            }
        } catch (error) {
            console.error('Failed to load user data:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        if (!user) return

        setSaving(true)
        try {
            const { error } = await supabase
                .from('user_onboarding')
                .update({
                    profession: formData.profession,
                    role: formData.role,
                    goal: formData.goal,
                    expertise: formData.expertise,
                    interests: formData.interests,
                    message_tone: formData.message_tone,
                    language: formData.language,
                    voice_gender: formData.voice_gender,
                    custom_instructions: formData.custom_instructions,
                })
                .eq('user_id', user.id)

            if (error) throw error

            setOriginalData(formData)
            setHasChanges(false)

            // Show success message (you can add toast notification here)
            alert('✅ Settings saved successfully!')
        } catch (error) {
            console.error('Failed to save settings:', error)
            alert('❌ Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    function handleReset() {
        if (originalData) {
            setFormData(originalData)
            setHasChanges(false)
        }
    }

    function updateField(key: keyof OnboardingData, value: any) {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    function toggleInterest(interest: string) {
        setFormData(prev => {
            const interests = prev.interests || []
            if (interests.includes(interest)) {
                return { ...prev, interests: interests.filter(i => i !== interest) }
            } else {
                if (interests.length >= 5) return prev
                return { ...prev, interests: [...interests, interest] }
            }
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--foreground-secondary)' }} />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto" style={{ padding: '0 16px' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
            >
                <h1 className="h1" style={{ color: 'var(--foreground)', marginBottom: '8px' }}>
                    ⚙️ <span className="gradient-text">Settings</span>
                </h1>
                <p className="body-large" style={{ color: 'var(--foreground-secondary)' }}>
                    Customize your AI experience and preferences
                </p>
            </motion.div>

            {/* Profile Info (Read-only) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: '24px' }}
            >
                <Card className="glass border rounded-3xl" style={{ padding: '24px', borderColor: 'var(--background-tertiary)' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                        >
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="h3" style={{ color: 'var(--foreground)' }}>Profile</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Name</Label>
                            <p className="body font-semibold" style={{ color: 'var(--foreground)', marginTop: '4px' }}>
                                {user?.user_metadata?.full_name || 'User'}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Email</Label>
                            <p className="body font-semibold" style={{ color: 'var(--foreground)', marginTop: '4px' }}>
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* AI Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: '24px' }}
            >
                <Card className="glass border rounded-3xl" style={{ padding: '24px', borderColor: 'var(--background-tertiary)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}
                        >
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="h3" style={{ color: 'var(--foreground)' }}>AI Preferences</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Profession */}
                        <div>
                            <Label className="body font-medium mb-3 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                <Briefcase className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                Profession
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {professions.map(prof => (
                                    <motion.div
                                        key={prof.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => updateField('profession', prof.id)}
                                            className="rounded-xl transition-all w-full"
                                            style={{
                                                borderColor: formData.profession === prof.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                background: formData.profession === prof.id ? 'hsl(var(--primary) / 0.1)' : 'var(--background-tertiary)',
                                            }}
                                        >
                                            {prof.label}
                                            {formData.profession === prof.id && <Check className="w-4 h-4 ml-2" />}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <Label className="body font-medium mb-2 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                Specific Role (Optional)
                            </Label>
                            <Input
                                placeholder="e.g. Frontend Engineer, Biology Student..."
                                value={formData.role || ''}
                                onChange={(e) => updateField('role', e.target.value)}
                                className="rounded-xl h-12"
                                style={{ borderColor: 'var(--background-tertiary)', padding: '10px' }}
                            />
                        </div>

                        {/* Goal */}
                        <div>
                            <Label className="body font-medium mb-3 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                <Goal className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                Primary Goal
                            </Label>
                            <div className="grid grid-cols-1 gap-3">
                                {goals.map(goal => (
                                    <motion.div
                                        key={goal.id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => updateField('goal', goal.id)}
                                            className="rounded-xl transition-all justify-start w-full"
                                            style={{
                                                borderColor: formData.goal === goal.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                background: formData.goal === goal.id ? 'hsl(var(--primary) / 0.1)' : 'var(--background-tertiary)',
                                                padding: '14px'
                                            }}
                                        >
                                            {goal.label}
                                            {formData.goal === goal.id && <Check className="w-4 h-4 ml-auto" />}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Expertise */}
                        <div>
                            <Label className="body font-medium mb-3 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                <BicepsFlexed className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                Expertise Level
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                {expertiseLevels.map(level => (
                                    <motion.div
                                        key={level.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => updateField('expertise', level.id)}
                                            className="rounded-xl transition-all w-full"
                                            style={{
                                                borderColor: formData.expertise === level.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                background: formData.expertise === level.id ? 'hsl(var(--primary) / 0.1)' : 'var(--background-tertiary)',
                                            }}
                                        >
                                            {level.label}
                                            {formData.expertise === level.id && <Check className="w-4 h-4 ml-2" />}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Label className="body font-medium" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                    <MessageCircleHeart className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                    Interests
                                </Label>
                                <span className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>
                                    {formData.interests?.length || 0}/5 selected
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {interestsList.map(interest => {
                                    const isSelected = formData.interests?.includes(interest)
                                    return (
                                        <motion.div
                                            key={interest}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Badge
                                                variant={isSelected ? "default" : "outline"}
                                                className="cursor-pointer transition-all rounded-full px-4 py-2"
                                                style={{
                                                    background: isSelected ? 'var(--gradient-hero)' : 'var(--background-tertiary)',
                                                    borderColor: isSelected ? 'transparent' : 'var(--background-tertiary)',
                                                    color: isSelected ? 'white' : 'var(--foreground)',
                                                    padding: '5px'
                                                }}
                                                onClick={() => toggleInterest(interest)}
                                            >
                                                {interest}
                                                {isSelected && <Check className="w-3 h-3 ml-1" />}
                                            </Badge>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Message Tone */}
                        <div>
                            <Label className="body font-medium mb-3 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                <MessageCircle className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                Message Tone
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {tones.map(tone => (
                                    <motion.div
                                        key={tone.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            key={tone.id}
                                            variant="outline"
                                            onClick={() => updateField('message_tone', tone.id)}
                                            className="rounded-xl transition-all w-full"
                                            style={{
                                                borderColor: formData.message_tone === tone.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                background: formData.message_tone === tone.id ? 'hsl(var(--primary) / 0.1)' : 'var(--background-tertiary)',
                                            }}
                                        >
                                            {tone.label}
                                            {formData.message_tone === tone.id && <Check className="w-4 h-4 ml-2" />}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <Label className="body font-medium mb-3 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                <Globe className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                Language
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {languagesList.map(lang => (
                                    <motion.div
                                        key={lang.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => updateField('language', lang.id)}
                                            className="rounded-xl transition-all w-full"
                                            style={{
                                                borderColor: formData.language === lang.id ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                background: formData.language === lang.id ? 'hsl(var(--primary) / 0.1)' : 'var(--background-tertiary)',
                                            }}
                                        >
                                            <span>{lang.native}</span>
                                            {formData.language === lang.id && <Check className="w-4 h-4 ml-2" />}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Voice Gender */}
                        <div>
                            <Label className="body font-medium mb-3 block" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                <Mic className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                Voice Gender
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {['male', 'female'].map(gender => (
                                    <motion.div
                                        key={gender}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => updateField('voice_gender', gender)}
                                            className="rounded-xl transition-all w-full"
                                            style={{
                                                borderColor: formData.voice_gender === gender ? 'hsl(var(--primary))' : 'var(--background-tertiary)',
                                                background: formData.voice_gender === gender ? 'hsl(var(--primary) / 0.1)' : 'var(--background-tertiary)',
                                            }}
                                        >
                                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                            {formData.voice_gender === gender && <Check className="w-4 h-4 ml-2" />}
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Custom AI Instructions */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Label className="body font-medium" style={{ color: 'var(--foreground)', padding: '5px' }}>
                                    <BookOpenCheck className="w-4 h-4 inline mr-2" style={{ marginRight: '5px' }} />
                                    Custom AI Instructions
                                </Label>
                                <span
                                    className="small"
                                    style={{
                                        color: formData.custom_instructions && formData.custom_instructions.length > 450
                                            ? '#ef4444'
                                            : 'var(--foreground-tertiary)'
                                    }}
                                >
                                    {formData.custom_instructions?.length || 0}/500
                                </span>
                            </div>
                            <Textarea
                                placeholder="Tell the AI how to respond to you... (e.g., 'Always respond in Bengali', 'Keep answers concise', 'Use simple language')"
                                value={formData.custom_instructions || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    const value = e.target.value
                                    if (value.length <= 500) {
                                        updateField('custom_instructions', value)
                                    }
                                }}
                                className="rounded-2xl min-h-[120px] resize-none"
                                style={{ borderColor: 'var(--background-tertiary)', padding: '12px' }}
                                maxLength={500}
                            />
                            <p className="small mt-2" style={{ color: 'var(--foreground-tertiary)', fontStyle: 'italic', padding: '5px' }}>
                                💡 These instructions will be applied to all AI agents
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ marginBottom: '24px' }}
            >
                <Card className="glass border rounded-3xl" style={{ padding: '24px', borderColor: 'var(--background-tertiary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="body-large font-semibold" style={{ color: 'var(--foreground)', marginBottom: '4px' }}>
                                Theme
                            </h3>
                            <p className="small" style={{ color: 'var(--foreground-secondary)' }}>
                                Choose your preferred color scheme
                            </p>
                        </div>
                        <ThemeToggle variant="full" />
                    </div>
                </Card>
            </motion.div>

            {/* Action Buttons */}
            {hasChanges && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-end"
                    style={{ marginBottom: '32px' }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={saving}
                            className="rounded-full"
                            style={{ padding: '10px' }}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-full"
                            style={{ background: 'var(--gradient-hero)', padding: '10px' }}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
