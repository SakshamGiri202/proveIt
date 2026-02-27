'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createChallenge, joinChallenge, getUserByUsername } from '@/lib/appwrite/api';
import { ChallengeDuration } from '@/lib/types';
import { ArrowLeft, Plus, ChevronDown, UserPlus, Send } from 'lucide-react';

interface CreateChallengeFormProps {
  userId: string;
  userName?: string;
}

const CHALLENGE_TYPES = ['Fitness', 'Nutrition', 'Habits', 'Skills', 'Mindfulness', 'Other'];
const DURATIONS = ['1 Week', '2 Weeks', '1 Month', '3 Months'];

const durationMap: Record<string, ChallengeDuration> = {
  '1 Week': 'week',
  '2 Weeks': 'week',
  '1 Month': 'month',
  '3 Months': 'month',
};

export function CreateChallengeForm({ userId, userName }: CreateChallengeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    challengeType: '',
    duration: '1 Week',
    startDate: new Date().toISOString().split('T')[0],
    inviteUsername: '',
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
      if (durationRef.current && !durationRef.current.contains(e.target as Node)) setDurationOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        setError('Challenge title is required');
        setLoading(false);
        return;
      }

      const challenge = await createChallenge(
        userId,
        formData.title,
        formData.description,
        durationMap[formData.duration] || 'week',
        new Date(formData.startDate).toISOString()
      );

      // Join creator to challenge
      await joinChallenge(
        challenge.$id,
        userId,
        userName || 'Creator',
        ''
      );

      // If invite username provided, find and add them
      if (formData.inviteUsername.trim()) {
        try {
          const invitedUser = await getUserByUsername(formData.inviteUsername.trim());
          if (invitedUser) {
            await joinChallenge(
              challenge.$id,
              invitedUser.userId,
              invitedUser.displayName || invitedUser.username,
              invitedUser.avatarUrl || ''
            );
          }
        } catch (err) {
          console.log('Could not invite user - they may not exist');
        }
      }

      router.push(`/challenge/${challenge.$id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="px-4 pt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-black uppercase tracking-tight mb-1">
              <span className="text-gray-900">NEW </span>
              <span className="text-[#c8f135]">CHALLENGE</span>
            </h1>
            <p className="text-gray-500 text-sm">Create and invite someone to compete</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase">Title</label>
              <input
                name="title"
                placeholder="30-Day Fitness Challenge"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
              <textarea
                name="description"
                placeholder="Daily workout photos to track progress"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase">Duration</label>
                <div className="relative" ref={durationRef}>
                  <button
                    type="button"
                    onClick={() => setDurationOpen(!durationOpen)}
                    disabled={loading}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between transition-all hover:border-gray-400 focus:outline-none focus:border-[#c8f135] disabled:opacity-50"
                  >
                    <span className="text-gray-900">{formData.duration}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${durationOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {durationOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden z-50 shadow-lg">
                      {DURATIONS.map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, duration: dur }));
                            setDurationOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            formData.duration === dur
                              ? 'bg-[#c8f135] text-gray-900 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase">Start</label>
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-1">
                <UserPlus className="w-3 h-3" />
                Invite Competitor
              </label>
              <input
                name="inviteUsername"
                placeholder="Their username"
                value={formData.inviteUsername}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:border-[#c8f135] focus:ring-2 focus:ring-[#c8f135]/20 transition-all disabled:opacity-50"
              />
              <p className="text-xs text-gray-400">Enter username to automatically invite them</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8f135] hover:bg-[#b8e025] text-gray-900 font-black text-sm tracking-widest uppercase py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'CREATING...' : 'CREATE CHALLENGE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
