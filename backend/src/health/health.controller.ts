import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verifica o status do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço está operacional.' })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Resume Analysis API',
    };
  }
}
