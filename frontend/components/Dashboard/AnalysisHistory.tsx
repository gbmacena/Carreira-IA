import Link from "next/link";
import { FileText, Trash2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Analysis } from "@/types";
import { STATUS_LABELS } from "@/constants";
import StatusIcon from "./StatusIcon";
import { useState } from "react";

interface AnalysisHistoryProps {
  analyses: Analysis[];
  onDelete: (analysisId: string, e: React.MouseEvent) => Promise<void>;
}

export default function AnalysisHistory({
  analyses,
  onDelete,
}: AnalysisHistoryProps) {
  const handleDelete = async (analysisId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Tem certeza que deseja excluir esta análise?")) {
      return;
    }

    await onDelete(analysisId, e);
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Histórico de Análises
        </CardTitle>
        <CardDescription>Suas análises anteriores e status</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {analyses.length === 0 ? (
            <EmptyState />
          ) : (
            analyses.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">Nenhuma análise ainda</p>
      <p className="text-sm text-gray-400 mt-1">
        Faça o upload do seu primeiro currículo
      </p>
    </div>
  );
}

interface AnalysisCardProps {
  analysis: Analysis;
  onDelete: (analysisId: string, e: React.MouseEvent) => Promise<void>;
}

function AnalysisCard({ analysis, onDelete }: AnalysisCardProps) {
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const isFailed = analysis.status === "FAILED";
  const errorMessage = (analysis as any)?.errorMessage;

  return (
    <>
      <Link
        href={`/dashboard/analysis/${analysis.id}`}
        className={`block p-4 border-2 rounded-xl transition-all group ${
          isFailed
            ? "border-red-200 hover:border-red-300 hover:shadow-md bg-red-50"
            : "border-gray-100 hover:border-purple-200 hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText
                className={`w-4 h-4 ${isFailed ? "text-red-500" : "text-purple-500"}`}
              />
              <span
                className={`font-semibold group-hover:transition-colors ${
                  isFailed
                    ? "text-red-700 group-hover:text-red-800"
                    : "text-gray-900 group-hover:text-purple-600"
                }`}
              >
                {analysis.fileName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
                  isFailed ? "bg-red-100" : "bg-gray-50"
                }`}
              >
                <StatusIcon status={analysis.status} className="w-4 h-4" />
                <span className={isFailed ? "text-red-700" : "text-gray-700"}>
                  {STATUS_LABELS[analysis.status]}
                </span>
              </span>
              {isFailed && errorMessage && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowErrorAlert(true);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-200 hover:bg-red-300 transition-colors text-red-800 text-xs font-medium"
                  title="Ver detalhes do erro"
                >
                  <AlertCircle className="w-3 h-3" />
                  Ver erro
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(analysis.createdAt).toLocaleString("pt-BR")}
            </div>
          </div>
          <button
            onClick={(e) => onDelete(analysis.id, e)}
            className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Excluir análise"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Error Alert Modal */}
      {showErrorAlert && errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">
                  Erro ao processar análise
                </h3>
                <p className="text-sm text-red-800 mb-4">{analysis.fileName}</p>
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 max-h-32 overflow-y-auto">
                  <p className="text-xs text-red-700 font-mono break-words">
                    {errorMessage}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowErrorAlert(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Fechar
                  </button>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowErrorAlert(false)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors text-center"
                  >
                    Tentar Novamente
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
