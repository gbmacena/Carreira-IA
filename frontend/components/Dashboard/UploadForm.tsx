import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CANDIDATE_LEVELS } from "@/constants";
import { useFileUpload } from "@/hooks/useFileUpload";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const {
    formData,
    loading,
    error,
    handleFileChange,
    updateFormData,
    submitUpload,
  } = useFileUpload(onUploadSuccess);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitUpload();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          Upload de Currículo
        </CardTitle>
        <CardDescription>
          Envie seu currículo em PDF para análise com IA
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-sm font-medium">
              Arquivo PDF
            </Label>
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="cursor-pointer h-11 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            {formData.file && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                {formData.file.name}
              </p>
            )}
          </div>

          {/* Candidate Level Select */}
          <div className="space-y-2">
            <Label htmlFor="candidateLevel" className="text-sm font-medium">
              Seu Nível de Experiência *
            </Label>
            <select
              id="candidateLevel"
              value={formData.candidateLevel || ""}
              onChange={(e) =>
                updateFormData({ candidateLevel: e.target.value })
              }
              required
              className="w-full h-11 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">-- Selecione seu nível --</option>
              {CANDIDATE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-500">
            Informar seu nível ajuda a IA a avaliar de forma mais justa -
            júniors não serão penalizados por ter 1 ano de experiência
          </p>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-sm font-medium">
              Descrição da Vaga (Opcional)
            </Label>
            <Textarea
              id="jobDescription"
              placeholder="Cole a descrição da vaga aqui para uma análise comparativa..."
              value={formData.jobDescription}
              onChange={(e) =>
                updateFormData({ jobDescription: e.target.value })
              }
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Adicionar uma descrição de vaga gera análise de compatibilidade e
              score ATS
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            disabled={loading || !formData.file}
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? "Enviando..." : "Enviar para Análise"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
