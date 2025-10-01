
import React from 'react';

interface SubmitBarProps {
    onSubmit: () => void;
    isSubmitting: boolean;
    imageCount: number;
}

export const SubmitBar: React.FC<SubmitBarProps> = ({ onSubmit, isSubmitting, imageCount }) => {
    const isEnabled = imageCount > 0 && !isSubmitting;

    return (
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 mt-8 rounded-lg shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] border-t-4 border-blue-600">
            <button
                type="button"
                onClick={onSubmit}
                disabled={!isEnabled}
                className="w-full h-14 px-6 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:enabled:scale-105"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                    </>
                ) : `Submit ${imageCount > 0 ? imageCount : ''} Photos to Agency`}
            </button>
        </div>
    );
};
