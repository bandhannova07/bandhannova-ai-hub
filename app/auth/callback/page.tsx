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
                console.log('🔍 Auth Callback Triggered');
                console.log('📍 Current URL:', window.location.href);
                console.log('📁 Search Params:', Object.fromEntries(searchParams.entries()));

                // Get params from search
                let code = searchParams.get('code');
                let dbIndexStr = searchParams.get('db_index');
                const error = searchParams.get('error');
                const error_description = searchParams.get('error_description');

                // Fallback for code if it's in the hash (implicit flow or custom redirect)
                if (!code && window.location.hash) {
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    code = hashParams.get('access_token') || hashParams.get('code');
                    console.log('🔗 Falling back to hash params for code:', code ? 'Found' : 'Not found');
                }

                // Fallback for db_index from localStorage
                if (!dbIndexStr) {
                    dbIndexStr = localStorage.getItem('auth_db_index');
                    console.log('📦 Falling back to localStorage for db_index:', dbIndexStr);
                }

                if (error) {
                    console.error('❌ Auth Error search param:', error, error_description);
                    throw new Error(error_description || error);
                }

                if (!code || !dbIndexStr) {
                    console.error('❌ Missing code or db_index at final check', {
                        code: code ? 'Present' : 'Missing',
                        dbIndexStr: dbIndexStr || 'Missing'
                    });
                    throw new Error('Invalid authentication response: Missing required parameters');
                }

                const dbIndex = parseInt(dbIndexStr);
                console.log(`🔌 Connecting to Database Index: ${dbIndex}`);

                // Get the correct DB instance
                const db = getDB(dbIndex);

                // Exchange code for session
                console.log('🔄 Exchanging code/session with Supabase...');
                const { data, error: sessionError } = await db.auth.exchangeCodeForSession(code);

                if (sessionError) throw sessionError;

                if (data?.user) {
                    console.log('✅ Google Auth Successful:', data.user.email);

                    // Persist active DB index
                    localStorage.setItem('active_db_index', dbIndex.toString());

                    // Create/Check Profile
                    // We try to insert a profile. If it exists, we might update it or ignore error.
                    // Since Google provides name and avatar, let's try to capture them.
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
