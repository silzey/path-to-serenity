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
        <div className="fixed inset-0 bg-black/60 animate-fade-in-backdrop" onClick={onClose} aria-hidden="true"></div>
        <div className="relative bg-amber-50 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full animate-scale-in">
            <h3 className="font-title text-2xl text-rose-600">{characterName}</h3>
            <p className="text-stone-500 mt-1">Affinity: <span className="font-bold">{characterData.affinity > 0 ? `+${characterData.affinity}` : characterData.affinity}</span></p>
            <p className="mt-4 text-stone-700 italic">"{characterData.bio}"</p>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-stone-200 transition-colors"
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

    const meditationTracks = products.filter(p => p.type === 'meditation' && (p.unlockLevel || 0) <= 20).slice(0, 3);

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
      <div className="bg-stone-100/50 rounded-lg p-4 shadow-lg">
        <h2 className="font-title text-2xl border-b border-stone-300 pb-2 mb-3 flex items-center"><EnlightenmentIcon /> Training Modules</h2>
        <div className="space-y-2">
            <p className="text-stone-600 text-center font-medium">Current: <span className="text-sky-600 font-bold">{currentModuleName}</span></p>
            <div className="w-full bg-stone-300 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-stone-500 text-right font-semibold">Module: {currentModuleIndex + 1} / 100</p>
        </div>
      </div>
        
      <div className="bg-stone-100/50 rounded-lg p-4 shadow-lg">
        <h2 className="font-title text-2xl border-b border-stone-300 pb-2 mb-3 flex items-center"><WellnessToolsIcon /> Wellness Tools</h2>
        {inventory.length > 0 ? (
          <ul className="list-disc list-inside text-stone-600 space-y-1">
            {inventory.map((item, index) => (
              <li key={index} className="capitalize">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-stone-500 italic">You have no tools yet.</p>
        )}
      </div>

       <div className="bg-stone-100/50 rounded-lg p-4 shadow-lg">
        <h2 className="font-title text-2xl border-b border-stone-300 pb-2 mb-3 flex items-center"><MeditationIcon /> Guided Meditations</h2>
        <ul className="space-y-2">
            {meditationTracks.map((track) => {
                const isLocked = (track.unlockLevel || 0) > currentModuleIndex;
                return (
                    // FIX: The 'Product' type does not have a 'title' property. Using 'id' for the key instead.
                    <li key={track.id} className="flex items-center gap-3">
                        <button 
                            onClick={() => onPlayMedia(track)} 
                            disabled={isLocked}
                            className="text-violet-600 hover:text-violet-800 transition-colors disabled:text-stone-400 disabled:cursor-not-allowed"
                            // FIX: The 'Product' type does not have a 'title' property. Using 'name' instead.
                            aria-label={`Play ${track.name}`}
                        >
                            {isLocked ? <LockClosedIcon className="h-6 w-6"/> : <PlayIcon />}
                        </button>
                        {/* FIX: The 'Product' type does not have a 'title' property. Using 'name' instead. */}
                        <span className={`text-stone-600 ${isLocked ? 'text-stone-400' : ''}`}>{track.name}</span>
                         {isLocked && <span className="text-xs text-stone-400 ml-auto">(Unlocks at Module {track.unlockLevel})</span>}
                    </li>
                );
            })}
        </ul>
      </div>

      <div className="bg-stone-100/50 rounded-lg p-4 shadow-lg">
            <h2 className="font-title text-2xl border-b border-stone-300 pb-2 mb-3 flex items-center"><ConnectionsIcon /> Connections</h2>
            {Object.keys(relationships).length > 0 ? (
              <ul className="space-y-2 text-stone-600">
                {Object.entries(relationships).map(([name, data]) => (
                  <li key={name} className="capitalize flex justify-between items-center">
                    <button onClick={() => setSelectedCharacter(name)} className="text-left hover:text-rose-600 transition-colors">{name}</button>
                    <span className={`font-bold ${data.affinity >= 50 ? 'text-emerald-600' : data.affinity > 0 ? 'text-emerald-500' : 'text-rose-600'}`}>{data.affinity > 0 ? `+${data.affinity}` : data.affinity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-500 italic">You haven't formed any connections yet.</p>
            )}
      </div>
      <div className="bg-stone-100/50 rounded-lg p-4 flex-grow flex flex-col shadow-lg overflow-hidden">
        <h2 className="font-title text-2xl border-b border-stone-300 pb-2 mb-3 flex-shrink-0 flex items-center"><JourneyLogIcon /> Journey Log</h2>
        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            {log.map((entry) => (
            <div key={entry.id} className="mb-4 text-sm">
                <p className="text-emerald-600 font-bold">{`> ${entry.action}`}</p>
                <p className="text-stone-500 pl-4 italic">{entry.outcome}</p>
            </div>
            ))}
             <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default SidePanel;