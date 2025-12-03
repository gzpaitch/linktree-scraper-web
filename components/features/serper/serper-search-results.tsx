'use client';

import { useState } from 'react';
import type { SerperOrganicResult } from '@/types';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface SerperSearchResultsProps {
  results: SerperOrganicResult[];
}

function isLinktreeUrl(url: string): boolean {
  return url.includes('linktr.ee') || url.includes('linktree');
}

function getDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

function ResultCard({ result }: { result: SerperOrganicResult }) {
  const domain = getDomain(result.link);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="p-5">
        {/* Title */}
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-base mb-2">
          {result.title}
        </h3>

        {/* Snippet */}
        <p className="text-sm text-zinc-500 leading-relaxed mb-4">
          {result.snippet}
        </p>

        {/* Link */}
        <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <a
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 hover:underline text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-zinc-400" />
            <span className="truncate">{domain}</span>
          </a>
          <button
            onClick={() => copyToClipboard(result.link)}
            className="shrink-0 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SerperSearchResults({ results }: SerperSearchResultsProps) {
  const linktreeResults = results.filter(r => isLinktreeUrl(r.link));
  const otherResults = results.filter(r => !isLinktreeUrl(r.link));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
          Web Results
        </h2>
        <span className="text-sm text-zinc-500">
          {results.length} results {linktreeResults.length > 0 && `· ${linktreeResults.length} Linktree`}
        </span>
      </div>

      {linktreeResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Linktree
          </h3>
          <div className="grid gap-4">
            {linktreeResults.map((result, idx) => (
              <ResultCard key={`${result.link}-${idx}`} result={result} />
            ))}
          </div>
        </div>
      )}

      {otherResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Other Results
          </h3>
          <div className="grid gap-4 opacity-40">
            {otherResults.map((result, idx) => (
              <ResultCard key={`${result.link}-${idx}`} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
