// Enhanced Skeleton Components with Exact Area Matching
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

export function SkeletonButton({ width = '100%' }: { width?: string }) {
    return <div className="skeleton skeleton-button" style={{ width }} />;
}

// Dashboard Skeleton - Matches exact layout
export function SkeletonDashboard() {
    return (
        <div>
            {/* Header skeleton */}
            <div style={{ marginBottom: '2rem' }}>
                <SkeletonTitle width="40%" />
                <div style={{ marginTop: '1rem' }}>
                    <SkeletonText lines={1} width="60%" />
                </div>
            </div>

            {/* Stats cards skeleton */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
                ))}
            </div>

            {/* AI Cards Grid skeleton - 2x2 on mobile */}
            <div style={{ marginBottom: '2rem' }}>
                <SkeletonTitle width="30%" />
                <div
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                    style={{ gap: '12px', marginTop: '1rem' }}
                >
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonCard key={i} aspectRatio="1 / 1.2" />
                    ))}
                </div>
            </div>
        </div>
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
