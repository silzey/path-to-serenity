"use client";

import React from 'react';
import type { Product } from '../types';
import { CloseIcon } from './icons';
import StarRating from './StarRating';

interface ViewReviewsModalProps {
  product: Product;
  onClose: () => void;
}

const ViewReviewsModal: React.FC<ViewReviewsModalProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/70 animate-fade-in-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full max-h-[80vh] flex flex-col animate-scale-in">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="font-bold text-2xl text-gray-900 dark:text-white">Reviews for {product.name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto pr-2 -mr-2">
          {product.reviews.length > 0 ? (
            <ul className="space-y-4">
              {product.reviews.map(review => (
                <li key={review.id} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-lg">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.user}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 italic">"{review.comment}"</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 italic py-8">No reviews yet for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReviewsModal;