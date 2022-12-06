import { Module } from '@nestjs/common';
import { KerryexpressService } from './kerryexpress.service';
import { KerryexpressController } from './kerryexpress.controller';
import { SharedModule } from '@/src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [KerryexpressController],
  providers: [KerryexpressService]
})
export class KerryexpressModule { }
