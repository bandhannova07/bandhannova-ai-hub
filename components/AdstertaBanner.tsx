'use client';

import { useEffect, useRef } from 'react';

interface AdstertaBannerProps {
    className?: string;
}

export default function AdstertaBanner({ className = '' }: AdstertaBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Wait a bit for DOM to be ready
        const timer = setTimeout(() => {
            try {
                if (!containerRef.current) return;

                // Create the container div for the ad
                const adContainer = document.createElement('div');
                adContainer.id = 'container-8cf56f262981da929d890684b9cd6ea0';
                containerRef.current.appendChild(adContainer);

                // Load Adsterra Native Banner script
                const script = document.createElement('script');
                script.async = true;
                script.setAttribute('data-cfasync', 'false');
                script.src = 'https://pl28429802.effectivegatecpm.com/8cf56f262981da929d890684b9cd6ea0/invoke.js';
                containerRef.current.appendChild(script);

                console.log('Adsterra Native Banner loaded (responsive for all devices)');
            } catch (error) {
                console.error('Error loading Adsterra Native Banner:', error);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: '100%',
                minHeight: '60px', // Reduced for mobile
                maxWidth: '100%', // Full width on mobile
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Loading placeholder */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'rgba(255, 255, 255, 0.3)',
                fontSize: '10px',
                textAlign: 'center',
                pointerEvents: 'none'
            }}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderTopColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 4px'
                }}></div>
                Ad...
            </div>
        </div>
    );
}
