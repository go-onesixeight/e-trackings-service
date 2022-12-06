import { Module } from '@nestjs/common';
import { OmiseService } from './omise.service';
import { OmiseController } from './omise.controller';
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [OmiseController],
  providers: [OmiseService]
})
export class OmiseModule { }
