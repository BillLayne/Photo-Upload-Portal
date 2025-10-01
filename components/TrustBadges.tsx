
import React from 'react';
import { LockIcon, ZapIcon, CheckCircleIcon } from './icons';

const TrustItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-blue-600">{icon}</div>
        <span className="font-semibold text-sm text-slate-700">{text}</span>
    </div>
);

export const TrustBadges: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 rounded-lg mt-8">
            <TrustItem icon={<LockIcon className="w-7 h-7" />} text="Encrypted" />
            <TrustItem icon={<ZapIcon className="w-7 h-7" />} text="Fast Upload" />
            <TrustItem icon={<CheckCircleIcon className="w-7 h-7" />} text="Direct to Agent" />
        </div>
    );
};
