'use client';

import { ChallengeParticipant } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Zap } from 'lucide-react';

interface LeaderboardTableProps {
  participants: ChallengeParticipant[];
  title?: string;
  description?: string;
}

export function LeaderboardTable({
  participants,
  title = 'Leaderboard',
  description = 'Top performers',
}: LeaderboardTableProps) {
  const sortedParticipants = [...participants].sort((a, b) => {
    // Sort by completion percentage first, then by submission count
    if (b.completionPercentage !== a.completionPercentage) {
      return b.completionPercentage - a.completionPercentage;
    }
    return b.submissionCount - a.submissionCount;
  });

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-sm font-semibold text-muted-foreground w-5 text-center">{rank}</span>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>

      <CardContent>
        {sortedParticipants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No participants yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedParticipants.map((participant, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <div
                  key={participant.$id}
                  className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                    isTopThree
                      ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8">
                    {getMedalIcon(rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {participant.avatarUrl && (
                        <img
                          src={participant.avatarUrl}
                          alt={participant.displayName}
                          className="w-8 h-8 rounded-full bg-primary/20"
                        />
                      )}
                      <span className="font-semibold truncate">
                        {participant.displayName}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    {/* Completion */}
                    <div className="text-center">
                      <div className="text-sm font-semibold flex items-center gap-1">
                        <Flame className="w-4 h-4 text-primary" />
                        {participant.completionPercentage}%
                      </div>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>

                    {/* Submissions */}
                    <div className="text-center">
                      <div className="text-sm font-semibold flex items-center gap-1">
                        <Zap className="w-4 h-4 text-accent" />
                        {participant.submissionCount}
                      </div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <Badge
                        variant={
                          participant.status === 'completed'
                            ? 'default'
                            : participant.status === 'quit'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {participant.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ranking Breakdown */}
        {sortedParticipants.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-sm mb-3">Rankings Breakdown</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <p className="text-yellow-700 dark:text-yellow-400 font-semibold">1st Place</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sortedParticipants[0]?.displayName}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-400/10">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">2nd Place</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sortedParticipants[1]?.displayName || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-600/10">
                <p className="text-orange-700 dark:text-orange-400 font-semibold">3rd Place</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sortedParticipants[2]?.displayName || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
