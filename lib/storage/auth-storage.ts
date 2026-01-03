// Auth State Persistence using LocalStorage
const AUTH_STORAGE_KEY = 'bandhannova_auth_state';
const SESSION_EXPIRY_DAYS = 30;

export interface AuthState {
    user: any;
    session: any;
    expiresAt: number;
}

export function saveAuthState(user: any, session: any): void {
    const expiresAt = Date.now() + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const authState: AuthState = {
        user,
        session,
        expiresAt
    };

    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
        console.error('Failed to save auth state:', error);
    }
}

export function getAuthState(): AuthState | null {
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return null;

        const authState: AuthState = JSON.parse(stored);

        // Check if session has expired
        if (Date.now() > authState.expiresAt) {
            clearAuthState();
            return null;
        }

        return authState;
    } catch (error) {
        console.error('Failed to get auth state:', error);
        return null;
    }
}

export function clearAuthState(): void {
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear auth state:', error);
    }
}

export function isAuthValid(): boolean {
    const authState = getAuthState();
    return authState !== null && authState.user !== null;
}

export function updateAuthState(updates: Partial<AuthState>): void {
    const current = getAuthState();
    if (!current) return;

    const updated = { ...current, ...updates };
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to update auth state:', error);
    }
}
