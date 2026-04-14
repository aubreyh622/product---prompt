import type {
  EngagementBrief,
  KnowledgeActivationData,
  StarterPack,
  WearTestData,
  EngagementArchetype,
  SourceCitation,
  HallucinationFlag,
} from '@shared/types/api';

// ─── Demo Scenarios ──────────────────────────────────────────────────────────

export const DEMO_SCENARIOS: Record<EngagementArchetype, EngagementBrief> = {
  ai_transformation: {
    clientName: 'Meridian Industrial Group',
    industry: 'industrial',
    objective:
      'Accelerate AI adoption across manufacturing operations to reduce production cycle time by 20% and improve predictive maintenance capabilities within 12 months.',
    coreChallenge:
      'Legacy systems and siloed data infrastructure prevent real-time visibility across 14 production facilities, creating bottlenecks in decision-making and reactive rather than predictive maintenance posture.',
    timeline: '16 weeks — Q2–Q3 2026',
    urgency: 'high',
    archetype: 'ai_transformation',
  },
  delivery_standardization: {
    clientName: 'Apex Professional Services',
    industry: 'professional-services',
    objective:
      'Standardize delivery methodology across 8 regional offices to reduce project overruns by 30% and improve client satisfaction scores within 9 months.',
    coreChallenge:
      'Inconsistent project delivery practices across regional teams result in variable quality, scope creep, and client dissatisfaction. No unified playbook or governance model exists.',
    timeline: '12 weeks — Q3 2026',
    urgency: 'standard',
    archetype: 'delivery_standardization',
  },
  execution_stall: {
    clientName: 'Vantage Capital Partners',
    industry: 'financial-services',
    objective:
      'Diagnose and resolve execution stall on a $40M digital transformation program that has missed three consecutive milestones and is at risk of executive escalation.',
    coreChallenge:
      'Program velocity has dropped 60% over the past two quarters due to unclear ownership, competing priorities, and a breakdown in steering committee governance.',
    timeline: '8 weeks — Q2 2026',
    urgency: 'critical',
    archetype: 'execution_stall',
  },
  operating_model: {
    clientName: 'Orion Healthcare Systems',
    industry: 'healthcare',
    objective:
      'Redesign the operating model for a newly merged healthcare network to eliminate redundancy, clarify accountability, and enable scalable growth across 22 facilities.',
    coreChallenge:
      'Post-merger integration has created overlapping roles, unclear decision rights, and duplicated functions across the combined entity, resulting in $12M in estimated annual inefficiency.',
    timeline: '20 weeks — Q2–Q4 2026',
    urgency: 'high',
    archetype: 'operating_model',
  },
  sponsor_misalignment: {
    clientName: 'Stratos Energy Group',
    industry: 'enterprise-tech',
    objective:
      'Realign executive sponsors and rebuild stakeholder confidence in a stalled enterprise ERP implementation that has lost C-suite support.',
    coreChallenge:
      'Conflicting priorities between the CFO and CTO have created a governance vacuum, leaving the implementation team without clear direction and the board questioning the investment thesis.',
    timeline: '6 weeks — Q2 2026',
    urgency: 'critical',
    archetype: 'sponsor_misalignment',
  },
};

export const SCENARIO_LABELS: Record<EngagementArchetype, string> = {
  ai_transformation: 'Mid-Market Industrial AI Transformation',
  delivery_standardization: 'Professional Services Delivery Standardization',
  execution_stall: 'Execution Stall Recovery',
  operating_model: 'Operating Model Redesign',
  sponsor_misalignment: 'Sponsor Misalignment',
};

// ─── Knowledge Activation Data by Archetype ──────────────────────────────────

export function getKnowledgeData(archetype: EngagementArchetype): KnowledgeActivationData {
  const base: Record<EngagementArchetype, KnowledgeActivationData> = {
    ai_transformation: {
      frameworks: [
        {
          id: 'f1',
          name: 'AI Maturity Ladder',
          description:
            'Five-stage assessment model for evaluating AI readiness across data infrastructure, talent, governance, and operational integration in manufacturing contexts.',
          industry: 'Industrial',
          usageCount: 47,
          fitScore: 94,
          assetTag: 'Flagship',
          enabled: true,
        },
        {
          id: 'f2',
          name: 'Transformation Sequencing Model',
          description:
            'Phased approach to sequencing transformation initiatives by dependency, risk, and value realization timeline across complex multi-site operations.',
          industry: 'Cross-industry',
          usageCount: 31,
          fitScore: 81,
          assetTag: 'Core',
          enabled: true,
        },
        {
          id: 'f3',
          name: 'Change Readiness Diagnostic',
          description:
            'Structured diagnostic for assessing organizational readiness for large-scale change across leadership alignment, culture, and capability dimensions.',
          industry: 'Enterprise',
          usageCount: 22,
          fitScore: 67,
          assetTag: 'Method',
          enabled: false,
        },
      ],
      priorEngagements: [
        { id: 'pe1', name: 'Apex Manufacturing AI Pilot', industry: 'Industrial', year: 2024, similarityScore: 92, enabled: true },
        { id: 'pe2', name: 'Vantage Steel Digital Ops', industry: 'Industrial', year: 2023, similarityScore: 78, enabled: true },
        { id: 'pe3', name: 'Orion Logistics Automation', industry: 'Logistics', year: 2023, similarityScore: 61, enabled: false },
      ],
      hypotheses: [
        { id: 'h1', text: 'Data infrastructure gaps are the primary blocker to AI adoption, not talent or budget constraints.', confidence: 'High' },
        { id: 'h2', text: 'Predictive maintenance use case will deliver fastest ROI and serve as the AI transformation anchor.', confidence: 'Medium' },
        { id: 'h3', text: 'Cross-facility data standardization requires a governance layer before any AI model deployment.', confidence: 'Medium' },
      ],
      templates: [
        { id: 't1', name: 'AI Transformation Brief Template', format: 'DOCX' },
        { id: 't2', name: 'Executive Kickoff Deck', format: 'PPTX' },
        { id: 't3', name: 'Workplan & RACI Matrix', format: 'XLSX' },
      ],
    },
    delivery_standardization: {
      frameworks: [
        {
          id: 'f1',
          name: 'Delivery Excellence Framework',
          description: 'Comprehensive methodology for standardizing project delivery across distributed teams, covering governance, quality gates, and escalation protocols.',
          industry: 'Professional Services',
          usageCount: 38,
          fitScore: 96,
          assetTag: 'Flagship',
          enabled: true,
        },
        {
          id: 'f2',
          name: 'Operating Rhythm Design',
          description: 'Structured approach to designing consistent meeting cadences, reporting cycles, and decision-making forums across regional offices.',
          industry: 'Cross-industry',
          usageCount: 25,
          fitScore: 83,
          assetTag: 'Core',
          enabled: true,
        },
        {
          id: 'f3',
          name: 'Knowledge Transfer Protocol',
          description: 'Systematic method for capturing and distributing best practices, lessons learned, and playbooks across delivery teams.',
          industry: 'Professional Services',
          usageCount: 19,
          fitScore: 71,
          assetTag: 'Method',
          enabled: true,
        },
      ],
      priorEngagements: [
        { id: 'pe1', name: 'Meridian Consulting Standardization', industry: 'Professional Services', year: 2024, similarityScore: 89, enabled: true },
        { id: 'pe2', name: 'Stratos Advisory Playbook', industry: 'Professional Services', year: 2023, similarityScore: 74, enabled: true },
        { id: 'pe3', name: 'Nexus IT Delivery Reform', industry: 'Technology', year: 2022, similarityScore: 58, enabled: false },
      ],
      hypotheses: [
        { id: 'h1', text: 'Inconsistent delivery practices stem from lack of a shared methodology, not individual capability gaps.', confidence: 'High' },
        { id: 'h2', text: 'A centralized playbook with regional customization will achieve faster adoption than a fully uniform standard.', confidence: 'Medium' },
        { id: 'h3', text: 'Regional office leads will be the critical change agents — their buy-in is prerequisite to success.', confidence: 'High' },
      ],
      templates: [
        { id: 't1', name: 'Delivery Playbook Template', format: 'DOCX' },
        { id: 't2', name: 'Governance Design Workshop Deck', format: 'PPTX' },
        { id: 't3', name: 'Project Health Scorecard', format: 'XLSX' },
      ],
    },
    execution_stall: {
      frameworks: [
        {
          id: 'f1',
          name: 'Program Recovery Diagnostic',
          description: 'Rapid diagnostic framework for identifying root causes of program stall across governance, resourcing, scope, and stakeholder dimensions.',
          industry: 'Cross-industry',
          usageCount: 29,
          fitScore: 97,
          assetTag: 'Flagship',
          enabled: true,
        },
        {
          id: 'f2',
          name: 'Governance Reset Model',
          description: 'Structured approach to rebuilding program governance, redefining decision rights, and re-establishing executive accountability.',
          industry: 'Enterprise',
          usageCount: 21,
          fitScore: 88,
          assetTag: 'Core',
          enabled: true,
        },
        {
          id: 'f3',
          name: 'Stakeholder Re-engagement Protocol',
          description: 'Methodology for diagnosing stakeholder disengagement and designing targeted re-engagement strategies for at-risk programs.',
          industry: 'Cross-industry',
          usageCount: 16,
          fitScore: 75,
          assetTag: 'Method',
          enabled: true,
        },
      ],
      priorEngagements: [
        { id: 'pe1', name: 'Apex Capital Program Recovery', industry: 'Financial Services', year: 2024, similarityScore: 91, enabled: true },
        { id: 'pe2', name: 'Orion ERP Rescue', industry: 'Enterprise Tech', year: 2023, similarityScore: 82, enabled: true },
        { id: 'pe3', name: 'Vantage Transformation Restart', industry: 'Industrial', year: 2022, similarityScore: 64, enabled: false },
      ],
      hypotheses: [
        { id: 'h1', text: 'Governance breakdown is the primary driver of stall — unclear ownership is creating decision paralysis.', confidence: 'High' },
        { id: 'h2', text: 'Scope creep has compounded the velocity problem and requires immediate scope arbitration.', confidence: 'Medium' },
        { id: 'h3', text: 'A 30-day stabilization sprint with a reset steering committee will restore program momentum.', confidence: 'Medium' },
      ],
      templates: [
        { id: 't1', name: 'Program Recovery Brief', format: 'DOCX' },
        { id: 't2', name: 'Governance Reset Workshop Deck', format: 'PPTX' },
        { id: 't3', name: 'Program Health Dashboard', format: 'XLSX' },
      ],
    },
    operating_model: {
      frameworks: [
        {
          id: 'f1',
          name: 'Operating Model Design Canvas',
          description: 'Comprehensive framework for designing target operating models across structure, process, technology, and people dimensions.',
          industry: 'Cross-industry',
          usageCount: 43,
          fitScore: 95,
          assetTag: 'Flagship',
          enabled: true,
        },
        {
          id: 'f2',
          name: 'RACI Redesign Methodology',
          description: 'Structured approach to clarifying decision rights, accountability, and cross-functional collaboration in post-merger or restructured organizations.',
          industry: 'Healthcare',
          usageCount: 27,
          fitScore: 86,
          assetTag: 'Core',
          enabled: true,
        },
        {
          id: 'f3',
          name: 'Synergy Capture Framework',
          description: 'Methodology for identifying, sizing, and sequencing synergy capture opportunities in merged or restructured entities.',
          industry: 'Cross-industry',
          usageCount: 18,
          fitScore: 72,
          assetTag: 'Method',
          enabled: false,
        },
      ],
      priorEngagements: [
        { id: 'pe1', name: 'Nexus Health Network Integration', industry: 'Healthcare', year: 2024, similarityScore: 93, enabled: true },
        { id: 'pe2', name: 'Stratos Pharma Operating Model', industry: 'Healthcare', year: 2023, similarityScore: 79, enabled: true },
        { id: 'pe3', name: 'Meridian Corp Restructure', industry: 'Industrial', year: 2022, similarityScore: 62, enabled: false },
      ],
      hypotheses: [
        { id: 'h1', text: 'Overlapping roles and unclear decision rights are the primary source of the $12M inefficiency estimate.', confidence: 'High' },
        { id: 'h2', text: 'A shared services model for back-office functions will deliver the fastest cost reduction.', confidence: 'Medium' },
        { id: 'h3', text: 'Clinical operations should be redesigned separately from administrative functions to preserve care quality.', confidence: 'High' },
      ],
      templates: [
        { id: 't1', name: 'Operating Model Design Brief', format: 'DOCX' },
        { id: 't2', name: 'Target State Design Workshop', format: 'PPTX' },
        { id: 't3', name: 'RACI & Accountability Matrix', format: 'XLSX' },
      ],
    },
    sponsor_misalignment: {
      frameworks: [
        {
          id: 'f1',
          name: 'Stakeholder Alignment Diagnostic',
          description: 'Rapid assessment tool for mapping stakeholder positions, identifying misalignment sources, and designing targeted alignment interventions.',
          industry: 'Cross-industry',
          usageCount: 34,
          fitScore: 98,
          assetTag: 'Flagship',
          enabled: true,
        },
        {
          id: 'f2',
          name: 'Executive Narrative Framework',
          description: 'Structured approach to rebuilding a compelling investment narrative that re-engages C-suite sponsors and restores board confidence.',
          industry: 'Enterprise',
          usageCount: 22,
          fitScore: 87,
          assetTag: 'Core',
          enabled: true,
        },
        {
          id: 'f3',
          name: 'Governance Arbitration Model',
          description: 'Methodology for resolving executive-level conflicts over program direction, investment priorities, and accountability structures.',
          industry: 'Cross-industry',
          usageCount: 14,
          fitScore: 76,
          assetTag: 'Method',
          enabled: true,
        },
      ],
      priorEngagements: [
        { id: 'pe1', name: 'Apex ERP Sponsor Recovery', industry: 'Enterprise Tech', year: 2024, similarityScore: 94, enabled: true },
        { id: 'pe2', name: 'Vantage Board Realignment', industry: 'Financial Services', year: 2023, similarityScore: 81, enabled: true },
        { id: 'pe3', name: 'Orion CTO-CFO Mediation', industry: 'Healthcare', year: 2022, similarityScore: 67, enabled: false },
      ],
      hypotheses: [
        { id: 'h1', text: 'The CFO-CTO conflict is a proxy for a deeper disagreement about the program investment thesis and expected ROI.', confidence: 'High' },
        { id: 'h2', text: 'A neutral facilitated alignment session with both sponsors will be more effective than bilateral negotiation.', confidence: 'Medium' },
        { id: 'h3', text: 'Rebuilding a shared success metric framework will be the fastest path to restored governance.', confidence: 'Medium' },
      ],
      templates: [
        { id: 't1', name: 'Stakeholder Alignment Brief', format: 'DOCX' },
        { id: 't2', name: 'Executive Alignment Workshop Deck', format: 'PPTX' },
        { id: 't3', name: 'Stakeholder Map & Influence Matrix', format: 'XLSX' },
      ],
    },
  };
  return base[archetype];
}

// ─── Starter Pack Generation ──────────────────────────────────────────────────

export function generateStarterPack(brief: EngagementBrief): StarterPack {
  const archetype = brief.archetype || 'ai_transformation';

  const packs: Record<EngagementArchetype, StarterPack> = {
    ai_transformation: {
      problemStatement: `${brief.clientName} faces a critical inflection point in its operational competitiveness. Despite operating 14 production facilities across three regions, the organization lacks the integrated data infrastructure required to enable real-time operational visibility and AI-driven decision-making.

Legacy systems operating in functional silos prevent the aggregation of production, maintenance, and quality data necessary for predictive analytics. As a result, maintenance posture remains reactive, production cycle times exceed industry benchmarks by an estimated 15–22%, and leadership lacks the data confidence to commit to AI investment at scale.

The engagement objective is to design and sequence a 16-week AI transformation roadmap that addresses data infrastructure gaps, establishes a governance model for cross-facility data standardization, and delivers a validated predictive maintenance pilot as the anchor use case for broader AI adoption.`,
      issueTree: [
        {
          id: 'root',
          label: 'Why is AI adoption stalled?',
          expanded: true,
          children: [
            {
              id: 'n1',
              label: 'Data infrastructure gaps',
              expanded: true,
              children: [
                { id: 'n1a', label: 'Siloed legacy systems across 14 facilities' },
                { id: 'n1b', label: 'No unified data model or schema' },
                { id: 'n1c', label: 'Inconsistent data quality standards' },
              ],
            },
            {
              id: 'n2',
              label: 'Governance & ownership gaps',
              expanded: true,
              children: [
                { id: 'n2a', label: 'No data stewardship model' },
                { id: 'n2b', label: 'Unclear AI ownership and accountability' },
              ],
            },
            {
              id: 'n3',
              label: 'Talent & capability gaps',
              children: [
                { id: 'n3a', label: 'Limited ML engineering capacity' },
                { id: 'n3b', label: 'No AI center of excellence' },
              ],
            },
          ],
        },
      ],
      workstreams: [
        { id: 'ws1', number: 1, title: 'Data Infrastructure Assessment', weekRange: 'Wks 1–4', color: '#D4A843', activities: ['Current state audit', 'Data flow mapping', 'Gap analysis report'] },
        { id: 'ws2', number: 2, title: 'Governance & Data Standardization', weekRange: 'Wks 5–10', color: '#3DAA6E', activities: ['Data governance framework', 'Stewardship model design', 'Unified data schema'] },
        { id: 'ws3', number: 3, title: 'Predictive Maintenance Pilot', weekRange: 'Wks 11–16', color: '#4A90D9', activities: ['Model development & training', 'Pilot deployment (2 sites)', 'ROI validation & scale plan'] },
      ],
      roadmap: [
        { days: 30, title: 'Foundation', subtitle: 'Diagnose & Align', color: '#D4A843', milestones: ['Complete data infrastructure audit across all 14 facilities', 'Establish executive steering committee and AI ownership model', 'Identify and prioritize top 3 AI use cases by ROI potential'] },
        { days: 60, title: 'Build', subtitle: 'Design & Govern', color: '#3DAA6E', milestones: ['Deploy unified data governance framework and stewardship roles', 'Implement cross-facility data standardization for pilot sites', 'Begin predictive maintenance model development'] },
        { days: 90, title: 'Validate', subtitle: 'Pilot & Scale', color: '#4A90D9', milestones: ['Launch predictive maintenance pilot at 2 anchor facilities', 'Validate ROI metrics and document lessons learned', 'Present scale-up business case to executive leadership'] },
      ],
      execSummary: `${brief.clientName} is at a pivotal moment: the gap between its current operational capabilities and the AI-enabled future state is widening, while competitors accelerate their digital transformation programs.

Our assessment indicates that the primary barrier to AI adoption is not talent or budget — it is the absence of a unified data infrastructure and governance model. Without these foundations, any AI investment will fail to scale beyond isolated pilots.

This engagement will deliver three outcomes: (1) a clear-eyed diagnosis of the data infrastructure gap with a prioritized remediation roadmap, (2) a governance model that establishes data ownership and stewardship across all 14 facilities, and (3) a validated predictive maintenance pilot that demonstrates measurable ROI and builds organizational confidence in AI at scale.

We recommend beginning immediately given the competitive urgency and the 16-week window available before Q3 planning cycles close.`,
      deckOutline: [
        { number: 1, title: 'Situation & Stakes', purpose: 'Frame the competitive urgency', keyMessage: 'The window for AI leadership is closing — inaction has a cost', visual: 'Competitive landscape matrix' },
        { number: 2, title: 'Diagnostic Findings', purpose: 'Present current state assessment', keyMessage: 'Data infrastructure is the root cause, not talent or budget', visual: 'AI Maturity Ladder heatmap' },
        { number: 3, title: 'Transformation Roadmap', purpose: 'Outline the 16-week plan', keyMessage: 'Three sequenced workstreams deliver foundation, governance, and pilot', visual: 'Gantt-style workstream timeline' },
        { number: 4, title: 'Predictive Maintenance Pilot', purpose: 'Detail the anchor use case', keyMessage: 'Predictive maintenance delivers fastest ROI and builds AI confidence', visual: 'Pilot site selection map' },
        { number: 5, title: 'Investment & ROI Case', purpose: 'Quantify the business case', keyMessage: '20% cycle time reduction and $8–12M annual maintenance savings', visual: 'ROI waterfall chart' },
        { number: 6, title: 'Next Steps & Governance', purpose: 'Define immediate actions', keyMessage: 'Steering committee formation and data audit kickoff within 2 weeks', visual: 'RACI and governance model' },
      ],
      confidenceScores: { 'Problem Statement': 88, 'Issue Tree': 82, 'Workstreams': 74, '30/60/90 Roadmap': 71, 'Exec Summary': 85, 'Deck Outline': 79 },
      sourceCitations: {
        'Problem Statement': [
          { id: 'sc1', label: 'AI Maturity Ladder v3.2', sourceType: 'firm_library', fileName: 'AI Maturity Ladder v3.2.pptx', chunkRef: 'Chunk 14/42', relevance: 'Stage 3 readiness criteria and data infrastructure prerequisites' },
          { id: 'sc2', label: 'Client Engagement Brief - Q2 2026', sourceType: 'client_folder', fileName: 'Client Engagement Brief - Q2 2026.docx', chunkRef: 'Chunk 3/12', relevance: 'Client-stated 14-facility scope and legacy system constraints' },
          { id: 'sc3', label: 'Apex Manufacturing AI Pilot', sourceType: 'firm_library', fileName: 'Apex Manufacturing AI Pilot - Lessons Learned.docx', chunkRef: 'Chunk 7/28', relevance: 'Analogous engagement: data infrastructure as primary AI blocker' },
        ],
        'Issue Tree': [
          { id: 'sc4', label: 'AI Maturity Ladder v3.2', sourceType: 'firm_library', fileName: 'AI Maturity Ladder v3.2.pptx', chunkRef: 'Chunk 8/42', relevance: 'Five-stage maturity model: data, governance, talent dimensions' },
          { id: 'sc5', label: 'IT Infrastructure Audit - Draft', sourceType: 'client_folder', fileName: 'IT Infrastructure Audit - Draft.pdf', chunkRef: 'Chunk 22/67', relevance: 'Confirmed siloed legacy systems across production facilities' },
        ],
        'Workstreams': [
          { id: 'sc6', label: 'Transformation Sequencing Model', sourceType: 'firm_library', fileName: 'Transformation Sequencing Model.docx', chunkRef: 'Chunk 5/31', relevance: 'Phased sequencing: infrastructure before governance before AI deployment' },
          { id: 'sc7', label: 'Workplan & RACI Matrix Template', sourceType: 'firm_library', fileName: 'Workplan & RACI Matrix.xlsx', chunkRef: 'Chunk 2/18', relevance: 'Standard workstream structure for AI transformation engagements' },
        ],
        'Exec Summary': [
          { id: 'sc8', label: 'Vantage Steel Digital Ops', sourceType: 'firm_library', fileName: 'Vantage Steel Digital Ops - Case Study.docx', chunkRef: 'Chunk 11/24', relevance: 'Analogous ROI narrative: data infrastructure investment thesis' },
          { id: 'sc9', label: 'Reporting Baseline - FY2025', sourceType: 'client_folder', fileName: 'Reporting Baseline - FY2025.xlsx', chunkRef: 'Chunk 8/45', relevance: 'Client operational baseline confirming competitive gap' },
        ],
      },
      hallucinationFlags: [
        { id: 'hf1', section: 'Problem Statement', claim: '15–22% production cycle time gap vs. industry benchmark', flagType: 'unverified_statistic', severity: 'high', suggestion: 'Replace with client-validated operational data or cite specific benchmark source' },
        { id: 'hf2', section: 'Exec Summary', claim: 'competitors accelerate their digital transformation programs', flagType: 'unsupported_causal', severity: 'medium', suggestion: 'Add market data citation or soften to "industry peers are accelerating"' },
        { id: 'hf3', section: 'Workstreams', claim: 'Pilot deployment (2 sites) in Weeks 11–16', flagType: 'low_confidence', severity: 'medium', suggestion: 'Validate timeline feasibility with client IT team before committing' },
      ],
    },
    delivery_standardization: {
      problemStatement: `${brief.clientName} operates across 8 regional offices with no unified delivery methodology, resulting in significant variation in project outcomes, client satisfaction, and team performance. Project overruns average 23% above budget and 18% beyond timeline across the portfolio.

The absence of a shared playbook, consistent quality gates, and standardized governance forums has created a fragmented delivery culture where each regional office operates as an independent entity. This prevents knowledge transfer, limits scalability, and exposes the firm to reputational risk.

The engagement objective is to design and implement a standardized delivery framework that preserves regional flexibility while establishing non-negotiable quality standards, governance structures, and performance metrics across all offices within 12 weeks.`,
      issueTree: [
        {
          id: 'root',
          label: 'Why are delivery outcomes inconsistent?',
          expanded: true,
          children: [
            { id: 'n1', label: 'No shared methodology', expanded: true, children: [{ id: 'n1a', label: 'Each office uses different templates' }, { id: 'n1b', label: 'No standard quality gates' }] },
            { id: 'n2', label: 'Governance gaps', expanded: true, children: [{ id: 'n2a', label: 'No escalation protocol' }, { id: 'n2b', label: 'Inconsistent steering cadence' }] },
            { id: 'n3', label: 'Knowledge silos', children: [{ id: 'n3a', label: 'No lessons learned repository' }, { id: 'n3b', label: 'Limited cross-office collaboration' }] },
          ],
        },
      ],
      workstreams: [
        { id: 'ws1', number: 1, title: 'Methodology Design', weekRange: 'Wks 1–4', color: '#D4A843', activities: ['Current state assessment', 'Best practice synthesis', 'Playbook framework design'] },
        { id: 'ws2', number: 2, title: 'Governance & Tooling', weekRange: 'Wks 5–8', color: '#3DAA6E', activities: ['Governance model design', 'Template standardization', 'Reporting framework'] },
        { id: 'ws3', number: 3, title: 'Rollout & Adoption', weekRange: 'Wks 9–12', color: '#4A90D9', activities: ['Regional training program', 'Pilot office deployment', 'Adoption tracking'] },
      ],
      roadmap: [
        { days: 30, title: 'Diagnose', subtitle: 'Assess & Design', color: '#D4A843', milestones: ['Complete current state assessment across all 8 offices', 'Identify top 5 delivery failure patterns', 'Draft unified methodology framework'] },
        { days: 60, title: 'Build', subtitle: 'Standardize & Tool', color: '#3DAA6E', milestones: ['Finalize delivery playbook and quality gate standards', 'Deploy standardized templates and governance forums', 'Train regional leads on new methodology'] },
        { days: 90, title: 'Embed', subtitle: 'Pilot & Measure', color: '#4A90D9', milestones: ['Launch pilot in 2 regional offices', 'Measure early adoption and project health metrics', 'Refine playbook based on pilot feedback'] },
      ],
      execSummary: `${brief.clientName} has reached a scale inflection point where informal, regionally-driven delivery practices are no longer sustainable. The 23% average project overrun rate represents both a financial and reputational risk that requires immediate structural intervention.

Our approach will deliver a standardized delivery framework that is rigorous enough to drive consistency but flexible enough to accommodate regional context. The framework will be built with regional leads, not imposed on them — ensuring adoption from day one.

Key outcomes include a unified delivery playbook, standardized governance forums, and a performance measurement system that gives leadership real-time visibility into project health across all offices.`,
      deckOutline: [
        { number: 1, title: 'The Delivery Gap', purpose: 'Quantify the inconsistency problem', keyMessage: '23% overrun rate is a structural problem, not a people problem', visual: 'Regional performance heatmap' },
        { number: 2, title: 'Root Cause Analysis', purpose: 'Diagnose the methodology gap', keyMessage: 'Absence of shared standards is the primary driver', visual: 'Issue tree diagram' },
        { number: 3, title: 'Proposed Framework', purpose: 'Introduce the delivery playbook', keyMessage: 'Standardized but flexible — built with regional leads', visual: 'Methodology framework overview' },
        { number: 4, title: 'Implementation Roadmap', purpose: 'Outline the 12-week plan', keyMessage: 'Phased rollout with pilot validation before full deployment', visual: 'Workstream timeline' },
        { number: 5, title: 'Expected Outcomes', purpose: 'Quantify the business case', keyMessage: '30% reduction in overruns within 6 months of full deployment', visual: 'Before/after performance comparison' },
        { number: 6, title: 'Governance & Next Steps', purpose: 'Define accountability', keyMessage: 'Regional leads own adoption; central team owns standards', visual: 'RACI matrix' },
      ],
      confidenceScores: { 'Problem Statement': 91, 'Issue Tree': 85, 'Workstreams': 80, '30/60/90 Roadmap': 77, 'Exec Summary': 88, 'Deck Outline': 82 },
      sourceCitations: {
        'Problem Statement': [
          { id: 'sc1', label: 'Delivery Excellence Framework', sourceType: 'firm_library', fileName: 'Delivery Excellence Framework.docx', chunkRef: 'Chunk 12/67', relevance: 'Delivery failure patterns and root cause taxonomy' },
          { id: 'sc2', label: 'Client Engagement Brief - Q2 2026', sourceType: 'client_folder', fileName: 'Client Engagement Brief - Q2 2026.docx', chunkRef: 'Chunk 5/12', relevance: 'Client-stated 8-office scope and overrun rate context' },
        ],
        'Workstreams': [
          { id: 'sc3', label: 'Operating Rhythm Design', sourceType: 'firm_library', fileName: 'Operating Rhythm Design.docx', chunkRef: 'Chunk 8/25', relevance: 'Governance forum design and meeting cadence standards' },
        ],
      },
      hallucinationFlags: [
        { id: 'hf1', section: 'Problem Statement', claim: '23% average project overrun rate', flagType: 'unverified_statistic', severity: 'high', suggestion: 'Validate against actual project portfolio data before client use' },
      ],
    },
    execution_stall: {
      problemStatement: `${brief.clientName}'s $40M digital transformation program has entered a critical stall phase, missing three consecutive milestones and consuming 40% of its budget with only 22% of planned deliverables complete. The program is at immediate risk of executive escalation and potential cancellation.

Root cause analysis points to a governance vacuum created by competing priorities between the program sponsor and the technology leadership team. Without clear decision rights and a functioning steering committee, the delivery team has been unable to resolve scope conflicts, resource constraints, or vendor performance issues.

The engagement objective is to diagnose the stall, reset program governance, and deliver a credible recovery plan within 8 weeks that restores executive confidence and re-establishes program momentum.`,
      issueTree: [
        {
          id: 'root',
          label: 'Why has the program stalled?',
          expanded: true,
          children: [
            { id: 'n1', label: 'Governance breakdown', expanded: true, children: [{ id: 'n1a', label: 'Steering committee not functioning' }, { id: 'n1b', label: 'Unclear decision rights' }] },
            { id: 'n2', label: 'Scope & priority conflicts', expanded: true, children: [{ id: 'n2a', label: 'Competing executive priorities' }, { id: 'n2b', label: 'Uncontrolled scope creep' }] },
            { id: 'n3', label: 'Resource & vendor issues', children: [{ id: 'n3a', label: 'Key resource attrition' }, { id: 'n3b', label: 'Vendor delivery underperformance' }] },
          ],
        },
      ],
      workstreams: [
        { id: 'ws1', number: 1, title: 'Stall Diagnosis', weekRange: 'Wks 1–2', color: '#D4A843', activities: ['Stakeholder interviews', 'Program health assessment', 'Root cause synthesis'] },
        { id: 'ws2', number: 2, title: 'Governance Reset', weekRange: 'Wks 3–5', color: '#3DAA6E', activities: ['Steering committee redesign', 'Decision rights clarification', 'Scope arbitration'] },
        { id: 'ws3', number: 3, title: 'Recovery Plan', weekRange: 'Wks 6–8', color: '#4A90D9', activities: ['Revised program plan', 'Resource reallocation', 'Executive alignment session'] },
      ],
      roadmap: [
        { days: 30, title: 'Stabilize', subtitle: 'Diagnose & Reset', color: '#D4A843', milestones: ['Complete program health diagnostic', 'Reset steering committee with clear charter', 'Arbitrate top 5 scope conflicts'] },
        { days: 60, title: 'Recover', subtitle: 'Replan & Resource', color: '#3DAA6E', milestones: ['Deliver revised program plan with credible milestones', 'Resolve resource gaps and vendor performance issues', 'Restore executive confidence with progress report'] },
        { days: 90, title: 'Accelerate', subtitle: 'Execute & Validate', color: '#4A90D9', milestones: ['Hit first post-recovery milestone on time', 'Validate governance model is functioning', 'Present board update with recovery evidence'] },
      ],
      execSummary: `${brief.clientName}'s digital transformation program is at a critical juncture. The stall is not a technical failure — it is a governance failure. The program has the right technology, the right vendor, and the right team. What it lacks is a functioning decision-making structure.

Our 8-week recovery engagement will deliver three things: a clear diagnosis of what went wrong and why, a reset governance model with unambiguous decision rights, and a credible recovery plan that the board can stand behind.

The window for recovery is narrow. Every week of continued stall increases the risk of program cancellation and erodes the organizational confidence needed to execute the recovery.`,
      deckOutline: [
        { number: 1, title: 'Program Status Assessment', purpose: 'Establish the severity of the stall', keyMessage: '40% budget consumed, 22% delivered — this is a governance crisis', visual: 'Program health dashboard' },
        { number: 2, title: 'Root Cause Analysis', purpose: 'Diagnose the stall drivers', keyMessage: 'Governance vacuum is the primary cause, not technical failure', visual: 'Fishbone / issue tree' },
        { number: 3, title: 'Governance Reset Design', purpose: 'Propose the new governance model', keyMessage: 'Clear decision rights and a functioning steering committee', visual: 'Governance structure diagram' },
        { number: 4, title: 'Recovery Roadmap', purpose: 'Outline the 8-week recovery plan', keyMessage: 'Stabilize, recover, accelerate — three phases, clear milestones', visual: 'Recovery timeline' },
        { number: 5, title: 'Resource & Vendor Plan', purpose: 'Address resource and vendor gaps', keyMessage: 'Targeted reallocation and vendor performance management', visual: 'Resource plan matrix' },
        { number: 6, title: 'Board Confidence Package', purpose: 'Restore executive confidence', keyMessage: 'Evidence-based recovery narrative for board presentation', visual: 'Recovery scorecard' },
      ],
      confidenceScores: { 'Problem Statement': 92, 'Issue Tree': 87, 'Workstreams': 83, '30/60/90 Roadmap': 79, 'Exec Summary': 90, 'Deck Outline': 84 },
      sourceCitations: {
        'Problem Statement': [
          { id: 'sc1', label: 'Program Recovery Diagnostic', sourceType: 'firm_library', fileName: 'Program Recovery Diagnostic.docx', chunkRef: 'Chunk 6/38', relevance: 'Governance breakdown as primary stall driver — pattern match' },
          { id: 'sc2', label: 'Stakeholder Interview Notes - Wave 1', sourceType: 'client_folder', fileName: 'Stakeholder Interview Notes - Wave 1.gdoc', chunkRef: 'Chunk 18/34', relevance: 'Confirmed steering committee dysfunction and competing priorities' },
        ],
        'Workstreams': [
          { id: 'sc3', label: 'Governance Reset Model', sourceType: 'firm_library', fileName: 'Governance Reset Model.docx', chunkRef: 'Chunk 4/21', relevance: 'Governance reset workstream structure and decision rights framework' },
        ],
      },
      hallucinationFlags: [
        { id: 'hf1', section: 'Problem Statement', claim: '40% budget consumed, 22% of deliverables complete', flagType: 'unverified_statistic', severity: 'high', suggestion: 'Validate against actual program reporting before using in recovery narrative' },
        { id: 'hf2', section: 'Roadmap', claim: '8-week recovery timeline', flagType: 'low_confidence', severity: 'medium', suggestion: 'Recovery timelines for $40M programs typically require 12-16 weeks — validate feasibility' },
      ],
    },
    operating_model: {
      problemStatement: `${brief.clientName} completed its merger 18 months ago but has yet to achieve the operational integration required to realize the $12M annual efficiency target committed to the board. Overlapping roles, duplicated functions, and unclear decision rights across the combined 22-facility network are creating friction, slowing decisions, and eroding the merger's value thesis.

The absence of a designed target operating model has left the combined entity operating as two separate organizations under one brand. Leadership teams at both legacy entities continue to operate with pre-merger mindsets, creating accountability gaps and cultural resistance to integration.

The engagement objective is to design a target operating model that eliminates redundancy, clarifies accountability, and enables scalable growth — with a phased implementation plan that minimizes disruption to clinical operations.`,
      issueTree: [
        {
          id: 'root',
          label: 'Why is the merger not delivering value?',
          expanded: true,
          children: [
            { id: 'n1', label: 'Structural redundancy', expanded: true, children: [{ id: 'n1a', label: 'Duplicate leadership roles' }, { id: 'n1b', label: 'Overlapping back-office functions' }] },
            { id: 'n2', label: 'Accountability gaps', expanded: true, children: [{ id: 'n2a', label: 'Unclear decision rights' }, { id: 'n2b', label: 'No unified RACI model' }] },
            { id: 'n3', label: 'Cultural resistance', children: [{ id: 'n3a', label: 'Legacy entity mindsets persist' }, { id: 'n3b', label: 'Integration fatigue' }] },
          ],
        },
      ],
      workstreams: [
        { id: 'ws1', number: 1, title: 'Operating Model Diagnosis', weekRange: 'Wks 1–5', color: '#D4A843', activities: ['Role & function mapping', 'Redundancy analysis', 'Decision rights assessment'] },
        { id: 'ws2', number: 2, title: 'Target State Design', weekRange: 'Wks 6–12', color: '#3DAA6E', activities: ['Target operating model design', 'RACI redesign', 'Shared services model'] },
        { id: 'ws3', number: 3, title: 'Implementation Planning', weekRange: 'Wks 13–20', color: '#4A90D9', activities: ['Transition planning', 'Change management program', 'Synergy tracking framework'] },
      ],
      roadmap: [
        { days: 30, title: 'Diagnose', subtitle: 'Map & Analyze', color: '#D4A843', milestones: ['Complete role and function mapping across all 22 facilities', 'Quantify redundancy and identify $12M synergy sources', 'Assess decision rights and accountability gaps'] },
        { days: 60, title: 'Design', subtitle: 'Model & Validate', color: '#3DAA6E', milestones: ['Deliver target operating model design', 'Validate with leadership teams from both legacy entities', 'Design shared services model for back-office functions'] },
        { days: 90, title: 'Plan', subtitle: 'Sequence & Mobilize', color: '#4A90D9', milestones: ['Deliver phased implementation roadmap', 'Launch change management program', 'Establish synergy tracking and governance model'] },
      ],
      execSummary: `${brief.clientName} has the assets, the talent, and the market position to be the leading integrated healthcare network in the region. What it lacks is the operating model to function as one.

Our engagement will deliver a target operating model that is designed for the combined entity — not adapted from either legacy organization. The model will eliminate the $12M in structural redundancy while preserving the clinical excellence that both legacy organizations are known for.

The design process will be collaborative and evidence-based, ensuring that the target state has the leadership buy-in required for successful implementation.`,
      deckOutline: [
        { number: 1, title: 'Merger Value at Risk', purpose: 'Quantify the integration gap', keyMessage: '$12M efficiency target at risk — 18 months post-merger', visual: 'Value realization waterfall' },
        { number: 2, title: 'Current State Assessment', purpose: 'Map the redundancy and gaps', keyMessage: 'Structural redundancy and accountability gaps are the primary issues', visual: 'Organizational overlap map' },
        { number: 3, title: 'Target Operating Model', purpose: 'Present the future state design', keyMessage: 'One organization, clear accountability, shared services', visual: 'Target org structure' },
        { number: 4, title: 'RACI & Decision Rights', purpose: 'Clarify accountability', keyMessage: 'Every decision has a clear owner — no more governance gaps', visual: 'RACI matrix' },
        { number: 5, title: 'Implementation Roadmap', purpose: 'Sequence the transition', keyMessage: 'Phased approach minimizes clinical disruption', visual: '20-week implementation timeline' },
        { number: 6, title: 'Synergy Capture Plan', purpose: 'Quantify and track value', keyMessage: '$12M target is achievable within 18 months of implementation', visual: 'Synergy tracking dashboard' },
      ],
      confidenceScores: { 'Problem Statement': 89, 'Issue Tree': 84, 'Workstreams': 78, '30/60/90 Roadmap': 75, 'Exec Summary': 86, 'Deck Outline': 81 },
      sourceCitations: {
        'Problem Statement': [
          { id: 'sc1', label: 'Operating Model Design Canvas', sourceType: 'firm_library', fileName: 'Operating Model Design Canvas.pptx', chunkRef: 'Chunk 9/55', relevance: 'Post-merger integration failure patterns and redundancy taxonomy' },
          { id: 'sc2', label: 'Current State Assessment - Operations', sourceType: 'client_folder', fileName: 'Current State Assessment - Operations.pptx', chunkRef: 'Chunk 14/28', relevance: 'Confirmed overlapping roles and duplicated functions across 22 facilities' },
        ],
        'Workstreams': [
          { id: 'sc3', label: 'RACI Redesign Methodology', sourceType: 'firm_library', fileName: 'RACI Redesign Methodology.xlsx', chunkRef: 'Chunk 3/18', relevance: 'RACI redesign workstream structure for post-merger contexts' },
        ],
      },
      hallucinationFlags: [
        { id: 'hf1', section: 'Problem Statement', claim: '$12M annual inefficiency estimate', flagType: 'unverified_statistic', severity: 'high', suggestion: 'Validate the methodology behind this estimate before using in board materials' },
        { id: 'hf2', section: 'Workstreams', claim: 'Clinical operations redesign', flagType: 'unsupported_causal', severity: 'medium', suggestion: 'Clinical operations redesign requires clinical governance and regulatory review — scope explicitly' },
      ],
    },
    sponsor_misalignment: {
      problemStatement: `${brief.clientName}'s enterprise ERP implementation has lost C-suite support due to a fundamental misalignment between the CFO and CTO on program scope, investment rationale, and expected outcomes. The governance vacuum created by this conflict has left the implementation team without direction and the board questioning the $28M investment thesis.

The conflict is not merely interpersonal — it reflects a deeper disagreement about whether the ERP program is primarily a cost reduction initiative (CFO's view) or a capability-building platform investment (CTO's view). Without resolution, the program cannot proceed.

The engagement objective is to diagnose the misalignment, facilitate executive realignment, and rebuild a shared governance model and investment narrative within 6 weeks.`,
      issueTree: [
        {
          id: 'root',
          label: 'Why has executive support collapsed?',
          expanded: true,
          children: [
            { id: 'n1', label: 'Investment thesis conflict', expanded: true, children: [{ id: 'n1a', label: 'CFO: cost reduction lens' }, { id: 'n1b', label: 'CTO: capability platform lens' }] },
            { id: 'n2', label: 'Governance vacuum', expanded: true, children: [{ id: 'n2a', label: 'No functioning steering committee' }, { id: 'n2b', label: 'Escalation path unclear' }] },
            { id: 'n3', label: 'Board confidence erosion', children: [{ id: 'n3a', label: 'No credible recovery narrative' }, { id: 'n3b', label: 'Milestone misses not explained' }] },
          ],
        },
      ],
      workstreams: [
        { id: 'ws1', number: 1, title: 'Misalignment Diagnosis', weekRange: 'Wks 1–2', color: '#D4A843', activities: ['Sponsor interviews', 'Investment thesis mapping', 'Conflict root cause analysis'] },
        { id: 'ws2', number: 2, title: 'Alignment Facilitation', weekRange: 'Wks 3–4', color: '#3DAA6E', activities: ['Facilitated alignment session', 'Shared success metrics design', 'Governance model reset'] },
        { id: 'ws3', number: 3, title: 'Narrative Rebuild', weekRange: 'Wks 5–6', color: '#4A90D9', activities: ['Investment narrative redesign', 'Board presentation preparation', 'Governance launch'] },
      ],
      roadmap: [
        { days: 30, title: 'Diagnose', subtitle: 'Map & Understand', color: '#D4A843', milestones: ['Complete sponsor interviews and conflict mapping', 'Identify the core investment thesis disagreement', 'Design facilitated alignment intervention'] },
        { days: 60, title: 'Align', subtitle: 'Facilitate & Agree', color: '#3DAA6E', milestones: ['Conduct facilitated executive alignment session', 'Agree on shared success metrics and program scope', 'Reset governance model with clear decision rights'] },
        { days: 90, title: 'Restore', subtitle: 'Narrate & Launch', color: '#4A90D9', milestones: ['Deliver rebuilt investment narrative to board', 'Launch new governance model with steering committee', 'Re-establish program momentum with aligned leadership'] },
      ],
      execSummary: `${brief.clientName}'s ERP program has the technical foundation and the organizational capability to succeed. What it lacks is a unified executive voice.

The CFO-CTO conflict is resolvable — but only through a structured, facilitated process that surfaces the underlying investment thesis disagreement and builds a shared framework for measuring success. Our 6-week engagement will deliver that resolution.

The outcome will be a rebuilt governance model, a shared investment narrative, and a board-ready recovery package that restores confidence in the program and the leadership team's ability to deliver it.`,
      deckOutline: [
        { number: 1, title: 'The Governance Crisis', purpose: 'Frame the severity of misalignment', keyMessage: 'CFO-CTO conflict has created a governance vacuum — program cannot proceed', visual: 'Stakeholder alignment map' },
        { number: 2, title: 'Investment Thesis Conflict', purpose: 'Diagnose the root disagreement', keyMessage: 'Cost reduction vs. capability platform — two valid but incompatible lenses', visual: 'Investment thesis comparison' },
        { number: 3, title: 'Alignment Intervention Design', purpose: 'Propose the facilitation approach', keyMessage: 'Structured facilitation, not bilateral negotiation', visual: 'Alignment process diagram' },
        { number: 4, title: 'Shared Success Framework', purpose: 'Propose unified metrics', keyMessage: 'A single scorecard that satisfies both CFO and CTO objectives', visual: 'Balanced scorecard' },
        { number: 5, title: 'Governance Reset', purpose: 'Redesign the steering model', keyMessage: 'Clear decision rights, functioning steering committee, escalation path', visual: 'Governance structure' },
        { number: 6, title: 'Board Recovery Package', purpose: 'Restore board confidence', keyMessage: 'Evidence-based narrative that explains the stall and the path forward', visual: 'Recovery timeline and milestones' },
      ],
      confidenceScores: { 'Problem Statement': 93, 'Issue Tree': 88, 'Workstreams': 85, '30/60/90 Roadmap': 82, 'Exec Summary': 91, 'Deck Outline': 86 },
      sourceCitations: {
        'Problem Statement': [
          { id: 'sc1', label: 'Stakeholder Alignment Diagnostic', sourceType: 'firm_library', fileName: 'Stakeholder Alignment Diagnostic.docx', chunkRef: 'Chunk 7/29', relevance: 'Investment thesis conflict as root cause of governance vacuum' },
          { id: 'sc2', label: 'Executive Sponsor Alignment Notes', sourceType: 'client_folder', fileName: 'Executive Sponsor Alignment Notes.gdoc', chunkRef: 'Chunk 2/0', relevance: 'Pending ingestion — executive sponsor conflict context' },
        ],
        'Workstreams': [
          { id: 'sc3', label: 'Executive Narrative Framework', sourceType: 'firm_library', fileName: 'Executive Narrative Framework.docx', chunkRef: 'Chunk 5/22', relevance: 'Investment narrative rebuild methodology for C-suite realignment' },
        ],
      },
      hallucinationFlags: [
        { id: 'hf1', section: 'Problem Statement', claim: 'CFO-CTO conflict framing', flagType: 'low_confidence', severity: 'high', suggestion: 'Explicitly naming the CFO-CTO conflict in client materials carries relationship risk — validate framing with engagement sponsor' },
        { id: 'hf2', section: 'Exec Summary', claim: 'program has the right technical foundation', flagType: 'unverified_statistic', severity: 'low', suggestion: 'Validate with implementation team before including in client-facing materials' },
      ],
    },
  };

  return packs[archetype];
}

// ─── Wear-Test Flags ──────────────────────────────────────────────────────────

export function generateWearTestData(brief: EngagementBrief): WearTestData {
  const archetype = brief.archetype || 'ai_transformation';
  const pack = generateStarterPack(brief);

  const flagSets: Record<EngagementArchetype, WearTestData['flags']> = {
    ai_transformation: [
      { id: 'flag1', severity: 'High', section: 'Problem Statement', category: 'Assumption', title: '15–22% cycle time gap vs. industry benchmark requires validation', description: 'The stated production cycle time gap is an AI-generated estimate based on analogous engagements. Confirm with client operational data before including in client-facing materials.', status: 'pending' },
      { id: 'flag2', severity: 'Medium', section: 'Workstreams', category: 'Sequencing', title: 'Pilot timeline (Wks 11–16) may be aggressive given data standardization dependencies', description: 'Predictive maintenance model development assumes data standardization is complete by Week 10. Validate feasibility with client IT team before committing to this timeline.', status: 'pending' },
      { id: 'flag3', severity: 'Medium', section: 'Issue Tree', category: 'Framing', title: 'Talent gap framing is secondary to infrastructure — confirm prioritization', description: 'Issue tree positions talent gaps as tertiary. Confirmed appropriate based on client brief context.', status: 'approved', validatedBy: 'AH' },
      { id: 'flag4', severity: 'Low', section: 'Exec Summary', category: 'Claim', title: 'Competitor acceleration claim needs supporting evidence', description: 'The exec summary references competitors accelerating digital transformation. Validate with market data before client presentation.', status: 'pending' },
      { id: 'flag5', severity: 'High', section: 'Roadmap', category: 'Dependency', title: 'Steering committee formation assumed within 2 weeks — confirm executive availability', description: 'The 30-day milestone assumes executive steering committee can be formed within 2 weeks. Validate with client sponsor before committing.', status: 'escalated', validatedBy: 'AH' },
      { id: 'flag6', severity: 'Low', section: 'Deck Outline', category: 'Data', title: '$8–12M maintenance savings estimate requires actuarial validation', description: 'ROI estimate is based on industry benchmarks from analogous manufacturing engagements. Requires client-specific data validation.', status: 'approved', validatedBy: 'AH' },
      { id: 'flag7', severity: 'Low', section: 'Workstreams', category: 'Resource', title: 'ML engineering capacity assumption not validated with client', description: 'Workstream 3 assumes client has or can acquire ML engineering capacity. Confirm talent availability before finalizing workplan.', status: 'approved', validatedBy: 'AH' },
    ],
    delivery_standardization: [
      { id: 'flag1', severity: 'High', section: 'Problem Statement', category: 'Data', title: '23% overrun rate requires validation against actual project data', description: 'The overrun rate is an AI-generated estimate. Validate against actual project portfolio data before using in client materials.', status: 'pending' },
      { id: 'flag2', severity: 'Medium', section: 'Workstreams', category: 'Adoption', title: 'Regional lead buy-in assumed — stakeholder mapping required', description: 'The rollout plan assumes regional leads will champion the new methodology. Conduct stakeholder mapping to validate alignment.', status: 'pending' },
      { id: 'flag3', severity: 'Low', section: 'Roadmap', category: 'Timeline', title: '12-week timeline may be tight for 8-office rollout', description: 'Full deployment across 8 offices in 12 weeks is ambitious. Consider phased rollout with 2-3 pilot offices first.', status: 'approved', validatedBy: 'AH' },
    ],
    execution_stall: [
      { id: 'flag1', severity: 'High', section: 'Problem Statement', category: 'Data', title: '40% budget / 22% delivery ratio requires verification', description: 'These program health metrics are based on brief inputs. Validate against actual program reporting before using in recovery narrative.', status: 'pending' },
      { id: 'flag2', severity: 'High', section: 'Workstreams', category: 'Assumption', title: 'Governance reset assumes executive willingness to change — validate', description: 'The governance reset workstream assumes both sponsors are willing to accept a new governance model. Validate executive openness before designing the intervention.', status: 'escalated', validatedBy: 'AH' },
      { id: 'flag3', severity: 'Medium', section: 'Roadmap', category: 'Timeline', title: '8-week recovery timeline is aggressive for a $40M program', description: 'Recovery timelines for programs of this scale typically require 12–16 weeks. Validate feasibility with program team.', status: 'pending' },
    ],
    operating_model: [
      { id: 'flag1', severity: 'High', section: 'Problem Statement', category: 'Data', title: '$12M efficiency target source requires validation', description: 'The $12M synergy target is referenced from the brief. Validate the methodology behind this estimate before using in board materials.', status: 'pending' },
      { id: 'flag2', severity: 'Medium', section: 'Workstreams', category: 'Risk', title: 'Clinical operations redesign carries patient safety risk — requires clinical governance', description: 'Any redesign touching clinical operations must involve clinical governance and regulatory review. Ensure this is scoped into the engagement.', status: 'escalated', validatedBy: 'AH' },
      { id: 'flag3', severity: 'Low', section: 'Issue Tree', category: 'Framing', title: 'Integration fatigue framing may be sensitive — validate with HR', description: 'Referencing integration fatigue in client materials may be sensitive. Validate framing with HR leadership before including.', status: 'approved', validatedBy: 'AH' },
    ],
    sponsor_misalignment: [
      { id: 'flag1', severity: 'High', section: 'Problem Statement', category: 'Sensitivity', title: 'CFO-CTO conflict framing requires careful handling in client materials', description: 'Explicitly naming the CFO-CTO conflict in client-facing materials carries relationship risk. Validate framing approach with engagement sponsor before sharing.', status: 'pending' },
      { id: 'flag2', severity: 'Medium', section: 'Workstreams', category: 'Assumption', title: 'Facilitated alignment session assumes both sponsors will participate', description: 'The alignment intervention requires both the CFO and CTO to participate in a joint session. Confirm willingness before designing the intervention.', status: 'pending' },
      { id: 'flag3', severity: 'Low', section: 'Exec Summary', category: 'Claim', title: 'Technical foundation claim requires validation', description: 'The exec summary states the program has the right technical foundation. Validate with the implementation team before including.', status: 'approved', validatedBy: 'AH' },
    ],
  };

  return {
    flags: flagSets[archetype],
    confidenceScores: pack.confidenceScores,
  };
}
