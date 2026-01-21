
export type InputType = "userId" | "username" | "profileUrl" | "image" | "groupId" | "placeId";

export interface GroupInfo {
  groupId: number;
  groupName: string;
  role: string;
  rank: number;
}

export interface BadgeInfo {
  badgeId: number;
  badgeName: string; // Used in VerdictGauge
  name: string;      // Used in Footprint (API returns 'name')
  iconUrl?: string;  // Optional as API might use iconImageId
  iconImageId?: number;
  awardedDate?: string;
  awarder?: { id: number; type: string };
  statistics?: any;
}

export interface FriendInfo {
  id: number;
  name: string;
  displayName: string;
  avatarUrl?: string;
  presence?: "online" | "offline" | "playing" | "studio";
}

export interface GroupRole {
  id: number;
  name: string;
  rank: number;
  memberCount: number;
}

export interface RobloxGroupFullData {
  id: number;
  name: string;
  description: string;
  owner: {
    id: number;
    type: string;
    name: string;
    displayName?: string;
  } | null;
  memberCount: number;
  created: string;
  hasClan: boolean;
  publicEntryAllowed: boolean;
  isLocked: boolean;
  shout: {
    body: string;
    poster: {
      username: string;
    };
    created: string;
  } | null;
  roles: GroupRole[];
  iconUrl: string;
}

export interface RobloxGameData {
  placeId: number;
  universeId: number;
  name: string;
  description: string;
  price: number | null; // 0 or null is public/free
  allowedGearCategories: string[];
  studioAccessToApisAllowed: boolean;
  createVipServersAllowed: boolean;
  universeAvatarType: string;
  genre: string;
  playing: number;
  visits: number;
  maxPlayers: number;
  created: string;
  updated: string;
  favoritedCount: number;
  likes: number;
  dislikes: number;
  iconUrl: string;
  creator: {
    id: number;
    name: string;
    type: string; // User or Group
    hasVerifiedBadge?: boolean;
  };
  rootPlaceId?: number;
}

export interface RobloxLivePlayerData {
  userId: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  isOnline: boolean;
  lastOnline: string;
  placeId: number | null;
  gameName: string | null;
  universeId?: number | null;
  primaryGroup: {
    name: string;
    role: string;
    id: number;
  } | null;
  gameInstanceId?: string | null;
  userPresenceType?: number;
}

export interface RobloxPlayerData {
  userId: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  description: string | null;
  createdAt: string | null;
  accountAge: string | null;
  isPremium: boolean | null;
  lastOnline: string | null;
  presence: "online" | "offline" | "playing" | "studio" | null;
  currentGame?: string | null;
  placeId?: number | null; // Added
  universeId?: number | null; // Added
  estimatedValue?: number; // Added for RAP/Wealth
  isBanned: boolean | null;
  previousUsernames: string[];
  friendsCount: number | null;
  friendsList: FriendInfo[];
  followersCount: number | null;
  followingCount: number | null;
  groups: GroupInfo[];
  badges: BadgeInfo[];
  ownedGamePasses: any[];
  recentPlaces: any[];
  rawApiResponses: any | null;
  identificationMethod?: 'text' | 'image';
  notes?: string;
  tags?: string[];
  caseStatus?: 'open' | 'closed';
  isPinned?: boolean;

  favoriteGames?: GameFavorite[];
  createdAssets?: RobloxAssetData[];
  outfitHash?: string;
  socialLinks?: string[];
}

export interface GameFavorite {
  universeId: number;
  placeId: number;
  name: string;
  genre: string;
  creatorName: string;
  likes: number;
  visits: number;
}

export type ReconToolId =
  | 'old_usernames'
  | 'deleted_assets'
  | 'favorites_count'
  | 'private_places'
  | 'hidden_roles'
  | 'delisted_games'
  | 'unlisted_versions'
  | 'product_revenue'
  | 'ghost_players'
  | 'hidden_languages'
  | 'account_forge'
  | 'group_treasury'
  | 'verification_check'
  | 'assets_serial'
  | 'place_permissions'
  | 'unread_notifications';

export interface RobloxVerificationData {
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  idVerified: boolean;
  voiceChatVerified: boolean;
}

export interface RobloxAssetData {
  assetId: string;
  name: string;
  assetType: string;
  serialNumber?: number; // For limited items
}

export interface RobloxPermissionData {
  universeId: number;
  placeId: number;
  role: 'Owner' | 'Editor' | 'Viewer' | 'None';
  grantedBy?: string;
  grantedAt?: string;
}

export interface RobloxNotificationData {
  count: number;
  lastMessage?: {
    sender: string;
    subject: string;
    body: string;
    timestamp: string;
  };
}

export interface ReconResult {
  status: "success" | "error";
  message?: string;
  data?: any;
  code?: number;
}

export interface ApiResponse {
  status: "success" | "error" | "loading";
  message: string;
  data: RobloxPlayerData | RobloxGroupFullData | RobloxGameData | RobloxLivePlayerData | any | null;
  code: number;
  type?: 'user' | 'group' | 'game' | 'live_user' | 'new_account';
}

export interface SearchResult {
  timestamp: string;
  userId: number;
  username: string;
  avatarUrl: string;
  inputMethod: 'text' | 'image';
  isPinned?: boolean;
  notes?: string;
  tags?: string[];
  caseStatus?: 'open' | 'closed';
  groupIds?: number[];
  presence?: "online" | "offline" | "playing" | "studio" | null;
  currentGame?: string | null;
  lastFriendCount?: number;
  lastBadgeId?: number; // Latest badge ID to track new awards
  avatarHeadshot?: string; // To track visual changes
  displayName?: string;
}

export type SearchHistoryItem = SearchResult;

export interface AuditLogEntry {
  action: string;
  admin: string;
  timestamp: string;
  targetId?: number;
  details?: string;
}

export type ReportType = 'Suspicious Activity' | 'Harassment' | 'Scam / Fraud' | 'Impersonation' | 'Other';
export type SeverityLevel = 'Low' | 'Medium' | 'High';
export type CaseClassification = 'Informational' | 'Needs Review' | 'Escalated';
export type ReportStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface EvidenceItem {
  type: 'link' | 'image';
  url: string;
  label: string;
}

export interface CyberReport {
  reportId: string;
  timestamp: string;
  reportType: ReportType;
  severity: SeverityLevel;
  status: ReportStatus;
  targetData: RobloxPlayerData;
  incidentSummary: string;
  ageRange: 'Under 13' | '13–17' | '18–25' | '26+' | 'Unknown';
  region?: string;
  platformContext: string;
  reporterAlias?: string;
  reporterEmail?: string;
  classification?: CaseClassification;
  adminNotes?: string;
  statusHistory?: { status: ReportStatus; timestamp: string }[];
  evidence?: EvidenceItem[];
  isDeleted?: boolean;
}

export type ManagedAccountStatus = 'Active' | 'Under Review' | 'Banned';

export interface ManagedAccount {
  userId: number;
  username: string;
  displayName: string;
  creationDate: string;
  status: ManagedAccountStatus;
  tags: string[];
  notes: string;
  addedAt: string;
  linkedReportIds: string[];
}

declare global {
  interface Window {
    electronAPI: {
      openExternal: (url: string) => void;
    };
    html2pdf: any;
  }
}

export interface RobloxCollectible {
  id: number;
  name: string;
  recentAveragePrice: number;
  originalPrice: number;
  serialNumber?: number;
  assetStock: number;
  buildersClubMembershipType: number;
  imageUrl?: string;
}

export interface RobloxBadge {
  id: number;
  name: string;
  awardDate: string;
  placeId: number;
  placeName: string;
  iconImageId: number;
  imageUrl?: string;
}
