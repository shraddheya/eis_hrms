import $ from 'jquery';
import { environment } from 'src/environments/environment';
export async function callUrl(data2Post, next) {
  $.ajax({
    async: false,
    method: 'post',
   // url: 'http://localhost/phpfuns.php',
    url: environment.production ? 'http://api.hrms.eispowered.com/phpfuns.php' :  'http://localhost/phpfuns.php',
    data: data2Post,
    xhrFields: {
      withCredentials: true
    },
    success: (res, status, data) => {
      const idxSuccess = res.indexOf(data2Post.mode + 'success');
      const idxFailure = res.indexOf(data2Post.mode + 'failure');
      if (idxSuccess > -1 || idxFailure > -1) {
        next(res.substr(idxSuccess + data2Post.mode.length + 7));
      } else {
      }
    },
    error: (res, status, data) => { console.log(res); }
  });
}

