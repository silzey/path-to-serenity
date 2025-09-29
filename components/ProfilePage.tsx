"use client";

import React, { useRef, useState } from 'react';
import type { UserProfile } from '../types';
import { SettingsIcon, CameraIcon, ToastCheckIcon } from './icons';
import Loader from './Loader';

interface ProfilePageProps {
  profile: UserProfile;
  onAvatarChange: (file: File) => void;
  onAddToGallery: (file: File) => void;
  onEditProfile: () => void;
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  stats: {
    modules: number;
    badges: number;
    libraryItems: number;
  }
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onAvatarChange, onAddToGallery, onEditProfile, theme, onSetTheme, stats }) => {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<null | 'avatar' | 'gallery'>(null);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, handler: (file: File) => void, type: 'avatar' | 'gallery') => {
        const file = event.target.files?.[0];
        if (file) {
            setIsLoading(type);
            try {
                await handler(file);
                showToast(type === 'avatar' ? 'Avatar updated successfully!' : 'Photo added to gallery!');
            } catch (error) {
                showToast('Upload failed. Please try again.');
            } finally {
                setIsLoading(null);
            }
        }
    };
    
    const StatItem: React.FC<{ value: number, label: string }> = ({ value, label }) => (
        <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* --- Toast Notification --- */}
            {toastMessage && (
                 <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in flex items-center gap-2">
                    <ToastCheckIcon />
                    <span>{toastMessage}</span>
                 </div>
            )}

            {/* --- Profile Header --- */}
            <header className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-4">
                <div className="relative group">
                    <img src={profile.avatar} alt="User Avatar" className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg border-4 border-white dark:border-gray-800"/>
                    <button 
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Change avatar"
                    >
                        {isLoading === 'avatar' ? <Loader size="sm" /> : <CameraIcon />}
                       <span className="text-white ml-2">Change</span>
                    </button>
                    <input 
                        type="file"
                        ref={avatarInputRef}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, onAvatarChange, 'avatar')}
                    />
                </div>
                <div className="text-center sm:text-left flex-grow">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{profile.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Your journey, your space.</p>
                    <div className="mt-6 flex items-center justify-center sm:justify-start gap-4">
                         <button onClick={onEditProfile} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Edit Profile</button>
                    </div>
                </div>
            </header>
            
            {/* --- Stats Section --- */}
            <section className="rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex justify-around">
                    <StatItem value={stats.modules} label="Modules Completed" />
                    <StatItem value={stats.badges} label="Badges Earned" />
                    <StatItem value={stats.libraryItems} label="Library Items" />
                </div>
            </section>

            {/* --- Settings Section --- */}
            <section className="rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <h2 className="font-bold text-2xl border-b border-gray-300 dark:border-gray-700 pb-3 mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><SettingsIcon/> Settings</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="darkmode" className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="darkmode" id="darkmode" checked={theme === 'dark'} onChange={() => onSetTheme(theme === 'light' ? 'dark' : 'light')} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="darkmode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="notifications" className="font-medium text-gray-700 dark:text-gray-300">Push Notifications <span className="text-xs text-gray-400">(coming soon)</span></label>
                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in opacity-50">
                            <input type="checkbox" name="notifications" id="notifications" disabled className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-not-allowed"/>
                            <label htmlFor="notifications" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-not-allowed"></label>
                        </div>
                    </div>
                </div>
                 <style>{`
                    .toggle-checkbox:checked { right: 0; border-color: #2563EB; }
                    .toggle-checkbox:checked + .toggle-label { background-color: #2563EB; }
                    .dark .toggle-label { background-color: #374151; }
                `}</style>
            </section>

            {/* --- Gallery Section --- */}
            <section>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="font-bold text-2xl text-gray-900 dark:text-white">My Wellness Gallery</h2>
                     <button 
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-800"
                        disabled={!!isLoading}
                     >
                        {isLoading === 'gallery' ? <Loader size="sm" /> : <CameraIcon />}
                        Add Photo
                    </button>
                     <input 
                        type="file"
                        ref={galleryInputRef}
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, onAddToGallery, 'gallery')}
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    {profile.gallery.map((imgSrc, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md">
                            <img src={imgSrc} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover"/>
                        </div>
                    ))}
                     {profile.gallery.length === 0 && (
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 italic py-12">Your gallery is empty. Add photos to document your journey!</p>
                     )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;