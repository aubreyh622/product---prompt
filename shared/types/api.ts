// Shared API types — single source of truth for frontend ↔ backend contracts.

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Auth & User ────────────────────────────────────────────────────────────

export type UserRole = 'consultant' | 'senior_reviewer' | 'knowledge_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  practiceArea?: string;
  industryFocus?: string;
  title?: string;
  profileComplete: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ProfileSetupRequest {
  name: string;
  title: string;
  practiceArea: string;
  industryFocus: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Brief Intake ────────────────────────────────────────────────────────────

export type UrgencyLevel = 'standard' | 'high' | 'critical';

export type EngagementArchetype =
  | 'ai_transformation'
  | 'delivery_standardization'
  | 'execution_stall'
  | 'operating_model'
  | 'sponsor_misalignment';

export interface EngagementBrief {
  clientName: string;
  industry: string;
  objective: string;
  coreChallenge: string;
  timeline: string;
  urgency: UrgencyLevel;
  archetype?: EngagementArchetype;
}

// ─── Knowledge Source ────────────────────────────────────────────────────────

export type KnowledgeSourceType = 'firm_library' | 'client_folder';
export type IngestionStatus = 'indexed' | 'pending' | 'failed' | 'stale';
export type KnowledgeAssetTag = 'Flagship' | 'Core' | 'Method' | 'Template' | 'Governance';

export interface KnowledgeAsset {
  id: string;
  name: string;
  fileType: 'DOCX' | 'PPTX' | 'XLSX' | 'PDF' | 'GDOC' | 'GSLIDE' | 'GSHEET';
  sourceType: KnowledgeSourceType;
  assetTag?: KnowledgeAssetTag;
  archetypeTags?: EngagementArchetype[];
  lastIndexed: string;
  lastModified: string;
  ingestionStatus: IngestionStatus;
  chunkCount?: number;
  version?: number;
}

export interface DriveConnectionStatus {
  connected: boolean;
  account?: string;
  folderPath?: string;
  lastSynced?: string;
  fileCount?: number;
}

// ─── Knowledge Activation ────────────────────────────────────────────────────

export type AssetTag = 'Flagship' | 'Core' | 'Method';

export interface Framework {
  id: string;
  name: string;
  description: string;
  industry: string;
  usageCount: number;
  fitScore: number;
  assetTag: AssetTag;
  enabled: boolean;
  sourceType?: KnowledgeSourceType;
  snippet?: string;
  sourceFile?: string;
}

export interface PriorEngagement {
  id: string;
  name: string;
  industry: string;
  year: number;
  similarityScore: number;
  enabled: boolean;
}

export type HypothesisConfidence = 'High' | 'Medium' | 'Low';

export interface WorkingHypothesis {
  id: string;
  text: string;
  confidence: HypothesisConfidence;
}

export type TemplateFormat = 'DOCX' | 'PPTX' | 'XLSX';

export interface SuggestedTemplate {
  id: string;
  name: string;
  format: TemplateFormat;
}

export interface KnowledgeActivationData {
  frameworks: Framework[];
  priorEngagements: PriorEngagement[];
  hypotheses: WorkingHypothesis[];
  templates: SuggestedTemplate[];
}

// ─── Starter Pack ────────────────────────────────────────────────────────────

export interface IssueTreeNode {
  id: string;
  label: string;
  children?: IssueTreeNode[];
  expanded?: boolean;
}

export interface Workstream {
  id: string;
  number: number;
  title: string;
  weekRange: string;
  color: string;
  activities: string[];
}

export interface RoadmapPhase {
  days: number;
  title: string;
  subtitle: string;
  milestones: string[];
  color: string;
}

export interface DeckSlide {
  number: number;
  title: string;
  purpose: string;
  keyMessage: string;
  visual: string;
}

export interface SourceCitation {
  id: string;
  label: string;
  sourceType: 'firm_library' | 'client_folder';
  fileName: string;
  chunkRef: string;
  relevance: string;
}

export interface HallucinationFlag {
  id: string;
  section: string;
  claim: string;
  flagType: 'unsupported_causal' | 'unverified_statistic' | 'low_confidence';
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface StarterPack {
  problemStatement: string;
  issueTree: IssueTreeNode[];
  workstreams: Workstream[];
  roadmap: RoadmapPhase[];
  execSummary: string;
  deckOutline: DeckSlide[];
  confidenceScores: Record<string, number>;
  sourceCitations?: Record<string, SourceCitation[]>;
  hallucinationFlags?: HallucinationFlag[];
}

// ─── Wear-Test Review ────────────────────────────────────────────────────────

export type FlagSeverity = 'High' | 'Medium' | 'Low';
export type FlagStatus = 'pending' | 'approved' | 'feedback' | 'escalated';

export interface ReviewFlag {
  id: string;
  severity: FlagSeverity;
  section: string;
  category: string;
  title: string;
  description: string;
  status: FlagStatus;
  validatedBy?: string;
  feedbackText?: string;
  feedbackSavedAt?: string;
}

export interface FeedbackItem {
  id: string;
  flagId: string;
  flagTitle: string;
  section: string;
  text: string;
  savedAt: string;
  appliedInRevision: boolean;
}

export interface ReusablePreference {
  id: string;
  label: string;
  description: string;
  appliedCount: number;
}

export interface SessionMemory {
  feedbackItems: FeedbackItem[];
  reusablePreferences: ReusablePreference[];
  appliedInNextIteration: string[];
}

export interface ReviewSummary {
  sessionDecisionOverview: {
    totalFlags: number;
    approved: number;
    feedbackLogged: number;
    escalated: number;
  };
  updatedConsultantSummary: string;
  revisedStarterPackHighlights: string[];
  activeSessionPreferences: string[];
  recommendedNextStep: string;
}

export interface WearTestData {
  flags: ReviewFlag[];
  confidenceScores: Record<string, number>;
}

// ─── Knowledge Manager ───────────────────────────────────────────────────────

export interface IngestionJob {
  id: string;
  fileName: string;
  fileType: string;
  sourceType: KnowledgeSourceType;
  status: IngestionStatus;
  startedAt: string;
  completedAt?: string;
  chunkCount?: number;
  errorMessage?: string;
}

export interface ArchetypeBundle {
  id: string;
  archetype: EngagementArchetype;
  assetCount: number;
  lastUpdated: string;
  coverageScore: number;
}

export interface IndexHealthMetric {
  label: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'error';
  detail?: string;
}

// ─── Senior Reviewer ─────────────────────────────────────────────────────────

export type ReviewQueueStatus = 'pending_review' | 'in_review' | 'approved' | 'returned';

export interface ReviewQueueItem {
  id: string;
  clientName: string;
  archetype: EngagementArchetype;
  submittedBy: string;
  submittedAt: string;
  urgency: UrgencyLevel;
  flagCount: number;
  status: ReviewQueueStatus;
  notes?: string;
}

// ─── Google Drive Integration ───────────────────────────────────────────────

export type DriveFileType = 'gdoc' | 'gslide' | 'gsheet' | 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'folder';

export interface DriveFile {
  id: string;
  name: string;
  type: DriveFileType;
  mimeType: string;
  modifiedAt: string;
  size?: string;
  owner?: string;
  shared: boolean;
  path: string;
  ingestionStatus?: IngestionStatus;
  chunkCount?: number;
}

export interface DriveFolder {
  id: string;
  name: string;
  path: string;
  fileCount: number;
  lastSynced?: string;
  designation?: 'firm_library' | 'client_folder' | 'undesignated';
}

export interface DriveIntegrationState {
  connected: boolean;
  account?: string;
  accessToken?: string;
  scopes?: string[];
  connectedAt?: string;
  lastSynced?: string;
  totalFiles?: number;
  totalChunks?: number;
  syncStatus?: 'idle' | 'syncing' | 'error';
  syncError?: string;
  folders?: DriveFolder[];
  recentFiles?: DriveFile[];
}

export interface DriveSyncJob {
  id: string;
  folderId: string;
  folderName: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  filesProcessed?: number;
  chunksCreated?: number;
  errorMessage?: string;
}

// ─── ChatGPT / AI Configuration ──────────────────────────────────────────────

export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-4' | 'gpt-3.5-turbo';

export interface AIModelConfig {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface AIConnectionStatus {
  connected: boolean;
  apiKeyConfigured: boolean;
  apiKeyMasked?: string;
  model: AIModel;
  organization?: string;
  lastTestedAt?: string;
  testStatus?: 'success' | 'failed' | 'untested';
  usageThisMonth?: {
    requests: number;
    tokens: number;
    estimatedCost: string;
  };
  rateLimits?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface AIUsageRecord {
  id: string;
  timestamp: string;
  operation: 'classify' | 'retrieve' | 'generate' | 'review' | 'summarize';
  model: AIModel;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  engagementId?: string;
  success: boolean;
}

// ─── Google Workspace Export ──────────────────────────────────────────────────

export type ExportFormat = 'gdoc' | 'gslide' | 'gsheet' | 'docx' | 'pptx' | 'xlsx' | 'pdf';

export interface ExportTarget {
  format: ExportFormat;
  name: string;
  section: string;
  includeGrounding: boolean;
  destinationFolderId?: string;
}

export interface ExportJob {
  id: string;
  clientName: string;
  createdAt: string;
  status: 'queued' | 'generating' | 'uploading' | 'completed' | 'failed';
  targets: ExportTarget[];
  completedTargets?: number;
  driveUrl?: string;
  localDownloadUrl?: string;
  errorMessage?: string;
  includesGroundingAppendix: boolean;
}

export interface WorkspaceExportConfig {
  saveToGoogleDrive: boolean;
  destinationFolder?: string;
  destinationFolderId?: string;
  includeGroundingAppendix: boolean;
  formats: {
    problemStatement: ExportFormat;
    issueTree: ExportFormat;
    workstreams: ExportFormat;
    roadmap: ExportFormat;
    execSummary: ExportFormat;
    deckOutline: ExportFormat;
  };
}

// ─── Admin & Audit ───────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  practiceArea?: string;
  lastActive?: string;
  status: 'active' | 'inactive';
}

export type AuditActionType =
  | 'GENERATE_STARTER_PACK'
  | 'APPROVE_FLAG'
  | 'FEEDBACK_LOGGED'
  | 'UNDO_FEEDBACK'
  | 'EXPORT_STARTER_PACK'
  | 'APPROVE_REVIEW_QUEUE'
  | 'RETURN_REVIEW_QUEUE'
  | 'REINDEX_ASSET'
  | 'UPDATE_USER_ROLE'
  | 'DEACTIVATE_USER'
  | 'ACTIVATE_USER'
  | 'DRIVE_SYNC'
  | 'AI_CLASSIFY'
  | 'AI_GENERATE'
  | 'LOGIN'
  | 'LOGOUT';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditActionType;
  resource: string;
  timestamp: string;
  details?: string;
  severity: AuditSeverity;
  ipAddress?: string;
  sessionId?: string;
  immutable: boolean;
}

export interface RoleAccessPolicy {
  role: UserRole;
  permissions: string[];
  restrictedActions: string[];
  dataScope: string;
  description: string;
}
