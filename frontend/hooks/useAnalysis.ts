import { useState, useEffect, useCallback, useRef } from "react";
import { Analysis } from "@/types";
import { API_CONFIG, ANALYSIS_STATUS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export function useAnalysis() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/analysis/history");
      setAnalyses(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const deleteAnalysis = async (analysisId: string) => {
    try {
      await api.delete(`/analysis/${analysisId}`);
      await loadHistory();
    } catch (err: any) {
      console.error("Erro ao deletar análise:", err);
      throw err;
    }
  };

  useEffect(() => {
    const hasPendingAnalyses = analyses.some(
      (a) =>
        a.status === ANALYSIS_STATUS.PENDING ||
        a.status === ANALYSIS_STATUS.PROCESSING,
    );

    // Limpar interval existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Criar novo interval apenas se houver análises pendentes
    if (hasPendingAnalyses) {
      intervalRef.current = setInterval(() => {
        loadHistory();
      }, API_CONFIG.POLLING_INTERVAL);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [analyses, loadHistory]);

  return {
    analyses,
    loading,
    loadHistory,
    deleteAnalysis,
  };
}
