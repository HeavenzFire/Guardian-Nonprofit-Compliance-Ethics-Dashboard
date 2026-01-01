
import React from 'react';
import { ComplianceCategory, ChecklistItem, HardwareSpec } from './types';

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'coppa-1',
    category: ComplianceCategory.COPPA,
    label: 'Zero PII Storage',
    description: 'Audit storage firmware to ensure no names, birthdays, or locations are cached. Identifiers must be ephemeral.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'coppa-2',
    category: ComplianceCategory.COPPA,
    label: 'Radio Silence Verification',
    description: 'Wi-Fi/Bluetooth modules must be physically desoldered or verified air-gapped via firmware signature.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'gdpr-1',
    category: ComplianceCategory.GDPR,
    label: 'Article 9 Isolation',
    description: 'Special category biometric features must remain in volatile RAM and be purged instantly after processing.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'hw-1',
    category: ComplianceCategory.HARDWARE,
    label: 'UL/CE Safety Marking',
    description: 'Enclosure must meet non-toxic standards and battery thermal protection for child-proximate placement.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'hw-3',
    category: ComplianceCategory.HARDWARE,
    label: 'Watchdog & Thermal Caps',
    description: 'Hardware watchdog enabled and CPU frequency capped to prevent overheating in enclosed child-safe containers.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'eth-2',
    category: ComplianceCategory.ETHICS,
    label: 'Hardware Kill-Switch',
    description: 'Verification of a physical toggle that interrupts the primary power lead, bypassing all software states.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'disp-1',
    category: ComplianceCategory.DISPOSAL,
    label: 'DoD 5220.22-M Wipe',
    description: 'Pre-installed script for 7-pass random overwrite of all storage sectors before decommissioning.',
    status: 'pending',
    requirement: 'mandatory'
  },
  {
    id: 'audit-1',
    category: ComplianceCategory.AUDIT,
    label: 'Deterministic Firmware',
    description: 'Build hashes must be reproducible from the public repo to verify the absence of hidden backdoors.',
    status: 'pending',
    requirement: 'mandatory'
  }
];

export const CORE_GUARANTEES = [
  {
    title: "NO VOICE STORAGE",
    description: "Audio is analyzed in real-time and discarded immediately. No recordings exist at any point."
  },
  {
    title: "NO NETWORK ACCESS",
    description: "Network interfaces are disabled at hardware level. No data leaves the device."
  },
  {
    title: "NO IDENTIFIERS",
    description: "No MAC address logging. No serial numbers in logs. All logs are anonymous and local-only."
  },
  {
    title: "NO REMOTE CONTROL",
    description: "No backdoors. No remote updates. Physical access required for any change."
  },
  {
    title: "MINIMAL DATA RETENTION",
    description: "Logs automatically delete after 24 hours. No persistent storage beyond system operation."
  }
];

export const HARDWARE_REQUIREMENTS = [
  { item: "Processing Unit", detail: "Raspberry Pi Zero (No-W preferred) / 3B+ / 4" },
  { item: "Acoustic Sensor", detail: "USB Microphone (Omnidirectional)" },
  { item: "Storage", detail: "SD Card (16GB Minimum, Industrial Grade)" },
  { item: "Output", detail: "Speaker or Headphones (Optional)" }
];

export const CALIBRATION_STEPS = [
  "Environment Setup: Stay in the room when quiet. The device needs to know 'normal' sounds.",
  "Run the Probe: Plug it in. Blink Amber = Learning (10 mins).",
  "The Pattern Test: Make a sharp sound. Green = Ready.",
  "Lock the Seal: Once confirmed, place the silver sticker over the SD card slot."
];

export const BUILD_SCRIPT_STEPS = [
  {
    title: "01. Hardware Silence",
    description: "Disables WiFi, BT, and onboard audio in the bootloader. Hard-coded air-gap.",
    code: `# Disable radios and onboard audio\ncat <<EOF | sudo tee -a $BOOT/config.txt\ndtoverlay=disable-wifi\ndtoverlay=disable-bt\ndtparam=audio=off\narm_freq=800\nEOF\n\n# Mask networking services\nsudo ln -sf /dev/null $ROOT/etc/systemd/system/dhcpcd.service`
  },
  {
    title: "02. Read-Only Root",
    description: "Uses tmpfs for volatile writes. Prevents corruption and keeps the system immutable.",
    code: `# Enable overlayroot (tmpfs overlay)\nsudo sed -i 's/$/ overlayroot=tmpfs/' $BOOT/cmdline.txt\n\n# Configure volatile logs\ncat <<EOF | sudo tee $ROOT/etc/fstab\ntmpfs /var/log tmpfs nodev,nosuid,size=10M 0 0\ntmpfs /tmp tmpfs nodev,nosuid,size=5M 0 0\nEOF`
  },
  {
    title: "03. Runtime & Services",
    description: "Installs DSP dependencies and configures the self-starting Guardian service.",
    code: `# Install core offline DSP tools\nsudo systemd-nspawn -D $ROOT apt install -y python3-pyaudio alsa-utils watchdog\n\n# Define auto-starting service\ncat <<EOF | sudo tee $ROOT/etc/systemd/system/guardian.service\n[Service]\nExecStart=/usr/bin/python3 /opt/guardian_os/system/runtime.py\nRestart=always\nProtectSystem=strict\nEOF`
  }
];

export const BOOT_CONFIG = `
# /boot/config.txt (disable network)
dtoverlay=disable-wifi
dtoverlay=disable-bt
dtparam=audio=off
arm_freq=800  # Thermal cap
dtparam=watchdog=on # Hardware watchdog
`.trim();

export const FSTAB_CONFIG = `
# /etc/fstab (read-only mount)
UUID=xxxx / ext4 ro,noatime,nobarrier 0 1
tmpfs /var/log tmpfs nodev,nosuid,size=10M 0 0
tmpfs /tmp tmpfs nodev,nosuid,size=5M 0 0
`.trim();

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
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  FileCode: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  Terminal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  )
};
