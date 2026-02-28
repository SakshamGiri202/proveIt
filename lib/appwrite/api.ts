import { account, tablesDB, storage } from './client';
import { ID, Query } from 'appwrite';

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const BUCKET_SUBMISSIONS = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'challenge-submissions';
export const BUCKET_AVATARS = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'profile-avatars';

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

export async function createUserProfile(
  userId: string,
  username: string,
  displayName: string,
  email: string
) {
  try {
    const profile = await tablesDB.createRow(
      DB_ID,
      'users',
      ID.unique(),
      {
        userId,
        username,
        displayName,
        email,
        totalChallengesCompleted: 0,
      }
    );
    return profile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'users',
      [Query.equal('userId', userId)]
    );
    return response.rows?.[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(
  documentId: string,
  data: Record<string, any>
) {
  try {
    return await tablesDB.updateRow(DB_ID, 'users', documentId, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'users',
      [Query.equal('username', username)]
    );
    return response.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createChallenge(
  creatorId: string,
  title: string,
  description: string,
  duration: 'week' | 'month',
  startDate: string,
  imageUrl?: string,
  maxParticipants?: number
) {
  try {
    const durationDays = duration === 'week' ? 7 : 30;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    const challenge = await tablesDB.createRow(
      DB_ID,
      'challenges',
      ID.unique(),
      {
        title,
        description,
        duration,
        durationDays,
        startDate,
        endDate: endDate.toISOString(),
        status: 'planned',
        hasEnded: false,
      }
    );
    return challenge;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
}

export async function getChallenges(
  limit = 20,
  offset = 0,
  filters?: { status?: string; duration?: string }
) {
  try {
    const queries = [];

    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    if (filters?.duration) {
      queries.push(Query.equal('duration', filters.duration));
    }

    queries.push(Query.orderDesc('startDate'));
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));

    const response = await tablesDB.listRows(
      DB_ID,
      'challenges',
      queries
    );
    return response;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
}

export async function getChallengeById(challengeId: string) {
  try {
    return await tablesDB.getRow(DB_ID, 'challenges', challengeId);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
}

export async function updateChallenge(
  challengeId: string,
  data: Record<string, any>
) {
  try {
    return await tablesDB.updateRow(DB_ID, 'challenges', challengeId, data);
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
}

export async function joinChallenge(
  challengeId: string,
  userId: string,
  displayName: string,
  avatarUrl?: string
) {
  try {
    const existing = await tablesDB.listRows(
      DB_ID,
      'challenge_participants',
      [
        Query.equal('challengeId', challengeId),
        Query.equal('userId', userId),
      ]
    );

    if ((existing.rows || []).length > 0) {
      throw new Error('Already joined this challenge');
    }

    const participant = await tablesDB.createRow(
      DB_ID,
      'challenge_participants',
      ID.unique(),
      {
        challengeId,
        userId,
        displayName,
        avatarUrl: avatarUrl || '',
        joinedOn: new Date().toISOString(),
        role: 'member',
        progress: 0,
        submissionCount: 0,
        hasGivenConsent: true,
      }
    );
    return participant;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
}

export async function getChallengeParticipants(challengeId: string) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'challenge_participants',
      [Query.equal('challengeId', challengeId)]
    );
    return response.rows;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
}

export async function getUserChallenges(userId: string) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'challenge_participants',
      [
        Query.equal('userId', userId),
        Query.orderDesc('joinedOn'),
      ]
    );
    return response.rows;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw error;
  }
}

export async function uploadSubmission(
  challengeId: string,
  userId: string,
  file: File,
  day: number,
  caption?: string
) {
  try {
    const uploadedFile = await storage.createFile(
      BUCKET_SUBMISSIONS,
      ID.unique(),
      file
    );

    const submission = await tablesDB.createRow(
      DB_ID,
      'submissions',
      ID.unique(),
      {
        challengeId,
        userId,
        storageId: uploadedFile.$id,
        timestamp: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        day,
        caption: caption || '',
      }
    );

    await updateParticipantProgress(challengeId, userId);

    return submission;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

export async function updateParticipantProgress(challengeId: string, userId: string) {
  try {
    const submissions = await tablesDB.listRows(
      DB_ID,
      'submissions',
      [Query.equal('challengeId', challengeId), Query.equal('userId', userId)]
    );
    
    const submissionCount = submissions.rows.length;
    
    const challenge = await getChallengeById(challengeId);
    const progress = challenge?.durationDays 
      ? Math.round((submissionCount / challenge.durationDays) * 100) 
      : Math.round((submissionCount / 7) * 100);

    const participants = await getChallengeParticipants(challengeId);
    const participant = participants.find((p) => p.userId === userId);
    
    if (participant?.$id) {
      await tablesDB.updateRow(DB_ID, 'challenge_participants', participant.$id, {
        submissionCount,
        progress,
      });
    }
  } catch (error) {
    console.error('Error updating participant progress:', error);
  }
}

export async function getChallengeSubmissions(challengeId: string) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'submissions',
      [
        Query.equal('challengeId', challengeId),
        Query.orderAsc('day'),
      ]
    );
    return response.rows;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
}

export async function getUserSubmissions(
  challengeId: string,
  userId: string
) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'submissions',
      [
        Query.equal('challengeId', challengeId),
        Query.equal('userId', userId),
        Query.orderAsc('day'),
      ]
    );
    return response.rows;
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }
}

export async function getSubmissionComparison(
  challengeId: string,
  userId1: string,
  userId2: string
) {
  try {
    const [subs1, subs2] = await Promise.all([
      getUserSubmissions(challengeId, userId1),
      getUserSubmissions(challengeId, userId2),
    ]);

    return {
      user1Submissions: subs1,
      user2Submissions: subs2,
    };
  } catch (error) {
    console.error('Error fetching submission comparison:', error);
    throw error;
  }
}

export async function deleteSubmission(submissionId: string, storageId: string) {
  try {
    await storage.deleteFile(BUCKET_SUBMISSIONS, storageId);
    await tablesDB.deleteRow(DB_ID, 'submissions', submissionId);
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
}

export async function getChallengeLeaderboard(challengeId: string) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'challenge_participants',
      [
        Query.equal('challengeId', challengeId),
        Query.orderDesc('progress'),
        Query.orderDesc('submissionCount'),
      ]
    );
    return response.rows;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

export async function getGlobalLeaderboard(limit = 50) {
  try {
    const response = await tablesDB.listRows(
      DB_ID,
      'users',
      [
        Query.orderDesc('totalChallengesCompleted'),
        Query.limit(limit),
      ]
    );
    return response.rows;
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    throw error;
  }
}

export function getFilePreview(
  bucketId: string,
  fileId: string,
  width = 200,
  height = 200
) {
  try {
    return storage.getFilePreview(bucketId, fileId, width, height);
  } catch (error) {
    console.error('Error generating preview:', error);
    return null;
  }
}

export function getFileDownload(bucketId: string, fileId: string) {
  try {
    return storage.getFileDownload(bucketId, fileId);
  } catch (error) {
    console.error('Error getting file download:', error);
    return null;
  }
}
