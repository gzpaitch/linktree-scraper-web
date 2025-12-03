import { apiClient } from './client';
import type { HealthResponse, MetricsResponse } from '@/types';

export async function getHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/health');
}

export async function getMetrics(): Promise<MetricsResponse> {
  return apiClient.get<MetricsResponse>('/metrics');
}
