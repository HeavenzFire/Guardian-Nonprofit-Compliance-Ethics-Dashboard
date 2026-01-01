
export enum ComplianceCategory {
  COPPA = "COPPA Compliance",
  GDPR = "GDPR Article 9",
  HARDWARE = "Hardware Safety",
  ETHICS = "Ethical Deployment",
  DISPOSAL = "Secure Disposal",
  AUDIT = "Auditable Design",
  LICENSING = "Nonprofit Licensing"
}

export interface ChecklistItem {
  id: string;
  category: ComplianceCategory;
  label: string;
  description: string;
  status: 'pending' | 'completed' | 'critical';
  requirement: 'mandatory' | 'recommended';
}

export interface HardwareSpec {
  component: string;
  requirement: string;
  notes: string;
}

export interface FieldKitData {
  neverList: string[];
  hardwareSpecs: HardwareSpec[];
  calibrationSteps: string[];
}
