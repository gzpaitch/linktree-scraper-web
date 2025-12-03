'use client';

import { useState } from 'react';
import { InstagramSearch, InstagramProfileCard, InstagramPostsGrid } from '@/components/features';
import { useApiState } from '@/hooks';
import { getInstagramProfilePublic, getInstagramPosts } from '@/lib/api';
import { AlertCircle } from 'lucide-react';

export default function InstagramPage() {
  const [username, setUsername] = useState<string | null>(null);

  const profileApi = useApiState(getInstagramProfilePublic);
  const postsApi = useApiState(getInstagramPosts);

  const isLoading = profileApi.isLoading || postsApi.isLoading;
  const error = profileApi.error || postsApi.error;

  const handleSearch = async (searchUsername: string) => {
    setUsername(searchUsername);
    profileApi.reset();
    postsApi.reset();

    const profile = await profileApi.execute(searchUsername);
    if (profile && !profile.is_private) {
      postsApi.execute(searchUsername, 12);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <InstagramSearch onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">Error</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error.message}</p>
          </div>
        </div>
      )}

      {profileApi.data && <InstagramProfileCard profile={profileApi.data} />}

      {postsApi.data && username && (
        <InstagramPostsGrid posts={postsApi.data.posts} username={username} />
      )}
    </div>
  );
}
