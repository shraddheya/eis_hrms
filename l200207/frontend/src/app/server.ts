export class server {
  callUrl = async (data2Post, next) => {
    $.ajax({
      type: "post",
      //url: "http://DESKTOP-4T5LA3J/hrm-angular+php/phpfuns.php",
      url: "http://localhost/phpfuns.php",
      data: data2Post,
      success: (res, status, data) => {
        var idxFailure = res.indexOf("failure")
        var idxSuccess = res.indexOf("success")
        var responsedecode, requestdecode;
        (idxFailure > -1) ?next({ record: "wrong credentials", mode: "recordissue", other: "" }) : "";
        (idxSuccess === -1) ? "" : "";
        this.responseJsonconvertor({ response: res, success: idxSuccess }, res => { responsedecode = res })
        this.requestJsonconvertor(data2Post.data, res => {requestdecode = res; })
        var responseobject = { record: responsedecode, mode: data2Post.mode.toLowerCase(), other: { mode: data2Post.mode, data: requestdecode } }
        next(responseobject);
      },
      error: (error) => {next({ record: "Connection Fail With Server", mode: "serverissue", other: "" }) }
    })
  }
  responseJsonconvertor = async (data, next) => { (data.success != -1) ? next(JSON.parse(data.response.substr(data.success + 7))) : "" } //responseDecode
  requestJsonconvertor = async (data, next) => { (data != undefined) ? next(JSON.parse(data)) : "" }
}
