'use client';

import { useState } from 'react';
import { Download, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageViewerProps {
    imageUrl: string;
    alt?: string;
    prompt?: string;
}

export default function ImageViewer({ imageUrl, alt = 'Generated Image', prompt }: ImageViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `bandhannova-ai-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    return (
        <>
            {/* Main Image Container */}
            <div className="image-viewer-container" style={{
                marginTop: '16px',
                marginBottom: '16px'
            }}>
                {/* Prompt Display */}
                {prompt && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderLeft: '3px solid rgba(139, 92, 246, 0.5)',
                        borderRadius: '6px',
                        marginBottom: '12px'
                    }}>
                        <p style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#8b5cf6',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Prompt
                        </p>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--foreground-secondary)',
                            lineHeight: '1.6'
                        }}>
                            {prompt}
                        </p>
                    </div>
                )}

                {/* Image Display */}
                <div style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <img
                        src={imageUrl}
                        alt={alt}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            cursor: 'pointer'
                        }}
                        onClick={() => setIsFullscreen(true)}
                    />

                    {/* Action Buttons Overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <button
                            onClick={handleDownload}
                            className="glass rounded-lg hover:scale-110 active:scale-95 transition-all"
                            style={{
                                padding: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                background: 'rgba(0, 0, 0, 0.5)'
                            }}
                            title="Download Image"
                        >
                            <Download className="w-4 h-4" style={{ color: 'white' }} />
                        </button>
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="glass rounded-lg hover:scale-110 active:scale-95 transition-all"
                            style={{
                                padding: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                background: 'rgba(0, 0, 0, 0.5)'
                            }}
                            title="View Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4" style={{ color: 'white' }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.95)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                        onClick={() => setIsFullscreen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="rounded-full hover:scale-110 active:scale-95 transition-all"
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(20px)',
                                zIndex: 10000
                            }}
                        >
                            <X className="w-6 h-6" style={{ color: 'white' }} />
                        </button>

                        {/* Zoom Controls */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '12px',
                            padding: '12px 20px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '50px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 10000
                        }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoomOut();
                                }}
                                className="hover:scale-110 active:scale-95 transition-all"
                                style={{
                                    padding: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <ZoomOut className="w-5 h-5" style={{ color: 'white' }} />
                            </button>

                            <span style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: '60px',
                                justifyContent: 'center'
                            }}>
                                {Math.round(zoom * 100)}%
                            </span>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoomIn();
                                }}
                                className="hover:scale-110 active:scale-95 transition-all"
                                style={{
                                    padding: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <ZoomIn className="w-5 h-5" style={{ color: 'white' }} />
                            </button>

                            <div style={{
                                width: '1px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                margin: '0 8px'
                            }} />

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload();
                                }}
                                className="hover:scale-110 active:scale-95 transition-all"
                                style={{
                                    padding: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <Download className="w-5 h-5" style={{ color: 'white' }} />
                            </button>
                        </div>

                        {/* Image */}
                        <motion.img
                            src={imageUrl}
                            alt={alt}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: zoom }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                maxWidth: '90%',
                                maxHeight: '90%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                cursor: zoom > 1 ? 'move' : 'default'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
