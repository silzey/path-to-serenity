"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Product } from "../types";
import { CloseIcon, PlayIcon, PauseIcon } from "./icons";
import { FaVolumeDown, FaVolumeUp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import Loader from "./Loader";

pdfjs.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@^4.5.136/build/pdf.worker.min.js`;

interface MediaPlayerProps {
  product: Product;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const MediaPlayer: React.FC<MediaPlayerProps> = ({ product, onClose }) => {
  const mediaRef = useRef<HTMLAudioElement & HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);

  // Ebook state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize observer for PDF
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Media event listeners
  useEffect(() => {
    if (!mediaRef.current) return;

    const media = mediaRef.current;

    const onLoadedMetadata = () => setDuration(media.duration || 0);
    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(media.currentTime || 0);
    };
    const onEnded = () => setIsPlaying(false);

    media.addEventListener("loadedmetadata", onLoadedMetadata);
    media.addEventListener("timeupdate", onTimeUpdate);
    media.addEventListener("ended", onEnded);

    return () => {
      media.removeEventListener("loadedmetadata", onLoadedMetadata);
      media.removeEventListener("timeupdate", onTimeUpdate);
      media.removeEventListener("ended", onEnded);
    };
  }, [product.type, isDragging]);

  // Play/Pause effect
  useEffect(() => {
    if (!mediaRef.current) return;
    const media = mediaRef.current;
    if (isPlaying) media.play().catch(() => setIsPlaying(false));
    else media.pause();
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (mediaRef.current) mediaRef.current.volume = volume;
  }, [volume]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
  };

  const handleProgressMouseDown = () => setIsDragging(true);
  const handleProgressMouseUp = () => {
    if (mediaRef.current) mediaRef.current.currentTime = currentTime;
    setIsDragging(false);
  };

  const goToPrevPage = () => setPageNumber(p => Math.max(1, p - 1));
  const goToNextPage = () => setPageNumber(p => Math.min(numPages || p, p + 1));

  const renderContent = () => {
    switch (product.type) {
      case "video":
      case "health":
        return (
          <div className="w-full bg-black rounded-b-lg overflow-hidden aspect-video relative">
            <video
              ref={mediaRef}
              src={product.assetUrl}
              controls
              playsInline
              className="w-full h-full"
            />
          </div>
        );
      case "meditation":
      case "podcast":
        return (
          <div className="flex flex-col items-center p-4">
            <audio ref={mediaRef} src={product.assetUrl} preload="metadata" />
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg shadow-xl mb-4"
              />
            )}
            <div className="flex items-center gap-6 mt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
              </button>
              <input
                type="range"
                value={currentTime}
                max={duration || 1}
                onChange={handleProgressChange}
                onMouseDown={handleProgressMouseDown}
                onMouseUp={handleProgressMouseUp}
                onTouchStart={handleProgressMouseDown}
                onTouchEnd={handleProgressMouseUp}
                className="w-64 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <FaVolumeDown className="text-gray-600 dark:text-gray-400" />
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-48"
              />
              <FaVolumeUp className="text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        );
      case "ebook":
        return (
          <div ref={containerRef} className="w-full flex flex-col items-center justify-center p-4">
            <Document
              file={product.assetUrl}
              onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1); }}
              loading={<Loader text="Loading E-book..." />}
            >
              <Page pageNumber={pageNumber} width={containerWidth * 0.95 || undefined} />
            </Document>
            <div className="flex items-center gap-4 mt-2 text-gray-800 dark:text-gray-200">
              <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><FaArrowLeft /></button>
              <span>Page {pageNumber} of {numPages}</span>
              <button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"><FaArrowRight /></button>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-center">Unsupported media type.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="fixed inset-0 bg-black/70 animate-fade-in-backdrop" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <h3 className="truncate text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><CloseIcon /></button>
        </div>
        <div className="overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MediaPlayer;