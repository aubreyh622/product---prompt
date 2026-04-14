import { useState } from 'react';
import type { IngestionJob, ArchetypeBundle, IndexHealthMetric, KnowledgeAsset } from '@shared/types/api';
import { RefreshCw, CheckCircle, AlertCircle, Clock, Database, Tag, Layers, Activity, Upload, Search } from 'lucide-react';
import { toast } from 'sonner';

type KMTab = 'pipeline' | 'assets' | 'archetypes' | 'health';

const INGESTION_JOBS: IngestionJob[] = [
  { id: 'j1', fileName: 'AI Maturity Ladder v3.2.pptx', fileType: 'PPTX', sourceType: 'firm_library', status: 'indexed', startedAt: '2026-04-10T08:45:00Z', completedAt: '2026-04-10T09:02:00Z', chunkCount: 42 },
  { id: 'j2', fileName: 'Executive Sponsor Alignment Notes.gdoc', fileType: 'GDOC', sourceType: 'client_folder', status: 'pending', startedAt: '2026-04-12T15:50:00Z', chunkCount: 0 },
  { id: 'j3', fileName: 'Delivery Excellence Framework.docx', fileType: 'DOCX', sourceType: 'firm_library', status: 'indexed', startedAt: '2026-04-10T08:45:00Z', completedAt: '2026-04-10T09:05:00Z', chunkCount: 67 },
  { id: 'j4', fileName: 'Change Readiness Diagnostic.docx', fileType: 'DOCX', sourceType: 'firm_library', status: 'stale', startedAt: '2025-12-10T07:00:00Z', completedAt: '2025-12-10T07:15:00Z', chunkCount: 22 },
  { id: 'j5', fileName: 'IT Infrastructure Audit - Draft.pdf', fileType: 'PDF', sourceType: 'client_folder', status: 'indexed', startedAt: '2026-04-10T09:30:00Z', completedAt: '2026-04-10T09:48:00Z', chunkCount: 67 },
  { id: 'j6', fileName: 'Reporting Baseline FY2025.xlsx', fileType: 'XLSX', sourceType: 'client_folder', status: 'indexed', startedAt: '2026-04-11T11:00:00Z', completedAt: '2026-04-11T11:12:00Z', chunkCount: 45 },
];

const ARCHETYPE_BUNDLES: ArchetypeBundle[] = [
  { id: 'ab1', archetype: 'ai_transformation', assetCount: 12, lastUpdated: '2026-04-10T09:00:00Z', coverageScore: 94 },
  { id: 'ab2', archetype: 'delivery_standardization', assetCount: 9, lastUpdated: '2026-04-10T09:00:00Z', coverageScore: 88 },
  { id: 'ab3', archetype: 'execution_stall', assetCount: 8, lastUpdated: '2026-04-09T08:00:00Z', coverageScore: 82 },
  { id: 'ab4', archetype: 'operating_model', assetCount: 11, lastUpdated: '2026-04-09T08:00:00Z', coverageScore: 91 },
  { id: 'ab5', archetype: 'sponsor_misalignment', assetCount: 7, lastUpdated: '2026-04-08T07:00:00Z', coverageScore: 76 },
];

const INDEX_HEALTH: IndexHealthMetric[] = [
  { label: 'Total Indexed Chunks', value: '2,847', status: 'healthy', detail: 'Across 47 documents' },
  { label: 'Vector Index Size', value: '1.2 GB', status: 'healthy', detail: 'pgvector index' },
  { label: 'Avg Retrieval Latency', value: '142ms', status: 'healthy', detail: 'p95: 380ms' },
  { label: 'Stale Assets', value: 3, status: 'warning', detail: 'Require re-indexing' },
  { label: 'Failed Jobs (7d)', value: 0, status: 'healthy', detail: 'No failures in last 7 days' },
  { label: 'Last Full Sync', value: 'Apr 13, 2026', status: 'healthy', detail: '07:45 AM UTC' },
];

const ARCHETYPE_LABELS: Record<string, string> = {
  ai_transformation: 'AI Transformation',
  delivery_standardization: 'Delivery Standardization',
  execution_stall: 'Execution Stall',
  operating_model: 'Operating Model',
  sponsor_misalignment: 'Sponsor Misalignment',
};

function StatusBadge({ status }: { status: string }) {
  if (status === 'indexed') return <span className="flex items-center gap-1 text-xs text-[#3DAA6E] bg-[#3DAA6E]/10 px-2 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" />Indexed</span>;
  if (status === 'pending') return <span className="flex items-center gap-1 text-xs text-[#D4A843] bg-[#D4A843]/10 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" />Pending</span>;
  if (status === 'stale') return <span className="flex items-center gap-1 text-xs text-[#D4A843] bg-[#D4A843]/10 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" />Stale</span>;
  return <span className="flex items-center gap-1 text-xs text-[#E05252] bg-[#E05252]/10 px-2 py-0.5 rounded-full"><AlertCircle className="w-3 h-3" />Failed</span>;
}

function HealthStatusDot({ status }: { status: string }) {
  const color = status === 'healthy' ? '#3DAA6E' : status === 'warning' ? '#D4A843' : '#E05252';
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />;
}

export default function KnowledgeManagerView() {
  const [activeTab, setActiveTab] = useState<KMTab>('pipeline');
  const [jobs, setJobs] = useState<IngestionJob[]>(INGESTION_JOBS);
  const [reindexing, setReindexing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const TABS: { id: KMTab; label: string; icon: React.ReactNode }[] = [
    { id: 'pipeline', label: 'Ingestion Pipeline', icon: <Upload className="w-4 h-4" /> },
    { id: 'assets', label: 'Asset Library', icon: <Database className="w-4 h-4" /> },
    { id: 'archetypes', label: 'Archetype Bundles', icon: <Layers className="w-4 h-4" /> },
    { id: 'health', label: 'Index Health', icon: <Activity className="w-4 h-4" /> },
  ];

  function handleReindex(jobId: string) {
    setReindexing(jobId);
    setTimeout(() => {
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: 'indexed', completedAt: new Date().toISOString(), chunkCount: j.chunkCount || 22 } : j));
      setReindexing(null);
      toast.success('Re-indexing complete', { description: 'Asset has been re-indexed and is now current.' });
    }, 1800);
  }

  function handleSyncAll() {
    toast.success('Full sync initiated', { description: 'All Drive folders are being scanned for updates.' });
  }

  const filteredJobs = jobs.filter((j) =>
    j.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '47', color: '#D4A843' },
          { label: 'Indexed Chunks', value: '2,847', color: '#3DAA6E' },
          { label: 'Archetypes Covered', value: '5/5', color: '#4A90D9' },
          { label: 'Stale Assets', value: '3', color: '#D4A843' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#152338] border border-[#1F3550] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color, fontFamily: 'Georgia, serif' }}>{stat.value}</p>
            <p className="text-xs text-[#7A90A8] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#152338] border border-[#1F3550] rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#D4A843] text-[#0D1B2E] font-semibold'
                : 'text-[#7A90A8] hover:text-[#E8EDF5] hover:bg-[#1F3550]/40'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Ingestion Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A90A8]" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg pl-9 pr-4 py-2.5 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 transition-all duration-200"
              />
            </div>
            <button
              onClick={handleSyncAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Sync All Folders
            </button>
          </div>

          <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[#1F3550] text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">
              <div className="col-span-5">File</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Chunks</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y divide-[#1F3550]">
              {filteredJobs.map((job) => (
                <div key={job.id} className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-[#1F3550]/20 transition-all duration-150">
                  <div className="col-span-5 min-w-0">
                    <p className="text-sm font-medium text-[#E8EDF5] truncate">{job.fileName}</p>
                    <p className="text-xs text-[#7A90A8]">{job.fileType} · {new Date(job.startedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      job.sourceType === 'firm_library' ? 'bg-[#D4A843]/10 text-[#D4A843]' : 'bg-[#3DAA6E]/10 text-[#3DAA6E]'
                    }`}>
                      {job.sourceType === 'firm_library' ? 'Firm' : 'Client'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-[#E8EDF5]">{job.chunkCount > 0 ? job.chunkCount : '—'}</span>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {(job.status === 'stale' || job.status === 'failed') && (
                      <button
                        onClick={() => handleReindex(job.id)}
                        disabled={reindexing === job.id}
                        className="p-1.5 rounded-lg bg-[#1F3550] hover:bg-[#D4A843]/20 text-[#7A90A8] hover:text-[#D4A843] transition-all duration-200"
                        title="Re-index"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${reindexing === job.id ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Asset Library */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Firm Library', count: 8, color: '#D4A843', desc: 'Frameworks, templates, governance IP' },
              { label: 'Client Folders', count: 6, color: '#3DAA6E', desc: 'Engagement-specific evidence' },
            ].map((src) => (
              <div key={src.label} className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#E8EDF5] text-sm">{src.label}</p>
                  <span className="text-2xl font-bold" style={{ color: src.color, fontFamily: 'Georgia, serif' }}>{src.count}</span>
                </div>
                <p className="text-xs text-[#7A90A8]">{src.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold mb-4">Asset Tag Distribution</h3>
            <div className="space-y-3">
              {[
                { tag: 'Flagship', count: 5, color: '#D4A843' },
                { tag: 'Core', count: 8, color: '#4A90D9' },
                { tag: 'Method', count: 6, color: '#7A90A8' },
                { tag: 'Governance', count: 2, color: '#E05252' },
                { tag: 'Template', count: 4, color: '#9B59B6' },
              ].map((item) => (
                <div key={item.tag}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#E8EDF5]">{item.tag}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.count} assets</span>
                  </div>
                  <div className="h-1.5 bg-[#1F3550] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.count / 25) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Archetype Bundles */}
      {activeTab === 'archetypes' && (
        <div className="space-y-4">
          <p className="text-sm text-[#7A90A8]">Archetype bundles group knowledge assets by engagement pattern. Coverage score reflects how well each archetype is supported by indexed assets.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARCHETYPE_BUNDLES.map((bundle) => (
              <div key={bundle.id} className="bg-[#152338] border border-[#1F3550] rounded-xl p-5 hover:border-[#D4A843]/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#E8EDF5] text-sm">{ARCHETYPE_LABELS[bundle.archetype]}</p>
                    <p className="text-xs text-[#7A90A8] mt-0.5">{bundle.assetCount} assets · Updated {new Date(bundle.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold" style={{ color: bundle.coverageScore >= 85 ? '#3DAA6E' : '#D4A843', fontFamily: 'Georgia, serif' }}>
                      {bundle.coverageScore}%
                    </p>
                    <p className="text-xs text-[#7A90A8]">Coverage</p>
                  </div>
                </div>
                <div className="h-2 bg-[#1F3550] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${bundle.coverageScore}%`, backgroundColor: bundle.coverageScore >= 85 ? '#3DAA6E' : '#D4A843' }}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5] transition-all duration-200 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Manage Tags
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5] transition-all duration-200 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Re-sync
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Index Health */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDEX_HEALTH.map((metric) => (
              <div
                key={metric.label}
                className={`bg-[#152338] border rounded-xl p-5 ${
                  metric.status === 'healthy' ? 'border-[#3DAA6E]/20' : metric.status === 'warning' ? 'border-[#D4A843]/30' : 'border-[#E05252]/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <HealthStatusDot status={metric.status} />
                  <p className="text-xs text-[#7A90A8] font-medium">{metric.label}</p>
                </div>
                <p className="text-2xl font-bold text-[#E8EDF5]" style={{ fontFamily: 'Georgia, serif' }}>{metric.value}</p>
                {metric.detail && <p className="text-xs text-[#7A90A8] mt-1">{metric.detail}</p>}
              </div>
            ))}
          </div>

          <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A90A8] font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { service: 'pgvector Index', status: 'Operational', uptime: '99.9%' },
                { service: 'Google Drive Sync', status: 'Operational', uptime: '99.7%' },
                { service: 'Ingestion Pipeline', status: 'Operational', uptime: '99.8%' },
                { service: 'Embedding Service', status: 'Operational', uptime: '99.9%' },
              ].map((svc) => (
                <div key={svc.service} className="flex items-center justify-between py-2 border-b border-[#1F3550] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3DAA6E]" />
                    <span className="text-sm text-[#E8EDF5]">{svc.service}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#3DAA6E]">{svc.status}</span>
                    <span className="text-xs text-[#7A90A8]">{svc.uptime} uptime</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
