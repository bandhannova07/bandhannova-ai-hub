/**
 * Session Management
 * Handles user sessions with auto-login and expiry
 */

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface Session {
    userId: string;
    email: string;
    fullName: string;
    createdAt: number;
    expiresAt: number;
}

/**
 * Create a new session
 */
export function createSession(userData: {
    id: string;
    email: string;
    fullName: string;
}): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const session: Session = {
        userId: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        createdAt: now,
        expiresAt: now + SESSION_DURATION
    };

    localStorage.setItem('userSession', JSON.stringify(session));
}

/**
 * Get current session
 * Returns null if session doesn't exist or is expired
 */
export function getSession(): Session | null {
    if (typeof window === 'undefined') return null;

    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) return null;

    try {
        const session: Session = JSON.parse(sessionStr);

        // Check if expired
        if (Date.now() > session.expiresAt) {
            clearSession();
            return null;
        }

        return session;
    } catch (error) {
        // Invalid session data
        clearSession();
        return null;
    }
}

/**
 * Clear current session (logout)
 */
export function clearSession(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('userSession');
}

/**
 * Check if session is valid
 */
export function isSessionValid(): boolean {
    return getSession() !== null;
}

/**
 * Get session expiry time
 */
export function getSessionExpiry(): Date | null {
    const session = getSession();
    if (!session) return null;

    return new Date(session.expiresAt);
}

/**
 * Get time until session expires (in milliseconds)
 */
export function getTimeUntilExpiry(): number | null {
    const session = getSession();
    if (!session) return null;

    return session.expiresAt - Date.now();
}

/**
 * Extend session (refresh expiry time)
 */
export function extendSession(): void {
    const session = getSession();
    if (!session) return;

    const now = Date.now();
    session.expiresAt = now + SESSION_DURATION;

    if (typeof window !== 'undefined') {
        localStorage.setItem('userSession', JSON.stringify(session));
    }
}
