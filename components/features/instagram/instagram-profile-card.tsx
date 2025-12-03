'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import type { IgProfileInfo } from '@/types';
import { ExternalLink, BadgeCheck, Lock, User } from 'lucide-react';

interface InstagramProfileCardProps {
  profile: IgProfileInfo;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function InstagramProfileCard({ profile }: InstagramProfileCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile.avatar_url && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="h-16 w-16 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <User className="h-8 w-8 text-zinc-400" />
              </div>
            )}
            {profile.is_verified && (
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100">
                <BadgeCheck className="h-3 w-3 text-white dark:text-zinc-900" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{profile.name || profile.username}</h3>
            <p className="text-sm text-zinc-500">@{profile.username}</p>
            {profile.is_private && (
              <Badge variant="secondary" className="mt-1">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold">{formatCount(profile.posts_count)}</p>
            <p className="text-xs text-zinc-500">Posts</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{formatCount(profile.followers_count)}</p>
            <p className="text-xs text-zinc-500">Followers</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{formatCount(profile.following_count)}</p>
            <p className="text-xs text-zinc-500">Following</p>
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
            {profile.bio}
          </p>
        )}

        {profile.external_url && (
          <a
            href={profile.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-4 w-4" />
            {profile.external_url}
          </a>
        )}
      </CardContent>
    </Card>
  );
}
