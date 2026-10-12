/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  FileText,
  Clock,
  Sparkles,
  Cpu,
  User,
} from 'lucide-react';
import { ThreatLevel } from '../types/security';

interface HeaderProps {
  threatLevel: ThreatLevel;
  overallScore: number;
  isScanning: boolean;
  onStartScan: () => void;
  onOpenReport: () => void;
  onOpenAuditLog: () => void;
  onOpenDeveloperContact: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  threatLevel,
  overallScore,
  isScanning,
  onStartScan,
  onOpenReport,
  onOpenAuditLog,
  onOpenDeveloperContact,
  onResetAll,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  {overallScore >= 80 ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                  )}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${overallScore >= 80 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-slate-950 ${overallScore >= 80 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight font-mono">
                  WARRIOR HACKSON SCAN
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Warrior Hacks 2.0
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-slate-300 font-mono">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  Android 14 (API 34)
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  Kernel 6.1.43-android14-arm64
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Zero-Trust EDR Active</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={onStartScan}
              disabled={isScanning}
              className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
                isScanning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isScanning ? 'Scanning Android Subsystems...' : 'Run Full Android Scan'}</span>
            </button>

            <button
              onClick={onOpenReport}
              className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5"
              title="Generate Formal Security Telemetry Report"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audit Report</span>
            </button>

            <button
              onClick={onOpenAuditLog}
              className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5"
              title="View Cryptographic Action Trail"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Forensic Log</span>
            </button>

            <button
              onClick={onOpenDeveloperContact}
              className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-950/60 to-purple-950/60 hover:from-indigo-900/60 hover:to-purple-900/60 text-indigo-200 border border-indigo-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              title="Contact Tool Creator & Developer: Yousef Esmail Nossier"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Developer Contact</span>
            </button>

            <button
              onClick={onResetAll}
              className="px-2.5 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent hover:border-slate-800 transition-all"
              title="Reset simulation data to original state"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
