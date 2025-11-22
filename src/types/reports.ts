export interface Position {
  id: string;
  title: string;
  department: string;
  applicants: number;
  interviewed: number;
  passed: number;
  failed: number;
  status: 'เปิดรับ' | 'เต็มแล้ว';
}

export interface StageStats {
  applicants: number;
  screening: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}

export interface Efficiency {
  timeToHireAvg: number;
  acceptanceRate: number;
  costPerHire: number;
}

export interface Quality {
  aiFitScoreAvg: number;
  interviewPassRate: number;
  hrSatisfaction: number;
}

export interface MoM {
  current: number;
  mom: number;
}

export interface SourceCost {
  source: string;
  applicants: number;
  hires: number;
  spend: number;
}

export interface Candidate {
  id: string;
  name: string;
  positionId: string;
  positionTitle: string;
  department: string;
  stage: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  aiFitScore?: number;
  interviewScore?: number;
  updatedAt: string;
}

export interface DashboardFilters {
  dateRange?: string;
  department?: string;
  position?: string;
  source?: string;
  stage?: string;
  search?: string;
}

export interface HeadlineStats {
  applicants: MoM;
  openRoles: MoM;
  hiringRate: MoM;
  screeningPassed: MoM;
  interviewed: MoM;
  hired: MoM;
  vacancyRate: MoM;
  applicantsPerOpening: MoM;
}

export interface SpeedMetrics {
  timeToFill: {
    avg: number;
    p50: number;
    p90: number;
    trend: Array<{ week: string; value: number }>;
  };
  timeToHire: {
    avg: number;
    p50: number;
    p90: number;
  };
  applicantsPerOpening: number;
  vacancyRate: number;
}

export interface FunnelMetrics {
  applicationCompletionRate: number;
  yieldRatios: {
    applyToScreen: number;
    screenToSubmitHM: number;
    submitToHMAccept: number;
    firstToFinal: number;
    finalToOffer: number;
    offerToHire: number;
  };
  selectionRatio: number;
}

export interface OfferHireMetrics {
  offerAcceptanceRate: number;
  offerAcceptanceByPosition: Array<{ position: string; rate: number }>;
  offerAcceptanceByChannel: Array<{ channel: string; rate: number }>;
}

export interface SourcingMetrics {
  sourceOfHire: Array<{ source: string; count: number }>;
  channelEffectiveness: Array<{
    channel: string;
    applicationsPerImpression: number;
    ctr: number;
  }>;
  channelCost: Array<{
    channel: string;
    cpa: number;
    cph: number;
    spend: number;
  }>;
}

export interface CostMetrics {
  costPerHire: {
    total: number;
    trend: Array<{ period: string; value: number }>;
    byChannel: Array<{ channel: string; cost: number }>;
  };
  costToOPL: number;
  timeToOPL: number;
  costBreakdown: {
    onboarding: number;
    training: number;
    supervision: number;
    otj: number;
    laborProportion: number;
  };
}

export interface QualityRetentionMetrics {
  firstMonthTurnover: {
    rate: number;
    trend: Array<{ period: string; rate: number }>;
    byDepartment: Array<{ department: string; rate: number }>;
  };
  firstYearTurnover: {
    rate: number;
    trend: Array<{ period: string; rate: number }>;
    byDepartment: Array<{ department: string; rate: number }>;
  };
  firstYearResignation: {
    rate: number;
    byDepartment: Array<{ department: string; rate: number }>;
  };
  satisfaction: {
    hiringManager: number;
    candidateJob: number;
    hiringManagerTrend: Array<{ period: string; score: number }>;
    candidateJobTrend: Array<{ period: string; score: number }>;
  };
}
