import React, { useState } from 'react';
import type { Product } from '../types';
import { VideoCameraIcon, MusicNoteIcon, EbookIcon, HealthIcon, PodcastIcon, LockClosedIcon } from './icons';

interface LibraryProps {
  library: Product[];
  onPlayMedia: (product: Product) => void;
  currentModuleIndex: number;
}

type Tab = 'all' | Product['type'];

const Library: React.FC<LibraryProps> = ({ library, onPlayMedia, currentModuleIndex }) => {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filteredLibrary = library.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });
  
  const getTabClass = (tab: Tab) => {
      const base = "px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2 text-sm sm:text-base";
      if (tab === activeTab) {
          return `${base} bg-emerald-600 text-white shadow-md`;
      }
      return `${base} bg-stone-200 text-stone-600 hover:bg-stone-300`;
  }
  
  const getIconForType = (type: Product['type']) => {
      switch (type) {
          case 'video': return <VideoCameraIcon />;
          case 'meditation': return <MusicNoteIcon />;
          case 'ebook': return <EbookIcon />;
          case 'health': return <HealthIcon />;
          case 'podcast': return <PodcastIcon />;
          default: return null;
      }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="font-title text-4xl md:text-5xl text-emerald-700">Your Library</h1>
        <p className="text-stone-500 mt-2">All your collected wellness resources in one place.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-stone-100/80 rounded-lg">
          <button className={getTabClass('all')} onClick={() => setActiveTab('all')}>All</button>
          <button className={getTabClass('video')} onClick={() => setActiveTab('video')}><VideoCameraIcon /> Videos</button>
          <button className={getTabClass('meditation')} onClick={() => setActiveTab('meditation')}><MusicNoteIcon /> Meditations</button>
          <button className={getTabClass('ebook')} onClick={() => setActiveTab('ebook')}><EbookIcon /> E-books</button>
          <button className={getTabClass('health')} onClick={() => setActiveTab('health')}><HealthIcon /> Health</button>
          <button className={getTabClass('podcast')} onClick={() => setActiveTab('podcast')}><PodcastIcon /> Podcasts</button>
      </div>
      
      {library.length === 0 ? (
          <p className="text-stone-500 italic text-center py-12">Your library is empty. Visit the store to find new resources for your journey.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredLibrary.map(item => {
                const isLocked = (item.unlockLevel || 0) > currentModuleIndex;
                return (
                    <div key={item.id} className={`bg-stone-100/50 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all ${isLocked ? 'opacity-70' : ''}`}>
                        <div className="aspect-video w-full relative">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                             {isLocked && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-2">
                                    <LockClosedIcon className="w-8 h-8 text-white"/>
                                    <p className="font-semibold mt-1">Unlocks at Module {item.unlockLevel}</p>
                                </div>
                            )}
                        </div>
                         <div className="p-4 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold font-title text-stone-800">{item.name}</h3>
                            <p className="text-sm text-stone-500 capitalize mb-2 flex items-center gap-1.5">{getIconForType(item.type)} {item.type}</p>
                            <p className="text-stone-600 flex-grow mb-4">{item.description}</p>
                            
                            <div className="mt-auto text-right">
                               <button 
                                    onClick={() => onPlayMedia(item)}
                                    disabled={isLocked}
                                    className={`px-4 py-2 rounded-md font-semibold text-white flex items-center gap-2 transition-colors ${isLocked ? 'bg-stone-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                >
                                    {isLocked ? <LockClosedIcon className="w-5 h-5"/> : (item.type === 'ebook' ? 'Read' : 'Play')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {filteredLibrary.length === 0 && (
                 <p className="text-stone-500 italic text-center py-12 sm:col-span-2 lg:col-span-3">You do not have any items of this type in your library.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default Library;