export interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type CandidateLevel = 'ESTAGIO' | 'JUNIOR' | 'PLENO' | 'SENIOR';
