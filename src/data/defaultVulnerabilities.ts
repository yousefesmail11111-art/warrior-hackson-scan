/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VulnerabilityItem } from '../types/security';

export const INITIAL_ANDROID_VULNERABILITIES: VulnerabilityItem[] = [
  {
    id: 'VULN-AND-001',
    title: 'Rogue Overlay & Accessibility Service Hijacking (Cloak & Dagger Attack)',
    category: 'MALICIOUS_PERMISSIONS',
    severity: 'CRITICAL',
    cvssScore: 9.3,
    cveId: 'CVE-2023-20963',
    cweId: 'CWE-1021: Improper Restriction of Rendered UI Layers',
    affectedComponent: 'package: com.quickservice.cleaner.helper (AccessibilityService & SYSTEM_ALERT_WINDOW)',
    description:
      'A sideloaded utility app has requested and obtained BIND_ACCESSIBILITY_SERVICE and SYSTEM_ALERT_WINDOW. This allows transparent view overlay rendering over banking, crypto, and credential entry screens to silently log keystrokes, capture 2FA SMS tokens, and automate touch events.',
    riskImpact:
      'Full account takeover, credential interception, and automated unauthorized monetary transfers via Android Accessibility Node hierarchy scraping.',
    detectionIndicator:
      'AccessibilityService active with canRetrieveWindowContent=true & overlay window type TYPE_APPLICATION_OVERLAY active during foreground target app transitions.',
    owaspMobileCategory: 'M1: Improper Credential Usage & M6: Insecure Authorization',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Deploy Knox / Android Work Profile isolation shield to block overlay injection on protected financial apps and enforce FLAG_SECURE window masking.',
      fixDescription:
        'Revoke accessibility binding via AppOps, disable overlay permission, and place package com.quickservice.cleaner.helper in quarantine.',
      codePatch: {
        filename: 'AndroidManifest.xml',
        language: 'xml',
        before: `<service
    android:name=".OverlayAccessibilityService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:exported="true">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
</service>`,
        after: `<!-- SECURED: Service stripped of broad accessibility binding & isolated -->
<service
    android:name=".SafeUtilityService"
    android:exported="false"
    android:permission="android.permission.BIND_JOB_SERVICE" />`,
      },
      cliCommand:
        'adb shell cmd appops set com.quickservice.cleaner.helper SYSTEM_ALERT_WINDOW ignore && adb shell pm disable-user com.quickservice.cleaner.helper',
    },
  },
  {
    id: 'VULN-AND-002',
    title: 'SU Binary Presence & KernelSU/Magisk Root Compromise',
    category: 'DEVICE_POSTURE',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    cveId: 'CVE-2023-40088',
    cweId: 'CWE-250: Execution with Unnecessary Privileges',
    affectedComponent: 'system: /system/xbin/su, /sbin/.magisk, /dev/kernelsu',
    description:
      'Detected unconstrained root privilege binaries (/system/xbin/su) and hooked Zygote processes. Root access breaks Android Application Sandbox boundaries (UID separation), allowing any malicious app to access arbitrary private databases, SharedPreferences, and keystores.',
    riskImpact:
      'Complete bypass of Android SELinux enforcing mode, unauthorized kernel memory read/write, hardware-backed keystore extraction, and device-wide spyware persistence.',
    detectionIndicator:
      'Found executable /system/xbin/su with SUID bit set, Magisk daemon socket active, and build tag test-keys detected in ro.build.tags.',
    owaspMobileCategory: 'M8: Security Misconfiguration',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Deploy Android SafetyNet/Play Integrity hardware attestation defense to restrict corporate/banking apps from running under compromised root environment.',
      fixDescription:
        'Remount system partitions as Read-Only, remove su binaries, purge su daemon symlinks, and restore boot image to verified OEM signed state.',
      codePatch: {
        filename: 'build.prop & sepolicy',
        language: 'properties',
        before: `ro.build.tags=test-keys
ro.debuggable=1
ro.secure=0
persist.sys.root_access=3`,
        after: `ro.build.tags=release-keys
ro.debuggable=0
ro.secure=1
persist.sys.root_access=0`,
      },
      cliCommand:
        'adb shell su -c "mount -o remount,ro /system && rm -f /system/xbin/su /system/bin/su && setenforce 1"',
    },
  },
  {
    id: 'VULN-AND-003',
    title: 'Sideloaded Trojan with High-Entropy Packed DEX Stager (SharkBot Family)',
    category: 'SIDELOADED_MALWARE',
    severity: 'HIGH',
    cvssScore: 8.6,
    cveId: 'CVE-2022-20005',
    cweId: 'CWE-506: Embedded Malicious Code',
    affectedComponent: 'package: com.crypto.fastwallet.mod (sha256: e3b0c442...98b2)',
    description:
      'A third-party APK installed outside Google Play Store exhibits a scientific Shannon Entropy of 7.82 / 8.0 in its classes2.dex payload, with signature mismatch against verified developer keys. High entropy indicates dynamic decryption of an uninspected secondary DEX payload.',
    riskImpact:
      'Dynamic class loading (InMemoryDexClassLoader) allows the application to download and execute arbitrary unverified DEX bytecode post-installation, bypassing static scans.',
    detectionIndicator:
      'Package installer is com.android.packageinstaller (non-store origin), classes2.dex entropy = 7.82 (High Cryptographic Packing), debug certificate CN=Android Debug.',
    owaspMobileCategory: 'M4: Insufficient Input/Output Validation & M10: Insufficient Cryptography',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Deploy strict runtime DexClassLoader block using AppOps policy to prohibit dynamic code loading from internal cache storage.',
      fixDescription:
        'Immediate uninstallation and hash blacklisting of the suspicious APK, clearing associated app cache and sandboxed storage.',
      codePatch: {
        filename: 'SecurityHardening.kt',
        language: 'kotlin',
        before: `// Vulnerable dynamic loading from remote payload
val dexLoader = InMemoryDexClassLoader(
    ByteBuffer.wrap(downloadedEncryptedPayload),
    classLoader
)`,
        after: `// SECURED: Disallow dynamic runtime dex classloading
fun verifyDexIntegrity(context: Context) {
    if (context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0) {
        throw SecurityException("Debuggable binary rejected")
    }
    // Enforce static compiled dex only with OEM signature check
}`,
      },
      cliCommand:
        'adb shell pm uninstall com.crypto.fastwallet.mod && adb shell pm clear com.crypto.fastwallet.mod',
    },
  },
  {
    id: 'VULN-AND-004',
    title: 'Cleartext HTTP Allowed in Network Security Configuration',
    category: 'NETWORK_INDICATORS',
    severity: 'HIGH',
    cvssScore: 7.9,
    cveId: 'CVE-2023-35678',
    cweId: 'CWE-319: Cleartext Transmission of Sensitive Information',
    affectedComponent: 'res/xml/network_security_config.xml',
    description:
      'The application network security configuration sets cleartextTrafficPermitted="true" globally, allowing plaintext HTTP communication without TLS encryption. This exposes mobile traffic to Man-in-the-Middle (MitM) packet inspection, session hijacking, and DNS poisoning on untrusted Wi-Fi.',
    riskImpact:
      'Eavesdropping on API tokens, personal identifiable information (PII), and session cookies across cellular or rogue public Wi-Fi hotspots.',
    detectionIndicator:
      'android:usesCleartextTraffic="true" declared in AndroidManifest.xml and network_security_config.xml contains base-config cleartextTrafficPermitted="true".',
    owaspMobileCategory: 'M3: Insecure Communication',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Enforce local VPN-based TLS packet filter to redirect all outbound port 80 requests to encrypted HTTPS or terminate unencrypted connections.',
      fixDescription:
        'Update network_security_config.xml to enforce cleartextTrafficPermitted="false" and configure Certificate Pinning for sensitive API endpoints.',
      codePatch: {
        filename: 'res/xml/network_security_config.xml',
        language: 'xml',
        before: `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>`,
        after: `<?xml version="1.0" encoding="utf-8"?>
<!-- SECURED: Strict TLS 1.3 only, cleartext denied, system trust anchors only -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config>
        <domain includeSubdomains="true">api.warriorhacks.org</domain>
        <pin-set expiration="2027-01-01">
            <pin digest="SHA-256">47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=</pin>
        </pin-set>
    </domain-config>
</network-security-config>`,
      },
      cliCommand:
        'adb shell settings put global http_proxy :0 && adb shell cmd network_management set_firewall_rule block_cleartext',
    },
  },
  {
    id: 'VULN-AND-005',
    title: 'Exported Activity Vulnerable to Intent Redirection & Task Hijacking',
    category: 'COMPONENT_EXPLOITS',
    severity: 'HIGH',
    cvssScore: 7.7,
    cveId: 'CVE-2023-21036',
    cweId: 'CWE-926: Improper Export of Android Application Components',
    affectedComponent: 'manifest: com.warrior.app.AuthCallbackActivity (android:exported="true")',
    description:
      'An internal authentication and token handling Activity is declared with android:exported="true" without permission requirements or signature restrictions. Any third-party app installed on the device can fire explicit Intents to trigger internal workflows and harvest authorization tokens.',
    riskImpact:
      'Arbitrary intent redirection, token leakage, and strandhogg task affinity spoofing leading to phishing UI injection.',
    detectionIndicator:
      'Activity AuthCallbackActivity specifies exported=true with intent-filter lacking signature-level android:permission protection.',
    owaspMobileCategory: 'M6: Insecure Authorization & M7: Client Code Quality',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Deploy Android Intent Firewall rules to reject third-party Intent calls matching AuthCallbackActivity unless origin UID matches target.',
      fixDescription:
        'Set android:exported="false" or protect the component with a custom permission possessing protectionLevel="signature".',
      codePatch: {
        filename: 'AndroidManifest.xml',
        language: 'xml',
        before: `<activity
    android:name=".AuthCallbackActivity"
    android:exported="true"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>`,
        after: `<!-- SECURED: Exported disabled and protected by signature permission -->
<activity
    android:name=".AuthCallbackActivity"
    android:exported="false"
    android:permission="com.warrior.permission.INTERNAL_AUTH"
    android:launchMode="singleInstance">
</activity>`,
      },
      cliCommand:
        'adb shell cmd package set-component-enabled-setting com.warrior.app/.AuthCallbackActivity 2 1',
    },
  },
  {
    id: 'VULN-AND-006',
    title: 'SELinux Permissive Mode & Insecure System Configuration',
    category: 'DEVICE_POSTURE',
    severity: 'HIGH',
    cvssScore: 8.2,
    cveId: 'CVE-2021-0920',
    cweId: 'CWE-276: Incorrect Default Permissions',
    affectedComponent: 'kernel: Security-Enhanced Linux (SELinux)',
    description:
      'The device kernel SELinux enforcement has been toggled to "Permissive" instead of "Enforcing". This disables mandatory access control (MAC) policies, meaning process domain transitions and file context access checks are logged but not prevented.',
    riskImpact:
      'Malicious processes can break out of untrusted_app domain, access raw device nodes in /dev, and compromise core system daemons like vold and surfaceflinger.',
    detectionIndicator:
      'getenforce shell command returns "Permissive". /sys/fs/selinux/enforce value is 0.',
    owaspMobileCategory: 'M8: Security Misconfiguration',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Enforce dynamic policy check intercepting binder transactions from untrusted domains until SELinux is restored to Enforcing.',
      fixDescription:
        'Execute kernel parameter toggle to set SELinux state to Enforcing and write persistent flag to system properties.',
      codePatch: {
        filename: 'init.rc & kernel cmdline',
        language: 'bash',
        before: `# Insecure permissive mode
setenforce 0
androidboot.selinux=permissive`,
        after: `# SECURED: Enforcing mode enforced
setenforce 1
androidboot.selinux=enforcing`,
      },
      cliCommand: 'adb shell setenforce 1',
    },
  },
  {
    id: 'VULN-AND-007',
    title: 'Dangerous Background SMS & Call Log Access with Unknown Purpose',
    category: 'MALICIOUS_PERMISSIONS',
    severity: 'MEDIUM',
    cvssScore: 6.8,
    cveId: 'CVE-2022-20186',
    cweId: 'CWE-272: Least Privilege Violation',
    affectedComponent: 'package: com.weather.tracker.lite (READ_SMS, RECEIVE_SMS, READ_CALL_LOG)',
    description:
      'A simple weather forecast application requests READ_SMS, RECEIVE_SMS, and READ_CALL_LOG permissions. There is zero legitimate functional correlation between meteorological updates and telephony/SMS records.',
    riskImpact:
      'Potential SMS-based one-time password (OTP) exfiltration, tracking user social contacts, and telemetry leakage to unknown analytics servers.',
    detectionIndicator:
      'App category is WEATHER, yet manifest declares android.permission.RECEIVE_SMS with continuous background service running.',
    owaspMobileCategory: 'M2: Inadequate Supply Chain Security & M9: Insecure Data Storage',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Activate Android AppOps privacy dashboard runtime shield, revoking runtime SMS permissions while retaining essential internet access.',
      fixDescription:
        'Strip telephony permissions from the application manifest and revoke granted runtime permissions via Package Manager.',
      codePatch: {
        filename: 'AndroidManifest.xml',
        language: 'xml',
        before: `<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />`,
        after: `<!-- SECURED: Stripped unnecessary privacy-invasive telephony permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`,
      },
      cliCommand:
        'adb shell pm revoke com.weather.tracker.lite android.permission.READ_SMS && adb shell pm revoke com.weather.tracker.lite android.permission.RECEIVE_SMS',
    },
  },
  {
    id: 'VULN-AND-008',
    title: 'Untrusted User CA Certificate Installed in System Trust Store',
    category: 'NETWORK_INDICATORS',
    severity: 'MEDIUM',
    cvssScore: 6.5,
    cveId: 'CVE-2020-0015',
    cweId: 'CWE-295: Improper Certificate Validation',
    affectedComponent: 'keystore: /data/misc/user/0/cacerts-added/c8450d0d.0',
    description:
      'A custom root certificate authority has been installed into the User Trust Store. While Android 7.0+ ignores user CAs for standard app traffic by default, apps without explicit network security configs or using legacy targetSdk remain vulnerable to transparent proxy TLS interception.',
    riskImpact:
      'Corporate proxy or hostile interceptor (Burp Suite, Charles, mitmproxy) can decrypt SSL/TLS traffic, inspecting credentials and HTTPS requests in cleartext.',
    detectionIndicator:
      'User credentials store contains certificate Subject: "CN=PortSwigger CA, OU=PortSwigger" installed on device.',
    owaspMobileCategory: 'M3: Insecure Communication',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Deploy Network Security Config trust override restricting all app networking strictly to system pre-installed CAs (<certificates src="system" />).',
      fixDescription:
        'Remove the untrusted user certificate from Android Security Settings -> Encryption & Credentials -> User Credentials.',
      codePatch: {
        filename: 'res/xml/network_security_config.xml',
        language: 'xml',
        before: `<trust-anchors>
    <certificates src="system" />
    <certificates src="user" />
</trust-anchors>`,
        after: `<!-- SECURED: Ignore user CAs, only trust verified system CAs -->
<trust-anchors>
    <certificates src="system" />
</trust-anchors>`,
      },
      cliCommand:
        'adb shell rm -f /data/misc/user/0/cacerts-added/* && adb shell am broadcast -a android.security.action.TRUST_STORE_CHANGED',
    },
  },
  {
    id: 'VULN-AND-009',
    title: 'World-Readable SharedPreferences with Plaintext Cryptographic Keys',
    category: 'COMPONENT_EXPLOITS',
    severity: 'MEDIUM',
    cvssScore: 5.9,
    cveId: 'CVE-2022-20224',
    cweId: 'CWE-732: Incorrect Permission Assignment for Critical Resource',
    affectedComponent: 'storage: /data/data/com.warrior.app/shared_prefs/auth_session.xml',
    description:
      'Legacy SharedPreferences file was created using MODE_WORLD_READABLE (0x0001) instead of MODE_PRIVATE. Other applications running with distinct UIDs on the same device can directly read auth tokens and master API encryption keys stored in plaintext.',
    riskImpact:
      'Unauthorized access to persistent session tokens, refresh tokens, and encryption secrets by any collocated app.',
    detectionIndicator:
      'File permissions on /data/data/com.warrior.app/shared_prefs/auth_session.xml are -rw-rw-r-- with world read bit set.',
    owaspMobileCategory: 'M9: Insecure Data Storage',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Enforce in-memory encrypted cache wrapper preventing disk read requests from external UIDs.',
      fixDescription:
        'Migrate from legacy SharedPreferences to AndroidX EncryptedSharedPreferences with Android Keystore backed MasterKey.',
      codePatch: {
        filename: 'SessionManager.kt',
        language: 'kotlin',
        before: `// Insecure world-readable shared preferences
val prefs = context.getSharedPreferences("auth_session", Context.MODE_WORLD_READABLE)
prefs.edit().putString("auth_token", rawToken).apply()`,
        after: `// SECURED: Hardware-backed EncryptedSharedPreferences
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val encryptedPrefs = EncryptedSharedPreferences.create(
    context,
    "auth_session_secured",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
encryptedPrefs.edit().putString("auth_token", rawToken).apply()`,
      },
      cliCommand:
        'adb shell chmod 600 /data/data/com.warrior.app/shared_prefs/auth_session.xml',
    },
  },
  {
    id: 'VULN-AND-010',
    title: 'USB Debugging (ADB) & Developer Options Left Active in Field',
    category: 'DEVICE_POSTURE',
    severity: 'LOW',
    cvssScore: 4.4,
    cveId: 'CVE-2020-0243',
    cweId: 'CWE-1188: Insecure Default Initialization of Resource',
    affectedComponent: 'settings: adb_enabled = 1, development_settings_enabled = 1',
    description:
      'USB Debugging (ADB daemon) is persistently enabled on the device. An attacker with momentary physical access or a malicious public USB charging kiosk (Juice Jacking) can initiate an unauthorized adb pairing to extract device logs, install rogue APKs, and pull private app databases.',
    riskImpact:
      'Unauthorized desktop pairing, arbitrary shell execution over USB without screen lock confirmation, and forensic dump vulnerability.',
    detectionIndicator:
      'Settings.Global.getInt(resolver, Settings.Global.ADB_ENABLED, 0) == 1 with RSA unauthorized keys enabled.',
    owaspMobileCategory: 'M8: Security Misconfiguration',
    status: 'UNMITIGATED',
    remediation: {
      defenseDescription:
        'Enable USB Data Port Lockdown to only allow battery charging and drop all data pins when connected to non-whitelisted host PCs.',
      fixDescription:
        'Disable USB Debugging in Android Developer Options and revoke all active ADB authorization keys.',
      codePatch: {
        filename: 'DeviceAdminReceiver.kt',
        language: 'kotlin',
        before: `// Developer options and ADB enabled in field
Settings.Global.putInt(contentResolver, Settings.Global.ADB_ENABLED, 1)`,
        after: `// SECURED: Enforce enterprise policy disabling ADB in production
val dpm = getSystemService(DevicePolicyManager::class.java)
dpm.addUserRestriction(adminComponent, UserManager.DISALLOW_DEBUGGING_FEATURES)`,
      },
      cliCommand:
        'adb shell settings put global adb_enabled 0 && adb shell settings put global development_settings_enabled 0',
    },
  },
];
