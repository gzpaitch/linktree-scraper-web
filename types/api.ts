// API Response Types - matching Python API schemas

// Health & Metrics
export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export interface MetricsResponse {
  total_scrapes: number;
  active_connections: number;
  uptime_seconds: number;
  memory_usage_mb: number | null;
}

// Scraper Types
export interface Link {
  url: string | null;
  button_text: string | null;
}

export interface UserData {
  username: string;
  url: string;
  avatar_image?: string;
  id?: number;
  tier?: string;
  isActive?: boolean;
  description?: string;
  number_of_links?: number;
  main_colors?: string[];
  links?: Link[];
  createdAt?: number;
  updatedAt?: number;
}

export interface ScrapeUserResponse {
  success: boolean;
  message: string;
  data: UserData | null;
  timestamp: string;
}

export interface ProcessCompleteResponse {
  success: boolean;
  message: string;
  data: UserData | null;
  firebase_url: string | null;
  final_url: string | null;
  username: string | null;
  processing_time_seconds: number | null;
  timestamp: string;
}

// Instagram Types
export interface IgProfileInfo {
  name: string;
  username: string;
  bio: string | null;
  external_url: string | null;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_private?: boolean;
  is_verified?: boolean;
}

export interface IgPostInfo {
  shortcode: string;
  url: string;
  caption: string | null;
  likes: number;
  comments: number;
  date: string;
  is_video: boolean;
  media_url: string;
}

export interface IgPostsResponse {
  username: string;
  posts_count: number;
  posts: IgPostInfo[];
}

// Request Types
export interface ScrapeUserRequest {
  user: string;
  info?: string;
  template_name?: TemplateName;
}

export interface Credentials {
  username: string;
  password: string;
}

// Template names available
export type TemplateName = 'general' | 'tattoo' | 'barber' | 'gym' | 'transform';

// API Error
export interface ApiError {
  detail: string;
  status?: number;
}
