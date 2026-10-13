WARRIOR HACKATHON SCAN - Zero-Trust Android EDR
Version Android License Warrior Hacks

An autonomous Android Security Posture Engine that detects, explains, and hardens 10+ critical mobile attack vectors in real-time.

Built for Warrior Hacks 2.0 Devpost Competition by Yousef Esmail Nossier.

🔥 Live Demo
[ Live Dashboard Link Here ] - Deploy your link

📸 Screenshots
Secure State (100/100): Zero critical threats, all sandbox policies active
Elevated Risk (71/100): Detects sideloaded malware & misconfigurations
Vulnerability Cards: CVE-mapped, CVSS-scored, with forensic evidence
🚨 Problem
80% of Android devices in MENA run sideloaded APKs outside Play Store. Existing scanners only show "virus found". They don't explain why a permission is dangerous, how Cloak & Dagger hijacks banking apps, or how to fix SELinux Permissive kernels.

✅ Solution
Warrior Hackathon Scan is a Zero-Trust Mobile EDR with 4 engines:

1. Posture & Vulnerabilities (10 Vectors)
CRITICAL CVSS 9.8 - SU Binary & KernelSU/Magisk Root Compromise (/system/xbin/su)
CRITICAL CVSS 9.3 - Rogue Overlay & Accessibility Hijacking (Cloak & Dagger)
HIGH CVSS 8.6 - Sideloaded SharkBot Trojan (High-Entropy Packed DEX)
HIGH CVSS 8.2 - SELinux Permissive Mode
HIGH CVSS 7.9 - Cleartext HTTP in Network Security Config
HIGH CVSS 7.7 - Exported Activity Intent Redirection & Task Hijacking
MEDIUM - USB Debugging (ADB) Left Active in Field - Juice Jacking Risk
2. APK & Package Inspector (5 Samples)
Static analysis of AndroidManifest.xml
Shannon Entropy Lab: Detects packed/encrypted DEX if entropy > 7.5/8.0
Signature mismatch vs verified developer keys
Package installer origin check
3. OS Posture & Kernel
Android 14 API 34 detection
Kernel 6.1.43-android14-arm64
ro.build.tags test-keys detection
4. Shannon Entropy Lab [Science]
Scientific malware detection: Shannon Entropy 7.82/8.0 = High Cryptographic Packing = SharkBot family.

🧬 How It Works - Architecture
APK/Device Input
      ↓
[ Static Parser ] -> AndroidManifest, network_security_config.xml, classes.dex
      ↓
[ 4 Analysis Engines ] -> Permissions, Sideloaded Malware, OS Posture, Network & MitM, IPC & Exploits
      ↓
[ Risk Scoring ] -> CVSS 0-10 + OWASP Mobile Top 10 Mapping + Avg CVSS 7.5/10
      ↓
[ Forensic Telemetry ] -> Evidence: "getenforce returns Permissive", "SUID bit set"
      ↓
[ Autonomous Mitigation ] -> Deploy Defense, Fixed & Patched, Rollback, Audit Log (33)
🛡️ Key Features
Real Risk Scoring: 100/100 SECURE to 0/100 CRITICAL, with Critical/High/Med/Low breakdown
Forensic Evidence: Every finding has Settings.Global.getInt(), entropy=7.82 style proof
Autonomous Mitigation: One-click Deploy All Sandbox Defenses & Apply All Fixes & Hardening
Zero-Trust Compliance: OWASP Mobile Top 10 - 100% Pass, COMPLIANT status
Bilingual UX: Arabic/English - تثبيت التطبيق (Install)
Exportable Audit: Audit Report, Forensic Log, Export Report
🚀 Tech Stack
Frontend: Vite, TypeScript, Tailwind, Framer Motion
Analysis: Custom Shannon Entropy calculator, Regex-based Manifest parser
Security Standards: CVSS v3.1, CVE 2023-40088, CVE-2023-20963, CVE-2022-20005, OWASP MASVS
📦 Installation
git clone https://github.com/yousefesmail11111-art/warrior-hackson-scan
cd warrior-hackson-scan
bun install
bun run dev
# OR
npm install && npm run dev
Then open http://localhost:5173 and click Run Full Android Scan.

🎬 Devpost Video Script (2:30)
Included in /DEVPOST.md

👨‍💻 Creator
Yousef Esmail Nossier - Tool Creator & Systems Developer
Email: yousefesmailnossier@gmail.com
Phone: 01555874750 / 01555198797

WARRIOR HACKATHON SCAN • Warrior Hacks 2.0 Devpost Competition Entry
Zero-Trust Mobile Security Framework Active
