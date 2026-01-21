import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award } from "lucide-react";
import { AnalysisData } from "@/types/analysis";
import { getScoreMessage } from "@/utils/scoreUtils";

interface OverallScoreProps {
  analysis: AnalysisData;
}

export const OverallScore = ({ analysis }: OverallScoreProps) => {
  const scoreMessage = analysis.overallScore
    ? getScoreMessage(analysis.overallScore)
    : { text: "Sem pontuação", color: "text-gray-600" };

  return (
    <Card className="mb-6 border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Award className="w-6 h-6 text-purple-600" />
          Nota Geral
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-8">
        <div className="text-8xl font-bold text-purple-600 mb-2">
          {analysis.overallScore ? Math.round(analysis.overallScore) : "—"}
        </div>
        <div className="text-lg text-gray-500 mb-4">/ 100 pontos</div>
        <div className={`text-xl font-semibold ${scoreMessage.color}`}>
          {scoreMessage.text}
        </div>

        {/* Níveis */}
        <div className="mt-4 space-y-2">
          {analysis.candidateLevel && (
            <div className="inline-block px-4 py-2 bg-white rounded-full shadow-md mr-2">
              <span className="text-sm text-gray-600">
                Analisado para:{" "}
                <span className="font-semibold text-purple-600">
                  {analysis.candidateLevel}
                </span>
              </span>
            </div>
          )}
          {analysis.estimatedLevel && (
            <div className="inline-block px-4 py-2 bg-green-50 rounded-full shadow-md">
              <span className="text-sm text-gray-600">
                Nível estimado pela IA:{" "}
                <span className="font-semibold text-green-600">
                  {analysis.estimatedLevel}
                </span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ATSScore = ({ analysis }: OverallScoreProps) => {
  if (!analysis.atsScore) return null;

  return (
    <Card className="mb-6 border-0 shadow-xl">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-blue-700">Score ATS</h3>
              <div className="group relative">
                <svg
                  className="w-5 h-5 text-gray-400 cursor-help"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                  <p className="font-semibold mb-2">O que é ATS?</p>
                  <p>
                    ATS (Applicant Tracking System) é um software usado por
                    empresas para filtrar currículos automaticamente. Este score
                    avalia a compatibilidade GERAL do seu currículo,
                    considerando formatação limpa, palavras-chave relevantes,
                    estrutura padronizada e legibilidade para parsing
                    automático.
                  </p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Compatibilidade com sistemas de triagem automática
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">
              {Math.round(analysis.atsScore)}
            </div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>💡 Importante:</strong> Este é um score{" "}
            <strong>bônus</strong> que não afeta sua nota geral. Ele apenas
            indica o quão bem seu currículo passaria por filtros ATS de
            empresas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
