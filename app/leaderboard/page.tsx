'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { getCurrentUser, getChallengeLeaderboard, getChallenges } from '@/lib/appwrite/api';
import { Challenge, ChallengeParticipant } from '@/lib/types';
import { Flame, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboards, setLeaderboards] = useState<Record<string, ChallengeParticipant[]>>({});
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        // Check authentication
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }
        setUser(currentUser);

        // Load active challenges
        const response = await getChallenges(50, 0, { status: 'inProgress' });
        setChallenges(response.rows || []);

        if ((response.rows || []).length > 0) {
          // Load leaderboards for first challenge
          const firstChallenge = response.rows[0];
          setSelectedChallengeId(firstChallenge.$id);

          const leaderboardData: Record<string, ChallengeParticipant[]> = {};

          // Load leaderboard for each challenge
          for (const challenge of response.rows) {
            const lb = await getChallengeLeaderboard(challenge.$id);
            leaderboardData[challenge.$id] = lb;
          }

          setLeaderboards(leaderboardData);
        }
      } catch (error) {
        console.error('Error loading leaderboards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboards();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  const selectedChallenge = challenges.find((c) => c.$id === selectedChallengeId);
  const selectedLeaderboard = selectedChallengeId ? leaderboards[selectedChallengeId] || [] : [];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Leaderboards</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            See how you stack up against other challengers
          </p>
        </div>

        {challenges.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Active Challenges</h3>
              <p className="text-muted-foreground mb-6">
                There are no active challenges yet. Create one or wait for someone to start a challenge.
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/challenges/create">
                  <Button className="gap-2">
                    <Flame className="w-5 h-5" />
                    Create Challenge
                  </Button>
                </Link>
                <Link href="/challenges">
                  <Button variant="outline">Browse Challenges</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Challenge Selector */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-semibold text-sm">Active Challenges</h3>
              <div className="space-y-2">
                {challenges.map((challenge) => (
                  <button
                    key={challenge.$id}
                    onClick={() => setSelectedChallengeId(challenge.$id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedChallengeId === challenge.$id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <p className="font-semibold text-sm line-clamp-1">
                      {challenge.title}
                    </p>
                    <p className="text-xs opacity-75">
                      {challenge.duration === 'week' ? '7 Days' : '30 Days'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Stats Card */}
              {selectedChallenge && (
                <Card className="mt-6">
                  <CardContent className="pt-6 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Challenge</p>
                      <p className="font-semibold line-clamp-2">
                        {selectedChallenge.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Participants</p>
                      <p className="text-2xl font-bold">
                        {selectedLeaderboard.length}
                      </p>
                    </div>
                    <Link href={`/challenge/${selectedChallenge.$id}`}>
                      <Button size="sm" className="w-full">
                        View Challenge
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Leaderboard */}
            <div className="lg:col-span-3">
              {selectedChallenge && (
                <LeaderboardTable
                  participants={selectedLeaderboard}
                  title={selectedChallenge.title}
                  description="Challenge Rankings"
                />
              )}
            </div>
          </div>
        )}

        {/* Global Stats Section */}
        {challenges.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">Global Stats</h2>

            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Active Challenges</p>
                  <p className="text-3xl font-bold text-primary">
                    {challenges.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Total Participants</p>
                  <p className="text-3xl font-bold text-accent">
                    {Object.values(leaderboards).reduce((sum, lb) => sum + lb.length, 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Avg Completion</p>
                  <p className="text-3xl font-bold text-secondary">
                    {Math.round(
                      Object.values(leaderboards).reduce((sum, lb) => {
                        const avg = lb.reduce((s, p) => s + p.completionPercentage, 0) / Math.max(lb.length, 1);
                        return sum + avg;
                      }, 0) / Math.max(Object.keys(leaderboards).length, 1)
                    )}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold">
                    {Object.values(leaderboards).reduce(
                      (sum, lb) => sum + lb.filter((p) => p.status === 'completed').length,
                      0
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
