'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, CheckCircle, ChevronRight, Download, Mail, Sparkles, User } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | 'greeting'
  | 'intent'
  | 'budget'
  | 'scope'
  | 'generating'
  | 'proposal'
  | 'followup';

type Message = { role: 'user' | 'assistant'; content: string };

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
  closingMessage: string;
  emailDraft: string;
};

const STAGES: { id: Stage; label: string }[] = [
  { id: 'greeting', label: 'Welcome' },
  { id: 'intent', label: 'Your Goal' },
  { id: 'budget', label: 'Budget' },
  { id: 'scope', label: 'Scope' },
  { id: 'generating', label: 'Proposal' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'followup', label: 'Follow-Up' },
];

const BUDGET_OPTIONS = [
  { label: '🌱 Starter', sublabel: 'Under $300', value: 'under 300', color: 'from-emerald-500 to-teal-500' },
  { label: '🔵 Standard', sublabel: '$300 – $1,000', value: '300 to 1000', color: 'from-blue-500 to-cyan-500' },
  { label: '🟣 Professional', sublabel: '$1,000 – $3,000', value: '1000 to 3000', color: 'from-purple-500 to-violet-500' },
  { label: '🚀 Enterprise', sublabel: '$3,000+', value: 'over 3000', color: 'from-orange-500 to-red-500' },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

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

function StageTracker({ current }: { current: Stage }) {
  const stageIds: Stage[] = ['greeting', 'intent', 'budget', 'scope', 'proposal', 'followup'];
  const currentIdx = stageIds.indexOf(current === 'generating' ? 'proposal' : current);

  return (
    <div className="flex flex-col gap-2">
      {stageIds.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const label = STAGES.find((st) => st.id === s)?.label || s;
        return (
          <div key={s} className="flex items-center gap-3">
            <motion.div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                done ? 'bg-purple-500 border-purple-500 text-white' :
                active ? 'border-purple-400 bg-purple-400/20 text-purple-300' :
                'border-white/20 bg-white/5 text-white/30'
              }`}
              animate={active ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
            >
              {done ? <CheckCircle size={14} /> : i + 1}
            </motion.div>
            <span className={`text-sm font-medium ${active ? 'text-white' : done ? 'text-purple-300' : 'text-white/30'}`}>
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

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-yellow-300" />
          <span className="text-xs font-semibold text-purple-200 uppercase tracking-widest">Your Custom Proposal</span>
        </div>
        <h2 className="text-xl font-bold text-white leading-tight">{proposal.proposalTitle}</h2>
        <p className="text-purple-100 text-sm mt-2 leading-relaxed">{proposal.executiveSummary}</p>
      </div>

      {/* Why Ryan */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Why Ryan?</h3>
        <p className="text-white/80 text-sm leading-relaxed">{proposal.whyRyan}</p>
      </div>

      {/* Cost + Timeline */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">Estimated Cost</div>
          <div className="text-white font-bold text-lg">{proposal.estimatedCost}</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Timeline</div>
          <div className="text-white font-bold text-lg">{proposal.timeline}</div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">What's Included</h3>
        <ul className="space-y-2">
          {proposal.includedFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/80">
              <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Relevant Projects */}
      {proposal.relevantProjects?.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">Relevant Work</h3>
          <div className="space-y-3">
            {proposal.relevantProjects.map((p, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-3">
                <div className="text-white font-medium text-sm">{p.name}</div>
                <div className="text-white/50 text-xs mt-1">{p.relevance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wide">Next Steps</h3>
        <ol className="space-y-2">
          {proposal.nextSteps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/80">
              <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Closing */}
      <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-2xl p-5">
        <p className="text-white/80 text-sm leading-relaxed italic">{proposal.closingMessage}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <div className="text-white text-sm font-semibold">Ryan Radityatama</div>
            <div className="text-white/40 text-xs">Web Developer · ryradit@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Email Draft */}
      <button
        onClick={() => setShowEmail(!showEmail)}
        className="w-full flex items-center justify-between px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Mail size={14} />
          {showEmail ? 'Hide email draft' : 'View follow-up email draft'}
        </div>
        <ChevronRight size={14} className={`text-white/40 transition-transform ${showEmail ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {showEmail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900 border border-white/10 rounded-xl p-5 text-sm text-white/70 whitespace-pre-wrap font-mono leading-relaxed"
          >
            {proposal.emailDraft}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestAgentPage() {
  const [stage, setStage] = useState<Stage>('greeting');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Ryan's AI assistant — I'm here to help figure out exactly how Ryan can help you, and build a custom proposal tailored to your needs and budget. What brings you here today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorCompany, setVisitorCompany] = useState('');
  const [detectedIntent, setDetectedIntent] = useState<'client' | 'recruiter' | 'unknown'>('unknown');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [tierData, setTierData] = useState<BudgetTier | null>(null);
  const [scopeAnswers, setScopeAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [currentScopeIdx, setCurrentScopeIdx] = useState(0);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [projectDescription, setProjectDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSend = async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim();
    if (!text || isLoading) return;
    setInput('');
    addMessage('user', text);
    setIsLoading(true);

    try {
      if (stage === 'greeting') {
        // Extract name/company from greeting message
        const nameMatch = text.match(/(?:i'?m|my name is|i am)\s+([a-zA-Z]+)/i);
        if (nameMatch) setVisitorName(nameMatch[1]);
        if (text.toLowerCase().includes('from ')) {
          const compMatch = text.match(/from\s+([\w\s]+?)(?:\.|,|$)/i);
          if (compMatch) setVisitorCompany(compMatch[1].trim());
        }

        // Move to intent classification
        const res = await fetch('/api/agent/qualify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'intent', message: text, history: messages }),
        });
        const data = await res.json();
        addMessage('assistant', data.reply || "Thanks! Are you looking to hire Ryan for a project, or do you have a job opportunity?");
        setDetectedIntent(data.intent);

        if (data.intent === 'recruiter') {
          setTimeout(() => {
            addMessage('assistant', "Since you're a recruiter, let me redirect you to Ryan's interview scheduler where you can book a time that works for you! 📅");
            setStage('followup');
          }, 1500);
        } else {
          setStage('intent');
        }

      } else if (stage === 'intent') {
        setProjectDescription(text);
        addMessage('assistant', "Great! Now let's talk budget. Which tier best fits your project? You can also just type your budget.");
        setStage('budget');

      } else if (stage === 'budget') {
        // Handle typed budget
        await handleBudgetSelection(text);

      } else if (stage === 'scope') {
        if (!tierData) return;
        const currentQ = tierData.scopeQuestions[currentScopeIdx];
        const newAnswers = [...scopeAnswers, { question: currentQ, answer: text }];
        setScopeAnswers(newAnswers);

        if (currentScopeIdx + 1 < tierData.scopeQuestions.length) {
          setCurrentScopeIdx(currentScopeIdx + 1);
          addMessage('assistant', tierData.scopeQuestions[currentScopeIdx + 1]);
        } else {
          // All questions answered — generate proposal
          addMessage('assistant', "Perfect! I have everything I need. Let me generate your custom proposal now... ✨");
          setStage('generating');
          await generateProposal(newAnswers);
        }
      }
    } catch (err) {
      addMessage('assistant', "Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
      }, 1000);
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
        }),
      });
      const data = await res.json();
      if (data.proposal) {
        setProposal(data.proposal);
        setStage('proposal');
        addMessage('assistant', "Your custom proposal is ready! 🎉 Scroll down to review everything. If it looks good, I can help you take the next step.");
      } else {
        throw new Error('No proposal returned');
      }
    } catch {
      addMessage('assistant', "I had trouble generating the proposal. Please try again or contact Ryan directly at ryradit@gmail.com");
      setStage('followup');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* Left Panel — Stage Tracker */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 bg-black/30 backdrop-blur-xl p-8 relative z-10">
        <div className="mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4">
            <Bot size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Proposal Agent</h1>
          <p className="text-xs text-white/40 mt-1">Ryan Radityatama · Web Developer</p>
        </div>

        <StageTracker current={stage} />

        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="text-xs text-white/30 leading-relaxed">
            Powered by <span className="text-purple-400 font-medium">Agentic AI</span> — a multi-agent pipeline that qualifies your needs and builds a custom proposal.
          </div>
        </div>
      </div>

      {/* Right Panel — Chat */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 flex items-center gap-3">
          <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Ryan's Proposal Agent</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/40">Live · Agentic AI Pipeline</span>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full font-medium">
              🧪 Test Mode
            </span>
          </div>
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-sm'
                      : 'bg-white/8 border border-white/10 text-white/90 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-white/70" />
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
              <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Budget Selection UI */}
          <AnimatePresence>
            {stage === 'budget' && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3 my-4"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      addMessage('user', `${opt.label} — ${opt.sublabel}`);
                      handleBudgetSelection(opt.value);
                    }}
                    className={`bg-gradient-to-br ${opt.color} p-0.5 rounded-xl group hover:scale-105 transition-transform`}
                  >
                    <div className="bg-[#0A0A0F] rounded-[11px] p-4 h-full">
                      <div className="text-lg font-bold text-white">{opt.label}</div>
                      <div className="text-sm text-white/60 mt-0.5">{opt.sublabel}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Proposal Display */}
          {proposal && stage === 'proposal' && (
            <div className="mt-6">
              <ProposalCard proposal={proposal} />
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="mailto:ryradit@gmail.com?subject=Project Inquiry"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all"
                >
                  <Mail size={16} />
                  Email Ryan to Get Started
                </a>
                <a
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-xl transition-all text-sm"
                >
                  Go to Contact Page
                </a>
              </div>
            </div>
          )}

          {/* Recruiter CTA */}
          {stage === 'followup' && detectedIntent === 'recruiter' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 mt-4"
            >
              <h3 className="text-white font-semibold">Schedule an Interview with Ryan</h3>
              <p className="text-white/60 text-sm">Book a time directly — Ryan typically responds within 24 hours.</p>
              <a
                href="mailto:ryradit@gmail.com?subject=Interview Request"
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                <Mail size={16} />
                Email Ryan to Schedule
              </a>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                stage === 'budget'
                  ? 'Or type your budget (e.g. "$500" or "around $2000")'
                  : stage === 'proposal' || stage === 'followup'
                  ? 'Ask a follow-up question...'
                  : 'Type your message...'
              }
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              {isLoading ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <Send size={16} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
