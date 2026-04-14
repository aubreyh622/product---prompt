import { useState, useEffect } from 'react';
import type { User, EngagementBrief, KnowledgeActivationData, StarterPack, WearTestData } from '@shared/types/api';
import { Toaster } from '@/components/ui/sonner';
import OmniflowBadge from '@/components/custom/OmniflowBadge';
import LoginScreen from '@/components/custom/LoginScreen';
import ProfileSetup from '@/components/custom/ProfileSetup';
import BriefIntake from '@/components/custom/BriefIntake';
import KnowledgeActivation from '@/components/custom/KnowledgeActivation';
import StarterPackView from '@/components/custom/StarterPackView';
import WearTestReview from '@/components/custom/WearTestReview';
import KnowledgeManagerView from '@/components/custom/KnowledgeManagerView';
import SeniorReviewerView from '@/components/custom/SeniorReviewerView';
import AdminView from '@/components/custom/AdminView';
import GoogleDrivePanel from '@/components/custom/GoogleDrivePanel';
import ChatGPTPanel from '@/components/custom/ChatGPTPanel';
import { getKnowledgeData, generateStarterPack, generateWearTestData } from '@/lib/mockData';
import { generateHypotheses, generateProblemStatement, generateExecSummary } from '@/lib/engagementApi';
import { DEMO_MODE } from '@/config/constants';
import { toast } from 'sonner';
import { Menu, X, ChevronRight, LogOut, Library, Users, ClipboardList, LayoutDashboard, Plug, Shield } from 'lucide-react';

type AppStep = 1 | 2 | 3 | 4;
type AppScreen = 'login' | 'profile' | 'app';
type RoleView = 'consultant' | 'senior_reviewer' | 'knowledge_manager' | 'admin' | 'integrations';

// CGS Bright Orange palette
const C = {
  bg: '#F8F9FB',
  surface: '#FFFFFF',
  surface2: '#F3F4F6',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  orange: '#EA6C1A',
  orangeHover: '#D45F14',
  orangeLight: '#FEF3EC',
  orangeBorder: '#FDDCBF',
  text: '#111827',
  textMid: '#374151',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  green: '#059669',
  greenLight: '#ECFDF5',
  greenBorder: '#A7F3D0',
  red: '#DC2626',
  redLight: '#FEF2F2',
  redBorder: '#FECACA',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  blueBorder: '#BFDBFE',
  amber: '#D97706',
  amberLight: '#FFFBEB',
  amberBorder: '#FDE68A',
  navy: '#1E3A5F',
};

const STEPS = [
  { id: 1 as AppStep, label: 'Brief Intake', short: 'Brief' },
  { id: 2 as AppStep, label: 'Knowledge', short: 'Knowledge' },
  { id: 3 as AppStep, label: 'Starter Pack', short: 'Pack' },
  { id: 4 as AppStep, label: 'Wear-Test', short: 'Review' },
];

const ROLE_LABELS: Record<string, string> = {
  consultant: 'Consultant',
  senior_reviewer: 'Senior Reviewer',
  knowledge_manager: 'Knowledge Manager',
  admin: 'Admin',
};

const ROLE_NAV_ITEMS: Record<RoleView, { label: string; icon: React.ReactNode }> = {
  consultant: { label: 'Engagement Workflow', icon: <LayoutDashboard className="w-4 h-4" /> },
  senior_reviewer: { label: 'Review Queue', icon: <ClipboardList className="w-4 h-4" /> },
  knowledge_manager: { label: 'Knowledge Manager', icon: <Library className="w-4 h-4" /> },
  admin: { label: 'Admin Panel', icon: <Users className="w-4 h-4" /> },
  integrations: { label: 'Integrations', icon: <Plug className="w-4 h-4" /> },
};

export default function Index() {
  const [screen, setScreen] = useState<AppScreen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<AppStep>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleView, setActiveRoleView] = useState<RoleView>('consultant');

  // Auto-login in demo mode — skip the login screen entirely.
  useEffect(() => {
    if (DEMO_MODE && screen === 'login') {
      setUser({ id: '1', name: 'Aubrey Huang', email: 'aubrey@cgsadvisors.com', role: 'consultant', title: 'Senior Consultant', practiceArea: 'Digital Transformation', industryFocus: 'Industrial Manufacturing', profileComplete: true, createdAt: '2026-01-01' });
      setActiveRoleView('consultant');
      setScreen('app');
    }
  }, []);

  const [brief, setBrief] = useState<EngagementBrief | null>(null);
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeActivationData | null>(null);
  const [starterPack, setStarterPack] = useState<StarterPack | null>(null);
  const [wearTestData, setWearTestData] = useState<WearTestData | null>(null);
  const [generating, setGenerating] = useState(false);

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
    setActiveRoleView(loggedInUser.role as RoleView);
    if (!loggedInUser.profileComplete) {
      setScreen('profile');
    } else {
      setScreen('app');
    }
  }

  function handleProfileComplete(updatedUser: User) {
    setUser(updatedUser);
    setActiveRoleView(updatedUser.role as RoleView);
    setScreen('app');
  }

  function handleLogout() {
    setUser(null);
    setScreen('login');
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setBrief(null);
    setKnowledgeData(null);
    setStarterPack(null);
    setWearTestData(null);
    setActiveRoleView('consultant');
  }

  async function handleActivateKnowledge(activatedBrief: EngagementBrief) {
    setBrief(activatedBrief);
    const archetype = activatedBrief.archetype || 'ai_transformation';
    const baseKnowledge = getKnowledgeData(archetype);
    setKnowledgeData(baseKnowledge);
    setCompletedSteps((prev) => new Set([...prev, 1]));
    setCurrentStep(2);

    // Fire-and-forget: replace mock hypotheses with AI-generated ones.
    try {
      const aiHypotheses = await generateHypotheses(activatedBrief);
      if (aiHypotheses.length > 0) {
        setKnowledgeData((prev) =>
          prev ? { ...prev, hypotheses: aiHypotheses } : { ...baseKnowledge, hypotheses: aiHypotheses },
        );
      }
    } catch (err) {
      console.error('Hypothesis generation failed:', err);
      // Keep mock hypotheses — no toast to avoid interrupting the demo.
    }
  }

  async function handleGeneratePack(updatedKnowledge: KnowledgeActivationData) {
    setKnowledgeData(updatedKnowledge);
    if (!brief) return;
    setGenerating(true);

    // Start from mock pack so non-AI sections (issue tree, workstreams, etc.) render.
    const basePack = generateStarterPack(brief);
    const wearTest = generateWearTestData(brief);
    const enabledFrameworkNames = updatedKnowledge.frameworks
      .filter((f) => f.enabled)
      .map((f) => f.name);

    try {
      const problemStatement = await generateProblemStatement(brief, enabledFrameworkNames);
      const execSummary = await generateExecSummary(brief, problemStatement);
      setStarterPack({
        ...basePack,
        problemStatement: problemStatement || basePack.problemStatement,
        execSummary: execSummary || basePack.execSummary,
      });
    } catch (err) {
      console.error('Starter pack generation failed:', err);
      toast.error('AI generation failed — showing draft content');
      setStarterPack(basePack);
    } finally {
      setWearTestData(wearTest);
      setGenerating(false);
      setCompletedSteps((prev) => new Set([...prev, 2]));
      setCurrentStep(3);
    }
  }

  function handleProceedToWearTest() {
    setCompletedSteps((prev) => new Set([...prev, 3]));
    setCurrentStep(4);
  }

  function navigateToStep(step: AppStep) {
    if (step === 1 || completedSteps.has((step - 1) as AppStep) || completedSteps.has(step)) {
      setCurrentStep(step);
      setMobileMenuOpen(false);
    }
  }

  const progressPercent = (currentStep / 4) * 100;

  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const isConsultant = activeRoleView === 'consultant' || activeRoleView === 'integrations';

  const roleViewMeta: Record<RoleView, { title: string; description: string }> = {
    consultant: {
      title: currentStep === 1 ? 'Brief Intake'
        : currentStep === 2 ? 'Knowledge Activation'
        : currentStep === 3 ? 'Starter Pack'
        : 'Wear-Test Review',
      description: currentStep === 1
        ? 'Provide engagement context to activate the right knowledge patterns from the CGS knowledge base.'
        : currentStep === 2
        ? 'Matched against CGS knowledge base — review and toggle assets before generating your starter pack.'
        : currentStep === 3
        ? 'AI-generated engagement materials — review each section and refine before export.'
        : 'Validate AI-generated assumptions and recommendations before exporting or sharing with your engagement team.',
    },
    senior_reviewer: {
      title: 'Review Queue',
      description: 'Validate AI-generated starter packs submitted by consultants before client-facing use.',
    },
    knowledge_manager: {
      title: 'Knowledge Manager',
      description: 'Manage the CGS knowledge base — monitor ingestion pipeline, curate assets, and maintain archetype bundles.',
    },
    admin: {
      title: 'Admin Panel',
      description: 'Manage user roles, permissions, review the full immutable audit log, and configure role access policies.',
    },
    integrations: {
      title: 'Integrations',
      description: 'Configure Google Drive for knowledge ingestion and the ChatGPT API for AI-powered generation, classification, and review.',
    },
  };

  if (screen === 'login') return <><LoginScreen onLogin={handleLogin} /><Toaster /></>;
  if (screen === 'profile' && user) return <><ProfileSetup user={user} onComplete={handleProfileComplete} /><Toaster /></>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}` }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: C.orange }}
              >
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg" style={{ color: C.navy, fontFamily: 'Georgia, serif' }}>CGS</span>
                <span className="text-xs ml-2 tracking-widest uppercase font-medium" style={{ color: C.textMuted }}>Delivery Copilot</span>
              </div>
              <div className="sm:hidden">
                <span className="font-bold text-base" style={{ color: C.navy, fontFamily: 'Georgia, serif' }}>CGS Copilot</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            {isConsultant ? (
              <nav className="hidden md:flex items-center gap-0.5" aria-label="Workflow steps">
                {STEPS.map((step, idx) => {
                  const isActive = currentStep === step.id && activeRoleView === 'consultant';
                  const isCompleted = completedSteps.has(step.id);
                  const isAccessible = step.id === 1 || completedSteps.has((step.id - 1) as AppStep) || completedSteps.has(step.id);
                  return (
                    <div key={step.id} className="flex items-center">
                      {idx > 0 && <div className="w-5 h-px mx-1" style={{ backgroundColor: C.border }} />}
                      <button
                        onClick={() => { setActiveRoleView('consultant'); navigateToStep(step.id); }}
                        disabled={!isAccessible}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: isActive ? C.orangeLight : 'transparent',
                          border: isActive ? `1px solid ${C.orangeBorder}` : '1px solid transparent',
                          opacity: !isAccessible ? 0.4 : 1,
                          cursor: !isAccessible ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            backgroundColor: isActive ? C.orange : isCompleted ? C.green : C.surface2,
                            color: isActive || isCompleted ? '#fff' : C.textMuted,
                          }}
                        >
                          {isCompleted && !isActive ? '✓' : step.id}
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: isActive ? C.orange : isCompleted ? C.text : C.textMuted }}
                        >
                          {step.label}
                        </span>
                      </button>
                    </div>
                  );
                })}
                <div className="w-5 h-px mx-1" style={{ backgroundColor: C.border }} />
                <button
                  onClick={() => setActiveRoleView('integrations')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: activeRoleView === 'integrations' ? C.blueLight : 'transparent',
                    border: activeRoleView === 'integrations' ? `1px solid ${C.blueBorder}` : '1px solid transparent',
                  }}
                >
                  <Plug className="w-4 h-4" style={{ color: activeRoleView === 'integrations' ? C.blue : C.textMuted }} />
                  <span className="text-sm font-medium" style={{ color: activeRoleView === 'integrations' ? C.blue : C.textMuted }}>Integrations</span>
                </button>
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-0.5">
                {(Object.keys(ROLE_NAV_ITEMS) as RoleView[]).filter((rv) => {
                  if (user?.role === 'admin') return true;
                  return rv === user?.role || rv === 'consultant' || rv === 'integrations';
                }).map((rv) => (
                  <button
                    key={rv}
                    onClick={() => setActiveRoleView(rv)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                    style={{
                      backgroundColor: activeRoleView === rv ? C.orangeLight : 'transparent',
                      border: activeRoleView === rv ? `1px solid ${C.orangeBorder}` : '1px solid transparent',
                      color: activeRoleView === rv ? C.orange : C.textMuted,
                      fontWeight: activeRoleView === rv ? 600 : 400,
                    }}
                  >
                    {ROLE_NAV_ITEMS[rv].icon}
                    <span>{ROLE_NAV_ITEMS[rv].label}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* Right: User + Mobile Menu */}
            <div className="flex items-center gap-3">
              {user?.role !== 'consultant' && (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => setActiveRoleView(
                      activeRoleView === 'consultant' || activeRoleView === 'integrations'
                        ? (user?.role as RoleView)
                        : 'consultant'
                    )}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
                    style={{
                      border: `1px solid ${C.border}`,
                      color: C.textMid,
                      backgroundColor: C.surface2,
                    }}
                  >
                    {activeRoleView === 'consultant' || activeRoleView === 'integrations'
                      ? `Switch to ${ROLE_LABELS[user?.role || 'consultant']}`
                      : 'Switch to Workflow'}
                  </button>
                </div>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-tight" style={{ color: C.text }}>{user?.name}</p>
                <p className="text-xs" style={{ color: C.textMuted }}>{user ? ROLE_LABELS[user.role] : ''}</p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm"
                style={{ backgroundColor: C.orange, color: '#fff' }}
              >
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1 text-xs transition-colors"
                style={{ color: C.textMuted }}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                className="md:hidden p-1 transition-colors"
                style={{ color: C.textMuted }}
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-4 py-3 space-y-1"
            style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}` }}
          >
            {isConsultant ? (
              STEPS.map((step) => {
                const isActive = currentStep === step.id && activeRoleView === 'consultant';
                const isCompleted = completedSteps.has(step.id);
                const isAccessible = step.id === 1 || completedSteps.has((step.id - 1) as AppStep) || completedSteps.has(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => { setActiveRoleView('consultant'); navigateToStep(step.id); }}
                    disabled={!isAccessible}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? C.orangeLight : 'transparent',
                      border: isActive ? `1px solid ${C.orangeBorder}` : '1px solid transparent',
                      opacity: !isAccessible ? 0.4 : 1,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: isActive ? C.orange : isCompleted ? C.green : C.surface2,
                        color: isActive || isCompleted ? '#fff' : C.textMuted,
                      }}
                    >
                      {isCompleted && !isActive ? '✓' : step.id}
                    </div>
                    <span className="text-sm font-medium" style={{ color: isActive ? C.orange : C.textMid }}>{step.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" style={{ color: C.textLight }} />
                  </button>
                );
              }).concat([
                <button
                  key="integrations"
                  onClick={() => { setActiveRoleView('integrations'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: activeRoleView === 'integrations' ? C.blueLight : 'transparent',
                    border: activeRoleView === 'integrations' ? `1px solid ${C.blueBorder}` : '1px solid transparent',
                  }}
                >
                  <Plug className="w-4 h-4" style={{ color: C.blue }} />
                  <span className="text-sm font-medium" style={{ color: activeRoleView === 'integrations' ? C.blue : C.textMid }}>Integrations</span>
                  <ChevronRight className="w-4 h-4 ml-auto" style={{ color: C.textLight }} />
                </button>,
              ])
            ) : (
              (Object.keys(ROLE_NAV_ITEMS) as RoleView[]).filter((rv) => {
                if (user?.role === 'admin') return true;
                return rv === user?.role || rv === 'consultant' || rv === 'integrations';
              }).map((rv) => (
                <button
                  key={rv}
                  onClick={() => { setActiveRoleView(rv); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: activeRoleView === rv ? C.orangeLight : 'transparent',
                    border: activeRoleView === rv ? `1px solid ${C.orangeBorder}` : '1px solid transparent',
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: activeRoleView === rv ? C.orange : C.textMid }}>
                    {ROLE_NAV_ITEMS[rv].label}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-auto" style={{ color: C.textLight }} />
                </button>
              ))
            )}
            <div className="pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm"
                style={{ color: C.textMuted }}
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar (consultant only) */}
        {isConsultant && activeRoleView === 'consultant' && (
          <div className="h-1" style={{ backgroundColor: C.border }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: C.orange }}
            />
          </div>
        )}
      </header>

      {/* Generating Overlay */}
      {generating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)' }}>
          <div
            className="rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: C.orange, borderTopColor: 'transparent' }}
            />
            <h3 className="font-bold text-lg mb-2" style={{ color: C.text, fontFamily: 'Georgia, serif' }}>Generating Starter Pack</h3>
            <p className="text-sm" style={{ color: C.textMuted }}>Synthesizing knowledge patterns and generating engagement materials...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            {isConsultant ? (
              <span
                className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: activeRoleView === 'integrations' ? C.blueLight : C.orangeLight,
                  color: activeRoleView === 'integrations' ? C.blue : C.orange,
                  border: `1px solid ${activeRoleView === 'integrations' ? C.blueBorder : C.orangeBorder}`,
                }}
              >
                {activeRoleView === 'integrations' ? 'Integrations' : `Step 0${currentStep}`}
              </span>
            ) : (
              <span
                className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: C.orangeLight, color: C.orange, border: `1px solid ${C.orangeBorder}` }}
              >
                {ROLE_LABELS[activeRoleView]}
              </span>
            )}
            <div className="h-px flex-1" style={{ backgroundColor: C.border }} />
            {isConsultant && currentStep === 2 && knowledgeData && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}` }}
              >
                Knowledge Activated
              </span>
            )}
            {isConsultant && currentStep === 3 && starterPack && activeRoleView !== 'integrations' && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}` }}
              >
                Generated
              </span>
            )}
            {isConsultant && currentStep === 4 && wearTestData && activeRoleView !== 'integrations' && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: C.amberLight, color: C.amber, border: `1px solid ${C.amberBorder}` }}
              >
                {wearTestData.flags.filter((f) => f.status === 'pending').length} Flags Pending
              </span>
            )}
            {!isConsultant && activeRoleView === 'senior_reviewer' && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: C.amberLight, color: C.amber, border: `1px solid ${C.amberBorder}` }}
              >
                2 Pending Review
              </span>
            )}
            {!isConsultant && activeRoleView === 'knowledge_manager' && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}` }}
              >
                System Operational
              </span>
            )}
            {!isConsultant && activeRoleView === 'admin' && (
              <span
                className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
                style={{ backgroundColor: C.redLight, color: C.red, border: `1px solid ${C.redBorder}` }}
              >
                <Shield className="w-3 h-3" /> Audit Active
              </span>
            )}
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ color: C.navy, fontFamily: 'Georgia, serif' }}
          >
            {roleViewMeta[activeRoleView].title}
          </h1>
          <p className="mt-2 text-base" style={{ color: C.textMuted }}>
            {roleViewMeta[activeRoleView].description}
          </p>
        </div>

        {/* Content */}
        {activeRoleView === 'consultant' && (
          <>
            {currentStep === 1 && <BriefIntake onActivate={handleActivateKnowledge} />}
            {currentStep === 2 && knowledgeData && (
              <KnowledgeActivation data={knowledgeData} onGenerate={handleGeneratePack} />
            )}
            {currentStep === 3 && starterPack && (
              <div className="space-y-6">
                <StarterPackView pack={starterPack} />
                <div className="flex justify-end">
                  <button
                    onClick={handleProceedToWearTest}
                    className="flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    style={{ backgroundColor: C.orange, color: '#fff' }}
                  >
                    Proceed to Wear-Test Review
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {currentStep === 4 && wearTestData && brief && (
              <WearTestReview data={wearTestData} clientName={brief.clientName} />
            )}
          </>
        )}

        {activeRoleView === 'senior_reviewer' && <SeniorReviewerView />}
        {activeRoleView === 'knowledge_manager' && <KnowledgeManagerView />}
        {activeRoleView === 'admin' && <AdminView />}
        {activeRoleView === 'integrations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <GoogleDrivePanel />
              <ChatGPTPanel />
            </div>
            {/* Integration Architecture */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            >
              <h3
                className="text-xs uppercase tracking-widest font-semibold mb-5"
                style={{ color: C.textMuted }}
              >
                Integration Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Google Drive → Ingestion',
                    desc: 'OAuth 2.0 scoped access · Auto-parse · Chunk · Embed · pgvector index',
                    status: 'Connected',
                    statusColor: C.green,
                    statusBg: C.greenLight,
                    statusBorder: C.greenBorder,
                  },
                  {
                    title: 'ChatGPT API → Pipeline',
                    desc: 'Classify → Retrieve → Generate → Review → Summarize · GPT-4o',
                    status: 'Connected',
                    statusColor: C.green,
                    statusBg: C.greenLight,
                    statusBorder: C.greenBorder,
                  },
                  {
                    title: 'Google Workspace → Export',
                    desc: 'Docs · Slides · Sheets · Auto-save to Drive · Grounding appendix',
                    status: 'Ready',
                    statusColor: C.amber,
                    statusBg: C.amberLight,
                    statusBorder: C.amberBorder,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold" style={{ color: C.text }}>{item.title}</p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: item.statusBg, color: item.statusColor, border: `1px solid ${item.statusBorder}` }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-8"
        style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.surface }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: C.orange }}
            >
              <span className="text-white font-bold text-xs" style={{ fontFamily: 'Georgia, serif' }}>C</span>
            </div>
            <span className="text-xs" style={{ color: C.textMuted }}>CGS Delivery Copilot · Internal Use Only · CGS Advisors © 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: C.textMuted }}>v1.0.0-beta</span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}` }}
            >
              System Operational
            </span>
          </div>
        </div>
      </footer>

      <OmniflowBadge />
      <Toaster />
    </div>
  );
}
