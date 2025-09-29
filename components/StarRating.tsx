"use client";

import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  interactive = false,
  onRate,
}) => {
  const handleStarClick = (index: number) => {
    if (interactive && onRate) {
      onRate(index + 1);
    }
  };

  return (
    <div className={`flex items-center ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(totalStars)].map((_, index) => {
        const fill =
          rating >= index + 1
            ? 'full'
            : rating > index && rating < index + 1
            ? 'half'
            : 'empty';
        
        return (
          <div
            key={index}
            onClick={() => handleStarClick(index)}
            onMouseEnter={interactive ? (e) => (e.currentTarget.style.transform = 'scale(1.2)') : undefined}
            onMouseLeave={interactive ? (e) => (e.currentTarget.style.transform = 'scale(1)') : undefined}
            style={{ transition: 'transform 0.1s ease-in-out' }}
            className={fill === 'full' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'}
          >
            <StarIcon fill={fill} />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;