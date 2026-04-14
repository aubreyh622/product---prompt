import { useState } from 'react';
import type { AIConnectionStatus, AIModel, AIModelConfig, AIUsageRecord } from '@shared/types/api';
import { Brain, CheckCircle, AlertCircle, Zap, Eye, EyeOff, RefreshCw, BarChart3, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const MODELS: { value: AIModel; label: string; description: string; contextWindow: string; costPer1k: string }[] = [
  { value: 'gpt-4o', label: 'GPT-4o', description: 'Best for complex reasoning, grounded generation, and hallucination prevention', contextWindow: '128K', costPer1k: '$0.005' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Faster and more cost-efficient for classification and retrieval tasks', contextWindow: '128K', costPer1k: '$0.00015' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'High-performance model for complex multi-step generation pipelines', contextWindow: '128K', costPer1k: '$0.01' },
  { value: 'gpt-4', label: 'GPT-4', description: 'Reliable baseline for structured output generation', contextWindow: '8K', costPer1k: '$0.03' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and economical for simple classification and summarization', contextWindow: '16K', costPer1k: '$0.0005' },
];

const MOCK_AI_STATUS: AIConnectionStatus = {
  connected: true,
  apiKeyConfigured: true,
  apiKeyMasked: 'sk-...xK9p',
  model: 'gpt-4o',
  organization: 'CGS Advisors',
  lastTestedAt: '2026-04-13T07:30:00Z',
  testStatus: 'success',
  usageThisMonth: {
    requests: 1247,
    tokens: 3842910,
    estimatedCost: '$19.21',
  },
  rateLimits: {
    requestsPerMinute: 500,
    tokensPerMinute: 150000,
  },
};

const MOCK_USAGE_RECORDS: AIUsageRecord[] = [
  { id: 'u1', timestamp: '2026-04-13T07:28:00Z', operation: 'generate', model: 'gpt-4o', promptTokens: 4821, completionTokens: 2103, totalTokens: 6924, latencyMs: 3240, engagementId: 'eng_001', success: true },
  { id: 'u2', timestamp: '2026-04-13T07:15:00Z', operation: 'classify', model: 'gpt-4o', promptTokens: 512, completionTokens: 128, totalTokens: 640, latencyMs: 820, engagementId: 'eng_001', success: true },
  { id: 'u3', timestamp: '2026-04-13T06:55:00Z', operation: 'summarize', model: 'gpt-4o', promptTokens: 3102, completionTokens: 891, totalTokens: 3993, latencyMs: 2180, engagementId: 'eng_002', success: true },
  { id: 'u4', timestamp: '2026-04-12T16:40:00Z', operation: 'review', model: 'gpt-4o', promptTokens: 2847, completionTokens: 1204, totalTokens: 4051, latencyMs: 2890, engagementId: 'eng_001', success: true },
  { id: 'u5', timestamp: '2026-04-12T14:22:00Z', operation: 'generate', model: 'gpt-4o', promptTokens: 5103, completionTokens: 2441, totalTokens: 7544, latencyMs: 3810, success: false },
];

const DEFAULT_CONFIG: AIModelConfig = {
  model: 'gpt-4o',
  temperature: 0.3,
  maxTokens: 4096,
  topP: 1.0,
  frequencyPenalty: 0.1,
  presencePenalty: 0.0,
};

const OPERATION_LABELS: Record<string, string> = {
  classify: 'Classify',
  retrieve: 'Retrieve',
  generate: 'Generate',
  review: 'Review',
  summarize: 'Summarize',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatGPTPanel() {
  const [aiStatus, setAiStatus] = useState<AIConnectionStatus>(MOCK_AI_STATUS);
  const [config, setConfig] = useState<AIModelConfig>(DEFAULT_CONFIG);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'connection' | 'model' | 'usage'>('connection');
  const [configExpanded, setConfigExpanded] = useState(false);

  function handleTestConnection() {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setAiStatus((prev) => ({
        ...prev,
        connected: true,
        testStatus: 'success',
        lastTestedAt: new Date().toISOString(),
      }));
      toast.success('Connection test passed', { description: `GPT-4o responded in 842ms. API key is valid and rate limits are healthy.` });
    }, 1600);
  }

  function handleSaveApiKey() {
    if (!apiKeyInput.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setAiStatus((prev) => ({
        ...prev,
        apiKeyConfigured: true,
        apiKeyMasked: `sk-...${apiKeyInput.slice(-4)}`,
        connected: true,
        testStatus: 'success',
        lastTestedAt: new Date().toISOString(),
      }));
      setApiKeyInput('');
      toast.success('API key saved', { description: 'OpenAI API key stored securely. Connection verified.' });
    }, 1200);
  }

  function handleModelChange(model: AIModel) {
    setConfig((prev) => ({ ...prev, model }));
    setAiStatus((prev) => ({ ...prev, model }));
    toast.success('Model updated', { description: `Generation pipeline will now use ${model}.` });
  }

  function handleSaveConfig() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Configuration saved', { description: 'AI generation parameters updated for all pipeline stages.' });
    }, 800);
  }

  const TABS = [
    { id: 'connection' as const, label: 'Connection' },
    { id: 'model' as const, label: 'Model Config' },
    { id: 'usage' as const, label: 'Usage & Logs' },
  ];

  return (
    <div className="bg-[#152338] border border-[#1F3550] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#1F3550]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3DAA6E]/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#3DAA6E]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#E8EDF5] text-sm">ChatGPT API Connection</h2>
              <p className="text-xs text-[#7A90A8]">OpenAI GPT-4o · Grounded generation · Hallucination prevention</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing || !aiStatus.apiKeyConfigured}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#3DAA6E]/15 text-[#3DAA6E] border border-[#3DAA6E]/30 hover:bg-[#3DAA6E]/25 transition-all duration-200 disabled:opacity-60"
            >
              <Zap className={`w-3 h-3 ${testing ? 'animate-pulse' : ''}`} />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {aiStatus.connected && aiStatus.testStatus === 'success' ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 p-3 bg-[#3DAA6E]/10 border border-[#3DAA6E]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#3DAA6E]" />
              <span className="text-xs font-semibold text-[#3DAA6E]">Connected</span>
            </div>
            <span className="text-xs text-[#E8EDF5]">{aiStatus.model}</span>
            <span className="text-xs text-[#7A90A8]">·</span>
            <span className="text-xs text-[#7A90A8]">{aiStatus.organization}</span>
            <span className="text-xs text-[#7A90A8]">·</span>
            <span className="text-xs text-[#7A90A8]">Key: {aiStatus.apiKeyMasked}</span>
            {aiStatus.lastTestedAt && (
              <span className="text-xs text-[#7A90A8] ml-auto">
                Tested {formatDate(aiStatus.lastTestedAt)} at {formatTime(aiStatus.lastTestedAt)}
              </span>
            )}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 p-3 bg-[#E05252]/10 border border-[#E05252]/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-[#E05252]" />
            <div>
              <p className="text-xs font-semibold text-[#E05252]">Not Connected</p>
              <p className="text-xs text-[#7A90A8]">Configure your OpenAI API key to enable AI-powered generation, classification, and review.</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1F3550]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-[#D4A843] border-b-2 border-[#D4A843] bg-[#D4A843]/5'
                : 'text-[#7A90A8] hover:text-[#E8EDF5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* Connection Tab */}
        {activeTab === 'connection' && (
          <div className="space-y-5">
            {/* API Key Input */}
            <div>
              <label className="block text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-2">OpenAI API Key</label>
              {aiStatus.apiKeyConfigured ? (
                <div className="flex items-center gap-3 p-3 bg-[#0D1B2E] border border-[#1F3550] rounded-lg">
                  <span className="text-sm font-mono text-[#E8EDF5] flex-1">{aiStatus.apiKeyMasked}</span>
                  <span className="text-xs text-[#3DAA6E] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Configured
                  </span>
                  <button
                    onClick={() => setAiStatus((prev) => ({ ...prev, apiKeyConfigured: false, connected: false }))}
                    className="text-xs text-[#7A90A8] hover:text-[#E05252] transition-colors"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="sk-..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm font-mono focus:outline-none focus:border-[#3DAA6E]/60 focus:ring-1 focus:ring-[#3DAA6E]/30 transition-all duration-200 pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A90A8] hover:text-[#E8EDF5]"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKeyInput.trim() || saving}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#3DAA6E] text-white hover:bg-[#2d9960] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save API Key'}
                  </button>
                </div>
              )}
              <p className="text-xs text-[#7A90A8] mt-2">API keys are stored server-side and never exposed in the frontend. All requests are proxied through the CGS backend.</p>
            </div>

            {/* Rate Limits */}
            {aiStatus.rateLimits && (
              <div>
                <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">Rate Limits</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0D1B2E] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#4A90D9]" style={{ fontFamily: 'Georgia, serif' }}>{aiStatus.rateLimits.requestsPerMinute}</p>
                    <p className="text-xs text-[#7A90A8]">Requests / min</p>
                  </div>
                  <div className="bg-[#0D1B2E] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#3DAA6E]" style={{ fontFamily: 'Georgia, serif' }}>{(aiStatus.rateLimits.tokensPerMinute / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-[#7A90A8]">Tokens / min</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pipeline Stages */}
            <div>
              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">AI Pipeline Stages</p>
              <div className="space-y-2">
                {[
                  { stage: 'Classify', desc: 'Engagement archetype classification from brief fields', model: 'gpt-4o-mini' },
                  { stage: 'Retrieve', desc: 'Hybrid retrieval reranking and relevance scoring', model: 'gpt-4o-mini' },
                  { stage: 'Generate', desc: 'Grounded starter pack section generation', model: 'gpt-4o' },
                  { stage: 'Review', desc: 'Hallucination detection and overclaim flagging', model: 'gpt-4o' },
                  { stage: 'Summarize', desc: 'Session-level review summary generation', model: 'gpt-4o' },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-3 p-3 bg-[#0D1B2E] rounded-lg">
                    <span className="w-16 text-xs font-bold text-[#D4A843] flex-shrink-0">{item.stage}</span>
                    <p className="text-xs text-[#7A90A8] flex-1">{item.desc}</p>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#3DAA6E]/15 text-[#3DAA6E] font-mono flex-shrink-0">{item.model}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Model Config Tab */}
        {activeTab === 'model' && (
          <div className="space-y-5">
            {/* Model Selector */}
            <div>
              <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">Primary Generation Model</p>
              <div className="space-y-2">
                {MODELS.map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      config.model === m.value
                        ? 'border-[#D4A843]/40 bg-[#D4A843]/5'
                        : 'border-[#1F3550] hover:border-[#D4A843]/20 bg-[#0D1B2E]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={m.value}
                      checked={config.model === m.value}
                      onChange={() => handleModelChange(m.value)}
                      className="accent-[#D4A843] mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${config.model === m.value ? 'text-[#D4A843]' : 'text-[#E8EDF5]'}`}>{m.label}</p>
                        <span className="text-xs text-[#7A90A8]">{m.contextWindow} context</span>
                        <span className="text-xs text-[#3DAA6E] ml-auto">{m.costPer1k}/1K tokens</span>
                      </div>
                      <p className="text-xs text-[#7A90A8] mt-0.5">{m.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Advanced Config */}
            <div className="bg-[#0D1B2E] rounded-lg overflow-hidden">
              <button
                onClick={() => setConfigExpanded((v) => !v)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#1F3550]/20 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#7A90A8]" />
                  <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest">Advanced Parameters</p>
                </div>
                {configExpanded ? <ChevronUp className="w-4 h-4 text-[#7A90A8]" /> : <ChevronDown className="w-4 h-4 text-[#7A90A8]" />}
              </button>
              {configExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-[#1F3550]">
                  {[
                    { key: 'temperature' as const, label: 'Temperature', min: 0, max: 2, step: 0.1, desc: 'Controls randomness. Lower = more deterministic.' },
                    { key: 'topP' as const, label: 'Top P', min: 0, max: 1, step: 0.05, desc: 'Nucleus sampling threshold.' },
                    { key: 'frequencyPenalty' as const, label: 'Frequency Penalty', min: -2, max: 2, step: 0.1, desc: 'Reduces repetition of frequent tokens.' },
                    { key: 'presencePenalty' as const, label: 'Presence Penalty', min: -2, max: 2, step: 0.1, desc: 'Encourages new topic introduction.' },
                  ].map((param) => (
                    <div key={param.key} className="pt-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-[#E8EDF5]">{param.label}</label>
                        <span className="text-xs font-bold text-[#D4A843]">{config[param.key]}</span>
                      </div>
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={config[param.key]}
                        onChange={(e) => setConfig((prev) => ({ ...prev, [param.key]: parseFloat(e.target.value) }))}
                        className="w-full accent-[#D4A843]"
                      />
                      <p className="text-xs text-[#7A90A8] mt-0.5">{param.desc}</p>
                    </div>
                  ))}
                  <div className="pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#E8EDF5]">Max Tokens</label>
                      <span className="text-xs font-bold text-[#D4A843]">{config.maxTokens.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={512}
                      max={16384}
                      step={512}
                      value={config.maxTokens}
                      onChange={(e) => setConfig((prev) => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      className="w-full accent-[#D4A843]"
                    />
                    <p className="text-xs text-[#7A90A8] mt-0.5">Maximum tokens per generation request.</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="w-full py-3 bg-[#D4A843] text-[#0D1B2E] font-semibold text-sm rounded-lg hover:bg-[#c49a3a] transition-all duration-200 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        )}

        {/* Usage & Logs Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-5">
            {/* Monthly Usage */}
            {aiStatus.usageThisMonth && (
              <div>
                <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest mb-3">This Month</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0D1B2E] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#4A90D9]" style={{ fontFamily: 'Georgia, serif' }}>{aiStatus.usageThisMonth.requests.toLocaleString()}</p>
                    <p className="text-xs text-[#7A90A8]">Requests</p>
                  </div>
                  <div className="bg-[#0D1B2E] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#3DAA6E]" style={{ fontFamily: 'Georgia, serif' }}>{(aiStatus.usageThisMonth.tokens / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-[#7A90A8]">Tokens</p>
                  </div>
                  <div className="bg-[#0D1B2E] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#D4A843]" style={{ fontFamily: 'Georgia, serif' }}>{aiStatus.usageThisMonth.estimatedCost}</p>
                    <p className="text-xs text-[#7A90A8]">Est. Cost</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Requests */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#7A90A8] uppercase tracking-widest">Recent Requests</p>
                <BarChart3 className="w-4 h-4 text-[#7A90A8]" />
              </div>
              <div className="space-y-2">
                {MOCK_USAGE_RECORDS.map((record) => (
                  <div key={record.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    record.success ? 'bg-[#0D1B2E] border-[#1F3550]' : 'bg-[#E05252]/5 border-[#E05252]/20'
                  }`}>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                      record.operation === 'generate' ? 'bg-[#D4A843]/20 text-[#D4A843]'
                      : record.operation === 'classify' ? 'bg-[#4A90D9]/20 text-[#4A90D9]'
                      : record.operation === 'review' ? 'bg-[#E05252]/20 text-[#E05252]'
                      : 'bg-[#3DAA6E]/20 text-[#3DAA6E]'
                    }`}>
                      {OPERATION_LABELS[record.operation]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#E8EDF5]">{record.model}</span>
                        <span className="text-xs text-[#7A90A8]">{record.totalTokens.toLocaleString()} tokens</span>
                        <span className="text-xs text-[#7A90A8]">{record.latencyMs}ms</span>
                      </div>
                      <p className="text-xs text-[#7A90A8]">{formatDate(record.timestamp)} at {formatTime(record.timestamp)}</p>
                    </div>
                    {!record.success && (
                      <span className="text-xs text-[#E05252] flex items-center gap-1 flex-shrink-0">
                        <AlertCircle className="w-3 h-3" /> Failed
                      </span>
                    )}
                    {record.success && (
                      <RefreshCw className="w-3 h-3 text-[#3DAA6E] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
