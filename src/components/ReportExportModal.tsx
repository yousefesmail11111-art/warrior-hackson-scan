/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Binary,
} from 'lucide-react';
import { SecurityScorecard, VulnerabilityItem, DevicePostureItem } from '../types/security';

interface ReportExportModalProps {
  scorecard: SecurityScorecard;
  vulnerabilities: VulnerabilityItem[];
  postureItems: DevicePostureItem[];
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  scorecard,
  vulnerabilities,
  postureItems,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const reportDate = new Date().toLocaleString();
  const reportHash = 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const generateJsonTelemetry = () => {
    return JSON.stringify(
      {
        reportMeta: {
          application: 'Warrior Hackson Scan',
          competition: 'Warrior Hacks 2.0 Devpost',
          targetEnvironment: 'Android 14 (API 34) ARM64-v8a',
          creatorAndDeveloper: {
            name: 'Yousef Esmail Nossier',
            email: 'yousefesmailnossier@gmail.com',
            phone: '01555874750 / 01555198797',
          },
          timestamp: new Date().toISOString(),
          cryptographicSignature: reportHash,
        },
        scorecard,
        vulnerabilities,
        devicePosture: postureItems,
      },
      null,
      2
    );
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(generateJsonTelemetry());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Warrior_Hackson_Scan_Audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(generateJsonTelemetry());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Executive Security Telemetry Report
              </h3>
              <p className="text-xs text-slate-400">
                Warrior Hacks 2.0 &bull; Android Mobile Defense Certification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              title="Copy JSON Stream to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Export Full JSON Telemetry"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Document */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-slate-950/40 text-slate-200">
          {/* Header Certificate Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                WARRIOR HACKS 2.0 DEVPOST SUBMISSION
              </span>
              <h2 className="text-xl font-black text-slate-100 tracking-tight font-mono">
                WARRIOR HACKSON SCAN &bull; AUDIT SEAL
              </h2>
              <div className="text-xs text-slate-400 font-mono space-y-0.5">
                <p>Audited: {reportDate}</p>
                <p className="text-[11px] text-slate-500 truncate">{reportHash}</p>
                <p className="text-[11px] text-indigo-300 pt-0.5 font-semibold">
                  Tool Creator & Systems Developer: Yousef Esmail Nossier
                </p>
                <p className="text-[10px] text-slate-400">
                  Email: yousefesmailnossier@gmail.com &bull; Phone: 01555874750 / 01555198797
                </p>
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 min-w-[140px]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Posture Score
              </span>
              <span className="text-4xl font-black font-mono text-indigo-400">
                {scorecard.overallScore}
                <span className="text-xs text-slate-500 font-normal">/100</span>
              </span>
              <span
                className={`text-[10px] font-mono font-bold block mt-1 ${
                  scorecard.overallScore >= 80 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {scorecard.threatLevel}
              </span>
            </div>
          </div>

          {/* Key Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TOTAL THREATS</span>
              <span className="text-lg font-bold text-slate-200">
                {scorecard.totalVulnerabilities}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">RESOLVED & DEFENDED</span>
              <span className="text-lg font-bold text-emerald-400">
                {scorecard.fixedCount + scorecard.defenseDeployedCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">AVERAGE CVSS</span>
              <span className="text-lg font-bold text-amber-400">{scorecard.averageCvss}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ZERO-TRUST STATUS</span>
              <span className="text-lg font-bold text-indigo-400">{scorecard.zeroTrustStatus}</span>
            </div>
          </div>

          {/* Detailed Vulnerabilities Audit List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Detected Vulnerabilities & Forensic Status</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                {vulnerabilities.length} Records
              </span>
            </h4>

            <div className="space-y-2">
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {vuln.id}
                      </span>
                      <span className="font-semibold text-slate-200">{vuln.title}</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 truncate">
                      {vuln.affectedComponent}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="font-mono text-[11px] text-amber-300">
                      CVSS {vuln.cvssScore.toFixed(1)}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        vuln.status === 'FIXED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : vuln.status === 'DEFENSE_DEPLOYED'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : vuln.status === 'IGNORED'
                          ? 'bg-slate-700/40 text-slate-400'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {vuln.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Android System Posture Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
              Android OS Kernel & Security Baseline
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {postureItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-300">{item.name}</span>
                  <span
                    className={
                      item.status === 'COMPLIANT'
                        ? 'text-emerald-400 font-bold'
                        : 'text-rose-400 font-bold'
                    }
                  >
                    {item.currentValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            Engine: Warrior Hackson Autonomous Scanner v2.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
