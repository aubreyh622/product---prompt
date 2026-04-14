import express from 'express';
import { createAIService } from '../services/aiService';
import type { EngagementBrief } from '../../shared/types/api';

const router = express.Router();

// POST /api/engagement/classify
// Classifies an engagement brief against known archetypes
router.post('/classify', async (req, res) => {
  try {
    const brief = req.body as EngagementBrief;
    if (!brief.clientName || !brief.objective || !brief.coreChallenge) {
      return res.status(400).json({ success: false, message: 'Missing required brief fields' });
    }

    const aiService = createAIService();
    const systemPrompt = `You are an expert management consulting engagement classifier at CGS Advisors.
Your task is to classify an engagement brief into one of these archetypes:
- ai_transformation: AI/digital transformation, technology adoption, data infrastructure
- delivery_standardization: Delivery methodology, project management, quality standards
- execution_stall: Program recovery, stalled initiatives, governance breakdown
- operating_model: Org design, operating model, post-merger integration, RACI
- sponsor_misalignment: Stakeholder alignment, executive conflict, governance vacuum

Respond with ONLY a JSON object: { "archetype": "<archetype_id>", "confidence": <0-100>, "reasoning": "<brief explanation>" }`;

    const userMessage = `Classify this engagement brief:
Client: ${brief.clientName}
Industry: ${brief.industry}
Objective: ${brief.objective}
Core Challenge: ${brief.coreChallenge}
Timeline: ${brief.timeline}
Urgency: ${brief.urgency}`;

    const response = await aiService.chat(userMessage, systemPrompt);
    
    let classification;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      classification = jsonMatch ? JSON.parse(jsonMatch[0]) : { archetype: 'ai_transformation', confidence: 70, reasoning: 'Default classification' };
    } catch {
      classification = { archetype: 'ai_transformation', confidence: 70, reasoning: 'Classification parsing failed' };
    }

    return res.json({ success: true, data: classification });
  } catch (error) {
    console.error('Classification error:', error);
    return res.status(500).json({ success: false, message: 'Classification failed' });
  }
});

// POST /api/engagement/generate-hypothesis
// Generates AI working hypotheses for an engagement
router.post('/generate-hypothesis', async (req, res) => {
  try {
    const brief = req.body as EngagementBrief;
    const aiService = createAIService();

    const systemPrompt = `You are a senior management consultant at CGS Advisors generating working hypotheses for a new engagement.
Generate 3 working hypotheses based on the engagement brief. Each hypothesis should be:
- Specific and testable
- Grounded in the stated challenge
- Assigned a confidence level (High or Medium)

Respond with ONLY a JSON array: [{ "id": "h1", "text": "<hypothesis>", "confidence": "High|Medium" }, ...]`;

    const userMessage = `Generate hypotheses for:
Client: ${brief.clientName} (${brief.industry})
Objective: ${brief.objective}
Challenge: ${brief.coreChallenge}`;

    const response = await aiService.chat(userMessage, systemPrompt);
    
    let hypotheses;
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      hypotheses = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      hypotheses = [];
    }

    return res.json({ success: true, data: hypotheses });
  } catch (error) {
    console.error('Hypothesis generation error:', error);
    return res.status(500).json({ success: false, message: 'Hypothesis generation failed' });
  }
});

// POST /api/engagement/generate-problem-statement
// Generates a grounded problem statement for the starter pack
router.post('/generate-problem-statement', async (req, res) => {
  try {
    const { brief, frameworks } = req.body as { brief: EngagementBrief; frameworks?: string[] };
    const aiService = createAIService();

    const systemPrompt = `You are a senior management consultant at CGS Advisors writing a consulting-grade problem statement.
Write a 3-paragraph problem statement that:
1. Opens with the client's strategic context and competitive position
2. Diagnoses the root cause of the core challenge with specificity
3. States the engagement objective and expected outcomes clearly

Avoid: vague language, unsupported statistics, overclaiming. Use precise, evidence-grounded language.
Do NOT use markdown formatting. Write in plain paragraphs separated by blank lines.`;

    const frameworkContext = frameworks && frameworks.length > 0
      ? `\nRelevant frameworks to reference: ${frameworks.join(', ')}` : '';

    const userMessage = `Write a problem statement for:
Client: ${brief.clientName} (${brief.industry})
Objective: ${brief.objective}
Core Challenge: ${brief.coreChallenge}
Timeline: ${brief.timeline}${frameworkContext}`;

    const response = await aiService.chat(userMessage, systemPrompt);
    return res.json({ success: true, data: { problemStatement: response } });
  } catch (error) {
    console.error('Problem statement generation error:', error);
    return res.status(500).json({ success: false, message: 'Generation failed' });
  }
});

// POST /api/engagement/generate-exec-summary
// Generates an executive summary
router.post('/generate-exec-summary', async (req, res) => {
  try {
    const { brief, problemStatement } = req.body as { brief: EngagementBrief; problemStatement?: string };
    const aiService = createAIService();

    const systemPrompt = `You are a senior management consultant at CGS Advisors writing an executive summary for a client engagement.
Write a 3-paragraph executive summary that:
1. Frames the strategic urgency and what is at stake
2. Summarizes the diagnostic approach and key findings
3. States the 3 key outcomes this engagement will deliver and a clear recommendation

Tone: authoritative, direct, consulting-grade. No markdown. Plain paragraphs.`;

    const userMessage = `Write an executive summary for:
Client: ${brief.clientName} (${brief.industry})
Objective: ${brief.objective}
Challenge: ${brief.coreChallenge}
Timeline: ${brief.timeline}${
  problemStatement ? `\nProblem Statement Context: ${problemStatement.slice(0, 300)}...` : ''
}`;

    const response = await aiService.chat(userMessage, systemPrompt);
    return res.json({ success: true, data: { execSummary: response } });
  } catch (error) {
    console.error('Exec summary generation error:', error);
    return res.status(500).json({ success: false, message: 'Generation failed' });
  }
});

export default router;
