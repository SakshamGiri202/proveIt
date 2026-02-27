'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { getChallenges } from '@/lib/appwrite/api';
import { Challenge } from '@/lib/types';
import { Flame, Plus, Search } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState<'all' | 'week' | 'month'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'planned' | 'inProgress' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const response = await getChallenges(50, 0, {
          status: statusFilter === 'all' ? undefined : statusFilter,
          duration: durationFilter === 'all' ? undefined : durationFilter,
        });
        setChallenges(response.rows || []);
      } catch (error) {
        console.error('Error loading challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [durationFilter, statusFilter]);

  useEffect(() => {
    const filtered = challenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredChallenges(filtered);
  }, [challenges, searchQuery]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Challenges</h1>
              <p className="text-muted-foreground text-lg">
                Discover and join challenges from the community
              </p>
            </div>
            <Link href="/challenges/create">
              <Button className="gap-2">
                <Plus className="w-5 h-5" />
                Create Challenge
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Duration
              </label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              >
                <option value="all">All Durations</option>
                <option value="week">1 Week</option>
                <option value="month">1 Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Flame className="w-12 h-12 text-primary mx-auto animate-pulse mb-4" />
            <p className="text-muted-foreground">Loading challenges...</p>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or create a new challenge
              </p>
              <Link href="/challenges/create">
                <Button>Create Challenge</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.$id}
                challenge={challenge}
                participantCount={0}
                isJoined={false}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
