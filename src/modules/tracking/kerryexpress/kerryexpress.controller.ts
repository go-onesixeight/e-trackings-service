import { Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { KerryexpressService } from './kerryexpress.service';

@Controller('kerryexpress')
export class KerryexpressController {
  constructor(private readonly kerryexpressService: KerryexpressService) { }

  @Post("/ch")
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async getTokenTrackThailandPost() {
    return await this.kerryexpressService.scrapeCheerio();
  }
}
