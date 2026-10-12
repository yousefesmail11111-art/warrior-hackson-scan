/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Binary,
  Layers,
  Bug,
  Award,
  Activity,
  FileText,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  VulnerabilityItem,
  DevicePostureItem,
  AuditLogEntry,
  ApkPackageInfo,
  MitigationStatus,
} from './types/security';
import { INITIAL_ANDROID_VULNERABILITIES } from './data/defaultVulnerabilities';
import { INITIAL_DEVICE_POSTURE } from './data/devicePostureData';
import { SAMPLE_APKS } from './data/sampleApks';
import { calculateSecurityScorecard } from './engine/scoringEngine';
import { Header } from './components/Header';
import { PostureOverview } from './components/PostureOverview';
import { VulnerabilityList } from './components/VulnerabilityList';
import { ApkInspector } from './components/ApkInspector';
import { DevicePostureRadar } from './components/DevicePostureRadar';
import { ScientificEntropyViewer } from './components/ScientificEntropyViewer';
import { ReportExportModal } from './components/ReportExportModal';
import { AuditLogModal } from './components/AuditLogModal';
import { RemediationModal } from './components/RemediationModal';

export default function App() {
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityItem[]>(
    INITIAL_ANDROID_VULNERABILITIES
  );
  const [postureItems, setPostureItems] = useState<DevicePostureItem[]>(INITIAL_DEVICE_POSTURE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'LOG-INIT',
      timestamp: new Date().toLocaleTimeString(),
      action: 'SYSTEM_BOOTSTRAP',
      targetId: 'ENGINE_CORE',
      targetName: 'Warrior Hackson Scan Autonomous Engine Initialized',
      integrityHash: 'a89c2ef34d91bc5489f01192e4ab3402cd49ea81b01239ab778401fe34ba0912',
    },
  ]);

  // UI Navigation Tabs
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'APK_INSPECTOR' | 'DEVICE_POSTURE' | 'ENTROPY_LAB'>(
    'DASHBOARD'
  );

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [activeRemediationVuln, setActiveRemediationVuln] = useState<VulnerabilityItem | null>(null);

  // Real-time calculated scorecard
  const scorecard = useMemo(() => {
    return calculateSecurityScorecard(vulnerabilities);
  }, [vulnerabilities]);

  // Helper to append forensic audit log
  const addAuditLog = (action: string, targetId: string, targetName: string, userNote?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    // Generate pseudo-SHA256 signature
    const rawStr = `${timestamp}-${action}-${targetId}-${Math.random()}`;
    let hashNum = 0;
    for (let i = 0; i < rawStr.length; i++) {
      hashNum = (hashNum << 5) - hashNum + rawStr.charCodeAt(i);
      hashNum |= 0;
    }
    const integrityHash = Math.abs(hashNum).toString(16).padStart(16, '0') + '4f88e2c390a1b244';

    const newEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action,
      targetId,
      targetName,
      userNote,
      integrityHash,
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Check if score hits 100 to trigger celebration
  useEffect(() => {
    if (scorecard.overallScore === 100 && scorecard.unmitigatedCount === 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#6366F1', '#EC4899', '#F59E0B'],
        });
      } catch (e) {
        // Ignore in headless environments
      }
    }
  }, [scorecard.overallScore, scorecard.unmitigatedCount]);

  // 1. ACTION: Deploy Defense
  const handleDeployDefense = (id: string) => {
    setVulnerabilities((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'DEFENSE_DEPLOYED',
            statusTimestamp: new Date().toLocaleTimeString(),
          };
        }
        return v;
      })
    );

    const target = vulnerabilities.find((v) => v.id === id);
    addAuditLog(
      'DEPLOY_DEFENSE',
      id,
      target?.title || id,
      'Active Sandbox Shield and AppOps isolation activated'
    );
  };

  // 2. ACTION: Fix Vulnerability
  const handleFixVulnerability = (id: string) => {
    setVulnerabilities((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'FIXED',
            statusTimestamp: new Date().toLocaleTimeString(),
          };
        }
        return v;
      })
    );

    const target = vulnerabilities.find((v) => v.id === id);
    addAuditLog(
      'FIX_VULNERABILITY',
      id,
      target?.title || id,
      'Automated hardening patch applied, component neutralized'
    );
  };

  // 3. ACTION: Ignore Risk
  const handleIgnore = (id: string) => {
    setVulnerabilities((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'IGNORED',
            statusTimestamp: new Date().toLocaleTimeString(),
          };
        }
        return v;
      })
    );

    const target = vulnerabilities.find((v) => v.id === id);
    addAuditLog(
      'IGNORE_RISK',
      id,
      target?.title || id,
      'Operator documented security exception waiver'
    );
  };

  // 4. ACTION: Rollback
  const handleRollback = (id: string) => {
    setVulnerabilities((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'UNMITIGATED',
            statusTimestamp: new Date().toLocaleTimeString(),
          };
        }
        return v;
      })
    );

    const target = vulnerabilities.find((v) => v.id === id);
    addAuditLog(
      'ROLLBACK_MITIGATION',
      id,
      target?.title || id,
      'Mitigation reverted; exposure state restored'
    );
  };

  // Batch action: Deploy All Defenses
  const handleDeployAllDefenses = () => {
    setVulnerabilities((prev) =>
      prev.map((v) => {
        if (v.status === 'UNMITIGATED') {
          return {
            ...v,
            status: 'DEFENSE_DEPLOYED',
            statusTimestamp: new Date().toLocaleTimeString(),
          };
        }
        return v;
      })
    );
    addAuditLog(
      'BATCH_DEPLOY_DEFENSE',
      'ALL_VULNS',
      'Enforced Sandbox Isolation across all unmitigated threats',
      'Batch defense action executed'
    );
  };

  // Batch action: Fix All Vulnerabilities
  const handleFixAllVulnerabilities = () => {
    setVulnerabilities((prev) =>
      prev.map((v) => ({
        ...v,
        status: 'FIXED',
        statusTimestamp: new Date().toLocaleTimeString(),
      }))
    );
    addAuditLog(
      'BATCH_FIX_VULNERABILITIES',
      'ALL_VULNS',
      'Applied automated hardening patches to all vulnerabilities',
      'Full remediation applied'
    );
  };

  // Device Posture: Harden Item
  const handleHardenPostureItem = (id: string) => {
    setPostureItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'COMPLIANT',
            currentValue: item.expectedValue,
          };
        }
        return item;
      })
    );

    // Also if this item corresponds to an OS vulnerability, fix it
    if (id === 'POSTURE-001') {
      handleFixVulnerability('VULN-AND-006'); // SELinux
    } else if (id === 'POSTURE-002') {
      handleFixVulnerability('VULN-AND-002'); // Root / SU
    } else if (id === 'POSTURE-003') {
      handleFixVulnerability('VULN-AND-010'); // ADB Debugging
    } else if (id === 'POSTURE-007') {
      handleFixVulnerability('VULN-AND-008'); // User CA
    }

    const item = postureItems.find((p) => p.id === id);
    addAuditLog(
      'HARDEN_POSTURE_SUBSYSTEM',
      id,
      item?.name || id,
      'Android kernel/OS parameter set to secure baseline'
    );
  };

  // Device Posture: Harden All
  const handleHardenAllPosture = () => {
    setPostureItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'COMPLIANT',
        currentValue: item.expectedValue,
      }))
    );
    // Fix corresponding OS vulnerabilities
    ['VULN-AND-002', 'VULN-AND-006', 'VULN-AND-008', 'VULN-AND-010'].forEach((vId) => {
      handleFixVulnerability(vId);
    });
    addAuditLog(
      'BATCH_HARDEN_POSTURE',
      'ALL_POSTURE',
      'Hardened all Android Kernel, Keystore, and SELinux subsystems'
    );
  };

  // Quarantine from APK Inspector
  const handleQuarantineApk = (packageName: string) => {
    addAuditLog(
      'QUARANTINE_APK',
      packageName,
      `Quarantined Package: ${packageName}`,
      'AppOps permissions revoked, process isolated'
    );
  };

  // Reset all
  const handleResetAll = () => {
    setVulnerabilities(INITIAL_ANDROID_VULNERABILITIES);
    setPostureItems(INITIAL_DEVICE_POSTURE);
    addAuditLog('SYSTEM_RESET', 'ALL', 'Simulation state restored to baseline inspection');
  };

  // Full Interactive System Scan Simulation
  const handleStartScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    const steps = [
      { progress: 20, log: 'Auditing Android AppOps & dangerous permission grants...' },
      { progress: 45, log: 'Analyzing sideloaded APK signatures & debug certificates...' },
      { progress: 70, log: 'Probing kernel SELinux MAC policies & su binaries in /system/xbin...' },
      { progress: 88, log: 'Calculating Shannon entropy on DEX bytecode payloads...' },
      { progress: 100, log: 'Full Android System scan complete. Telemetry synchronized.' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        addAuditLog(
          'FULL_SCAN_COMPLETE',
          'ALL_SUBSYSTEMS',
          'Android Deep Vulnerability Scan Completed',
          `Scanned 10 subsystems with 100% precision`
        );
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        threatLevel={scorecard.threatLevel}
        overallScore={scorecard.overallScore}
        isScanning={isScanning}
        onStartScan={handleStartScan}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAuditLog={() => setIsAuditLogOpen(true)}
        onResetAll={handleResetAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'DASHBOARD'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Posture & Vulnerabilities</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-indigo-900/60 text-indigo-200">
                {vulnerabilities.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('APK_INSPECTOR')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'APK_INSPECTOR'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Bug className="w-4 h-4" />
              <span>APK & Package Inspector</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-slate-400">
                5 Samples
              </span>
            </button>

            <button
              onClick={() => setActiveTab('DEVICE_POSTURE')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'DEVICE_POSTURE'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>OS Posture & Kernel</span>
            </button>

            <button
              onClick={() => setActiveTab('ENTROPY_LAB')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'ENTROPY_LAB'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Binary className="w-4 h-4 text-purple-400" />
              <span>Shannon Entropy Lab</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                Science
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Live Scanner Telemetry
            </span>
          </div>
        </div>

        {/* Tab 1: Primary Posture & Vulnerability Dashboard */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <PostureOverview
              scorecard={scorecard}
              onDeployAllDefenses={handleDeployAllDefenses}
              onFixAllVulnerabilities={handleFixAllVulnerabilities}
              isScanning={isScanning}
              scanProgress={scanProgress}
            />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Detected Android Vulnerabilities & Defense Actions
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {scorecard.unmitigatedCount} unmitigated &bull; {scorecard.defenseDeployedCount} defended &bull;{' '}
                  {scorecard.fixedCount} fixed &bull; {scorecard.ignoredCount} ignored
                </span>
              </div>

              <VulnerabilityList
                vulnerabilities={vulnerabilities}
                onDeployDefense={handleDeployDefense}
                onFixVulnerability={handleFixVulnerability}
                onIgnore={handleIgnore}
                onRollback={handleRollback}
                onViewRemediationModal={(v) => setActiveRemediationVuln(v)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: APK & Package Deep Inspector */}
        {activeTab === 'APK_INSPECTOR' && (
          <ApkInspector
            onScanApk={(apk) => {
              addAuditLog('APK_SCAN_LOADED', apk.packageName, apk.appName);
            }}
            onQuarantineApk={handleQuarantineApk}
          />
        )}

        {/* Tab 3: Android Device Posture & Kernel Radar */}
        {activeTab === 'DEVICE_POSTURE' && (
          <DevicePostureRadar
            postureItems={postureItems}
            onHardenItem={handleHardenPostureItem}
            onHardenAll={handleHardenAllPosture}
          />
        )}

        {/* Tab 4: Shannon Entropy Lab (Science Skill integration) */}
        {activeTab === 'ENTROPY_LAB' && <ScientificEntropyViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">WARRIOR HACKSON SCAN</span>
            <span>&bull;</span>
            <span>Built for Warrior Hacks 2.0 Devpost Competition</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReportOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Export Report
            </button>
            <button
              onClick={() => setIsAuditLogOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Audit Log ({auditLogs.length})
            </button>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-500 font-semibold">Zero-Trust Mobile EDR</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isReportOpen && (
        <ReportExportModal
          scorecard={scorecard}
          vulnerabilities={vulnerabilities}
          postureItems={postureItems}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {isAuditLogOpen && (
        <AuditLogModal logs={auditLogs} onClose={() => setIsAuditLogOpen(false)} />
      )}

      {activeRemediationVuln && (
        <RemediationModal
          vulnerability={activeRemediationVuln}
          onClose={() => setActiveRemediationVuln(null)}
          onApplyFix={handleFixVulnerability}
          onDeployDefense={handleDeployDefense}
        />
      )}
    </div>
  );
}
