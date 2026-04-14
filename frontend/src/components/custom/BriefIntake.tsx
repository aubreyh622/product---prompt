import { useState } from 'react';
import type { EngagementBrief, EngagementArchetype, UrgencyLevel, KnowledgeAsset, DriveConnectionStatus } from '@shared/types/api';
import { DEMO_SCENARIOS, SCENARIO_LABELS } from '@/lib/mockData';
import { classifyBrief, type ClassificationResult } from '@/lib/engagementApi';
import { Zap, CheckCircle, Clock, AlertCircle, FolderOpen, Library, Wifi, RefreshCw, Brain, Loader2 } from 'lucide-react';

interface BriefIntakeProps {
  onActivate: (brief: EngagementBrief) => void;
}

const INDUSTRIES = [
  { value: 'industrial', label: 'Industrial Manufacturing' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'enterprise-tech', label: 'Enterprise Technology' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare' },
];

const ARCHETYPES = Object.keys(SCENARIO_LABELS) as EngagementArchetype[];

const FIRM_LIBRARY_ASSETS: KnowledgeAsset[] = [
  { id: 'fl1', name: 'AI Maturity Ladder v3.2', fileType: 'PPTX', sourceType: 'firm_library', assetTag: 'Flagship', archetypeTags: ['ai_transformation'], lastIndexed: '2026-04-10T09:00:00Z', lastModified: '2026-03-28T14:00:00Z', ingestionStatus: 'indexed', chunkCount: 42, version: 3 },
  { id: 'fl2', name: 'Delivery Excellence Framework', fileType: 'DOCX', sourceType: 'firm_library', assetTag: 'Flagship', archetypeTags: ['delivery_standardization'], lastIndexed: '2026-04-10T09:00:00Z', lastModified: '2026-03-15T10:00:00Z', ingestionStatus: 'indexed', chunkCount: 67, version: 2 },
  { id: 'fl3', name: 'Program Recovery Diagnostic', fileType: 'DOCX', sourceType: 'firm_library', assetTag: 'Flagship', archetypeTags: ['execution_stall'], lastIndexed: '2026-04-10T09:00:00Z', lastModified: '2026-02-20T11:00:00Z', ingestionStatus: 'indexed', chunkCount: 38, version: 1 },
  { id: 'fl4', name: 'Operating Model Design Canvas', fileType: 'PPTX', sourceType: 'firm_library', assetTag: 'Core', archetypeTags: ['operating_model'], lastIndexed: '2026-04-09T08:00:00Z', lastModified: '2026-01-30T09:00:00Z', ingestionStatus: 'indexed', chunkCount: 55, version: 2 },
  { id: 'fl5', name: 'Stakeholder Alignment Diagnostic', fileType: 'DOCX', sourceType: 'firm_library', assetTag: 'Flagship', archetypeTags: ['sponsor_misalignment'], lastIndexed: '2026-04-09T08:00:00Z', lastModified: '2026-03-01T12:00:00Z', ingestionStatus: 'indexed', chunkCount: 29, version: 1 },
  { id: 'fl6', name: 'CGS Governance Rules & Standards', fileType: 'PDF', sourceType: 'firm_library', assetTag: 'Governance', lastIndexed: '2026-04-08T07:00:00Z', lastModified: '2026-01-01T00:00:00Z', ingestionStatus: 'indexed', chunkCount: 91, version: 4 },
  { id: 'fl7', name: 'Change Readiness Diagnostic', fileType: 'DOCX', sourceType: 'firm_library', assetTag: 'Method', lastIndexed: '2026-04-07T06:00:00Z', lastModified: '2025-12-10T08:00:00Z', ingestionStatus: 'stale', chunkCount: 22, version: 1 },
  { id: 'fl8', name: 'RACI Redesign Methodology', fileType: 'XLSX', sourceType: 'firm_library', assetTag: 'Core', archetypeTags: ['operating_model'], lastIndexed: '2026-04-10T09:00:00Z', lastModified: '2026-02-14T15:00:00Z', ingestionStatus: 'indexed', chunkCount: 18, version: 2 },
];

const CLIENT_FOLDER_ASSETS: KnowledgeAsset[] = [
  { id: 'cf1', name: 'Client Engagement Brief - Q2 2026', fileType: 'DOCX', sourceType: 'client_folder', lastIndexed: '2026-04-12T16:00:00Z', lastModified: '2026-04-11T14:30:00Z', ingestionStatus: 'indexed', chunkCount: 12 },
  { id: 'cf2', name: 'Stakeholder Interview Notes - Wave 1', fileType: 'GDOC', sourceType: 'client_folder', lastIndexed: '2026-04-12T16:00:00Z', lastModified: '2026-04-10T09:15:00Z', ingestionStatus: 'indexed', chunkCount: 34 },
  { id: 'cf3', name: 'Current State Assessment - Operations', fileType: 'PPTX', sourceType: 'client_folder', lastIndexed: '2026-04-11T12:00:00Z', lastModified: '2026-04-08T17:00:00Z', ingestionStatus: 'indexed', chunkCount: 28 },
  { id: 'cf4', name: 'Reporting Baseline - FY2025', fileType: 'XLSX', sourceType: 'client_folder', lastIndexed: '2026-04-11T12:00:00Z', lastModified: '2026-04-05T10:00:00Z', ingestionStatus: 'indexed', chunkCount: 45 },
  { id: 'cf5', name: 'Executive Sponsor Alignment Notes', fileType: 'GDOC', sourceType: 'client_folder', lastIndexed: '2026-04-12T16:00:00Z', lastModified: '2026-04-12T08:00:00Z', ingestionStatus: 'pending', chunkCount: 0 },
  { id: 'cf6', name: 'IT Infrastructure Audit - Draft', fileType: 'PDF', sourceType: 'client_folder', lastIndexed: '2026-04-10T10:00:00Z', lastModified: '2026-04-09T16:00:00Z', ingestionStatus: 'indexed', chunkCount: 67 },
];

const DRIVE_STATUS: DriveConnectionStatus = {
  connected: true,
  account: 'aubrey@cgsadvisors.com',
  folderPath: 'CGS Engagements / Active / Q2 2026',
  lastSynced: '2026-04-13T07:45:00Z',
  fileCount: 6,
};

const ASSET_TAG_STYLE: Record<string, string> = {
  Flagship: 'bg-[#D4A843]/20 text-[#D4A843]',
  Core: 'bg-[#2D5282]/40 text-[#7A90A8]',
  Method: 'bg-[#1F3550] text-[#7A90A8]',
  Template: 'bg-purple-500/20 text-purple-400',
  Governance: 'bg-red-500/20 text-red-400',
};

const FILE_TYPE_STYLE: Record<string, string> = {
  DOCX: 'bg-blue-500/20 text-blue-400',
  PPTX: 'bg-orange-500/20 text-orange-400',
  XLSX: 'bg-green-500/20 text-green-400',
  PDF: 'bg-red-500/20 text-red-400',
  GDOC: 'bg-blue-400/20 text-blue-300',
  GSLIDE: 'bg-yellow-500/20 text-yellow-400',
  GSHEET: 'bg-green-400/20 text-green-300',
};

function IngestionBadge({ status }: { status: string }) {
  if (status === 'indexed') return <span className="flex items-center gap-1 text-xs text-[#3DAA6E]"><CheckCircle className="w-3 h-3" />Indexed</span>;
  if (status === 'pending') return <span className="flex items-center gap-1 text-xs text-[#D4A843]"><Clock className="w-3 h-3" />Pending</span>;
  if (status === 'stale') return <span className="flex items-center gap-1 text-xs text-[#D4A843]"><AlertCircle className="w-3 h-3" />Stale</span>;
  return <span className="flex items-center gap-1 text-xs text-[#E05252]"><AlertCircle className="w-3 h-3" />Failed</span>;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BriefIntake({ onActivate }: BriefIntakeProps) {
  const [brief, setBrief] = useState<EngagementBrief>({
    clientName: '',
    industry: '',
    objective: '',
    coreChallenge: '',
    timeline: '',
    urgency: 'standard',
  });
  const [selectedScenario, setSelectedScenario] = useState<EngagementArchetype | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [classifyError, setClassifyError] = useState<string | null>(null);

  const isComplete =
    brief.clientName.trim() !== '' &&
    brief.industry !== '' &&
    brief.objective.trim() !== '' &&
    brief.coreChallenge.trim() !== '' &&
    brief.timeline.trim() !== '';

  const completedCount = [
    brief.clientName.trim() !== '',
    brief.industry !== '',
    brief.objective.trim() !== '',
    brief.coreChallenge.trim() !== '',
    brief.timeline.trim() !== '',
  ].filter(Boolean).length;

  function loadScenario(archetype: EngagementArchetype) {
    setSelectedScenario(archetype);
    setBrief(DEMO_SCENARIOS[archetype]);
    setClassification(null);
    setClassifyError(null);
  }

  async function handleActivate() {
    if (!isComplete || classifying) return;
    setClassifying(true);
    setClassifyError(null);
    setClassification(null);
    try {
      const result = await classifyBrief(brief);
      setClassification(result);
      // Brief pause so the classification banner is legible before stepping forward.
      setTimeout(() => onActivate({ ...brief, archetype: result.archetype }), 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Classification failed';
      setClassifyError(message);
    } finally {
      setClassifying(false);
    }
  }

  function handleUrgency(urgency: UrgencyLevel) {
    setBrief((prev) => ({ ...prev, urgency }));
  }

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  }

  const indexedFirmCount = FIRM_LIBRARY_ASSETS.filter((a) => a.ingestionStatus === 'indexed').length;
  const indexedClientCount = CLIENT_FOLDER_ASSETS.filter((a) => a.ingestionStatus === 'indexed').length;

  return (
    <div className="space-y-6">
      {/* Demo Scenario Selector */}
      <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Quick Load — Demo Scenarios</h2>
          <span className="text-xs text-[#7A90A8] bg-[#1F3550]/50 px-2 py-1 rounded">Optional</span>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {ARCHETYPES.map((archetype) => (
            <button
              key={archetype}
              onClick={() => loadScenario(archetype)}
              className={`px-3 md:px-4 py-2 rounded-lg border text-xs md:text-sm font-medium transition-all duration-200 ${
                selectedScenario === archetype
                  ? 'border-[#D4A843]/50 bg-[#D4A843]/10 text-[#D4A843]'
                  : 'border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5]'
              }`}
            >
              {SCENARIO_LABELS[archetype]}
            </button>
          ))}
        </div>
      </div>

      {/* Brief Form */}
      <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5 md:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8] mb-6">Engagement Brief</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Client Name <span className="text-[#E05252]">*</span></label>
            <input
              type="text"
              placeholder="e.g. Meridian Industrial Group"
              value={brief.clientName}
              onChange={(e) => setBrief((p) => ({ ...p, clientName: e.target.value }))}
              className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Industry <span className="text-[#E05252]">*</span></label>
            <select
              value={brief.industry}
              onChange={(e) => setBrief((p) => ({ ...p, industry: e.target.value }))}
              className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Engagement Objective <span className="text-[#E05252]">*</span></label>
            <textarea
              rows={3}
              placeholder="Describe the primary goal of this engagement..."
              value={brief.objective}
              onChange={(e) => setBrief((p) => ({ ...p, objective: e.target.value }))}
              className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200 resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Core Challenge <span className="text-[#E05252]">*</span></label>
            <textarea
              rows={3}
              placeholder="What is the primary obstacle or problem to solve?"
              value={brief.coreChallenge}
              onChange={(e) => setBrief((p) => ({ ...p, coreChallenge: e.target.value }))}
              className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Engagement Timeline <span className="text-[#E05252]">*</span></label>
            <input
              type="text"
              placeholder="e.g. 16 weeks / Q2–Q3 2026"
              value={brief.timeline}
              onChange={(e) => setBrief((p) => ({ ...p, timeline: e.target.value }))}
              className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Urgency Level <span className="text-[#E05252]">*</span></label>
            <div className="flex gap-2 md:gap-3">
              {(['standard', 'high', 'critical'] as UrgencyLevel[]).map((level) => (
                <label
                  key={level}
                  className={`flex-1 flex items-center gap-2 px-3 py-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    brief.urgency === level
                      ? level === 'critical'
                        ? 'border-[#E05252]/50 bg-[#E05252]/10'
                        : level === 'high'
                        ? 'border-[#D4A843]/50 bg-[#D4A843]/10'
                        : 'border-[#3DAA6E]/50 bg-[#3DAA6E]/10'
                      : 'border-[#1F3550] hover:border-[#D4A843]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={brief.urgency === level}
                    onChange={() => handleUrgency(level)}
                    className="accent-[#D4A843]"
                  />
                  <span
                    className={`text-xs md:text-sm font-medium capitalize ${
                      brief.urgency === level
                        ? level === 'critical' ? 'text-[#E05252]' : level === 'high' ? 'text-[#D4A843]' : 'text-[#3DAA6E]'
                        : 'text-[#7A90A8]'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-[#1F3550] gap-4">
          {/* Archetype Classification — live AI */}
          {classifying && (
            <div className="flex items-center gap-3 p-3 bg-[#0D1B2E] border border-[#D4A843]/20 rounded-xl flex-1">
              <div className="w-8 h-8 rounded-lg bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-[#D4A843] animate-spin" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#D4A843]">Classifying engagement…</p>
                <p className="text-xs text-[#7A90A8] truncate">AI is matching your brief against CGS archetypes</p>
              </div>
            </div>
          )}
          {!classifying && classification && (
            <div className="flex items-center gap-3 p-3 bg-[#0D1B2E] border border-[#D4A843]/20 rounded-xl flex-1">
              <div className="w-8 h-8 rounded-lg bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-[#D4A843]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#D4A843]">Classified: {SCENARIO_LABELS[classification.archetype]}</p>
                  <span className="text-xs text-[#3DAA6E] font-bold">{classification.confidence}%</span>
                </div>
                <p className="text-xs text-[#7A90A8] truncate">{classification.reasoning}</p>
              </div>
            </div>
          )}
          {!classifying && !classification && classifyError && (
            <div className="flex items-center gap-3 p-3 bg-[#0D1B2E] border border-[#E05252]/30 rounded-xl flex-1">
              <AlertCircle className="w-4 h-4 text-[#E05252] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#E05252]">Classification failed</p>
                <p className="text-xs text-[#7A90A8] truncate">{classifyError}</p>
              </div>
            </div>
          )}
          {!classifying && !classification && !classifyError && (
            <p className="text-xs text-[#7A90A8]">
              {isComplete
                ? <span className="text-[#3DAA6E]">All 5 required fields completed</span>
                : `${completedCount} of 5 required fields completed`}
            </p>
          )}
          <button
            onClick={handleActivate}
            disabled={!isComplete || classifying}
            className={`flex items-center gap-2 px-5 md:px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg ${
              isComplete && !classifying
                ? 'bg-[#D4A843] text-[#0D1B2E] hover:bg-[#c49a3a] hover:scale-[1.02] cursor-pointer'
                : 'bg-[#1F3550] text-[#7A90A8] cursor-not-allowed'
            }`}
          >
            {classifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {classifying ? 'Classifying…' : 'Activate Knowledge Base'}
          </button>
        </div>
      </div>

      {/* Dual Knowledge Source Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Firm Library Panel */}
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#1F3550]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-[#D4A843]" />
                <h3 className="font-semibold text-[#E8EDF5] text-sm">Firm Library</h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20">
                {indexedFirmCount}/{FIRM_LIBRARY_ASSETS.length} indexed
              </span>
            </div>
            <p className="text-xs text-[#7A90A8]">Curated CGS frameworks, governance rules, archetype notes, and reusable templates</p>
          </div>
          <div className="divide-y divide-[#1F3550] max-h-72 overflow-y-auto">
            {FIRM_LIBRARY_ASSETS.map((asset) => (
              <div key={asset.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#1F3550]/20 transition-all duration-150">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${FILE_TYPE_STYLE[asset.fileType] || 'bg-[#1F3550] text-[#7A90A8]'}`}>
                  {asset.fileType}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#E8EDF5] truncate">{asset.name}</p>
                  <p className="text-xs text-[#7A90A8]">{asset.chunkCount} chunks · v{asset.version} · {formatDate(asset.lastIndexed)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {asset.assetTag && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ASSET_TAG_STYLE[asset.assetTag]}`}>
                      {asset.assetTag}
                    </span>
                  )}
                  <IngestionBadge status={asset.ingestionStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Client Folder Panel */}
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#1F3550]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#3DAA6E]" />
                <h3 className="font-semibold text-[#E8EDF5] text-sm">Current Client Folder</h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[#3DAA6E]/10 text-[#3DAA6E] border border-[#3DAA6E]/20">
                {indexedClientCount}/{CLIENT_FOLDER_ASSETS.length} indexed
              </span>
            </div>
            {/* Drive Connection Status */}
            <div className="flex items-center gap-2 mt-2 p-2 bg-[#0D1B2E] rounded-lg">
              <Wifi className={`w-3 h-3 flex-shrink-0 ${DRIVE_STATUS.connected ? 'text-[#3DAA6E]' : 'text-[#E05252]'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#E8EDF5] truncate">{DRIVE_STATUS.account}</p>
                <p className="text-xs text-[#7A90A8] truncate">{DRIVE_STATUS.folderPath}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[#3DAA6E] font-medium">Connected</p>
                <p className="text-xs text-[#7A90A8]">Synced {DRIVE_STATUS.lastSynced ? formatDate(DRIVE_STATUS.lastSynced) : 'N/A'}</p>
              </div>
              <button
                onClick={handleSync}
                className="ml-1 p-1 rounded hover:bg-[#1F3550] transition-all duration-200"
                title="Sync now"
              >
                <RefreshCw className={`w-3 h-3 text-[#7A90A8] ${syncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="divide-y divide-[#1F3550] max-h-72 overflow-y-auto">
            {CLIENT_FOLDER_ASSETS.map((asset) => (
              <div key={asset.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#1F3550]/20 transition-all duration-150">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${FILE_TYPE_STYLE[asset.fileType] || 'bg-[#1F3550] text-[#7A90A8]'}`}>
                  {asset.fileType}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#E8EDF5] truncate">{asset.name}</p>
                  <p className="text-xs text-[#7A90A8]">
                    {asset.chunkCount > 0 ? `${asset.chunkCount} chunks` : 'Processing'} · Modified {formatDate(asset.lastModified)}
                  </p>
                </div>
                <IngestionBadge status={asset.ingestionStatus} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
