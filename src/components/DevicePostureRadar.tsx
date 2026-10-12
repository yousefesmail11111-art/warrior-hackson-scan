/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  Terminal,
  Cpu,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { DevicePostureItem } from '../types/security';

interface DevicePostureRadarProps {
  postureItems: DevicePostureItem[];
  onHardenItem: (id: string) => void;
  onHardenAll: () => void;
}

export const DevicePostureRadar: React.FC<DevicePostureRadarProps> = ({
  postureItems,
  onHardenItem,
  onHardenAll,
}) => {
  const unhardenedCount = postureItems.filter((item) => item.status !== 'COMPLIANT').length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Android Hardware & Kernel Security
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              Android System Posture & Kernel Hardening Radar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Real-time audit of Android OS configuration, SELinux kernel Mandatory Access Controls,
              hardware-backed Keystore partitions, and ADB debug interfaces.
            </p>
          </div>

          <button
            onClick={onHardenAll}
            disabled={unhardenedCount === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              unhardenedCount === 0
                ? 'bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-200" />
            <span>Auto-Harden All Subsystems ({unhardenedCount})</span>
          </button>
        </div>
      </div>

      {/* Posture Item Cards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {postureItems.map((item) => {
          const isCompliant = item.status === 'COMPLIANT';
          const isCritical = item.status === 'CRITICAL';

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isCompliant
                  ? 'bg-slate-900/50 border-emerald-950/40'
                  : isCritical
                  ? 'bg-slate-900/90 border-rose-950/70 shadow-lg'
                  : 'bg-slate-900/80 border-amber-950/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{item.name}</h3>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                    isCompliant
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : isCritical
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isCompliant ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                  )}
                  <span>{item.status}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{item.description}</p>

              {/* State Comparison Box */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 block">Current Telemetry:</span>
                  <span
                    className={`text-[11px] font-bold ${
                      isCompliant ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.currentValue}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Baseline Policy:</span>
                  <span className="text-[11px] text-indigo-300">{item.expectedValue}</span>
                </div>
              </div>

              {/* CLI Command */}
              {item.remediationCommand !== 'N/A (Compliant)' && (
                <div className="mb-3 text-[11px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 overflow-x-auto">
                  <span className="text-slate-500 text-[10px] block">Hardening Script:</span>
                  <code className="text-amber-300 text-[10px]">{item.remediationCommand}</code>
                </div>
              )}

              {/* Action Button */}
              <div>
                <button
                  onClick={() => onHardenItem(item.id)}
                  disabled={isCompliant || !item.canAutoHardening}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isCompliant
                      ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-98'
                  }`}
                >
                  {isCompliant ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Subsystem Posture Enforced</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Enforce System Hardening</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
