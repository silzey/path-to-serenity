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
    <div className="flex-grow flex flex-col bg-stone-100/50 rounded-lg shadow-xl overflow-hidden">
      <div className="aspect-[3/4] w-full bg-stone-200 flex items-center justify-center relative">
        {isImageLoading && (
          <div className="absolute inset-0 bg-stone-200/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader text="Visualizing tranquility..." />
          </div>
        )}
        {image ? (
          <img src={image} alt="Current scene" className="w-full h-full object-cover" />
        ) : (
          <div className="text-stone-500">The world is yet to be revealed...</div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col overflow-y-auto">
        <div className="prose prose-stone max-w-none flex-grow text-stone-700">
          {isStoryLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader text="The guru is meditating..." />
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{story}</p>
          )}
        </div>

        {isGameOver && !isStoryLoading && (
          <div className="mt-6 p-4 bg-emerald-100/50 border border-emerald-300 rounded-lg text-center">
            <h3 className="font-title text-2xl text-emerald-700">You Have Found Your Path</h3>
            <p className="text-emerald-600 mt-2">Your journey continues beyond this story. Refresh to begin anew.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-300 bg-stone-100">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <span className="font-bold text-emerald-600 text-lg">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={isStoryLoading ? "Wait for the next scene..." : "What do you do?"}
              disabled={isStoryLoading || isGameOver}
              className="w-full bg-transparent focus:outline-none text-stone-800 placeholder-stone-500"
            />
            <button
              type="submit"
              disabled={isStoryLoading || isGameOver}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors"
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