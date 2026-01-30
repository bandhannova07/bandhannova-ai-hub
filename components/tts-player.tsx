"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Volume2, VolumeX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TTSPlayerProps {
    text: string
    language: string
    gender: 'male' | 'female'
    autoPlay?: boolean
    onPlayStart?: () => void
    onPlayEnd?: () => void
    className?: string
    style?: React.CSSProperties
    isDesktop?: boolean
}

export function TTSPlayer({
    text,
    language,
    gender,
    autoPlay = false,
    onPlayStart,
    onPlayEnd,
    className,
    style,
    isDesktop
}: TTSPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Track the current text/lang/gender purely for prefetch logic
    const contentKey = `${language}-${gender}-${text}`

    const fetchAudio = useCallback(async (textToFetch: string) => {
        if (!textToFetch) return

        // Cancel previous request if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        try {
            setIsLoading(true)
            setError(null)

            const baseUrl = "https://tts.bandhannova.in"
            const url = `${baseUrl}/${language.toLowerCase()}/${gender.toLowerCase()}/generate`
            const apiKey = process.env.NEXT_PUBLIC_TTS_API_KEY;

            console.log('🔊 Prefetching TTS:', { url })

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": apiKey || ""
                },
                body: JSON.stringify({ text: textToFetch }),
                signal: abortControllerRef.current.signal
            })

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`TTS API failed: ${response.status} ${response.statusText} - ${errorText}`)
            }

            const blob = await response.blob()
            const objectUrl = URL.createObjectURL(blob)

            // Only update if not aborted
            setAudioUrl(objectUrl)
            setIsLoading(false)

            console.log('✅ TTS audio ready for playback')

            // Autoplay logic - only if requested and component is still mounted
            if (autoPlay && audioRef.current) {
                audioRef.current.play().catch(console.error)
                setIsPlaying(true)
                onPlayStart?.()
            }

        } catch (err: any) {
            if (err.name === 'AbortError') return

            console.error("TTS Error:", err)
            setError(err.message)
            setIsLoading(false)

            // Minimal fallback to browser TTS if autoplay was desired
            if (autoPlay) {
                try {
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(textToFetch)
                        utterance.onstart = () => { setIsPlaying(true); onPlayStart?.() }
                        utterance.onend = () => { setIsPlaying(false); onPlayEnd?.() }
                        window.speechSynthesis.speak(utterance)
                    }
                } catch (e) {
                    console.error("Fallback TTS failed", e)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, gender, autoPlay]) // Removed isPlaying, onPlayStart, onPlayEnd from dependencies to avoid loops

    // Effect for prefetching when text/lang/gender changes
    useEffect(() => {
        // Reset everything for new content
        setIsPlaying(false)
        setAudioUrl(null)

        if (text) {
            fetchAudio(text)
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentKey, fetchAudio])

    const handlePlay = () => {
        if (!text) return

        if (isPlaying) {
            audioRef.current?.pause()
            setIsPlaying(false)
            return
        }

        if (audioUrl) {
            audioRef.current?.play().catch(console.error)
            setIsPlaying(true)
            onPlayStart?.()
        } else if (!isLoading) {
            // If button clicked but not ready, fetch and then (auto)play
            fetchAudio(text)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        onPlayEnd?.()
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={audioUrl || undefined}
                onEnded={handleEnded}
                className="hidden"
                preload="auto"
            />
            <Button
                variant="ghost"
                onClick={handlePlay}
                disabled={(!audioUrl && isLoading) || !text}
                className={className}
                style={style}
                data-action-bar-btn
                title={isPlaying ? "Stop" : "Play"}
            >
                {isLoading && !audioUrl ? (
                    <Loader2 className={isDesktop ? "w-5 h-5 animate-spin" : "w-4 h-4 animate-spin"} />
                ) : isPlaying ? (
                    <VolumeX className={isDesktop ? "w-5 h-5" : "w-4 h-4"} />
                ) : (
                    <Volume2 className={isDesktop ? "w-5 h-5" : "w-4 h-4"} />
                )}
            </Button>
            {error && !isLoading && (
                <span className="text-[10px] text-red-500 opacity-50 absolute -top-1 -right-1" title={error}>!</span>
            )}
        </>
    )
}
