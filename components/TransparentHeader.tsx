"use client";

import React from 'react';
import type { View } from '../App';
import { JourneyIconNav, DashboardIconNav, LibraryIconNav, StoreIconNav, ProfileIconNav } from './icons';
import { ShoppingCartIcon } from './icons';

interface TransparentHeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
  cartCount: number;
}

const TransparentHeader: React.FC<TransparentHeaderProps> = ({ onNavigate, currentView, cartCount }) => {
  const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
    { view: 'journey', icon: <JourneyIconNav isActive={currentView === 'journey'} />, label: 'Journey' },
    { view: 'dashboard', icon: <DashboardIconNav isActive={currentView === 'dashboard'} />, label: 'Dashboard' },
    { view: 'library', icon: <LibraryIconNav isActive={currentView === 'library'} />, label: 'Library' },
    { view: 'store', icon: <StoreIconNav isActive={currentView === 'store'} />, label: 'Store' },
    { view: 'profile', icon: <ProfileIconNav isActive={currentView === 'profile'} />, label: 'Profile' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-2 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-lg border border-white/20 dark:border-gray-800/50">
        <div>
          <h1 className="font-extrabold text-2xl text-blue-600 dark:text-blue-500 cursor-pointer" onClick={() => onNavigate('journey')}>
            Path to Serenity
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <button key={item.view} onClick={() => onNavigate(item.view)} className="group flex flex-col items-center gap-1" aria-label={item.label}>
                {item.icon}
                <span className={`text-xs font-bold transition-all ${currentView === item.view ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}>
                    {item.label}
                </span>
            </button>
          ))}
        </nav>
        <div className="flex items-center">
             <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-full transition-colors text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50">
                <ShoppingCartIcon />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartCount}
                    </span>
                )}
            </button>
        </div>
      </div>
       {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 p-2 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border border-white/20 dark:border-gray-800/50">
          <div className="flex justify-around items-center">
             {navItems.map(item => (
                <button key={item.view} onClick={() => onNavigate(item.view)} className="group flex flex-col items-center gap-1" aria-label={item.label}>
                    {item.icon}
                </button>
            ))}
          </div>
      </nav>
    </header>
  );
};

export default TransparentHeader;