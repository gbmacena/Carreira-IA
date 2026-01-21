import { Injectable } from '@nestjs/common';
import { PROMPT_TEMPLATES } from '../config/prompts.config';

@Injectable()
export class PromptBuilderService {
  buildGeneralAnalysisPrompt(
    resumeText: string,
    candidateLevel?: string,
  ): string {
    const levelContext = candidateLevel
      ? PROMPT_TEMPLATES.LEVEL_CONTEXTS[candidateLevel]
      : '';

    const basePrompt = PROMPT_TEMPLATES.BASE_ANALYSIS_PROMPT;

    const promptWithLevel = candidateLevel
      ? basePrompt.replace(
          '🔍 DETECÇÃO DE NÍVEL (estimatedLevel):\nO candidato NÃO informou seu nível. Você deve DETECTAR baseado no currículo:',
          `🔍 NÍVEL FORNECIDO: ${candidateLevel}\nO candidato informou seu nível profissional como ${candidateLevel}. Analise o currículo considerando este nível.`,
        )
      : basePrompt;

    return `${levelContext}

${promptWithLevel}

CURRÍCULO PARA ANÁLISE:
${resumeText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  buildJobSpecificAnalysisPrompt(
    resumeText: string,
    jobDescription: string,
    candidateLevel?: string,
  ): string {
    return this.buildJobMatchAnalysisPrompt(
      resumeText,
      jobDescription,
      candidateLevel,
    );
  }

  buildJobMatchAnalysisPrompt(
    resumeText: string,
    jobDescription: string,
    candidateLevel?: string,
  ): string {
    const levelContext = candidateLevel
      ? PROMPT_TEMPLATES.LEVEL_CONTEXTS[candidateLevel]
      : '';

    return `${levelContext}

${PROMPT_TEMPLATES.JOB_MATCH_PROMPT}

━━━━━ CRITÉRIOS DE AVALIAÇÃO (escala 0-100) ━━━━━

🎨 FORMATAÇÃO (${candidateLevel ? this.getWeightDescription(candidateLevel, 'formatacao') : '10%'}):
- Layout profissional e organizado
- Compatibilidade com sistemas ATS
- Estrutura adequada para a área/vaga

💬 CLAREZA (${candidateLevel ? this.getWeightDescription(candidateLevel, 'clareza') : '20%'}):
- Alinhamento com linguagem da vaga
- Clareza na comunicação de experiências relevantes
- Facilidade de identificar match com requisitos

💼 EXPERIÊNCIA PROFISSIONAL (${candidateLevel ? this.getWeightDescription(candidateLevel, 'experiencia') : '25%'}):
- Match com experiências solicitadas na vaga
- Nível de senioridade adequado
- Experiências em contextos similares

🔧 HABILIDADES TÉCNICAS (${candidateLevel ? this.getWeightDescription(candidateLevel, 'habilidades') : '20%'}):
- Cobertura dos requisitos técnicos obrigatórios  
- Presença dos requisitos desejáveis
- Keywords relevantes presentes

📈 IMPACTO E RESULTADOS (${candidateLevel ? this.getWeightDescription(candidateLevel, 'impacto') : '25%'}):
- Resultados alinhados com expectativas da vaga
- Experiências com impacto similar ao esperado
- Potencial de entrega value para o contexto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIÇÃO DA VAGA:
${jobDescription}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CURRÍCULO DO CANDIDATO:
${resumeText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  private getWeightDescription(level: string, criterion: string): string {
    const weights = {
      ESTAGIO: {
        formatacao: '20%',
        clareza: '25%',
        experiencia: '5%',
        habilidades: '30%',
        impacto: '20%',
      },
      JUNIOR: {
        formatacao: '12%',
        clareza: '18%',
        experiencia: '25%',
        habilidades: '25%',
        impacto: '20%',
      },
      PLENO: {
        formatacao: '8%',
        clareza: '12%',
        experiencia: '35%',
        habilidades: '15%',
        impacto: '30%',
      },
      SENIOR: {
        formatacao: '5%',
        clareza: '10%',
        experiencia: '45%',
        habilidades: '10%',
        impacto: '30%',
      },
    };

    return weights[level]?.[criterion] || '0%';
  }
}
