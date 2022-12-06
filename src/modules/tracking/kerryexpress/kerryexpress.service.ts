import { SharedService } from "@/src/shared/shared.service";
import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import { data } from "cheerio/lib/api/attributes";

@Injectable()
export class KerryexpressService {
  constructor(private readonly sharedService: SharedService) { }

  async scrapeCheerio() {
    const response = await axios.get("https://www.ninjavan.co/th-th/tracking?id=NVTHVRICHA8VXO7801");

    const html = await response.data;
    const $ = cheerio.load(html);

    const ssd = $(`#___gatsby > #gatsby-focus-wrapper > div[class="styles__StyledLayout-sc-1oykhmm-0 fFBGtC"]`).text();
    // 
    // console.log("ssd ,", $('#gatsby-focus-wrapper > div > main > div[class="kontent-type=container"] > div[class="styles__PaddedContainer-sc-1t7gjzb-0 hYbheF"]').text())
    // console.log($('#gatsby-focus-wrapper > div > main > div > div > div > div > div > div.sc-kpOJdX_dJNxlr').text())

    const data = ($('#gatsby-focus-wrapper > div > main > div > div > div > div > div > div:nth-child(1)').text())
    console.log(data)

    //#gatsby-focus-wrapper > div > main > div > div > div > div > div > div.sc-kpOJdX.dJNxlr

  }
}
