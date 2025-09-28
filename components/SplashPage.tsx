import React from 'react';

interface SplashPageProps {
  onStart: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ onStart }) => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <h1 className="font-title text-6xl lg:text-8xl mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
          Path to Serenity
        </h1>
        <p className="text-stone-200 text-lg lg:text-xl mb-8 max-w-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
          Embark on a dynamic text adventure to find balance, health, and enlightenment. Your journey to becoming a yoga master starts now.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg text-xl font-semibold"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
};

export default SplashPage;
