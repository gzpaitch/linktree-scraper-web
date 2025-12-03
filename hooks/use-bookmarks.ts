'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SerperPlace } from '@/types';

const STORAGE_KEY = 'bookmarked-places';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<SerperPlace[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever bookmarks change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = useCallback((place: SerperPlace) => {
    setBookmarks(prev => {
      if (prev.some(p => p.cid === place.cid)) return prev;
      return [...prev, place];
    });
  }, []);

  const removeBookmark = useCallback((cid: string) => {
    setBookmarks(prev => prev.filter(p => p.cid !== cid));
  }, []);

  const toggleBookmark = useCallback((place: SerperPlace) => {
    setBookmarks(prev => {
      const exists = prev.some(p => p.cid === place.cid);
      if (exists) {
        return prev.filter(p => p.cid !== place.cid);
      }
      return [...prev, place];
    });
  }, []);

  const isBookmarked = useCallback((cid: string) => {
    return bookmarks.some(p => p.cid === cid);
  }, [bookmarks]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isLoaded,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
}
