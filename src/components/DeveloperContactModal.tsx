/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  User,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Award,
  Send,
  MessageSquare,
} from 'lucide-react';

interface DeveloperContactModalProps {
  onClose: () => void;
}

export const DeveloperContactModal: React.FC<DeveloperContactModalProps> = ({ onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone1, setCopiedPhone1] = useState(false);
  const [copiedPhone2, setCopiedPhone2] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [senderName, setSenderName] = useState('');

  const email = 'yousefesmailnossier@gmail.com';
  const phone1 = '01555874750';
  const phone2 = '01555198797';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone1 = () => {
    navigator.clipboard.writeText(phone1);
    setCopiedPhone1(true);
    setTimeout(() => setCopiedPhone1(false), 2000);
  };

  const handleCopyPhone2 = () => {
    navigator.clipboard.writeText(phone2);
    setCopiedPhone2(true);
    setTimeout(() => setCopiedPhone2(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    // Direct mailto link preparation
    const subject = encodeURIComponent(`Warrior Hackson Scan Inquiry from ${senderName || 'Security Operator'}`);
    const body = encodeURIComponent(messageText);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Creator & Developer Profile
              </h3>
              <p className="text-xs text-slate-400">
                Warrior Hacks 2.0 &bull; Lead Systems Architect
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh] text-slate-300 text-xs">
          {/* Developer Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-900/40 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold block mb-1">
                  Tool Creator & Systems Engineer
                </span>
                <h2 className="text-lg font-extrabold text-slate-100">
                  Yousef Esmail Nossier
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cybersecurity Architect &bull; Mobile Defense Researcher
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3" /> Warrior Hacks 2.0
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-slate-800/80 pt-2.5">
              Designed and built <strong>Warrior Hackson Scan</strong> — an autonomous, zero-trust
              Android vulnerability detection and system hardening platform designed for real-time
              malware deterrence and forensic telemetry audit.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Direct Contact Information
            </h4>

            {/* Email Contact Box */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-slate-500 font-mono block">Email Address</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-mono text-slate-200 hover:text-indigo-400 font-semibold truncate block transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`mailto:${email}`}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Send email via default client"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Phone Number 1 Box */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">Primary Phone</span>
                  <a
                    href={`tel:${phone1}`}
                    className="text-xs font-mono text-slate-200 hover:text-emerald-400 font-semibold block transition-colors"
                  >
                    {phone1}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyPhone1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy phone number"
                >
                  {copiedPhone1 ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`tel:${phone1}`}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  title="Call number"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Phone Number 2 Box */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-600/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">Secondary Phone</span>
                  <a
                    href={`tel:${phone2}`}
                    className="text-xs font-mono text-slate-200 hover:text-purple-400 font-semibold block transition-colors"
                  >
                    {phone2}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyPhone2}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy phone number"
                >
                  {copiedPhone2 ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`tel:${phone2}`}
                  className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                  title="Call number"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Message Dispatch Form */}
          <form onSubmit={handleSendMessage} className="space-y-2.5 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Dispatch Direct Inquiry to Yousef Esmail Nossier
            </span>

            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your Name / Organization"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={2}
              placeholder="Inquiry message regarding Warrior Hackson Scan or Android security audit..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />

            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message via Email Client</span>
            </button>

            {messageSent && (
              <p className="text-[11px] text-emerald-400 text-center font-mono">
                Opening email draft to yousefesmailnossier@gmail.com...
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-mono">Warrior Hacks 2.0 Devpost Entry</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
