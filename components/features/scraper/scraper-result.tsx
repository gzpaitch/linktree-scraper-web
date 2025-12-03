'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import type { ScrapeUserResponse, ProcessCompleteResponse, Link } from '@/types';
import { ExternalLink, Link2, ArrowUpRight } from 'lucide-react';

type ResultData = ScrapeUserResponse | ProcessCompleteResponse;

interface ScraperResultProps {
  result: ResultData;
}

function isProcessComplete(result: ResultData): result is ProcessCompleteResponse {
  return 'firebase_url' in result;
}

function LinkItem({ link }: { link: Link }) {
  if (!link.url) return null;
  
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
    >
      <Link2 className="h-4 w-4 text-zinc-400 shrink-0" />
      <span className="flex-1 truncate">{link.button_text || link.url}</span>
      <ArrowUpRight className="h-4 w-4 text-zinc-400 shrink-0" />
    </a>
  );
}

export function ScraperResult({ result }: ScraperResultProps) {
  const { success, message, data } = result;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Result</CardTitle>
            {isProcessComplete(result) && result.processing_time_seconds && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Processed in {result.processing_time_seconds}s
              </p>
            )}
          </div>
          <Badge variant={success ? 'success' : 'destructive'}>
            {success ? 'Success' : 'Failed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>

        {isProcessComplete(result) && result.final_url && (
          <a
            href={result.final_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white/50 px-5 text-sm font-semibold transition-all duration-200 hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
          >
            <ExternalLink className="h-4 w-4" />
            View Generated Page
          </a>
        )}

        {data && (
          <div className="space-y-4">
            {data.avatar_image && (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.avatar_image}
                  alt={data.username}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold">{data.username}</p>
                  {data.tier && (
                    <Badge variant="secondary" className="mt-1">
                      {data.tier}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {data.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {data.description}
              </p>
            )}

            {data.links && data.links.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Links ({data.links.length})
                </h4>
                <div className="space-y-2">
                  {data.links.map((link, idx) => (
                    <LinkItem key={idx} link={link} />
                  ))}
                </div>
              </div>
            )}

            {data.main_colors && data.main_colors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Colors</h4>
                <div className="flex gap-2">
                  {data.main_colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-700"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
