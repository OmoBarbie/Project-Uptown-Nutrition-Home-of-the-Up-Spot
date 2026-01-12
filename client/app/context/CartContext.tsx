"use client";

import React, { createContext, useContext, useOptimistic, useTransition, useState, useEffect, useCallback } from 'react';
import { addToCart, removeFromCart, updateCartItemQuantity, getCart } from '@/app/actions/cart';
import { useCartSync } from '@/app/hooks/useCartSync';
import { useSession } from '@/lib/auth-client';

export type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageSrc: string;
};

type CartContextType = {
  items: CartItem[];
  optimisticItems: CartItem[];
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  isPending: boolean;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'add'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'update'; productId: string; quantity: number };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const existingItemIndex = state.findIndex(item => item.id === action.productId);
      if (existingItemIndex > -1) {
        const newState = [...state];
        newState[existingItemIndex] = {
          ...newState[existingItemIndex],
          quantity: newState[existingItemIndex].quantity + 1,
        };
        return newState;
      }
      // If item doesn't exist, just return state (will be updated when server responds)
      return state;
    }
    case 'remove':
      return state.filter(item => item.id !== action.productId);
    case 'update': {
      const itemIndex = state.findIndex(item => item.id === action.productId);
      if (itemIndex > -1) {
        if (action.quantity <= 0) {
          return state.filter(item => item.id !== action.productId);
        }
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

// Transform database cart items to CartItem format
function transformCartItems(dbItems: any[]): CartItem[] {
  return dbItems.map(item => ({
    id: item.productId,
    name: item.product.name,
    price: `$${parseFloat(item.product.price).toFixed(2)}`,
    quantity: item.quantity,
    imageSrc: item.product.emoji,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [optimisticItems, setOptimisticItems] = useOptimistic(items, cartReducer);
  const [isPending, startTransition] = useTransition();
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = useSession();

  // Fetch cart on mount
  const refreshCart = useCallback(async () => {
    try {
      const dbItems = await getCart();
      const transformedItems = transformCartItems(dbItems);
      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, []);

  // Get room ID for PartyKit (user ID or session ID from cookie)
  const getRoomId = useCallback(() => {
    if (session?.user?.id) {
      return session.user.id;
    }
    // For guest users, use a consistent ID from localStorage
    if (typeof window !== 'undefined') {
      let guestId = localStorage.getItem('guest_cart_id');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guest_cart_id', guestId);
      }
      return guestId;
    }
    return '';
  }, [session]);

  // Handle real-time cart sync messages
  const handleCartSyncMessage = useCallback((message: any) => {
    console.log('Cart sync message received:', message);
    // Refresh cart from database when we receive updates from other devices
    refreshCart();
  }, [refreshCart]);

  // Connect to PartyKit for real-time sync
  const { sendMessage, isConnected } = useCartSync({
    roomId: getRoomId(),
    enabled: true,
    onMessage: handleCartSyncMessage,
  });

  useEffect(() => {
    if (!isInitialized) {
      refreshCart();
      setIsInitialized(true);
    }
  }, [isInitialized, refreshCart]);

  const addItem = async (productId: string) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'add', productId });

      try {
        const result = await addToCart(productId);
        if (result.success) {
          await refreshCart();
          // Broadcast to other devices via PartyKit
          sendMessage('item_added', { productId });
        } else {
          console.error('Failed to add item:', result.error);
          // Revert optimistic update on error
          await refreshCart();
        }
      } catch (error) {
        console.error('Failed to add item:', error);
        await refreshCart();
      }
    });
  };

  const removeItem = async (productId: string) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'remove', productId });

      try {
        const result = await removeFromCart(productId);
        if (result.success) {
          await refreshCart();
          // Broadcast to other devices via PartyKit
          sendMessage('item_removed', { productId });
        } else {
          console.error('Failed to remove item:', result.error);
          await refreshCart();
        }
      } catch (error) {
        console.error('Failed to remove item:', error);
        await refreshCart();
      }
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    startTransition(async () => {
      setOptimisticItems({ type: 'update', productId, quantity });

      try {
        const result = await updateCartItemQuantity(productId, quantity);
        if (result.success) {
          await refreshCart();
          // Broadcast to other devices via PartyKit
          sendMessage('quantity_updated', { productId, quantity });
        } else {
          console.error('Failed to update quantity:', result.error);
          await refreshCart();
        }
      } catch (error) {
        console.error('Failed to update quantity:', error);
        await refreshCart();
      }
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
        refreshCart,
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
