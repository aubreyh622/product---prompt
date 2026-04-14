import { useState } from 'react';
import type { StarterPack, IssueTreeNode, SourceCitation, HallucinationFlag } from '@shared/types/api';
import { ChevronRight, ChevronDown, Library, FolderOpen, AlertTriangle, Info, BookOpen, X } from 'lucide-react';

type Tab = 'problem' | 'issuetree' | 'workstreams' | 'roadmap' | 'exec' | 'deck';

const TABS: { id: Tab; label: string }[] = [
  { id: 'problem', label: 'Problem Statement' },
  { id: 'issuetree', label: 'Issue Tree' },
  { id: 'workstreams', label: 'Workstreams' },
  { id: 'roadmap', label: '30/60/90 Roadmap' },
  { id: 'exec', label: 'Exec Summary' },
  { id: 'deck', label: 'Deck Outline' },
];

const TAB_SECTION_MAP: Record<Tab, string> = {
  problem: 'Problem Statement',
  issuetree: 'Issue Tree',
  workstreams: 'Workstreams',
  roadmap: '30/60/90 Roadmap',
  exec: 'Exec Summary',
  deck: 'Deck Outline',
};

const HALLUCINATION_TYPE_LABELS: Record<string, string> = {
  unsupported_causal: 'Unsupported Causal Claim',
  unverified_statistic: 'Unverified Statistic',
  low_confidence: 'Low Confidence Assertion',
};

const HALLUCINATION_SEVERITY_STYLE: Record<string, string> = {
  high: 'bg-[#E05252]/15 border-[#E05252]/30 text-[#E05252]',
  medium: 'bg-[#D4A843]/15 border-[#D4A843]/30 text-[#D4A843]',
  low: 'bg-[#7A90A8]/15 border-[#7A90A8]/30 text-[#7A90A8]',
};

function IssueTreeNodeComponent({ node, depth = 0 }: { node: IssueTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(node.expanded ?? true);
  const hasChildren = node.children && node.children.length > 0;

  const dotSize = depth === 0 ? 'w-3 h-3 rounded-sm bg-[#D4A843]' : depth === 1 ? 'w-2 h-2 rounded-sm bg-[#2D5282]' : 'w-1.5 h-1.5 rounded-full bg-[#1F3550]';
  const textStyle = depth === 0 ? 'font-medium text-[#E8EDF5] text-sm' : depth === 1 ? 'text-[#7A90A8] text-sm' : 'text-xs text-[#7A90A8]';

  return (
    <div className={depth > 0 ? 'ml-5' : ''}>
      <div
        className={`flex items-center gap-2 py-1 ${hasChildren ? 'cursor-pointer hover:text-[#E8EDF5]' : ''}`}
        onClick={() => hasChildren && setExpanded((e) => !e)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3 h-3 text-[#7A90A8] flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-[#7A90A8] flex-shrink-0" />
        ) : (
          <span className={`${dotSize} flex-shrink-0`} />
        )}
        <span className={textStyle}>{node.label}</span>
      </div>
      {hasChildren && expanded && (
        <div className="space-y-0.5">
          {node.children!.map((child) => (
            <IssueTreeNodeComponent key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function SourceCitationPanel({ citations, sectionName }: { citations: SourceCitation[]; sectionName: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!citations || citations.length === 0) return null;

  const firmCitations = citations.filter((c) => c.sourceType === 'firm_library');
  const clientCitations = citations.filter((c) => c.sourceType === 'client_folder');

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-2 text-xs text-[#4A90D9] hover:text-[#6aabf7] transition-colors"
      >
        <BookOpen className="w-3 h-3" />
        {expanded ? 'Hide' : 'View'} source citations ({citations.length})
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {expanded && (
        <div className="mt-3 p-4 bg-[#0D1B2E] border border-[#1F3550] rounded-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8] mb-2">Source Grounding — {sectionName}</p>
          {firmCitations.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Library className="w-3 h-3 text-[#D4A843]" />
                <p className="text-xs font-semibold text-[#D4A843]">Firm Library</p>
              </div>
              <div className="space-y-2">
                {firmCitations.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 p-2 bg-[#152338] rounded-lg">
                    <span className="text-xs font-bold text-[#D4A843] bg-[#D4A843]/10 px-1.5 py-0.5 rounded flex-shrink-0">[FL]</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#E8EDF5]">{c.label}</p>
                      <p className="text-xs text-[#7A90A8]">{c.fileName} · {c.chunkRef}</p>
                      <p className="text-xs text-[#7A90A8] mt-0.5 italic">{c.relevance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {clientCitations.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FolderOpen className="w-3 h-3 text-[#3DAA6E]" />
                <p className="text-xs font-semibold text-[#3DAA6E]">Current Client Folder</p>
              </div>
              <div className="space-y-2">
                {clientCitations.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 p-2 bg-[#152338] rounded-lg">
                    <span className="text-xs font-bold text-[#3DAA6E] bg-[#3DAA6E]/10 px-1.5 py-0.5 rounded flex-shrink-0">[CC]</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#E8EDF5]">{c.label}</p>
                      <p className="text-xs text-[#7A90A8]">{c.fileName} · {c.chunkRef}</p>
                      <p className="text-xs text-[#7A90A8] mt-0.5 italic">{c.relevance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HallucinationFlagPanel({ flags }: { flags: HallucinationFlag[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = flags.filter((f) => !dismissed.has(f.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-[#D4A843]" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">AI Quality Flags — {visible.length} item{visible.length !== 1 ? 's' : ''} require review</p>
      </div>
      {visible.map((flag) => (
        <div
          key={flag.id}
          className={`flex items-start gap-3 p-3 rounded-lg border ${HALLUCINATION_SEVERITY_STYLE[flag.severity]}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wide">{HALLUCINATION_TYPE_LABELS[flag.flagType]}</span>
            </div>
            <p className="text-xs text-[#E8EDF5] leading-relaxed mb-1">
              <span className="font-medium">Flagged claim: </span>"{flag.claim}"
            </p>
            <p className="text-xs text-[#7A90A8] leading-relaxed">
              <span className="font-medium">Suggestion: </span>{flag.suggestion}
            </p>
          </div>
          <button
            onClick={() => setDismissed((prev) => new Set([...prev, flag.id]))}
            className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
            title="Dismiss flag"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 85 ? '#3DAA6E' : score >= 70 ? '#D4A843' : '#E05252';
  const bg = score >= 85 ? 'bg-[#3DAA6E]/15 border-[#3DAA6E]/30' : score >= 70 ? 'bg-[#D4A843]/15 border-[#D4A843]/30' : 'bg-[#E05252]/15 border-[#E05252]/30';
  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${bg}`} style={{ color }}>
      {score}% Confidence
    </span>
  );
}

export default function StarterPackView({ pack }: { pack: StarterPack }) {
  const [activeTab, setActiveTab] = useState<Tab>('problem');

  const currentSection = TAB_SECTION_MAP[activeTab];
  const currentCitations = pack.sourceCitations?.[currentSection] || [];
  const currentHallucinationFlags = (pack.hallucinationFlags || []).filter(
    (f) => f.section === currentSection
  );

  // Count total flags across all sections
  const totalFlags = pack.hallucinationFlags?.length || 0;

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#152338] border border-[#1F3550] rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const sectionName = TAB_SECTION_MAP[tab.id];
          const tabFlags = (pack.hallucinationFlags || []).filter((f) => f.section === sectionName);
          const hasCitations = (pack.sourceCitations?.[sectionName] || []).length > 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 relative px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#D4A843] text-[#0D1B2E] font-semibold'
                  : 'text-[#7A90A8] hover:text-[#E8EDF5] hover:bg-[#1F3550]/40'
              }`}
            >
              {tab.label}
              {tabFlags.length > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${
                  activeTab === tab.id ? 'bg-[#E05252] text-white' : 'bg-[#E05252]/80 text-white'
                }`}>
                  {tabFlags.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Quality Notice */}
      {totalFlags > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-[#D4A843] flex-shrink-0" />
          <p className="text-xs text-[#E8EDF5]">
            <span className="font-semibold text-[#D4A843]">AI Quality Review Active</span> — {totalFlags} hallucination prevention flag{totalFlags !== 1 ? 's' : ''} detected across sections. Review flagged claims before client-facing use.
          </p>
        </div>
      )}

      {/* Problem Statement */}
      {activeTab === 'problem' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#152338] border border-[#1F3550] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#E8EDF5] text-xl" style={{ fontFamily: 'Georgia, serif' }}>Problem Statement</h3>
              <ConfidenceBadge score={pack.confidenceScores['Problem Statement']} />
            </div>
            <div className="space-y-4">
              {pack.problemStatement.split('\n\n').map((para, i) => (
                <p key={i} className="text-[#E8EDF5] leading-relaxed text-base">{para}</p>
              ))}
            </div>
            <HallucinationFlagPanel flags={currentHallucinationFlags} />
            <SourceCitationPanel citations={currentCitations} sectionName="Problem Statement" />
          </div>
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <h3 className="font-semibold text-[#E8EDF5] text-sm mb-4">Issue Tree Preview</h3>
            <div className="space-y-1">
              {pack.issueTree.map((node) => (
                <IssueTreeNodeComponent key={node.id} node={node} />
              ))}
            </div>
            {/* Grounding summary */}
            <div className="mt-4 pt-4 border-t border-[#1F3550]">
              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-2">Grounding</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Library className="w-3 h-3 text-[#D4A843]" />
                  <p className="text-xs text-[#7A90A8]">{(pack.sourceCitations?.['Problem Statement'] || []).filter(c => c.sourceType === 'firm_library').length} Firm Library sources</p>
                </div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-3 h-3 text-[#3DAA6E]" />
                  <p className="text-xs text-[#7A90A8]">{(pack.sourceCitations?.['Problem Statement'] || []).filter(c => c.sourceType === 'client_folder').length} Client Folder sources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Tree */}
      {activeTab === 'issuetree' && (
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#E8EDF5] text-xl" style={{ fontFamily: 'Georgia, serif' }}>Issue Tree</h3>
            <ConfidenceBadge score={pack.confidenceScores['Issue Tree']} />
          </div>
          <div className="space-y-1">
            {pack.issueTree.map((node) => (
              <IssueTreeNodeComponent key={node.id} node={node} />
            ))}
          </div>
          <p className="text-xs text-[#7A90A8] mt-6">Click any branch to expand or collapse. Branches with arrows are expandable.</p>
          <HallucinationFlagPanel flags={currentHallucinationFlags} />
          <SourceCitationPanel citations={currentCitations} sectionName="Issue Tree" />
        </div>
      )}

      {/* Workstreams */}
      {activeTab === 'workstreams' && (
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[#E8EDF5] text-sm uppercase tracking-widest">Workstreams</h3>
            <ConfidenceBadge score={pack.confidenceScores['Workstreams']} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pack.workstreams.map((ws) => (
              <div
                key={ws.id}
                className="p-4 rounded-xl bg-[#0D1B2E] border border-[#1F3550]"
                style={{ borderTop: `3px solid ${ws.color}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: ws.color }}>
                    WS {ws.number}
                  </span>
                  <span className="text-xs text-[#7A90A8]">{ws.weekRange}</span>
                </div>
                <p className="font-semibold text-[#E8EDF5] text-sm mb-3">{ws.title}</p>
                <ul className="space-y-1.5">
                  {ws.activities.map((act, i) => (
                    <li key={i} className="text-xs text-[#7A90A8] flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: ws.color }} />
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <HallucinationFlagPanel flags={currentHallucinationFlags} />
          <SourceCitationPanel citations={currentCitations} sectionName="Workstreams" />
        </div>
      )}

      {/* Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[#E8EDF5] text-sm uppercase tracking-widest">30 / 60 / 90 Day Roadmap</h3>
            <ConfidenceBadge score={pack.confidenceScores['30/60/90 Roadmap']} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pack.roadmap.map((phase) => (
              <div key={phase.days}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0D1B2E] text-sm flex-shrink-0"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.days}
                  </div>
                  <div>
                    <p className="font-semibold text-[#E8EDF5] text-sm">{phase.title}</p>
                    <p className="text-xs text-[#7A90A8]">{phase.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-2">
                  {phase.milestones.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#7A90A8]">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: phase.color }}
                      />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <HallucinationFlagPanel flags={currentHallucinationFlags} />
          <SourceCitationPanel citations={currentCitations} sectionName="30/60/90 Roadmap" />
        </div>
      )}

      {/* Exec Summary */}
      {activeTab === 'exec' && (
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#E8EDF5] text-xl" style={{ fontFamily: 'Georgia, serif' }}>Executive Summary</h3>
            <ConfidenceBadge score={pack.confidenceScores['Exec Summary']} />
          </div>
          <div className="space-y-4">
            {pack.execSummary.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#E8EDF5] leading-relaxed text-base">{para}</p>
            ))}
          </div>
          <HallucinationFlagPanel flags={currentHallucinationFlags} />
          <SourceCitationPanel citations={currentCitations} sectionName="Exec Summary" />
        </div>
      )}

      {/* Deck Outline */}
      {activeTab === 'deck' && (
        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#E8EDF5] text-xl" style={{ fontFamily: 'Georgia, serif' }}>Deck Outline</h3>
            <ConfidenceBadge score={pack.confidenceScores['Deck Outline']} />
          </div>
          <div className="space-y-3">
            {pack.deckOutline.map((slide) => (
              <div key={slide.number} className="flex gap-4 p-4 bg-[#0D1B2E] border border-[#1F3550] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#D4A843]">{slide.number}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#E8EDF5] text-sm">{slide.title}</p>
                  <p className="text-xs text-[#7A90A8] mt-0.5">{slide.purpose}</p>
                  <p className="text-xs text-[#E8EDF5] mt-2 leading-relaxed">
                    <span className="text-[#D4A843] font-medium">Key message: </span>{slide.keyMessage}
                  </p>
                  <p className="text-xs text-[#7A90A8] mt-1">
                    <span className="font-medium">Visual: </span>{slide.visual}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <HallucinationFlagPanel flags={currentHallucinationFlags} />
          <SourceCitationPanel citations={currentCitations} sectionName="Deck Outline" />
        </div>
      )}
    </div>
  );
}
