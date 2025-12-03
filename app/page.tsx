'use client';

import { useState } from 'react';
import { ScraperForm, ScraperResult } from '@/components/features';
import { useApiState } from '@/hooks';
import { scrapeUser, processUserComplete } from '@/lib/api';
import type { ScrapeUserRequest, ScrapeUserResponse, ProcessCompleteResponse } from '@/types';
import { AlertCircle } from 'lucide-react';

type Mode = 'scrape' | 'process';

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('process');
  const [result, setResult] = useState<ScrapeUserResponse | ProcessCompleteResponse | null>(null);

  const scrapeApi = useApiState(scrapeUser, {
    onSuccess: (data) => setResult(data),
  });

  const processApi = useApiState(processUserComplete, {
    onSuccess: (data) => setResult(data),
  });

  const isLoading = scrapeApi.isLoading || processApi.isLoading;
  const error = scrapeApi.error || processApi.error;

  const handleSubmit = (data: ScrapeUserRequest) => {
    setResult(null);
    if (mode === 'scrape') {
      scrapeApi.execute(data);
    } else {
      processApi.execute(data);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Scraper
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-1">
          Scrape and process Linktree profiles
        </p>
      </div>

      <ScraperForm
        mode={mode}
        onModeChange={setMode}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">Error</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error.message}</p>
          </div>
        </div>
      )}

      {result && <ScraperResult result={result} />}
    </div>
  );
}
