export type ViewMode = 'organizer-dashboard' | 'attendee-generator';

export type ToneType = 'professional' | 'grateful' | 'takeaways' | 'casual';

export type DeviceMode = 'desktop' | 'mobile';

export interface EventConfig {
  name: string;
  sessionWindow: string;
  location: string;
  hostOrg: string;
  hashtags: string[];
  linkedinPage: string;
  twitterHandle: string;
  agendaUrl: string;
  suggestedPrompts: string[];
  webhookEnabled: boolean;
  webhookUrl: string;
  shareSlug: string;
}

export interface AttachedMedia {
  id: string;
  name: string;
  size: string;
  url: string;
  altText: string;
  label: string;
}

export interface AttendeeActivity {
  id: string;
  initials: string;
  name: string;
  role: string;
  company: string;
  timeAgo: string;
  avatarBgColor: string;
  avatarTextColor: string;
  content: string;
  reactions: number;
  comments: number;
  reposts: number;
  linkedinUrl: string;
  approvedForStage?: boolean;
}

export interface MetricSummary {
  postsGenerated: number;
  postsDelta: string;
  postsGoal: number;
  reach: string;
  reachMultiplier: string;
  totalReactions: string;
  avgReactions: string;
  clicks: number;
  ctr: string;
}
