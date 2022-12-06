import { Injectable } from "@nestjs/common";
import axios from "axios";
import { format, register } from "timeago.js";
import { IFromResponses } from "../common/interfaces";

@Injectable()
export class SharedService {
  async postToAxios(
    url: string,
    body?: any,
    configHeader?: any,
  ): Promise<IFromResponses<any>> {
    return new Promise((resolve, reject) => {
      axios.post(url, body, { headers: configHeader }).then(
        (result) => {
          resolve(result?.data);
        },
        async (error) => {
          try {
            reject(error?.response?.data);
          } catch (error) {
            console.log("error : ", error);
            reject(error);
          }
        },
      );
    });
  }

  async getToAxios(
    url: string,
    configHeader?: any,
  ): Promise<IFromResponses<any>> {
    return new Promise((resolve, reject) => {
      axios.get(url, { headers: configHeader }).then(
        (result) => {
          resolve(result?.data);
        },
        async (error) => {
          try {
            reject(error?.response?.data);
          } catch (error) {
            console.log("error : ", error);
            reject(error);
          }
        },
      );
    });
  }

  isNotEmptyArray(data: any[]) {
    return Array.isArray(data) && data.length > 0 ? true : false;
  }

  isNotEmptyObject(obj: Object) {
    return typeof obj === "object" && obj && Object.keys(obj).length > 0
      ? true
      : false;
  }

  isEmptyArray(arrr: any[]) {
    return !arrr.length && arrr.length === 0 ? true : false;
  }

  formatTimeago(date: string) {
    const localeFunc = (number: number, index: number): [string, string] => {
      return [
        ["เมื่อสักครู่นี้", "อีกสักครู่"],
        ["%s วินาทีที่แล้ว", "ใน %s วินาที"],
        ["1 นาทีที่แล้ว", "ใน 1 นาที"],
        ["%s นาทีที่แล้ว", "ใน %s นาที"],
        ["1 ชั่วโมงที่แล้ว", "ใน 1 ชั่วโมง"],
        ["%s ชั่วโมงที่แล้ว", "ใน %s ชั่วโมง"],
        ["1 วันที่แล้ว", "ใน 1 วัน"],
        ["%s วันที่แล้ว", "ใน %s วัน"],
        ["1 อาทิตย์ที่แล้ว", "ใน 1 อาทิตย์"],
        ["%s อาทิตย์ที่แล้ว", "ใน %s อาทิตย์"],
        ["1 เดือนที่แล้ว", "ใน 1 เดือน"],
        ["%s เดือนที่แล้ว", "ใน %s เดือน"],
        ["1 ปีที่แล้ว", "ใน 1 ปี"],
        ["%s ปีที่แล้ว", "ใน %s ปี"],
      ][index] as [string, string];
    };
    register("my-locale", localeFunc);
    return format(date, "my-locale");
  }
}
