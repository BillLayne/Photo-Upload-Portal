import React from 'react';
import { PhoneIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md border-b-4 border-blue-600 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-4">
                        <img src="https://i.imgur.com/uVVShPM.png" alt="Bill Layne Insurance Agency" className="h-12 w-auto" />
                        <div className="hidden md:block border-l-2 border-slate-200 pl-4">
                            <h1 className="text-xl font-bold text-slate-800">Photo Upload Portal</h1>
                            <p className="text-sm text-slate-500">🔒 Secure Document Submission</p>
                        </div>
                    </div>
                    <a href="tel:336-835-1993" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                        <PhoneIcon className="w-5 h-5" />
                        <span className="text-lg">336-835-1993</span>
                    </a>
                </div>
            </div>
        </header>
    );
};