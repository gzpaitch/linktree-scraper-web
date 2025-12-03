'use client';

import { useState } from 'react';
import { SerperSearchForm, SerperPlacesResults, SerperSearchResults } from '@/components/features';
import { serperSearch } from '@/lib/api';
import { Badge } from '@/components/ui';
import type { SerperSearchMode, SerperSearchParams, SerperPlacesResponse, SerperSearchResponse } from '@/types';

type SearchResult = {
  mode: SerperSearchMode;
  data: SerperPlacesResponse | SerperSearchResponse;
};

export default function SerperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

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

  const isPlacesResult = (r: SearchResult): r is { mode: 'places'; data: SerperPlacesResponse } => {
    return r.mode === 'places';
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SerperSearchForm onSubmit={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Query: &quot;{result.data.searchParameters.q}&quot;</span>
            {result.data.searchParameters.location && (
              <Badge variant="secondary">{result.data.searchParameters.location}</Badge>
            )}
            <span className="ml-auto">Credits used: {result.data.credits}</span>
          </div>

          {isPlacesResult(result) ? (
            <SerperPlacesResults places={result.data.places} />
          ) : (
            <SerperSearchResults results={(result.data as SerperSearchResponse).organic} />
          )}
        </div>
      )}
    </div>
  );
}
