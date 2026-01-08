'use client';

import { useEffect, useRef, useState } from 'react';

interface AdstertaBannerProps {
    className?: string;
}

export default function AdstertaBanner({ className = '' }: AdstertaBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check screen size
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Don't load ad on mobile
        if (isMobile) return;

        // Wait a bit for DOM to be ready
        const timer = setTimeout(() => {
            try {
                // Create container for ad
                const adContainer = document.createElement('div');
                adContainer.id = 'adsterra-banner-container';

                if (containerRef.current) {
                    containerRef.current.appendChild(adContainer);
                }

                // Set Adsterra options
                (window as any).atOptions = {
                    'key': '63e8b36ccf4067d9fc234150fa420848',
                    'format': 'iframe',
                    'height': 250,
                    'width': 300,
                    'params': {}
                };

                // Load Adsterra script
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '//www.highperformanceformat.com/63e8b36ccf4067d9fc234150fa420848/invoke.js';
                adContainer.appendChild(script);

                console.log('Adsterra banner ad script loaded');
            } catch (error) {
                console.error('Error loading Adsterra ad:', error);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isMobile]);

    // Hide on mobile
    if (isMobile) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: '300px',
                height: '250px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
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
                fontSize: '12px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderTopColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 8px'
                }}></div>
                Ad Loading...
            </div>
        </div>
    );
}
