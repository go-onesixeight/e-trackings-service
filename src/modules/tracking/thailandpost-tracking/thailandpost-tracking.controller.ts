import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import { ThailandpostTrackingService } from './thailandpost-tracking.service';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';

@ApiTags("thailandpost-tracking")
@Controller("thailandpost-tracking")
export class ThailandpostTrackingController {
  constructor(
    private readonly thailandpostTrackingService: ThailandpostTrackingService,
    private readonly httpService: HttpService,
  ) { }

  @Post("/webhook")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async getTokenTrackThailandPost(@Req() req: Request) {
    console.log("req :", JSON.stringify(req?.body))
    return await this.thailandpostTrackingService.sendTrackAndTraceEMSThailandPost(req);
  }
}
