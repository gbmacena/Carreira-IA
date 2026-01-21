export interface User {
  id: string;
  name: string;
  email: string;
}

export * from "./analysis";

export type AnalysisStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type CandidateLevel = "ESTAGIO" | "JUNIOR" | "PLENO" | "SENIOR";

export interface UploadFormData {
  file: File | null;
  jobDescription: string;
  candidateLevel: string;
}

export interface AuthContextData {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export type { AnalysisData as Analysis } from "./analysis";
