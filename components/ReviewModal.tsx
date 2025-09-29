"use client";

import React, { useState } from 'react';
import type { Product } from '../types';
import { CloseIcon } from './icons';
import StarRating from './StarRating';

interface ReviewModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (productId: number, rating: number, comment: string) => void;
  userName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ product, onClose, onSubmit, userName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(product.id, rating, comment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/70 animate-fade-in-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-lg w-full animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-2xl text-gray-900 dark:text-white">Review {product.name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
              <StarRating rating={rating} onRate={setRating} interactive />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Review (optional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                placeholder={`What did you think of ${product.name}?`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={rating === 0}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;