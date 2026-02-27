// User Types
export interface UserProfile {
  $id: string;
  userId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  totalChallengesCreated: number;
  totalChallengesJoined: number;
  createdAt: string;
  updatedAt: string;
}

// Challenge Types
export type ChallengeDuration = 'week' | 'month';
export type ChallengeStatus = 'pending' | 'active' | 'completed';

export interface Challenge {
  $id: string;
  creatorId: string;
  title: string;
  description: string;
  duration: ChallengeDuration;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  imageUrl?: string;
  maxParticipants?: number;
  participantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeWithCreator extends Challenge {
  creator?: UserProfile;
}

// Participant Types
export type ParticipantStatus = 'active' | 'completed' | 'quit';

export interface ChallengeParticipant {
  $id: string;
  challengeId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  joinedAt: string;
  status: ParticipantStatus;
  completionPercentage: number;
  submissionCount: number;
}

// Submission Types
export interface Submission {
  $id: string;
  challengeId: string;
  userId: string;
  storageId: string;
  timestamp: string;
  uploadedAt: string;
  caption?: string;
  day: number;
  verified: boolean;
}

export interface SubmissionWithUrl extends Submission {
  imageUrl?: string;
  previewUrl?: string;
}

// Comparison Types
export interface SubmissionComparison {
  user1Submissions: Submission[];
  user2Submissions: Submission[];
}

export interface AlignedSubmissions {
  day: number;
  user1?: SubmissionWithUrl;
  user2?: SubmissionWithUrl;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  participant: ChallengeParticipant;
  user?: UserProfile;
  completionPercentage: number;
  submissionCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  displayName: string;
}

export interface CreateChallengeFormData {
  title: string;
  description: string;
  duration: ChallengeDuration;
  startDate: string;
  maxParticipants?: number;
  image?: File;
}

// Camera/Photo Types
export interface CameraCapture {
  dataUrl: string;
  timestamp: Date;
  file?: File;
}

// Dashboard Stats
export interface DashboardStats {
  activeChallenges: number;
  completedChallenges: number;
  totalSubmissions: number;
  currentRank?: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
