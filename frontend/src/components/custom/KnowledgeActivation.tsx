import { useState } from 'react';
import type { KnowledgeActivationData, Framework, PriorEngagement } from '@shared/types/api';
import { Settings2, FileText, Library, FolderOpen, ChevronDown, ChevronRight, Sparkles, Target } from 'lucide-react';

interface KnowledgeActivationProps {
  data: KnowledgeActivationData;
  onGenerate: (data: KnowledgeActivationData) => void;
}

const FIT_COLOR = (score: number) =>
  score >= 85 ? '#3DAA6E' : score >= 70 ? '#D4A843' : '#7A90A8';

const ASSET_TAG_STYLE: Record<string, string> = {
  Flagship: 'bg-[#D4A843]/20 text-[#D4A843]',
  Core: 'bg-[#2D5282]/40 text-[#7A90A8]',
  Method: 'bg-[#1F3550] text-[#7A90A8]',
};

const FORMAT_STYLE: Record<string, string> = {
  DOCX: 'bg-blue-500/20 text-blue-400',
  PPTX: 'bg-orange-500/20 text-orange-400',
  XLSX: 'bg-green-500/20 text-green-400',
};

// Simulated retrieved chunk snippets per framework
const FRAMEWORK_SNIPPETS: Record<string, string> = {
  f1: '"...Stage 3 (Governed) requires a unified data schema across all production sites before AI model deployment can proceed at scale. Key indicators: data stewardship roles defined, cross-facility schema alignment >80%..."',
  f2: '"...Transformation sequencing must account for dependency chains. High-value, low-dependency initiatives should anchor Phase 1 to build organizational confidence before tackling complex cross-functional workstreams..."',
  f3: '"...Change readiness assessment across 4 dimensions: Leadership Alignment (weight 35%), Cultural Receptivity (25%), Capability Readiness (25%), Process Maturity (15%). Threshold for green-light: composite score >65..."',
};

function FitScoreBar({ score }: { score: number }) {
  const color = FIT_COLOR(score);
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#1F3550] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

function ToggleSwitch({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Toggle ${label}`}
      className={`w-10 h-6 rounded-full relative transition-all duration-200 flex-shrink-0 ${
        enabled ? 'bg-[#3DAA6E]' : 'bg-[#1F3550]'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all duration-200 ${
          enabled ? 'right-1 bg-white' : 'left-1 bg-white/50'
        }`}
      />
    </button>
  );
}

export default function KnowledgeActivation({ data, onGenerate }: KnowledgeActivationProps) {
  const [frameworks, setFrameworks] = useState<Framework[]>(data.frameworks);
  const [priorEngagements, setPriorEngagements] = useState<PriorEngagement[]>(data.priorEngagements);
  const [expandedSnippet, setExpandedSnippet] = useState<string | null>(null);

  function toggleFramework(id: string) {
    setFrameworks((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  }

  function toggleEngagement(id: string) {
    setPriorEngagements((prev) => prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)));
  }

  function handleGenerate() {
    onGenerate({ ...data, frameworks, priorEngagements });
  }

  const firmLibraryFrameworks = frameworks.filter((f) => !f.sourceType || f.sourceType === 'firm_library');
  const clientFolderFrameworks = frameworks.filter((f) => f.sourceType === 'client_folder');
  const enabledCount = frameworks.filter((f) => f.enabled).length + priorEngagements.filter((e) => e.enabled).length;

  return (
    <div className="space-y-6">
      {/* Source Attribution Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-[#152338] border border-[#D4A843]/20 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-[#D4A843]/15 flex items-center justify-center flex-shrink-0">
            <Library className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#D4A843]">Firm Library</p>
            <p className="text-xs text-[#7A90A8]">{firmLibraryFrameworks.length} frameworks matched — internal CGS IP</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-lg font-bold text-[#D4A843]" style={{ fontFamily: 'Georgia, serif' }}>{firmLibraryFrameworks.filter(f => f.enabled).length}</p>
            <p className="text-xs text-[#7A90A8]">active</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-[#152338] border border-[#3DAA6E]/20 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-[#3DAA6E]/15 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-4 h-4 text-[#3DAA6E]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3DAA6E]">Current Client Folder</p>
            <p className="text-xs text-[#7A90A8]">{clientFolderFrameworks.length > 0 ? `${clientFolderFrameworks.length} assets matched` : 'No client-specific assets matched'} — engagement evidence</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-lg font-bold text-[#3DAA6E]" style={{ fontFamily: 'Georgia, serif' }}>{clientFolderFrameworks.filter(f => f.enabled).length}</p>
            <p className="text-xs text-[#7A90A8]">active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frameworks Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">Matched Frameworks — Firm Library</h3>
            <span className="text-xs text-[#7A90A8]">Toggle to include/exclude from generation</span>
          </div>

          {firmLibraryFrameworks.map((fw) => (
            <div
              key={fw.id}
              className={`bg-[#152338] border rounded-xl overflow-hidden transition-all duration-200 ${
                fw.enabled ? 'border-[#D4A843]/20 hover:border-[#D4A843]/40' : 'border-[#1F3550] opacity-60'
              }`}
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      fw.enabled ? 'bg-[#D4A843]/15' : 'bg-[#1F3550]'
                    }`}>
                      <FileText className={`w-5 h-5 ${fw.enabled ? 'text-[#D4A843]' : 'text-[#7A90A8]'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#E8EDF5] text-sm leading-tight">{fw.name}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20">Firm Library</span>
                      </div>
                      <p className="text-xs text-[#7A90A8] mt-0.5">{fw.industry} · Used {fw.usageCount} times</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${ASSET_TAG_STYLE[fw.assetTag]}`}>
                      {fw.assetTag}
                    </span>
                    <ToggleSwitch enabled={fw.enabled} onToggle={() => toggleFramework(fw.id)} label={fw.name} />
                  </div>
                </div>

                {/* Fit score */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-[#7A90A8]" />
                    <span className="text-xs text-[#7A90A8]">Fit Score</span>
                  </div>
                  <FitScoreBar score={fw.fitScore} />
                </div>

                <p className="text-sm text-[#7A90A8] leading-relaxed">{fw.description}</p>

                {/* Snippet toggle */}
                {FRAMEWORK_SNIPPETS[fw.id] && (
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedSnippet((prev) => (prev === fw.id ? null : fw.id))}
                      className="flex items-center gap-1 text-xs text-[#4A90D9] hover:text-[#6aabf7] transition-colors"
                    >
                      {expandedSnippet === fw.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {expandedSnippet === fw.id ? 'Hide matched chunk' : 'View matched chunk'}
                    </button>
                    {expandedSnippet === fw.id && (
                      <div className="mt-2 p-3 bg-[#0D1B2E] border border-[#4A90D9]/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Library className="w-3 h-3 text-[#D4A843]" />
                          <p className="text-xs text-[#D4A843] font-semibold">Retrieved Chunk — Firm Library</p>
                        </div>
                        <p className="text-xs text-[#E8EDF5] leading-relaxed italic">{FRAMEWORK_SNIPPETS[fw.id]}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {clientFolderFrameworks.length > 0 && (
            <>
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold pt-2">Matched Assets — Current Client Folder</h3>
              {clientFolderFrameworks.map((fw) => (
                <div
                  key={fw.id}
                  className={`bg-[#152338] border rounded-xl p-5 transition-all duration-200 ${
                    fw.enabled ? 'border-[#3DAA6E]/20 hover:border-[#3DAA6E]/40' : 'border-[#1F3550] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#3DAA6E]/15 flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-5 h-5 text-[#3DAA6E]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#E8EDF5] text-sm">{fw.name}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-[#3DAA6E]/10 text-[#3DAA6E] border border-[#3DAA6E]/20">Client Folder</span>
                        </div>
                        <p className="text-xs text-[#7A90A8] mt-0.5">{fw.industry}</p>
                      </div>
                    </div>
                    <ToggleSwitch enabled={fw.enabled} onToggle={() => toggleFramework(fw.id)} label={fw.name} />
                  </div>
                  <div className="flex items-center gap-3 mt-3 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-[#7A90A8]" />
                      <span className="text-xs text-[#7A90A8]">Fit Score</span>
                    </div>
                    <FitScoreBar score={fw.fitScore} />
                  </div>
                  <p className="text-sm text-[#7A90A8] leading-relaxed">{fw.description}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Prior Engagements */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold mb-4">Prior Engagements</h3>
            <div className="space-y-3">
              {priorEngagements.map((eng, idx) => (
                <div
                  key={eng.id}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    eng.enabled ? 'bg-[#0D1B2E]' : 'bg-[#0D1B2E] opacity-60'
                  } ${idx < priorEngagements.length - 1 ? 'mb-1' : ''}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#E8EDF5] leading-tight truncate">{eng.name}</p>
                    <p className="text-xs text-[#7A90A8]">{eng.industry} · {eng.year}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#7A90A8]">Similarity</span>
                      <FitScoreBar score={eng.similarityScore} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <button
                      onClick={() => toggleEngagement(eng.id)}
                      aria-label={`Toggle ${eng.name}`}
                      className={`w-8 h-5 rounded-full relative transition-all duration-200 ${
                        eng.enabled ? 'bg-[#3DAA6E]' : 'bg-[#1F3550]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-all duration-200 ${
                          eng.enabled ? 'right-0.5 bg-white' : 'left-0.5 bg-white/50'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Working Hypotheses */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#D4A843]" />
              <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold">AI Working Hypotheses</h3>
            </div>
            <div className="space-y-3">
              {data.hypotheses.map((hyp) => (
                <div
                  key={hyp.id}
                  className={`p-3 rounded-lg border ${
                    hyp.confidence === 'High'
                      ? 'bg-[#3DAA6E]/10 border-[#3DAA6E]/20'
                      : 'bg-[#D4A843]/10 border-[#D4A843]/20'
                  }`}
                >
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide block mb-1 ${
                      hyp.confidence === 'High' ? 'text-[#3DAA6E]' : 'text-[#D4A843]'
                    }`}
                  >
                    {hyp.confidence} Confidence
                  </span>
                  <p className="text-xs text-[#E8EDF5] leading-relaxed">{hyp.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Templates */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold mb-4">Suggested Templates</h3>
            <div className="space-y-2">
              {data.templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1F3550]/30 transition-all duration-200 cursor-pointer"
                >
                  <span className={`text-xs font-bold px-2 py-1 rounded ${FORMAT_STYLE[tmpl.format]}`}>
                    {tmpl.format}
                  </span>
                  <span className="text-sm text-[#E8EDF5]">{tmpl.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Assets Summary */}
          <div className="bg-[#152338] border border-[#D4A843]/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-[#D4A843] mb-2">Active for Generation</p>
            <p className="text-2xl font-bold text-[#E8EDF5]" style={{ fontFamily: 'Georgia, serif' }}>{enabledCount}</p>
            <p className="text-xs text-[#7A90A8]">assets selected across both knowledge layers</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] hover:scale-[1.02] transition-all duration-200 shadow-lg"
        >
          <Settings2 className="w-4 h-4" />
          Generate Starter Pack
        </button>
      </div>
    </div>
  );
}
