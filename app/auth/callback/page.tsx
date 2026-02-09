'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDB } from '@/lib/database/multi-db';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('Authenticating with Google...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Detailed debug logging
                console.log('🔍 Auth Callback Triggered (Single DB Mode)');
                console.log('📍 Current URL:', window.location.href);
                console.log('📁 Search Params:', Object.fromEntries(searchParams.entries()));

                // Get params from search
                let code = searchParams.get('code');
                const error = searchParams.get('error');
                const error_description = searchParams.get('error_description');

                // Fallback for code if it's in the hash
                if (!code && window.location.hash) {
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    code = hashParams.get('access_token') || hashParams.get('code');
                    console.log('🔗 Falling back to hash params for code:', code ? 'Found' : 'Not found');
                }

                if (error) {
                    console.error('❌ Auth Error search param:', error, error_description);
                    throw new Error(error_description || error);
                }

                if (!code) {
                    console.error('❌ Missing code at final check');
                    throw new Error('Invalid authentication response: Missing code');
                }

                // Always use Primary DB
                const db = getDB(0);
                console.log('🔌 Connected to Primary Database');

                // Exchange code for session
                console.log('🔄 Exchanging code for session with Supabase...');
                const { data, error: sessionError } = await db.auth.exchangeCodeForSession(code);

                if (sessionError) {
                    console.error('❌ Session exchange failed:', sessionError);
                    throw sessionError;
                }

                if (data?.user) {
                    console.log('✅ Google Auth Successful:', data.user.email);

                    // Persist active DB index (always 0)
                    localStorage.setItem('active_db_index', '0');

                    // Create/Check Profile
                    try {
                        const { error: profileError } = await db.from('profiles').upsert({
                            id: data.user.id,
                            email: data.user.email,
                            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
                            avatar_url: data.user.user_metadata?.avatar_url,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'id' });

                        if (profileError) {
                            console.error('Profile upsert warning:', profileError);
                        }
                    } catch (e) {
                        console.error('Profile creation failed', e);
                    }

                    // Check install prompt status
                    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                        window.matchMedia('(display-mode: fullscreen)').matches ||
                        (window.navigator as any).standalone === true;

                    const installPromptShown = localStorage.getItem('installPromptShown');

                    setTimeout(() => {
                        if (isInstalled || installPromptShown === 'accepted' || installPromptShown === 'skipped') {
                            router.push('/dashboard');
                        } else {
                            router.push('/install');
                        }
                    }, 500); // Small delay for UX
                } else {
                    throw new Error('No user data returned');
                }

            } catch (err: any) {
                console.error('Callback error:', err);
                setStatus('Login failed: ' + err.message);

                // If the error is about a missing session or something that might be fixed by re-trying
                // we still redirect to login after a delay.
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin mb-4"></div>
            <h1 className="text-xl font-bold mb-2">Signing in...</h1>
            <p className="text-gray-400">{status}</p>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
