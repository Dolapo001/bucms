export type UserRole = 'MEMBER' | 'ADMIN';

export interface User {
  id: string | number;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  matric_no?: string;
  profile_picture?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Sermon {
  id: string | number;
  title: string;
  speaker: string;
  description: string;
  audio_file?: string;
  document?: string;
  video_url?: string;
  thumbnail?: string;
  created_by?: string | number;
  created_at: string;
  updated_at?: string;
}

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  is_published?: boolean;
  is_pinned: boolean;
  expires_at?: string | null;
  created_by?: string | number;
  created_at: string;
  updated_at?: string;
}

export interface Program {
  id: string | number;
  title: string;
  description: string;
  venue: string;
  event_date: string;
  banner_image?: string;
  created_by?: string | number;
  created_at: string;
  updated_at?: string;
}

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AnalyticsStats {
  total_users: number;
  total_members: number;
  total_admins: number;
  total_announcements: number;
  total_sermons: number;
  total_events: number;
  recent_activities: {
    type: string;
    title: string;
    created_at: string;
    details: string;
  }[];
}
