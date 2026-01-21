import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { AnalysisData } from "@/types/analysis";
import { ScoreCircle } from "./ScoreCircle";
import { ProgressBar } from "./ProgressBar";

interface DetailedScoresProps {
  analysis: AnalysisData;
}

export const DetailedScores = ({ analysis }: DetailedScoresProps) => {
  if (!analysis.scores) return null;

  const scores = analysis.scores;

  return (
    <Card className="mb-6 border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Avaliação Detalhada por Critério
        </CardTitle>
        <CardDescription>
          Análise objetiva dos principais aspectos do seu currículo
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {scores.formatacao != null && (
            <ScoreCircle score={scores.formatacao} label="Formatação" />
          )}
          {scores.clareza != null && (
            <ScoreCircle score={scores.clareza} label="Clareza" />
          )}
        </div>
        <div className="space-y-4">
          {scores.experiencia != null && (
            <ProgressBar
              score={scores.experiencia}
              label="Experiência Profissional"
            />
          )}
          {scores.habilidades != null && (
            <ProgressBar
              score={scores.habilidades}
              label="Habilidades Técnicas"
            />
          )}
          {scores.impacto != null && (
            <ProgressBar score={scores.impacto} label="Impacto e Resultados" />
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-700">💡 Dica:</strong> A nota geral é
            calculada considerando todos os critérios, com maior peso para
            experiência profissional (25%), clareza (20%) e habilidades (20%).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
