import { Controller, Post, Req } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { LinePayService } from "./line-pay.service";
import { Request } from "express";

@Controller("line-pay")
export class LinePayController {
  constructor(private readonly linePayService: LinePayService) { }

  @Post("/reservePaymentServer")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async reservePaymentServer(@Req() req: Request) {
    return await this.linePayService.reservePaymentServer(req?.body);
  }

  @Post("/reservePaymentClient")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async reservePaymentClient(@Req() req: Request) {
    return await this.linePayService.reservePaymentClient(req?.body);
  }

  @Post("/confirmPaymentServer")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async confirmPaymentServer(@Req() req: Request) {
    return await this.linePayService.confirmPaymentServer(req?.body);
  }

  @Post("/confirmPaymentClient")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async confirmPaymentClient(@Req() req: Request) {
    return await this.linePayService.confirmPaymentClient(req?.body);
  }
}
