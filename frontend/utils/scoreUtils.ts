import { ScoreMessage } from "@/types/analysis";

export const getScoreMessage = (score: number): ScoreMessage => {
  if (score >= 90) return { text: "Excepcional! 🏆", color: "text-green-600" };
  if (score >= 80) return { text: "Excelente! 🌟", color: "text-green-600" };
  if (score >= 70) return { text: "Bom! 👍", color: "text-blue-600" };
  if (score >= 60) return { text: "Ok 👌", color: "text-blue-600" };
  if (score >= 50) return { text: "Regular 📈", color: "text-amber-600" };
  return { text: "Precisa Melhorar 💪", color: "text-red-600" };
};

export const getScoreColor = (score: number): string => {
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#3b82f6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

export const getProgressBarColor = (score: number): string => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-blue-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
};
