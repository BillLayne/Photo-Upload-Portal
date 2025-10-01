
import React from 'react';

interface CustomInstructionsProps {
    instructions: string;
}

export const CustomInstructions: React.FC<CustomInstructionsProps> = ({ instructions }) => {
    const instructionItems = instructions.split('|||').map(s => s.trim()).filter(Boolean);
    if (instructionItems.length === 0) return null;

    return (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-5 my-6 animate-in fade-in-0 slide-in-from-left-5 duration-500">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                📋 Your Agent Needs These Photos:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-blue-900">
                {instructionItems.map((item, index) => (
                    <li key={index} className="font-medium">{item.replace('CUSTOM: ', '')}</li>
                ))}
            </ul>
        </div>
    );
};
