"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Sparkles, Target, Zap, BarChart3, Shield, Rocket } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <LoadingSpinner />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            CarreiraAI
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Transforme seu currículo com IA
          </p>

          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Análise profissional instantânea, feedback detalhado e insights
            personalizados para você conquistar a vaga dos seus sonhos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl shadow-purple-200"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
              >
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-28 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Análise Precisa
            </h3>
            <p className="text-gray-600 leading-relaxed">
              IA avançada analisa cada detalhe do seu currículo, identificando
              pontos fortes e oportunidades de melhoria
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Feedback Instantâneo
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Resultados em segundos com recomendações práticas e acionáveis
              para otimizar seu perfil profissional
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-violet-100 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Match com Vagas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compare seu currículo com descrições de vagas reais e descubra seu
              nível de compatibilidade
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              100% Seguro e Confidencial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
