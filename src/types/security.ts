/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type ThreatLevel = 'SECURE' | 'LOW_RISK' | 'ELEVATED' | 'HIGH_RISK' | 'CRITICAL_THREAT';

export type VulnerabilityCategory =
  | 'MALICIOUS_PERMISSIONS'
  | 'SIDELOADED_MALWARE'
  | 'DEVICE_POSTURE'
  | 'NETWORK_INDICATORS'
  | 'COMPONENT_EXPLOITS'
  | 'CRYPTOGRAPHIC_ENTROPY';

export type MitigationStatus = 'UNMITIGATED' | 'DEFENSE_DEPLOYED' | 'FIXED' | 'IGNORED';

export interface RemediationAction {
  id: string;
  type: 'DEPLOY_DEFENSE' | 'FIX_VULNERABILITY' | 'IGNORE' | 'ROLLBACK';
  label: string;
  description: string;
  technicalSteps: string[];
  codePatch?: {
    filename: string;
    language: string;
    before: string;
    after: string;
  };
  cliCommand?: string;
}

export interface VulnerabilityItem {
  id: string;
  title: string;
  category: VulnerabilityCategory;
  severity: Severity;
  cvssScore: number; // 0.0 - 10.0
  cveId?: string;
  cweId?: string;
  affectedComponent: string; // e.g. "package: com.fraud.bankapp.overlay", "system: /system/xbin/su", "manifest: AndroidManifest.xml"
  description: string;
  riskImpact: string;
  detectionIndicator: string; // Forensic evidence
  owaspMobileCategory: string; // e.g. "M1: Improper Credential Usage", "M8: Security Misconfiguration"
  status: MitigationStatus;
  statusTimestamp?: string;
  mitigationHistory?: {
    action: 'DEPLOY_DEFENSE' | 'FIX_VULNERABILITY' | 'IGNORE' | 'ROLLBACK';
    timestamp: string;
    details: string;
  }[];
  remediation: {
    defenseDescription: string;
    fixDescription: string;
    codePatch?: {
      filename: string;
      language: string;
      before: string;
      after: string;
    };
    cliCommand?: string;
  };
}

export interface DevicePostureItem {
  id: string;
  name: string;
  category: 'KERNEL' | 'SYSTEM_SETTINGS' | 'STORAGE_ENCRYPTION' | 'PLAY_PROTECT' | 'NETWORK';
  status: 'COMPLIANT' | 'WARNING' | 'CRITICAL';
  currentValue: string;
  expectedValue: string;
  description: string;
  remediationCommand: string;
  canAutoHardening: boolean;
}

export interface ApkPackageInfo {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  minSdkVersion: number;
  targetSdkVersion: number;
  apkSizeMb: number;
  sha256: string;
  isSideloaded: boolean;
  isSignedWithDebugKey: boolean;
  shannonEntropy: number; // 0.0 - 8.0 (Entropy > 7.2 usually indicates packed / encrypted payload)
  entropyVerdict: 'NORMAL' | 'SUSPICIOUS' | 'PACKED_ENCRYPTED_PAYLOAD';
  permissions: {
    name: string;
    isDangerous: boolean;
    isGranted: boolean;
    riskReason?: string;
  }[];
  exportedComponents: {
    name: string;
    type: 'Activity' | 'Service' | 'Receiver' | 'Provider';
    isProtectedByPermission: boolean;
    vulnerabilityFlag?: string;
  }[];
  malwareFamily?: string;
  threatDescription?: string;
  threatScore: number; // 0 - 100
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  targetId: string;
  targetName: string;
  userNote?: string;
  integrityHash: string;
}

export interface SecurityScorecard {
  overallScore: number; // 0 - 100
  threatLevel: ThreatLevel;
  totalVulnerabilities: number;
  unmitigatedCount: number;
  defenseDeployedCount: number;
  fixedCount: number;
  ignoredCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  averageCvss: number;
  maxCvss: number;
  zeroTrustStatus: 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT';
  owaspComplianceRate: number; // 0 - 100%
}
