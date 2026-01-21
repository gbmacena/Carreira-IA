import { useState } from "react";
import { UploadFormData } from "@/types";
import api from "@/lib/api";

export function useFileUpload(onSuccess: () => void) {
  const [formData, setFormData] = useState<UploadFormData>({
    file: null,
    jobDescription: "",
    candidateLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (updates: Partial<UploadFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleFileChange = (file: File | null) => {
    updateFormData({ file });
    setError("");
  };

  const resetForm = () => {
    setFormData({
      file: null,
      jobDescription: "",
      candidateLevel: "",
    });

    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const submitUpload = async () => {
    if (!formData.file) {
      setError("Por favor, selecione um arquivo PDF");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", formData.file);

      if (formData.jobDescription) {
        formDataObj.append("jobDescription", formData.jobDescription);
      }

      if (formData.candidateLevel) {
        formDataObj.append("candidateLevel", formData.candidateLevel);
      }

      await api.post("/upload", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      resetForm();
      onSuccess();
    } catch (err: any) {
      let errorMessage = "Erro desconhecido ao processar upload";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 413) {
        errorMessage = "Arquivo muito grande. Máximo 10MB.";
      } else if (err.response?.status === 400) {
        errorMessage = "Arquivo inválido. Certifique-se que é um PDF válido.";
      } else if (err.response?.status === 503) {
        errorMessage =
          "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
      } else if (err.message === "Network Error") {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleFileChange,
    updateFormData,
    submitUpload,
    resetForm,
  };
}
