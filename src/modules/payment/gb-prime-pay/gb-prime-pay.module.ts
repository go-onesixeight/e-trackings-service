import { Module } from '@nestjs/common';
import { GbPrimePayService } from './gb-prime-pay.service';
import { GbPrimePayController } from './gb-prime-pay.controller';

@Module({
  controllers: [GbPrimePayController],
  providers: [GbPrimePayService]
})
export class GbPrimePayModule {}
