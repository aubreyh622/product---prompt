// Thin client for the backend /api/engagement/* AI endpoints.
import { API_BASE_URL } from '@/config/constants';
import type {
  EngagementArchetype,
  EngagementBrief,
  WorkingHypothesis,
} from '@shared/types/api';

export interface ClassificationResult {
  archetype: EngagementArchetype;
  confidence: number;
  reasoning: string;
}

const VALID_ARCHETYPES: EngagementArchetype[] = [
  'ai_transformation',
  'delivery_standardization',
  'execution_stall',
  'operating_model',
  'sponsor_misalignment',
];

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api/engagement${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Request to ${path} failed`);
  }
  return json.data as T;
}

export async function classifyBrief(
  brief: EngagementBrief,
): Promise<ClassificationResult> {
  const data = await post<ClassificationResult>('/classify', brief);
  // Coerce archetype to a known value; fall back to ai_transformation.
  const archetype = VALID_ARCHETYPES.includes(data.archetype)
    ? data.archetype
    : 'ai_transformation';
  return {
    archetype,
    confidence: Math.max(0, Math.min(100, Math.round(Number(data.confidence) || 0))),
    reasoning: data.reasoning || '',
  };
}

export async function generateHypotheses(
  brief: EngagementBrief,
): Promise<WorkingHypothesis[]> {
  const data = await post<WorkingHypothesis[]>('/generate-hypothesis', brief);
  return Array.isArray(data) ? data : [];
}

export async function generateProblemStatement(
  brief: EngagementBrief,
  frameworks?: string[],
): Promise<string> {
  const data = await post<{ problemStatement: string }>(
    '/generate-problem-statement',
    { brief, frameworks },
  );
  return data.problemStatement;
}

export async function generateExecSummary(
  brief: EngagementBrief,
  problemStatement?: string,
): Promise<string> {
  const data = await post<{ execSummary: string }>('/generate-exec-summary', {
    brief,
    problemStatement,
  });
  return data.execSummary;
}
