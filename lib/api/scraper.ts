import { apiClient } from './client';
import type { 
  ScrapeUserRequest, 
  ScrapeUserResponse, 
  ProcessCompleteResponse 
} from '@/types';

export async function scrapeUser(
  request: ScrapeUserRequest
): Promise<ScrapeUserResponse> {
  return apiClient.post<ScrapeUserResponse, ScrapeUserRequest>(
    '/scrape/user',
    request
  );
}

export async function processUserComplete(
  request: ScrapeUserRequest
): Promise<ProcessCompleteResponse> {
  return apiClient.post<ProcessCompleteResponse, ScrapeUserRequest>(
    '/scrape/process',
    request
  );
}
