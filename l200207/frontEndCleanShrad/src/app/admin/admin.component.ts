import { Component, OnInit } from '@angular/core';
import { callUrl } from '../ajaxes';
import $ from 'jquery';
declare var swal: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  adminpagedata: any;
  exportadminpagedata: any;
  constructor() { }

  ngOnInit() {
    callUrl({ mode: 'ADMINDASHBOARD' }, (resp: any) => {
      console.log(resp);
      resp = JSON.parse(resp);
      this.adminpagedata = resp;
      this.exportadminpagedata = [
        {
          title: 'Posts',
          clickFun: (_: any) => { this.showhideDefault('default_show_Posts'); },
          icon: 'briefcase',
          default: {
            title: 'Posts',
            backicon: 'backspace',
            addicon: 'plus-circle',
            clickFun: (_: any) => { this.showhideDefault('default_hide_Posts'); },
            show: false,
            data: {
              record: ['Traniee', 'Intern']
            }
          },
          manual: {
            title: 'Posts',
            removeicon: 'minus-circle',
            show: true,
            data: resp.Posts,
            inputfield: [{ name: 'post', clickFun: (_: any) => { this.callFunction('manuallyadd_Posts'); } }]
          }
        },
        {
          title: 'Dooraccess',
          icon: 'door-open',
          manual: {
            title: 'Accesslevels',
            removeicon: 'minus-circle',
            show: true,
            data: resp.Accesslevels,
            extra: '',
            inputfield: [
              { name: 'name' },
              { name: 'inid' },
              { name: 'outid', clickFun: (_: any) => { this.callFunction('manuallyadd_Accesslevels'); }, }]
          }
        },
        {
          title: 'Docaccess',
          clickFun: (_: any) => { this.showhideDefault('default_show_Docaccess'); },
          icon: 'file-alt',
          default: {
            title: 'Documents_accesslevels',
            backicon: 'backspace',
            addicon: 'plus-circle',
            clickFun: (_: any) => { this.showhideDefault('default_hide_Docaccess'); },
            show: false,
            data: {
              clickFun: (_: any) => { this.clicked('hide_defaultdocaccess'); },
              record: ['Driving Licence'],
            },
          },
          manual: {
            removeicon: 'minus-circle',
            title: 'Documents_accesslevels',
            show: true,
            data: resp.Documents_accesslevels,
            inputfield: [{ name: 'name', clickFun: (_: any) => { this.callFunction('manuallyadd_Documents_accesslevels'); } }]
          },
        },
      ];
    });
  }

  showhideDefault(mode) {
    this.exportadminpagedata.forEach(el => {
      // tslint:disable-next-line: triple-equals
      if (el.title == mode.substr(13)) {
        const makemode = mode.substr(8).replace('_' + el.title, '');
        // tslint:disable-next-line: triple-equals
        if (makemode == 'show') {
          el.manual.show = false;
          el.default.show = true;
        }
        // tslint:disable-next-line: triple-equals
        if (makemode == 'hide') {
          el.manual.show = true;
          el.default.show = false;
        }
      }
    });
  }
  clicked(mode) {
    switch (mode) {
      case '':
        return;
    }
  }

  dynamicMainupulate(data, mode) {
    // tslint:disable-next-line: triple-equals
    if (data.name.slice(0, 3) == 'DLT') {
      callUrl({ mode: mode.toUpperCase() + '_DLT', data: JSON.stringify({ id: data.name.slice(7, data.name.length) }) }, (resp: any) => {
        resp = JSON.parse(resp);
        this.exportadminpagedata.forEach(el => {
          // tslint:disable-next-line: triple-equals
          if (el.manual.title == mode) {
            for (let i = 0; i < el.manual.data.length; i++) {
              // tslint:disable-next-line: triple-equals
              if (el.manual.data[i].id == resp.id) { el.manual.data.splice(i, 1); }
            }
          }
        });
        swal('Record Removed', '', 'success');
      });
    }
    // tslint:disable-next-line: triple-equals
    if (data.name.slice(0, 3) == 'ADD') {
      const sendObj: any = {};
      const input = data.name.substr(9);
      // tslint:disable-next-line: triple-equals
      (mode == 'Posts') ? sendObj.post = input : sendObj.name = input;
      callUrl({ mode: mode.toUpperCase() + '_ADD', data: JSON.stringify(sendObj) }, (resp: any) => {
        let respObj = {};
        JSON.parse(resp).forEach(el => { respObj = el; });
        this.exportadminpagedata.forEach(addel => {
          // tslint:disable-next-line: triple-equals
          if (addel.manual.title == mode) { addel.manual.data.push(respObj); }
        });
        swal('Record Added', '', 'success');
      });
    }
  }
  callFunction(mode) {
    switch (mode) {
      case 'manuallyadd_Posts':
        const postinput = $('#fid_Posts_post');
        // tslint:disable-next-line: triple-equals
        if (postinput.val() != '') {
          callUrl({ mode: 'POSTS_ADD', data: JSON.stringify({ post: postinput.val() }) },
            (resp: any) => {
              let respobj: any = {};
              JSON.parse(resp).forEach(el => { respobj = el; });
              postinput.val('');
              this.exportadminpagedata.forEach(addpel => {
                // tslint:disable-next-line: triple-equals
                if (addpel.title == 'Posts') { addpel.manual.data.push(respobj); }
              });
              // tslint:disable-next-line: quotemark
              swal("Record Added", "", "success");
            });
        }
        return;
      case 'manuallyadd_Accesslevels':
        const sendObj = {};
        ['name', 'inid', 'outid'].forEach(el => { sendObj[el] = $('#fid_Accesslevels_' + el).val(); });
        callUrl({ mode: 'ACCESSLEVELS_ADD', data: JSON.stringify(sendObj) }, (resp: any) => {
          let respobj = {};
          JSON.parse(resp).forEach(el => { respobj = el; });
          ['name', 'inid', 'outid'].forEach(el => { sendObj[el] = $('#fid_Accesslevels_' + el).val(''); });
          this.exportadminpagedata.forEach(addpel => {
            // tslint:disable-next-line: triple-equals
            if (addpel.title == 'Dooraccess') { addpel.manual.data.push(respobj); }
          });
          swal('Record Added', '', 'success');
        });
        return;
      case 'manuallyadd_Documents_accesslevels':
        const docinput = $('#fid_Documents_accesslevels_name');
        // tslint:disable-next-line: triple-equals
        if (docinput.val() != '') {
          callUrl({ mode: 'DOCUMENTS_ACCESSLEVELS_ADD', data: JSON.stringify({ name: docinput.val() }) }, (resp => {
            let respobj = {};
            JSON.parse(resp).forEach(el => { respobj = el; });
            docinput.val('');
            // tslint:disable-next-line: triple-equals
            this.exportadminpagedata.forEach(addpel => { if (addpel.title == 'Docaccess') { addpel.manual.data.push(respobj); } });
            swal('Record Added', '', 'success');
          }));
        }
        return;
    }
  }
}
