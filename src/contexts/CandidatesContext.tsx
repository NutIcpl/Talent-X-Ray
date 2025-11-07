import { createContext, useContext, useState, ReactNode } from "react";

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: "screening" | "interview" | "shortlisted" | "interested" | "not_interested";
  applicationDate?: string;
  appliedDate: string;
  experience: string;
  skills: string[];
  score: number;
  resumeFile?: string;
  coverLetter?: string;
  pipelineStatus?: string;
  location?: string;
  education?: string;
  summary?: string;
  previousCompany?: string;
  testScores?: {
    hrTest?: number;
    departmentTest?: number;
  };
  interviews?: any;
}

interface CandidatesContextType {
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, "id" | "applicationDate" | "status" | "score" | "appliedDate">) => void;
  updateCandidate: (id: number, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: number) => void;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    phone: "081-234-5678",
    position: "Senior Software Engineer",
    status: "shortlisted",
    applicationDate: "2024-03-15",
    appliedDate: "2 วันที่แล้ว",
    experience: "5 ปี",
    skills: ["React", "TypeScript", "Node.js"],
    score: 92,
    pipelineStatus: "interview_1",
    location: "กรุงเทพมหานคร",
    education: "ปริญญาตรี วิทยาการคอมพิวเตอร์",
    summary: "มีประสบการณ์ในการพัฒนา Web Application ด้วย React และ Node.js มากกว่า 5 ปี",
    previousCompany: "Tech Solutions Co.",
  },
  {
    id: 2,
    name: "สมหญิง รักงาน",
    email: "somying@example.com",
    phone: "082-345-6789",
    position: "Product Manager",
    status: "interested",
    applicationDate: "2024-03-14",
    appliedDate: "1 วันที่แล้ว",
    experience: "7 ปี",
    skills: ["Product Strategy", "Agile", "Data Analysis"],
    score: 88,
    pipelineStatus: "interview_2",
    location: "กรุงเทพมหานคร",
    education: "ปริญญาโท MBA",
  },
  {
    id: 3,
    name: "ประเสริฐ สร้างสรรค์",
    email: "prasert@example.com",
    phone: "083-456-7890",
    position: "UX/UI Designer",
    status: "screening",
    applicationDate: "2024-03-13",
    appliedDate: "3 วันที่แล้ว",
    experience: "3 ปี",
    skills: ["Figma", "Adobe XD", "User Research"],
    score: 85,
    pipelineStatus: "pre_screening",
    location: "นนทบุรี",
    education: "ปริญญาตรี การออกแบบนิเทศศิลป์",
  },
];

export const CandidatesProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  const addCandidate = (candidateData: Omit<Candidate, "id" | "applicationDate" | "status" | "score" | "appliedDate">) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: Math.max(0, ...candidates.map(c => c.id)) + 1,
      applicationDate: new Date().toISOString().split('T')[0],
      appliedDate: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: "screening",
      pipelineStatus: "pre_screening",
      score: Math.floor(Math.random() * 20) + 70, // Random score between 70-90
    };
    setCandidates([newCandidate, ...candidates]);
  };

  const updateCandidate = (id: number, updates: Partial<Candidate>) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, ...updates } : candidate
    ));
  };

  const deleteCandidate = (id: number) => {
    setCandidates(candidates.filter(candidate => candidate.id !== id));
  };

  return (
    <CandidatesContext.Provider value={{ candidates, addCandidate, updateCandidate, deleteCandidate }}>
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidates = () => {
  const context = useContext(CandidatesContext);
  if (context === undefined) {
    throw new Error("useCandidates must be used within a CandidatesProvider");
  }
  return context;
};
