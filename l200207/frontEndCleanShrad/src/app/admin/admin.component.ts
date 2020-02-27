import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { callUrl } from '../ajaxes';
import $ from 'jquery';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  adminpagedata: any;
  exportadminpagedata: any;
  constructor(private router: Router) { }

  ngOnInit() {
    callUrl({ mode: "ADMINDASHBOARD" }, (resp: any) => {
      var resp = JSON.parse(resp);
      // console.log(resp)
      // resp.Posts.forEach(postel => { postel["data"] = postel.post });
      // resp.Accesslevels.forEach(dorrel => { dorrel["data"] = dorrel.name });
      // resp.Documents_accesslevels.forEach(docel => { docel["data"] = docel.name });
      this.adminpagedata = resp;
      this.exportadminpagedata = [
        {
          title: "Posts",
          clickFun: (_: any) => { this.showhideDefault('default_show_Posts') },
          icon: "briefcase",
          default: {
            backicon: "backspace",
            addicon: "plus-circle",
            clickFun: (_: any) => { this.showhideDefault('default_hide_Posts') },
            show: false,
            data: {
              clickFun: (_: any) => { this.clicked('hide_defaultdocaccess') },
              record: ["Master"]
            },
          },
          manual: {
            title: "Posts",
            removeicon: "minus-circle",
            show: true,
            data: resp.Posts,
            inputfield: [{ name: "post", clickFun: (_: any) => { this.callFunction('manuallyadd_Posts') }, }]
          },
        },
        {
          title: "Dooraccess",
          icon: "door-open",
          manual: {
            title: "Accesslevels",
            removeicon: "minus-circle",
            show: true,
            data: resp.Accesslevels,
            extra: "",
            inputfield: [
              { name: "name" },
              { name: "inid" },
              { name: "outid", clickFun: (_: any) => { this.callFunction('manuallyadd_Accesslevels') }, }]
          },
        },
        {
          title: "Docaccess",
          clickFun: (_: any) => { this.showhideDefault('default_show_Docaccess') },
          icon: "file-alt",
          default: {
            backicon: "backspace",
            addicon: "plus-circle",
            clickFun: (_: any) => { this.showhideDefault('default_hide_Docaccess') },
            show: false,
            data: {
              clickFun: (_: any) => { this.clicked('hide_defaultdocaccess') },
              record: [],
            },
          },
          manual: {
            removeicon: "minus-circle",
            title: "Documents_accesslevels",
            show: true,
            data: resp.Documents_accesslevels,
            inputfield: [{ name: "name", clickFun: (_: any) => { this.callFunction('manuallyadd_Documents_accesslevels') } }]
          },
        },
      ]
    });
  }

  showhideDefault(mode) {
    this.exportadminpagedata.forEach(el => {
      if (el.title == mode.substr(13)) {
        var makemode = mode.substr(8).replace("_" + el.title, "");
        if (makemode == "show") {
          el.manual.show = false;
          el.default.show = true;
        }
        if (makemode == "hide") {
          el.manual.show = true;
          el.default.show = false;
        }
      }
    })
  }
  clicked(mode) {
    switch (mode) {
      case '':
        return;
    }
  }
  callFunction(mode) {
    var requestMode = mode.substr(12).toUpperCase();
    switch (mode) {
      case 'manuallyadd_Posts':
        var postinput = $("#fid_Posts_post").val()
        if (postinput != "") callUrl({ mode: requestMode + "_ADD", data: JSON.stringify({ post: postinput }) }, (resp: any) => {
          var resp = JSON.parse(resp);
          console.log(resp)
          // resp["data"] = resp.post;
          // console.log(resp)
        })
        return;
      case 'manuallyadd_Accesslevels':
        var sendObj = {};
        ["name", "inid", 'outid'].forEach(el => { sendObj[el] = $("#fid_Accesslevels_" + el).val() })
        Object.values(sendObj).forEach(chkel => {
          (chkel == "") ? "" : "";
        })
        // callUrl({ mode: requestMode, data: JSON.stringify(sendObj) }, (resp: any) => {

        // })
        return;
      case 'manuallyadd_Documents_accesslevels':
        var docinput = $("#fid_Documents_accesslevels_name").val();
        if (postinput != "") callUrl({ mode: requestMode + "_ADD", data: JSON.stringify({ name: docinput })},(resp=>{
          console.log(resp)
        }))
        return;
    }
  }
}