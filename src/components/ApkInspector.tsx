/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCode,
  Upload,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Hash,
  Binary,
  Layers,
  Terminal,
  ExternalLink,
  ChevronRight,
  Flame,
  Bug,
  Lock,
} from 'lucide-react';
import { ApkPackageInfo } from '../types/security';
import { SAMPLE_APKS } from '../data/sampleApks';
import { getEntropyVerdict } from '../engine/entropyEngine';

interface ApkInspectorProps {
  onScanApk: (apk: ApkPackageInfo) => void;
  onQuarantineApk: (packageName: string) => void;
}

export const ApkInspector: React.FC<ApkInspectorProps> = ({ onScanApk, onQuarantineApk }) => {
  const [selectedApk, setSelectedApk] = useState<ApkPackageInfo>(SAMPLE_APKS[0]);
  const [customApkName, setCustomApkName] = useState('');
  const [quarantinedPackages, setQuarantinedPackages] = useState<Set<string>>(new Set());

  const handleSelectApk = (apk: ApkPackageInfo) => {
    setSelectedApk(apk);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate inspection of uploaded APK or Manifest
    const mockCustomApk: ApkPackageInfo = {
      packageName: `com.custom.upload.${file.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
      appName: file.name.replace(/\.[^/.]+$/, ''),
      versionName: '1.0.0-custom',
      versionCode: 1,
      minSdkVersion: 26,
      targetSdkVersion: 33,
      apkSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)) || 5.2,
      sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      isSideloaded: true,
      isSignedWithDebugKey: false,
      shannonEntropy: 7.15,
      entropyVerdict: 'SUSPICIOUS',
      threatScore: 65,
      threatDescription: `Custom uploaded Android package (${file.name}) analyzed. Static byte analysis revealed elevated Shannon entropy and requested sensitive background capabilities.`,
      permissions: [
        { name: 'android.permission.INTERNET', isDangerous: false, isGranted: true },
        { name: 'android.permission.ACCESS_FINE_LOCATION', isDangerous: true, isGranted: true, riskReason: 'Location polling' },
        { name: 'android.permission.SYSTEM_ALERT_WINDOW', isDangerous: true, isGranted: true, riskReason: 'Overlay permission' },
      ],
      exportedComponents: [
        { name: '.ui.MainActivity', type: 'Activity', isProtectedByPermission: false },
        { name: '.service.SyncService', type: 'Service', isProtectedByPermission: false, vulnerabilityFlag: 'Exported background worker' },
      ],
    };

    setSelectedApk(mockCustomApk);
    setCustomApkName(file.name);
  };

  const handleQuarantine = () => {
    setQuarantinedPackages((prev) => new Set(prev).add(selectedApk.packageName));
    onQuarantineApk(selectedApk.packageName);
  };

  const isQuarantined = quarantinedPackages.has(selectedApk.packageName);
  const entropyAnalysis = getEntropyVerdict(selectedApk.shannonEntropy);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Sample APK Picker & Upload Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Binary className="w-5 h-5 text-indigo-400" />
              Android APK & Manifest Deep Inspector
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select real-world mobile malware strain profiles or inspect custom Android package files.
            </p>
          </div>

          <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Custom APK / Manifest</span>
            <input
              type="file"
              accept=".apk,.json,.xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Quick Sample Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {SAMPLE_APKS.map((apk) => {
            const isSelected = selectedApk.packageName === apk.packageName;
            return (
              <button
                key={apk.packageName}
                onClick={() => handleSelectApk(apk)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      apk.threatScore >= 80
                        ? 'bg-rose-500/20 text-rose-300'
                        : apk.threatScore >= 40
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Risk {apk.threatScore}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{apk.apkSizeMb}MB</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 truncate">{apk.appName}</h4>
                <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {apk.packageName}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected APK Deep Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Metadata & Security Flags */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Identity & Risk Score */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Target Android Package
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedApk.appName}</h3>
                <span className="text-xs font-mono text-indigo-400 break-all">
                  {selectedApk.packageName}
                </span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl border text-center font-mono ${
                  selectedApk.threatScore >= 80
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : selectedApk.threatScore >= 40
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <span className="text-xs block text-slate-400 font-sans">Threat Score</span>
                <span className="text-xl font-extrabold">{selectedApk.threatScore} / 100</span>
              </div>
            </div>

            {selectedApk.malwareFamily && (
              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-rose-300">Malware Family Classified:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    {selectedApk.malwareFamily}
                  </p>
                </div>
              </div>
            )}

            {selectedApk.threatDescription && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                {selectedApk.threatDescription}
              </p>
            )}

            {/* Android Manifest Attributes Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target SDK:</span>
                <span className="text-slate-200">Android {selectedApk.targetSdkVersion}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Min SDK:</span>
                <span className="text-slate-200">Android {selectedApk.minSdkVersion}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Sideloaded (Unknown Sources):</span>
                <span className={selectedApk.isSideloaded ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {selectedApk.isSideloaded ? 'YES (Non-Play Store Origin)' : 'NO (Verified Store)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Signing Key:</span>
                <span className={selectedApk.isSignedWithDebugKey ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {selectedApk.isSignedWithDebugKey ? 'DEBUG TEST-KEY (Unsigned)' : 'OEM Release Certificate'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">SHA-256 Digest:</span>
                <span className="text-slate-400 text-[10px] truncate max-w-[180px]">
                  {selectedApk.sha256}
                </span>
              </div>
            </div>

            {/* Quarantine Action */}
            <div className="pt-2">
              <button
                onClick={handleQuarantine}
                disabled={isQuarantined || selectedApk.threatScore < 20}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isQuarantined
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-900/40 cursor-default'
                    : selectedApk.threatScore < 20
                    ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 active:scale-98'
                }`}
              >
                {isQuarantined ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Package Quarantined & Sandboxed</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-4 h-4" />
                    <span>Quarantine & Revoke All Permissions</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card: Scientific Shannon Entropy Gauge */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                <Binary className="w-4 h-4 text-purple-400" />
                DEX Bytecode Shannon Entropy
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  selectedApk.shannonEntropy >= 7.35
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : selectedApk.shannonEntropy >= 6.85
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {selectedApk.entropyVerdict}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-black text-slate-100">
                {selectedApk.shannonEntropy.toFixed(2)}
                <span className="text-xs text-slate-500 font-normal"> / 8.00 bits/byte</span>
              </span>
              <span className="text-xs text-slate-400">
                {selectedApk.shannonEntropy >= 7.35 ? 'Packed / Obfuscated' : 'Standard Distribution'}
              </span>
            </div>

            {/* Entropy Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedApk.shannonEntropy >= 7.35
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                    : selectedApk.shannonEntropy >= 6.85
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${(selectedApk.shannonEntropy / 8.0) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {entropyAnalysis.explanation}
            </p>
          </div>
        </div>

        {/* Right Column: Permissions Matrix & Exported Components */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card: Android Dangerous Permissions Matrix */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-400" />
                Requested Permissions Matrix ({selectedApk.permissions.length})
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedApk.permissions.filter((p) => p.isDangerous).length} Dangerous Flags
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedApk.permissions.map((perm, idx) => (
                <div
                  key={`${perm.name}-${idx}`}
                  className={`p-2.5 rounded-xl border text-xs ${
                    perm.isDangerous
                      ? 'bg-rose-950/20 border-rose-900/30'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[11px] font-semibold text-slate-200 truncate">
                      {perm.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        perm.isDangerous
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {perm.isDangerous ? 'DANGEROUS' : 'NORMAL'}
                    </span>
                  </div>
                  {perm.riskReason && (
                    <p className="text-[11px] text-amber-300/80 font-sans mt-0.5 leading-tight">
                      Risk: {perm.riskReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card: Exported Components Vulnerability Map */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Exported IPC Components & Entry Points
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedApk.exportedComponents.length} Exposed Endpoints
              </span>
            </div>

            <div className="space-y-2">
              {selectedApk.exportedComponents.map((comp, idx) => (
                <div
                  key={`${comp.name}-${idx}`}
                  className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-indigo-300 font-semibold truncate">
                        {comp.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {comp.type}
                      </span>
                    </div>
                    {comp.vulnerabilityFlag && (
                      <p className="text-[11px] text-rose-400 mt-1">
                        Exposure: {comp.vulnerabilityFlag}
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap self-start sm:self-center ${
                      comp.isProtectedByPermission
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {comp.isProtectedByPermission ? 'Protected by Permission' : 'Publicly Exported'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
