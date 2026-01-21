import { AnalysisData } from "@/types/analysis";
import {
  AlertCircle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface LevelDiscrepancyProps {
  analysis: AnalysisData;
}

const LEVEL_ORDER = {
  ESTAGIO: 1,
  JUNIOR: 2,
  PLENO: 3,
  SENIOR: 4,
};

export const LevelDiscrepancyAlert = ({ analysis }: LevelDiscrepancyProps) => {
  if (!analysis.candidateLevel || !analysis.estimatedLevel) {
    return null;
  }

  const chosenLevel = analysis.candidateLevel;
  const detectedLevel = analysis.estimatedLevel;

  const chosenOrder = LEVEL_ORDER[chosenLevel as keyof typeof LEVEL_ORDER] || 0;
  const detectedOrder =
    LEVEL_ORDER[detectedLevel as keyof typeof LEVEL_ORDER] || 0;

  const difference = detectedOrder - chosenOrder;

  if (difference === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800">Auto-avaliação Precisa</p>
          <p className="text-sm text-green-700">
            Sua avaliação está alinhada com o que a IA detectou. Você tem uma
            visão realista do seu nível!
          </p>
        </div>
      </div>
    );
  }

  if (difference < 0) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <TrendingDown className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-800">
            Você se avaliou como {chosenLevel}, mas a IA detectou{" "}
            {detectedLevel}
          </p>
          <p className="text-sm text-orange-700 mt-2">
            Isso pode indicar que você está se superestimando. Não é problema!
            Use isso como motivação para estudar e alcançar o nível desejado.
          </p>
          <ul className="text-sm text-orange-700 mt-2 list-disc list-inside space-y-1">
            <li>Analise as áreas de fraqueza detectadas</li>
            <li>Desenvolva projetos que demonstrem o nível almejado</li>
            <li>Refaça a análise em 3-6 meses</li>
          </ul>
        </div>
      </div>
    );
  }

  if (difference > 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800">
            Excelente! A IA detectou {detectedLevel}, você escolheu{" "}
            {chosenLevel}
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Seu currículo demonstra ser mais sênior do que você acreditava! Você
            pode estar deixando dinheiro na mesa nas negociações.
          </p>
          <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
            <li>Considere se reposicionar profissionalmente</li>
            <li>Use esses insights em negociações salariais</li>
            <li>Busque oportunidades mais desafiadoras</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};
