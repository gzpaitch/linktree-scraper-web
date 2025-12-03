import type { 
  SerperSearchParams, 
  SerperPlacesResponse, 
  SerperSearchResponse,
  SerperSearchMode 
} from '@/types';

const SERPER_API_KEY = process.env.NEXT_PUBLIC_SERPER_API_KEY;
const SERPER_BASE_URL = 'https://google.serper.dev';

async function serperRequest<T>(endpoint: string, params: SerperSearchParams): Promise<T> {
  if (!SERPER_API_KEY) {
    throw new Error('Serper API key is not configured');
  }

  const response = await fetch(`${SERPER_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status}`);
  }

  return response.json();
}

export async function searchPlaces(params: SerperSearchParams): Promise<SerperPlacesResponse> {
  return serperRequest<SerperPlacesResponse>('/places', params);
}

export async function searchWeb(params: SerperSearchParams): Promise<SerperSearchResponse> {
  return serperRequest<SerperSearchResponse>('/search', params);
}

export async function serperSearch(
  mode: SerperSearchMode, 
  params: SerperSearchParams
): Promise<SerperPlacesResponse | SerperSearchResponse> {
  if (mode === 'places') {
    return searchPlaces(params);
  }
  return searchWeb(params);
}
