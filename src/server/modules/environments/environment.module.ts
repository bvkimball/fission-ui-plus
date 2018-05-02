import { Module } from '@nestjs/common';
import { EnvironmentController } from './environment.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [EnvironmentController]
})
export class EnvironmentModule {}
