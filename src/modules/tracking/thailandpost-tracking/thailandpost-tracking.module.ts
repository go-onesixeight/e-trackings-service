import { Module } from "@nestjs/common";
import { ThailandpostTrackingService } from "./thailandpost-tracking.service";
import { ThailandpostTrackingController } from "./thailandpost-tracking.controller";
import { SharedModule } from "@/src/shared/shared.module";
import { HttpModule } from "@nestjs/axios";
import { LineHelperModule } from "../../line/line-helper/line-helper.module";

@Module({
  imports: [
    SharedModule,
    HttpModule,
    LineHelperModule,
  ],
  controllers: [ThailandpostTrackingController],
  providers: [ThailandpostTrackingService],
})
export class ThailandpostTrackingModule { }
