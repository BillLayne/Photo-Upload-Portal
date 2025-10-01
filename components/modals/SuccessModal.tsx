import React from 'react';
import { CheckCircleIcon } from '../icons';
import { SubmissionResult, FormData } from '../../types';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    submissionResult: SubmissionResult | null;
    formData: FormData;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, submissionResult, formData }) => {
    if (!isOpen || !submissionResult) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all animate-in fade-in-0 zoom-in-95">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircleIcon className="w-12 h-12 text-white" strokeWidth={2.5}/>
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Success! Submission Received</h2>
                <p className="text-slate-600 mb-6">Thank you! We've received your photos and information. Our team will review them promptly.</p>
                
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl mb-6 shadow-lg shadow-blue-500/30">
                    <p className="text-sm opacity-80 mb-1">Your Reference Number</p>
                    <p className="text-2xl font-bold tracking-wider mb-2">{submissionResult.referenceNumber}</p>
                    <p className="text-xs opacity-70">Please save this for your records</p>
                </div>
                
                {formData.email && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800 font-medium">
                            📧 A confirmation email has been sent to:
                        </p>
                        <p className="text-blue-900 font-semibold mt-1">{formData.email}</p>
                    </div>
                )}

                <button 
                    onClick={onClose}
                    className="w-full h-12 px-6 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                >
                    Submit Another
                </button>
            </div>
        </div>
    );
};
