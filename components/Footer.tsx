
import React from 'react';
import { PhoneIcon, MailIcon } from './icons';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-white mt-12 py-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <img src="https://i.imgur.com/cBAgeX8.png" alt="Bill Layne Insurance Agency" className="h-12 w-auto mx-auto mb-4 filter brightness-0 invert" />
                <h3 className="text-xl font-semibold">Bill Layne Insurance Agency</h3>
                <p className="text-slate-400 mt-1">1283 N Bridge St, Elkin NC 28621</p>
                <div className="flex justify-center items-center space-x-6 my-4">
                    <a href="tel:336-835-1993" className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors">
                        <PhoneIcon className="w-4 h-4" />
                        <span>336-835-1993</span>
                    </a>
                    <a href="mailto:Save@BillLayneInsurance.com" className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors">
                        <MailIcon className="w-4 h-4" />
                        <span>Email Us</span>
                    </a>
                </div>
                <a href="https://www.BillLayneInsurance.com" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    www.BillLayneInsurance.com
                </a>
                <div className="mt-8 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                        🔒 Your photos and information are securely transmitted and stored.
                    </p>
                    <a href="/agency-tool.html" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:text-slate-400 mt-2 inline-block">
                        Agency Tool (for internal use)
                    </a>
                </div>
            </div>
        </footer>
    );
};
