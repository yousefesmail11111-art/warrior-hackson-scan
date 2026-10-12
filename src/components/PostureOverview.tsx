/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  Layers,
  Award,
} from 'lucide-react';
import { SecurityScorecard } from '../types/security';
import { getThreatLevelDisplay } from '../engine/scoringEngine';

interface PostureOverviewProps {
  scorecard: SecurityScorecard;
  onDeployAllDefenses: () => void;
  onFixAllVulnerabilities: () => void;
  isScanning: boolean;
  scanProgress: number;
}

export const PostureOverview: React.FC<PostureOverviewProps> = ({
  scorecard,
  onDeployAllDefenses,
  onFixAllVulnerabilities,
  isScanning,
  scanProgress,
}) => {
  const threatDisplay = getThreatLevelDisplay(scorecard.threatLevel);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorecard.overallScore / 100) * circumference;

  let gaugeColor = '#10B981'; // green
  if (scorecard.overallScore < 50) {
    gaugeColor = '#F43F5E'; // rose/red
  } else if (scorecard.overallScore < 75) {
    gaugeColor = '#F97316'; // orange
  } else if (scorecard.overallScore < 90) {
    gaugeColor = '#F59E0B'; // amber
  }

  const resolvedTotal = scorecard.fixedCount + scorecard.defenseDeployedCount;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Subtle Background Glow based on threat level */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
          scorecard.overallScore >= 80 ? 'bg-emerald-500' : 'bg-rose-600'
        }`}
      />

      {/* Live Scanning Progress Overlay */}
      {isScanning && (
        <div className="mb-5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col gap-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-mono text-indigo-300">
              <Activity className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Scanning Android Dalvik/ART runtime, SELinux policies, and APK byte signatures...
            </span>
            <span className="font-mono font-bold text-indigo-200">{scanProgress}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Security Posture Index Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center sm:flex-row sm:justify-center lg:flex-col text-center sm:text-left lg:text-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-5 lg:pb-0 lg:pr-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#1E293B"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-100">
                {scorecard.overallScore}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Score / 100
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start lg:justify-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${threatDisplay.badgeClass}`}
              >
                {threatDisplay.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              {threatDisplay.description}
            </p>
          </div>
        </div>

        {/* Center: Threat Telemetry Breakdown */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Critical</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-rose-400">
              {scorecard.criticalCount}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">CVSS 9.0 - 10.0</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>High Risk</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-orange-300">
              {scorecard.highCount}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">CVSS 7.0 - 8.9</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Med & Low</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-amber-300">
              {scorecard.mediumCount + scorecard.lowCount}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">CVSS 0.1 - 6.9</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-950/40 flex flex-col bg-emerald-950/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Neutralized</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {resolvedTotal}
            </span>
            <span className="text-[10px] text-emerald-500/80 mt-1">
              Defenses + Patched
            </span>
          </div>

          {/* Secondary Telemetry Strip */}
          <div className="col-span-2 sm:col-span-4 grid grid-cols-3 gap-2 mt-1">
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Avg CVSS</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {scorecard.averageCvss} / 10.0
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">OWASP Mobile Top 10</span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {scorecard.owaspComplianceRate}% Pass
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Zero-Trust Posture</span>
              <span
                className={`text-xs font-mono font-bold ${
                  scorecard.zeroTrustStatus === 'COMPLIANT'
                    ? 'text-emerald-400'
                    : scorecard.zeroTrustStatus === 'NON_COMPLIANT'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {scorecard.zeroTrustStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Batch Autonomous Mitigation Controls */}
        <div className="lg:col-span-3 flex flex-col gap-2.5 justify-center bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Autonomous Mitigation
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {resolvedTotal}/{scorecard.totalVulnerabilities} protected
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${scorecard.totalVulnerabilities > 0 ? (resolvedTotal / scorecard.totalVulnerabilities) * 100 : 100}%`,
              }}
            />
          </div>

          <button
            onClick={onDeployAllDefenses}
            disabled={scorecard.unmitigatedCount === 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              scorecard.unmitigatedCount === 0
                ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-md shadow-indigo-600/20 active:scale-[0.98]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Deploy All Sandbox Defenses</span>
          </button>

          <button
            onClick={onFixAllVulnerabilities}
            disabled={scorecard.unmitigatedCount === 0 && scorecard.defenseDeployedCount === 0}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              scorecard.unmitigatedCount === 0 && scorecard.defenseDeployedCount === 0
                ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-md shadow-emerald-600/20 active:scale-[0.98]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Apply All Fixes & Hardening</span>
          </button>
        </div>
      </div>
    </div>
  );
};
