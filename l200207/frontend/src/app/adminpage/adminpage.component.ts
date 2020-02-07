import { Component, OnInit, ɵConsole } from '@angular/core';
import { server } from '../server';
declare var swal: any;
var adminpagedata;
var fakedataRecord = { Posts: [], Documents_accesslevels: [], Accesslevels: [] };
@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements OnInit {
  serverConnection = new server
  exportadminpagedata = fakedataRecord
  exportdefaultdata = { Posts: [], Documents_accesslevels: [], Accesslevels: [] }
  constructor() { }
  ngOnInit() { }
  adminpage(data) { adminpagedata = data } //Set data in global variable adminpagedata
  displayproperty(mode) {
    switch (mode) {
      case 'hideadminpanel':
        $("#adminpagemain").hide();
        $("#Heirarchy_Component").show();
        return;
      case 'hideheirarchycomponent':
        $("#Heirarchy_Component").hide();
        $("#adminpagemain").show();
        adminpagedata["Posts"].forEach(elp => {
          elp["data"] = elp.post;
          delete elp["post"];
        });
        adminpagedata["Documents_accesslevels"].forEach(daccel => {
          daccel["data"] = daccel.name;
          delete daccel["name"];
        })
        adminpagedata["Accesslevels"].forEach(doorel => {
          doorel["data"] = doorel.name;
          delete doorel["name"];
        })
        Object.keys(fakedataRecord).forEach(el => { this.readtoUI(adminpagedata[el], el) })
        return;
    }
  }
  addDatabyadminpanel(mode, extra, key) {
    if (key == "withoutmode") {
      var checkingWith;
      $(".fieldinputData").each((_, el) => {
        if (el.id.substr(4) == mode) {
          if ($(el).val() == "") {
            swal("Please fill " + mode, "", "warning")
          }
          if ($(el).val() != "") {
            var checkmode = fakedataRecord[mode.charAt(0).toUpperCase() + mode.slice(1)], addmode = mode.toUpperCase() + "_ADD";
            (checkmode.length != 0) ? checkmode.forEach(recel => { (recel.data == $(el).val()) ? checkingWith = false : checkingWith = true }) : checkingWith = true;
            (checkingWith == true) ? this.serverConnection.callUrl({ mode: addmode, data: JSON.stringify({ [extra]: $(el).val() }) }, res => { this.responseData(res) }) : swal($(el).val() + " Already exist", "", "info");
            $(el).val("")
          }
        }
      })
    }
    if (key == "withmode") {
      var dataObject = {}, checkdata, finalrequest, reapeatData;
      $(".fieldinputData_withmode").each((_, el) => {
        if ($(el).val() == "") {
          swal(mode + " fields are mandatory", "", "warning")
        }
        if ($(el).val() != "") {
          dataObject[el.id.substr(17)] = $(el).val()
          fakedataRecord["Accesslevels"].forEach(recel => { (recel.data == $(el).val()) ? reapeatData = false : reapeatData = true })
          checkdata = Object.keys(dataObject).length
          $(el).val("")
        }
      });
      (checkdata == 3) ? finalrequest = true : "";
      (finalrequest == true) ? this.serverConnection.callUrl({ mode: "ACCESSLEVELS_ADD", data: JSON.stringify(dataObject) }, res => { this.responseData(res) }) : "";
    }
  }
  removeDataadminpanel(data, mode) {
    var data2post = { mode: mode.toUpperCase() + "_DLT", data: JSON.stringify({ id: data }) }
    this.serverConnection.callUrl(data2post, res => { this.responseData(res) })
  }
  default(mode, key) {
    if (key == "defaultview") {
      $(".defaultsection").each((_, el) => {
        if (mode == el.id.substr(15)) {
          this.adminDefault(mode, res => {
            this.exportdefaultdata[mode] = res;
            $("#" + el.id).show();
            $("#viewmanual_" + el.id.substr(15)).hide();
          })
        }
      })
    }
    if (key == "defaulthide") {
      $(".manualmode").each((_, dhide) => {
        if (mode == dhide.id.substr(11)) {
          $("#" + dhide.id).show();
          $("#defaultsection_" + dhide.id.substr(11)).hide()
        }
      })
    }
  }
  adminDefault = async (data, next) => {
    var object = {
      Accesslevels: [{ name: "HR-CABIN", inid: "12562155", outid: "1256556" }],
      Documents_accesslevels: [{ name: "Pancard" }, { name: "Aadharcard" }, { name: "Passport" }, { name: "Driving licence" }],
      Posts: [{ post: "CFO" }, { post: "CMO" }, { post: "Intern" }, { post: "Manager" }]
    }
    next(object[data])
  }
  defaultAdd(value, key, mode) {
    var servermode = mode.toUpperCase() + "_ADD";
    var sendobj = {}; sendobj[key] = value
    this.serverConnection.callUrl({ mode: servermode, data: JSON.stringify(sendobj) }, res => {
      res.record["data"] = res.record[key]; delete res.record[key]
      $(".defaultsection").each((_, el) => {
        $("#" + el.id).hide(); $("#viewmanual_" + mode).show()
      })
      this.addtoUI(mode, res.record)
      swal(mode + " added by default list", "", "success")
    })
  }
  responseData(response) {
    var convertToArraykey = response.other.mode
    switch (response.mode) {
      case 'recordissue':
        swal(response.record, "", "warning")
        return
      case 'serverissue':
        swal(response.record, "", "error")
        return
      case 'documents_accesslevels_add':
        var objrecord = {}; var arraytoObject
        response.record.forEach(el => { objrecord = el })
        arraytoObject = objrecord
        var key; this.capstoStandard(response.other.mode, "add", res => { key = res })
        arraytoObject["data"] = arraytoObject.name;
        this.addtoUI(key, arraytoObject)
        return
      case 'posts_add':
        var objrecord = {}; var arraytoObject
        response.record.forEach(el => { objrecord = el })
        arraytoObject = objrecord
        var key; this.capstoStandard(response.other.mode, "add", res => { key = res })
        arraytoObject["data"] = arraytoObject.post;
        this.addtoUI(key, arraytoObject)
        return
      case 'accesslevels_add':
        var objrecord = {}; var arraytoObject
        response.record.forEach(el => { objrecord = el })
        arraytoObject = objrecord
        var key; this.capstoStandard(response.other.mode, "add", res => { key = res })
        arraytoObject["data"] = arraytoObject.name; delete arraytoObject["name"]
        this.addtoUI(key, arraytoObject)
        return
      case 'posts_dlt':
        var key; this.capstoStandard(response.other.mode, "dlt", res => { key = res })
        this.deletetoUI(key, response.record.id)
        return
      case 'documents_accesslevels_dlt':
        var key; this.capstoStandard(response.other.mode, "dlt", res => { key = res })
        this.deletetoUI(key, response.record.id)
        return
      case 'accesslevels_dlt':
        var key; this.capstoStandard(response.other.mode, "dlt", res => { key = res })
        this.deletetoUI(key, response.record.id)
        return
    }
  }
  capstoStandard = async (data, check, next) => {
    var modetoLowercase = data.toLowerCase(), modetoReplace;
    (check == "dlt") ? modetoReplace = modetoLowercase.replace("_dlt", "") : modetoReplace = modetoLowercase.replace("_add", "");
    next(modetoReplace.charAt(0).toUpperCase() + modetoReplace.slice(1));
  }
  deletetoUI(key, dltid) {
    var dataname;
    fakedataRecord[key].forEach(el => {
      if (el.id == dltid) {
        dataname = el.data
        for (var i = 0; i < fakedataRecord[key].length; i++) {
          (fakedataRecord[key][i].id == dltid) ? fakedataRecord[key].splice(i, 1) : "";
        }
      }
    })
    swal(dataname + " " + key + " deleted", "", "success")
  }
  addtoUI(key, addrecord) { fakedataRecord[key].push(addrecord) }
  readtoUI(data, mode) { fakedataRecord[mode] = data }
}