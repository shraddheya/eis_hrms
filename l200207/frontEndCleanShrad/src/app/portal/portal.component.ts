// tslint:disable: curly
import { Component, OnInit, ViewChild } from '@angular/core';
import { callUrl } from '../ajaxes';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import * as $ from 'jquery';
import 'fullcalendar';

declare var $jit: any;
let rgraph: any;
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {
  @ViewChild('addUsers', { static: true }) addUsers: ModalDirective;
  @ViewChild('hierachyView', { static: true }) hierachyView: ModalDirective;
  graphData: any;
  showTree: any;
  posts: any;
  accesslevels: any;
  users: any;
  adduserBosslist = { show: false }
  adduserAlldetail = { show: false }
  selOfBoss: any;
  selOfPost: any;
  selOfTitle: any;
  selOfPermision: any;
  clickedUserid: any;
  rootUserid: any;
  checkcardRecord: any;
  editabel: any;
  userRecordbody = [
    {
      title: "Crud",
      detail: [{
        name: "edit",
        icon: 'pencil-alt',
        clickFun: (_: any) => { this.clicked('editRecord') },
        style: "nav-link waves-light text-dark h3",
        show: true
      }, {
        name: "view",
        icon: 'eye',
        clickFun: (_: any) => { this.clicked('viewRecord') },
        style: "nav-link waves-light text-dark h3",
        show: false
      }, {
        name: "delete",
        icon: 'trash',
        clickFun: (_: any) => { this.callFunction('deleteRecord') },
        style: "nav-link waves-light text-dark h3",
        show: true
      }]
    }, {
      title: "Buttons",
      detail: [{
        name: "cardbutton",
        icon: 'id-card',
        clickFun: (_: any) => { this.callFunction('cardallot') },
        style: "waves-light rounded mb-0 h3 text-center z-depth-2 bg-dark text-white px-4 py-1",
        show: true
      }, {
        name: "cardimage",
        img: '../../assets/images/cardscan2.gif',
        style: "px-5 py-4",
        show: false
      }, {
        name: "salaryslip",
        title: "0",
        clickFun: (_: any) => { this.callFunction('cardallot') },
        style: "waves-light rounded mb-0 h3 text-center z-depth-2 bg-dark text-white px-4 py-1",
        show: true
      },]
    }];
  userDetails = { data: [{ title: "Basic Detail", detail: [], show: true }, { title: "Permanent Address", detail: [], show: true }, { title: "Corresponding Address", detail: [], show: true }]}
  constructor() { }
  ngOnInit() {
    this.initJIT();
    callUrl({ mode: 'GETINITDATA' }, (resp: any) => {
      resp = JSON.parse(resp)
      this.accesslevels = resp.accesslevels;
      this.posts = resp.posts;
      this.users = resp.users;
      this.createDataTree(this.users);
      localStorage.setItem("checklogin", "true")
    });
  }
  addUserNode2GUI(user, mode, isPermanent = true) {
    switch (mode) {
      case 'addusers':
        this.addUsers.hide();
        this.users.push(user);
        this.createDataTree(this.users);
        break;
      case 'deleteusers':
        this.hierachyView.hide();
        this.users.forEach(function (item, index, object) { (item.id == user.prid) ? object.splice(index, 1) : "" });
        this.createDataTree(this.users);
        break;
      case 'updateuser':
        this.hierachyView.hide();
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id == user.id) {
            this.users.splice(i, 1);
            i--;
          }
        };
        this.users.push(user);
        this.createDataTree(this.users);
        break;
    }
  }
  initJIT() {
    rgraph = new $jit.RGraph({
      injectInto: 'hierarchy',
      background: { CanvasStyles: { strokeStyle: '#ccc' } },
      Navigation: { enable: true, panning: true, zooming: 7 },
      Node: { color: '#FFFFFF' },
      Edge: { color: '#C0C0C0', lineWidth: 1, spline: true },
      onCreateLabel: (domElement, node) => {
        //domElement.innerHTML = node.fname + + (node.mname ? node.mname + ' ' : '') + '  ' + node.lname;
        domElement.innerHTML = node.fname + " " + node.lname;
        domElement.name = 'tooltip';
        domElement.className = 'show';
        const hoverdiv = document.createElement('div');
        hoverdiv.setAttribute('class', 'showuser p-2 bg-white text-dark  border border-dark');
        hoverdiv.style.display = 'none';
        hoverdiv.style.marginLeft = '-6em';
        hoverdiv.style.width = '22em';
        hoverdiv.setAttribute('id', 'info' + domElement.id);
        const hovercontent = document.createElement('div');
        hovercontent.innerHTML = `
            <div id="mainrender"">
              <div class="row" *ngFor="let hoverdata of array">
               <div class="col-2">UserId</div>
               <div class="col-1">:</div>
               <div class="col-9">${node.id}</div>
              </div>
              <div class="row">
               <div class="col-2">Name</div>
               <div class="col-1">:</div>
               <div class="col-9">${node.fname + ' ' + node.lname}</div>
              </div>
              <div class="row">
               <div class="col-2">Contact</div>
               <div class="col-1">:</div>
               <div class="col-9">${node.contactno}</div>
              </div>
              <div class="row">
               <div class="col-2">Email</div>
               <div class="col-1">:</div>
               <div class="col-9">${node.email}</div>
              </div>
            </div>`;
        hoverdiv.append(hovercontent);
        domElement.append(hoverdiv);
        domElement.onclick = _ => { this.hierarchyViewdata(node) }
        domElement.onmouseover = _ => { $('#info' + domElement.id).show() }
        domElement.onmouseout = _ => { $('#info' + domElement.id).hide() }
      },
      onPlaceLabel: (domElement, node) => {
        var style = domElement.style;
        style.display = ''; style.cursor = 'pointer';
        if (node._depth <= 1) {
          style.fontSize = "1.2em";
          style.color = "#FFFFFF";
        } else if (node._depth == 2) {
          style.fontSize = "1.2em";
          style.color = "#FFFFFF";
        } else {
          style.display = 'block';
          style.fontSize = "1.2em";
          style.color = "#FFFFFF";
        }
        var left = parseInt(style.left);
        var w = domElement.offsetWidth;
        style.left = (left - w / 7) + 'px';
      }
    });
  }
  changeIps_addGUIusers(mode) {
    switch (mode) {
      case "usrAdd_post":
        this.selOfBoss = this.users;
        this.selOfTitle = ["Mr", "Mrs", "Ms"];
        this.selOfPermision = [{ name: "All Permission", value: "1" }, { name: "Read, Add, Update", value: "2" }, { name: "Only Read", value: "3" },]
        this.adduserBosslist.show = true;
        return;
      case "usrAdd_boss":
        this.adduserAlldetail.show = true;
        return;
    }
  }
  createDataTree(dataset: any) { // legacy code to convert flat data to hirarechy
    const hashTable = Object.create(null);
    dataset.forEach((aData: any) => hashTable[aData.id] = { ...aData, children: [] });
    const dataTree = [];
    dataset.forEach((aData: any) => {
      (aData.boss) ? hashTable[aData.boss].children.push(hashTable[aData.id]) : dataTree.push(hashTable[aData.id]);
    });
    dataTree.forEach(obj => { this.showTree = obj; });
    console.log(this.showTree)
    this.reloadGraph(this.showTree);
  }
  reloadGraph(d: any = null) {
    if (d === null) d = this.graphData;
    else this.graphData = d;
    rgraph.loadJSON(d);
    rgraph.graph.eachNode((n: any) => {
      const pos = n.getPos();
      pos.setc(-300, -300);
    });
    rgraph.compute('end');
    rgraph.fx.animate({ modes: ['polar'], duration: 2000 });
  }
  hierarchyViewdata(data) {
    this.clickedUserid = data.id;
    this.rootUserid = data.boss;
    this.userRecordbody.forEach(urel => {
      urel.detail.forEach(udel => {
        if (udel.name == "salaryslip") {
          (data.current_salary == undefined) ? udel.title = "0" : udel.title = data.current_salary
        }
      })
    })
    this.userDetails.data.forEach(el => { el.detail = [] })
    this.users[0]["boss"] = data.boss
    this.userDetails.data.forEach(clickel => {
      if (clickel.title == "Basic Detail") {
        clickel.detail.push({ title: "name", record: [{ key: "title", value: data.title }, { key: "fname", value: data.fname }, { key: "mname", value: data.mname }, { key: "lname", value: data.lname },], icon: "user" })
        clickel.detail.push({ title: "contactno", record: [{ key: "contactno", value: data.contactno }], icon: "mobile-alt" })
        clickel.detail.push({ title: "email", record: [{ key: "email", value: data.email }], icon: "envelope" })
      }
      if (clickel.title == "Permanent Address") {
        clickel.detail.push({ title: "address_p_houseno", record: [{ key: "address_p_houseno", value: data.address_p_houseno }], icon: "home" })
        clickel.detail.push({ title: "address_p_area", record: [{ key: "address_p_area", value: data.address_p_area }], icon: "road" })
        clickel.detail.push({ title: "address_p_city", record: [{ key: "address_p_city", value: data.address_p_city }], icon: "city" })
        clickel.detail.push({ title: "address_p_state", record: [{ key: "address_p_state", value: data.address_p_state }], icon: "flag" })
        clickel.detail.push({ title: "address_p_country", record: [{ key: "address_p_country", value: data.address_p_country }], icon: "globe" })
        clickel.detail.push({ title: "address_p_pincode", record: [{ key: "address_p_pincode", value: data.address_p_pincode }], icon: "keyboard" })
      }
      if (clickel.title == "Corresponding Address") {
        clickel.detail.push({ title: "address_c_houseno", record: [{ key: "address_c_houseno", value: data.address_c_houseno }], icon: "home" })
        clickel.detail.push({ title: "address_c_area", record: [{ key: "address_c_area", value: data.address_c_area }], icon: "road" })
        clickel.detail.push({ title: "address_c_city", record: [{ key: "address_c_city", value: data.address_c_city }], icon: "city" })
        clickel.detail.push({ title: "address_c_state", record: [{ key: "address_c_state", value: data.address_c_state }], icon: "flag" })
        clickel.detail.push({ title: "address_c_country", record: [{ key: "address_c_country", value: data.address_c_country }], icon: "globe" })
        clickel.detail.push({ title: "address_c_pincode", record: [{ key: "address_c_pincode", value: data.address_c_pincode }], icon: "keyboard" })
      }
    })
    this.populateCalendarAttendance(data.id)
    this.hierachyView.show();
  }
  clicked(mode) {
    switch (mode) {
      case 'addUser':
        this.addUsers.show();
        this.selOfPost = this.posts
        break;
      case 'dismissAddusermodal':
        this.addUsers.hide();
        break;
      case 'dismissRecordmodal':
        this.hierachyView.hide();
        break;
      case 'editRecord':
        this.userRecordbody.forEach(parel => {
          (parel.title == "Crud") ? parel.detail.forEach(carel => {
            (carel.name == "view") ? carel.show = true : carel.show = false;
            (carel.name == "delete") ? carel.show = true : "";
          }) : "";
        })
        this.editabel = true;
        break;
      case 'viewRecord':
        this.userRecordbody.forEach(parel => {
          (parel.title == "Crud") ? parel.detail.forEach(carel => {
            (carel.name == "edit") ? carel.show = true : carel.show = false;
            (carel.name == "delete") ? carel.show = true : "";
          }) : "";
        })
        this.editabel = false;
        break;
      case 'allotimgLoad':
        this.userRecordbody.forEach(parel => { (parel.title == "Buttons") ? parel.detail.forEach(carel => { (carel.name == "cardimage") ? (this.checkcardRecord.tagid == "") ? carel.show = true : carel.show = false : "" }) : ""; })
        break;
      default:
        break;
    }
  }
  callFunction(mode) {
    var requestObj = JSON.stringify({ tagdata: this.clickedUserid })
    switch (mode) {
      case 'cardallot':
        callUrl({ mode: "CLEARASSOCIATION", data: requestObj }, (resp: any) => {
          (resp == '"success"') ? callUrl({ mode: "GETCARDID", data: requestObj }, (resps: any) => { this.objectToarray(resps, "fromCardallot") }) : "";
        })
        break;
      case 'getcardid':
        if (this.checkcardRecord.tagid == "") callUrl({ mode: "GETCARDID", data: requestObj }, (resp: any) => { this.objectToarray(resp, "fromCardallot") })
        this.clicked("allotimgLoad");
        break;
      case 'deleteRecord':
        callUrl({ mode: "DELETE_USERS", data: JSON.stringify({ prid: this.clickedUserid }) }, (resp: any) => { this.addUserNode2GUI(JSON.parse(resp), "deleteusers") })
        break;
      case 'addusers':
        var userData = {}
        $('.inputusers').each((_, r) => { userData[r.id.substr(7).toLowerCase()] = $(r).val() })
        var i = 0; i++; userData["prid"] = (new Date).getTime() + i - 2678400;
        callUrl({ mode: "REGISTER", data: JSON.stringify(userData) }, (resp: any) => {
          resp = JSON.parse(resp);
          resp["id"] = resp.prid;
          delete resp["prid"];
          this.addUserNode2GUI(resp, "addusers");
        })
        break;
      case 'updateData':
        var updObj = {};
        $(".updatedetail").each((_, el) => { updObj[el.id] = $(el).html() });
        updObj["prid"] = this.clickedUserid;
        updObj["boss"] = this.rootUserid;
        callUrl({ mode: "UPDATE_USERS", data: JSON.stringify(updObj) }, (resp: any) => {
          resp = JSON.parse(resp);
          resp.id = resp.prid;
          delete resp["prid"];
          this.addUserNode2GUI(resp, "updateuser");
        })
        break;
    }
  }
  objectToarray(input, mode) {
    switch (mode) {
      case 'fromCardallot':
        var obj;
        JSON.parse(input).forEach(el => { obj = el })
        this.checkcardRecord = obj;
        this.callFunction("getcardid");
        break;
    }
  }
  populateCalendarAttendance(prid, dataInterest = moment()){
    console.log(prid, dataInterest)
    $('#calendar').fullCalendar({
      defaultDate: moment().format('YYYY-MM-DD'),
      editable: true,
      eventLimit: false,
      viewRender: (view, event) => {
        var moments = $('#calendar').fullCalendar('getDate');
        var data = moments.format();
      }
    })
  }
}