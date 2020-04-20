import $ from 'jquery';
export async function callUrl(data2Post, next) {
  $.ajax({
    async: false,
    method: 'post',
    url: 'http://localhost/phpfuns.php',
    data: data2Post,
    xhrFields: {
      withCredentials: true
    },
    success: (res, status, data) => {
      const idxSuccess = res.indexOf(data2Post.mode + 'success');
      const idxFailure = res.indexOf(data2Post.mode + 'failure');
      if (idxSuccess > -1 || idxFailure > -1) {
        console.log(res);
        next(res.substr(idxSuccess + data2Post.mode.length + 7));
      } else {
      }
    },
    error: (res, status, data) => { console.log(res); }
  });
}

