"use client";

import React, { useState } from 'react';
import type { Product } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { VideoCameraIcon, MusicNoteIcon, EbookIcon, HealthIcon, PodcastIcon, LockClosedIcon } from './icons';
import StarRating from './StarRating';

interface LibraryProps {
  library: Product[];
  onPlayMedia: (product: Product) => void;
  currentModuleIndex: number;
  onReview: (product: Product) => void;
  onViewReviews: (product: Product) => void;
}

type Tab = 'all' | Product['type'];

const Library: React.FC<LibraryProps> = ({ library, onPlayMedia, currentModuleIndex, onReview, onViewReviews }) => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredLibrary = library.filter(item => {
    const tabMatch = activeTab === 'all' || item.type === activeTab;
    const searchMatch = !debouncedSearchTerm ||
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return tabMatch && searchMatch;
  });
  
  const getTabClass = (tab: Tab) => {
      const base = "px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2 text-sm sm:text-base";
      if (tab === activeTab) {
          return `${base} bg-blue-600 text-white shadow-sm`;
      }
      return `${base} bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700`;
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

  const calculateAverageRating = (reviews: Product['reviews']) => {
      if (!reviews || reviews.length === 0) return 0;
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      return total / reviews.length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="font-extrabold text-4xl md:text-5xl text-gray-900 dark:text-white">Your Library</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">All your collected wellness resources in one place.</p>
      </div>

      <div className="p-2 rounded-lg space-y-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button className={getTabClass('all')} onClick={() => setActiveTab('all')}>All</button>
            <button className={getTabClass('video')} onClick={() => setActiveTab('video')}><VideoCameraIcon /> Videos</button>
            <button className={getTabClass('meditation')} onClick={() => setActiveTab('meditation')}><MusicNoteIcon /> Meditations</button>
            <button className={getTabClass('ebook')} onClick={() => setActiveTab('ebook')}><EbookIcon /> E-books</button>
            <button className={getTabClass('health')} onClick={() => setActiveTab('health')}><HealthIcon /> Health</button>
            <button className={getTabClass('podcast')} onClick={() => setActiveTab('podcast')}><PodcastIcon /> Podcasts</button>
        </div>
        <div className="px-2">
             <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your library..."
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>
      
      {library.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-12">Your library is empty. Visit the store to find new resources for your journey.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredLibrary.map(item => {
                const isLocked = (item.unlockLevel || 0) > currentModuleIndex;
                const avgRating = calculateAverageRating(item.reviews);
                return (
                    <div key={item.id} className={`rounded-xl shadow-sm overflow-hidden flex flex-col transition-all border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isLocked ? 'opacity-70' : ''}`}>
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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-1 flex items-center gap-1.5">{getIconForType(item.type)} {item.type}</p>
                            
                            <button onClick={() => onViewReviews(item)} className="flex items-center gap-1 mb-2 group">
                                <StarRating rating={avgRating} />
                                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">({item.reviews.length} reviews)</span>
                            </button>

                            <p className="text-gray-700 dark:text-gray-300 flex-grow mb-4 text-sm">{item.description}</p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                               <button 
                                    onClick={() => onReview(item)}
                                    disabled={isLocked}
                                    className="px-4 py-2 text-sm rounded-md font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Review
                                </button>
                               <button 
                                    onClick={() => onPlayMedia(item)}
                                    disabled={isLocked}
                                    className={`px-4 py-2 rounded-md font-semibold text-white flex items-center gap-2 transition-colors ${isLocked ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isLocked ? <LockClosedIcon className="w-5 h-5"/> : (item.type === 'ebook' ? 'Read' : 'Play')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {filteredLibrary.length === 0 && (
                 <p className="text-gray-500 dark:text-gray-400 italic text-center py-12 sm:col-span-2 lg:col-span-3">No items in your library match your search.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default Library;