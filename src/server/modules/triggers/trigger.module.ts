import { Module } from '@nestjs/common';
import { TriggerController } from './trigger.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [TriggerController]
})
export class TriggerModule {}
