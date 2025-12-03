'use client';

import { useState, type FormEvent } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Search, AtSign } from 'lucide-react';

interface InstagramSearchProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
}

export function InstagramSearch({ onSearch, isLoading }: InstagramSearchProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername) return;
    onSearch(cleanUsername);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram Profile</CardTitle>
        <CardDescription>
          Search public profiles (no login required)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="pl-11"
            />
          </div>
          <Button type="submit" isLoading={isLoading} size="lg">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
