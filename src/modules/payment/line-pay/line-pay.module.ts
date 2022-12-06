import { Module } from '@nestjs/common';
import { LinePayService } from './line-pay.service';
import { LinePayController } from './line-pay.controller';
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [LinePayController],
  providers: [LinePayService]
})
export class LinePayModule { }
