// Skeleton Loading Components
import React from 'react';

export function SkeletonCard() {
    return (
        <div className="skeleton skeleton-card" />
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="skeleton skeleton-text" style={{ width: `${100 - i * 10}%` }} />
            ))}
        </div>
    );
}

export function SkeletonTitle() {
    return <div className="skeleton skeleton-title" />;
}

export function SkeletonAvatar() {
    return <div className="skeleton skeleton-avatar" />;
}

export function SkeletonButton() {
    return <div className="skeleton skeleton-button" />;
}

export function SkeletonDashboard() {
    return (
        <div style={{ padding: '2rem' }}>
            <SkeletonTitle />
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
            }}>
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}

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
