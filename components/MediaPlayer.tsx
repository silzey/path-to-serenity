import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../types';
import { CloseIcon, PlayIcon, PauseIcon } from './icons';
import { FaVolumeDown, FaVolumeUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import Loader from './Loader';

// Configure the PDF.js worker.
pdfjs.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MediaPlayerProps {
  product: Product;
  onClose: () => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<{ product: Product }> = ({ product }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };
        const setAudioTime = () => setCurrentTime(audio.currentTime);
        const handleEnd = () => setIsPlaying(false);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnd);

        if (isPlaying) audio.play().catch(e => console.error("Audio play failed:", e));

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnd);
        };
    }, []);
    
    useEffect(() => {
        if(audioRef.current) {
            isPlaying ? audioRef.current.play().catch(e => console.error("Audio play failed:", e)) : audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if(audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if(audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-stone-200/50 flex flex-col items-center justify-center rounded-b-lg">
            <audio ref={audioRef} src={product.assetUrl} preload="metadata" autoPlay></audio>
            <img src={product.imageUrl} alt={product.name} className="w-48 h-48 object-cover rounded-lg shadow-xl mb-4"/>
            <div className="w-full max-w-xs text-center">
                <h4 className="font-bold text-lg text-stone-800 truncate">{product.name}</h4>
                <p className="text-sm text-stone-500">Guided Meditation</p>
            </div>
            
            <div className="w-full max-w-xs mt-4">
                 <input
                    type="range"
                    value={currentTime}
                    max={duration || 0}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer range-sm"
                />
                <div className="flex justify-between text-xs text-stone-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-emerald-600 hover:text-emerald-800 transition-colors">
                    {isPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                </button>
            </div>
            
             <div className="w-full max-w-xs mt-4 flex items-center gap-2">
                <FaVolumeDown className="text-stone-500" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer range-sm"
                />
                <FaVolumeUp className="text-stone-500" />
            </div>
        </div>
    );
};

const EbookReader: React.FC<{ product: Product }> = ({ product }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1);
        setIsLoading(false);
    }

    function onDocumentLoadError(error: Error): void {
        console.error("PDF Load Error:", error);
        setError("Failed to load e-book. Please try again later.");
        setIsLoading(false);
    }

    const goToPrevPage = () => setPageNumber(oldPage => Math.max(1, oldPage - 1));
    const goToNextPage = () => setPageNumber(oldPage => Math.min(numPages || oldPage, oldPage + 1));
    
    return (
        <div className="bg-stone-100 rounded-b-lg p-4" style={{ minHeight: '70vh' }}>
            <div className="flex flex-col h-full">
                <div className="flex-grow flex items-center justify-center bg-stone-200/50 rounded-md overflow-hidden">
                    {error ? (
                        <div className="text-center text-red-600 p-4">{error}</div>
                    ) : (
                        <Document
                            file={product.assetUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={<Loader text="Loading E-book..." />}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                    )}
                </div>
                {!isLoading && !error && numPages && (
                    <div className="flex-shrink-0 flex items-center justify-center gap-4 pt-4">
                        <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <FaArrowLeft />
                        </button>
                        <p className="text-stone-600 font-semibold">
                            Page {pageNumber} of {numPages}
                        </p>
                        <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const MediaPlayer: React.FC<MediaPlayerProps> = ({ product, onClose }) => {
  const renderMedia = () => {
    switch (product.type) {
      case 'video':
      case 'health':
        return (
          <video controls autoPlay className="w-full h-full rounded-b-lg bg-black aspect-video">
            <source src={product.assetUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'meditation':
      case 'podcast':
        return <AudioPlayer product={product} />;
      case 'ebook':
        return <EbookReader product={product} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/70 animate-fade-in-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-amber-50 rounded-lg shadow-xl w-full max-w-2xl animate-scale-in m-4 flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-stone-300 flex-shrink-0">
             <h3 className="font-title text-2xl text-emerald-700 truncate pr-4">{product.name}</h3>
             <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-200 transition-colors"
                aria-label="Close media player"
            >
                <CloseIcon />
            </button>
        </div>
        <div className="overflow-y-auto">
            {renderMedia()}
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;