
import React from 'react';

interface UploadModalProps {
    isOpen: boolean;
    status: string;
    progress: number;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, status, progress }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all animate-in fade-in-0 zoom-in-95">
                <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <h2 className="text-xl font-bold text-blue-700 mb-2">Uploading Your Photos</h2>
                <p className="text-slate-600 mb-6">Please wait while we securely upload your images. This may take a moment.</p>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm font-medium text-slate-500">{status}</p>
            </div>
        </div>
    );
};
