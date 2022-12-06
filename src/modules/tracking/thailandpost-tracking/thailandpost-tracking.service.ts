import { Injectable } from "@nestjs/common";
import { IThailandPostTokenResponse } from "./interfaces/thailandpost-token.interface";
import { ConfigService } from "@nestjs/config";
import { IRequestLineEvent } from "../../line/line-helper/interfaces/request-line-event.interface";
import { IThailandReponse, IThailandReponseItems } from "./interfaces/thailandpost-response.interface";
import { LineHelperService } from "../../line/line-helper/line-helper.service";
import { SharedService } from "@/src/shared/shared.service";
import { Request } from 'express';
import moment from 'moment';

@Injectable()
export class ThailandpostTrackingService {
  constructor(
    private configService: ConfigService,
    private sharedService: SharedService,
    private lineHelperService: LineHelperService,
  ) { }

  async getTokenTrackThailandPost(): Promise<IThailandPostTokenResponse> {
    let response: IThailandPostTokenResponse | any;
    const url = this.configService.get("THAILANDPOST_URL") + "authenticate/token";
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + this.configService.get("THAILANDPOST_TOKEN"),
    };
    response = await this.sharedService.postToAxios(url, {}, headers);
    return response;
  }

  async getItemsbyBarcode(trackingNumber: string): Promise<IThailandReponse> {
    let response: IThailandReponse | any;;
    const authToken = await this.getTokenTrackThailandPost();
    const url = this.configService.get("THAILANDPOST_URL") + "track";
    const request = {
      status: "all",
      language: "TH",
      barcode: [trackingNumber],
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + authToken?.token,
    };
    response = await this.sharedService.postToAxios(url, request, headers);
    return response;
  }

  async sendTrackAndTraceEMSThailandPost(req: Request) {
    let payload = {};
    const { events, destination } = req?.body as IRequestLineEvent;

    try {
      const verify = this.lineHelperService.verifySignature(req);
      if (!verify) {
        throw new Error("Unauthorized").message;
      }

      if (this.sharedService.isEmptyArray(events)) {
        payload = this.sendFlexMessageTrackingNotFound();
        return await this.lineHelperService.handleEvent(events[0], payload);
      }

      return await Promise.all(events.map(async (m) => {
        const resultTrack: IThailandReponse = await this.getItemsbyBarcode(m.message?.text);
        const items = resultTrack?.response?.items[m.message?.text];

        if (this.sharedService.isEmptyArray(items)) {
          payload = this.sendFlexMessageTrackingNotFound();
        } else {
          const payloadBody = this.sentFlexMessageTransitTrackingBody(items);
          const payloadFooter = this.sentFlexMessageTransitTrackingFooter(items?.reverse()[0]?.signature ?? " ");
          payload = this.sentFlexMessageTransitTrackingHeader(m.message?.text, payloadBody, payloadFooter);
        }

        return await this.lineHelperService.handleEvent(m, payload);
      })).then((res) => {
        return ("Successfully to get the data from LINE ,Please return to LINE App to see the TrackAndTraceEMSThailandPost result");
      }).catch(async (err) => {
        payload = this.sendFlexMessageTrackingCatch(err);
        return await this.lineHelperService.handleEvent(events[0], payload);
      });
    } catch (error) {
      payload = this.sendFlexMessageTrackingCatch(error);
      return await this.lineHelperService.handleEvent(events[0], payload);
    }
  }

  sentFlexMessageTransitTrackingHeader(trackingNumber: string, body: any, footer: any) {
    const contents = {
      "type": "bubble",
      "size": "mega",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": trackingNumber,
                "color": "#ffffff",
                "size": "xl",
                "flex": 4,
                "weight": "bold"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "ติดตามพัสดุ",
                "color": "#ffffff66",
                "size": "sm"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "ไปรษณีย์ไทย",
                "color": "#ffffff",
                "size": "xl",
                "flex": 4,
                "weight": "bold"
              }
            ]
          }
        ],
        "paddingAll": "20px",
        "backgroundColor": "#0367D3",
        "spacing": "md",
        "height": "120px",
        "paddingTop": "22px"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": body,
      },
      "footer": footer,
      "styles": {
        "footer": {
          "backgroundColor": "#0367D3",
          "separator": true,
          "separatorColor": "#0367D3"
        }
      }
    };
    const altText = `ติดตามพัสดุสถานะการส่งของ หมายเลขพัสดุ: ${trackingNumber}`;
    return this.lineHelperService.flexMessage(altText, contents);
  }

  sentFlexMessageTransitTrackingBody(details?: IThailandReponseItems) {
    let contentBody = [];
    let reverseDetails = (details?.length > 0) ? [...details].reverse() : details;
    let filterDetails = reverseDetails.filter(item => item?.delivery_status?.toUpperCase().trim() === "S")[0];
    let checkDeliveryStatus = Object.entries(filterDetails).length > 0 ? true : false;

    contentBody.push(
      {
        "type": "text",
        "text": `จาก : ${details[0]?.location ?? " "} - ${reverseDetails[0]?.location ?? " "}`,
        "color": "#b7b7b7",
        "size": "xs",
      },
      {
        ...(checkDeliveryStatus) ?
          {
            "type": "text",
            "text": `ชื่อผู้รับ : ${filterDetails?.receiver_name ?? " "}`,
            "color": "#b7b7b7",
            "size": "xs"
          }
          : {},
      },
      {
        ...(checkDeliveryStatus) ?
          {
            "type": "text",
            "text": `สถานะ : ${filterDetails?.delivery_description ?? " "}`,
            "color": "#b7b7b7",
            "size": "xs"
          }
          : {},
      }
    );

    for (let detail of reverseDetails) {
      let statusDate = (detail?.status_date.length === 25) ? detail.status_date.substring(0, 10) : detail?.status_date.substring(0, 9) ?? detail.status_date;
      let dateDetail = (detail?.status_date.length === 25) ? detail.status_date.substring(11, 16) : detail?.status_date.substring(10, 15) ?? detail.status_date;
      let contentTimeLine = {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "filler"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [],
                "cornerRadius": "30px",
                "height": "12px",
                "width": "12px",
                "borderColor": "#27E10A",
                "borderWidth": "2px",
                "margin": "none",
                "spacing": "none"
              },
              {
                "type": "filler"
              }
            ],
            "flex": 0
          },
          {
            "type": "text",
            "text": `${statusDate}`,
            "gravity": "center",
            "flex": 4,
            "size": "sm"
          }
        ],
        "spacing": "lg",
        "cornerRadius": "30px",
        "margin": "xl"
      };
      let contentTimeLineDetail = {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "filler"
              }
            ],
            "flex": 0
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "filler"
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [],
                    "width": "2px",
                    "backgroundColor": "#B7B7B7"
                  },
                  {
                    "type": "filler"
                  }
                ],
                "flex": 1
              }
            ],
            "width": "12px"
          },
          {
            "type": "text",
            "text": `${dateDetail} อยู่ที่ ${detail?.location ?? " "} ${detail?.status_description ?? " "}`,
            "gravity": "center",
            "size": "xs",
            "color": "#8c8c8c",
            "margin": "lg",
            "flex": 4
          },
        ],
        "spacing": "none",
        "height": "69px",
        "flex": 0,
        "margin": "none"
      };
      contentBody.push({ ...contentTimeLine }, { ...contentTimeLineDetail });
    };
    return contentBody;
  }

  sentFlexMessageTransitTrackingFooter(signatureUrl: string) {
    return {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "image",
          "url": signatureUrl,
          "margin": "sm",
          "size": "xs",
          "align": "center",
          "flex": 0,
          "gravity": "center"
        }
      ],
      "backgroundColor": "#FFFFFF",
      "height": "75px",
      "spacing": "none",
      "margin": "none",
    };
  }

  sendFlexMessageTrackingNotFound() {
    return {
      type: "text",
      text: "กรุณาตรวจสอบความถูกต้องของหมายเลขติดตามสิ่งของ",
    };
  }

  sendFlexMessageTrackingCatch(e: any) {
    return {
      type: "text",
      text: `ติดตามสถานะสิ่งของไม่สมบูรณ์ ด้วยเหตุผลต่อไปนี้ ${e?.message ?? " "}`,
    };
  }

  trackHeader(barcode: string, body: any) {
    return {
      type: "flex",
      altText: "สถานะการส่งของ",
      contents: {
        type: "bubble",
        size: "giga",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `เลขพัสดุ ${barcode}`,
              decoration: "none",
              size: "xl",
              weight: "bold",
            },
            {
              type: "box",
              layout: "vertical",
              contents: body,
              spacing: "sm",
              margin: "md",
            },
          ],
        },
      },
    };
  }

  trackBody(detail) {
    let bgcolor: string = detail?.status === "501" ? "#58F746" : detail?.status === "201" ? "#F9F90C" : "#EEEEEE";
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `${detail?.status_date.replace("+07:00", "")}`,
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `${detail.status_description}`,
                  size: "sm",
                },
              ],
              spacing: "none",
              margin: "md",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `${detail.location}`,
                  size: "sm",
                },
                {
                  type: "text",
                  text: `${detail.postcode}`,
                  size: "sm",
                },
              ],
              spacing: "none",
              margin: "md",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: (detail?.status === "501") ? `ผู้รับ คุณ ${detail?.receiver_name}` : " ",
                  size: "sm",
                },
              ],
              spacing: "none",
              margin: "md",
            },
          ],
        },
      ],
      backgroundColor: `${bgcolor}`,
      cornerRadius: "md",
      paddingAll: "10px",
    };
  }
}
