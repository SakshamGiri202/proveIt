'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Challenge, Submission } from '@/lib/types';
import { Flame, Calendar, CheckCircle, Clock } from 'lucide-react';

interface ProgressTrackerProps {
  challenge: Challenge;
  submissions: Submission[];
  userName: string;
}

export function ProgressTracker({
  challenge,
  submissions,
  userName,
}: ProgressTrackerProps) {
  const expectedDays = challenge.durationDays || (challenge.duration === 'week' ? 7 : 30);
  const completionPercentage = Math.round((submissions.length / expectedDays) * 100);

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const today = new Date();

  const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const onTrack = submissions.length >= daysElapsed;

  const getStatusColor = () => {
    if (completionPercentage === 100) return 'text-green-500';
    if (onTrack) return 'text-blue-500';
    return 'text-yellow-500';
  };

  const getStatusLabel = () => {
    if (completionPercentage === 100) return 'Completed!';
    if (onTrack) return 'On Track';
    return 'Behind Schedule';
  };

  // Calculate daily streak
  const dailyStreak = (() => {
    let streak = 0;
    for (let day = 1; day <= expectedDays; day++) {
      if (submissions.some((s) => s.day === day)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Progress Tracker
        </CardTitle>
        <CardDescription>
          {userName}'s progress in {challenge.title}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <h4 className="font-semibold">Overall Progress</h4>
            <span className="text-2xl font-bold text-primary">
              {completionPercentage}%
            </span>
          </div>

          <div className="w-full bg-muted rounded-full overflow-hidden h-3">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Submissions */}
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Submissions</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{submissions.length}</p>
              <p className="text-xs text-muted-foreground">
                of {expectedDays} expected
              </p>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Days Left</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.max(0, daysRemaining)}</p>
              <p className="text-xs text-muted-foreground">
                of {expectedDays} total
              </p>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Daily Streak</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{dailyStreak}</p>
              <p className="text-xs text-muted-foreground">
                consecutive days
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Status</span>
            </div>
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusLabel()}
            </Badge>
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 rounded-lg ${
          completionPercentage === 100
            ? 'bg-green-500/10 border border-green-500/20'
            : onTrack
            ? 'bg-blue-500/10 border border-blue-500/20'
            : 'bg-yellow-500/10 border border-yellow-500/20'
        }`}>
          <p className="text-sm font-medium">
            {completionPercentage === 100
              ? `Congratulations! ${userName} completed the challenge!`
              : onTrack
              ? `Great work! ${userName} is on track with ${expectedDays - submissions.length} submission${expectedDays - submissions.length !== 1 ? 's' : ''} to go.`
              : `${userName} is behind by ${daysElapsed - submissions.length} day${daysElapsed - submissions.length !== 1 ? 's' : ''}. Keep pushing!`}
          </p>
        </div>

        {/* Day-by-Day Calendar */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Submission Calendar</h4>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: expectedDays }).map((_, index) => {
              const day = index + 1;
              const hasSubmission = submissions.some((s) => s.day === day);
              const isToday = day === daysElapsed;
              const isPast = day < daysElapsed;
              const isFuture = day > daysElapsed;

              return (
                <div
                  key={day}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-medium transition-all ${
                    hasSubmission
                      ? 'bg-primary text-primary-foreground'
                      : isToday
                      ? 'bg-accent/30 border-2 border-accent'
                      : isPast
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                  title={`Day ${day}${hasSubmission ? ' (submitted)' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Purple = submitted, Blue = today, Gray = pending, Light = future
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
