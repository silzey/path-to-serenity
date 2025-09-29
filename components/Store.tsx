"use client";

import React, { useState } from 'react';
import type { Product } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { ShoppingCartIcon, CheckCircleIcon, VideoCameraIcon, MusicNoteIcon, EbookIcon, HealthIcon, PodcastIcon, LockClosedIcon } from './icons';
import StarRating from './StarRating';

interface StoreProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  ownedLibrary: Product[];
  cart: Product[];
  currentModuleIndex: number;
  onViewReviews: (product: Product) => void;
}

type Filter = 'all' | Product['type'];

const Store: React.FC<StoreProps> = ({ products, onAddToCart, ownedLibrary, cart, currentModuleIndex, onViewReviews }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredProducts = products.filter(product => {
    const filterMatch = activeFilter === 'all' || product.type === activeFilter;
    const searchMatch = !debouncedSearchTerm ||
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return filterMatch && searchMatch;
  });
  
  const filters: { label: string, filter: Filter, icon: React.ReactNode }[] = [
    { label: 'All', filter: 'all', icon: null },
    { label: 'Videos', filter: 'video', icon: <VideoCameraIcon /> },
    { label: 'Meditations', filter: 'meditation', icon: <MusicNoteIcon /> },
    { label: 'E-books', filter: 'ebook', icon: <EbookIcon /> },
    { label: 'Health', filter: 'health', icon: <HealthIcon /> },
    { label: 'Podcasts', filter: 'podcast', icon: <PodcastIcon /> },
  ];

  const getFilterClass = (filter: Filter) => {
      const base = "px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2";
      if (filter === activeFilter) {
          return `${base} bg-blue-600 text-white`;
      }
      return `${base} bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700`;
  }
  
  const calculateAverageRating = (reviews: Product['reviews']) => {
      if (reviews.length === 0) return 0;
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      return total / reviews.length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="font-extrabold text-4xl md:text-5xl text-gray-900 dark:text-white">Wellness Store</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Enhance your journey with our curated collection of resources.</p>
      </div>

      <div className="p-2 rounded-lg space-y-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {filters.map(({label, filter, icon}) => (
            <button key={filter} className={getFilterClass(filter)} onClick={() => setActiveFilter(filter)}>
                {icon} {label}
            </button>
            ))}
        </div>
        <div className="px-2">
            <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources..."
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProducts.map(product => {
          const isOwned = ownedLibrary.some(item => item.id === product.id);
          const inCart = cart.some(item => item.id === product.id);
          const isLocked = (product.unlockLevel || 0) > currentModuleIndex;
          const isDisabled = isOwned || inCart || isLocked;
          const avgRating = calculateAverageRating(product.reviews);

          return (
            <div key={product.id} className={`rounded-xl shadow-sm overflow-hidden flex flex-col transition-all border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isLocked ? 'opacity-70' : ''}`}>
              <div className="aspect-video w-full relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                {isLocked && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-2">
                        <LockClosedIcon className="w-8 h-8 text-white"/>
                        <p className="font-semibold mt-1">Unlocks at Module {product.unlockLevel}</p>
                    </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">{product.type}</p>
                
                {product.reviews.length > 0 && (
                    <button onClick={() => onViewReviews(product)} className="flex items-center gap-1 mb-2 group">
                        <StarRating rating={avgRating} />
                        <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">({product.reviews.length})</span>
                    </button>
                )}
                
                <p className="text-gray-700 dark:text-gray-300 flex-grow mb-4 text-sm">{product.description}</p>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{product.price > 0 ? `$${product.price}` : 'Free'}</p>
                    <button 
                      onClick={() => onAddToCart(product)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-md font-semibold text-white flex items-center gap-2 transition-colors ${
                        isOwned ? 'bg-gray-400 cursor-default' :
                        inCart ? 'bg-gray-400 cursor-default' :
                        isLocked ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' :
                        'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isOwned ? <><CheckCircleIcon/> Owned</> : inCart ? 'In Cart' : isLocked ? <LockClosedIcon className="w-5 h-5"/> : <><ShoppingCartIcon /> Add</>}
                    </button>
                </div>
              </div>
            </div>
          );
        })}
         {filteredProducts.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic text-center py-12 sm:col-span-2 lg:col-span-3">No products match your search.</p>
        )}
      </div>
    </div>
  );
};

export default Store;