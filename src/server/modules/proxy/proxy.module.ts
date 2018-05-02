import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Module({
  components: [ProxyService],
  exports: [ProxyService]
})
export class ProxyModule {}
