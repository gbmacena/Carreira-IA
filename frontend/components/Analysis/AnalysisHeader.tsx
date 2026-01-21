import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { AnalysisData } from "@/types/analysis";

interface AnalysisHeaderProps {
  analysis: AnalysisData;
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}

export const AnalysisHeader = ({
  analysis,
  isProcessing,
  isCompleted,
  isFailed,
}: AnalysisHeaderProps) => {
  return (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4 hover:bg-purple-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </Link>

      <Card className="mb-6 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{analysis.fileName}</CardTitle>
              <CardDescription>
                Analisado em{" "}
                {new Date(analysis.createdAt).toLocaleString("pt-BR")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                  <span className="text-yellow-600 font-medium">
                    Processando...
                  </span>
                </>
              )}
              {isCompleted && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">Concluído</span>
                </>
              )}
              {isFailed && (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-medium">Falhou</span>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
