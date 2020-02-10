import { FrontpageComponent } from "src/app/frontpage/frontpage.component";
import { CookieService } from "ngx-cookie-service";
export class CookiesGetSet {
  loginData;
  getCookiesData(data) {
    this.loginData = data
  }
  // checkcookiesData = async (param, next) => {
  //   var status
  //   (this.loginData == undefined) ? status = false : status = this.loginData;
  //   next(status)
  // }
}