import React, { useState } from 'react';
import { products } from '../data/products';
import type { Product } from '../types';
import { ShoppingCartIcon, CheckCircleIcon, VideoCameraIcon, MusicNoteIcon, EbookIcon, HealthIcon, PodcastIcon, LockClosedIcon } from './icons';

interface StoreProps {
  onAddToCart: (product: Product) => void;
  ownedLibrary: Product[];
  cart: Product[];
  currentModuleIndex: number;
}

type Filter = 'all' | Product['type'];

const Store: React.FC<StoreProps> = ({ onAddToCart, ownedLibrary, cart, currentModuleIndex }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filteredProducts = products.filter(product => {
    if (activeFilter === 'all') return true;
    return product.type === activeFilter;
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
          return `${base} bg-emerald-600 text-white`;
      }
      return `${base} bg-stone-200 text-stone-600 hover:bg-stone-300`;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="font-title text-4xl md:text-5xl text-emerald-700">Wellness Store</h1>
        <p className="text-stone-500 mt-2">Enhance your journey with our curated collection of resources.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 bg-stone-100/80 rounded-lg">
        {filters.map(({label, filter, icon}) => (
          <button key={filter} className={getFilterClass(filter)} onClick={() => setActiveFilter(filter)}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProducts.map(product => {
          const isOwned = ownedLibrary.some(item => item.id === product.id);
          const inCart = cart.some(item => item.id === product.id);
          const isLocked = (product.unlockLevel || 0) > currentModuleIndex;
          const isDisabled = isOwned || inCart || isLocked;

          return (
            <div key={product.id} className={`bg-stone-100/50 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all ${isLocked ? 'opacity-70' : ''}`}>
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
                <h3 className="text-xl font-bold font-title text-stone-800">{product.name}</h3>
                <p className="text-sm text-stone-500 capitalize mb-2">{product.type}</p>
                <p className="text-stone-600 flex-grow mb-4">{product.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                    <p className="text-2xl font-semibold text-emerald-600">${product.price}</p>
                    <button 
                      onClick={() => onAddToCart(product)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-md font-semibold text-white flex items-center gap-2 transition-colors ${
                        isOwned ? 'bg-sky-500 cursor-default' :
                        inCart ? 'bg-amber-500 cursor-default' :
                        isLocked ? 'bg-stone-400 cursor-not-allowed' :
                        'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {isOwned ? <><CheckCircleIcon/> Owned</> : inCart ? 'In Cart' : isLocked ? <LockClosedIcon className="w-5 h-5"/> : <><ShoppingCartIcon /> Add to Cart</>}
                    </button>
                </div>
              </div>
            </div>
          );
        })}
         {filteredProducts.length === 0 && (
            <p className="text-stone-500 italic text-center py-12 sm:col-span-2 lg:col-span-3">No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Store;