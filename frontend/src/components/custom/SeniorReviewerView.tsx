import { useState } from 'react';
import type { ReviewQueueItem, ReviewQueueStatus, UrgencyLevel } from '@shared/types/api';
import { CheckCircle, RotateCcw, Eye, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const URGENCY_STYLE: Record<UrgencyLevel, string> = {
  standard: 'bg-[#3DAA6E]/10 text-[#3DAA6E]',
  high: 'bg-[#D4A843]/10 text-[#D4A843]',
  critical: 'bg-[#E05252]/10 text-[#E05252]',
};

const STATUS_STYLE: Record<ReviewQueueStatus, string> = {
  pending_review: 'bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/30',
  in_review: 'bg-[#4A90D9]/10 text-[#4A90D9] border-[#4A90D9]/30',
  approved: 'bg-[#3DAA6E]/10 text-[#3DAA6E] border-[#3DAA6E]/30',
  returned: 'bg-[#E05252]/10 text-[#E05252] border-[#E05252]/30',
};

const STATUS_LABELS: Record<ReviewQueueStatus, string> = {
  pending_review: 'Pending Review',
  in_review: 'In Review',
  approved: 'Approved',
  returned: 'Returned',
};

const ARCHETYPE_LABELS: Record<string, string> = {
  ai_transformation: 'AI Transformation',
  delivery_standardization: 'Delivery Standardization',
  execution_stall: 'Execution Stall',
  operating_model: 'Operating Model',
  sponsor_misalignment: 'Sponsor Misalignment',
};

const MOCK_QUEUE: ReviewQueueItem[] = [
  { id: 'rq1', clientName: 'Meridian Industrial Group', archetype: 'ai_transformation', submittedBy: 'Aubrey Huang', submittedAt: '2026-04-13T08:30:00Z', urgency: 'high', flagCount: 7, status: 'pending_review' },
  { id: 'rq2', clientName: 'Vantage Capital Partners', archetype: 'execution_stall', submittedBy: 'Jordan Lee', submittedAt: '2026-04-12T14:15:00Z', urgency: 'critical', flagCount: 3, status: 'in_review' },
  { id: 'rq3', clientName: 'Apex Professional Services', archetype: 'delivery_standardization', submittedBy: 'Sam Rivera', submittedAt: '2026-04-11T10:00:00Z', urgency: 'standard', flagCount: 3, status: 'approved' },
  { id: 'rq4', clientName: 'Orion Healthcare Systems', archetype: 'operating_model', submittedBy: 'Taylor Kim', submittedAt: '2026-04-10T16:45:00Z', urgency: 'high', flagCount: 3, status: 'returned', notes: 'Clinical governance review required before approval.' },
  { id: 'rq5', clientName: 'Stratos Energy Group', archetype: 'sponsor_misalignment', submittedBy: 'Morgan Chen', submittedAt: '2026-04-09T09:00:00Z', urgency: 'critical', flagCount: 3, status: 'pending_review' },
];

export default function SeniorReviewerView() {
  const [queue, setQueue] = useState<ReviewQueueItem[]>(MOCK_QUEUE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});
  const [showReturnInput, setShowReturnInput] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReviewQueueStatus | 'all'>('all');

  function updateStatus(id: string, status: ReviewQueueStatus, notes?: string) {
    setQueue((prev) => prev.map((item) => item.id === id ? { ...item, status, notes } : item));
    setShowReturnInput(null);
    if (status === 'approved') {
      toast.success('Starter pack approved', { description: 'Consultant has been notified.' });
    } else if (status === 'returned') {
      toast.info('Pack returned for revision', { description: 'Consultant has been notified with your notes.' });
    } else if (status === 'in_review') {
      toast.info('Pack marked as in review');
    }
  }

  const filtered = filterStatus === 'all' ? queue : queue.filter((q) => q.status === filterStatus);
  const pendingCount = queue.filter((q) => q.status === 'pending_review').length;
  const inReviewCount = queue.filter((q) => q.status === 'in_review').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: pendingCount, color: '#D4A843' },
          { label: 'In Review', value: inReviewCount, color: '#4A90D9' },
          { label: 'Approved', value: queue.filter((q) => q.status === 'approved').length, color: '#3DAA6E' },
          { label: 'Returned', value: queue.filter((q) => q.status === 'returned').length, color: '#E05252' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#152338] border border-[#1F3550] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold" style={{ color: stat.color, fontFamily: 'Georgia, serif' }}>{stat.value}</p>
            <p className="text-xs text-[#7A90A8] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending_review', 'in_review', 'approved', 'returned'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              filterStatus === status
                ? 'bg-[#D4A843] text-[#0D1B2E]'
                : 'border border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5]'
            }`}
          >
            {status === 'all' ? 'All' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Queue */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-[#152338] border rounded-xl overflow-hidden transition-all duration-200 ${
              item.status === 'pending_review' ? 'border-[#D4A843]/30' :
              item.status === 'in_review' ? 'border-[#4A90D9]/30' :
              item.status === 'approved' ? 'border-[#3DAA6E]/20' :
              'border-[#E05252]/20'
            }`}
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-[#E8EDF5] text-base">{item.clientName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCY_STYLE[item.urgency]}`}>
                      {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${STATUS_STYLE[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A90A8]">
                    {ARCHETYPE_LABELS[item.archetype]} · Submitted by {item.submittedBy} · {new Date(item.submittedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[#7A90A8] mt-1">
                    <span className="text-[#D4A843] font-medium">{item.flagCount} flags</span> require senior validation
                  </p>
                  {item.notes && (
                    <div className="mt-2 p-2 bg-[#E05252]/10 border border-[#E05252]/20 rounded-lg">
                      <p className="text-xs text-[#E05252] font-medium">Return Notes:</p>
                      <p className="text-xs text-[#E8EDF5] mt-0.5">{item.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  {item.status === 'pending_review' && (
                    <button
                      onClick={() => updateStatus(item.id, 'in_review')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#4A90D9]/15 text-[#4A90D9] border border-[#4A90D9]/30 hover:bg-[#4A90D9]/25 transition-all duration-200"
                    >
                      <Eye className="w-3 h-3" /> Start Review
                    </button>
                  )}
                  {(item.status === 'pending_review' || item.status === 'in_review') && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#3DAA6E]/15 text-[#3DAA6E] border border-[#3DAA6E]/30 hover:bg-[#3DAA6E]/25 transition-all duration-200"
                      >
                        <CheckCircle className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => setShowReturnInput((prev) => (prev === item.id ? null : item.id))}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/30 hover:bg-[#E05252]/25 transition-all duration-200"
                      >
                        <RotateCcw className="w-3 h-3" /> Return
                      </button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <span className="flex items-center gap-1 text-xs text-[#3DAA6E] font-medium">
                      <CheckCircle className="w-3 h-3" /> Approved
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Return Notes Input */}
            {showReturnInput === item.id && (
              <div className="border-t border-[#1F3550] p-5 bg-[#0D1B2E]/40">
                <p className="text-xs font-semibold text-[#E05252] mb-3 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Return Notes
                </p>
                <textarea
                  rows={2}
                  placeholder="Explain what needs to be revised before approval..."
                  value={returnNotes[item.id] || ''}
                  onChange={(e) => setReturnNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-xs focus:outline-none focus:border-[#E05252]/60 transition-all duration-200 resize-none"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(item.id, 'returned', returnNotes[item.id])}
                    disabled={!returnNotes[item.id]?.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#E05252] text-white hover:bg-[#c94444] transition-all duration-200 disabled:opacity-50"
                  >
                    Return for Revision
                  </button>
                  <button
                    onClick={() => setShowReturnInput(null)}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-[#1F3550] text-[#7A90A8] hover:text-[#E8EDF5] transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#7A90A8]">
            <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No items in this queue</p>
          </div>
        )}
      </div>
    </div>
  );
}
