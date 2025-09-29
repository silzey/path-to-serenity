"use client";

import React, { useState, useRef, useEffect } from 'react';
import Loader from './Loader';

interface GameScreenProps {
  story: string;
  image: string;
  isStoryLoading: boolean;
  isImageLoading: boolean;
  isGameOver: boolean;
  onActionSubmit: (action: string) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  story,
  image,
  isStoryLoading,
  isImageLoading,
  isGameOver,
  onActionSubmit,
}) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isStoryLoading && !isGameOver) {
      inputRef.current?.focus();
    }
  }, [isStoryLoading, isGameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isStoryLoading) {
      onActionSubmit(userInput.trim());
      setUserInput('');
    }
  };

  return (
    <div className="flex-grow flex flex-col rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="aspect-[3/4] w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader text="Visualizing tranquility..." />
          </div>
        )}
        {image ? (
          <img src={image} alt="Current scene" className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">The world is yet to be revealed...</div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col overflow-y-auto">
        <div className="prose prose-stone dark:prose-invert max-w-none flex-grow text-gray-700 dark:text-gray-300">
          {isStoryLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader text="The guru is meditating..." />
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{story}</p>
          )}
        </div>

        {isGameOver && !isStoryLoading && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/20 rounded-lg text-center">
            <h3 className="font-bold text-2xl text-gray-800 dark:text-white">You Have Found Your Path</h3>
            <p className="text-blue-600 dark:text-blue-400 mt-2">Your journey continues beyond this story. Refresh to begin anew.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-500 text-lg">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isStoryLoading ? "Wait for the next scene..." : "What do you do?"}
              disabled={isStoryLoading || isGameOver}
              className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isStoryLoading || isGameOver}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameScreen;