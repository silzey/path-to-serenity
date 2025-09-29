"use client";

import React from 'react';
import { YOGA_MODULES } from '../services/geminiService';
import { CheckCircleIcon, PlayCircleIcon, LockClosedIcon, CloseIcon } from './icons';

interface ModuleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentModuleIndex: number;
}


const ModuleMenu: React.FC<ModuleMenuProps> = ({ isOpen, onClose, currentModuleIndex }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/70 animate-fade-in-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col animate-slide-in-left">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Training Modules</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-2">
                {YOGA_MODULES.map((moduleName, index) => {
                    const isCompleted = index < currentModuleIndex;
                    const isCurrent = index === currentModuleIndex;
                    
                    let statusIcon;
                    let textClass = "text-gray-800 dark:text-gray-300";
                    let bgClass = isCurrent ? "bg-gray-100 dark:bg-gray-800" : "";


                    if (isCompleted) {
                        statusIcon = <CheckCircleIcon />;
                        textClass = "text-gray-500 dark:text-gray-500 line-through";
                    } else if (isCurrent) {
                        statusIcon = <PlayCircleIcon />;
                        textClass = "font-bold text-blue-600 dark:text-blue-400";
                    } else {
                        statusIcon = <LockClosedIcon />;
                        textClass = "text-gray-400 dark:text-gray-600";
                    }

                    return (
                        <li key={index} className={`flex items-center gap-3 p-2 rounded-md ${bgClass}`}>
                            <div className="flex-shrink-0">{statusIcon}</div>
                            <span className={textClass}>{moduleName}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default ModuleMenu;