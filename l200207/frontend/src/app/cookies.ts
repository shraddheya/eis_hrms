import { CookieService } from "ngx-cookie-service";
var resdata;
export class session_cookies {
  cookiesdata = new sessionsend(CookieService)
  setCookiesData=async(data,next)=>{
    resdata = data
  }
}
export class sessionsend{
  constructor(cookiesSession){
    console.log(cookiesSession)
  }
}