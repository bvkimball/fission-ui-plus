import { Module } from '@nestjs/common';

import { ApiModule } from './modules/api/api.module';
import { StaticModule } from './modules/static/static.module';
import { FunctionModule } from './modules/functions/function.module';
import { TriggerModule } from './modules/triggers/trigger.module';
import { EnvironmentModule } from './modules/environments/environment.module';
import { TestingModule } from './modules/testing/testing.module';
import { EventsGateway } from './events.gateway.';

@Module({
  imports: [ApiModule, FunctionModule, TriggerModule, EnvironmentModule, TestingModule, StaticModule],
  controllers: [],
  components: [EventsGateway]
})
export class ServerModule {}
