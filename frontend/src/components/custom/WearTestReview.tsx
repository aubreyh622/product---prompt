import { useState, useMemo } from 'react';
import type {
  WearTestData,
  ReviewFlag,
  FlagStatus,
  FeedbackItem,
  SessionMemory,
  ReviewSummary,
  ReusablePreference,
} from '@shared/types/api';
import { Download, Send, CheckCircle, AlertTriangle, MessageSquare, RotateCcw, ChevronDown, ChevronUp, Sparkles, Brain, RefreshCw, FileText, Library, FolderOpen, HardDrive, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface WearTestReviewProps {
  data: WearTestData;
  clientName: string;
}

const SEVERITY_STYLE: Record<string, string> = {
  High: 'bg-[#E05252]/20 text-[#E05252] border-[#E05252]/30',
  Medium: 'bg-[#D4A843]/20 text-[#D4A843] border-[#D4A843]/30',
  Low: 'bg-[#3DAA6E]/20 text-[#3DAA6E] border-[#3DAA6E]/30',
};

const LOCAL_EXPORT_FILES = [
  { format: 'DOCX', name: 'Problem Statement.docx', color: 'bg-blue-500/20 text-blue-400' },
  { format: 'PDF', name: 'Issue Tree.pdf', color: 'bg-red-500/20 text-red-400' },
  { format: 'PPTX', name: 'Roadmap.pptx', color: 'bg-orange-500/20 text-orange-400' },
  { format: 'DOCX', name: 'Exec Summary.docx', color: 'bg-blue-500/20 text-blue-400' },
  { format: 'XLSX', name: 'Workplan.xlsx', color: 'bg-green-500/20 text-green-400' },
  { format: 'PDF', name: 'Source Grounding Appendix.pdf', color: 'bg-purple-500/20 text-purple-400' },
];

const WORKSPACE_EXPORT_FILES = [
  { format: 'GDOC', name: 'Problem Statement', icon: 'DOC', color: 'bg-blue-500/20 text-blue-400', section: 'Problem Statement' },
  { format: 'GSLIDE', name: 'Engagement Deck', icon: 'SLIDE', color: 'bg-yellow-500/20 text-yellow-400', section: 'Deck Outline' },
  { format: 'GSHEET', name: 'Workplan & RACI', icon: 'SHEET', color: 'bg-green-500/20 text-green-400', section: 'Workstreams' },
  { format: 'GDOC', name: 'Executive Summary', icon: 'DOC', color: 'bg-blue-400/20 text-blue-300', section: 'Exec Summary' },
  { format: 'GSLIDE', name: 'Roadmap Slides', icon: 'SLIDE', color: 'bg-yellow-400/20 text-yellow-300', section: '30/60/90 Roadmap' },
  { format: 'GDOC', name: 'Source Grounding Appendix', icon: 'DOC', color: 'bg-purple-500/20 text-purple-400', section: 'All Sections' },
];

const REUSABLE_PREFERENCES: ReusablePreference[] = [
  { id: 'rp1', label: 'Reduce overclaiming', description: 'Flag unsupported causal claims and unverified statistics', appliedCount: 0 },
  { id: 'rp2', label: 'Client-specific evidence', description: 'Prioritize client data over analogous engagement benchmarks', appliedCount: 0 },
  { id: 'rp3', label: 'Stakeholder ownership clarity', description: 'Ensure every recommendation has a named owner', appliedCount: 0 },
  { id: 'rp4', label: 'Conservative timeline estimates', description: 'Add buffer to aggressive milestone commitments', appliedCount: 0 },
];

function confidenceColor(score: number) {
  return score >= 85 ? '#3DAA6E' : score >= 70 ? '#D4A843' : '#E05252';
}

function generateReviewSummary(flags: ReviewFlag[], feedbackItems: FeedbackItem[], clientName: string): ReviewSummary {
  const approved = flags.filter((f) => f.status === 'approved').length;
  const feedbackLogged = flags.filter((f) => f.status === 'feedback').length;
  const escalated = flags.filter((f) => f.status === 'escalated').length;

  return {
    sessionDecisionOverview: {
      totalFlags: flags.length,
      approved,
      feedbackLogged,
      escalated,
    },
    updatedConsultantSummary: `Review cycle complete for ${clientName} engagement. ${approved} flags validated, ${feedbackLogged} revision directives logged, and ${escalated} items escalated for senior review. Session feedback has been applied to refine the starter pack sections with the highest revision priority.`,
    revisedStarterPackHighlights: [
      feedbackItems.length > 0 ? `${feedbackItems.length} section(s) revised based on consultant feedback` : 'No revisions required — all flags approved as-is',
      escalated > 0 ? `${escalated} high-risk item(s) queued for senior reviewer validation` : 'No escalations — pack is ready for consultant use',
      'Source grounding verified across all generated sections',
      'Confidence scores updated to reflect review decisions',
    ],
    activeSessionPreferences: feedbackItems.slice(0, 3).map((fi) => fi.text.slice(0, 60) + (fi.text.length > 60 ? '...' : '')),
    recommendedNextStep:
      escalated > 0
        ? 'Send to Senior Reviewer for validation of escalated items before client-facing use.'
        : feedbackLogged > 0
        ? 'Review revised sections and export the updated starter pack for engagement kickoff.'
        : 'All flags resolved. Export the starter pack and proceed to engagement kickoff.',
  };
}

function ExportPanel({ clientName, onExport, onSendReview }: { clientName: string; onExport: () => void; onSendReview: () => void }) {
  const [exportMode, setExportMode] = useState<'local' | 'workspace'>('workspace');
  const [exportingWorkspace, setExportingWorkspace] = useState(false);
  const [exportedFiles, setExportedFiles] = useState<Set<string>>(new Set());
  const [saveToGDrive, setSaveToGDrive] = useState(true);
  const [includeGrounding, setIncludeGrounding] = useState(true);
  const [driveFolder] = useState('CGS Engagements / Active / Q2 2026');

  function handleWorkspaceExport() {
    setExportingWorkspace(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setExportedFiles((prev) => new Set([...prev, WORKSPACE_EXPORT_FILES[count - 1]?.name || '']));
      if (count >= WORKSPACE_EXPORT_FILES.length) {
        clearInterval(interval);
        setExportingWorkspace(false);
        toast.success('Google Workspace export complete', {
          description: `${WORKSPACE_EXPORT_FILES.length} files created in Google Drive${saveToGDrive ? ` · Saved to ${driveFolder}` : ''}.`,
        });
      }
    }, 400);
  }

  return (
    <div className="p-5 space-y-4">
      {/* Mode Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-[#1F3550]">
        <button
          onClick={() => setExportMode('workspace')}
          className={`flex-1 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
            exportMode === 'workspace'
              ? 'bg-[#4A90D9]/15 text-[#4A90D9] border-r border-[#1F3550]'
              : 'text-[#7A90A8] hover:text-[#E8EDF5] border-r border-[#1F3550]'
          }`}
        >
          <HardDrive className="w-3 h-3" />
          Google Workspace
        </button>
        <button
          onClick={() => setExportMode('local')}
          className={`flex-1 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
            exportMode === 'local'
              ? 'bg-[#D4A843]/15 text-[#D4A843]'
              : 'text-[#7A90A8] hover:text-[#E8EDF5]'
          }`}
        >
          <Download className="w-3 h-3" />
          Local Download
        </button>
      </div>

      {/* Google Workspace Export */}
      {exportMode === 'workspace' && (
        <div className="space-y-3">
          {/* Drive Save Option */}
          <div className="flex items-center justify-between p-3 bg-[#0D1B2E] rounded-lg">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#4A90D9]" />
              <div>
                <p className="text-xs font-medium text-[#E8EDF5]">Auto-save to Google Drive</p>
                <p className="text-xs text-[#7A90A8] truncate max-w-[160px]">{driveFolder}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={saveToGDrive}
                onChange={(e) => setSaveToGDrive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#1F3550] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A90D9]"></div>
            </label>
          </div>

          {/* Grounding Appendix Option */}
          <div className="flex items-center justify-between p-3 bg-[#0D1B2E] rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7A90A8]" />
              <div>
                <p className="text-xs font-medium text-[#E8EDF5]">Include Grounding Appendix</p>
                <p className="text-xs text-[#7A90A8]">Auditable chunk citations per section</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeGrounding}
                onChange={(e) => setIncludeGrounding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#1F3550] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3DAA6E]"></div>
            </label>
          </div>

          {/* Workspace Files */}
          <div className="space-y-1.5">
            {WORKSPACE_EXPORT_FILES.map((file) => (
              <div
                key={file.name}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                  exportedFiles.has(file.name)
                    ? 'bg-[#3DAA6E]/10 border-[#3DAA6E]/30'
                    : 'bg-[#0D1B2E] border-[#1F3550]'
                }`}
              >
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${file.color}`}>{file.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#E8EDF5] truncate">{file.name}</p>
                  <p className="text-xs text-[#7A90A8]">{file.section}</p>
                </div>
                {exportedFiles.has(file.name) ? (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-[#3DAA6E]" />
                    <ExternalLink className="w-3 h-3 text-[#4A90D9] cursor-pointer" />
                  </div>
                ) : exportingWorkspace ? (
                  <div className="w-3.5 h-3.5 border border-[#D4A843] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <HardDrive className="w-3.5 h-3.5 text-[#7A90A8] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleWorkspaceExport}
            disabled={exportingWorkspace}
            className="w-full py-3 bg-[#4A90D9] text-white font-semibold text-sm rounded-lg hover:bg-[#3a7bc8] hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {exportingWorkspace ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating in Google Workspace...</>
            ) : (
              <><HardDrive className="w-4 h-4" /> Export to Google Workspace</>
            )}
          </button>
        </div>
      )}

      {/* Local Download */}
      {exportMode === 'local' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            {LOCAL_EXPORT_FILES.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D1B2E] border border-[#1F3550] hover:border-[#D4A843]/30 transition-all duration-200 cursor-pointer"
                onClick={onExport}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${file.color}`}>{file.format}</span>
                  <span className="text-xs text-[#E8EDF5]">{file.name}</span>
                </div>
                <Download className="w-4 h-4 text-[#7A90A8]" />
              </div>
            ))}
          </div>
          <button
            onClick={onExport}
            className="w-full py-3 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] hover:scale-[1.01] transition-all duration-200"
          >
            Download All Files
          </button>
        </div>
      )}

      {/* Send to Reviewer */}
      <button
        onClick={onSendReview}
        className="w-full py-2.5 border border-[#1F3550] text-[#7A90A8] text-sm rounded-lg hover:border-[#D4A843]/40 hover:text-[#E8EDF5] transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        Send to Senior Reviewer
      </button>

      {/* Grounding Note */}
      <div className="p-3 bg-[#0D1B2E] rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-3 h-3 text-[#7A90A8]" />
          <p className="text-xs font-semibold text-[#7A90A8]">Source Grounding Appendix</p>
        </div>
        <p className="text-xs text-[#7A90A8] leading-relaxed">All exports include a grounding appendix listing retrieved chunks and Drive files that informed each section — fully auditable and defensible.</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <Library className="w-3 h-3 text-[#D4A843]" />
            <span className="text-xs text-[#D4A843]">Firm Library</span>
          </div>
          <div className="flex items-center gap-1">
            <FolderOpen className="w-3 h-3 text-[#3DAA6E]" />
            <span className="text-xs text-[#3DAA6E]">Client Folder</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WearTestReview({ data, clientName }: WearTestReviewProps) {
  const [flags, setFlags] = useState<ReviewFlag[]>(data.flags);
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [openFeedbackId, setOpenFeedbackId] = useState<string | null>(null);
  const [sessionMemory, setSessionMemory] = useState<SessionMemory>({
    feedbackItems: [],
    reusablePreferences: REUSABLE_PREFERENCES,
    appliedInNextIteration: [],
  });
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const pending = flags.filter((f) => f.status === 'pending').length;
  const approved = flags.filter((f) => f.status === 'approved').length;
  const feedbackCount = flags.filter((f) => f.status === 'feedback').length;
  const escalated = flags.filter((f) => f.status === 'escalated').length;

  const allResolved = pending === 0;

  // Sections marked as updated from feedback
  const updatedSections = useMemo(() => {
    return [...new Set(sessionMemory.feedbackItems.map((fi) => fi.section))];
  }, [sessionMemory.feedbackItems]);

  // Diagnostic workplan sections that get updated from feedback
  const diagnosticWorkplanUpdated = useMemo(() => {
    return sessionMemory.feedbackItems.length > 0;
  }, [sessionMemory.feedbackItems]);

  const storylineUpdated = useMemo(() => {
    return sessionMemory.feedbackItems.some((fi) =>
      fi.section === 'Problem Statement' || fi.section === 'Exec Summary' || fi.section === 'Issue Tree'
    );
  }, [sessionMemory.feedbackItems]);

  const riskChecklistUpdated = useMemo(() => {
    return sessionMemory.feedbackItems.some((fi) =>
      fi.section === 'Workstreams' || fi.section === 'Roadmap'
    );
  }, [sessionMemory.feedbackItems]);

  function updateFlag(id: string, status: FlagStatus) {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, status, validatedBy: 'You' } : f)));
  }

  function openFeedback(id: string) {
    setOpenFeedbackId((prev) => (prev === id ? null : id));
    if (!feedbackInputs[id]) {
      const flag = flags.find((f) => f.id === id);
      setFeedbackInputs((prev) => ({ ...prev, [id]: flag?.feedbackText || '' }));
    }
  }

  function saveFeedback(flag: ReviewFlag) {
    const text = feedbackInputs[flag.id]?.trim();
    if (!text) return;

    const now = new Date().toISOString();
    const newFeedbackItem: FeedbackItem = {
      id: `fb_${flag.id}_${now}`,
      flagId: flag.id,
      flagTitle: flag.title,
      section: flag.section,
      text,
      savedAt: now,
      appliedInRevision: true,
    };

    // Update flag status to feedback
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flag.id ? { ...f, status: 'feedback' as FlagStatus, feedbackText: text, feedbackSavedAt: now, validatedBy: 'You' } : f
      )
    );

    // Update session memory
    setSessionMemory((prev) => {
      const updatedPrefs = prev.reusablePreferences.map((rp) => {
        const matched =
          text.toLowerCase().includes('overclaim') && rp.id === 'rp1' ||
          text.toLowerCase().includes('client') && rp.id === 'rp2' ||
          text.toLowerCase().includes('owner') && rp.id === 'rp3' ||
          text.toLowerCase().includes('timeline') && rp.id === 'rp4';
        return matched ? { ...rp, appliedCount: rp.appliedCount + 1 } : rp;
      });

      return {
        feedbackItems: [...prev.feedbackItems, newFeedbackItem],
        reusablePreferences: updatedPrefs,
        appliedInNextIteration: [...prev.appliedInNextIteration, flag.section],
      };
    });

    setOpenFeedbackId(null);
    toast.success('Feedback saved', { description: `Revision guidance captured for "${flag.section}" section.` });
  }

  function undoFeedback(flagId: string) {
    // Recompute: remove feedback item, revert flag to pending
    const flag = flags.find((f) => f.id === flagId);
    if (!flag) return;

    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId ? { ...f, status: 'pending' as FlagStatus, feedbackText: undefined, feedbackSavedAt: undefined, validatedBy: undefined } : f
      )
    );

    setSessionMemory((prev) => {
      const removedItems = prev.feedbackItems.filter((fi) => fi.flagId === flagId);
      const removedSections = removedItems.map((fi) => fi.section);

      // Recompute preferences
      const updatedPrefs = prev.reusablePreferences.map((rp) => {
        const removedCount = removedItems.filter((fi) => {
          const t = fi.text.toLowerCase();
          return (
            (t.includes('overclaim') && rp.id === 'rp1') ||
            (t.includes('client') && rp.id === 'rp2') ||
            (t.includes('owner') && rp.id === 'rp3') ||
            (t.includes('timeline') && rp.id === 'rp4')
          );
        }).length;
        return { ...rp, appliedCount: Math.max(0, rp.appliedCount - removedCount) };
      });

      return {
        feedbackItems: prev.feedbackItems.filter((fi) => fi.flagId !== flagId),
        reusablePreferences: updatedPrefs,
        appliedInNextIteration: prev.appliedInNextIteration.filter((s) => !removedSections.includes(s)),
      };
    });

    setFeedbackInputs((prev) => ({ ...prev, [flagId]: '' }));
    toast.info('Feedback undone', { description: 'Session memory recomputed. Flag returned to pending.' });
  }

  function handleGenerateSummary() {
    if (!allResolved) return;
    setGeneratingSummary(true);
    setTimeout(() => {
      const summary = generateReviewSummary(flags, sessionMemory.feedbackItems, clientName);
      setReviewSummary(summary);
      setSummaryExpanded(true);
      setGeneratingSummary(false);
      toast.success('Review summary generated', { description: 'Session-level consolidated summary is ready.' });
    }, 1400);
  }

  function handleExport() {
    toast.success('Starter Pack exported', { description: `${LOCAL_EXPORT_FILES.length} files downloaded for ${clientName} — includes Source Grounding Appendix with all retrieved chunk citations.` });
  }

  function handleSendReview() {
    toast.success('Sent to Senior Reviewer', { description: 'The starter pack has been queued for senior validation.' });
  }

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#152338] border border-[#D4A843]/30 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#D4A843]" style={{ fontFamily: 'Georgia, serif' }}>{pending}</p>
          <p className="text-xs text-[#7A90A8] uppercase tracking-wide mt-1">Pending</p>
        </div>
        <div className="bg-[#152338] border border-[#3DAA6E]/30 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#3DAA6E]" style={{ fontFamily: 'Georgia, serif' }}>{approved}</p>
          <p className="text-xs text-[#7A90A8] uppercase tracking-wide mt-1">Approved</p>
        </div>
        <div className="bg-[#152338] border border-[#4A90D9]/30 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#4A90D9]" style={{ fontFamily: 'Georgia, serif' }}>{feedbackCount}</p>
          <p className="text-xs text-[#7A90A8] uppercase tracking-wide mt-1">Feedback</p>
        </div>
        <div className="bg-[#152338] border border-[#E05252]/30 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#E05252]" style={{ fontFamily: 'Georgia, serif' }}>{escalated}</p>
          <p className="text-xs text-[#7A90A8] uppercase tracking-wide mt-1">Escalated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Flags */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Review Flags</h3>
            {updatedSections.length > 0 && (
              <span className="text-xs text-[#4A90D9] bg-[#4A90D9]/10 border border-[#4A90D9]/30 px-2 py-1 rounded-full">
                {updatedSections.length} section(s) revised
              </span>
            )}
          </div>

          {flags.map((flag) => (
            <div
              key={flag.id}
              className={`bg-[#152338] rounded-xl border transition-all duration-200 ${
                flag.status === 'approved'
                  ? 'border-[#3DAA6E]/20 opacity-80'
                  : flag.status === 'feedback'
                  ? 'border-[#4A90D9]/40'
                  : flag.status === 'escalated'
                  ? 'border-[#E05252]/30'
                  : flag.severity === 'High'
                  ? 'border-[#E05252]/30'
                  : 'border-[#D4A843]/20'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {flag.status === 'approved' ? (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-[#3DAA6E]/20 text-[#3DAA6E] uppercase tracking-wide">Approved</span>
                    ) : flag.status === 'feedback' ? (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-[#4A90D9]/20 text-[#4A90D9] uppercase tracking-wide">Feedback Logged</span>
                    ) : flag.status === 'escalated' ? (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-[#E05252]/20 text-[#E05252] uppercase tracking-wide">Escalated</span>
                    ) : (
                      <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wide ${SEVERITY_STYLE[flag.severity]}`}>
                        {flag.severity}
                      </span>
                    )}
                    <span className="text-xs text-[#7A90A8]">{flag.section} · {flag.category}</span>
                    {updatedSections.includes(flag.section) && flag.status === 'feedback' && (
                      <span className="text-xs text-[#4A90D9] bg-[#4A90D9]/10 px-2 py-0.5 rounded-full">Updated from Feedback</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {flag.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateFlag(flag.id, 'approved')}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#3DAA6E]/15 text-[#3DAA6E] border border-[#3DAA6E]/30 hover:bg-[#3DAA6E]/25 transition-all duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openFeedback(flag.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#4A90D9]/15 text-[#4A90D9] border border-[#4A90D9]/30 hover:bg-[#4A90D9]/25 transition-all duration-200 flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Feedback
                        </button>
                        <button
                          onClick={() => updateFlag(flag.id, 'escalated')}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/30 hover:bg-[#E05252]/25 transition-all duration-200"
                        >
                          Escalate
                        </button>
                      </>
                    )}
                    {flag.status === 'approved' && (
                      <span className="text-xs text-[#3DAA6E] font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Validated by {flag.validatedBy}
                      </span>
                    )}
                    {flag.status === 'feedback' && (
                      <button
                        onClick={() => undoFeedback(flag.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1F3550] text-[#7A90A8] border border-[#1F3550] hover:border-[#D4A843]/40 hover:text-[#E8EDF5] transition-all duration-200 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Undo Feedback
                      </button>
                    )}
                    {flag.status === 'escalated' && (
                      <span className="text-xs text-[#E05252] font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Escalated by {flag.validatedBy}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#E8EDF5] font-medium mb-1">{flag.title}</p>
                <p className="text-xs text-[#7A90A8] leading-relaxed">{flag.description}</p>

                {/* Saved feedback display */}
                {flag.status === 'feedback' && flag.feedbackText && (
                  <div className="mt-3 p-3 bg-[#4A90D9]/10 border border-[#4A90D9]/20 rounded-lg">
                    <p className="text-xs text-[#4A90D9] font-semibold mb-1">Revision Guidance Logged</p>
                    <p className="text-xs text-[#E8EDF5] leading-relaxed">{flag.feedbackText}</p>
                    {flag.feedbackSavedAt && (
                      <p className="text-xs text-[#7A90A8] mt-1">Saved {new Date(flag.feedbackSavedAt).toLocaleTimeString()}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Inline Feedback Panel */}
              {openFeedbackId === flag.id && flag.status === 'pending' && (
                <div className="border-t border-[#1F3550] p-5 bg-[#0D1B2E]/40">
                  <p className="text-xs font-semibold text-[#4A90D9] mb-3 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    Provide Revision Guidance
                  </p>
                  <textarea
                    rows={3}
                    placeholder='e.g. "Reduce overclaiming — use client-specific data instead of benchmark estimates" or "Clarify stakeholder ownership for this recommendation"'
                    value={feedbackInputs[flag.id] || ''}
                    onChange={(e) => setFeedbackInputs((prev) => ({ ...prev, [flag.id]: e.target.value }))}
                    className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-xs focus:outline-none focus:border-[#4A90D9]/60 focus:ring-1 focus:ring-[#4A90D9]/30 transition-all duration-200 resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => saveFeedback(flag)}
                      disabled={!feedbackInputs[flag.id]?.trim()}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4A90D9] text-white hover:bg-[#3a7bc8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Feedback
                    </button>
                    <button
                      onClick={() => setOpenFeedbackId(null)}
                      className="px-4 py-2 text-xs font-medium rounded-lg border border-[#1F3550] text-[#7A90A8] hover:text-[#E8EDF5] transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Generate Revised Review Summary */}
          <div className="pt-2">
            <button
              onClick={handleGenerateSummary}
              disabled={!allResolved || generatingSummary}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                allResolved && !generatingSummary
                  ? 'bg-[#D4A843] text-[#0D1B2E] hover:bg-[#c49a3a] hover:scale-[1.01] shadow-lg cursor-pointer'
                  : 'bg-[#1F3550] text-[#7A90A8] cursor-not-allowed'
              }`}
            >
              {generatingSummary ? (
                <><span className="w-4 h-4 border-2 border-[#0D1B2E] border-t-transparent rounded-full animate-spin" /> Generating Summary...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Revised Review Summary</>
              )}
            </button>
            {!allResolved && (
              <p className="text-xs text-[#7A90A8] text-center mt-2">
                {pending} flag{pending !== 1 ? 's' : ''} still pending — resolve all flags to generate summary
              </p>
            )}
          </div>

          {/* Review Summary Panel */}
          {reviewSummary && (
            <div className="bg-[#152338] border border-[#D4A843]/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setSummaryExpanded((e) => !e)}
                className="w-full flex items-center justify-between p-5 hover:bg-[#1F3550]/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4A843]/15 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#D4A843]" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#E8EDF5] text-sm">Revised Review Summary</p>
                    <p className="text-xs text-[#7A90A8]">Session-level consolidated decision record</p>
                  </div>
                </div>
                {summaryExpanded ? <ChevronUp className="w-4 h-4 text-[#7A90A8]" /> : <ChevronDown className="w-4 h-4 text-[#7A90A8]" />}
              </button>

              {summaryExpanded && (
                <div className="px-5 pb-5 space-y-5 border-t border-[#1F3550]">
                  {/* Decision Overview */}
                  <div className="pt-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8] mb-3">Session Decision Overview</p>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Total', value: reviewSummary.sessionDecisionOverview.totalFlags, color: '#E8EDF5' },
                        { label: 'Approved', value: reviewSummary.sessionDecisionOverview.approved, color: '#3DAA6E' },
                        { label: 'Feedback', value: reviewSummary.sessionDecisionOverview.feedbackLogged, color: '#4A90D9' },
                        { label: 'Escalated', value: reviewSummary.sessionDecisionOverview.escalated, color: '#E05252' },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-2 bg-[#0D1B2E] rounded-lg">
                          <p className="text-xl font-bold" style={{ color: item.color, fontFamily: 'Georgia, serif' }}>{item.value}</p>
                          <p className="text-xs text-[#7A90A8]">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Updated Consultant Summary */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8] mb-2">Updated Consultant Summary</p>
                    <p className="text-sm text-[#E8EDF5] leading-relaxed bg-[#0D1B2E] p-3 rounded-lg">{reviewSummary.updatedConsultantSummary}</p>
                  </div>

                  {/* Revised Highlights */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8] mb-2">Revised Starter Pack Highlights</p>
                    <ul className="space-y-1.5">
                      {reviewSummary.revisedStarterPackHighlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#E8EDF5]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] mt-1.5 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Active Session Preferences */}
                  {reviewSummary.activeSessionPreferences.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8] mb-2">Active Session Preferences</p>
                      <div className="space-y-1.5">
                        {reviewSummary.activeSessionPreferences.map((pref, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-[#4A90D9]/10 border border-[#4A90D9]/20 rounded-lg">
                            <Brain className="w-3 h-3 text-[#4A90D9] mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-[#E8EDF5]">{pref}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Next Step */}
                  <div className="p-3 bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-lg">
                    <p className="text-xs font-semibold text-[#D4A843] mb-1">Recommended Next Step</p>
                    <p className="text-xs text-[#E8EDF5] leading-relaxed">{reviewSummary.recommendedNextStep}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Revised Sections Panel */}
          {updatedSections.length > 0 && (
            <div className="bg-[#152338] border border-[#4A90D9]/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-4 h-4 text-[#4A90D9]" />
                <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Revised Sections</h3>
              </div>
              <p className="text-xs text-[#7A90A8] mb-3">These sections have been updated based on your feedback in the current session.</p>
              <div className="space-y-2">
                {updatedSections.map((section) => {
                  const feedbackForSection = sessionMemory.feedbackItems.filter((fi) => fi.section === section);
                  return (
                    <div key={section} className="p-3 bg-[#4A90D9]/10 border border-[#4A90D9]/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A90D9] flex-shrink-0" />
                        <p className="text-xs font-semibold text-[#4A90D9]">{section}</p>
                        <span className="text-xs text-[#7A90A8] ml-auto">Revised in Current Session</span>
                      </div>
                      {feedbackForSection.slice(0, 1).map((fi) => (
                        <p key={fi.id} className="text-xs text-[#E8EDF5] leading-relaxed mt-1">
                          {fi.text.slice(0, 80)}{fi.text.length > 80 ? '...' : ''}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Storyline Skeleton */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Storyline Skeleton</h3>
              {storylineUpdated && (
                <span className="text-xs text-[#4A90D9] bg-[#4A90D9]/10 border border-[#4A90D9]/20 px-2 py-0.5 rounded-full">Updated from Feedback</span>
              )}
            </div>
            <div className="space-y-2">
              {[
                { step: '1', label: 'Situation', desc: 'Context and stakes' },
                { step: '2', label: 'Complication', desc: 'Core challenge and root cause' },
                { step: '3', label: 'Resolution', desc: 'Recommended approach and outcomes' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 p-2 bg-[#0D1B2E] rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-[#D4A843]/20 text-[#D4A843] text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</span>
                  <div>
                    <p className="text-xs font-medium text-[#E8EDF5]">{item.label}</p>
                    <p className="text-xs text-[#7A90A8]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-4 Week Diagnostic Workplan */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">2–4 Week Diagnostic Workplan</h3>
              {diagnosticWorkplanUpdated && (
                <span className="text-xs text-[#4A90D9] bg-[#4A90D9]/10 border border-[#4A90D9]/20 px-2 py-0.5 rounded-full">Updated from Feedback</span>
              )}
            </div>
            <div className="space-y-2">
              {[
                { week: 'Wk 1', activity: 'Stakeholder interviews & data collection', status: diagnosticWorkplanUpdated ? 'revised' : 'draft' },
                { week: 'Wk 2', activity: 'Current state assessment & gap analysis', status: 'draft' },
                { week: 'Wk 3', activity: 'Hypothesis validation & framework selection', status: riskChecklistUpdated ? 'revised' : 'draft' },
                { week: 'Wk 4', activity: 'Findings synthesis & recommendation development', status: 'draft' },
              ].map((item) => (
                <div key={item.week} className={`flex items-center gap-3 p-2 rounded-lg ${
                  item.status === 'revised' ? 'bg-[#4A90D9]/10 border border-[#4A90D9]/20' : 'bg-[#0D1B2E]'
                }`}>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    item.status === 'revised' ? 'bg-[#4A90D9]/20 text-[#4A90D9]' : 'bg-[#1F3550] text-[#7A90A8]'
                  }`}>{item.week}</span>
                  <p className="text-xs text-[#E8EDF5]">{item.activity}</p>
                  {item.status === 'revised' && (
                    <span className="text-xs text-[#4A90D9] ml-auto flex-shrink-0">Revised</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risk/Review Checklist */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Risk / Review Checklist</h3>
              {riskChecklistUpdated && (
                <span className="text-xs text-[#4A90D9] bg-[#4A90D9]/10 border border-[#4A90D9]/20 px-2 py-0.5 rounded-full">Updated from Feedback</span>
              )}
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'All statistics validated against client data', checked: approved > 0 },
                { label: 'Causal claims supported by evidence', checked: feedbackCount > 0 },
                { label: 'Stakeholder ownership defined for each recommendation', checked: false },
                { label: 'Timeline feasibility confirmed with client team', checked: false },
                { label: 'Senior reviewer validation complete', checked: escalated === 0 && allResolved },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    item.checked ? 'bg-[#3DAA6E] border-[#3DAA6E]' : 'border-[#1F3550]'
                  }`}>
                    {item.checked && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <p className={`text-xs ${item.checked ? 'text-[#E8EDF5]' : 'text-[#7A90A8]'}`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Confidence */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold mb-4">Section Confidence</h3>
            <div className="space-y-3">
              {Object.entries(data.confidenceScores).map(([section, score]) => (
                <div key={section}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`text-[#E8EDF5] ${updatedSections.includes(section) ? 'font-medium' : ''}`}>
                      {section}
                      {updatedSections.includes(section) && (
                        <span className="ml-1 text-[#4A90D9] text-xs">✓ Revised</span>
                      )}
                    </span>
                    <span className="font-bold" style={{ color: confidenceColor(score) }}>{score}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1F3550] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, backgroundColor: confidenceColor(score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Memory */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#4A90D9]" />
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Feedback Memory</h3>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3DAA6E] animate-pulse" />
              <span className="text-xs text-[#3DAA6E] font-medium">Session Memory Active</span>
            </div>

            {/* Recent Feedback */}
            <div className="mb-4">
              <p className="text-xs text-[#7A90A8] font-medium mb-2">Recent Feedback Captured</p>
              {sessionMemory.feedbackItems.length === 0 ? (
                <p className="text-xs text-[#7A90A8] italic">No feedback logged yet</p>
              ) : (
                <div className="space-y-2">
                  {sessionMemory.feedbackItems.slice(-3).map((fi) => (
                    <div key={fi.id} className="p-2 bg-[#0D1B2E] rounded-lg">
                      <p className="text-xs text-[#4A90D9] font-medium">{fi.section}</p>
                      <p className="text-xs text-[#E8EDF5] mt-0.5 leading-relaxed">{fi.text.slice(0, 80)}{fi.text.length > 80 ? '...' : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reusable Preferences */}
            <div className="mb-4">
              <p className="text-xs text-[#7A90A8] font-medium mb-2">Reusable Review Preferences</p>
              <div className="space-y-1.5">
                {sessionMemory.reusablePreferences.map((rp) => (
                  <div
                    key={rp.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      rp.appliedCount > 0 ? 'bg-[#4A90D9]/10 border border-[#4A90D9]/20' : 'bg-[#0D1B2E]'
                    }`}
                  >
                    <p className={`text-xs ${rp.appliedCount > 0 ? 'text-[#4A90D9]' : 'text-[#7A90A8]'}`}>{rp.label}</p>
                    {rp.appliedCount > 0 && (
                      <span className="text-xs bg-[#4A90D9]/20 text-[#4A90D9] px-1.5 py-0.5 rounded font-bold">{rp.appliedCount}x</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Applied in Next Iteration */}
            {sessionMemory.appliedInNextIteration.length > 0 && (
              <div>
                <p className="text-xs text-[#7A90A8] font-medium mb-2">Applied in Next Iteration</p>
                <div className="space-y-1">
                  {[...new Set(sessionMemory.appliedInNextIteration)].map((section) => (
                    <div key={section} className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 text-[#3DAA6E]" />
                      <p className="text-xs text-[#3DAA6E]">{section} — Revised in Current Session</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-[#7A90A8] mt-3 pt-3 border-t border-[#1F3550] italic">Feedback captured for this session only</p>
          </div>

          {/* Export */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#1F3550]">
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Export Starter Pack</h3>
            </div>

            {/* Export Mode Tabs */}
            <ExportPanel clientName={clientName} onExport={handleExport} onSendReview={handleSendReview} />
          </div>
        </div>
      </div>
    </div>
  );
}
