import { Module } from '@nestjs/common';
import { LineHelperService } from './line-helper.service';
import { LineHelperController } from './line-helper.controller';
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [LineHelperController],
  providers: [LineHelperService],
  exports: [LineHelperService]
})
export class LineHelperModule { }
