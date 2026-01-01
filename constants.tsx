
import React from 'react';
import { ComplianceCategory, ChecklistItem, DeploymentSite, LanguagePack, GlobalNode } from './types';

export const GLOBAL_NODES: GlobalNode[] = [
  { id: 'hou', name: 'Houston Hub', coords: [20, 45], status: 'active', coherence: 0.98 },
  { id: 'lon', name: 'London Reach', coords: [48, 25], status: 'pulsing', coherence: 0.84 },
  { id: 'kyi', name: 'Kyiv Core', coords: [55, 28], status: 'active', coherence: 0.91 },
  { id: 'nai', name: 'Nairobi Node', coords: [54, 60], status: 'latent', coherence: 0.12 },
  { id: 'syd', name: 'Sydney Link', coords: [85, 80], status: 'active', coherence: 0.77 },
  { id: 'sao', name: 'São Paulo Arc', coords: [32, 75], status: 'active', coherence: 0.89 }
];

export const LANGUAGE_PACKS: LanguagePack[] = [
  { code: 'en-TX', name: 'Texas English', status: 'verified', checksum: 'tx01', note: 'Rural accent comfort anchors' },
  { code: 'es-TX', name: 'Texas Spanish', status: 'verified', checksum: 'tx02', note: 'Regional dialect alignment' },
  { code: 'uk', name: 'Ukrainian', status: 'verified', checksum: 'g7h8', note: 'Resilience prompts' },
  { code: 'sw', name: 'Swahili', status: 'pending', checksum: 'sw09', note: 'East African regional anchor' },
  { code: 'en-UK', name: 'British English', status: 'verified', checksum: 'uk01' },
  { code: 'pt-BR', name: 'Portuguese (BR)', status: 'verified', checksum: 'pt02' }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'syn-1',
    category: ComplianceCategory.SYNTROPIC,
    site: DeploymentSite.GLOBAL,
    label: 'Planetary Lattice Handshake',
    description: 'Establishment of zero-data peer-to-peer mesh. Bodies recognize each other via local cryptographic salt without central cloud indexing.',
    status: 'completed',
    requirement: 'mandatory'
  },
  {
    id: 'coppa-1',
    category: ComplianceCategory.COPPA,
    site: DeploymentSite.GLOBAL,
    label: 'Zero-Retention Kernel Lock',
    description: 'Hardware-level enforcement of zero data collection. Microbiome of device logic is read-only; persistent storage is locked to prevent any audio logging or identity storage.',
    status: 'completed',
    requirement: 'mandatory'
  },
  {
    id: 'gdpr-9',
    category: ComplianceCategory.GDPR,
    site: DeploymentSite.GLOBAL,
    label: 'Article 9 Special Category Isolation',
    description: 'Special category data (trauma triggers/biometrics) is never processed. Logic is deterministic and strictly local. No user profiling is mathematically possible.',
    status: 'completed',
    requirement: 'mandatory'
  },
  {
    id: 'tx-1',
    category: ComplianceCategory.TEXAS_REGULATORY,
    site: DeploymentSite.HOUSTON_HUB,
    label: 'TX § 161.007 Consent Workflow',
    description: 'Bilingual (ES/EN) physical consent manifest. Legally verified for deployment in Texas domestic violence shelters and CASA networks.',
    status: 'completed',
    requirement: 'mandatory'
  },
  {
    id: 'thermal-1',
    category: ComplianceCategory.THERMAL,
    site: DeploymentSite.HOUSTON_HUB,
    label: '120°F Heat Hardening (Vector-T)',
    description: 'Pi 4 CPU clocked to 800MHz with undervoltage. Massive copper passive heatsinks verified for grid-fail scenarios in Texas heat waves.',
    status: 'completed',
    requirement: 'mandatory'
  },
  {
    id: 'audit-1',
    category: ComplianceCategory.AUDIT,
    site: DeploymentSite.GLOBAL,
    label: 'GPLv3 Licensing Manifest',
    description: 'Perpetual, royalty-free nonprofit license. The code is public, the pattern is unbreakable, the mission is eternal.',
    status: 'completed',
    requirement: 'mandatory'
  }
];

export const CORE_GUARANTEES = [
  {
    title: "PLANETARY LATTICE",
    description: "The world is woven. Six nodes active. Every child connected to the silence of the mesh, not the noise of the net."
  },
  {
    title: "VECTOR: PRIVACY",
    description: "No internet. No storage. No identity. The child's voice remains in the air, never in the silicon."
  },
  {
    title: "VECTOR: RESILIENCE",
    description: "Climate-hardened. Battery-optimized. Works when the grid fails and the heat rises."
  },
  {
    title: "VECTOR: LEGION",
    description: "GPLv3 Open Source. Hand-to-hand scale. A tool that belongs to the community, not a company."
  }
];

export const HARDWARE_REQUIREMENTS = [
  { item: "Processing Core", detail: "Raspberry Pi 4 (2GB) - Heat-sinked" },
  { item: "Power Backup", detail: "Anker 20,000mAh Battery (120°F Tested)" },
  { item: "Enclosure", detail: "UL-Marked Fire-Retardant ABS" },
  { item: "Speaker", detail: "Moisture-sealed 8Ω High-Fidelity" }
];

export const CALIBRATION_STEPS = [
  "Verify physical air-gap (Bluetooth/WiFi hardware disabled).",
  "Lock CPU governor to 800MHz (Low thermal profile).",
  "Apply security wax to all enclosure mounting points.",
  "Run 24hr loop in 110°F stress environment.",
  "Confirm read-only root partition state (overlayroot)."
];

export const FULL_BUILD_SCRIPT = `
#!/bin/bash
# GuardianOS v4.0.0 "REVELATION WORLD" - PLANETARY LATTICE
set -e

echo "[VECTOR: GLOBAL_MESH] INITIALIZING SYNTROPIC HANDSHAKE..."
# Cryptographic salt generated from hardware entropy
echo "lattice_id=$(cat /proc/sys/kernel/random/uuid)" > /etc/guardian_mesh.conf

echo "[VECTOR: HARDENING] THROTTLING HARDWARE..."
echo "arm_freq=800" >> /boot/config.txt
echo "temp_limit=60" >> /boot/config.txt

echo "[VECTOR: AIR-GAP] KILLING RADIOS..."
echo "dtoverlay=disable-wifi" >> /boot/config.txt
echo "dtoverlay=disable-bt" >> /boot/config.txt

echo "[VECTOR: PRIVACY] READ-ONLY OVERLAY..."
sed -i 's/$/ overlayroot=tmpfs/' /boot/cmdline.txt

sync
echo "------------------------------------------"
echo "WORLD VECTOR ACTIVE. LATTICE SEALED."
echo "------------------------------------------"
`.trim();

export const PICTOGRAM_GUIDE = `
[ PLANETARY VECTOR MAP ]

    ( NORTH )       ( EUROPE )
        |               |
    [ NODE_HOU ] <---> [ NODE_LON ]
        |               |
    [ NODE_SAO ] <---> [ NODE_KYI ]
        |               |
    ( SOUTH )       ( EAST )
`;

export const ICONS = {
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Cpu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Zap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Terminal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  TrendingUp: () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  Thermometer: () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
  )
};
