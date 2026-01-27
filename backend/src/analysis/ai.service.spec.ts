import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { PdfParsingService } from './services/pdf-parsing.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { ScoreCalculationService } from './services/score-calculation.service';
import { GroqApiService } from './services/groq-api.service';

describe('AIService', () => {
  let service: AIService;
  let pdfParsingService: jest.Mocked<PdfParsingService>;
  let promptBuilderService: jest.Mocked<PromptBuilderService>;
  let scoreCalculationService: jest.Mocked<ScoreCalculationService>;
  let groqApiService: jest.Mocked<GroqApiService>;

  beforeEach(async () => {
    const mockPdfParsing = {
      extractTextFromPdf: jest.fn(),
    };
    const mockPromptBuilder = {
      buildGeneralAnalysisPrompt: jest.fn(),
      buildJobSpecificAnalysisPrompt: jest.fn(),
    };
    const mockScoreCalculation = {
      calculateOverallScore: jest.fn(),
    };
    const mockGroqApi = {
      callGroqApi: jest.fn(),
      parseGroqResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: PdfParsingService,
          useValue: mockPdfParsing,
        },
        {
          provide: PromptBuilderService,
          useValue: mockPromptBuilder,
        },
        {
          provide: ScoreCalculationService,
          useValue: mockScoreCalculation,
        },
        {
          provide: GroqApiService,
          useValue: mockGroqApi,
        },
      ],
    }).compile();

    service = module.get<AIService>(AIService);
    pdfParsingService = module.get(PdfParsingService);
    promptBuilderService = module.get(PromptBuilderService);
    scoreCalculationService = module.get(ScoreCalculationService);
    groqApiService = module.get(GroqApiService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeResume', () => {
    it('deve analisar currículo sem descrição de vaga', async () => {
      pdfParsingService.extractTextFromPdf.mockResolvedValue(
        'This is a very long resume text that exceeds 100 characters and should pass the validation check for the AI service analysis functionality. It contains enough content to be considered valid for processing.',
      );
      promptBuilderService.buildGeneralAnalysisPrompt.mockReturnValue('prompt');
      groqApiService.callGroqApi.mockResolvedValue({} as any);
      groqApiService.parseGroqResponse.mockReturnValue({
        scores: {},
        overallScore: 0,
      });
      scoreCalculationService.calculateOverallScore.mockReturnValue(85);

      const result = await service.analyzeResume('/path/to/file.pdf');

      expect(result.overallScore).toBe(85);
      expect(pdfParsingService.extractTextFromPdf).toHaveBeenCalledWith(
        '/path/to/file.pdf',
      );
      expect(
        promptBuilderService.buildGeneralAnalysisPrompt,
      ).toHaveBeenCalled();
      expect(groqApiService.callGroqApi).toHaveBeenCalledWith('prompt');
      expect(groqApiService.parseGroqResponse).toHaveBeenCalledWith({});
      expect(scoreCalculationService.calculateOverallScore).toHaveBeenCalled();
    });

    it('deve analisar currículo com descrição de vaga', async () => {
      pdfParsingService.extractTextFromPdf.mockResolvedValue(
        'This is a very long resume text that exceeds 100 characters and should pass the validation check for the AI service analysis functionality. It contains enough content to be considered valid for processing.',
      );
      promptBuilderService.buildJobSpecificAnalysisPrompt.mockReturnValue(
        'prompt',
      );
      groqApiService.callGroqApi.mockResolvedValue({} as any);
      groqApiService.parseGroqResponse.mockReturnValue({
        scores: {},
        overallScore: 0,
        atsScore: 60,
        jobMatch: { adherencePercentage: 40 },
      });
      scoreCalculationService.calculateOverallScore.mockReturnValue(85);

      const result = await service.analyzeResume(
        '/path/to/file.pdf',
        'JUNIOR',
        'job desc',
      );

      expect(result.overallScore).toBe(85);
      expect(
        promptBuilderService.buildJobSpecificAnalysisPrompt,
      ).toHaveBeenCalled();
    });

    it('deve lançar erro para texto de currículo inválido', async () => {
      pdfParsingService.extractTextFromPdf.mockResolvedValue('short');

      await expect(
        service.analyzeResume('/path/to/file.pdf'),
      ).rejects.toThrow();
    });
  });
});
