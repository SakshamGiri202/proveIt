'use client';

import { Challenge } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Users } from 'lucide-react';
import Link from 'next/link';

interface ChallengeCardProps {
  challenge: Challenge;
  participantCount?: number;
  isJoined?: boolean;
}

export function ChallengeCard({
  challenge,
  participantCount = 0,
  isJoined = false,
}: ChallengeCardProps) {
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusColor = {
    pending: 'secondary',
    active: 'default',
    completed: 'secondary',
  };

  const durationLabel = challenge.duration === 'week' ? '7 Days' : '30 Days';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {challenge.imageUrl && (
        <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-lg">
              {challenge.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {challenge.description}
            </CardDescription>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="gap-1">
            <Flame className="w-3 h-3" />
            {durationLabel}
          </Badge>
          <Badge variant="outline" className={statusColor[challenge.status]}>
            {challenge.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Participants</p>
            <p className="font-semibold flex items-center gap-1">
              <Users className="w-4 h-4" />
              {participantCount}
              {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Days Remaining</p>
            <p className="font-semibold">
              {daysLeft > 0 ? `${daysLeft}d` : 'Ended'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/challenge/${challenge.$id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {!isJoined && challenge.status === 'active' && (
            <Link href={`/challenge/${challenge.$id}`}>
              <Button className="flex-1">Join</Button>
            </Link>
          )}
          {isJoined && (
            <Button disabled className="flex-1">
              Joined
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
