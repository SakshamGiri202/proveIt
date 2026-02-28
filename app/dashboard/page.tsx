'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getChallenges, getChallengeParticipants, getChallengeSubmissions } from '@/lib/appwrite/api';
import { Plus, Trophy, Users, Flame } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [challengeStats, setChallengeStats] = useState<Record<string, { participants: number; submissions: number }>>({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('created') === 'true') {
      setSuccessMessage('Account created successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    }

    const loadDashboard = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }
        setUser(currentUser);

        const allChallenges = await getChallenges(50, 0, {});
        setChallenges(allChallenges.rows || []);

        const stats: Record<string, { participants: number; submissions: number }> = {};
        for (const challenge of (allChallenges.rows || []).slice(0, 10)) {
          const participants = await getChallengeParticipants(challenge.$id);
          const submissions = await getChallengeSubmissions(challenge.$id);
          stats[challenge.$id] = {
            participants: participants.length,
            submissions: submissions.length,
          };
        }
        setChallengeStats(stats);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const myChallenges = challenges;
  const otherChallenges = challenges;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#c8f135] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
      {successMessage && (
        <div className="fixed top-16 md:top-4 left-4 right-4 md:left-auto md:right-4 z-50 md:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg">
          <div className="w-5 h-5 rounded-full bg-[#c8f135] flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-900 dark:text-white text-sm">{successMessage}</span>
        </div>
      )}

      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
            <span className="text-gray-900 dark:text-white">CHALLENGES</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Join a challenge and prove yourself
          </p>
        </div>

        <Link href="/challenges/create" className="block mb-5">
          <button className="w-full flex items-center justify-center gap-2 bg-[#c8f135] text-gray-900 font-bold text-sm uppercase py-3.5 rounded-xl hover:bg-[#b8e025] transition-all">
            <Plus className="w-5 h-5" />
            NEW CHALLENGE
          </button>
        </Link>

        {challenges.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-gray-900 dark:text-white font-semibold mb-1">No Challenges Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Create your first challenge!</p>
            <Link href="/challenges/create">
              <button className="bg-[#c8f135] text-gray-900 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#b8e025]">
                Create Challenge
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => {
              const stats = challengeStats[challenge.$id] || { participants: 0, submissions: 0 };
              const daysLeft = Math.ceil(
                (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Link key={challenge.$id} href={`/challenge/${challenge.$id}`}>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md hover:border-[#c8f135]/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg flex-1">{challenge.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        challenge.status === 'planned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        challenge.status === 'inProgress' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {challenge.status}
                      </span>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{challenge.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {stats.participants} joined
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {challenge.durationDays || 7} days
                      </span>
                      <span className={`font-semibold ${
                        daysLeft > 0 ? 'text-[#c8f135]' : 'text-gray-400'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(stats.participants, 3))].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        {stats.participants > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                            +{stats.participants - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[#c8f135] font-semibold">
                        View Challenge →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
