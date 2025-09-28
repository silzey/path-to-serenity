import React from 'react';
import type { Product } from '../types';
import { TrashIcon } from './icons';

interface ShoppingCartProps {
  cart: Product[];
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div className="text-center">
        <h1 className="font-title text-4xl md:text-5xl text-emerald-700">Your Cart</h1>
      </div>

      <div className="bg-stone-100/50 rounded-lg shadow-lg p-4 sm:p-6">
        {cart.length === 0 ? (
          <p className="text-stone-500 italic text-center py-8">Your shopping cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b border-stone-200 pb-4">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-stone-800">{item.name}</h3>
                  <p className="text-sm text-stone-500 capitalize">{item.type}</p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <p className="font-semibold text-lg text-emerald-600 w-16 text-right">${item.price.toFixed(2)}</p>
                    <button onClick={() => onRemove(item.id)} className="p-2 rounded-full text-stone-500 hover:bg-red-100 hover:text-red-600 transition-colors" aria-label={`Remove ${item.name}`}>
                        <TrashIcon />
                    </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end items-center pt-4 gap-6">
                <p className="text-xl font-bold">Total: <span className="text-emerald-700">${total.toFixed(2)}</span></p>
                <button 
                    onClick={onCheckout}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
                >
                    Checkout
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
