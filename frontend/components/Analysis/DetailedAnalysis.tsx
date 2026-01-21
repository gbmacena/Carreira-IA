import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, TrendingUp, XCircle } from "lucide-react";
import { AnalysisData } from "@/types/analysis";

interface DetailedAnalysisProps {
  analysis: AnalysisData;
}

export const DetailedAnalysis = ({ analysis }: DetailedAnalysisProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Summary */}
      {analysis.generalSummary && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle>Resumo da Análise</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {analysis.generalSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <Card className="border-0 shadow-xl border-l-4 border-l-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
        <Card className="border-0 shadow-xl border-l-4 border-l-amber-500">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Pontos de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.weaknesses.map((weakness, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <Card className="border-0 shadow-xl border-l-4 border-l-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sugestões de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Section Feedback */}
      {analysis.sectionFeedback && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle>Feedback por Seção</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {analysis.sectionFeedback.resumoProfissional && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Resumo Profissional
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.sectionFeedback.resumoProfissional}
                </p>
              </div>
            )}
            {analysis.sectionFeedback.experiencias && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Experiências
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.sectionFeedback.experiencias}
                </p>
              </div>
            )}
            {analysis.sectionFeedback.habilidades && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Habilidades
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.sectionFeedback.habilidades}
                </p>
              </div>
            )}
            {analysis.sectionFeedback.organizacaoGeral && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Organização Geral
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.sectionFeedback.organizacaoGeral}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job Match */}
      {analysis.jobMatch && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-indigo-700">
              Análise de Compatibilidade com a Vaga
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.jobMatch.adherencePercentage !== undefined && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  Nível de Aderência
                </h4>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-indigo-600">
                    {analysis.jobMatch.adherencePercentage}%
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-6 rounded-full transition-all duration-1000"
                        style={{
                          width: `${analysis.jobMatch.adherencePercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {analysis.jobMatch.mainGaps &&
              analysis.jobMatch.mainGaps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Principais Gaps
                  </h4>
                  <ul className="space-y-2">
                    {analysis.jobMatch.mainGaps.map((gap, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-3 bg-white rounded-lg"
                      >
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {analysis.jobMatch.missingKeywords &&
              analysis.jobMatch.missingKeywords.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Palavras-chave Ausentes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.jobMatch.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {analysis.jobMatch.suggestions &&
              analysis.jobMatch.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Sugestões para Aumentar Compatibilidade
                  </h4>
                  <ul className="space-y-2">
                    {analysis.jobMatch.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-3 bg-white rounded-lg"
                      >
                        <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
