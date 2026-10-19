'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, CheckCircle, ChevronRight, Download, Mail, Sparkles, User, RotateCcw, ArrowLeft, Briefcase, Handshake, SlidersHorizontal, Paperclip, FileText, Upload } from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | 'greeting'
  | 'who_are_you'
  | 'preferred_language'
  | 'intent'
  | 'budget'
  | 'scope'
  | 'generating'
  | 'proposal'
  | 'contract_type'
  | 'role_details'
  | 'generating_brief'
  | 'brief'
  | 'followup';

type Message = { role: 'user' | 'assistant'; content: string; originalContent?: string; isNew?: boolean };

type BudgetTier = {
  tier: string;
  tierLabel: string;
  priceRange: string;
  deliverables: string[];
  timeline: string;
  scopeQuestions: string[];
};

type Proposal = {
  proposalTitle: string;
  executiveSummary: string;
  whyRyan: string;
  includedFeatures: string[];
  timeline: string;
  estimatedCost: string;
  nextSteps: string[];
  relevantProjects: { name: string; relevance: string }[];
  budgetConsideration?: {
    summary: string;
    scopeTradeOff: string;
    phasedOptions: { phase: string; scope: string; cost: string; timeline: string }[];
    flexibleTerms: string[];
  };
  closingMessage: string;
  emailDraft: string;
};

type CandidateBrief = {
  briefTitle: string;
  executiveSummary: string;
  skillsMatch: { requirement: string; ryanHas: string }[];
  relevantExperience: { role: string; company: string; relevance: string }[];
  compensationNote: string;
  compensationFlexibility?: {
    summary: string;
    tradeOffs: string[];
  };
  visaSponsorshipNote: string;
  availability: string;
  nextSteps: string[];
  closingMessage: string;
  emailDraft: string;
};

type ContractOption = {
  type: string;
  label: string;
  description: string;
  questions: string[];
};

type DocumentAnalysis = {
  detectedType: 'recruiter' | 'client';
  documentTitle: string;
  companyName: string;
  summary: string;
  extractedData: {
    roleOrProject: string;
    budgetOrSalary: string;
    suggestedTier?: 'starter' | 'standard' | 'professional' | 'enterprise' | null;
    timeline: string;
    keyPoints: string[];
  };
  chatReply: string;
};

const CLIENT_STAGES: Stage[] = ['greeting', 'who_are_you', 'intent', 'budget', 'scope', 'proposal', 'followup'];
const RECRUITER_STAGES: Stage[] = ['greeting', 'who_are_you', 'contract_type', 'role_details', 'brief', 'followup'];

const BUDGET_OPTIONS = [
  { label: 'Starter', sublabel: 'Under $300', value: 'under 300', border: 'border-emerald-500/30 hover:border-emerald-500/60', bg: 'bg-emerald-500/5 hover:bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' },
  { label: 'Standard', sublabel: '$300 – $1,000', value: '300 to 1000', border: 'border-blue-500/30 hover:border-blue-500/60', bg: 'bg-blue-500/5 hover:bg-blue-500/10', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400' },
  { label: 'Professional', sublabel: '$1,000 – $3,000', value: '1000 to 3000', border: 'border-purple-500/30 hover:border-purple-500/60', bg: 'bg-purple-500/5 hover:bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400' },
  { label: 'Enterprise', sublabel: '$3,000+', value: 'over 3000', border: 'border-amber-500/30 hover:border-amber-500/60', bg: 'bg-amber-500/5 hover:bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400' },
];

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const words = text.split(' ');
    setDisplayedText('');
    
    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => prev + (prev ? ' ' : '') + words[index]);
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 45); // Natural human-like typing speed
    
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-purple-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function StageTracker({ current, intent }: { current: Stage; intent: 'client' | 'recruiter' | 'unknown' }) {
  const stageIds = intent === 'recruiter' ? RECRUITER_STAGES : CLIENT_STAGES;
  const normalizedCurrent: Stage = current === 'generating' ? 'proposal' : current === 'generating_brief' ? 'brief' : current === 'greeting' ? 'who_are_you' : current;
  const currentIdx = stageIds.indexOf(normalizedCurrent);

  return (
    <div className="flex flex-col gap-2">
      {stageIds.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const STAGE_LABELS: Partial<Record<Stage, string>> = {
          greeting: 'Welcome', who_are_you: 'Who Are You?', intent: 'Your Goal', budget: 'Budget', scope: 'Scope',
          proposal: 'Proposal', contract_type: 'Contract Type', role_details: 'Role Details',
          brief: 'Candidate Brief', followup: 'Follow-Up',
        };
        const label = STAGE_LABELS[s] || s;
        return (
          <div key={s} className="flex items-center gap-3">
            <motion.div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                done ? 'bg-purple-500 border-purple-500 text-white' :
                active ? 'border-purple-400 bg-purple-400/20 text-purple-300' :
                'border-ag-fg/20 bg-ag-fg/5 text-ag-fg/30'
              }`}
              animate={active ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
            >
              {done ? <CheckCircle size={14} /> : i + 1}
            </motion.div>
            <span className={`text-sm font-medium ${active ? 'text-ag-fg' : done ? 'text-purple-300' : 'text-ag-fg/30'}`}>
              {label}
            </span>
            {active && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CandidateBriefCard({
  brief,
  recruiterName,
  recruiterCompany,
}: {
  brief: CandidateBrief;
  recruiterName?: string;
  recruiterCompany?: string;
}) {
  const [showEmail, setShowEmail] = useState(false);
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [proposeNote, setProposeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleProposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedDate || !proposedTime) {
      setSubmitError('Please select both a date and a time.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/agent/schedule-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterName,
          recruiterCompany,
          proposedDate,
          proposedTime,
          notes: proposeNote,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit proposed meeting time.');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamically construct mailto URL based on the real-time form inputs
  const recruiterSubject = `Interview Request: Ryan Radityatama for ${brief.briefTitle || 'Contract Opportunity'}`;
  
  let recruiterEmailBody = `Dear Ryan,\n\n`;
  recruiterEmailBody += `I hope this email finds you well.\n\n`;
  recruiterEmailBody += `I recently visited your portfolio website and engaged with your AI conductor agent. I am highly impressed by your credentials, technical expertise, and senior-level portfolio, which align perfectly with the caliber of professionals we look for.\n\n`;
  recruiterEmailBody += `On behalf of ${recruiterCompany && recruiterCompany.trim() ? recruiterCompany : 'our team'}, I would love to invite you for an initial conversation to discuss opportunities. We've reviewed your compensation requirements and expectations (${brief.compensationNote || 'Meets expectations'}) and believe there is a great mutual alignment.\n\n`;
  
  if (proposedDate && proposedTime) {
    recruiterEmailBody += `We would love to propose the following time slot for our discussion:\n`;
    recruiterEmailBody += `• Date: ${proposedDate}\n`;
    recruiterEmailBody += `• Time: ${proposedTime} WIB (Jakarta Time)\n`;
    if (proposeNote) {
      recruiterEmailBody += `• Notes: ${proposeNote}\n`;
    }
    recruiterEmailBody += `\n`;
  } else {
    recruiterEmailBody += `We would love to schedule an initial conversation at your earliest convenience. Please let us know what times work best for you.\n\n`;
  }

  recruiterEmailBody += `Should this slot work for you, please let me know and I will forward a calendar invitation with a Google Meet link. If you need to suggest an alternative time, please feel free to propose it in your reply.\n\n`;
  recruiterEmailBody += `Thank you for your time, and I look forward to connecting with you.\n\n`;
  recruiterEmailBody += `Best regards,\n\n`;
  recruiterEmailBody += `${recruiterName || 'Talent Acquisition'}\n`;
  if (recruiterCompany && recruiterCompany.trim()) {
    recruiterEmailBody += `Talent Acquisition at ${recruiterCompany}\n`;
  } else {
    recruiterEmailBody += `Talent Acquisition Specialist\n`;
  }

  const mailtoUrl = `mailto:ryradit@gmail.com?subject=${encodeURIComponent(recruiterSubject)}&body=${encodeURIComponent(recruiterEmailBody)}`;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
      <div className="bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-50 dark:from-blue-900/50 dark:via-indigo-900/40 dark:to-blue-950/60 border border-blue-500/30 rounded-2xl p-6 shadow-lg shadow-blue-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-blue-400" />
          <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">Candidate Brief</span>
        </div>
        <h2 className="text-xl font-bold text-ag-fg leading-tight">{brief.briefTitle}</h2>
        <p className="text-blue-100/80 text-sm mt-2 leading-relaxed">{brief.executiveSummary}</p>
      </div>
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">Skills Match</h3>
        <div className="space-y-3">
          {brief.skillsMatch?.map((s, i) => (
            <div key={i} className="border border-ag-fg/10 rounded-lg p-3">
              <div className="text-xs text-ag-fg/40 uppercase tracking-wide mb-1">Requirement</div>
              <div className="text-ag-fg/80 text-sm">{s.requirement}</div>
              <div className="text-xs text-blue-400 mt-2 flex items-start gap-1.5">
                <CheckCircle size={12} className="mt-0.5 shrink-0" />
                {s.ryanHas}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">Relevant Experience</h3>
        <div className="space-y-3">
          {brief.relevantExperience?.map((e, i) => (
            <div key={i} className="border border-ag-fg/10 rounded-lg p-3">
              <div className="text-ag-fg font-medium text-sm">{e.role}</div>
              <div className="text-ag-fg/40 text-xs">{e.company}</div>
              <div className="text-ag-fg/60 text-xs mt-1">{e.relevance}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">Availability</div>
          <div className="text-ag-fg text-sm font-medium whitespace-pre-line">{brief.availability}</div>
        </div>
        <div className={`rounded-xl p-4 border transition-colors ${
          brief.compensationNote?.includes('Below Preferred Minimum') || brief.compensationNote?.includes('⚠️')
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
            brief.compensationNote?.includes('Below Preferred Minimum') || brief.compensationNote?.includes('⚠️')
              ? 'text-amber-400 font-bold'
              : 'text-blue-400'
          }`}>Compensation</div>
          <div className="text-ag-fg text-sm font-medium">{brief.compensationNote}</div>
        </div>
      </div>

      {/* Compensation Flexibility & Trade-off Consideration */}
      {brief.compensationFlexibility && (
        <div className="bg-gradient-to-br from-blue-950/20 via-indigo-950/15 to-purple-950/10 border border-blue-500/25 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
                Compensation Flexibility & Trade-offs
              </h3>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Open to Negotiation
            </span>
          </div>
          <p className="text-xs text-ag-fg/80 leading-relaxed">
            {brief.compensationFlexibility.summary}
          </p>
          {brief.compensationFlexibility.tradeOffs?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-ag-fg/10">
              {brief.compensationFlexibility.tradeOffs.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-ag-fg/70">
                  <CheckCircle size={13} className="text-blue-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Propose a custom slot block */}
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Propose Custom Time</h3>
            <p className="text-xs text-ag-fg/50 mt-0.5 font-medium">Suggest an interview slot that works best for you</p>
          </div>
          {!submitSuccess && (
            <button
              onClick={() => setShowProposeForm(!showProposeForm)}
              className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-semibold transition-all"
            >
              {showProposeForm ? 'Close' : 'Propose Slot'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showProposeForm && !submitSuccess && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleProposeSubmit}
              className="space-y-3 pt-3 border-t border-ag-fg/10"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ag-fg/60 mb-1 font-medium">Select Date</label>
                  <input
                    type="date"
                    required
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full bg-ag-inv/40 border border-ag-fg/10 rounded-lg px-3 py-2 text-sm text-ag-fg focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ag-fg/60 mb-1 font-medium">Select Time (WIB)</label>
                  <input
                    type="time"
                    required
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    className="w-full bg-ag-inv/40 border border-ag-fg/10 rounded-lg px-3 py-2 text-sm text-ag-fg focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-ag-fg/60 mb-1 font-medium">Add a message or notes (Optional)</label>
                <textarea
                  placeholder="e.g. Proposing Google Meet link..."
                  value={proposeNote}
                  onChange={(e) => setProposeNote(e.target.value)}
                  className="w-full bg-ag-inv/40 border border-ag-fg/10 rounded-lg px-3 py-2 text-sm text-ag-fg focus:outline-none focus:border-emerald-500 transition-colors h-16 resize-none"
                />
              </div>
              {submitError && <p className="text-red-400 text-xs font-semibold">{submitError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-bold rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending slot...
                  </>
                ) : (
                  'Submit Proposed Interview Time'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3"
          >
            <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={18} />
            <div>
              <div className="text-sm font-semibold text-ag-fg">Proposed interview slot sent!</div>
              <p className="text-xs text-ag-fg/70 mt-0.5 leading-relaxed">
                Ryan has been automatically notified of your proposed slot (**{proposedDate} at {proposedTime} WIB**) and will confirm with you via email shortly!
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {brief.visaSponsorshipNote && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-1">🚫 Visa Sponsorship</div>
          <div className="text-ag-fg/80 text-sm">{brief.visaSponsorshipNote}</div>
        </div>
      )}
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">Next Steps</h3>
        <ol className="space-y-2">
          {brief.nextSteps?.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ag-fg/80">
              <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-500/20 rounded-2xl p-5">
        <p className="text-ag-fg/80 text-sm leading-relaxed italic">{brief.closingMessage}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <div className="text-ag-fg text-sm font-semibold">Ryan Radityatama</div>
            <div className="text-ag-fg/40 text-xs">Fullstack Developer | AI & ML Engineer · ryradit@gmail.com</div>
          </div>
        </div>
      </div>
      <button onClick={() => setShowEmail(!showEmail)} className="w-full flex items-center justify-between px-5 py-3 bg-ag-fg/5 border border-ag-fg/10 rounded-xl hover:bg-ag-fg/10 transition-colors">
        <div className="flex items-center gap-2 text-sm text-ag-fg/70"><Mail size={14} />{showEmail ? 'Hide email draft' : 'View follow-up email draft'}</div>
        <ChevronRight size={14} className={`text-ag-fg/40 transition-transform ${showEmail ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {showEmail && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-ag-fg/5 border border-ag-fg/10 rounded-xl p-5 text-sm text-ag-fg/70 whitespace-pre-wrap font-mono leading-relaxed">
            {brief.emailDraft}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic pre-filled email recruiter dispatch button */}
      <a
        href={mailtoUrl}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
      >
        <Mail size={14} />
        Email Ryan About This Role (Pre-filled Draft)
      </a>

      <a
        href="https://drive.google.com/drive/u/1/folders/1TLOvtTZNk3MOc39ARQ9Ndg-wOP_MvPoy?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl transition-all duration-300 text-sm font-semibold text-emerald-400"
      >
        <Download size={14} />
        Download Ryan's CV (PDF)
      </a>
    </motion.div>
  );
}

function ProposalCard({ proposal, visitorName }: { proposal: Proposal; visitorName?: string }) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 via-violet-50 to-purple-50 dark:from-purple-900/50 dark:via-violet-900/40 dark:to-purple-950/60 border border-purple-500/30 rounded-2xl p-6 shadow-lg shadow-purple-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">Your Custom Proposal</span>
        </div>
        <h2 className="text-xl font-bold text-ag-fg leading-tight">{proposal.proposalTitle}</h2>
        <p className="text-purple-100/80 text-sm mt-2 leading-relaxed">{proposal.executiveSummary}</p>
      </div>

      {/* Why Ryan */}
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Why Ryan?</h3>
        <p className="text-ag-fg/80 text-sm leading-relaxed">{proposal.whyRyan}</p>
      </div>

      {/* Cost + Timeline */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">Estimated Cost</div>
          <div className="text-ag-fg font-bold text-lg">{proposal.estimatedCost}</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Timeline</div>
          <div className="text-ag-fg font-bold text-lg">{proposal.timeline}</div>
        </div>
      </div>

      {/* Budget & Scope Consideration */}
      {proposal.budgetConsideration && (
        <div className="bg-gradient-to-br from-indigo-950/20 via-purple-950/15 to-violet-950/10 border border-indigo-500/25 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wide">
                Budget & Scope Flexibility
              </h3>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Customizable Terms
            </span>
          </div>

          <p className="text-xs text-ag-fg/80 leading-relaxed">
            {proposal.budgetConsideration.summary}
          </p>

          {/* Phased Milestones Breakdown */}
          {proposal.budgetConsideration.phasedOptions?.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-semibold text-ag-fg/60 uppercase tracking-wider">
                Recommended Milestone Phasing:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {proposal.budgetConsideration.phasedOptions.map((po, idx) => (
                  <div key={idx} className="rounded-xl border border-ag-fg/10 bg-ag-fg/[0.03] p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold text-ag-fg">
                      <span>{po.phase}</span>
                      <span className="text-indigo-400 font-mono text-[11px]">{po.cost}</span>
                    </div>
                    <p className="text-ag-fg/60 text-[11px] leading-relaxed">{po.scope}</p>
                    <div className="text-[10px] text-ag-fg/40 font-mono">⏱️ {po.timeline}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scope Trade-off Advice */}
          {proposal.budgetConsideration.scopeTradeOff && (
            <div className="rounded-xl bg-purple-500/[0.06] border border-purple-500/20 p-3 text-xs text-purple-200/90 leading-relaxed">
              <span className="font-semibold text-purple-300">💡 Scope Trade-off: </span>
              {proposal.budgetConsideration.scopeTradeOff}
            </div>
          )}

          {/* Flexible Terms Checklist */}
          {proposal.budgetConsideration.flexibleTerms?.length > 0 && (
            <div className="pt-1 border-t border-ag-fg/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-ag-fg/70">
                {proposal.budgetConsideration.flexibleTerms.map((term, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">What's Included</h3>
        <ul className="space-y-2">
          {proposal.includedFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ag-fg/80">
              <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Relevant Projects */}
      {proposal.relevantProjects?.length > 0 && (
        <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">Relevant Work</h3>
          <div className="space-y-3">
            {proposal.relevantProjects.map((p, i) => (
              <div key={i} className="border border-ag-fg/10 rounded-lg p-3">
                <div className="text-ag-fg font-medium text-sm">{p.name}</div>
                <div className="text-ag-fg/50 text-xs mt-1">{p.relevance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-ag-fg/5 border border-ag-fg/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">Next Steps</h3>
        <ol className="space-y-2">
          {proposal.nextSteps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ag-fg/80">
              <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Closing */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/40 dark:to-violet-900/40 border border-purple-500/20 rounded-2xl p-5">
        <p className="text-ag-fg/80 text-sm leading-relaxed italic">{proposal.closingMessage}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <div className="text-ag-fg text-sm font-semibold">Ryan Radityatama</div>
            <div className="text-ag-fg/40 text-xs">Fullstack Developer | AI & ML Engineer · ryradit@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Email Draft */}
      <button
        onClick={() => setShowEmail(!showEmail)}
        className="w-full flex items-center justify-between px-5 py-3 bg-ag-fg/5 border border-ag-fg/10 rounded-xl hover:bg-ag-fg/10 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-ag-fg/70">
          <Mail size={14} />
          {showEmail ? 'Hide email draft' : 'View follow-up email draft'}
        </div>
        <ChevronRight size={14} className={`text-ag-fg/40 transition-transform ${showEmail ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-ag-fg/5 border border-ag-fg/10 rounded-xl p-5 text-sm text-ag-fg/70 whitespace-pre-wrap font-mono leading-relaxed"
          >
            {proposal.emailDraft}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic pre-filled email client dispatch button */}
      <a
        href={`mailto:ryradit@gmail.com?subject=${encodeURIComponent(`Project Inquiry: ${proposal.proposalTitle || 'Development Project'}`)}&body=${encodeURIComponent(
          `Hi Ryan,\n\nI'm reaching out regarding a project collaboration: ${proposal.proposalTitle || 'Development Project'}.\n\nI reviewed your custom AI proposal on your portfolio and I'm highly impressed by your recommended roadmap.\n\nHere are the project parameters we reviewed:\n- Estimated Cost: ${proposal.estimatedCost || 'Not specified'}\n- Timeline: ${proposal.timeline || 'Not specified'}\n\nI'd love to schedule a brief call to discuss getting started and finalizing the scope!\n\nBest regards,\n${visitorName || ''}`
        )}`}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
      >
        <Mail size={14} />
        Email Ryan to Get Started (Pre-filled Draft)
      </a>
    </motion.div>
  );
}

function WelcomeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const paths = [
    {
      icon: Briefcase,
      title: "I have a project",
      sub: "A website, app, or ML model to build",
      points: ["Instant budget-qualified packages", "Structured features & deliverables", "Live timeline & cost estimate"],
    },
    {
      icon: Handshake,
      title: "I want to hire Ryan",
      sub: "A job opening or contract role",
      points: ["Skill-to-resume matching", "Local (IDR) & international (USD) budget checks", "Relocation & sponsorship qualification"],
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ag-inv/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.97, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.97, y: 16, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative max-w-2xl w-full max-h-[92vh] overflow-y-auto bg-ag-bg border border-ag-fg/10 rounded-[28px] p-7 md:p-10 shadow-[0_32px_64px_-24px_rgb(0_0_0/0.5)]"
        >
          <div className="flex items-center gap-2 text-[11px] font-medium text-ag-fg/50">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
              <Bot size={12} />
            </span>
            Proposal Agent
            <span className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <h2 className="mt-6 text-3xl md:text-4xl font-semibold leading-[1.1] tracking-tight text-ag-fg text-balance">
            Skip the email loop. Get a proposal in 60 seconds.
          </h2>
          <p className="mt-3 max-w-lg text-sm md:text-[15px] leading-relaxed text-ag-fg/60">
            Ryan's AI twin qualifies your goals, then builds a tailored project proposal or hiring brief for you.
          </p>

          {/* Steps */}
          <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ag-fg/60">
            {["Identify role", "Answer questions", "Get proposal"].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-purple-500/40 font-mono text-[10px] text-purple-600 dark:text-purple-300">
                    {i + 1}
                  </span>
                  {s}
                </span>
                {i < 2 && <span className="h-px w-6 bg-ag-fg/15" />}
              </li>
            ))}
          </ol>

          {/* Paths */}
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
            {paths.map(({ icon: Icon, title, sub, points }) => (
              <div
                key={title}
                className="rounded-2xl border border-ag-fg/10 bg-ag-fg/[0.03] p-5 transition-colors duration-200 hover:border-purple-500/40 hover:bg-ag-fg/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
                    <Icon size={16} />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-ag-fg">{title}</h4>
                    <p className="text-[11px] text-ag-fg/50">{sub}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-ag-fg/70">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <span className="hidden sm:block text-xs text-ag-fg/40">No sign-up needed · Takes about a minute</span>
            <button
              onClick={onClose}
              className="group ml-auto inline-flex items-center gap-2 rounded-full bg-ag-fg py-2.5 pl-5 pr-2.5 text-sm font-medium text-ag-bg transition-transform duration-200 active:scale-[0.97]"
            >
              Let's begin
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <ChevronRight size={15} />
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AnalyzedDocCard({
  doc,
  onGenerate,
  onDismiss,
  isLoading,
}: {
  doc: { fileName: string; analysis: DocumentAnalysis };
  onGenerate: () => void;
  onDismiss: () => void;
  isLoading: boolean;
}) {
  const isRecruiter = doc.analysis.detectedType === 'recruiter';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/[0.04] backdrop-blur-xl shadow-lg relative my-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-ag-fg truncate max-w-[200px] md:max-w-[300px]">
                {doc.fileName}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isRecruiter
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {isRecruiter ? '🤝 Job Opening / JD' : '💼 Project Scope / RFP'}
              </span>
            </div>
            <p className="text-[11px] text-ag-fg/50 mt-0.5">
              Analyzed with Multimodal AI
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs text-ag-fg/40 hover:text-ag-fg/80 px-2 py-1 rounded hover:bg-ag-fg/5 transition-colors"
          title="Dismiss card"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2.5 mb-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm text-purple-200">
            {doc.analysis.documentTitle}
          </span>
          {doc.analysis.companyName && (
            <span className="text-ag-fg/60 text-xs">· {doc.analysis.companyName}</span>
          )}
        </div>

        <p className="text-ag-fg/75 leading-relaxed bg-ag-fg/[0.03] p-2.5 rounded-lg border border-ag-fg/5">
          {doc.analysis.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
          <div className="px-3 py-2 rounded-lg bg-ag-fg/[0.03] border border-ag-fg/5">
            <span className="text-[10px] text-ag-fg/40 uppercase tracking-wider block">
              {isRecruiter ? 'Target Role & Rate' : 'Deliverables & Budget'}
            </span>
            <span className="text-xs font-medium text-emerald-400 mt-0.5 block">
              {doc.analysis.extractedData.budgetOrSalary || 'Not specified'}
            </span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-ag-fg/[0.03] border border-ag-fg/5">
            <span className="text-[10px] text-ag-fg/40 uppercase tracking-wider block">
              Timeline / Engagement
            </span>
            <span className="text-xs font-medium text-purple-300 mt-0.5 block">
              {doc.analysis.extractedData.timeline || 'Flexible'}
            </span>
          </div>
        </div>

        {doc.analysis.extractedData.keyPoints?.length > 0 && (
          <div className="pt-1">
            <span className="text-[10px] text-ag-fg/40 uppercase tracking-wider block mb-1.5">
              Key Requirements
            </span>
            <div className="flex flex-wrap gap-1.5">
              {doc.analysis.extractedData.keyPoints.map((pt, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px]"
                >
                  ✓ {pt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-ag-fg/10">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/25 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              {isRecruiter
                ? 'Generate Candidate Match Brief (1-Click)'
                : 'Generate Custom Project Proposal (1-Click)'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestAgentPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Ryan's AI assistant. Before we get started — quick question: are you here to commission a project, or are you a recruiter looking to hire Ryan?",
    },
  ]);
  const [stage, setStage] = useState<Stage>('who_are_you');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedDoc, setAnalyzedDoc] = useState<{ fileName: string; analysis: DocumentAnalysis } | null>(null);
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [visitorName, setVisitorName] = useState('');
  const [visitorCompany, setVisitorCompany] = useState('');
  const [detectedIntent, setDetectedIntent] = useState<'client' | 'recruiter' | 'unknown'>('unknown');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [tierData, setTierData] = useState<BudgetTier | null>(null);
  const [scopeAnswers, setScopeAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [currentScopeIdx, setCurrentScopeIdx] = useState(0);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [projectDescription, setProjectDescription] = useState('');
  // Recruiter state
  const [contractOptions, setContractOptions] = useState<ContractOption[]>([]);
  const [selectedContract, setSelectedContract] = useState<ContractOption | null>(null);
  const [roleAnswers, setRoleAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [currentRoleQIdx, setCurrentRoleQIdx] = useState(0);
  const [candidateBrief, setCandidateBrief] = useState<CandidateBrief | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load session from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('hiring_agent_session');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.showWelcome !== undefined) setShowWelcome(data.showWelcome);
        if (data.messages) setMessages(data.messages);
        if (data.stage) setStage(data.stage);
        if (data.visitorName) setVisitorName(data.visitorName);
        if (data.visitorCompany) setVisitorCompany(data.visitorCompany);
        if (data.detectedIntent) setDetectedIntent(data.detectedIntent);
        if (data.selectedBudget) setSelectedBudget(data.selectedBudget);
        if (data.tierData) setTierData(data.tierData);
        if (data.scopeAnswers) setScopeAnswers(data.scopeAnswers);
        if (data.currentScopeIdx !== undefined) setCurrentScopeIdx(data.currentScopeIdx);
        if (data.proposal) setProposal(data.proposal);
        if (data.projectDescription) setProjectDescription(data.projectDescription);
        if (data.contractOptions) setContractOptions(data.contractOptions);
        if (data.selectedContract) setSelectedContract(data.selectedContract);
        if (data.roleAnswers) setRoleAnswers(data.roleAnswers);
        if (data.currentRoleQIdx !== undefined) setCurrentRoleQIdx(data.currentRoleQIdx);
        if (data.candidateBrief) setCandidateBrief(data.candidateBrief);
        if (data.preferredLanguage) setPreferredLanguage(data.preferredLanguage);
        if (data.analyzedDoc) setAnalyzedDoc(data.analyzedDoc);
      } else {
        // No saved session: parse query parameter ?project=...
        const params = new URLSearchParams(window.location.search);
        const projectParam = params.get('project');
        if (projectParam) {
          const cleanProjectName = projectParam.includes(' - ') ? projectParam.split(' - ')[1] : projectParam;
          setMessages([
            {
              role: 'assistant',
              content: `Hi! 👋 I'm Ryan's AI assistant. I noticed you were just looking at my "${cleanProjectName}" project! Would you like to build a similar high-performance platform or qualify a custom project of your own? Let's make it happen!`,
            },
          ]);
        }
      }
    } catch (err) {
      console.warn("Failed to load saved agent session:", err);
    }
  }, []);

  // Save session to sessionStorage on state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const sessionData = {
          showWelcome,
          messages,
          stage,
          visitorName,
          visitorCompany,
          detectedIntent,
          selectedBudget,
          tierData,
          scopeAnswers,
          currentScopeIdx,
          proposal,
          projectDescription,
          contractOptions,
          selectedContract,
          roleAnswers,
          currentRoleQIdx,
          candidateBrief,
          preferredLanguage,
          analyzedDoc,
        };
        sessionStorage.setItem('hiring_agent_session', JSON.stringify(sessionData));
      } catch (err) {
        console.warn("Failed to save agent session:", err);
      }
    }
  }, [
    showWelcome,
    messages,
    stage,
    visitorName,
    visitorCompany,
    detectedIntent,
    selectedBudget,
    tierData,
    scopeAnswers,
    currentScopeIdx,
    proposal,
    projectDescription,
    contractOptions,
    selectedContract,
    roleAnswers,
    currentRoleQIdx,
    candidateBrief,
    preferredLanguage,
    analyzedDoc,
  ]);

  const handleReset = () => {
    if (confirm("Are you sure you want to restart the conversation? This will clear your current progress.")) {
      sessionStorage.removeItem('hiring_agent_session');
      setShowWelcome(true);

      let initialGreeting = "Hi! 👋 I'm Ryan's AI assistant. Before we get started — quick question: are you here to commission a project, or are you a recruiter looking to hire Ryan?";
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get('project');
      if (projectParam) {
        const cleanProjectName = projectParam.includes(' - ') ? projectParam.split(' - ')[1] : projectParam;
        initialGreeting = `Hi! 👋 I'm Ryan's AI assistant. I noticed you were just looking at my "${cleanProjectName}" project! Would you like to build a similar high-performance platform or qualify a custom project of your own? Let's make it happen!`;
      }

      setMessages([
        {
          role: 'assistant',
          content: initialGreeting,
        },
      ]);
      setStage('who_are_you');
      setVisitorName('');
      setVisitorCompany('');
      setDetectedIntent('unknown');
      setSelectedBudget('');
      setTierData(null);
      setScopeAnswers([]);
      setCurrentScopeIdx(0);
      setProposal(null);
      setProjectDescription('');
      setContractOptions([]);
      setSelectedContract(null);
      setRoleAnswers([]);
      setCurrentRoleQIdx(0);
      setCandidateBrief(null);
      setPreferredLanguage('English');
      setAnalyzedDoc(null);
    }
  };

  const addMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!content || !content.trim()) return;
    if (role === 'user') {
      setMessages((prev) => [...prev, { role, content }]);
    } else {
      let textToShow = content;
      if (preferredLanguage && preferredLanguage.toLowerCase() !== 'english') {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: content, targetLanguage: preferredLanguage }),
          });
          const data = await res.json();
          if (data.translation) {
            textToShow = data.translation;
          }
        } catch (err) {
          console.warn("Auto-translation failed:", err);
        }
      }
      setMessages((prev) => [...prev, { role, content: textToShow, originalContent: content, isNew: true }]);
    }
  };

  const [translatingIdx, setTranslatingIdx] = useState<number | null>(null);

  const translateMessage = async (idx: number, langCode: 'en' | 'id' | 'zh') => {
    const msg = messages[idx];
    if (!msg || msg.role !== 'assistant') return;

    let targetLanguage = 'English';
    if (langCode === 'id') targetLanguage = 'Indonesian';
    if (langCode === 'zh') targetLanguage = 'Chinese (Simplified)';

    if (langCode === 'en' && msg.originalContent) {
      setMessages((prev) =>
        prev.map((m, i) => (i === idx ? { ...m, content: m.originalContent! } : m))
      );
      return;
    }

    setTranslatingIdx(idx);
    try {
      const textToTranslate = msg.originalContent || msg.content;
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToTranslate, targetLanguage }),
      });
      const data = await res.json();
      if (data.translation) {
        setMessages((prev) =>
          prev.map((m, i) =>
            i === idx
              ? {
                  ...m,
                  content: data.translation,
                  originalContent: m.originalContent || textToTranslate,
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error("Failed to translate message:", err);
    } finally {
      setTranslatingIdx(null);
    }
  };

  const simulatedDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSend = async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim();
    if (!text || isLoading) return;
    setInput('');
    addMessage('user', text);
    setIsLoading(true);

    try {
      if (stage === 'greeting' || stage === 'who_are_you') {
        // Just capture name/company, then show the choice buttons
        const nameMatch = text.match(/(?:i'?m|my name is|i am)\s+([a-zA-Z]+)/i);
        if (nameMatch) setVisitorName(nameMatch[1]);
        if (text.toLowerCase().includes('from ')) {
          const compMatch = text.match(/from\s+([\w\s]+?)(?:\.|,|$)/i);
          if (compMatch) setVisitorCompany(compMatch[1].trim());
        }
        await simulatedDelay(1000);
        addMessage('assistant', `Thanks! Now, which best describes you?`);
        setStage('who_are_you');

      } else if (stage === 'preferred_language') {
        await handleLanguageSelection(text);

      } else if (stage === 'intent') {
        setProjectDescription(text);
        await simulatedDelay(1200);
        addMessage('assistant', "Great! Now let's talk budget. Which tier best fits your project? You can also just type your budget.");
        setStage('budget');

      } else if (stage === 'budget') {
        // Handle typed budget
        await handleBudgetSelection(text);

      } else if (stage === 'scope') {
        if (!tierData) return;
        const currentQ = tierData.scopeQuestions[currentScopeIdx];
        const remainingQuestions = tierData.scopeQuestions.slice(currentScopeIdx + 1);

        let acknowledgment = '';
        let skippedIndices: number[] = [];
        let extracted: { questionIndex: number; answer: string }[] = [];

        try {
          const analyzeRes = await fetch('/api/agent/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userMessage: text,
              currentQuestion: currentQ,
              upcomingQuestions: remainingQuestions,
            }),
          });
          if (analyzeRes.ok) {
            const data = await analyzeRes.json();
            acknowledgment = data.acknowledgment || '';
            skippedIndices = data.skippedQuestionIndices || [];
            extracted = data.extractedAnswers || [];
          }
        } catch (e) {
          console.warn("Analysis failed, proceeding with normal flow:", e);
        }

        let updatedAnswers = [...scopeAnswers, { question: currentQ, answer: text }];
        
        // 1. Instantly register all extracted answers from the analyzer
        extracted.forEach((item) => {
          const absIdx = currentScopeIdx + 1 + item.questionIndex;
          if (absIdx < tierData.scopeQuestions.length) {
            const qText = tierData.scopeQuestions[absIdx];
            if (!updatedAnswers.some(ans => ans.question === qText)) {
              updatedAnswers.push({
                question: qText,
                answer: item.answer || "Pre-filled/Details provided in conversation"
              });
            }
          }
        });

        // 2. Register any skipped indices that weren't explicitly extracted but flagged
        skippedIndices.forEach((relativeIdx) => {
          const absIdx = currentScopeIdx + 1 + relativeIdx;
          if (absIdx < tierData.scopeQuestions.length) {
            const qText = tierData.scopeQuestions[absIdx];
            if (!updatedAnswers.some(ans => ans.question === qText)) {
              updatedAnswers.push({
                question: qText,
                answer: "Pre-filled/Details provided in conversation"
              });
            }
          }
        });

        // 3. Find the absolute next unanswered question in order
        let nextUnskippedIdx = currentScopeIdx + 1;
        while (nextUnskippedIdx < tierData.scopeQuestions.length) {
          const qText = tierData.scopeQuestions[nextUnskippedIdx];
          const isAlreadyAnswered = updatedAnswers.some(ans => ans.question === qText);
          if (isAlreadyAnswered) {
            nextUnskippedIdx++;
          } else {
            break;
          }
        }

        setScopeAnswers(updatedAnswers);

        if (nextUnskippedIdx < tierData.scopeQuestions.length) {
          setCurrentScopeIdx(nextUnskippedIdx);
          await simulatedDelay(1000);

          const nextQ = tierData.scopeQuestions[nextUnskippedIdx];
          const combinedMsg = acknowledgment ? `${acknowledgment} ` + nextQ : nextQ;
          addMessage('assistant', combinedMsg);
        } else {
          await simulatedDelay(1000);
          const finalMsg = acknowledgment 
            ? `${acknowledgment} Perfect! I have everything I need. Let me generate your custom proposal now... ✨`
            : "Perfect! I have everything I need. Let me generate your custom proposal now... ✨";
          addMessage('assistant', finalMsg);
          setStage('generating');
          await generateProposal(updatedAnswers);
        }
      } else if (stage === 'role_details') {
        if (!selectedContract) return;
        const currentQ = selectedContract.questions[currentRoleQIdx];
        
        // Auto-extract name if not yet set or to override default (normalizing smart curly quotes)
        let extractedName = visitorName;
        if (currentRoleQIdx === 0) {
          const normalizedText = text.replace(/[’‘`´]/g, "'");
          const nameMatch = normalizedText.match(/(?:i'?m|my name is|i am|this is|name is|saya|nama saya|dengan|di sini)\s+([a-zA-Z\s]+)/i) || normalizedText.match(/^([a-zA-Z\s]+)/);
          if (nameMatch && nameMatch[1]) {
            const parsedName = nameMatch[1].trim().split(/\s+/)[0];
            if (parsedName.toLowerCase() !== 'i' && parsedName.length > 1) {
              extractedName = parsedName;
              setVisitorName(parsedName);
            }
          }
        }

        const remainingQuestions = selectedContract.questions.slice(currentRoleQIdx + 1);

        let acknowledgment = '';
        let skippedIndices: number[] = [];
        let extracted: { questionIndex: number; answer: string }[] = [];

        try {
          const analyzeRes = await fetch('/api/agent/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userMessage: text,
              currentQuestion: currentQ,
              upcomingQuestions: remainingQuestions,
            }),
          });
          if (analyzeRes.ok) {
            const data = await analyzeRes.json();
            acknowledgment = data.acknowledgment || '';
            skippedIndices = data.skippedQuestionIndices || [];
            extracted = data.extractedAnswers || [];
          }
        } catch (e) {
          console.warn("Analysis failed, proceeding with normal flow:", e);
        }

        let updatedAnswers = [...roleAnswers, { question: currentQ, answer: text }];

        // 1. Instantly register all extracted answers from the analyzer
        extracted.forEach((item) => {
          const absIdx = currentRoleQIdx + 1 + item.questionIndex;
          if (absIdx < selectedContract.questions.length) {
            const qText = selectedContract.questions[absIdx];
            if (!updatedAnswers.some(ans => ans.question === qText)) {
              updatedAnswers.push({
                question: qText,
                answer: item.answer || "Pre-filled/Details provided in conversation"
              });
            }
          }
        });

        // 2. Register any skipped indices that weren't explicitly extracted but flagged
        skippedIndices.forEach((relativeIdx) => {
          const absIdx = currentRoleQIdx + 1 + relativeIdx;
          if (absIdx < selectedContract.questions.length) {
            const qText = selectedContract.questions[absIdx];
            if (!updatedAnswers.some(ans => ans.question === qText)) {
              updatedAnswers.push({
                question: qText,
                answer: "Pre-filled/Details provided in conversation"
              });
            }
          }
        });

        // 3. Find the absolute next unanswered question in order
        let nextUnskippedIdx = currentRoleQIdx + 1;
        while (nextUnskippedIdx < selectedContract.questions.length) {
          const qText = selectedContract.questions[nextUnskippedIdx];
          const isAlreadyAnswered = updatedAnswers.some(ans => ans.question === qText);
          if (isAlreadyAnswered) {
            nextUnskippedIdx++;
          } else {
            break;
          }
        }

        setRoleAnswers(updatedAnswers);

        if (nextUnskippedIdx < selectedContract.questions.length) {
          setCurrentRoleQIdx(nextUnskippedIdx);
          await simulatedDelay(1000);

          const nextQ = selectedContract.questions[nextUnskippedIdx];
          
          let combinedMsg = '';
          if (currentRoleQIdx === 0) {
            const displayName = extractedName || "there";
            const greeting = `Nice to meet you, ${displayName}!`;
            combinedMsg = `${greeting} ` + nextQ;
          } else {
            combinedMsg = acknowledgment ? `${acknowledgment} ` + nextQ : nextQ;
          }

          addMessage('assistant', combinedMsg);
        } else {
          await simulatedDelay(1000);
          const finalMsg = acknowledgment 
            ? `${acknowledgment} Perfect! Let me generate a tailored candidate brief showing exactly why Ryan is the right fit for this role... ✨`
            : "Perfect! Let me generate a tailored candidate brief showing exactly why Ryan is the right fit for this role... ✨";
          addMessage('assistant', finalMsg);
          setStage('generating_brief');
          await generateCandidateBrief(updatedAnswers);
        }
      }
    } catch (err) {
      addMessage('assistant', "Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntentChoice = async (intent: 'client' | 'recruiter') => {
    setDetectedIntent(intent);
    setIsLoading(true);
    if (intent === 'client') {
      addMessage('user', "I have a project for Ryan 💼");
    } else {
      addMessage('user', "I want to hire Ryan 🤝");
    }
    await simulatedDelay(1000);
    addMessage('assistant', "Awesome! Before we proceed, which language would you be most comfortable communicating in? Feel free to type any language (e.g., 'English', 'Indonesian', 'Japanese'), or select an option below! 🌐");
    setStage('preferred_language');
    setIsLoading(false);
  };

  const handleLanguageSelection = async (lang: string) => {
    setPreferredLanguage(lang);
    setIsLoading(true);

    let confirmation = `Perfect! We will proceed in ${lang}.`;
    let nextMsg = "";
    if (detectedIntent === 'client') {
      nextMsg = "Tell me a bit about what you're looking to build — what's the project idea or goal?";
    } else {
      nextMsg = "Great! Let's find the right engagement type. What kind of contract are you offering?";
    }

    if (lang.toLowerCase() !== 'english') {
      try {
        const [translatedConf, translatedNext] = await Promise.all([
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: confirmation, targetLanguage: lang }),
          }).then(r => r.json()),
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: nextMsg, targetLanguage: lang }),
          }).then(r => r.json()),
        ]);
        if (translatedConf.translation) confirmation = translatedConf.translation;
        if (translatedNext.translation) nextMsg = translatedNext.translation;
      } catch (err) {
        console.warn("Failed to translate startup messages:", err);
      }
    }

    addMessage('assistant', confirmation);
    await simulatedDelay(1200);
    addMessage('assistant', nextMsg);

    if (detectedIntent === 'client') {
      setStage('intent');
      setIsLoading(false);
    } else {
      try {
        const res = await fetch('/api/agent/recruiter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'contract_types' }),
        });
        const data = await res.json();
        if (lang.toLowerCase() !== 'english' && data.contractTypes) {
          const translatedOpts = await Promise.all(
            data.contractTypes.map(async (opt: any) => {
              try {
                const labelRes = await fetch('/api/translate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: opt.label, targetLanguage: lang }),
                }).then(r => r.json());
                const subRes = await fetch('/api/translate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: opt.sublabel, targetLanguage: lang }),
                }).then(r => r.json());
                return {
                  ...opt,
                  label: labelRes.translation || opt.label,
                  sublabel: subRes.translation || opt.sublabel,
                };
              } catch {
                return opt;
              }
            })
          );
          setContractOptions(translatedOpts);
        } else {
          setContractOptions(data.contractTypes || []);
        }
        setStage('contract_type');
      } catch {
        addMessage('assistant', 'Let me ask you a few questions about the role.');
        setStage('contract_type');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleContractSelection = async (contractType: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/agent/recruiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'contract_questions', contractType }),
      });
      const data = await res.json();
      setSelectedContract(data);
      addMessage('assistant', data.reply);
      setTimeout(() => {
        addMessage('assistant', data.questions[0]);
        setCurrentRoleQIdx(0);
        setRoleAnswers([]);
        setStage('role_details');
      }, 3000);
    } catch {
      addMessage('assistant', 'Got it! Let me ask a few questions about the role.');
    } finally {
      setIsLoading(false);
    }
  };

  const translateCandidateBrief = async (brief: CandidateBrief, targetLang: string): Promise<CandidateBrief> => {
    try {
      const translateText = async (text: string) => {
        if (!text) return "";
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage: targetLang }),
        });
        const data = await res.json();
        return data.translation || text;
      };

      const [
        translatedTitle,
        translatedExec,
        translatedCompensation,
        translatedVisa,
        translatedAvailability,
        translatedClosing,
        translatedEmail,
      ] = await Promise.all([
        translateText(brief.briefTitle),
        translateText(brief.executiveSummary),
        translateText(brief.compensationNote),
        translateText(brief.visaSponsorshipNote),
        translateText(brief.availability),
        translateText(brief.closingMessage),
        translateText(brief.emailDraft),
      ]);

      const translatedSkills = await Promise.all(
        (brief.skillsMatch || []).map(async (item) => ({
          requirement: await translateText(item.requirement),
          ryanHas: await translateText(item.ryanHas),
        }))
      );

      const translatedExperience = await Promise.all(
        (brief.relevantExperience || []).map(async (item) => ({
          role: await translateText(item.role),
          company: item.company,
          relevance: await translateText(item.relevance),
        }))
      );

      const translatedNextSteps = await Promise.all(
        (brief.nextSteps || []).map(async (step) => await translateText(step))
      );

      return {
        briefTitle: translatedTitle,
        executiveSummary: translatedExec,
        skillsMatch: translatedSkills,
        relevantExperience: translatedExperience,
        compensationNote: translatedCompensation,
        visaSponsorshipNote: translatedVisa,
        availability: translatedAvailability,
        nextSteps: translatedNextSteps,
        closingMessage: translatedClosing,
        emailDraft: translatedEmail,
      };
    } catch (err) {
      console.warn("Failed to translate candidate brief:", err);
      return brief;
    }
  };

  const translateProposal = async (prop: Proposal, targetLang: string): Promise<Proposal> => {
    try {
      const translateText = async (text: string) => {
        if (!text) return "";
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage: targetLang }),
        });
        const data = await res.json();
        return data.translation || text;
      };

      const [
        translatedTitle,
        translatedExec,
        translatedWhy,
        translatedTimeline,
        translatedCost,
        translatedClosing,
        translatedEmail,
      ] = await Promise.all([
        translateText(prop.proposalTitle),
        translateText(prop.executiveSummary),
        translateText(prop.whyRyan),
        translateText(prop.timeline),
        translateText(prop.estimatedCost),
        translateText(prop.closingMessage),
        translateText(prop.emailDraft),
      ]);

      const translatedFeatures = await Promise.all(
        (prop.includedFeatures || []).map(async (f) => await translateText(f))
      );

      const translatedNext = await Promise.all(
        (prop.nextSteps || []).map(async (step) => await translateText(step))
      );

      const translatedProjects = await Promise.all(
        (prop.relevantProjects || []).map(async (proj) => ({
          name: proj.name,
          relevance: await translateText(proj.relevance),
        }))
      );

      return {
        proposalTitle: translatedTitle,
        executiveSummary: translatedExec,
        whyRyan: translatedWhy,
        includedFeatures: translatedFeatures,
        timeline: translatedTimeline,
        estimatedCost: translatedCost,
        nextSteps: translatedNext,
        relevantProjects: translatedProjects,
        closingMessage: translatedClosing,
        emailDraft: translatedEmail,
      };
    } catch (err) {
      console.warn("Failed to translate proposal:", err);
      return prop;
    }
  };

  const generateCandidateBrief = async (answers: { question: string; answer: string }[]) => {
    try {
      const res = await fetch('/api/agent/recruiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_brief',
          recruiterName: visitorName,
          recruiterCompany: visitorCompany,
          contractType: selectedContract?.type,
          contractLabel: selectedContract?.label,
          roleAnswers: answers,
          language: preferredLanguage,
        }),
      });
      const data = await res.json();
      if (data.brief) {
        let briefToSet = data.brief;
        if (preferredLanguage && preferredLanguage.toLowerCase() !== 'english') {
          addMessage('assistant', "I have everything! Let me translate and polish your custom candidate brief... ✨");
          briefToSet = await translateCandidateBrief(data.brief, preferredLanguage);
        }
        setCandidateBrief(briefToSet);
        setStage('followup');
        addMessage('assistant', "Ryan's candidate brief is ready! 🎉 It shows exactly how his experience and skills match your role requirements.");
      } else throw new Error('No brief returned');
    } catch {
      addMessage('assistant', 'I had trouble generating the brief. Please contact Ryan at ryradit@gmail.com');
      setStage('followup');
    }
  };

  const handleBudgetSelection = async (budgetValue: string) => {
    setSelectedBudget(budgetValue);
    setIsLoading(true);
    try {
      const res = await fetch('/api/agent/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'budget',
          budget: budgetValue,
          projectDescription,
        }),
      });
      const data = await res.json();
      setTierData(data);
      addMessage('assistant', data.reply);

      // Ask first scope question
      setTimeout(() => {
        addMessage('assistant', data.scopeQuestions[0]);
        setCurrentScopeIdx(0);
        setScopeAnswers([]);
        setStage('scope');
      }, 3200);
    } catch {
      addMessage('assistant', "Got it! Let me ask a few questions about your project.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateProposal = async (answers: { question: string; answer: string }[]) => {
    if (!tierData) return;
    try {
      const res = await fetch('/api/agent/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName,
          visitorCompany,
          tier: tierData.tier,
          tierLabel: tierData.tierLabel,
          priceRange: tierData.priceRange,
          deliverables: tierData.deliverables,
          timeline: tierData.timeline,
          projectDescription,
          scopeAnswers: answers,
          language: preferredLanguage,
        }),
      });
      const data = await res.json();
      if (res.ok && data.proposal) {
        setProposal(data.proposal);
        setStage('followup');
        addMessage('assistant', "Your custom proposal is ready! 🎉 Scroll down to review everything. If it looks good, I can help you take the next step.");
      } else {
        throw new Error('No proposal returned');
      }
    } catch {
      addMessage('assistant', "I had trouble generating the proposal. Please try again or contact Ryan directly at ryradit@gmail.com");
      setStage('followup');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow re-uploading the same file if needed
    e.target.value = '';

    if (file.size > 10 * 1024 * 1024) {
      addMessage('assistant', 'The uploaded file exceeds the 10MB limit. Please upload a smaller PDF, text file, or screenshot.');
      return;
    }

    setIsAnalyzingDoc(true);
    addMessage('user', `📎 Uploaded document: ${file.name}`);
    addMessage('assistant', `Analyzing "${file.name}" with multimodal AI... please hold on a moment 🔍`);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.includes(',') ? res.split(',')[1] : res;
          resolve(base64);
        };
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(file);
      const fileBase64 = await base64Promise;

      const res = await fetch('/api/agent/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          fileName: file.name,
          fileType: file.type,
          currentIntent: detectedIntent,
          language: preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.analysis) {
        throw new Error(data.error || 'Failed to analyze document');
      }

      const analysis: DocumentAnalysis = data.analysis;
      setAnalyzedDoc({ fileName: file.name, analysis });

      if (analysis.companyName && !visitorCompany) {
        setVisitorCompany(analysis.companyName);
      }

      if (analysis.detectedType === 'recruiter') {
        setDetectedIntent('recruiter');
      } else {
        setDetectedIntent('client');
        if (analysis.summary) {
          setProjectDescription(analysis.summary);
        }
      }

      addMessage('assistant', analysis.chatReply || `I've analyzed "${file.name}"! You can review the extracted details below and generate a tailored proposal or brief with one click.`);
    } catch (err: any) {
      console.error('File upload error:', err);
      addMessage('assistant', `I ran into an issue reading "${file.name}". You can describe your requirements directly in the chat or contact Ryan directly at ryradit@gmail.com.`);
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  const handleGenerateFromDoc = async () => {
    if (!analyzedDoc) return;
    const { analysis } = analyzedDoc;

    if (analysis.detectedType === 'recruiter') {
      setIsLoading(true);
      setStage('generating_brief');
      addMessage('assistant', `Generating your candidate evaluation brief tailored to "${analysis.documentTitle || 'Job Description'}"...`);

      const answers = [
        {
          question: 'What specific role or project scope are you hiring for?',
          answer: `${analysis.extractedData.roleOrProject} at ${analysis.companyName || visitorCompany || 'Company'} (${analysis.extractedData.timeline || 'Full-time / Contract'})`,
        },
        {
          question: 'What are the core technical requirements and responsibilities?',
          answer: (analysis.extractedData.keyPoints || []).join('; '),
        },
        {
          question: 'What is the compensation or salary range?',
          answer: analysis.extractedData.budgetOrSalary || 'Competitive / negotiable',
        },
      ];

      try {
        const res = await fetch('/api/agent/recruiter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_brief',
            recruiterName: visitorName || 'Hiring Team',
            recruiterCompany: visitorCompany || analysis.companyName || 'Hiring Company',
            contractType: 'fulltime',
            contractLabel: analysis.extractedData.roleOrProject || 'Open Position',
            roleAnswers: answers,
            language: preferredLanguage,
          }),
        });
        const data = await res.json();
        if (data.brief) {
          let briefToSet = data.brief;
          if (preferredLanguage && preferredLanguage.toLowerCase() !== 'english') {
            briefToSet = await translateCandidateBrief(data.brief, preferredLanguage);
          }
          setCandidateBrief(briefToSet);
          setStage('followup');
          addMessage('assistant', `Candidate Brief ready! 🎉 I've matched Ryan's tech stack and experience against the requirements from "${analyzedDoc.fileName}".`);
        } else {
          throw new Error('Failed to generate brief');
        }
      } catch (err) {
        console.error(err);
        addMessage('assistant', "I had trouble generating the brief. Please contact Ryan directly at ryradit@gmail.com");
        setStage('followup');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      setStage('generating');
      addMessage('assistant', `Generating your custom proposal based on "${analyzedDoc.fileName}"...`);

      const tierToUse = analysis.extractedData.suggestedTier || 'standard';
      const tierMap: Record<string, { tier: string; tierLabel: string; priceRange: string; deliverables: string[]; timeline: string }> = {
        starter: {
          tier: 'starter',
          tierLabel: 'Starter MVP',
          priceRange: 'Under $300',
          deliverables: ['Landing page or responsive web presence', 'Fast performance & clean UI', 'Deployment setup'],
          timeline: '3 - 7 days',
        },
        standard: {
          tier: 'standard',
          tierLabel: 'Standard Web Application',
          priceRange: '$300 - $1,000',
          deliverables: ['Full dynamic web application', 'Database integration & CMS', 'Responsive mobile-first design', 'Basic SEO & analytics'],
          timeline: '1 - 3 weeks',
        },
        professional: {
          tier: 'professional',
          tierLabel: 'Professional Platform',
          priceRange: '$1,000 - $3,000',
          deliverables: ['End-to-end fullstack platform', 'Custom AI / ML integration', 'Authentication & billing', 'Admin dashboard & API endpoints'],
          timeline: '3 - 6 weeks',
        },
        enterprise: {
          tier: 'enterprise',
          tierLabel: 'Enterprise System',
          priceRange: '$3,000+',
          deliverables: ['High-throughput scalable architecture', 'Custom multi-agent workflows', 'Enterprise security & audits', 'Dedicated SLA & support'],
          timeline: '6+ weeks',
        },
      };

      const chosenTier = tierMap[tierToUse] || tierMap.standard;
      setTierData({
        ...chosenTier,
        scopeQuestions: [],
      });

      const answers = [
        {
          question: 'Project Overview & Deliverables',
          answer: (analysis.extractedData.keyPoints || []).join('; ') || analysis.summary,
        },
        {
          question: 'Estimated Timeline',
          answer: analysis.extractedData.timeline || chosenTier.timeline,
        },
        {
          question: 'Target Budget',
          answer: analysis.extractedData.budgetOrSalary || chosenTier.priceRange,
        },
      ];

      try {
        const res = await fetch('/api/agent/proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorName: visitorName || 'Valued Partner',
            visitorCompany: visitorCompany || analysis.companyName || 'Client Project',
            tier: chosenTier.tier,
            tierLabel: chosenTier.tierLabel,
            priceRange: chosenTier.priceRange,
            deliverables: chosenTier.deliverables,
            timeline: chosenTier.timeline,
            projectDescription: analysis.summary || projectDescription,
            scopeAnswers: answers,
            language: preferredLanguage,
          }),
        });
        const data = await res.json();
        if (res.ok && data.proposal) {
          setProposal(data.proposal);
          setStage('followup');
          addMessage('assistant', `Custom Proposal ready! 🎉 I've compiled the scope, deliverables, and estimated budget based on "${analyzedDoc.fileName}".`);
        } else {
          throw new Error('Failed to generate proposal');
        }
      } catch (err) {
        console.error(err);
        addMessage('assistant', "I had trouble generating the proposal. Please try again or contact Ryan directly at ryradit@gmail.com");
        setStage('followup');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="agent-root min-h-screen bg-ag-bg text-ag-fg flex">
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* Left Panel — Stage Tracker */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 border-r border-ag-fg/10 bg-ag-inv/30 backdrop-blur-xl p-8 relative z-10">
        <div className="mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4">
            <Bot size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-ag-fg">Proposal Agent</h1>
          <p className="text-xs text-ag-fg/40 mt-1">Ryan Radityatama · Fullstack Developer | AI & ML Engineer</p>
        </div>

        <StageTracker current={stage} intent={detectedIntent} />

        <div className="mt-auto pt-8 border-t border-ag-fg/10">
          <div className="text-xs text-ag-fg/30 leading-relaxed">
            Powered by <span className="text-purple-400 font-medium">Agentic AI</span> — a multi-agent pipeline that qualifies your needs and builds a custom proposal.
          </div>
        </div>
      </div>

      {/* Right Panel — Chat */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <div className="border-b border-ag-fg/10 bg-ag-inv/20 backdrop-blur-xl px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 md:gap-3">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-ag-fg/5 border border-ag-fg/10 hover:bg-ag-fg/10 hover:border-ag-fg/20 text-ag-fg/60 hover:text-ag-fg transition-all duration-300 active:scale-95 group shrink-0"
              title="Back to Home"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xs md:text-sm font-semibold text-ag-fg">Ryan's Proposal Agent</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] md:text-xs text-ag-fg/40">Live · Agentic AI Pipeline</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ag-fg/10 hover:border-ag-fg/20 text-ag-fg/60 hover:text-ag-fg/90 text-xs transition-colors"
            title="Reset Agent Session"
          >
            <RotateCcw size={12} />
            <span>Reset Agent</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 max-w-3xl w-full mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group/msg ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-sm'
                      : 'bg-ag-fg/8 border border-ag-fg/10 text-ag-fg/90 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' && msg.isNew ? (
                    <TypewriterText
                      text={msg.content}
                      onComplete={() => {
                        setMessages((prev) =>
                          prev.map((m, idx) => (idx === i ? { ...m, isNew: false } : m))
                        );
                      }}
                    />
                  ) : (
                    msg.content
                  )}

                  {msg.role === 'assistant' && !msg.isNew && (
                    <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-ag-fg/5 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] text-ag-fg/40">Translate:</span>
                      <button
                        onClick={() => translateMessage(i, 'en')}
                        className="text-[10px] text-ag-fg/50 hover:text-ag-fg px-1.5 py-0.5 rounded bg-ag-fg/5 hover:bg-ag-fg/10 transition-colors"
                      >
                        EN
                      </button>
                      <button
                        onClick={() => translateMessage(i, 'id')}
                        className="text-[10px] text-ag-fg/50 hover:text-ag-fg px-1.5 py-0.5 rounded bg-ag-fg/5 hover:bg-ag-fg/10 transition-colors"
                      >
                        ID
                      </button>
                      <button
                        onClick={() => translateMessage(i, 'zh')}
                        className="text-[10px] text-ag-fg/50 hover:text-ag-fg px-1.5 py-0.5 rounded bg-ag-fg/5 hover:bg-ag-fg/10 transition-colors"
                      >
                        ZH
                      </button>
                      {translatingIdx === i && (
                        <Loader2 size={10} className="animate-spin text-purple-400 ml-1" />
                      )}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-ag-fg/10 border border-ag-fg/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-ag-fg/70" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-ag-fg/8 border border-ag-fg/10 rounded-2xl rounded-tl-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Contract Type Selection UI — Recruiter */}
          <AnimatePresence>
            {stage === 'contract_type' && !isLoading && contractOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3 my-4"
              >
                {contractOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      addMessage('user', opt.label);
                      handleContractSelection(opt.type);
                    }}
                    className="p-4 rounded-xl border border-blue-500/25 hover:border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 text-left transition-all duration-150 active:scale-[0.98] shadow-sm"
                  >
                    <div className="text-sm font-semibold text-blue-300">{opt.label}</div>
                    <div className="text-xs text-ag-fg/50 mt-1">{opt.description}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Who Are You? — Initial Choice */}
          <AnimatePresence>
            {stage === 'who_are_you' && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-3 my-4"
              >
                <button
                  onClick={() => handleIntentChoice('client')}
                  className="p-4 rounded-xl border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 text-left flex items-center gap-4 transition-all duration-150 active:scale-[0.98] shadow-sm"
                >
                  <span className="text-2xl">💼</span>
                  <div>
                    <div className="text-sm font-semibold text-purple-300">I have a project for Ryan</div>
                    <div className="text-xs text-ag-fg/50 mt-0.5">I need a website, web app, or other development work</div>
                  </div>
                </button>
                <button
                  onClick={() => handleIntentChoice('recruiter')}
                  className="p-4 rounded-xl border border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/5 hover:bg-indigo-500/10 text-left flex items-center gap-4 transition-all duration-150 active:scale-[0.98] shadow-sm"
                >
                  <span className="text-2xl">🤝</span>
                  <div>
                    <div className="text-sm font-semibold text-indigo-300">I want to hire Ryan</div>
                    <div className="text-xs text-ag-fg/50 mt-0.5">Full-time, part-time, freelance contract, or permanent role</div>
                  </div>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-ag-fg/10"></div>
                  <span className="flex-shrink mx-3 text-[11px] text-ag-fg/40 uppercase tracking-wider font-medium">Or Quick-Start with a Document</span>
                  <div className="flex-grow border-t border-ag-fg/10"></div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-xl border border-dashed border-purple-400/40 hover:border-purple-400/80 bg-purple-500/[0.04] hover:bg-purple-500/[0.08] text-left flex items-center justify-between transition-all duration-150 active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shrink-0">
                      <Paperclip size={18} />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-semibold text-purple-200 flex items-center gap-1.5 flex-wrap">
                        Upload Job Description or Project Brief
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">PDF / Image</span>
                      </div>
                      <div className="text-[11px] text-ag-fg/50 mt-0.5">Let AI extract requirements and auto-draft your proposal/brief with 1 click</div>
                    </div>
                  </div>
                  <Upload size={14} className="text-purple-400 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preferred Language Selection UI */}
          <AnimatePresence>
            {stage === 'preferred_language' && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4"
              >
                <button
                  onClick={() => {
                    addMessage('user', "English 🇬🇧");
                    handleLanguageSelection('English');
                  }}
                  className="p-3.5 rounded-xl border border-ag-fg/10 hover:border-indigo-500/40 bg-ag-fg/[0.03] hover:bg-indigo-500/5 text-center transition-all duration-150 active:scale-[0.98]"
                >
                  <span className="text-xl block mb-1">🇬🇧</span>
                  <span className="text-xs font-semibold text-ag-fg">English</span>
                </button>
                <button
                  onClick={() => {
                    addMessage('user', "Bahasa Indonesia 🇮🇩");
                    handleLanguageSelection('Indonesian');
                  }}
                  className="p-3.5 rounded-xl border border-ag-fg/10 hover:border-indigo-500/40 bg-ag-fg/[0.03] hover:bg-indigo-500/5 text-center transition-all duration-150 active:scale-[0.98]"
                >
                  <span className="text-xl block mb-1">🇮🇩</span>
                  <span className="text-xs font-semibold text-ag-fg">Bahasa Indonesia</span>
                </button>
                <button
                  onClick={() => {
                    addMessage('user', "简体中文 🇨🇳");
                    handleLanguageSelection('Chinese');
                  }}
                  className="p-3.5 rounded-xl border border-ag-fg/10 hover:border-indigo-500/40 bg-ag-fg/[0.03] hover:bg-indigo-500/5 text-center transition-all duration-150 active:scale-[0.98]"
                >
                  <span className="text-xl block mb-1">🇨🇳</span>
                  <span className="text-xs font-semibold text-ag-fg">简体中文</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Budget Selection UI — Client */}
          <AnimatePresence>
            {stage === 'budget' && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3 my-4"
              >
                <div className="col-span-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-indigo-400 shrink-0" />
                    <span>Select a baseline tier below, or type your custom budget in the chatbox!</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono hidden sm:inline">Phased MVP Available</span>
                </div>

                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      addMessage('user', `${opt.label} (${opt.sublabel})`);
                      handleBudgetSelection(opt.value);
                    }}
                    className={`p-4 rounded-xl border ${opt.border} ${opt.bg} text-left transition-all duration-150 active:scale-[0.98] shadow-sm`}
                  >
                    <div className={`text-sm font-semibold ${opt.text}`}>{opt.label}</div>
                    <div className="text-xs text-ag-fg/60 mt-1">{opt.sublabel}</div>
                  </button>
                ))}

                <div className="col-span-2 flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-ag-fg/50">Need custom terms?</span>
                  <button
                    onClick={() => {
                      addMessage('user', 'I need a lean MVP (Core features first to keep budget optimized)');
                      handleBudgetSelection('Starter (under 300) - Lean MVP focus');
                    }}
                    className="px-2.5 py-1 rounded-lg border border-ag-fg/10 bg-ag-fg/[0.04] hover:bg-ag-fg/[0.08] text-[11px] text-ag-fg/80 transition-colors"
                  >
                    ⚡ Lean MVP (Budget-optimized)
                  </button>
                  <button
                    onClick={() => {
                      addMessage('user', 'I want to phase into milestones (e.g. Phase 1 launch then Phase 2 scale)');
                      handleBudgetSelection('Standard ($300 - $1000) - Milestone Phasing');
                    }}
                    className="px-2.5 py-1 rounded-lg border border-ag-fg/10 bg-ag-fg/[0.04] hover:bg-ag-fg/[0.08] text-[11px] text-ag-fg/80 transition-colors"
                  >
                    📅 Milestone Phased Delivery
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzed Document Card */}
          {analyzedDoc && !candidateBrief && !proposal && (
            <AnalyzedDocCard
              doc={analyzedDoc}
              onGenerate={handleGenerateFromDoc}
              onDismiss={() => setAnalyzedDoc(null)}
              isLoading={isLoading}
            />
          )}

          {/* Candidate Brief Display — Recruiter */}
          {candidateBrief && (stage === 'brief' || stage === 'followup') && (
            <div className="mt-6">
              <CandidateBriefCard brief={candidateBrief} recruiterName={visitorName} recruiterCompany={visitorCompany} />
            </div>
          )}

          {/* Proposal Display — Client */}
          {proposal && (stage === 'proposal' || stage === 'followup') && (
            <div className="mt-6">
              <ProposalCard proposal={proposal} visitorName={visitorName} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-ag-fg/10 bg-ag-inv/20 backdrop-blur-xl px-4 md:px-8 py-3.5">
          <div className="max-w-3xl mx-auto flex items-center gap-2 md:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isAnalyzingDoc}
              title="Upload Job Description or Project Brief (PDF, Image, TXT)"
              className="w-11 h-11 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 group relative shadow-sm"
            >
              {isAnalyzingDoc ? (
                <Loader2 size={16} className="text-purple-400 animate-spin" />
              ) : (
                <Paperclip size={16} className="group-hover:rotate-12 transition-transform" />
              )}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAnalyzingDoc
                  ? 'Reading and analyzing your document...'
                  : stage === 'budget'
                  ? 'Or type your budget (e.g. "$500" or "around $2000")'
                  : stage === 'proposal' || stage === 'followup'
                  ? 'Ask a follow-up question...'
                  : 'Type your message or attach a PDF/doc...'
              }
              disabled={isLoading || isAnalyzingDoc}
              className="flex-1 bg-ag-fg/5 border border-ag-fg/10 rounded-xl px-4 py-3 text-sm text-ag-fg placeholder-ag-fg/30 focus:outline-none focus:border-purple-500/50 focus:bg-ag-fg/8 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || isAnalyzingDoc || !input.trim()}
              className="w-11 h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              {isLoading ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <Send size={16} className="text-white" />
              )}
            </button>
          </div>
          <div className="max-w-3xl mx-auto flex items-center justify-between text-[10px] text-ag-fg/40 px-1 pt-2">
            <span>Supports PDF, Images (PNG/JPG), TXT, MD up to 10MB</span>
            <span className="flex items-center gap-1 text-purple-400/80">
              <Sparkles size={10} />
              Multimodal AI Reader
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
