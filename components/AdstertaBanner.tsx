'use client';

import { useEffect, useRef } from 'react';

interface AdstertaBannerProps {
    className?: string;
}

export default function AdstertaBanner({ className = '' }: AdstertaBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        // Only load script once
        if (scriptLoadedRef.current) return;
        scriptLoadedRef.current = true;

        // Create and inject Adsterra banner ad script
        const configScript = document.createElement('script');
        configScript.innerHTML = `
      atOptions = {
        'key' : '63e8b36ccf4067d9fc234150fa420848',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
        document.body.appendChild(configScript);

        // Load the invoke script
        const invokeScript = document.createElement('script');
        invokeScript.src = 'https://www.highperformanceformat.com/63e8b36ccf4067d9fc234150fa420848/invoke.js';
        invokeScript.async = true;
        document.body.appendChild(invokeScript);

        // Cleanup function
        return () => {
            // Remove scripts on unmount
            if (configScript.parentNode) {
                configScript.parentNode.removeChild(configScript);
            }
            if (invokeScript.parentNode) {
                invokeScript.parentNode.removeChild(invokeScript);
            }
        };
    }, []);

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
                overflow: 'hidden'
            }}
        >
            {/* Adsterra ad will be injected here */}
        </div>
    );
}
