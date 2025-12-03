import { apiClient } from './client';
import type { 
  Credentials, 
  IgProfileInfo, 
  IgPostsResponse 
} from '@/types';

export async function setInstagramCredentials(
  credentials: Credentials
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }, Credentials>(
    '/instagram/set-credentials',
    credentials
  );
}

export async function getInstagramProfile(
  username: string
): Promise<IgProfileInfo> {
  return apiClient.get<IgProfileInfo>(`/instagram/profile/${username}`);
}

export async function getInstagramProfilePublic(
  username: string
): Promise<IgProfileInfo> {
  return apiClient.get<IgProfileInfo>(`/instagram-instaloader/profile/${username}`);
}

export async function getInstagramPosts(
  username: string,
  limit: number = 12
): Promise<IgPostsResponse> {
  return apiClient.get<IgPostsResponse>(
    `/instagram-instaloader/profile/${username}/posts?limit=${limit}`
  );
}
