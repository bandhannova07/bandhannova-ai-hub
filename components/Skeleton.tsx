// Enhanced Skeleton Components with Desktop/Mobile Separation
'use client';

import React from 'react';

export function SkeletonCard({ aspectRatio = '1 / 1.2' }: { aspectRatio?: string }) {
    return (
        <div
            className="skeleton"
            style={{
                aspectRatio,
                borderRadius: '24px',
                width: '100%'
            }}
        />
    );
}

export function SkeletonText({ lines = 3, width = '100%' }: { lines?: number; width?: string }) {
    return (
        <div style={{ width }}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton skeleton-text"
                    style={{
                        width: i === lines - 1 ? '70%' : '100%',
                        marginBottom: i === lines - 1 ? 0 : '0.5rem'
                    }}
                />
            ))}
        </div>
    );
}

export function SkeletonTitle({ width = '60%' }: { width?: string }) {
    return <div className="skeleton skeleton-title" style={{ width }} />;
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
    return (
        <div
            className="skeleton skeleton-avatar"
            style={{ width: size, height: size }}
        />
    );
}

export function SkeletonButton({ width = '100%', height = '48px' }: { width?: string; height?: string }) {
    return <div className="skeleton skeleton-button" style={{ width, height, borderRadius: '12px' }} />;
}

// Desktop Sidebar Skeleton
function DesktopSidebarSkeleton() {
    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px 16px',
            zIndex: 40
        }}>
            {/* Logo */}
            <div className="skeleton" style={{
                width: '120px',
                height: '40px',
                marginBottom: '32px',
                borderRadius: '8px'
            }} />

            {/* Navigation Items */}
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ marginBottom: '12px' }}>
                    <div className="skeleton" style={{
                        height: '48px',
                        borderRadius: '12px'
                    }} />
                </div>
            ))}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* User Section */}
            <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                <div className="skeleton" style={{
                    height: '64px',
                    borderRadius: '12px'
                }} />
            </div>
        </div>
    );
}

// Desktop Main Content Skeleton
function DesktopMainContentSkeleton() {
    return (
        <div style={{ marginLeft: '280px', padding: '8px', marginTop: '120px' }}>
            {/* Welcome Section */}
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                <div className="skeleton" style={{
                    height: 'clamp(2rem, 6vw, 3.5rem)',
                    width: '60%',
                    margin: '0 auto 12px auto',
                    borderRadius: '8px'
                }} />
                <div className="skeleton" style={{
                    height: '1.25rem',
                    width: '80%',
                    margin: '0 auto',
                    borderRadius: '6px'
                }} />
            </div>

            {/* Recents Section */}
            <div style={{ marginBottom: '48px' }}>
                <div className="skeleton" style={{
                    height: 'clamp(1.5rem, 4vw, 2rem)',
                    width: '150px',
                    marginBottom: '16px',
                    borderRadius: '6px'
                }} />
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ minWidth: '80px', textAlign: 'center' }}>
                            <div className="skeleton" style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                margin: '0 auto 8px auto'
                            }} />
                            <div className="skeleton" style={{
                                height: '12px',
                                width: '60px',
                                margin: '0 auto',
                                borderRadius: '4px'
                            }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Default Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div className="skeleton" style={{
                        height: 'clamp(1.5rem, 4vw, 2rem)',
                        width: '120px',
                        borderRadius: '6px'
                    }} />
                    <div className="skeleton" style={{
                        height: '0.875rem',
                        width: '80px',
                        borderRadius: '4px'
                    }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '12px' }}>
                    {[1, 2].map(i => (
                        <SkeletonCard key={i} aspectRatio="1 / 1.2" />
                    ))}
                </div>
            </div>

            {/* Featured Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div className="skeleton" style={{
                        height: 'clamp(1.5rem, 4vw, 2rem)',
                        width: '140px',
                        borderRadius: '6px'
                    }} />
                    <div className="skeleton" style={{
                        height: '0.875rem',
                        width: '100px',
                        borderRadius: '4px'
                    }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '12px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonCard key={i} aspectRatio="1 / 1.2" />
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div style={{ marginTop: '80px', marginBottom: '60px', textAlign: 'center' }}>
                <div className="skeleton" style={{
                    height: 'clamp(1.75rem, 5vw, 2.5rem)',
                    width: '50%',
                    margin: '32px auto 16px auto',
                    borderRadius: '8px'
                }} />
                <div className="skeleton" style={{
                    height: '1.25rem',
                    width: '70%',
                    margin: '0 auto 30px auto',
                    borderRadius: '6px'
                }} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton" style={{
                            height: '400px',
                            borderRadius: '24px'
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Mobile Content Skeleton (no sidebar)
function MobileContentSkeleton() {
    return (
        <div style={{ padding: '8px', marginTop: '80px' }}>
            {/* Mobile Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton" style={{
                    width: '100px',
                    height: '32px',
                    borderRadius: '6px'
                }} />
                <div className="skeleton" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px'
                }} />
            </div>

            {/* Welcome Section */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <div className="skeleton" style={{
                    height: '2rem',
                    width: '80%',
                    margin: '0 auto 12px auto',
                    borderRadius: '6px'
                }} />
                <div className="skeleton" style={{
                    height: '1rem',
                    width: '90%',
                    margin: '0 auto',
                    borderRadius: '4px'
                }} />
            </div>

            {/* Recents Section */}
            <div style={{ marginBottom: '32px' }}>
                <div className="skeleton" style={{
                    height: '1.5rem',
                    width: '120px',
                    marginBottom: '12px',
                    borderRadius: '4px'
                }} />
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ minWidth: '64px', textAlign: 'center' }}>
                            <div className="skeleton" style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                margin: '0 auto 6px auto'
                            }} />
                            <div className="skeleton" style={{
                                height: '10px',
                                width: '50px',
                                margin: '0 auto',
                                borderRadius: '3px'
                            }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Default Section */}
            <div style={{ marginBottom: '32px' }}>
                <div className="skeleton" style={{
                    height: '1.5rem',
                    width: '100px',
                    marginBottom: '12px',
                    borderRadius: '4px'
                }} />
                <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                    {[1, 2].map(i => (
                        <SkeletonCard key={i} aspectRatio="1 / 1.2" />
                    ))}
                </div>
            </div>

            {/* Featured Section */}
            <div style={{ marginBottom: '32px' }}>
                <div className="skeleton" style={{
                    height: '1.5rem',
                    width: '120px',
                    marginBottom: '12px',
                    borderRadius: '4px'
                }} />
                <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <SkeletonCard key={i} aspectRatio="1 / 1.2" />
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div style={{ marginTop: '48px', marginBottom: '48px', textAlign: 'center' }}>
                <div className="skeleton" style={{
                    height: '1.75rem',
                    width: '70%',
                    margin: '0 auto 12px auto',
                    borderRadius: '6px'
                }} />
                <div className="skeleton" style={{
                    height: '1rem',
                    width: '85%',
                    margin: '0 auto 24px auto',
                    borderRadius: '4px'
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton" style={{
                            height: '320px',
                            borderRadius: '20px'
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Main Dashboard Skeleton - Responsive
export function SkeletonDashboard() {
    return (
        <>
            {/* Desktop Skeleton (lg and above) */}
            <div className="hidden lg:block">
                <DesktopSidebarSkeleton />
                <DesktopMainContentSkeleton />
            </div>

            {/* Mobile Skeleton (below lg) */}
            <div className="block lg:hidden">
                <MobileContentSkeleton />
            </div>
        </>
    );
}

// Chat Skeleton
export function SkeletonChat() {
    return (
        <div style={{ padding: '1rem' }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                        <SkeletonAvatar />
                        <div style={{ flex: 1 }}>
                            <SkeletonText lines={2} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Page Skeleton
export function SkeletonPage() {
    return (
        <div style={{ padding: '2rem' }}>
            <SkeletonTitle width="50%" />
            <div style={{ marginTop: '2rem' }}>
                <SkeletonText lines={5} />
            </div>
        </div>
    );
}
