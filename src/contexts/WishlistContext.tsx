'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  category: string;
  brand?: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

interface WishlistContextType extends WishlistState {
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  moveToCart: (id: string, cartAddItem: (item: any) => void) => void;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Omit<WishlistItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return state; // Don't add duplicate
      }
      
      const newItem = {
        ...action.payload,
        addedAt: new Date().toISOString(),
      };
      
      return {
        items: [...state.items, newItem],
        totalItems: state.totalItems + 1,
      };
    }
    
    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - 1,
      };
    }
    
    case 'CLEAR_WISHLIST':
      return {
        items: [],
        totalItems: 0,
      };
    
    case 'LOAD_WISHLIST': {
      return {
        items: action.payload,
        totalItems: action.payload.length,
      };
    }
    
    default:
      return state;
  }
};

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (id: string): boolean => {
    return state.items.some(item => item.id === id);
  };

  const moveToCart = (id: string, cartAddItem: (item: any) => void) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      // Remove from wishlist
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      
      // Add to cart
      cartAddItem({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        originalPrice: item.originalPrice,
        images: item.images,
        stock: item.stock,
        category: item.category,
        brand: item.brand,
      });
    }
  };

  const value: WishlistContextType = {
    ...state,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    moveToCart,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
