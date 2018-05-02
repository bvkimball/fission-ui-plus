import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [TestingController]
})
export class TestingModule {}
