
import React, { useState, useEffect } from 'react';

interface WelcomeBannerProps {
    name: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl mb-6 shadow-lg shadow-green-500/20 text-center animate-in fade-in-0 slide-in-from-top-5 duration-500">
            <h3 className="font-bold text-lg mb-1">👋 Welcome, {name}!</h3>
            <p className="text-sm opacity-90">Your information is pre-filled below. Just add your photos and submit!</p>
        </div>
    );
};
