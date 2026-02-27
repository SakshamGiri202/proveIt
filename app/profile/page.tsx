'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, updateUserProfile } from '@/lib/appwrite/api';
import { User, Mail, Calendar, Edit2, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }
        setUser(currentUser);

        const userProfile = await getUserProfile(currentUser.$id);
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            username: userProfile.username || '',
            displayName: userProfile.displayName || '',
            bio: userProfile.bio || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (profile) {
        await updateUserProfile(profile.$id, formData);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditing(false);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#c8f135] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            <span className="text-white">YOUR </span>
            <span className="text-[#c8f135]">PROFILE</span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 sm:p-8">
          {/* Message */}
          {message.text && (
            <div className={`rounded-lg p-3 mb-6 text-sm ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Info */}
          <div className="flex items-start gap-4 sm:gap-6 mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#252525] flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {profile?.displayName || user?.name || 'User'}
                </h2>
              </div>
              <p className="text-gray-400 text-sm truncate">
                @{profile?.username || 'username'}
              </p>
              <p className="text-gray-500 text-xs mt-1 truncate">
                {user?.email}
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                EDIT
              </button>
            )}
          </div>

          {/* Profile Form */}
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={saving}
                  className="w-full bg-[#252525] border border-[#333333] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#c8f135] focus:ring-1 focus:ring-[#c8f135] transition-colors disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                  disabled={saving}
                  className="w-full bg-[#252525] border border-[#333333] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#c8f135] focus:ring-1 focus:ring-[#c8f135] transition-colors disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={saving}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-[#252525] border border-[#333333] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c8f135] focus:ring-1 focus:ring-[#c8f135] transition-colors disabled:opacity-50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      username: profile?.username || '',
                      displayName: profile?.displayName || '',
                      bio: profile?.bio || '',
                    });
                    setMessage({ type: '', text: '' });
                  }}
                  disabled={saving}
                  className="flex-1 border border-[#333333] text-gray-400 font-semibold text-sm tracking-widest uppercase py-2.5 sm:py-3 rounded-lg hover:bg-[#252525] transition-colors disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#c8f135] text-black font-black text-sm tracking-widest uppercase py-2.5 sm:py-3 rounded-lg hover:bg-[#b8e025] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      SAVE
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Profile Details (View Mode) */
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm">{user?.email}</span>
              </div>
              
              {profile?.bio && (
                <div className="pt-2 border-t border-[#2a2a2a]">
                  <p className="text-xs font-semibold text-gray-300 tracking-widest uppercase mb-2">Bio</p>
                  <p className="text-gray-300 text-sm">{profile.bio}</p>
                </div>
              )}

              <div className="pt-2 border-t border-[#2a2a2a]">
                <p className="text-xs font-semibold text-gray-300 tracking-widest uppercase mb-3">Stats</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#252525] rounded-lg p-4">
                    <p className="text-2xl sm:text-3xl font-black text-[#c8f135]">
                      {profile?.totalChallengesCompleted || 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Completed</p>
                  </div>
                  <div className="bg-[#252525] rounded-lg p-4">
                    <p className="text-2xl sm:text-3xl font-black text-[#ff3d6b]">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Joined</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
