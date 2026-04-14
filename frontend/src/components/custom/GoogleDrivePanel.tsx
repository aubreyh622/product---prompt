import { useState } from 'react';
import type { DriveIntegrationState, DriveFolder, DriveFile, DriveSyncJob } from '@shared/types/api';
import {
  HardDrive, RefreshCw, CheckCircle, AlertCircle, FolderOpen, FileText,
  Link, Unlink, ChevronDown, ChevronRight, Clock, Zap, Eye, Settings
} from 'lucide-react';
import { toast } from 'sonner';

const MOCK_DRIVE_STATE: DriveIntegrationState = {
  connected: true,
  account: 'aubrey@cgsadvisors.com',
  scopes: ['drive.readonly', 'drive.file', 'docs', 'spreadsheets', 'presentations'],
  connectedAt: '2026-04-01T09:00:00Z',
  lastSynced: '2026-04-13T07:45:00Z',
  totalFiles: 47,
  totalChunks: 1284,
  syncStatus: 'idle',
  folders: [
    { id: 'f1', name: 'CGS Firm Library', path: 'CGS Internal / Firm Library', fileCount: 28, lastSynced: '2026-04-13T07:45:00Z', designation: 'firm_library' },
    { id: 'f2', name: 'Q2 2026 Active Engagements', path: 'CGS Engagements / Active / Q2 2026', fileCount: 12, lastSynced: '2026-04-13T07:45:00Z', designation: 'client_folder' },
    { id: 'f3', name: 'Archived Engagements 2025', path: 'CGS Engagements / Archive / 2025', fileCount: 7, lastSynced: '2026-04-10T12:00:00Z', designation: 'firm_library' },
  ],
  recentFiles: [
    { id: 'rf1', name: 'AI Maturity Ladder v3.2', type: 'gslide', mimeType: 'application/vnd.google-apps.presentation', modifiedAt: '2026-03-28T14:00:00Z', shared: true, path: 'CGS Internal / Firm Library', ingestionStatus: 'indexed', chunkCount: 42 },
    { id: 'rf2', name: 'Client Engagement Brief - Q2 2026', type: 'gdoc', mimeType: 'application/vnd.google-apps.document', modifiedAt: '2026-04-11T14:30:00Z', shared: false, path: 'CGS Engagements / Active / Q2 2026', ingestionStatus: 'indexed', chunkCount: 12 },
    { id: 'rf3', name: 'Stakeholder Interview Notes - Wave 1', type: 'gdoc', mimeType: 'application/vnd.google-apps.document', modifiedAt: '2026-04-10T09:15:00Z', shared: false, path: 'CGS Engagements / Active / Q2 2026', ingestionStatus: 'indexed', chunkCount: 34 },
    { id: 'rf4', name: 'Reporting Baseline - FY2025', type: 'gsheet', mimeType: 'application/vnd.google-apps.spreadsheet', modifiedAt: '2026-04-05T10:00:00Z', shared: false, path: 'CGS Engagements / Active / Q2 2026', ingestionStatus: 'indexed', chunkCount: 45 },
    { id: 'rf5', name: 'Executive Sponsor Alignment Notes', type: 'gdoc', mimeType: 'application/vnd.google-apps.document', modifiedAt: '2026-04-12T08:00:00Z', shared: false, path: 'CGS Engagements / Active / Q2 2026', ingestionStatus: 'pending', chunkCount: 0 },
  ],
};

const MOCK_SYNC_JOBS: DriveSyncJob[] = [
  { id: 'sj1', folderId: 'f1', folderName: 'CGS Firm Library', status: 'completed', startedAt: '2026-04-13T07:40:00Z', completedAt: '2026-04-13T07:45:00Z', filesProcessed: 28, chunksCreated: 847 },
  { id: 'sj2', folderId: 'f2', folderName: 'Q2 2026 Active Engagements', status: 'completed', startedAt: '2026-04-13T07:40:00Z', completedAt: '2026-04-13T07:45:00Z', filesProcessed: 12, chunksCreated: 437 },
  { id: 'sj3', folderId: 'f3', folderName: 'Archived Engagements 2025', status: 'completed', startedAt: '2026-04-10T11:55:00Z', completedAt: '2026-04-10T12:00:00Z', filesProcessed: 7, chunksCreated: 0 },
];

const FILE_TYPE_ICONS: Record<string, { label: string; color: string }> = {
  gdoc: { label: 'DOC', color: 'bg-blue-500/20 text-blue-400' },
  gslide: { label: 'SLIDE', color: 'bg-yellow-500/20 text-yellow-400' },
  gsheet: { label: 'SHEET', color: 'bg-green-500/20 text-green-400' },
  pdf: { label: 'PDF', color: 'bg-red-500/20 text-red-400' },
  docx: { label: 'DOCX', color: 'bg-blue-400/20 text-blue-300' },
  pptx: { label: 'PPTX', color: 'bg-orange-500/20 text-orange-400' },
  xlsx: { label: 'XLSX', color: 'bg-green-400/20 text-green-300' },
  folder: { label: 'DIR', color: 'bg-[#D4A843]/20 text-[#D4A843]' },
};

const DESIGNATION_STYLE: Record<string, { label: string; color: string }> = {
  firm_library: { label: 'Firm Library', color: 'bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/30' },
  client_folder: { label: 'Client Folder', color: 'bg-[#3DAA6E]/15 text-[#3DAA6E] border-[#3DAA6E]/30' },
  undesignated: { label: 'Undesignated', color: 'bg-[#1F3550] text-[#7A90A8] border-[#1F3550]' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function GoogleDrivePanel() {
  const [driveState, setDriveState] = useState<DriveIntegrationState>(MOCK_DRIVE_STATE);
  const [syncJobs] = useState<DriveSyncJob[]>(MOCK_SYNC_JOBS);
  const [syncing, setSyncing] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f1', 'f2']));
  const [activeTab, setActiveTab] = useState<'overview' | 'folders' | 'files' | 'sync'>('overview');
  const [connecting, setConnecting] = useState(false);

  function handleSync() {
    setSyncing(true);
    setDriveState((prev) => ({ ...prev, syncStatus: 'syncing' }));
    setTimeout(() => {
      setSyncing(false);
      setDriveState((prev) => ({
        ...prev,
        syncStatus: 'idle',
        lastSynced: new Date().toISOString(),
      }));
      toast.success('Drive sync complete', { description: 'All designated folders re-indexed successfully.' });
    }, 2200);
  }

  function handleConnect() {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setDriveState((prev) => ({ ...prev, connected: true }));
      toast.success('Google Drive connected', { description: 'OAuth 2.0 authorization complete. Folders are ready to designate.' });
    }, 1800);
  }

  function handleDisconnect() {
    setDriveState((prev) => ({ ...prev, connected: false, account: undefined }));
    toast.info('Google Drive disconnected', { description: 'OAuth tokens revoked. Knowledge base will use cached index until reconnected.' });
  }

  function toggleFolder(id: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const TABS = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'folders' as const, label: 'Folders' },
    { id: 'files' as const, label: 'Recent Files' },
    { id: 'sync' as const, label: 'Sync Log' },
  ];

  return (
    <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#1F3550]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4A90D9]/15 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-[#4A90D9]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#E8EDF5] text-sm">Google Drive Integration</h2>
              <p className="text-xs text-[#7A90A8]">OAuth 2.0 · Permission-scoped retrieval · Auto-sync</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {driveState.connected ? (
              <>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#4A90D9]/15 text-[#4A90D9] border border-[#4A90D9]/30 hover:bg-[#4A90D9]/25 transition-all duration-200 disabled:opacity-60"
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1F3550] text-[#7A90A8] hover:border-[#E05252]/40 hover:text-[#E05252] transition-all duration-200"
                >
                  <Unlink className="w-3 h-3" />
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#4A90D9] text-white hover:bg-[#3a7bc8] transition-all duration-200 disabled:opacity-60"
              >
                <Link className="w-3 h-3" />
                {connecting ? 'Connecting...' : 'Connect Google Drive'}
              </button>
            )}
          </div>
        </div>

        {/* Connection Status Banner */}
        {driveState.connected ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 p-3 bg-[#3DAA6E]/10 border border-[#3DAA6E]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#3DAA6E]" />
              <span className="text-xs font-semibold text-[#3DAA6E]">Connected</span>
            </div>
            <span className="text-xs text-[#E8EDF5]">{driveState.account}</span>
            <span className="text-xs text-[#7A90A8]">·</span>
            <span className="text-xs text-[#7A90A8]">{driveState.totalFiles} files indexed</span>
            <span className="text-xs text-[#7A90A8]">·</span>
            <span className="text-xs text-[#7A90A8]">{driveState.totalChunks?.toLocaleString()} chunks</span>
            <span className="text-xs text-[#7A90A8] ml-auto">
              Last synced {driveState.lastSynced ? `${formatDate(driveState.lastSynced)} at ${formatTime(driveState.lastSynced)}` : 'Never'}
            </span>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 p-3 bg-[#E05252]/10 border border-[#E05252]/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-[#E05252]" />
            <div>
              <p className="text-xs font-semibold text-[#E05252]">Not Connected</p>
              <p className="text-xs text-[#7A90A8]">Connect your Google Drive to enable knowledge ingestion and permission-aware retrieval.</p>
            </div>
          </div>
        )}

        {/* OAuth Scopes */}
        {driveState.connected && driveState.scopes && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {driveState.scopes.map((scope) => (
              <span key={scope} className="text-xs px-2 py-0.5 rounded-full bg-[#1F3550] text-[#7A90A8] border border-[#1F3550]">
                {scope}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1F3550]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-[#D4A843] border-b-2 border-[#D4A843] bg-[#D4A843]/5'
                : 'text-[#7A90A8] hover:text-[#E8EDF5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Folders Designated', value: driveState.folders?.length || 0, color: '#D4A843' },
                { label: 'Files Indexed', value: driveState.totalFiles || 0, color: '#4A90D9' },
                { label: 'Total Chunks', value: (driveState.totalChunks || 0).toLocaleString(), color: '#3DAA6E' },
                { label: 'Sync Status', value: driveState.syncStatus === 'syncing' ? 'Syncing' : 'Idle', color: driveState.syncStatus === 'syncing' ? '#D4A843' : '#3DAA6E' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0D1B2E] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold" style={{ color: stat.color, fontFamily: 'Georgia, serif' }}>{stat.value}</p>
                  <p className="text-xs text-[#7A90A8] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="bg-[#0D1B2E] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">How Drive Integration Works</p>
              <div className="space-y-2">
                {[
                  { step: '1', title: 'OAuth 2.0 Authorization', desc: 'Connect with your CGS corporate Google account. Only files you have access to are retrievable.' },
                  { step: '2', title: 'Folder Designation', desc: 'Designate folders as Firm Library (reusable IP) or Client Folder (engagement-specific files).' },
                  { step: '3', title: 'Automatic Ingestion', desc: 'Files are parsed, chunked, metadata-tagged, and indexed into the pgvector knowledge base.' },
                  { step: '4', title: 'Scheduled Re-sync', desc: 'Updated Drive files are automatically re-indexed on a scheduled sync to keep the knowledge base current.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#D4A843]/20 text-[#D4A843] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="text-xs font-medium text-[#E8EDF5]">{item.title}</p>
                      <p className="text-xs text-[#7A90A8] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported File Types */}
            <div>
              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">Supported File Types</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Google Docs', color: 'bg-blue-500/20 text-blue-400' },
                  { label: 'Google Slides', color: 'bg-yellow-500/20 text-yellow-400' },
                  { label: 'Google Sheets', color: 'bg-green-500/20 text-green-400' },
                  { label: 'PDF', color: 'bg-red-500/20 text-red-400' },
                  { label: 'DOCX', color: 'bg-blue-400/20 text-blue-300' },
                  { label: 'PPTX', color: 'bg-orange-500/20 text-orange-400' },
                  { label: 'XLSX', color: 'bg-green-400/20 text-green-300' },
                ].map((ft) => (
                  <span key={ft.label} className={`text-xs px-2.5 py-1 rounded-full font-medium ${ft.color}`}>{ft.label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Folders Tab */}
        {activeTab === 'folders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#7A90A8]">Designated folders are automatically ingested and re-indexed on sync.</p>
              <button className="flex items-center gap-1.5 text-xs text-[#D4A843] hover:text-[#c49a3a] transition-colors">
                <Settings className="w-3 h-3" />
                Manage
              </button>
            </div>
            {driveState.folders?.map((folder) => (
              <div key={folder.id} className="bg-[#0D1B2E] border border-[#1F3550] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#1F3550]/20 transition-all duration-200"
                >
                  <FolderOpen className="w-4 h-4 text-[#D4A843] flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-[#E8EDF5] truncate">{folder.name}</p>
                    <p className="text-xs text-[#7A90A8] truncate">{folder.path}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {folder.designation && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DESIGNATION_STYLE[folder.designation].color}`}>
                        {DESIGNATION_STYLE[folder.designation].label}
                      </span>
                    )}
                    <span className="text-xs text-[#7A90A8]">{folder.fileCount} files</span>
                    {expandedFolders.has(folder.id) ? (
                      <ChevronDown className="w-4 h-4 text-[#7A90A8]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#7A90A8]" />
                    )}
                  </div>
                </button>
                {expandedFolders.has(folder.id) && (
                  <div className="border-t border-[#1F3550] px-4 py-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#152338] rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-[#E8EDF5]">{folder.fileCount}</p>
                        <p className="text-xs text-[#7A90A8]">Files</p>
                      </div>
                      <div className="bg-[#152338] rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-[#3DAA6E]">Indexed</p>
                        <p className="text-xs text-[#7A90A8]">Status</p>
                      </div>
                    </div>
                    {folder.lastSynced && (
                      <p className="text-xs text-[#7A90A8]">
                        Last synced: {formatDate(folder.lastSynced)} at {formatTime(folder.lastSynced)}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          toast.success('Folder sync queued', { description: `${folder.name} will be re-indexed shortly.` });
                        }}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#4A90D9]/15 text-[#4A90D9] border border-[#4A90D9]/30 hover:bg-[#4A90D9]/25 transition-all duration-200"
                      >
                        <RefreshCw className="w-3 h-3" /> Re-sync
                      </button>
                      <button
                        onClick={() => {
                          toast.info('Folder browser', { description: 'Opening Drive folder browser...' });
                        }}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-[#1F3550] text-[#7A90A8] hover:text-[#E8EDF5] transition-all duration-200"
                      >
                        <Eye className="w-3 h-3" /> Browse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recent Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-2">
            <p className="text-xs text-[#7A90A8] mb-3">Recently modified files across all designated folders.</p>
            {driveState.recentFiles?.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-[#0D1B2E] border border-[#1F3550] rounded-lg hover:border-[#D4A843]/20 transition-all duration-200">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${FILE_TYPE_ICONS[file.type]?.color || 'bg-[#1F3550] text-[#7A90A8]'}`}>
                  {FILE_TYPE_ICONS[file.type]?.label || file.type.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#E8EDF5] truncate">{file.name}</p>
                  <p className="text-xs text-[#7A90A8] truncate">{file.path}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-right">
                  {file.ingestionStatus === 'indexed' ? (
                    <span className="flex items-center gap-1 text-xs text-[#3DAA6E]">
                      <CheckCircle className="w-3 h-3" />
                      {file.chunkCount} chunks
                    </span>
                  ) : file.ingestionStatus === 'pending' ? (
                    <span className="flex items-center gap-1 text-xs text-[#D4A843]">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#E05252]">
                      <AlertCircle className="w-3 h-3" /> Failed
                    </span>
                  )}
                  <span className="text-xs text-[#7A90A8]">{formatDate(file.modifiedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sync Log Tab */}
        {activeTab === 'sync' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#7A90A8]">Recent sync job history across all designated folders.</p>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#D4A843]/15 text-[#D4A843] border border-[#D4A843]/30 hover:bg-[#D4A843]/25 transition-all duration-200 disabled:opacity-60"
              >
                <Zap className="w-3 h-3" />
                {syncing ? 'Running...' : 'Run Full Sync'}
              </button>
            </div>
            {syncJobs.map((job) => (
              <div key={job.id} className="bg-[#0D1B2E] border border-[#1F3550] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#D4A843]" />
                    <p className="text-sm font-medium text-[#E8EDF5]">{job.folderName}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    job.status === 'completed' ? 'bg-[#3DAA6E]/20 text-[#3DAA6E]'
                    : job.status === 'running' ? 'bg-[#D4A843]/20 text-[#D4A843]'
                    : job.status === 'failed' ? 'bg-[#E05252]/20 text-[#E05252]'
                    : 'bg-[#1F3550] text-[#7A90A8]'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-sm font-bold text-[#E8EDF5]">{job.filesProcessed || 0}</p>
                    <p className="text-xs text-[#7A90A8]">Files</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#4A90D9]">{(job.chunksCreated || 0).toLocaleString()}</p>
                    <p className="text-xs text-[#7A90A8]">Chunks</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#3DAA6E]">
                      {job.completedAt && job.startedAt
                        ? `${Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)}s`
                        : '—'}
                    </p>
                    <p className="text-xs text-[#7A90A8]">Duration</p>
                  </div>
                </div>
                <p className="text-xs text-[#7A90A8] mt-2">
                  Started {formatDate(job.startedAt)} at {formatTime(job.startedAt)}
                  {job.completedAt && ` · Completed ${formatTime(job.completedAt)}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
