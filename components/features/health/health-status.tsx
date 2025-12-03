'use client';

import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { useApiState } from '@/hooks';
import { getHealth, getMetrics } from '@/lib/api';
import { Activity, Server, Clock, HardDrive, Wifi, WifiOff } from 'lucide-react';

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function HealthStatus() {
  const health = useApiState(getHealth);
  const metrics = useApiState(getMetrics);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      health.execute();
      metrics.execute();
    }
  }, [health, metrics]);

  const isHealthy = health.data?.status === 'healthy';
  const isOffline = health.error;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              health.isLoading 
                ? 'bg-zinc-100 dark:bg-zinc-800' 
                : isOffline 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              {isOffline 
                ? <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
                : <Wifi className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              }
            </div>
            <div>
              <CardTitle className="text-base">API Status</CardTitle>
              {health.data && (
                <p className="text-xs text-zinc-500 mt-0.5">v{health.data.version}</p>
              )}
            </div>
          </div>
          {health.isLoading ? (
            <Badge variant="secondary">Checking...</Badge>
          ) : isOffline ? (
            <Badge variant="destructive">Offline</Badge>
          ) : (
            <Badge variant={isHealthy ? 'success' : 'destructive'}>
              {isHealthy ? 'Online' : 'Unhealthy'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {metrics.data && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Activity className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{metrics.data.total_scrapes}</p>
                <p className="text-xs text-zinc-500">Scrapes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{metrics.data.active_connections}</p>
                <p className="text-xs text-zinc-500">Connections</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatUptime(metrics.data.uptime_seconds)}</p>
                <p className="text-xs text-zinc-500">Uptime</p>
              </div>
            </div>
            {metrics.data.memory_usage_mb && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <HardDrive className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-bold">{metrics.data.memory_usage_mb.toFixed(0)}</p>
                  <p className="text-xs text-zinc-500">MB Memory</p>
                </div>
              </div>
            )}
          </div>
        )}

        {health.error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Failed to connect to API
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
