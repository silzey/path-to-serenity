import React from 'react';
import type { View } from '../App';
import { JourneyLogIcon, BookOpenIcon, ShoppingBagIcon, LockClosedIcon, CloseIcon } from './icons';
import { FaTachometerAlt } from 'react-icons/fa';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
  unlockLevel: number;
}

const NavigationMenu: React.FC<NavMenuProps> = ({ isOpen, onClose, onNavigate, currentView, unlockLevel }) => {
  if (!isOpen) return null;

  const NavItem: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => {
    const isActive = currentView === view;
    
    const content = (
      <button 
        onClick={() => onNavigate(view)} 
        className={`flex items-center gap-4 p-3 rounded-lg transition-colors w-full text-left ${
        isActive ? 'bg-emerald-100/80 text-emerald-700' : 'hover:bg-stone-200 text-stone-600'
      }`}>
        <div className={'text-emerald-600'}>{icon}</div>
        <span className="font-semibold text-lg">{label}</span>
      </button>
    );

    return content;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/60 animate-fade-in-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-xs bg-amber-50 shadow-xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="font-title text-3xl text-emerald-700">Menu</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-stone-200"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-3">
          <NavItem view="journey" label="Journey" icon={<JourneyLogIcon />} />
          <NavItem view="dashboard" label="Dashboard" icon={<FaTachometerAlt className="h-6 w-6" />} />
          <NavItem 
            view="library" 
            label="Library" 
            icon={<BookOpenIcon />} 
          />
          <NavItem 
            view="store" 
            label="Store" 
            icon={<ShoppingBagIcon />}
          />
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenu;