'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Check, Gift } from 'lucide-react';
import { addBonusMessages } from '@/lib/messages/quota';

interface RewardAdModalProps {
    open: boolean;
    onClose: () => void;
    onRewardGranted: () => void;
}

export default function RewardAdModal({ open, onClose, onRewardGranted }: RewardAdModalProps) {
    const [adsWatched, setAdsWatched] = useState(0);
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [adCompleted, setAdCompleted] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setAdsWatched(0);
            setIsWatchingAd(false);
            setAdCompleted(false);
        }
    }, [open]);

    const loadAdsterraAd = () => {
        setIsWatchingAd(true);

        // Load Adsterra video ad script
        const script = document.createElement('script');
        script.src = 'https://pl28429222.effectivegatecpm.com/e3/f4/17/e3f417471f4d4817b7466dbc322e5e25.js';
        script.async = true;

        script.onload = () => {
            console.log('Adsterra ad loaded');
            // Simulate ad completion after 30 seconds (for testing)
            // In production, Adsterra will trigger completion callback
            setTimeout(() => {
                handleAdComplete();
            }, 30000); // 30 seconds
        };

        document.body.appendChild(script);
    };

    const handleAdComplete = () => {
        const newCount = adsWatched + 1;
        setAdsWatched(newCount);
        setIsWatchingAd(false);

        if (newCount >= 2) {
            // Both ads watched - grant reward
            setAdCompleted(true);
            addBonusMessages(5);

            // Show success message for 2 seconds then close
            setTimeout(() => {
                onRewardGranted();
                onClose();
            }, 2000);
        }
    };

    const startWatchingAds = () => {
        loadAdsterraAd();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-purple-500" />
                        Get 5 Free Messages
                    </DialogTitle>
                    <DialogDescription>
                        Watch 2 short video ads (30 seconds each) to unlock 5 more free messages
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${adsWatched >= 1 ? 'text-green-500' : 'text-gray-400'}`}>
                            {adsWatched >= 1 ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-current" />
                            )}
                            <span className="font-medium">Ad 1</span>
                        </div>

                        <div className="h-px w-8 bg-gray-300" />

                        <div className={`flex items-center gap-2 ${adsWatched >= 2 ? 'text-green-500' : 'text-gray-400'}`}>
                            {adsWatched >= 2 ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-current" />
                            )}
                            <span className="font-medium">Ad 2</span>
                        </div>
                    </div>

                    {/* Ad Container */}
                    <div
                        className="relative rounded-lg overflow-hidden"
                        style={{
                            minHeight: '250px',
                            background: 'rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {!isWatchingAd && !adCompleted && (
                            <div className="text-center p-8">
                                <Play className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                                <p className="text-sm text-gray-600">
                                    {adsWatched === 0 ? 'Ready to watch first ad' : 'Ready to watch second ad'}
                                </p>
                            </div>
                        )}

                        {isWatchingAd && (
                            <div className="text-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                                <p className="text-sm text-gray-600">Loading ad...</p>
                            </div>
                        )}

                        {adCompleted && (
                            <div className="text-center p-8">
                                <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                <p className="text-lg font-bold text-green-600">+5 Messages Unlocked!</p>
                                <p className="text-sm text-gray-600 mt-2">Closing...</p>
                            </div>
                        )}

                        {/* Adsterra ad will be injected here */}
                        <div id="adsterra-video-container"></div>
                    </div>

                    {/* Action Button */}
                    {!adCompleted && (
                        <Button
                            onClick={startWatchingAds}
                            disabled={isWatchingAd}
                            className="w-full"
                            size="lg"
                        >
                            {isWatchingAd ? (
                                'Watching Ad...'
                            ) : adsWatched === 0 ? (
                                'Start Watching Ads'
                            ) : (
                                `Watch Ad ${adsWatched + 1} of 2`
                            )}
                        </Button>
                    )}

                    <p className="text-xs text-center text-gray-500">
                        Ads help us keep this service free for everyone
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
