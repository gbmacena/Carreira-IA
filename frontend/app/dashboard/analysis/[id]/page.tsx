"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { useAnalysisDetail } from "@/hooks/useAnalysisDetail";

import { AnalysisHeader } from "@/components/Analysis/AnalysisHeader";
import {
  ProcessingState,
  FailedState,
} from "@/components/Analysis/AnalysisStates";
import { OverallScore, ATSScore } from "@/components/Analysis/ScoresSummary";
import { DetailedScores } from "@/components/Analysis/DetailedScores";
import { ToggleDetailsButton } from "@/components/Analysis/ToggleDetailsButton";
import { DetailedAnalysis } from "@/components/Analysis/DetailedAnalysis";
import { LevelDiscrepancyAlert } from "@/components/Analysis/LevelDiscrepancyAlert";

export default function AnalysisDetailPage() {
  const params = useParams();
  const {
    analysis,
    loading,
    showDetails,
    setShowDetails,
    isProcessing,
    isCompleted,
    isFailed,
  } = useAnalysisDetail(params.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando análise...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Análise não encontrada</p>
            <Link href="/dashboard">
              <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Voltar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <AnalysisHeader
          analysis={analysis}
          isProcessing={isProcessing}
          isCompleted={isCompleted}
          isFailed={isFailed}
        />

        {/* Processing State */}
        {isProcessing && <ProcessingState />}

        {/* Failed State */}
        {isFailed && <FailedState analysis={analysis} />}

        {/* Completed Analysis */}
        {isCompleted && (
          <>
            <OverallScore analysis={analysis} />
            <LevelDiscrepancyAlert analysis={analysis} />
            <ATSScore analysis={analysis} />
            <DetailedScores analysis={analysis} />

            <ToggleDetailsButton
              showDetails={showDetails}
              onToggle={() => setShowDetails(!showDetails)}
            />

            {showDetails && <DetailedAnalysis analysis={analysis} />}
          </>
        )}
      </div>
    </div>
  );
}
