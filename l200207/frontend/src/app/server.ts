// tslint:disable class-name
// tslint:disable prefer-const
// tslint:disable no-var-keyword
// tslint:disable no-shadowed-variable
// tslint:disable no-unused-expression
// tslint:disable max-line-length
// tslint:disable whitespace
export class server {
  //constructor() { this.http = AppModule.injector.get(HttpHeaderResponse)}
  callUrl = async (data2Post, next) => {
    $.ajax({
      type: "post",
      url: 'http://localhost/phpfuns.php',
      crossDomain:true,
      xhrFields: {
        withCredentials: true, 
      },
      data: data2Post,
      success: (res, status) => {
        var idxFailure = res.indexOf("failure");
        var idxSuccess = res.indexOf("success");
        var responsedecode;
        var requestdecode;
        (idxFailure > -1) ? next({ record: "wrong credentials", mode: "recordissue", other: "" }) : "";
        (idxSuccess === -1) ? "" : "";
        this.responseJsonconvertor({ response: res, success: idxSuccess }, res => { responsedecode = res; });
        this.requestJsonconvertor(data2Post.data, res => { requestdecode = res; });
        var responseobject = { record: responsedecode, mode: data2Post.mode.toLowerCase(), other: { mode: data2Post.mode, data: requestdecode } };
        next(responseobject);
      },
      cache: false,
      error: (error) => { console.log(error);next({ record: "Connection Fail With Server", mode: "serverissue", other: "" }); },
    });
  }
  responseJsonconvertor = async (data, next) => { (data.success !== -1) ? next(JSON.parse(data.response.substr(data.success + 7))) : ""; }; // responseDecode
  requestJsonconvertor = async (data, next) => { (data !== undefined) ? next(JSON.parse(data)) : ""; };
}