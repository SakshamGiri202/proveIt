'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getChallengeById,
  getCurrentUser,
  getChallengeParticipants,
  joinChallenge,
  uploadSubmission,
  getChallengeSubmissions,
  getUserProfile,
} from '@/lib/appwrite/api';
import { Flame, Users, Calendar, ArrowLeft, Camera, Plus, User } from 'lucide-react';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }
        setCurrentUser(user);

        const profile = await getUserProfile(user.$id);
        setUserProfile(profile);

        const challengeData = await getChallengeById(challengeId);
        setChallenge(challengeData);

        const participantsList = await getChallengeParticipants(challengeId);
        setParticipants(participantsList);

        const isUserParticipant = participantsList.some((p) => p.userId === user.$id);
        setIsParticipant(isUserParticipant);

        if (participantsList.length > 0) {
          const submissionsList = await getChallengeSubmissions(challengeId);
          setSubmissions(submissionsList);
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId, router]);

  const handleJoinChallenge = async () => {
    if (!currentUser || !userProfile) return;
    try {
      setLoading(true);
      await joinChallenge(
        challengeId,
        currentUser.$id,
        userProfile.displayName || currentUser.name || 'User',
        userProfile.avatarUrl || ''
      );
      setIsParticipant(true);
      const participantsList = await getChallengeParticipants(challengeId);
      setParticipants(participantsList);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSelectedPhoto({ file, preview });
    }
  };

  const handleUpload = async () => {
    if (!selectedPhoto || !currentUser) return;
    try {
      setUploading(true);
      setUploadError('');

      const startDate = new Date(challenge?.startDate || new Date());
      const today = new Date();
      const dayDifference = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      await uploadSubmission(
        challengeId,
        currentUser.$id,
        selectedPhoto.file,
        dayDifference
      );

      const submissionsList = await getChallengeSubmissions(challengeId);
      setSubmissions(submissionsList);
      setSelectedPhoto(null);
      setShowUploadModal(false);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Flame className="w-10 h-10 text-[#c8f135] mx-auto animate-pulse" />
          <p className="text-gray-500 text-sm mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-600 mb-4">Challenge not found</p>
          <Link href="/dashboard" className="text-[#c8f135] font-semibold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const submissionsByUser: Record<string, any[]> = {};
  participants.forEach((p) => {
    submissionsByUser[p.userId] = submissions
      .filter((s) => s.userId === p.userId)
      .sort((a, b) => a.day - b.day);
  });

  const maxDays = Math.max(
    ...submissionsByUser[Object.keys(submissionsByUser)[0]]?.map((s) => s.day) || [0],
    ...submissionsByUser[Object.keys(submissionsByUser)[1]]?.map((s) => s.day) || [0]
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/dashboard" className="p-2 -ml-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              challenge.status === 'planned' ? 'bg-blue-100 text-blue-700' :
              challenge.status === 'inProgress' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {challenge.status}
            </span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">{challenge.title}</h1>
        <p className="text-sm text-gray-500 line-clamp-2">{challenge.description}</p>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {challenge.duration === 'week' ? '7' : '30'} days
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {participants.length}
          </span>
          <span className="text-[#c8f135] font-semibold">
            {daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}
          </span>
        </div>
      </div>

      {/* Participants Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center -space-x-2">
          {participants.map((p) => (
            <div
              key={p.$id}
              className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-gray-600"
              title={p.displayName}
            >
              {p.displayName?.charAt(0).toUpperCase() || '?'}
            </div>
          ))}
          {!isParticipant && participants.length < 2 && (
            <button
              onClick={handleJoinChallenge}
              className="w-10 h-10 rounded-full bg-[#c8f135] border-2 border-white flex items-center justify-center text-gray-900"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Comparison Feed */}
      {participants.length > 0 && (
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">PROGRESS COMPARISON</h2>
          
          {maxDays === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No submissions yet</p>
              <p className="text-gray-400 text-xs">Be the first to upload!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Day by day comparison */}
              {Array.from({ length: Math.min(maxDays, challenge.durationDays || 7) }, (_, i) => i + 1).map((day) => (
                <div key={day} className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500">DAY {day}</span>
                    <span className="text-xs text-gray-400">
                      {submissionsByUser[participants[0]?.userId]?.find(s => s.day === day)
                        ? new Date(submissionsByUser[participants[0].userId].find(s => s.day === day).uploadedAt).toLocaleDateString()
                        : '—'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {participants.map((p) => {
                      const sub = submissionsByUser[p.userId]?.find(s => s.day === day);
                      return (
                        <div
                          key={p.$id}
                          className={`aspect-square rounded-lg overflow-hidden ${
                            sub ? '' : 'bg-gray-100 flex items-center justify-center'
                          }`}
                        >
                          {sub ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${sub.storageId}/preview?width=200&height=200`}
                              alt={`${p.displayName} day ${day}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <User className="w-4 h-4 text-gray-300 mx-auto mb-1" />
                              <span className="text-[10px] text-gray-400">{p.displayName}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Join Button for Non-Participants */}
      {!isParticipant && (
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <button
            onClick={handleJoinChallenge}
            disabled={loading}
            className="w-full bg-[#c8f135] hover:bg-[#b8e025] text-gray-900 font-black text-sm uppercase py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'JOINING...' : 'JOIN CHALLENGE'}
          </button>
        </div>
      )}

      {/* Upload FAB for Participants */}
      {isParticipant && challenge.status !== 'completed' && (
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-[#c8f135] rounded-full shadow-lg flex items-center justify-center"
        >
          <Camera className="w-6 h-6 text-gray-900" />
        </button>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Upload Photo</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedPhoto(null);
                }}
                className="p-2 text-gray-500"
              >
                ✕
              </button>
            </div>

            {selectedPhoto ? (
              <div className="space-y-3">
                <img
                  src={selectedPhoto.preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                {uploadError && (
                  <p className="text-red-500 text-sm">{uploadError}</p>
                )}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-[#c8f135] hover:bg-[#b8e025] text-gray-900 font-black uppercase py-3 rounded-xl disabled:opacity-50"
                >
                  {uploading ? 'UPLOADING...' : 'SUBMIT'}
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Take a photo</p>
                  <p className="text-gray-400 text-sm">or tap to select</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
