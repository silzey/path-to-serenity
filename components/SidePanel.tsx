"use client";

import React, { useRef, useEffect, useState } from 'react';
import type { LogEntry, Character, Product } from '../types';
import { products } from '../data/products';
import { JourneyLogIcon, WellnessToolsIcon, ConnectionsIcon, MeditationIcon, EnlightenmentIcon, PlayIcon, CloseIcon, LockClosedIcon } from './icons';

interface SidePanelProps {
    inventory: string[];
    relationships: { [key: string]: Character };
    log: LogEntry[];
    currentModuleIndex: number;
    currentModuleName: string;
    onPlayMedia: (product: Product) => void;
}

const CharacterModal: React.FC<{ characterName: string, characterData: Character, onClose: () => void }> = ({ characterName, characterData, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-black/70 animate-fade-in-backdrop" onClick={onClose} aria-hidden="true"></div>
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full animate-scale-in">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{characterName}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Affinity: <span className="font-bold">{characterData.affinity > 0 ? `+${characterData.affinity}` : characterData.affinity}</span></p>
            <p className="mt-4 text-gray-700 dark:text-gray-300 italic">"{characterData.bio}"</p>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
            >
               <CloseIcon />
            </button>
        </div>
    </div>
);


const SidePanel: React.FC<SidePanelProps> = ({ inventory, relationships, log, currentModuleIndex, currentModuleName, onPlayMedia }) => {
    const logEndRef = useRef<HTMLDivElement>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    const meditationTracks = products.filter(p => p.type === 'meditation' && p.price === 0);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    const progressPercentage = Math.min(100, ((currentModuleIndex + 1) / 100) * 100);

  return (
    <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6">
      {selectedCharacter && relationships[selectedCharacter] && (
        <CharacterModal 
            characterName={selectedCharacter}
            characterData={relationships[selectedCharacter]}
            onClose={() => setSelectedCharacter(null)}
        />
      )}
      <div className="rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="font-bold text-xl border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex items-center text-gray-900 dark:text-white"><EnlightenmentIcon /> Training Modules</h2>
        <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 text-center font-medium">Current: <span className="text-blue-600 dark:text-blue-400 font-bold">{currentModuleName}</span></p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right font-semibold">Module: {currentModuleIndex + 1} / 100</p>
        </div>
      </div>
        
      <div className="rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="font-bold text-xl border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex items-center text-gray-900 dark:text-white"><WellnessToolsIcon /> Wellness Tools</h2>
        {inventory.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            {inventory.map((item, index) => (
              <li key={index} className="capitalize">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">You have no tools yet.</p>
        )}
      </div>

       <div className="rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="font-bold text-xl border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex items-center text-gray-900 dark:text-white"><MeditationIcon /> Free Meditations</h2>
        <ul className="space-y-2">
            {meditationTracks.map((track) => {
                const isLocked = (track.unlockLevel || 0) > currentModuleIndex;
                return (
                    <li key={track.id} className="flex items-center gap-3">
                        <button 
                            onClick={() => onPlayMedia(track)} 
                            disabled={isLocked}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
                            aria-label={`Play ${track.name}`}
                        >
                            {isLocked ? <LockClosedIcon className="h-6 w-6"/> : <PlayIcon />}
                        </button>
                        <span className={`text-gray-700 dark:text-gray-300 ${isLocked ? 'text-gray-400 dark:text-gray-500' : ''}`}>{track.name}</span>
                         {isLocked && <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">(Unlocks at Module {track.unlockLevel})</span>}
                    </li>
                );
            })}
        </ul>
      </div>

      <div className="rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="font-bold text-xl border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex items-center text-gray-900 dark:text-white"><ConnectionsIcon /> Connections</h2>
            {Object.keys(relationships).length > 0 ? (
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {Object.entries(relationships).map(([name, data]) => (
                  <li key={name} className="capitalize flex justify-between items-center">
                    <button onClick={() => setSelectedCharacter(name)} className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{name}</button>
                    <span className={`font-bold ${data.affinity >= 50 ? 'text-green-600 dark:text-green-400' : data.affinity > 0 ? 'text-green-500' : 'text-red-600 dark:text-red-400'}`}>{data.affinity > 0 ? `+${data.affinity}` : data.affinity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">You haven't formed any connections yet.</p>
            )}
      </div>
      <div className="rounded-xl p-4 flex-grow flex flex-col shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="font-bold text-xl border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex-shrink-0 flex items-center text-gray-900 dark:text-white"><JourneyLogIcon /> Journey Log</h2>
        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            {log.map((entry) => (
            <div key={entry.id} className="mb-4 text-sm">
                <p className="text-blue-600 dark:text-blue-400 font-bold">{`> ${entry.action}`}</p>
                <p className="text-gray-500 dark:text-gray-400 pl-4 italic">{entry.outcome}</p>
            </div>
            ))}
             <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default SidePanel;