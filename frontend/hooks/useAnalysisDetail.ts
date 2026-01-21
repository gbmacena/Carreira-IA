import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { AnalysisData } from "@/types/analysis";
import { API_CONFIG } from "@/constants";

export const useAnalysisDetail = (analysisId: string | string[]) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  useEffect(() => {
    const isProcessing =
      analysis?.status === "PENDING" || analysis?.status === "PROCESSING";

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isProcessing) {
      intervalRef.current = setInterval(() => {
        fetchAnalysis();
      }, API_CONFIG.POLLING_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [analysis?.status]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get(`/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnalysis(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar análise:", error);

      if (error.response?.status === 401) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const isProcessing =
    analysis?.status === "PENDING" || analysis?.status === "PROCESSING";
  const isCompleted = analysis?.status === "COMPLETED";
  const isFailed = analysis?.status === "FAILED";

  return {
    analysis,
    loading,
    showDetails,
    setShowDetails,
    isProcessing,
    isCompleted,
    isFailed,
    fetchAnalysis,
  };
};
