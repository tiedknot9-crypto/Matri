export type Tier = 'Standard' | 'Premium' | 'Elite';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export const PRICING_MATRIX: Record<Tier, Record<Tier, number>> = {
  Standard: {
    Standard: 20,
    Premium: 35,
    Elite: 200 // Assumed based on pattern
  },
  Premium: {
    Standard: 35,
    Premium: 50,
    Elite: 300
  },
  Elite: {
    Standard: 200,
    Premium: 300,
    Elite: 500
  }
};

export const getPricing = (tier1: Tier, tier2: Tier): number => {
  return PRICING_MATRIX[tier1][tier2];
};

export interface UserProfile {
  id: string;
  loginId?: string; // Users can set their own custom login ID
  name: string;
  surname: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  tier: Tier;
  photoUrl: string;
  education: string[]; // List of degrees/qualifications
  jobs?: string[]; // List of professions/positions
  internships?: string[]; // List of internships
  educationDetails?: EducationDetail[];
  jobDetails?: JobDetail[];
  internshipDetails?: InternshipDetail[];
  job: string; // Primary profession (legacy/display)
  location: string;
  religion: string;
  caste: string;
  subCaste?: string;
  gotra: string;
  height: string;
  income: string;
  netWorth: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  familyBackground: string;
  fatherJob: string;
  motherJob: string;
  siblings: string;
  familyDetails: string;
  hasDisability: string; // "None" or details
  createdBy: string; // created and managed by
  phone: string;
  email: string;
  documents: {
    photo: string;
    aadhaar: string;
    pan: string;
    dl: string;
    passport: string;
  };
  approvalStatus: ApprovalStatus;
  loginReady: boolean;
  isManager?: boolean; // If true, shows manager badge
  preferences?: MatchingPreferences;
  password?: string;
  registeredAt: string;
  isSuspended?: boolean;
  suspensionReason?: string;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  adminResponse?: string;
  timestamp: string;
}

export interface Manager {
  id: string; // Login ID
  name: string;
  password?: string;
  createdAt: string;
}

export interface EducationDetail {
  degree: string;
  institution: string;
  year: string;
}

export interface JobDetail {
  title: string;
  company: string;
  duration: string;
}

export interface InternshipDetail {
  role: string;
  organization: string;
  duration: string;
}

export interface MatchingPreferences {
  job: number; // 0-100 weight
  education: number;
  income: number;
  familyBackground: number;
  horoscope: number;
}

export const DEFAULT_PREFERENCES: MatchingPreferences = {
  job: 20,
  education: 20,
  income: 20,
  familyBackground: 20,
  horoscope: 20,
};

export interface AdminSettings {
  logoUrl: string;
  castes: string[];
  religions: string[];
  categories: string[];
  gotras: string[];
  qualifications: string[];
  graduations: string[];
  postGraduations: string[];
  diplomas: string[];
  certifications: string[];
  hobbies: string[];
  jobs: string[];
  states: string[];
  incomeRanges: string[];
  netWorthRanges: string[];
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const DEFAULT_SETTINGS: AdminSettings = {
  logoUrl: '',
  castes: ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Other'],
  religions: ['Hindu', 'Sikh', 'Jain', 'Buddhist', 'Muslim', 'Christian'],
  categories: ['General', 'OBC', 'SC', 'ST'],
  gotras: ['Kashyap', 'Bharadwaj', 'Vatsa', 'Kaushik'],
  qualifications: ['Bachelors', 'Masters', 'Doctorate', 'Diploma', 'Certification'],
  graduations: ['B.Tech', 'B.Sc', 'B.Com', 'B.A', 'B.E', 'B.B.A', 'B.C.A', 'B.Arch', 'MBBS', 'B.Ed'],
  postGraduations: ['M.Tech', 'M.Sc', 'M.Com', 'M.A', 'M.E', 'M.B.A', 'M.C.A', 'M.Arch', 'MD', 'M.Ed', 'PhD'],
  diplomas: ['Polytechnic', 'PG Diploma', 'Diploma in IT', 'Diploma in Nursing'],
  certifications: ['CA', 'CS', 'CFA', 'CPA', 'Skill Certification'],
  hobbies: ['Reading', 'Traveling', 'Music', 'Cooking', 'Sports'],
  jobs: ['Software Engineer', 'Doctor', 'Teacher', 'Business', 'Manager', 'Other', 'Architect', 'Engineer', 'Government Job'],
  states: INDIAN_STATES,
  incomeRanges: ['< 5 LPA', '5 - 10 LPA', '10 - 25 LPA', '25 - 50 LPA', '50 LPA - 1 Cr', '> 1 Cr'],
  netWorthRanges: ['< 1 Cr', '1 - 5 Cr', '5 - 20 Cr', '20 - 100 Cr', '> 100 Cr'],
  termsAndConditions: 'Default Terms and Conditions content...',
  privacyPolicy: 'Default Privacy Policy content...',
  refundPolicy: 'Default Refund Policy content...',
};

export interface Transaction {
  id: string;
  userId: string;
  type: 'Recharge' | 'Debit';
  amount: number;
  description: string;
  timestamp: string;
}

export interface Wallet {
  userId: string;
  balance: number;
}

