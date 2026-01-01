
export enum ComplianceCategory {
  COPPA = "COPPA Compliance",
  GDPR = "GDPR Article 9",
  HARDWARE = "Hardware Safety",
  ETHICS = "Ethical Deployment",
  DISPOSAL = "Secure Disposal",
  AUDIT = "Auditable Design",
  LICENSING = "Nonprofit Licensing",
  FAILSAFE = "Fail-Safe Design",
  CLINICAL = "Clinical Protocol",
  TEXAS_REGULATORY = "Texas State Code",
  THERMAL = "Thermal Resilience",
  SYNTROPIC = "Syntropic Coherence"
}

export enum DeploymentSite {
  HOUSTON_HUB = "Houston Hub",
  LONDON_REACH = "London Reach",
  KYIV_CORE = "Kyiv Core",
  NAIROBI_NODE = "Nairobi Node",
  SYDNEY_LINK = "Sydney Link",
  GLOBAL = "Universal Seed"
}

export interface ChecklistItem {
  id: string;
  category: ComplianceCategory;
  site: DeploymentSite;
  label: string;
  description: string;
  status: 'pending' | 'completed' | 'critical';
  requirement: 'mandatory' | 'recommended';
}

export interface LanguagePack {
  code: string;
  name: string;
  status: 'verified' | 'pending';
  checksum: string;
  note?: string;
}

export interface GlobalNode {
  id: string;
  name: string;
  coords: [number, number]; // [x, y] for SVG mapping
  status: 'active' | 'latent' | 'pulsing';
  coherence: number;
}
