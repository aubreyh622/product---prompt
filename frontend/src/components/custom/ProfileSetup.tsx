import { useState } from 'react';
import type { User } from '@shared/types/api';
import { User as UserIcon } from 'lucide-react';

interface ProfileSetupProps {
  user: User;
  onComplete: (user: User) => void;
}

const PRACTICE_AREAS = [
  'Digital Transformation',
  'Strategy & Operations',
  'Technology Advisory',
  'Change Management',
  'Knowledge Management',
  'Finance & Performance',
  'Supply Chain',
  'Human Capital',
];

const INDUSTRY_FOCUSES = [
  'Industrial Manufacturing',
  'Professional Services',
  'Enterprise Technology',
  'Financial Services',
  'Healthcare',
  'Cross-industry',
  'Energy & Utilities',
  'Consumer & Retail',
];

export default function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || '');
  const [practiceArea, setPracticeArea] = useState(user.practiceArea || '');
  const [industryFocus, setIndustryFocus] = useState(user.industryFocus || '');

  const isComplete = name.trim() !== '' && title.trim() !== '' && practiceArea !== '' && industryFocus !== '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete) return;
    onComplete({ ...user, name, title, practiceArea, industryFocus, profileComplete: true });
  }

  return (
    <div className="min-h-screen bg-[#0D1B2E] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-[#D4A843] rounded-sm flex items-center justify-center">
            <span className="text-[#0D1B2E] font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>C</span>
          </div>
          <div>
            <span className="font-bold text-[#E8EDF5] text-xl" style={{ fontFamily: 'Georgia, serif' }}>CGS</span>
            <span className="text-[#7A90A8] text-sm ml-2 tracking-widest uppercase text-xs">Delivery Copilot</span>
          </div>
        </div>

        <div className="bg-[#152338] border border-[#1F3550] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#2D5282] flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#D4A843]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E8EDF5]" style={{ fontFamily: 'Georgia, serif' }}>Profile Setup</h1>
              <p className="text-xs text-[#7A90A8]">Complete your profile to personalize knowledge activation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Full Name <span className="text-[#E05252]">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Title / Role <span className="text-[#E05252]">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Consultant"
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] placeholder-[#7A90A8] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Practice Area <span className="text-[#E05252]">*</span></label>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value)}
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
                >
                  <option value="">Select practice area...</option>
                  {PRACTICE_AREAS.map((pa) => <option key={pa} value={pa}>{pa}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E8EDF5] mb-2">Industry Focus <span className="text-[#E05252]">*</span></label>
                <select
                  value={industryFocus}
                  onChange={(e) => setIndustryFocus(e.target.value)}
                  className="w-full bg-[#0D1B2E] border border-[#1F3550] rounded-lg px-4 py-3 text-[#E8EDF5] text-sm focus:outline-none focus:border-[#D4A843]/60 focus:ring-1 focus:ring-[#D4A843]/30 transition-all duration-200"
                >
                  <option value="">Select industry focus...</option>
                  {INDUSTRY_FOCUSES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isComplete}
              className={`w-full py-3 font-semibold text-sm rounded-lg transition-all duration-200 mt-2 ${
                isComplete
                  ? 'bg-[#D4A843] text-[#0D1B2E] hover:bg-[#c49a3a]'
                  : 'bg-[#1F3550] text-[#7A90A8] cursor-not-allowed'
              }`}
            >
              Complete Profile & Enter Copilot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
