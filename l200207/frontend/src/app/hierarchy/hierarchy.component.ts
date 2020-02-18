import { Component, Injectable,OnInit,AfterViewInit ,ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CookieService } from "ngx-cookie-service";
declare var $jit: any
import 'src/assets/fakedataarray.js';
import * as moment from 'moment';
import * as $ from 'jquery';
import 'fullcalendar';
import { AdminpageComponent } from '../adminpage/adminpage.component';
import { PaymentComponent } from "../payment/payment.component";
import { server } from '../server';
import { LoginComponent } from '../login/login.component';
import { AppModule } from '../app.module';
import { parse } from 'querystring';
declare var swal: any
declare var require: any
var selPost, hierarchytree,globssid_tree ,domAngular, rgraph, notificationlist, sal_info, total_gross, total_extra, versionmodecheck,
  versionmode, attendance = [], adminpermision, usrprid;
@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
  private myservice;
  constructor(){
    this.myservice = AppModule.injector.get(CookieService)
  }
  imgname = require("src/assets/images/main.png");
  message;
  @ViewChild('addUsers', { static: true }) addUsers: ModalDirective;
  @ViewChild('hierachyView', { static: true }) hierachyView: ModalDirective;
  @ViewChild('salaryslip', { static: true }) salaryslip: ModalDirective;
  @ViewChild('setting', { static: true }) setting: ModalDirective;
  AdminpageObject = new AdminpageComponent;
  PaymentObject = new PaymentComponent();
  serverConnection = new server;
  fileData: File = null;
  previewUrl: any = null;
  profilepicture = this.imgname;
  selOfPermision = [{ name: "All Permission", value: 1 }, { name: "Add,Update,Read", value: 2 }, { name: "Only Read", value: 3 }]
  selOfTitle = ["MR", "Mrs", "Ms", "Miss", "Mx"];
  usersalaryslipRecord = {};
  hierarchy;
  post;
  userlist;
  username;
  logedinuser_name;
  graphData;
  showTree;
  permissions;
  adminfeature;
  attendancedata = attendance;
  adminsalaryfeature;
  selOfPost;
  selOfBoss;
  notificationcol;
  testvalues;
  salary_userinfo;
  salary_grossincome;
  salary_extraincome;
  salary_permit;
  grossTotal;
  extraTotal;
  current_salary_view;
  email;
  versionmode;
  sendprid;
  yourmessage;
  chatinguser;
  cookies_hierarchy; //Used for cookies
  addUserNode2GUI(user, mode, isPermanent = true) {
    switch (mode) {
      case 'addusers':
        this.addUsers.hide();
        hierarchytree.push(user);
        this.createDataTree(hierarchytree);
        swal("User added", "", "success");
        return;
        case 'updateuser':
        this.hierachyView.hide();
        for (var i = 0; i < hierarchytree.length; i++) {
          if (hierarchytree[i].id == user.id) {
            hierarchytree.splice(i, 1);
            i--;
          }
        };
        hierarchytree.push(user);
        this.createDataTree(hierarchytree);
        swal("Succesfully Updated", "", "success");
        return;
      case 'deleteusers':
        this.hierachyView.hide()
        hierarchytree.forEach(function (item, index, object) { (item.id == user.prid) ? object.splice(index, 1) : "" });
        this.createDataTree(hierarchytree)
        swal("Suuccesfully Deleted", "", "success")
        return;
    }
  }
  ngOnInit() {
    domAngular = this.hierachyView;
    $(".showuser,.updateusers").hide();
    // this.serverConnection.callUrl({session_Id:globssid_tree, mode: "ISLOGGEDIN", data: JSON.stringify({ email: "saylor@edeitic.com" }) }, res => { this.responseData(res) })
  }
  reciveMessage($event){
    this.message = $event
  }
  init(status = false, dataset, mail) {
    console.log("CookiesData Hierarchy:  ",JSON.parse(this.myservice.get("userlogin")))
    this.AdminpageObject.ssidAdminpage = this.message
    globssid_tree = this.message
    versionmode = dataset.keyversion
    hierarchytree = dataset.users;
    selPost = dataset.posts;
    hierarchytree.forEach(uid => {
      if (uid.mail == mail) {
        var profilepic = atob(uid.picture);
        (profilepic != "") ? (profilepic.startsWith("data")) ? $("#DP").attr("src", profilepic) : "" : "";
        (profilepic == null) ? $("#DP").attr("src", "../../assets/images/main.png") : "";
        usrprid = uid.id;
        this.permissions = uid.permissions;
        this.adminfeature = uid.post;
      }
    })
    if (status == true) {
      this.serverConnection.callUrl({session_Id:globssid_tree, mode: "NOTIFICATION", data: JSON.stringify({ whom: usrprid }) }, res => { this.responseData(res) });
      $(".versionview").each((_, el) => { (el.id.substr(12) == versionmode) ? $(el).show() : $(el).hide() });
      (this.adminfeature >= 1) && (this.adminfeature <= 4) ? $("#adminbutton").show() : $("#adminbutton").hide()
      if ((this.adminfeature >= 1) && (this.adminfeature <= 4)) adminpermision = true;
      if (this.permissions == "1") { $("#buttPlus,#editable,#delete").show()}
      if (this.permissions == "2") {
        $("#buttPlus,#editable").show();
        $("#delete").hide(); 
      }
      if (this.permissions == "3") { $("#buttPlus,#editable,#delete").hide()}
      $("#frameModalTop,.modal-backdrop,#signinbutton,#Header,#banerimage,#loginModal").hide(); 
      $("#profilebutton,#buttPlus,#hierarchy,#Heirarchy_Component").show();
      this.initJIT()
      setTimeout(_ => { this.createDataTree(dataset.users) }, 500)
    }
    if (status == false) {
      $("#email,#passwords").val("");
      $("#Header,#frameModalTop,#banerimage,#signinbutton,#loginModal").show();
      $("#profilebutton,#buttPlus,#chatbox,#versionview_demomode,#Heirarchy_Component,.modal-backdrop").hide();
      $("#hierarchy").html("");
    }
  }
  clicked(mode) {
    switch (mode) {
      case 'cardallotation':
        var prid = $("#usrNode_id").html();
        this.serverConnection.callUrl({session_Id:globssid_tree, mode: "CLEARASSOCIATION", data: JSON.stringify({ tagdata: prid }) },
          res => {
            this.responseData(res);
          })
        return
      case 'resetAddForm':
        $('#usrAdd_post option,#usrAdd_boss option,#usrAdd_title option').prop('selected');
        $(".addUserinput_Sh").each((_, el) => { $(el).find("input[type=text],input[type=email],input[type=password] textarea").val("") });
        return
      case 'notify':
        (versionmodecheck == "pro") ? $("#notifrender").show() : swal("Demo Version", "", "error");
        if (versionmodecheck == "pro") this.notificationcol = notificationlist;
        return
      case 'logout':
        this.serverConnection.callUrl({session_Id:globssid_tree, mode: "LOGOUT" }, res => { this.responseData(res) })
        return
      case 'adminpanel_click':
        (adminpermision == true) ? this.serverConnection.callUrl({session_Id:globssid_tree, mode: "ADMINDASHBOARD" }, res => { this.responseData(res) }) : "";
        return
      case 'settings_click':
        (versionmodecheck == "demo") ? swal("Demo version", "", "error") : this.setting.show();
        return
      case 'opensalaryslip':
        if (versionmodecheck == "demo") {
          swal("Demo Version", "", "error")
        } else if (versionmodecheck == "pro") {
          var viewcurrentsal = $("#view_current_salary").html();
          if (viewcurrentsal != "0") {
            this.salaryslip.show();
            this.salary_userinfo = sal_info.userinfo;
            this.salary_grossincome = sal_info.grossIncome;
            this.salary_extraincome = sal_info.extraIncome;
            this.salary_permit = sal_info.permisionsalslip;
            this.grossTotal = total_gross;
            this.extraTotal = total_extra;
          } else {
            swal("Salary not found", "", "info")
          }
        }
        return
      case 'printsalaryslip':
        var printsal_info = $("#salary_information_view").html();
        var orignal_content = document.body.innerHTML;
        document.body.innerHTML = printsal_info;
        window.print();
        document.body.innerHTML = orignal_content;
        window.location.reload();
        return
      case 'hidesettings':
        $("#settings").hide();
        return
    }
  }
  uploadimage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) return;
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.serverConnection.callUrl({session_Id:globssid_tree, mode: "UPLOADPICTURE", data: JSON.stringify({ prid: usrprid, picture: reader.result }) }, res => { this.responseData(res) })
    }
  }
  initJIT() {
    rgraph = new $jit.RGraph({
      injectInto: 'hierarchy',
      background: { CanvasStyles: { strokeStyle: '#ccc' } },
      Navigation: { enable: true, panning: true, zooming: 7 },
      Node: { color: '#FFFFFF' },
      Edge: { color: '#C0C0C0', lineWidth: 1.4, spline: false },
      onBeforeCompute: node => {
      },
      onCreateLabel: (domElement, node) => {
        domElement.innerHTML = node.fname + "  " + node.lname
        domElement.name = "tooltip";
        domElement.className = "show";
        var hoverdiv = document.createElement("div")
        hoverdiv.setAttribute("class", "showuser p-2 bg-white text-dark  border border-dark")
        hoverdiv.style.display = "none";
        hoverdiv.style.marginLeft = "-6em";
        hoverdiv.style.width = "22em";
        hoverdiv.setAttribute("id", "info" + domElement.id);
        var hovercontent = document.createElement("div");
        hovercontent.innerHTML = `
            <div id="mainrender"">
              <div class="row">
               <div class="col-2">UserID</div>
               <div class="col-1">:</div>
               <div class="col-9">${node.id}</div>
              </div>
              <div class="row">
               <div class="col-2">Name</div>
               <div class="col-1">:</div>
               <div class="col-9">${node.fname + " " + node.lname}</div>
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
            </div>`
        hoverdiv.append(hovercontent)
        domElement.append(hoverdiv)
        domElement.onclick = _ => { this.hierarchyViewdata(node) }
        domElement.onmouseover = _ => { $("#info" + domElement.id).show() }
        domElement.onmouseout = _ => { $("#info" + domElement.id).hide() }
      },
      onPlaceLabel: (domElement, node) => {
        var style = domElement.style;
        style.display = ''; style.cursor = 'pointer';
        if (node._depth <= 1) {
          style.fontSize = "1em";
          style.color = "#FFFFFF";
        } else if (node._depth == 2) {
          style.fontSize = "1em";
          style.color = "#FFFFFF";
        } else {
          style.display = 'block';
          style.fontSize = "1em";
          style.color = "#FFFFFF";
        }
        var left = parseInt(style.left);
        var w = domElement.offsetWidth;
        style.left = (left - w / 5) + 'px';
      }
    })
  }
  createDataTree(dataset) { //legacy code to convert flat data to 
    let hashTable = Object.create(null);
    dataset.forEach(aData => hashTable[aData.id] = { ...aData, children: [] });
    let dataTree = [];
    dataset.forEach(aData => {
      (aData.boss) ? hashTable[aData.boss].children.push(hashTable[aData.id]) : dataTree.push(hashTable[aData.id]);
    })
    dataTree.forEach(obj => { this.showTree = obj })
    this.reloadGraph(this.showTree)
  }
  reloadGraph(d = null) {
    if (d === null) d = this.graphData;
    else this.graphData = d;
    rgraph.loadJSON(d);
    rgraph.graph.eachNode(function (n) {
      var pos = n.getPos();
      pos.setc(-300, -300);
    })
    rgraph.compute('end');
    rgraph.fx.animate({ modes: ['polar'], duration: 2000 });
  }
  changeIps_addGUIusers(selectsinfo) {
    switch (selectsinfo.id) {
      case "usrAdd_post":
        this.selOfBoss = hierarchytree;
        $("#report_select").show();
        return;
      case "usrAdd_boss":
        $("#titles_select,.addUserinput_Sh,.address,.addUsers_click,.addreset_click").show();
        return;
    }
  }
  userAdd() {
    this.addUsers.show();
    this.selOfPost = selPost;
  }
  hierarchyViewdata(data) {
    $("#editable").show();
    $("#viewmode,#cardAllot").hide();
    if (data.picture != null || data.picture != undefined) {
      if (data.picture != "") var profilepic = atob(data.picture);
      (data.picture != "") ? profilepic.startsWith("data") ? $("#usersDp").attr("src", profilepic) : "" : "";
    }
    (profilepic == null || profilepic == undefined) ? $("#usersDp").attr("src", "../../assets/images/main.png") : "";
    (data.id != usrprid) ? $("#updprofile").hide() : $("#updprofile").show();
    var correspondingAddShow = false;
    var permanentAddShow = false;
    $('.lblEditToggle').each((i, lbl) => {
      var val2Enter = data[lbl.id.substr(8)];
      (val2Enter == 0||val2Enter == null||val2Enter == ""||val2Enter == undefined)?val2Enter = "":val2Enter;
      Object.keys(data).forEach(eld => {
        if (eld == lbl.id.substr(8)) { (val2Enter == "") ? (eld == "mname") ? $("#" + lbl.id).hide() : $("#" + lbl.id).parent().hide() : $("#" + lbl.id).parent().show(); }
      })
      var isValnull = val2Enter === null || val2Enter === undefined
      $(lbl).html(val2Enter);
      if (lbl.id.startsWith('usrNode_address_c_')) if (!isValnull) {
        correspondingAddShow = correspondingAddShow || true
      }
      if (lbl.id.startsWith('usrNode_address_p_')) if (!isValnull) {
        permanentAddShow = permanentAddShow || true
      }
      lbl.setAttribute("contentEditable", "false");
    })
    $("#editable").click(function () {
      $('.lblEditToggle').each((i, edit) => {
        var val2Enter = data[edit.id.substr(8)];
       (val2Enter == 0||val2Enter == null||val2Enter == ""||val2Enter == undefined)?val2Enter = "":val2Enter;
        Object.keys(data).forEach(eld => {
          if (eld == edit.id.substr(8)) { (val2Enter == "") ? $("#" + edit.id).parent().show() : "" }
        })
        var valEdit = data[edit.id.substr(8)];
        var isValnull = valEdit === null || valEdit === undefined
        $(edit).html(valEdit);
        if (edit.id.startsWith('usrNode_address_c_')) if (!isValnull) {
          correspondingAddShow = correspondingAddShow || true
        }
        if (edit.id.startsWith('usrNode_address_p_')) if (!isValnull) {
          permanentAddShow = permanentAddShow || true
        }
        edit.setAttribute("contentEditable", "true");
        $("#viewmode,.updateusers,#cardAllot,.caddress,.paddress").show();
        $("#editable ,#calendar").hide();
        (edit.id == "usrNode_id") ? edit.setAttribute("contentEditable", "false") : "";
      })
    })
    $("#viewmode").click(function () {
      $('.lblEditToggle').each((i, read) => {
        var val2Enter = data[read.id.substr(8)];
       (val2Enter == 0||val2Enter == null||val2Enter == ""||val2Enter == undefined)?val2Enter = "":val2Enter;
       Object.keys(data).forEach(eld => {
          if (eld == read.id.substr(8)) { (val2Enter == "") ? $("#" + read.id).parent().hide() : "" }
        })
        read.setAttribute("contentEditable", "false");
        $("#editable,#calendar").show();
        $("#viewmode,.updateusers,#cardAllot").hide();
      })
    })
    $(".updateusers").hide();
    domAngular.show();
    this.salaryResponse(data.id);
    this.populateCalendarAttendance(data.id);
  }
  mainupulationSend(mode) {
    switch (mode) {
      case ('addusers'):
        var userData = {}
        $('.inputusers').each((_, r) => { userData[r.id.substr(7).toLowerCase()] = $(r).val() })
        var i = 0; i++; userData["prid"] = (new Date).getTime() + i - 2678400;
        this.serverConnection.callUrl({ mode: "REGISTER", data: JSON.stringify(userData) }, res => {
          this.responseData(res)
        })
        return
      case ('updateUserrecord'):
        var userDataupdate = {}
        $('.lblEditToggle').each((i, u) => { userDataupdate[u.id.substr(8)] = $(u).html() })
        this.serverConnection.callUrl({session_Id:globssid_tree, mode: "UPDATE_USERS", data: JSON.stringify(userDataupdate) }, res => {
          this.responseData(res)
        })
        return
      case ('deleteRecord'):
        var prid = $("#usrNode_id").html();
        this.serverConnection.callUrl({session_Id:globssid_tree, mode: "DELETE_USERS", data: JSON.stringify({ prid: prid }) }, res => {
          this.responseData(res)
        })
        return
    }
  }
  salaryResponse(prid) {
    this.serverConnection.callUrl({session_Id:globssid_tree, mode: "SALARYSLIP", data: JSON.stringify({ prid: prid }) }, res => {
      this.responseData(res)
    })
  }
  usersalaryslip(response) {
    var salrespObj = {}
    response.forEach(el => { salrespObj = el; uid_sal = el.prid })
    sal_info = {};
    var uid_sal;
    var userinfo_salary;
    var grosssallist = ['basic_salary', 'hra', 'ta', 'da', 'overtime', 'bonus', 'house_rent'];
    var extraInList = ['medical', 'telephone_internet', 'other'];
    var salaryslipPermit = ['prepared_by', 'check_by', 'authorised_by'];
    var grosssalary = [];
    var extraincomeArray = [];
    var permition_salslip = [];
    hierarchytree.forEach(el => {
      if (el.id == uid_sal) {
        userinfo_salary = [
          { heading: "Name", value: el.title + " " + el.fname + " " + el.mname + " " + el.lname },
          { heading: "Date of Joining", value: el.createdAt }
        ];
        selPost.forEach(postel => {
          (el.post == postel.id) ? userinfo_salary.push({ heading: "Designation", value: postel.name }) : "";
        })
      };
      sal_info["userinfo"] = userinfo_salary;
    })
    grosssallist.forEach(gsel => {
      Object.keys(salrespObj).forEach(sel => {
        (gsel == sel) ? grosssalary.push({ heading: sel, value: salrespObj[sel] }) : "";
      })
    });
    sal_info["grossIncome"] = grosssalary;
    var calculategross = 0;
    grosssalary.forEach(el => { calculategross = calculategross + el.value });
    total_gross = calculategross;
    extraInList.forEach(extincel => {
      Object.keys(salrespObj).forEach(extel => {
        (extincel == extel) ? extraincomeArray.push({ heading: extel, value: salrespObj[extel] }) : "";
      })
    });
    sal_info["extraIncome"] = extraincomeArray;
    var calculateextra = 0;
    extraincomeArray.forEach(exel => { calculateextra = calculateextra + exel.value });
    total_extra = calculateextra;
    var currentsalary = calculategross + calculateextra;
    this.current_salary_view = currentsalary;
    $("#view_current_salary").html(this.current_salary_view)
    salaryslipPermit.forEach(permitel => {
      Object.keys(salrespObj).forEach(permitobjel => {
        (permitel == permitobjel) ? permition_salslip.push({ heading: permitobjel, value: salrespObj[permitobjel] }) : "";
      })
    });
    sal_info["permisionsalslip"] = permition_salslip;
    this.serverConnection.callUrl({session_Id:globssid_tree, mode: "CURRENT_SALARY", data: JSON.stringify({ prid: uid_sal, current_salary: currentsalary }) }, res => { this.responseData(res) })
  }
  populateCalendarAttendance(prid, dataInterest = moment()) {
    var month = dataInterest.month();
    var year = dataInterest.year();
    var attendance_Interest = [];
    var workinghours;
    this.attendancedata.forEach(d => {
      var dt = moment(d.createdAt, 'YYYY-MM-DD HH:mm:SS');
      ((prid == d.prid) && (month === dt.month()) && (year === dt.year())) ? attendance_Interest.push(d) : "";
    })
    if (attendance_Interest.length < 1) {
      $('#calendar').hide();
      this.serverConnection.callUrl({session_Id:globssid_tree, mode: "GETATTENDANCE", data: JSON.stringify({ prid: prid, month: dataInterest.month() + 1, year: dataInterest.year() }) }, res => {
        this.responseData(res)
      })
    }
    else {
      $('#calendar').show();
      $('#calendar').fullCalendar({
        defaultDate: moment().format('YYYY-MM-DD'),
        editable: true,
        eventLimit: false,
        viewRender: (view, event) => {
          var moments = $('#calendar').fullCalendar('getDate');
          var data = moments.format();
        }
      })
      var eventsCurrent = [];
      var intAtt = attendance_Interest.sort((a, b) => { return a.createdAt - b.createdAt })
      for (var idx = 0; idx < intAtt.length; idx++) {
        var atUnixTime = moment(intAtt[idx].createdAt, 'YYYY-MM-DD HH:mm:SS').unix()
        if (intAtt[idx].mode === 'OUT') {
          var idxIn = idx;
          var evt = { end: moment.unix(atUnixTime).format('YYYY-MM-DD HH:mm:SS') }
          while (idxIn-- > 0) {
            var possEnd = moment(intAtt[idxIn].createdAt, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
            (intAtt[idxIn].mode === 'IN') ? evt["start"] = possEnd : evt.end = possEnd;
            if (intAtt[idxIn].mode === 'IN') break;
          }
          eventsCurrent.push(evt)
        }
      }
      eventsCurrent.forEach(pushtime => {
        var startTime = moment(pushtime.start, 'YYYY-MM-DD HH:mm:SS');
        var endTime = moment(pushtime.end, 'YYYY-MM-DD HH:mm:SS');
        workinghours = endTime.diff(startTime, 'hours');
        pushtime["title"] = (workinghours + 1) + " hrs";
      })
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', eventsCurrent);
    }
  }
  notification(data) {
    notificationlist = data;
    $("#notycount").html(data.length);
  }
  responseData(response) {
    switch (response.mode) {
      case 'recordissue':
        swal(response.record, "", "warning")
        return
      case 'serverissue':
        swal(response.record, "", "error")
        return
      case 'register':
        console.log(response.record)
        if(response.record != "Demo Version")
          response.record["id"] = response.record.prid;
        delete response.record["prid"];
        (response.record == "Demo Version") ? swal(response.record, "", "error") : this.addUserNode2GUI(response.record, "addusers");
        return
      case 'clearassociation':
        (response.record == "success") ? this.serverConnection.callUrl({session_Id:globssid_tree, mode: "GETCARDID", data: JSON.stringify(response.other.data) }, res => { this.responseData(res) }) : swal(response.record, "", "error");
        return
      case 'getcardid':
        var check;
        response.record.forEach(el => {
          check = el.tagid == "" ? false : true;
          if (el.tagid == "") this.serverConnection.callUrl({session_Id:globssid_tree, mode: "GETCARDID", data: JSON.stringify(response.other.data) }, res => { this.responseData(res) })
        });
        (check == false) ? $("#loading_img").show() : $("#loading_img").hide();
        (check == false) ? $("#cardAllot,#viewmode,.detailback").hide() : $("#cardAllot,#viewmode,.detailback").show();
        $(".allotdisabled").prop('disabled', check == false ? true : false)
        if (check == true) swal("Card successfully alloted", "", "success");
        return
      case 'update_users':
        (response.record == "Demo Version") ? swal(response.record, "", "error") : this.addUserNode2GUI(response.record, "updateuser");
        return
      case 'delete_users':
        (response.record == "Demo Version") ? swal(response.record, "", "error") : this.addUserNode2GUI(response.record, "deleteusers")
        return
      case 'salaryslip':
        (response.record == "Demo Version") ? versionmodecheck = "demo" : versionmodecheck = "pro";
        if (response.record != "Demo Version") this.usersalaryslip(response.record);
        return
      case 'current_salary':
        return
      case 'salary_add':
        return
      case 'salary_dlt':
        return
      case 'getattendance':
        this.attendancedata = response.record;
        (response.record.length != 0) ? this.populateCalendarAttendance(response.other.data.prid, moment(`${response.other.data.year}-${response.other.data.month}`, 'YYYY-MM')) : "";
        return
      case 'notification':
        console.log(response)
        this.notification(response.record);
        return
      case 'admindashboard':
        (response.record == "Demo Version") ? versionmodecheck = "demo" : versionmodecheck = "pro";
        (response.record == "Demo Version") ? swal("Demo mode", "Please purchase the product", "error") : this.AdminpageObject.adminpage(response.record);
        if (response.record != "Demo Version")
          this.AdminpageObject.displayproperty('hideheirarchycomponent')
        return
      case 'logout':
        (response.record == "LOGGED OUT") ? this.init(false, { users: [] }, "") : swal("Server not responding", "", "info");
        return
      case 'isloggedin':
        (response.record == "NOT LOGGED IN") ? this.init(false, { users: [] }, '') : "";
        return
      case 'uploadpicture':
        this.imageview(response.record)
        return
    }
  }
  payment(mode,input){
    var dataobj = {mode:mode,data:input}
    this.PaymentObject.requestdata(dataobj)
  }
  dismisModal(mode, key) { (key == "modal") ? this[mode].hide() : $("#" + mode).hide() }
  buyproduct() { swal("Comming soon", "Feature will release soon", "info") }
  imageview(url) { $("#DP,#usersDp").attr("src", url) }
}