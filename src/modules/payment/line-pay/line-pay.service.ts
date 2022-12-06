import { SharedService } from "@/src/shared/shared.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as firebase from 'firebase-admin';
import * as serviceAccount from './firebaseServiceAccount.json';

const firebaseAdmin = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
};

@Injectable()
export class LinePayService {
  defaultApp: any;
  database: any;

  constructor(
    private configService: ConfigService,
    private sharedService: SharedService,
  ) {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseAdmin),
      databaseURL: "https://line-pay-97bf3-default-rtdb.asia-southeast1.firebasedatabase.app/",
    });
    this.database = this.defaultApp.database();
  }

  headerLinePay() {
    return {
      "X-LINE-ChannelId": this.configService.get("LINE_CHANNEL_ID"),
      "X-LINE-ChannelSecret": this.configService.get("LINE_CHANNEL_SECRET"),
      "Content-Type": "application/json",
    };
  }

  saveTx(orderId: string, object) {
    object["lastActionDate"] = Date.now();
    let txRef = this.database.ref("/transactions/" + orderId);
    return txRef.update(object);
  }

  getOrderInfo(orderId: string) {
    return new Promise((resolve, reject) => {
      let list = [];
      let txRef = this.database.ref("/transactions/" + orderId);
      txRef.once("value", (snapshot) => {
        list.push(snapshot.val());
        if (list.length > 0) {
          resolve(list[0]);
        } else {
          reject();
        }
      });
    });
  }

  async reservePaymentServer(req) {
    let { productName, amount, orderId } = req.body;
    let url = `${this.configService.get("LINE_PAY_API_URL")}/v2/payments/request`;
    let payload = {
      productImageUrl:
        "https://obs.line-scdn.net/0hnL15US6nMWMMTBu52_ZONDAJPw57YjcrdHh3BiwcbVclKSIxMCsrUn5POAAmLH5mMyt_VnlJbAEn",
      productName,
      amount,
      orderId,
      currency: "THB",
      confirmUrl: `${this.configService.get("LINE_PAY_API_URL")}/confirmPaymentServer`,
      langCd: "th",
      confirmUrlType: "SERVER",
    };
    let headers = this.headerLinePay();
    let response: any = await this.sharedService.postToAxios(url, payload, headers);
    if (response && response.returnCode === '0000' && response.info) {
      const data = req.body;
      const transactionId = response.info.transactionId;
      data.transactionId = transactionId;
      // saveTx(orderId, data);
    }
    return response;
  }

  async reservePaymentClient(req?, res?) {
    let { productName, amount, orderId } = req.body;
    let url = `${this.configService.get("LINE_PAY_API_URL")}/v2/payments/request`;
    let payload = {
      productImageUrl: 'https://obs.line-scdn.net/0hnL15US6nMWMMTBu52_ZONDAJPw57YjcrdHh3BiwcbVclKSIxMCsrUn5POAAmLH5mMyt_VnlJbAEn',
      productName,
      amount,
      orderId,
      currency: 'THB',
      confirmUrl: `${"config.webUrl"}/thankyou`,
      langCd: 'th',
      confirmUrlType: 'CLIENT',
    };
    let headers = this.headerLinePay();
    let response: any = await this.sharedService.postToAxios(url, payload, headers);
    if (response && response.returnCode === '0000' && response.info) {
      const data = req.body;
      const transactionId = response.info.transactionId;
      data.transactionId = transactionId;
      // saveTx(orderId, data);
    }
    return;
  }

  async confirmPaymentServer(req?, res?) {
    console.log('confirmPaymentServer query :', JSON.stringify(req.query));
    let { transactionId, orderId } = req.query;
    let url = `${this.configService.get("LINE_PAY_API_URL")}/v2/payments/${transactionId}/confirm`;
  }

  async confirmPaymentClient(req?, res?) {

  }

}
