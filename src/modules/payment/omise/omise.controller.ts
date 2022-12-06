import { Controller, Get } from "@nestjs/common";
import { OmiseService } from "./omise.service";

@Controller("omise")
export class OmiseController {
  constructor(private readonly omiseService: OmiseService) { }

  @Get("/checkout-promptpay")
  async omiseCheckoutPromptpay() {
    return await this.omiseService.createSourceAndPaymentTransaction();
  }
}
