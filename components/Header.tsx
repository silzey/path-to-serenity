import React from 'react';
import { MenuIcon, ModuleIcon, ShoppingCartIcon } from './icons';
import type { View } from '../App';

interface HeaderProps {
  onOpenNavMenu: () => void;
  onOpenModuleMenu: () => void;
  cartCount: number;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenNavMenu, onOpenModuleMenu, cartCount, onNavigate }) => {
  return (
    <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
      <div className="flex-1">
        <h1 className="font-title text-2xl sm:text-3xl text-emerald-700 cursor-pointer" onClick={() => onNavigate('journey')}>Path to Serenity</h1>
      </div>
      <nav className="flex items-center gap-2 sm:gap-4">
        {/* Module menu button visible on larger screens */}
        <button onClick={onOpenModuleMenu} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors bg-stone-200 text-stone-600 hover:bg-stone-300">
          <ModuleIcon />
          <span className="hidden md:inline">Modules</span>
        </button>
        {/* Shopping Cart */}
        <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-full transition-colors bg-stone-200 text-stone-600 hover:bg-stone-300">
          <ShoppingCartIcon />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
        {/* Main Navigation Menu */}
        <button onClick={onOpenNavMenu} className="p-2 rounded-full transition-colors bg-stone-200 text-stone-600 hover:bg-stone-300">
          <MenuIcon />
        </button>
      </nav>
    </header>
  );
};

export default Header;