export  async function callUrl (data2Post, next) {
  $.ajax({
    method: 'post',
    url: 'http://localhost/phpfuns.php',
    data: data2Post,
    xhrFields: {
       withCredentials: true
    },
    success: (res, status, data) => {
      next(data);
    },
    error:  (res, status, data) => { }
  });
  //   $.ajax({
  //     type: "post",
  //     url: 'http://localhost/phpfuns.php',
  //     crossDomain:true,
  //     xhrFields: {
  //       withCredentials: true,
  //     },
  //     data: data2Post,
  //     success: (res, status) => {
  //       var idxFailure = res.indexOf("failure");
  //       var idxSuccess = res.indexOf("success");
  //       var responsedecode;
  //       var requestdecode;
  //       (idxFailure > -1) ? next({ record: "wrong credentials", mode: "recordissue", other: "" }) : "";
  //       (idxSuccess === -1) ? "" : "";
  //       this.responseJsonconvertor({ response: res, success: idxSuccess }, res => { responsedecode = res; });
  //       this.requestJsonconvertor(data2Post.data, res => { requestdecode = res; });
  //       var responseobject = { record: responsedecode, mode: data2Post.mode.toLowerCase(), other: { mode: data2Post.mode, data: requestdecode } };
  //       next(responseobject);
  //     },
  //     cache: false,
  //     error: (error) => { console.log(error);next({ record: "Connection Fail With Server", mode: "serverissue", other: "" }); },
  //   });
  // }
  // responseJsonconvertor = async (data, next) => { (data.success !== -1) ? next(JSON.parse(data.response.substr(data.success + 7))) : ""; }; // responseDecode
  // requestJsonconvertor = async (data, next) => { (data !== undefined) ? next(JSON.parse(data)) : ""; };
}
