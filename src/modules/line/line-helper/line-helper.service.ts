import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as line from '@line/bot-sdk';
import { IRequestLineEvent } from './interfaces/request-line-event.interface';
import { SharedService } from '@/src/shared/shared.service';
import * as crypto from "crypto";
import { Request } from 'express';

@Injectable()
export class LineHelperService {
  client: line.Client;

  constructor(
    private configService: ConfigService,
    private sharedService: SharedService,
  ) {
    this.client = new line.Client({
      channelAccessToken: this.configService.get("LINE_CHANNEL_ACCESSTOKEN"),
      channelSecret: this.configService.get("LINE_CHANNEL_SECRET"),
    });
    line.middleware({
      channelAccessToken: configService.get("LINE_CHANNEL_ACCESSTOKEN"),
      channelSecret: configService.get("LINE_CHANNEL_SECRET"),
    });
  }

  async handleEvent(event: IRequestLineEvent["events"][0], payload: any) {
    switch (event.type) {
      case 'message':
        const message = event.message;
        switch (message.type) {
          case 'text':
            return await this.handleText(message, event, payload);
          case 'image':
            return this.handleImage(message, event);
          case 'video':
            return this.handleVideo(message, event);
          case 'audio':
            return this.handleAudio(message, event);
          case 'location':
            return this.handleLocation(message, event);
          case 'sticker':
            return this.handleSticker(message, event);
          default:
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
        }

      case 'follow':
        const profile = await this.client.getProfile(event.source.userId);
        const followText = `สวัสดีคุณ ${profile.displayName} ยินดีต้อนรับครับ`;
        return this.client.replyMessage(event.replyToken, { type: 'text', text: followText });

      case 'unfollow':
        return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

      case 'join':
        const joinText = `Joined ${event.source.type}`;
        return this.client.replyMessage(event.replyToken, { type: 'text', text: joinText });

      case 'leave':
        return console.log(`Left: ${JSON.stringify(event)}`);

      case 'postback':
        let data = `event.postback.data`;
        const postbackText = `Got postback: ${data}`;
        return this.client.replyMessage(event.replyToken, { type: 'text', text: postbackText });

      case 'beacon':
        const dm = `${Buffer.from(`event.beacon.dm` || '', 'hex').toString('utf8')}`;
        const beaconText = `${`event.beacon.type`} beacon hwid : ${`event.beacon.hwid`} with device message = ${dm}`;
        return this.client.replyMessage(event.replyToken, { type: 'text', text: beaconText });

      default:
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  }

  async handleText(message, event: IRequestLineEvent["events"][0], payload) {
    return await this.client.replyMessage(event.replyToken, { ...payload });
  }

  handleImage(message, event: IRequestLineEvent["events"][0]) {
    return this.client.replyMessage(event.replyToken, { type: 'text', text: 'Got Image' });
  }

  handleVideo(message, event: IRequestLineEvent["events"][0]) {
    return this.client.replyMessage(event.replyToken, { type: 'text', text: 'Got Video' });
  }

  handleAudio(message, event: IRequestLineEvent["events"][0]) {
    return this.client.replyMessage(event.replyToken, { type: 'text', text: 'Got Audio' });
  }

  handleLocation(message, event: IRequestLineEvent["events"][0]) {
    return this.client.replyMessage(event.replyToken, { type: 'text', text: 'Got Location' });
  }

  handleSticker(message, event: IRequestLineEvent["events"][0]) {
    return this.client.replyMessage(event.replyToken, { type: 'text', text: 'Got Sticker' });
  }

  flexMessage(altText: string, content: any) {
    return {
      type: "flex",
      altText: altText || "สถานะการส่งของ",
      contents: { ...content },
    }
  }

  verifySignature(req: Request): boolean {
    const text = JSON.stringify(req?.body);
    const signature = crypto
      .createHmac("SHA256", this.configService.get("LINE_CHANNEL_SECRET"))
      .update(text)
      .digest("base64")
      .toString();
    if (signature !== req?.headers["x-line-signature"]) {
      return false;
    } else {
      return true;
    }
  }

  async reply(replyToken: string, payload: any) {
    const request = {
      replyToken: replyToken,
      messages: [payload],
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.configService.get("LINE_CHANNEL_ACCESSTOKEN"),
    };
    const url = this.configService.get("LINE_MESSAGE_API_URL") + "reply";
    await this.sharedService.postToAxios(url, request, headers);
  }

}
