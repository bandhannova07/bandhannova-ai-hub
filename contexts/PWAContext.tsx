'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextType {
    deferredPrompt: BeforeInstallPromptEvent | null;
    isInstallable: boolean;
    clearPrompt: () => void;
}

const PWAContext = createContext<PWAContextType>({
    deferredPrompt: null,
    isInstallable: false,
    clearPrompt: () => { },
});

export const usePWA = () => useContext(PWAContext);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
            console.log('✅ PWA Install Prompt Captured! You can now install the app.');
        });

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        console.log('📊 PWA State:', {
            isStandalone,
            isSecureContext: window.isSecureContext,
            userAgent: navigator.userAgent
        });

        if (isStandalone) {
            setIsInstallable(false);
            console.log('ℹ️ App is already running in standalone mode.');
        }

        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA was installed successfully!');
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', () => { });
        };
    }, []);

    const clearPrompt = () => {
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return (
        <PWAContext.Provider value={{ deferredPrompt, isInstallable, clearPrompt }}>
            {children}
        </PWAContext.Provider>
    );
};
