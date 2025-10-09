// Типы и интерфейсы для работы с лидами

export interface LeadStatus {
  id: number;
  name: string;
  color: string;
  is_default: boolean;
}

export interface LeadManager {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface LeadRow {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email?: string;
  company?: string;
  lead_source?: string;
  status: string;
  assigned_to?: LeadManager;
  uploaded_by: LeadManager;
  created_at: string;
  updated_at: string;
  last_note_date?: string;
}

export interface LeadFilters {
  search: string;
  managerFilter: number | null;
  statusFilter: string[];
  campaignFilter: string[];
  assignedFilter: 'any' | 'assigned' | 'unassigned';
}

export interface StatusOption {
  text: string;
  value: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { text: "New", value: "New" },
  { text: "Ftd", value: "Ftd" },
  { text: "Ftd Na", value: "Ftd Na" },
  { text: "No answer", value: "No answer" },
  { text: "Call again", value: "Call again" },
  { text: "Money Call", value: "Money Call" },
  { text: "Awaiting Deposit", value: "Awaiting Deposit" },
  { text: "Kachin Kachin", value: "Kachin Kachin" },
  { text: "Not interested", value: "Not interested" },
  { text: "Reassign", value: "Reassign" },
  { text: "Risk", value: "Risk" },
  { text: "Number not in service", value: "Number not in service" },
  { text: "Different Person", value: "Different Person" },
  { text: "Wrong number", value: "Wrong number" },
  { text: "No Language", value: "No Language" },
];

export const STATUS_LIST: string[] = [
  'New',
  'Ftd',
  'Ftd Na',
  'No answer',
  'Call again',
  'Money Call',
  'Awaiting Deposit',
  'Kachin Kachin',
  'Not interested',
  'Reassign',
  'Risk',
  'Number not in service',
  'Different Person',
  'Wrong number',
  'No Language'
];

export type StatusColor = 'default' | 'success' | 'info' | 'warning' | 'primary' | 'error' | 'secondary';

