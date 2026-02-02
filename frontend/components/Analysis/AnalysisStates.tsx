import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalysisData } from "@/types/analysis";

export const ProcessingState = () => {
  return (
    <Card className="mb-6 border-0 shadow-xl bg-yellow-50">
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-700 text-lg font-medium">
            Processando sua análise...
          </p>
          <p className="text-gray-600 mt-2">
            Isso pode levar alguns minutos. Você pode sair e voltar depois.
          </p>
          <Link href="/dashboard">
            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

interface FailedStateProps {
  analysis?: AnalysisData;
}

export const FailedState = ({ analysis }: FailedStateProps) => {
  let errorMessage =
    analysis?.errorMessage ||
    "Houve um erro ao processar sua análise. Tente novamente.";

  try {
    const errorObj = JSON.parse(errorMessage);
    if (errorObj.error) {
      errorMessage =
        errorObj.error.message || errorObj.error.code || errorMessage;
    }
  } catch {}

  errorMessage = errorMessage.replace(/[{}"\[\]]/g, "").substring(0, 200);

  let errorTitle = "Falha no processamento";
  let errorDetails = errorMessage;

  if (
    errorMessage.includes("Limite") ||
    errorMessage.includes("limite") ||
    errorMessage.includes("token") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("autenticação") ||
    errorMessage.includes("API") ||
    errorMessage.includes("free tier")
  ) {
    errorTitle = "🎯 Limite temporário atingido";
    errorDetails =
      "As análises com IA atingiram o limite diário (free tier). As APIs resetam automaticamente às 00h. Tente novamente amanhã! 🚀";
  } else if (errorMessage.includes("PDF") || errorMessage.includes("arquivo")) {
    errorTitle = "Erro ao processar o arquivo";
    errorDetails =
      "O arquivo enviado não pôde ser processado. Certifique-se de que é um PDF válido e tente novamente.";
  } else if (
    errorMessage.includes("conexão") ||
    errorMessage.includes("network") ||
    errorMessage.includes("timeout")
  ) {
    errorTitle = "Erro de conexão";
    errorDetails =
      "Houve um problema de conexão com o serviço de IA (pode ser cold start do servidor). Aguarde alguns instantes e tente novamente.";
  }

  return (
    <Card className="mb-6 border-0 shadow-xl bg-red-50 border-l-4 border-l-red-500">
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-700 text-lg font-medium mb-2">{errorTitle}</p>
          <p className="text-gray-700 mt-2 px-4">{errorDetails}</p>
          <Link href="/dashboard">
            <Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
