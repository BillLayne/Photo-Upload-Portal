
import React from 'react';
import { CameraIcon } from './icons';

export const Hero: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 sm:p-12 rounded-t-2xl text-center">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <CameraIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">MyInsurancePhoto.com</h1>
            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">Quick & Secure Photo Upload for Bill Layne Insurance</p>
        </div>
    );
};
