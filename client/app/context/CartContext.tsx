"use client";

import React, { createContext, useContext, useOptimistic, useTransition, useState } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: string;
  flavor?: string;
  size?: string;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
};

type CartContextType = {
  items: CartItem[];
  optimisticItems: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  isPending: boolean;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; id: number }
  | { type: 'update'; id: number; quantity: number };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const existingItemIndex = state.findIndex(item => item.id === action.item.id);
      if (existingItemIndex > -1) {
        const newState = [...state];
        newState[existingItemIndex] = {
          ...newState[existingItemIndex],
          quantity: newState[existingItemIndex].quantity + action.item.quantity,
        };
        return newState;
      }
      return [...state, action.item];
    }
    case 'remove':
      return state.filter(item => item.id !== action.id);
    case 'update': {
      const itemIndex = state.findIndex(item => item.id === action.id);
      if (itemIndex > -1) {
        const newState = [...state];
        newState[itemIndex] = {
          ...newState[itemIndex],
          quantity: action.quantity,
        };
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [optimisticItems, setOptimisticItems] = useOptimistic(items, cartReducer);
  const [isPending, startTransition] = useTransition();

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    startTransition(() => {
      setOptimisticItems({ type: 'add', item: { ...item, quantity: 1 } });

      // Simulate async DB call - in the future this will be a real API call
      setTimeout(() => {
        setItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
          if (existingItemIndex > -1) {
            const newItems = [...prevItems];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + 1,
            };
            return newItems;
          }
          return [...prevItems, { ...item, quantity: 1 }];
        });
      }, 100);
    });
  };

  const removeItem = (id: number) => {
    startTransition(() => {
      setOptimisticItems({ type: 'remove', id });

      // Simulate async DB call
      setTimeout(() => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      }, 100);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    startTransition(() => {
      setOptimisticItems({ type: 'update', id, quantity });

      // Simulate async DB call
      setTimeout(() => {
        setItems(prevItems => {
          const itemIndex = prevItems.findIndex(item => item.id === id);
          if (itemIndex > -1) {
            const newItems = [...prevItems];
            newItems[itemIndex] = {
              ...newItems[itemIndex],
              quantity,
            };
            return newItems;
          }
          return prevItems;
        });
      }, 100);
    });
  };

  const totalItems = optimisticItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = optimisticItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        optimisticItems,
        addItem,
        removeItem,
        updateQuantity,
        isPending,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
