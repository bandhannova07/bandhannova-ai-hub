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
                    gap: 14px;
                    padding: 16px 0;
                }

                .shimmer-line {
                    height: 20px;
                    width: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(139, 92, 246, 0.15) 0%,
                        rgba(139, 92, 246, 0.35) 50%,
                        rgba(139, 92, 246, 0.15) 100%
                    );
                    background-size: 200% 100%;
                    border-radius: 10px;
                    animation: shimmer 1.8s infinite;
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
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

                /* Desktop: Even larger shimmer */
                @media (min-width: 1024px) {
                    .shimmer-line {
                        height: 22px;
                    }
                }
            `}</style>
        </div>
    );
}
