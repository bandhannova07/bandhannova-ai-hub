"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface OnboardingData {
    profession: string
    role?: string
    goal: string
    expertise: string
    interests: string[]
    message_tone: string
    language: string
    voice_gender?: string
}

interface FormContextType {
    data: OnboardingData
    updateData: (key: keyof OnboardingData, value: any) => void
    step: number
    setStep: (step: number) => void
    totalSteps: number
}

const defaultData: OnboardingData = {
    profession: "",
    goal: "",
    expertise: "",
    interests: [],
    message_tone: "",
    language: "",
    voice_gender: "",
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<OnboardingData>(defaultData)
    const [step, setStep] = useState(0)
    const totalSteps = 5 // Welcome + 4 Steps

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("onboarding-data")
        if (savedData) {
            try {
                setData(JSON.parse(savedData))
            } catch (e) {
                console.error("Failed to parse onboarding data", e)
            }
        }
    }, [])

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("onboarding-data", JSON.stringify(data))
    }, [data])

    const updateData = (key: keyof OnboardingData, value: any) => {
        setData((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <FormContext.Provider value={{ data, updateData, step, setStep, totalSteps }}>
            {children}
        </FormContext.Provider>
    )
}

export function useForm() {
    const context = useContext(FormContext)
    if (context === undefined) {
        throw new Error("useForm must be used within a FormProvider")
    }
    return context
}
