"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import UploadForm from "@/components/Dashboard/UploadForm";
import AnalysisHistory from "@/components/Dashboard/AnalysisHistory";
import { useAnalysis } from "@/hooks/useAnalysis";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const { analyses, loadHistory, deleteAnalysis } = useAnalysis();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadHistory();
    }
  }, [user, authLoading, router, loadHistory]);

  const handleDeleteAnalysis = async (
    analysisId: string,
    e: React.MouseEvent,
  ) => {
    await deleteAnalysis(analysisId);
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <DashboardHeader user={user} onLogout={logout} />

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl p-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Meu Dashboard
          </h2>
          <p className="text-gray-600">
            Analise seus currículos e acompanhe seu progresso
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <UploadForm onUploadSuccess={loadHistory} />
          <AnalysisHistory
            analyses={analyses}
            onDelete={handleDeleteAnalysis}
          />
        </div>
      </div>
    </div>
  );
}
