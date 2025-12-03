'use client';

import { useState, useEffect } from 'react';
import { SerperSearchForm, SerperPlacesResults, SerperSearchResults } from '@/components/features';
import { serperSearch } from '@/lib/api';
import type { SerperSearchMode, SerperSearchParams, SerperPlacesResponse, SerperSearchResponse } from '@/types';

type SearchResult = {
  mode: SerperSearchMode;
  data: SerperPlacesResponse | SerperSearchResponse;
};

const STORAGE_KEY = 'serper-search-results';

export default function SerperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  // Load results from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Save results to sessionStorage when they change
  useEffect(() => {
    if (result) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    }
  }, [result]);

  const handleSearch = async (mode: SerperSearchMode, params: SerperSearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await serperSearch(mode, params);
      setResult({ mode, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const isPlacesResult = (r: SearchResult): r is { mode: 'places'; data: SerperPlacesResponse } => {
    return r.mode === 'places';
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Serper
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-1">
          Search the web and find places
        </p>
      </div>

      <SerperSearchForm onSubmit={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <>
          {isPlacesResult(result) ? (
            <SerperPlacesResults 
              places={result.data.places} 
              query={result.data.searchParameters.q}
              location={result.data.searchParameters.location}
              onClear={clearResults}
            />
          ) : (
            <SerperSearchResults 
              results={(result.data as SerperSearchResponse).organic}
              query={result.data.searchParameters.q}
              onClear={clearResults}
            />
          )}
        </>
      )}
    </div>
  );
}
