import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ThailandpostTrackingModule } from "./modules/tracking/thailandpost-tracking/thailandpost-tracking.module";
import { SharedModule } from "./shared/shared.module";
import { ConfigModule } from "@nestjs/config";
import { LineHelperModule } from "./modules/line/line-helper/line-helper.module";
import { KerryexpressModule } from "./modules/tracking/kerryexpress/kerryexpress.module";
import { LinePayModule } from "./modules/payment/line-pay/line-pay.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.cwd()}/src/config/env/.env.${process.env.NODE_ENV}`,
      ],
      isGlobal: true,
      cache: true,
    }),
    ThailandpostTrackingModule,
    SharedModule,
    LineHelperModule,
    KerryexpressModule,
    LinePayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
