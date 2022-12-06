import { SharedService } from "@/src/shared/shared.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OmiseService {
  constructor(
    private configService: ConfigService,
    private sharedService: SharedService,
  ) { }

  async createSourceAndPaymentTransaction() {
    let url = this.configService.get("OMISE_URL") + "/charges";
    let payload = {
      amount: "2000",
      currency: "THB",
      "source[type]": "promptpay",
    };
    let headers = {
      Authorization: "Basic " + this.configService.get("OMISE_SECRET_KEY"),
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const result = await this.sharedService.postToAxios(url, payload, headers);
    console.log("createSourceAndPaymentTransaction :", result)
    return result;
  }

  async updatechargesPaymentCodeMarkAsPaid() {
    let paymentCode = "chrg_test_5u0tm407elvnbk3ejsy";
    let url = `${this.configService.get(
      "OMISE_URL",
    )}/${paymentCode}/mark_as_paid`;
    let headers = {
      Authorization: "Basic " + this.configService.get("OMISE_SECRET_KEY"),
    };
    const result = await this.sharedService.postToAxios(url, {}, headers);
  }

  async updatechargesPaymentCodeMarkAsFailed() {
    let paymentCode = "chrg_test_5u0tm407elvnbk3ejsy";
    let url = `${this.configService.get(
      "OMISE_URL",
    )}/${paymentCode}/mark_as_failed`;
    let headers = {
      Authorization: "Basic " + this.configService.get("OMISE_SECRET_KEY"),
    };
    const result = await this.sharedService.postToAxios(url, {}, headers);
  }
}
