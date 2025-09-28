import React from 'react';
import { YOGA_MODULES } from '../services/geminiService';
import { BadgeIcon, BookOpenIcon, ShoppingBagIcon } from './icons';
import type { View } from '../App';

interface DashboardProps {
  completedModulesCount: number;
  badges: string[];
  onNavigate: (view: View) => void;
}


const Dashboard: React.FC<DashboardProps> = ({ completedModulesCount, badges, onNavigate }) => {
    const progressPercentage = (completedModulesCount / YOGA_MODULES.length) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="font-title text-4xl md:text-5xl text-emerald-700">Your Dashboard</h1>
        <p className="text-stone-500 mt-2">Track your progress on the path to enlightenment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <button onClick={() => onNavigate('library')} className="bg-stone-100/50 rounded-lg p-6 shadow-lg text-left hover:shadow-xl hover:bg-stone-100 transition-all">
          <h2 className="font-title text-3xl flex items-center gap-3"><BookOpenIcon /> My Library</h2>
          <p className="text-stone-500 mt-2">Access your collected meditations, videos, and e-books.</p>
        </button>
         <button onClick={() => onNavigate('store')} className="bg-stone-100/50 rounded-lg p-6 shadow-lg text-left hover:shadow-xl hover:bg-stone-100 transition-all">
          <h2 className="font-title text-3xl flex items-center gap-3"><ShoppingBagIcon /> Wellness Store</h2>
          <p className="text-stone-500 mt-2">Browse new resources to aid your journey.</p>
        </button>
      </div>

      <section className="bg-stone-100/50 rounded-lg p-6 shadow-lg">
        <h2 className="font-title text-3xl border-b border-stone-300 pb-3 mb-4">Training Progress</h2>
        <div className="space-y-3">
            <p className="text-stone-600 font-medium">You have completed <span className="font-bold text-sky-600">{completedModulesCount}</span> out of {YOGA_MODULES.length} modules.</p>
             <div className="w-full bg-stone-300 rounded-full h-4">
                <div className="bg-sky-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-stone-500 font-semibold text-right">{progressPercentage.toFixed(0)}% Complete</p>
        </div>
      </section>

      <section className="bg-stone-100/50 rounded-lg p-6 shadow-lg">
        <h2 className="font-title text-3xl border-b border-stone-300 pb-3 mb-4">Earned Badges</h2>
        {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {badges.map((badge, index) => (
                    <div 
                        key={badge} 
                        className="bg-amber-100/50 border border-amber-300 rounded-lg p-3 text-center flex flex-col items-center justify-center gap-2 animate-sparkle-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                       <BadgeIcon />
                       <p className="text-amber-700 font-semibold text-sm">{badge}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-stone-500 italic text-center py-4">You have not earned any badges yet. Continue your journey!</p>
        )}
      </section>

    </div>
  );
};

export default Dashboard;