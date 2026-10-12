/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VulnerabilityItem, SecurityScorecard, ThreatLevel } from '../types/security';

export function calculateSecurityScorecard(vulnerabilities: VulnerabilityItem[]): SecurityScorecard {
  let penalty = 0;
  let unmitigatedCount = 0;
  let defenseDeployedCount = 0;
  let fixedCount = 0;
  let ignoredCount = 0;

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  let totalCvss = 0;
  let maxCvss = 0;

  const totalVulnerabilities = vulnerabilities.length;

  for (const vuln of vulnerabilities) {
    if (vuln.cvssScore > maxCvss) {
      maxCvss = vuln.cvssScore;
    }
    totalCvss += vuln.cvssScore;

    if (vuln.severity === 'CRITICAL') criticalCount++;
    else if (vuln.severity === 'HIGH') highCount++;
    else if (vuln.severity === 'MEDIUM') mediumCount++;
    else if (vuln.severity === 'LOW') lowCount++;

    // Calculate penalty based on status
    let baseWeight = 0;
    switch (vuln.severity) {
      case 'CRITICAL':
        baseWeight = 26;
        break;
      case 'HIGH':
        baseWeight = 16;
        break;
      case 'MEDIUM':
        baseWeight = 9;
        break;
      case 'LOW':
        baseWeight = 4;
        break;
      case 'INFO':
        baseWeight = 1;
        break;
    }

    if (vuln.status === 'UNMITIGATED') {
      unmitigatedCount++;
      penalty += baseWeight;
    } else if (vuln.status === 'DEFENSE_DEPLOYED') {
      defenseDeployedCount++;
      // Defense deployed dampens penalty by 80%
      penalty += baseWeight * 0.2;
    } else if (vuln.status === 'FIXED') {
      fixedCount++;
      // Fixed completely removes penalty
      penalty += 0;
    } else if (vuln.status === 'IGNORED') {
      ignoredCount++;
      // Ignored still carries 40% liability penalty for security rigor
      penalty += baseWeight * 0.4;
    }
  }

  // Calculate 0-100 overall score
  const rawScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  const overallScore = totalVulnerabilities === 0 ? 100 : rawScore;

  // Determine Threat Level
  let threatLevel: ThreatLevel = 'SECURE';
  if (overallScore >= 90) {
    threatLevel = 'SECURE';
  } else if (overallScore >= 75) {
    threatLevel = 'LOW_RISK';
  } else if (overallScore >= 55) {
    threatLevel = 'ELEVATED';
  } else if (overallScore >= 35) {
    threatLevel = 'HIGH_RISK';
  } else {
    threatLevel = 'CRITICAL_THREAT';
  }

  // Force elevated threat level if unmitigated critical exists
  if (unmitigatedCount > 0 && criticalCount > 0 && overallScore > 50) {
    threatLevel = 'HIGH_RISK';
  }

  const averageCvss = totalVulnerabilities > 0 ? Number((totalCvss / totalVulnerabilities).toFixed(1)) : 0;

  // Zero trust status
  let zeroTrustStatus: 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT' = 'COMPLIANT';
  if (unmitigatedCount === 0 && overallScore >= 90) {
    zeroTrustStatus = 'COMPLIANT';
  } else if (criticalCount > 0 && unmitigatedCount > 0) {
    zeroTrustStatus = 'NON_COMPLIANT';
  } else {
    zeroTrustStatus = 'AT_RISK';
  }

  // OWASP Compliance Rate
  const resolvedCount = fixedCount + defenseDeployedCount;
  const owaspComplianceRate =
    totalVulnerabilities > 0
      ? Math.round((resolvedCount / totalVulnerabilities) * 100)
      : 100;

  return {
    overallScore,
    threatLevel,
    totalVulnerabilities,
    unmitigatedCount,
    defenseDeployedCount,
    fixedCount,
    ignoredCount,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    averageCvss,
    maxCvss,
    zeroTrustStatus,
    owaspComplianceRate,
  };
}

export function getThreatLevelDisplay(threatLevel: ThreatLevel): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  description: string;
} {
  switch (threatLevel) {
    case 'SECURE':
      return {
        label: 'SECURE',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-950/40',
        borderColor: 'border-emerald-500/40',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        description: 'Zero critical threats detected. All perimeter defenses, AppOps, and sandbox policies active.',
      };
    case 'LOW_RISK':
      return {
        label: 'LOW RISK',
        color: 'text-blue-400',
        bgColor: 'bg-blue-950/40',
        borderColor: 'border-blue-500/40',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        description: 'Minor configuration warnings. Core Android security framework and Play Protect enforcing.',
      };
    case 'ELEVATED':
      return {
        label: 'ELEVATED RISK',
        color: 'text-amber-400',
        bgColor: 'bg-amber-950/40',
        borderColor: 'border-amber-500/40',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        description: 'High-severity misconfigurations or suspicious sideloaded packages require defense deployment.',
      };
    case 'HIGH_RISK':
      return {
        label: 'HIGH RISK',
        color: 'text-orange-400',
        bgColor: 'bg-orange-950/40',
        borderColor: 'border-orange-500/40',
        badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        description: 'Dangerous permission abuse or unverified signature detected. Device at risk of credential theft.',
      };
    case 'CRITICAL_THREAT':
      return {
        label: 'CRITICAL THREAT',
        color: 'text-rose-500',
        bgColor: 'bg-rose-950/50',
        borderColor: 'border-rose-500/50',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse',
        description: 'Active root compromise or trojan overlay detected. Immediate automated remediation required.',
      };
  }
}
