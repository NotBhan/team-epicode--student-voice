

export type ProblemStatus = 'Unsolved' | 'Approved and Under Investigation' | 'Solved' | 'Rejected' | 'Pending Verification';

export type Verification = {
  verifiers: number;
  confirms: number;
  reopens: number;
};

export type StatusChange = {
  status: ProblemStatus;
  timestamp: string;
};

export type Reply = {
  id: string;
  author: {
    name: string; // e.g., "Original Poster", "Anonymous", or Admin's full name
    isOP: boolean;
    post?: string; // Admin's title, e.g., "Faculty Head"
  };
  content: string;
  createdAt: string;
  upvotes: number;
};

export type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  priorityPoints: number;
  author: {
    name: string;
    avatarUrl?: string;
    year?: string;
    branch?: string;
  };
  status: ProblemStatus;
  hashtags: string[];
  createdAt: string;
  replies?: Reply[];
  statusHistory?: StatusChange[];
  verification?: Verification;
};

export type Problem = Complaint;

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  suggestedRewrite?: string;
};

export type UserRole = 'student' | 'admin';

export type UserProfile = {
  uid: string;
  email: string | null;
  userId?: string;
  role: UserRole;
  createdAt: Date;
  password?: string; // For mock auth only
  fullName?: string;
  post?: string;
  priorityPoints?: number;
};

export type Activity = {
    id: string;
    type: 'new' | 'resolved' | 'pending';
    text: string;
    timestamp: string;
}

export type Notification = {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
  href?: string;
};
