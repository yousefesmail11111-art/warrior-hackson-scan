/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Code2,
  Terminal,
  FileCode,
  Check,
  Copy,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { VulnerabilityItem } from '../types/security';

interface RemediationModalProps {
  vulnerability: VulnerabilityItem;
  onClose: () => void;
  onApplyFix: (id: string) => void;
  onDeployDefense: (id: string) => void;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({
  vulnerability,
  onClose,
  onApplyFix,
  onDeployDefense,
}) => {
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const handleCopyPatch = () => {
    if (vulnerability.remediation.codePatch) {
      navigator.clipboard.writeText(vulnerability.remediation.codePatch.after);
      setCopiedPatch(true);
      setTimeout(() => setCopiedPatch(false), 2000);
    }
  };

  const handleCopyCommand = () => {
    if (vulnerability.remediation.cliCommand) {
      navigator.clipboard.writeText(vulnerability.remediation.cliCommand);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{vulnerability.title}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {vulnerability.id} &bull; CVSS {vulnerability.cvssScore.toFixed(1)} &bull;{' '}
                {vulnerability.owaspMobileCategory}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-950/40 text-xs">
          {/* Defense & Fix Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30">
              <span className="text-indigo-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <ShieldCheck className="w-4 h-4" />
                Active Sandbox Defense Strategy
              </span>
              <p className="text-slate-300 leading-relaxed">
                {vulnerability.remediation.defenseDescription}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Permanent Hardening Fix Protocol
              </span>
              <p className="text-slate-300 leading-relaxed">
                {vulnerability.remediation.fixDescription}
              </p>
            </div>
          </div>

          {/* Code Patch Diff */}
          {vulnerability.remediation.codePatch && (
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                  <FileCode className="w-3.5 h-3.5" />
                  Target File: {vulnerability.remediation.codePatch.filename}
                </span>
                <button
                  onClick={handleCopyPatch}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedPatch ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedPatch ? 'Copied' : 'Copy Hardened Code'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl text-rose-300 text-[11px] overflow-x-auto">
                  <div className="text-[10px] text-rose-400 font-bold mb-1">
                    - VULNERABLE CODE BEFORE MITIGATION:
                  </div>
                  <pre>{vulnerability.remediation.codePatch.before}</pre>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl text-emerald-300 text-[11px] overflow-x-auto">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">
                    + HARDENED CODE AFTER REMEDIATION:
                  </div>
                  <pre>{vulnerability.remediation.codePatch.after}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ADB Shell Command */}
          {vulnerability.remediation.cliCommand && (
            <div className="space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  Android ADB Shell Execution Command
                </span>
                <button
                  onClick={handleCopyCommand}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedCommand ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedCommand ? 'Copied' : 'Copy Command'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-amber-300 select-all overflow-x-auto">
                <code>{vulnerability.remediation.cliCommand}</code>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Status: {vulnerability.status}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDeployDefense(vulnerability.id);
                onClose();
              }}
              disabled={vulnerability.status === 'DEFENSE_DEPLOYED'}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deploy Defense</span>
            </button>

            <button
              onClick={() => {
                onApplyFix(vulnerability.id);
                onClose();
              }}
              disabled={vulnerability.status === 'FIXED'}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply Fix</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
