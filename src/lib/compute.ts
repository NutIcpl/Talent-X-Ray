// Recruitment metrics computation functions

export interface Job {
  id: string;
  postedAt: string;
  closedAt?: string;
  hiredAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  source: string;
  startedAt: string;
  submittedAt?: string;
  appliedAt: string;
  stage: string;
}

export interface StageEvent {
  appId: string;
  stage: 'Apply' | 'Screen' | 'SubmitHM' | 'HM_Accept' | 'Interview1' | 'InterviewFinal' | 'Offer' | 'Hired' | 'Rejected';
  at: string;
}

export interface Offer {
  id: string;
  appId: string;
  offeredAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
}

export interface Hire {
  id: string;
  appId: string;
  hiredAt: string;
  startDate: string;
}

export interface Termination {
  id: string;
  hireId: string;
  type: 'Resign' | 'Terminate';
  at: string;
}

export interface ChannelStat {
  channel: string;
  impressions: number;
  spend: number;
}

export interface CostItem {
  kind: 'internal' | 'external' | 'onboarding' | 'training' | 'supervision' | 'otj' | 'laborProportion';
  amount: number;
  period: string;
}

// Speed Metrics
export function timeToFill(job: Job, hire: Hire): number {
  const start = new Date(job.postedAt).getTime();
  const end = new Date(hire.startDate || hire.hiredAt).getTime();
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

export function timeToHire(app: Application, hire: Hire): number {
  const start = new Date(app.appliedAt).getTime();
  const end = new Date(hire.hiredAt).getTime();
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

export function applicantsPerOpening(applications: Application[], jobs: Job[]): number {
  return jobs.length > 0 ? applications.length / jobs.length : 0;
}

export function vacancyRate(openJobs: number, totalJobs: number): number {
  return totalJobs > 0 ? openJobs / totalJobs : 0;
}

// Funnel & Process Metrics
export function applicationCompletionRate(submittedApplications: number, startedApplications: number): number {
  return startedApplications > 0 ? submittedApplications / startedApplications : 0;
}

export function yieldRatio(passed: number, entered: number): number {
  return entered > 0 ? passed / entered : 0;
}

export function selectionRatio(hires: number, candidates: number): number {
  return candidates > 0 ? hires / candidates : 0;
}

// Offer & Hire Metrics
export function offerAcceptanceRate(acceptedOffers: number, totalOffers: number): number {
  return totalOffers > 0 ? acceptedOffers / totalOffers : 0;
}

export function hiringRate(hires: number, offers: number): number {
  return offers > 0 ? hires / offers : 0;
}

// Cost Metrics
export function costPerHire(internalCost: number, externalCost: number, hires: number): number {
  return hires > 0 ? (internalCost + externalCost) / hires : 0;
}

export function channelCPA(spend: number, applications: number): number {
  return applications > 0 ? spend / applications : 0;
}

export function channelCPH(spend: number, hires: number): number {
  return hires > 0 ? spend / hires : 0;
}

export function costToOPL(costs: CostItem[]): number {
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
}

// Quality Metrics
export function turnoverRate(terminations: number, hires: number): number {
  return hires > 0 ? terminations / hires : 0;
}

export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

export function channelEffectiveness(applications: number, impressions: number): {
  applicationsPerImpression: number;
  ctr: number;
} {
  return {
    applicationsPerImpression: impressions > 0 ? applications / impressions : 0,
    ctr: impressions > 0 ? (applications / impressions) * 100 : 0
  };
}
