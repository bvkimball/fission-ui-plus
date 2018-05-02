import { Module } from '@nestjs/common';
import { FunctionController } from './function.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [FunctionController]
})
export class FunctionModule {}
