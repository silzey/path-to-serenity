"use client";

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
        <h1 className="font-extrabold text-4xl md:text-5xl text-gray-900 dark:text-white">Your Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Track your progress on the path to enlightenment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <button onClick={() => onNavigate('library')} className="rounded-xl p-6 shadow-sm text-left hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="font-bold text-2xl flex items-center gap-3 text-gray-900 dark:text-white"><BookOpenIcon /> My Library</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Access your collected meditations, videos, and e-books.</p>
        </button>
         <button onClick={() => onNavigate('store')} className="rounded-xl p-6 shadow-sm text-left hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="font-bold text-2xl flex items-center gap-3 text-gray-900 dark:text-white"><ShoppingBagIcon /> Wellness Store</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Browse new resources to aid your journey.</p>
        </button>
      </div>

      <section className="rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="font-bold text-2xl border-b border-gray-300 dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Training Progress</h2>
        <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 font-medium">You have completed <span className="font-bold text-blue-600 dark:text-blue-400">{completedModulesCount}</span> out of {YOGA_MODULES.length} modules.</p>
             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold text-right">{progressPercentage.toFixed(0)}% Complete</p>
        </div>
      </section>

      <section className="rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="font-bold text-2xl border-b border-gray-300 dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Earned Badges</h2>
        {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {badges.map((badge, index) => (
                    <div 
                        key={badge} 
                        className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3 text-center flex flex-col items-center justify-center gap-2 animate-sparkle-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                       <BadgeIcon />
                       <p className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{badge}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">You have not earned any badges yet. Continue your journey!</p>
        )}
      </section>

    </div>
  );
};

export default Dashboard;