'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Submission } from '@/lib/types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface SubmissionComparisonProps {
  user1Name: string;
  user1Submissions: Submission[];
  user2Name: string;
  user2Submissions: Submission[];
  totalDays: number;
}

interface AlignedDay {
  day: number;
  user1?: Submission;
  user2?: Submission;
}

export function SubmissionComparison({
  user1Name,
  user1Submissions,
  user2Name,
  user2Submissions,
  totalDays,
}: SubmissionComparisonProps) {
  const [currentDay, setCurrentDay] = useState(1);

  // Align submissions by day
  const alignedDays: AlignedDay[] = useMemo(() => {
    const aligned: AlignedDay[] = [];

    for (let day = 1; day <= totalDays; day++) {
      const user1Sub = user1Submissions.find((s) => s.day === day);
      const user2Sub = user2Submissions.find((s) => s.day === day);

      aligned.push({
        day,
        user1: user1Sub,
        user2: user2Sub,
      });
    }

    return aligned;
  }, [user1Submissions, user2Submissions, totalDays]);

  const currentDayData = alignedDays[currentDay - 1];

  const canGoPrevious = currentDay > 1;
  const canGoNext = currentDay < totalDays;

  const handlePrevious = () => {
    if (canGoPrevious) setCurrentDay(currentDay - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentDay(currentDay + 1);
  };

  const getImageUrl = (storageId: string) => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_BUCKET_SUBMISSIONS}/files/${storageId}/preview?width=600&height=600`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Side-by-Side Comparison
        </CardTitle>
        <CardDescription>
          Compare progress between {user1Name} and {user2Name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Day Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h3 className="text-lg font-bold">Day {currentDay}</h3>
            <p className="text-sm text-muted-foreground">
              {currentDay} / {totalDays}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Comparison Grid */}
        {currentDayData ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* User 1 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{user1Name}</h4>
                {currentDayData.user1 && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(currentDayData.user1.uploadedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {currentDayData.user1 ? (
                <div className="rounded-lg overflow-hidden bg-muted aspect-square">
                  <img
                    src={getImageUrl(currentDayData.user1.storageId)}
                    alt={`${user1Name} - Day ${currentDay}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-muted aspect-square flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No submission</p>
                </div>
              )}

              {currentDayData.user1 && currentDayData.user1.caption && (
                <p className="text-sm text-muted-foreground italic">
                  "{currentDayData.user1.caption}"
                </p>
              )}
            </div>

            {/* User 2 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{user2Name}</h4>
                {currentDayData.user2 && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(currentDayData.user2.uploadedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {currentDayData.user2 ? (
                <div className="rounded-lg overflow-hidden bg-muted aspect-square">
                  <img
                    src={getImageUrl(currentDayData.user2.storageId)}
                    alt={`${user2Name} - Day ${currentDay}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-muted aspect-square flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No submission</p>
                </div>
              )}

              {currentDayData.user2 && currentDayData.user2.caption && (
                <p className="text-sm text-muted-foreground italic">
                  "{currentDayData.user2.caption}"
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}

        {/* Progress Indicators */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="text-sm font-semibold">Progress Overview</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{user1Name}</span>
              <span className="text-muted-foreground">
                {user1Submissions.length} / {totalDays}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full overflow-hidden h-2">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${(user1Submissions.length / totalDays) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{user2Name}</span>
              <span className="text-muted-foreground">
                {user2Submissions.length} / {totalDays}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full overflow-hidden h-2">
              <div
                className="bg-accent h-full transition-all"
                style={{
                  width: `${(user2Submissions.length / totalDays) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
