import { useState } from 'react';
import type { AdminUser, AuditLogEntry, AuditActionType, AuditSeverity, RoleAccessPolicy, UserRole } from '@shared/types/api';
import { UserPlus, Edit2, Shield, Activity, Users, Search, Lock, Eye, AlertTriangle, Info, CheckCircle, Download, Filter, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 'users' | 'audit' | 'role_access';

const ROLE_LABELS: Record<UserRole, string> = {
  consultant: 'Consultant',
  senior_reviewer: 'Senior Reviewer',
  knowledge_manager: 'Knowledge Manager',
  admin: 'Admin',
};

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  consultant: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  senior_reviewer: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  knowledge_manager: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  admin: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

const ACTION_SEVERITY: Record<AuditActionType, AuditSeverity> = {
  GENERATE_STARTER_PACK: 'info',
  APPROVE_FLAG: 'info',
  FEEDBACK_LOGGED: 'info',
  UNDO_FEEDBACK: 'warning',
  EXPORT_STARTER_PACK: 'info',
  APPROVE_REVIEW_QUEUE: 'info',
  RETURN_REVIEW_QUEUE: 'warning',
  REINDEX_ASSET: 'info',
  UPDATE_USER_ROLE: 'critical',
  DEACTIVATE_USER: 'critical',
  ACTIVATE_USER: 'warning',
  DRIVE_SYNC: 'info',
  AI_CLASSIFY: 'info',
  AI_GENERATE: 'info',
  LOGIN: 'info',
  LOGOUT: 'info',
};

const SEVERITY_STYLE: Record<AuditSeverity, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-blue-500/8',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    icon: <Info className="w-3 h-3" />,
  },
  warning: {
    bg: 'bg-orange-500/8',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  critical: {
    bg: 'bg-red-500/8',
    text: 'text-red-400',
    border: 'border-red-500/20',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
};

const ACTION_LABELS: Record<AuditActionType, string> = {
  GENERATE_STARTER_PACK: 'Generate Pack',
  APPROVE_FLAG: 'Approve Flag',
  FEEDBACK_LOGGED: 'Log Feedback',
  UNDO_FEEDBACK: 'Undo Feedback',
  EXPORT_STARTER_PACK: 'Export Pack',
  APPROVE_REVIEW_QUEUE: 'Approve Review',
  RETURN_REVIEW_QUEUE: 'Return Review',
  REINDEX_ASSET: 'Reindex Asset',
  UPDATE_USER_ROLE: 'Update Role',
  DEACTIVATE_USER: 'Deactivate User',
  ACTIVATE_USER: 'Activate User',
  DRIVE_SYNC: 'Drive Sync',
  AI_CLASSIFY: 'AI Classify',
  AI_GENERATE: 'AI Generate',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
};

const MOCK_USERS: AdminUser[] = [
  { id: '1', name: 'Aubrey Huang', email: 'aubrey@cgsadvisors.com', role: 'consultant', title: 'Senior Consultant', practiceArea: 'Digital Transformation', lastActive: '2026-04-13T08:30:00Z', status: 'active' },
  { id: '2', name: 'Marcus Chen', email: 'marcus@cgsadvisors.com', role: 'senior_reviewer', title: 'Principal', practiceArea: 'Strategy', lastActive: '2026-04-13T07:15:00Z', status: 'active' },
  { id: '3', name: 'Priya Nair', email: 'priya@cgsadvisors.com', role: 'knowledge_manager', title: 'Knowledge Manager', practiceArea: 'Knowledge Management', lastActive: '2026-04-12T16:00:00Z', status: 'active' },
  { id: '4', name: 'James Okafor', email: 'james@cgsadvisors.com', role: 'admin', title: 'Platform Admin', practiceArea: 'Operations', lastActive: '2026-04-13T09:00:00Z', status: 'active' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@cgsadvisors.com', role: 'consultant', title: 'Consultant', practiceArea: 'Technology Advisory', lastActive: '2026-04-12T14:00:00Z', status: 'active' },
  { id: '6', name: 'Sam Rivera', email: 'sam@cgsadvisors.com', role: 'consultant', title: 'Associate Consultant', practiceArea: 'Change Management', lastActive: '2026-04-11T10:00:00Z', status: 'inactive' },
];

const MOCK_AUDIT: AuditLogEntry[] = [
  { id: 'al1', userId: '1', userName: 'Aubrey Huang', userRole: 'consultant', action: 'LOGIN', resource: 'System', timestamp: '2026-04-13T08:00:00Z', details: 'SSO login via CGS corporate email', severity: 'info', ipAddress: '10.0.1.42', sessionId: 'sess_a1b2c3', immutable: true },
  { id: 'al2', userId: '1', userName: 'Aubrey Huang', userRole: 'consultant', action: 'GENERATE_STARTER_PACK', resource: 'Meridian Industrial Group', timestamp: '2026-04-13T08:45:00Z', details: 'Archetype: ai_transformation · Confidence: 91%', severity: 'info', ipAddress: '10.0.1.42', sessionId: 'sess_a1b2c3', immutable: true },
  { id: 'al3', userId: '1', userName: 'Aubrey Huang', userRole: 'consultant', action: 'APPROVE_FLAG', resource: 'Flag: Talent gap framing', timestamp: '2026-04-13T08:50:00Z', details: 'Section: Issue Tree · Severity: High', severity: 'info', ipAddress: '10.0.1.42', sessionId: 'sess_a1b2c3', immutable: true },
  { id: 'al4', userId: '1', userName: 'Aubrey Huang', userRole: 'consultant', action: 'FEEDBACK_LOGGED', resource: 'Flag: Overclaim on ROI', timestamp: '2026-04-13T08:55:00Z', details: 'Feedback: Reduce overclaiming on ROI projections', severity: 'info', ipAddress: '10.0.1.42', sessionId: 'sess_a1b2c3', immutable: true },
  { id: 'al5', userId: '2', userName: 'Marcus Chen', userRole: 'senior_reviewer', action: 'APPROVE_REVIEW_QUEUE', resource: 'Apex Professional Services', timestamp: '2026-04-12T15:30:00Z', details: 'Status: Approved · 3 flags validated', severity: 'info', ipAddress: '10.0.2.18', sessionId: 'sess_d4e5f6', immutable: true },
  { id: 'al6', userId: '3', userName: 'Priya Nair', userRole: 'knowledge_manager', action: 'REINDEX_ASSET', resource: 'Change Readiness Diagnostic.docx', timestamp: '2026-04-12T11:00:00Z', details: 'Chunks: 22 · Version: 3', severity: 'info', ipAddress: '10.0.3.77', sessionId: 'sess_g7h8i9', immutable: true },
  { id: 'al7', userId: '3', userName: 'Priya Nair', userRole: 'knowledge_manager', action: 'DRIVE_SYNC', resource: 'CGS Firm Library', timestamp: '2026-04-12T11:30:00Z', details: 'Files: 14 processed · Chunks: 187 created', severity: 'info', ipAddress: '10.0.3.77', sessionId: 'sess_g7h8i9', immutable: true },
  { id: 'al8', userId: '1', userName: 'Aubrey Huang', userRole: 'consultant', action: 'EXPORT_STARTER_PACK', resource: 'Meridian Industrial Group', timestamp: '2026-04-13T09:15:00Z', details: '5 files exported · Google Drive + Local', severity: 'info', ipAddress: '10.0.1.42', sessionId: 'sess_a1b2c3', immutable: true },
  { id: 'al9', userId: '2', userName: 'Marcus Chen', userRole: 'senior_reviewer', action: 'RETURN_REVIEW_QUEUE', resource: 'Orion Healthcare Systems', timestamp: '2026-04-10T17:00:00Z', details: 'Clinical governance review required', severity: 'warning', ipAddress: '10.0.2.18', sessionId: 'sess_j1k2l3', immutable: true },
  { id: 'al10', userId: '4', userName: 'James Okafor', userRole: 'admin', action: 'UPDATE_USER_ROLE', resource: 'Jordan Lee', timestamp: '2026-04-09T10:00:00Z', details: 'Role changed: associate → consultant', severity: 'critical', ipAddress: '10.0.4.99', sessionId: 'sess_m4n5o6', immutable: true },
  { id: 'al11', userId: '4', userName: 'James Okafor', userRole: 'admin', action: 'ACTIVATE_USER', resource: 'Sam Rivera', timestamp: '2026-04-08T09:00:00Z', details: 'Account reactivated after leave', severity: 'warning', ipAddress: '10.0.4.99', sessionId: 'sess_p7q8r9', immutable: true },
  { id: 'al12', userId: '1', userName: 'Aubrey Huang', userRole: 'consultant', action: 'AI_GENERATE', resource: 'Meridian Industrial Group', timestamp: '2026-04-13T08:44:00Z', details: 'Model: GPT-4o · Tokens: 4,821 · Latency: 3.2s', severity: 'info', ipAddress: '10.0.1.42', sessionId: 'sess_a1b2c3', immutable: true },
];

const ROLE_ACCESS_POLICIES: RoleAccessPolicy[] = [
  {
    role: 'consultant',
    permissions: [
      'Submit engagement brief',
      'Activate knowledge base',
      'Generate starter pack',
      'Run Wear-Test review',
      'Approve / log feedback on flags',
      'Export starter pack (local + Drive)',
      'View own engagement history',
    ],
    restrictedActions: [
      'Access senior reviewer queue',
      'Manage knowledge assets',
      'View other consultants\' engagements',
      'Modify user roles',
      'View full audit log',
    ],
    dataScope: 'Own engagements only · Permission-filtered Drive files',
    description: 'Full four-step engagement workflow with export capabilities. Data access scoped to own engagements and Drive files the user has been granted access to.',
  },
  {
    role: 'senior_reviewer',
    permissions: [
      'All Consultant permissions',
      'Access senior reviewer queue',
      'Approve starter packs for client use',
      'Return packs with revision notes',
      'Annotate AI-generated sections',
      'View all submitted engagements',
    ],
    restrictedActions: [
      'Manage knowledge assets',
      'Modify user roles',
      'View full audit log',
      'Access admin panel',
    ],
    dataScope: 'All submitted engagements · Firm Library read access',
    description: 'Extends Consultant access with a dedicated review queue for validating AI-generated starter packs before client-facing use.',
  },
  {
    role: 'knowledge_manager',
    permissions: [
      'Manage ingestion pipeline',
      'Designate Drive folders (Firm Library / Client)',
      'Tag and classify knowledge assets',
      'Manage archetype bundles',
      'Monitor index health',
      'Trigger manual re-sync',
      'View ingestion logs',
    ],
    restrictedActions: [
      'Access engagement workflow',
      'View consultant engagements',
      'Modify user roles',
      'View full audit log',
    ],
    dataScope: 'Firm Library assets · Ingestion pipeline · Index health metrics',
    description: 'Dedicated knowledge base administration role. Cannot access engagement workflow or user management. Focused on maintaining knowledge quality and ingestion pipeline health.',
  },
  {
    role: 'admin',
    permissions: [
      'All permissions across all roles',
      'Assign and update user roles',
      'Activate / deactivate user accounts',
      'View full immutable audit log',
      'Export audit log',
      'Configure system settings',
      'Monitor pipeline and AI usage',
    ],
    restrictedActions: [],
    dataScope: 'Full system access · All engagements · All audit records',
    description: 'Full system administration access. All actions are logged to the immutable audit trail. Role changes and user management actions are flagged as critical severity.',
  },
];

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [auditFilter, setAuditFilter] = useState<AuditSeverity | 'all'>('all');
  const [auditRoleFilter, setAuditRoleFilter] = useState<UserRole | 'all'>('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<UserRole | null>('consultant');

  const TABS = [
    { id: 'users' as AdminTab, label: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'audit' as AdminTab, label: 'Audit Log', icon: <Activity className="w-4 h-4" /> },
    { id: 'role_access' as AdminTab, label: 'Role Access', icon: <Lock className="w-4 h-4" /> },
  ];

  function updateRole(userId: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
    setEditingRole(null);
    toast.success('Role updated', { description: `User role has been updated to ${ROLE_LABELS[role]}.` });
  }

  function toggleStatus(userId: string) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    toast.success('User status updated');
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudit = MOCK_AUDIT.filter((e) => {
    const severityMatch = auditFilter === 'all' || e.severity === auditFilter;
    const roleMatch = auditRoleFilter === 'all' || e.userRole === auditRoleFilter;
    return severityMatch && roleMatch;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const criticalCount = MOCK_AUDIT.filter((e) => e.severity === 'critical').length;
  const warningCount = MOCK_AUDIT.filter((e) => e.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: '#E8EDF5', sub: 'registered' },
          { label: 'Active', value: users.filter((u) => u.status === 'active').length, color: '#3DAA6E', sub: 'accounts' },
          { label: 'Audit Events', value: MOCK_AUDIT.length, color: '#D4A843', sub: 'immutable' },
          { label: 'Critical Actions', value: criticalCount, color: '#E05252', sub: 'flagged' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#152338] border border-[#1F3550] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold" style={{ color: stat.color, fontFamily: 'Georgia, serif' }}>{stat.value}</p>
            <p className="text-xs text-[#7A90A8] mt-1">{stat.label}</p>
            <p className="text-xs text-[#7A90A8]/60">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-[#152338] border border-[#1F3550] rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-[#D4A843] text-[#0D1B2E] font-semibold shadow-sm'
                : 'text-[#7A90A8] hover:text-[#E8EDF5] hover:bg-[#1F3550]/40'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── User Management ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A90A8]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg pl-9 pr-4 py-2.5 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => toast.info('Invite user', { description: 'SSO invitation flow would be triggered here.' })}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Invite User
            </button>
          </div>

          <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
            <div className="divide-y divide-[#1F3550]">
              {filteredUsers.map((user) => {
                const rc = ROLE_COLORS[user.role];
                return (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-[#1F3550]/20 transition-all duration-150">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#2D5282] flex items-center justify-center text-sm font-bold text-[#D4A843] flex-shrink-0">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#E8EDF5]">{user.name}</p>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.status === 'active' ? 'bg-[#3DAA6E]' : 'bg-[#7A90A8]'}`} />
                        </div>
                        <p className="text-xs text-[#7A90A8] truncate">{user.email}</p>
                        {user.title && <p className="text-xs text-[#7A90A8]">{user.title} · {user.practiceArea}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {editingRole === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                          onBlur={() => setEditingRole(null)}
                          autoFocus
                          className="bg-[#0D1B2E] border border-[#D4A843]/60 rounded-lg px-3 py-1.5 text-[#E8EDF5] text-xs focus:outline-none"
                        >
                          {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${rc.bg} ${rc.text} ${rc.border}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      )}
                      <button
                        onClick={() => setEditingRole(user.id)}
                        className="p-1.5 rounded-lg hover:bg-[#1F3550] text-[#7A90A8] hover:text-[#D4A843] transition-all duration-200"
                        title="Edit role"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          user.status === 'active'
                            ? 'hover:bg-[#E05252]/10 text-[#7A90A8] hover:text-[#E05252]'
                            : 'hover:bg-[#3DAA6E]/10 text-[#7A90A8] hover:text-[#3DAA6E]'
                        }`}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Audit Log ── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Immutability Banner */}
          <div className="flex items-start gap-3 p-4 bg-[#D4A843]/8 border border-[#D4A843]/25 rounded-xl">
            <Lock className="w-4 h-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#D4A843]">Immutable Audit Trail</p>
              <p className="text-xs text-[#7A90A8] mt-0.5">
                All entries are write-once and cryptographically sealed. No entry can be modified or deleted after creation.
                This log captures every retrieval query, generation request, human review decision, feedback item, revision, and export action.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-[#7A90A8] flex items-center gap-1"><Filter className="w-3 h-3" /> Severity:</span>
              {(['all', 'info', 'warning', 'critical'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setAuditFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    auditFilter === s
                      ? s === 'all' ? 'bg-[#D4A843] text-[#0D1B2E]'
                        : s === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : s === 'warning' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'border border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5]'
                  }`}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-[#7A90A8] flex items-center gap-1">Role:</span>
              {(['all', 'consultant', 'senior_reviewer', 'knowledge_manager', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAuditRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    auditRoleFilter === r
                      ? 'bg-[#D4A843] text-[#0D1B2E]'
                      : 'border border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5]'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : ROLE_LABELS[r as UserRole]}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => toast.success('Audit log exported', { description: 'CSV file downloaded.' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1F3550] text-[#7A90A8] hover:border-[#D4A843]/40 hover:text-[#E8EDF5] transition-all duration-200"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button
                onClick={() => toast.info('Refreshed', { description: 'Audit log is up to date.' })}
                className="p-1.5 rounded-lg border border-[#1F3550] text-[#7A90A8] hover:text-[#E8EDF5] transition-all duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Summary Chips */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152338] border border-[#1F3550]">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-[#7A90A8]">{MOCK_AUDIT.filter((e) => e.severity === 'info').length} Info</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152338] border border-[#1F3550]">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-xs text-[#7A90A8]">{warningCount} Warning</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152338] border border-[#1F3550]">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-[#7A90A8]">{criticalCount} Critical</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152338] border border-[#1F3550]">
              <Lock className="w-3 h-3 text-[#D4A843]" />
              <span className="text-xs text-[#D4A843] font-medium">{MOCK_AUDIT.length} Immutable</span>
            </div>
          </div>

          {/* Log Entries */}
          <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-[#1F3550] bg-[#0D1B2E]/40">
              <div className="col-span-1 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Sev</div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Timestamp</div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">User</div>
              <div className="col-span-1 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Role</div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Action</div>
              <div className="col-span-3 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Resource</div>
              <div className="col-span-1 text-xs font-semibold uppercase tracking-widest text-[#7A90A8]">Seal</div>
            </div>

            <div className="divide-y divide-[#1F3550]">
              {filteredAudit.map((entry) => {
                const sev = SEVERITY_STYLE[entry.severity];
                const rc = ROLE_COLORS[entry.userRole];
                const isExpanded = expandedEntry === entry.id;
                return (
                  <div key={entry.id} className={`transition-all duration-150 ${sev.bg} hover:bg-[#1F3550]/30`}>
                    {/* Main Row */}
                    <button
                      className="w-full text-left"
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    >
                      <div className="flex md:grid md:grid-cols-12 gap-2 md:gap-3 px-5 py-3.5 items-start md:items-center">
                        {/* Severity */}
                        <div className="col-span-1 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${sev.text}`}>
                            {sev.icon}
                            <span className="hidden md:inline capitalize">{entry.severity}</span>
                          </span>
                        </div>

                        {/* Timestamp */}
                        <div className="col-span-2 flex-shrink-0">
                          <p className="text-xs text-[#E8EDF5] font-mono">
                            {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                          </p>
                          <p className="text-xs text-[#7A90A8] font-mono">
                            {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>

                        {/* User */}
                        <div className="col-span-2 min-w-0">
                          <p className="text-xs font-medium text-[#E8EDF5] truncate">{entry.userName}</p>
                        </div>

                        {/* Role */}
                        <div className="col-span-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${rc.bg} ${rc.text}`}>
                            {entry.userRole === 'knowledge_manager' ? 'KM' :
                             entry.userRole === 'senior_reviewer' ? 'SR' :
                             entry.userRole === 'consultant' ? 'Con' : 'Adm'}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="col-span-2">
                          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${sev.bg} ${sev.text} ${sev.border}`}>
                            {ACTION_LABELS[entry.action]}
                          </span>
                        </div>

                        {/* Resource */}
                        <div className="col-span-3 min-w-0">
                          <p className="text-xs text-[#E8EDF5] truncate">{entry.resource}</p>
                        </div>

                        {/* Immutable seal */}
                        <div className="col-span-1 flex items-center gap-1">
                          {entry.immutable && (
                            <span className="flex items-center gap-1 text-xs text-[#3DAA6E]">
                              <Lock className="w-3 h-3" />
                              <span className="hidden lg:inline">Sealed</span>
                            </span>
                          )}
                          {isExpanded ? <ChevronDown className="w-3 h-3 text-[#7A90A8] ml-auto" /> : <ChevronRight className="w-3 h-3 text-[#7A90A8] ml-auto" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-4 border-t border-[#1F3550]/50">
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {entry.details && (
                            <div className="sm:col-span-2 bg-[#0D1B2E]/60 rounded-lg p-3">
                              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-1">Details</p>
                              <p className="text-xs text-[#E8EDF5]">{entry.details}</p>
                            </div>
                          )}
                          {entry.ipAddress && (
                            <div className="bg-[#0D1B2E]/60 rounded-lg p-3">
                              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-1">IP Address</p>
                              <p className="text-xs font-mono text-[#E8EDF5]">{entry.ipAddress}</p>
                            </div>
                          )}
                          {entry.sessionId && (
                            <div className="bg-[#0D1B2E]/60 rounded-lg p-3">
                              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-1">Session ID</p>
                              <p className="text-xs font-mono text-[#E8EDF5]">{entry.sessionId}</p>
                            </div>
                          )}
                          <div className="bg-[#0D1B2E]/60 rounded-lg p-3">
                            <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-1">Full Timestamp</p>
                            <p className="text-xs font-mono text-[#E8EDF5]">{new Date(entry.timestamp).toISOString()}</p>
                          </div>
                          <div className="bg-[#0D1B2E]/60 rounded-lg p-3">
                            <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-1">Audit ID</p>
                            <p className="text-xs font-mono text-[#E8EDF5]">{entry.id}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredAudit.length === 0 && (
              <div className="text-center py-10 text-[#7A90A8]">
                <Activity className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No audit entries match the current filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Role Access Panel ── */}
      {activeTab === 'role_access' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3 p-4 bg-[#152338] border border-[#1F3550] rounded-xl">
            <Lock className="w-4 h-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#E8EDF5]">Permission-Aware Access Control</p>
              <p className="text-xs text-[#7A90A8] mt-0.5">
                All retrieval queries are filtered server-side by user role and Drive file permissions.
                Firm Library and Current Client Folder sources are strictly separated throughout ingestion, retrieval, and generation.
                Role assignments are logged as critical-severity audit events.
              </p>
            </div>
          </div>

          {/* Role Cards */}
          <div className="space-y-3">
            {ROLE_ACCESS_POLICIES.map((policy) => {
              const rc = ROLE_COLORS[policy.role];
              const isExpanded = expandedRole === policy.role;
              return (
                <div
                  key={policy.role}
                  className={`bg-[#152338] border rounded-xl overflow-hidden transition-all duration-200 ${
                    isExpanded ? `${rc.border} border` : 'border-[#1F3550]'
                  }`}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedRole(isExpanded ? null : policy.role)}
                  >
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rc.bg}`}>
                          <Shield className={`w-4 h-4 ${rc.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#E8EDF5]">{ROLE_LABELS[policy.role]}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${rc.bg} ${rc.text} ${rc.border}`}>
                              {policy.permissions.length} permissions
                            </span>
                            {policy.restrictedActions.length === 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30">
                                Full Access
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7A90A8] mt-0.5">{policy.dataScope}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-[#7A90A8]" /> : <ChevronRight className="w-4 h-4 text-[#7A90A8]" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#1F3550] px-5 py-4 space-y-4">
                      <p className="text-xs text-[#7A90A8] leading-relaxed">{policy.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Permissions */}
                        <div>
                          <p className="text-xs font-semibold text-[#3DAA6E] uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Granted Permissions
                          </p>
                          <div className="space-y-1.5">
                            {policy.permissions.map((perm, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3DAA6E] flex-shrink-0 mt-1.5" />
                                <p className="text-xs text-[#E8EDF5]">{perm}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Restrictions */}
                        <div>
                          <p className="text-xs font-semibold text-[#E05252] uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Restricted Actions
                          </p>
                          {policy.restrictedActions.length === 0 ? (
                            <div className="flex items-center gap-2 p-3 bg-[#D4A843]/8 border border-[#D4A843]/20 rounded-lg">
                              <Shield className="w-3.5 h-3.5 text-[#D4A843]" />
                              <p className="text-xs text-[#D4A843]">No restrictions — full system access</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {policy.restrictedActions.map((action, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E05252] flex-shrink-0 mt-1.5" />
                                  <p className="text-xs text-[#7A90A8]">{action}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Data Scope */}
                      <div className="p-3 bg-[#0D1B2E]/60 border border-[#1F3550] rounded-lg">
                        <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-1">Data Scope</p>
                        <p className="text-xs text-[#E8EDF5]">{policy.dataScope}</p>
                      </div>

                      {/* Users with this role */}
                      <div>
                        <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-wider mb-2">Users with this role</p>
                        <div className="flex flex-wrap gap-2">
                          {MOCK_USERS.filter((u) => u.role === policy.role).map((u) => (
                            <div key={u.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0D1B2E] border border-[#1F3550] rounded-lg">
                              <div className="w-5 h-5 rounded-full bg-[#2D5282] flex items-center justify-center text-xs font-bold text-[#D4A843]">
                                {u.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="text-xs text-[#E8EDF5]">{u.name}</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-[#3DAA6E]' : 'bg-[#7A90A8]'}`} />
                            </div>
                          ))}
                          {MOCK_USERS.filter((u) => u.role === policy.role).length === 0 && (
                            <p className="text-xs text-[#7A90A8]">No users assigned</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Architecture Note */}
          <div className="p-4 bg-[#152338] border border-[#1F3550] rounded-xl">
            <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">Security Architecture</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  title: 'Server-Side Enforcement',
                  desc: 'All permission checks happen at the API layer. The frontend never receives data the user is not authorized to see.',
                  icon: <Shield className="w-4 h-4 text-[#3DAA6E]" />,
                },
                {
                  title: 'Source Separation',
                  desc: 'Firm Library and Client Folder sources are strictly separated throughout ingestion, retrieval, and generation — never cross-attributed.',
                  icon: <Lock className="w-4 h-4 text-[#D4A843]" />,
                },
                {
                  title: 'Immutable Audit Trail',
                  desc: 'Every action is written to an append-only audit log. Role changes and user management actions are flagged as critical severity.',
                  icon: <Activity className="w-4 h-4 text-[#4A90D9]" />,
                },
              ].map((item) => (
                <div key={item.title} className="bg-[#0D1B2E] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <p className="text-xs font-semibold text-[#E8EDF5]">{item.title}</p>
                  </div>
                  <p className="text-xs text-[#7A90A8] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
