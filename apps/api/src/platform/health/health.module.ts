import { Controller, Get, Module } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/audience.decorator.js';

@ApiTags('platform')
@Controller('health')
class HealthController {
  @Public()
  @Get()
  health() {
    return { status: 'ok', service: 'intuitive-fusion-api', time: new Date().toISOString() };
  }
}

@Module({ controllers: [HealthController] })
export class HealthModule {}
