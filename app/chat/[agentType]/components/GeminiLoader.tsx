// Gemini-style Loading Indicator
// Animated gradient shimmer effect

export function GeminiLoader() {
    return (
        <div className="gemini-loader">
            <div className="shimmer-line"></div>
            <div className="shimmer-line short"></div>
            <div className="shimmer-line medium"></div>

            <style jsx>{`
                .gemini-loader {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 16px 0;
                }

                .shimmer-line {
                    height: 16px;
                    width: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0.05) 0%,
                        rgba(255, 255, 255, 0.15) 50%,
                        rgba(255, 255, 255, 0.05) 100%
                    );
                    background-size: 200% 100%;
                    border-radius: 8px;
                    animation: shimmer 2s infinite;
                }

                .shimmer-line.short {
                    width: 60%;
                }

                .shimmer-line.medium {
                    width: 80%;
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                /* Desktop: Larger shimmer */
                @media (min-width: 1024px) {
                    .shimmer-line {
                        height: 18px;
                    }
                }
            `}</style>
        </div>
    );
}
