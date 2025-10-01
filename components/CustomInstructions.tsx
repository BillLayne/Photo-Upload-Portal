
import React, { useState, useMemo } from 'react';
import { SquareIcon, CheckSquareIcon } from './icons';

interface CustomInstructionsProps {
    instructions: string;
}

export const CustomInstructions: React.FC<CustomInstructionsProps> = ({ instructions }) => {
    const instructionItems = useMemo(() => 
        instructions.split('|||').map(s => s.trim().replace('CUSTOM: ', '')).filter(Boolean),
        [instructions]
    );

    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    const handleToggle = (index: number) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    if (instructionItems.length === 0) return null;

    return (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-5 my-6 animate-in fade-in-0 slide-in-from-left-5 duration-500">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                📋 Your Agent Needs These Photos:
            </h3>
            <p className="text-sm text-blue-700 mb-4 -mt-2">Tap each item below as you upload it to keep track.</p>
            <ul className="space-y-2">
                {instructionItems.map((item, index) => {
                    const isChecked = checkedItems.has(index);
                    return (
                        <li 
                            key={index} 
                            onClick={() => handleToggle(index)}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-blue-100"
                            aria-checked={isChecked}
                            role="checkbox"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleToggle(index); } }}
                        >
                            {isChecked ? (
                                <CheckSquareIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                            ) : (
                                <SquareIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                            )}
                            <span className={`font-medium transition-colors ${isChecked ? 'text-slate-500 line-through' : 'text-blue-900'}`}>
                                {item}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
