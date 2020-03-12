// tslint:disable: curly
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { callUrl } from '../ajaxes';
import { ModalDirective } from 'angular-bootstrap-md';
import { DataserviceService } from "../dataservice.service";
import moment from 'moment';
import $ from 'jquery';
import 'fullcalendar';
declare var swal: any
declare var $jit: any;
let rgraph: any;
let userAccess = {};
var test;
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {
  @ViewChild('addUsers', { static: true }) addUsers: ModalDirective;
  @ViewChild('hierachyView', { static: true }) hierachyView: ModalDirective;
  @ViewChild('salaryslip', { static: true }) salaryslip: ModalDirective;
  @ViewChild('printslip', { static: true }) private printslip: ElementRef;
  public userdata: any;
  graphData: any;
  showTree: any;
  posts: any;
  accesslevels: any;
  users: any;
  adduserBosslist: any = { show: false }
  adduserAlldetail: any = { show: false }
  selOfBoss: any;
  selOfPost: any;
  selOfTitle: any;
  selOfPermision: any;
  clickedUserid: any;
  rootUserid: any;
  loginuserid: any;
  checkcardRecord: any;
  editabel: any;
  jitNodeData: any;
  attendancedata: any = [];
  addButton: any = false;
  userRecordbody: any = [
    {
      title: 'Crud',
      detail: [{
        name: 'edit',
        icon: 'pencil-alt',
        clickFun: (_: any) => { this.clicked('editRecord') },
        style: 'nav-link waves-light text-dark h3',
        show: false
      }, {
        name: 'view',
        icon: 'eye',
        clickFun: (_: any) => { this.clicked('viewRecord') },
        style: 'nav-link waves-light text-dark h3',
        show: false
      }, {
        name: 'delete',
        icon: 'trash',
        clickFun: (_: any) => { this.callFunction('deleteRecord') },
        style: 'nav-link waves-light text-dark h3',
        show: false
      }]
    }, {
      title: 'Buttons',
      detail: [{
        name: 'cardbutton',
        title: 'Allot',
        icon: 'id-card-alt',
        clickFun: (_: any) => { this.callFunction('cardallot') },
        style: 'waves-light rounded mb-0 h6 text-center z-depth-2 bg-dark text-white px-4 py-3',
        show: true
      }, {
        name: 'salaryslip',
        title: '0',
        icon: 'rupee-sign',
        clickFun: (_: any) => { this.clicked('salaryslipclick') },
        style: 'waves-light rounded mb-0 h6 text-center z-depth-2 bg-dark text-white px-4 py-3',
        show: true
      }, {
        name: 'cardimage',
        img: '../../assets/images/cardscan2.gif',
        style: 'px-5 py-4',
        show: false
      }]
    }];
  salaryslipJson: any = {
    data: [{ title: 'User Detail', detail: [] }, { title: 'Grossincome', detail: [] }, { title: 'Extraincome', detail: [] }, { title: 'Totalicome', total: 0 }, { title: 'salary_permit', detail: [] }],
    show: true
  }
  userDetails: any = { data: [{ title: 'Basic Detail', detail: [], show: true }, { title: 'Permanent Address', detail: [], show: true }, { title: 'Corresponding Address', detail: [], show: true }] }
  constructor(private dataService: DataserviceService) { }
  ngOnInit() {
    this.initJIT();
    callUrl({ mode: 'GETINITDATA' }, (resp: any) => {
      if (resp != "eNOTLOGGEDIN") {
        resp = JSON.parse(resp);
        this.accesslevels = resp.accesslevels;
        this.posts = resp.posts;
        this.users = resp.users;
        var permission: any = { operation: 'Crud', data: [{ type: 1, value: ['edit', 'delete'], show: true }, { type: 2, value: ['edit'], show: true }, { type: 3, show: false }] }
        this.users.forEach(permit => {
          if (!permit.boss) { // This condition is used to check root user
            this.loginuserid = permit.id
            userAccess["image"] = atob(permit.picture)
            permission.data.forEach(perel => {
              if (permit.permissions == perel.type) {//Below condition is use to check permission
                this.addButton = perel.show;
                this.userRecordbody.forEach(crdel => { if (crdel.title == permission.operation) { crdel.detail.forEach(stel => { perel.value.forEach(valel => { if (stel.name == valel) stel.show = perel.show }) }) } })
              }
            })
          }
          if ((permit.post >= 1) && (permit.post <= 3)) { userAccess["admin"] = true }//Check Admin feature authority
        })
        callUrl({ mode: "NOTIFICATION", data: JSON.stringify({ whom: this.loginuserid }) }, (resp: any) => {
          userAccess["notification"] = JSON.parse(resp)
          this.dataService.setServicedata('portal',userAccess)
        })
        this.createDataTree(this.users);
      }
    })
  }
  addUserNode2GUI(user: any, mode: any, isPermanent: any = true) {
    switch (mode) {
      case 'addusers':
        this.addUsers.hide();
        this.users.push(user);
        this.createDataTree(this.users);
        swal('User Added', '', 'success')
        break;
      case 'deleteusers':
        this.users.forEach(function (item, index, object) { (item.id == user.prid) ? object.splice(index, 1) : '' });
        this.createDataTree(this.users);
        this.hierachyView.hide();
        swal('User Deleted', '', 'success')
        break;
      case 'updateuser':
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id == user.id) {
            this.users.splice(i, 1);
            i--;
          }
        };
        this.users.push(user);
        this.createDataTree(this.users);
        this.hierachyView.hide();
        swal('User Updated', '', 'success')
        break;
    }
  }
  initJIT() {
    rgraph = new $jit.RGraph({
      injectInto: 'hierarchy',
      background: { CanvasStyles: { strokeStyle: '#ccc' } },
      Navigation: { enable: true, panning: true, zooming: 6 },
      Node: { color: '#FFFFFF' },
      Edge: { color: '#C0C0C0', lineWidth: 1, spline: false },
      onCreateLabel: (domElement, node) => {

        //domElement.innerHTML = node.fname + + (node.mname ? node.mname + ' ' : '') + '  ' + node.lname;
        domElement.innerHTML = node.fname + ' ' + node.lname;
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
            <div id='mainrender''>
              <div class='row' *ngFor='let hoverdata of array'>
               <div class='col-2'>UserId</div>
               <div class='col-1'>:</div>
               <div class='col-9'>${node.id}</div>
              </div>
              <div class='row'>
               <div class='col-2'>Name</div>
               <div class='col-1'>:</div>
               <div class='col-9'>${node.fname + ' ' + node.lname}</div>
              </div>
              <div class='row'>
               <div class='col-2'>Contact</div>
               <div class='col-1'>:</div>
               <div class='col-9'>${node.contactno}</div>
              </div>
              <div class='row'>
               <div class='col-2'>Email</div>
               <div class='col-1'>:</div>
               <div class='col-9'>${node.email}</div>
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
          style.fontSize = '1.2em';
          style.color = '#FFFFFF';
        } else if (node._depth == 2) {
          style.fontSize = '1.2em';
          style.color = '#FFFFFF';
        } else {
          style.display = 'block';
          style.fontSize = '1.2em';
          style.color = '#FFFFFF';
        }
        var left = parseInt(style.left);
        var w = domElement.offsetWidth;
        style.left = (left - w / 7) + 'px';
      }
    });
  }
  changeIps_addGUIusers(mode: any) {
    switch (mode) {
      case 'usrAdd_post':
        this.selOfBoss = this.users;
        this.selOfTitle = ['Mr', 'Mrs', 'Ms'];
        this.selOfPermision = [{ name: 'All Permission', value: '1' }, { name: 'Read, Add, Update', value: '2' }, { name: 'Only Read', value: '3' },]
        this.adduserBosslist.show = true;
        return;
      case 'usrAdd_boss':
        this.adduserAlldetail.show = true;
        return;
    }
  }
  createDataTree(dataset: any) { // legacy code to convert flat data to  hierarchy
    const hashTable = Object.create(null);
    dataset.forEach((aData: any) => hashTable[aData.id] = { ...aData, children: [] });
    const dataTree = [];
    dataset.forEach((aData: any) => {
      (aData.boss) ? hashTable[aData.boss].children.push(hashTable[aData.id]) : dataTree.push(hashTable[aData.id]);
    });
    dataTree.forEach(obj => { this.showTree = obj; });
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
    rgraph.fx.animate({ modes: ['polar'], duration: 50 });
  }
  hierarchyViewdata(data: any) {
    this.jitNodeData = data;
    this.clickedUserid = data.id; //Get Id after clicked
    this.rootUserid = data.boss;  //Get Boss Id after clicked

    //Used for display current salary of clicked user
    this.userRecordbody.forEach(urel => { urel.detail.forEach(udel => { if (udel.name == 'salaryslip') (data.current_salary == undefined) ? udel.title = '0' : udel.title = data.current_salary }) })

    //This object is used to show value and icon dynamically for UI
    var clickedData: any = {};
    this.users[0]['boss'] = data.boss;
    this.users[0]['email'] = this.users[0].mail;

    //Below code is used to make user detail for UI
    Object.keys(this.users[0]).forEach(el => { clickedData[el] = { value: data[el], icon: '' } })

    //Below code is used to filter address field form clickedData object
    var recordArrray = [{ key: 'houseno', icon: 'home' }, { key: 'area', icon: 'road' }, { key: 'city', icon: 'city' }, { key: 'state', icon: 'flag' }, { key: 'country', icon: 'globe' }, { key: 'pincode', icon: 'keyboard' }]
    recordArrray.forEach(makeedit => { Object.keys(clickedData).forEach(test1 => { if (test1.endsWith(makeedit.key)) clickedData[test1].icon = makeedit.icon }) })
    this.userDetails.data.forEach(el => { el.detail = [] })

    //Below code is used to store user data
    this.userDetails.data.forEach(clickel => {
      if (clickel.title == 'Basic Detail') {
        clickel.detail.push({ title: 'name', record: [{ key: 'title', value: clickedData.title.value }, { key: 'fname', value: clickedData.fname.value }, { key: 'mname', value: clickedData.mname.value }, { key: 'lname', value: clickedData.lname.value },], icon: 'user', show: 'true' })
        clickel.detail.push({ title: 'email', record: [{ key: 'email', value: clickedData.email.value }], icon: 'envelope', show: (clickedData.email.value == undefined || clickedData.email.value == '') ? false : true })
        clickel.detail.push({ title: 'contactno', record: [{ key: 'contactno', value: clickedData.contactno.value }], icon: 'phone', show: (clickedData.contactno.value == undefined || clickedData.contactno.value == '') ? false : true })
      }
      if (clickel.title == 'Permanent Address') Object.keys(clickedData).forEach(el => { if (el.startsWith('address_p')) clickel.detail.push({ title: el, record: [{ key: el, value: clickedData[el].value }], icon: clickedData[el].icon, show: (clickedData[el].value == undefined || clickedData[el].value == 0 || clickedData[el].value == '') ? false : true }) })
      if (clickel.title == 'Corresponding Address') Object.keys(clickedData).forEach(el => { if (el.startsWith('address_c')) clickel.detail.push({ title: el, record: [{ key: el, value: clickedData[el].value }], icon: clickedData[el].icon, show: (clickedData[el].value == undefined || clickedData[el].value == 0 || clickedData[el].value == '') ? false : true }) })
    })

    var checkobj: any = { address_p: [], address_c: [] }; //Used to check defined values
    Object.keys(clickedData).forEach(el => {
      if (el.startsWith('address_p')) if (clickedData[el].value != '' || clickedData[el].value != 0) checkobj.address_p.push(clickedData[el].value);
      if (el.startsWith('address_c')) if (clickedData[el].value != '' || clickedData[el].value != 0) checkobj.address_c.push(clickedData[el].value);
    });

    this.userDetails.data.forEach(apel => {
      if (apel.title == 'Permanent Address') (checkobj.address_p == 0) ? apel.show = false : apel.show = true;
      if (apel.title == 'Corresponding Address') (checkobj.address_c == 0) ? apel.show = false : apel.show = true;
    });
    //this.userDetails.data.forEach(acel => { if(acel.title == 'Corresponding Address') acel.show = false });
    this.populateCalendarAttendance(data.id)
    this.callFunction('salaryslip_request');
    this.hierachyView.show();
  }
  clicked(mode: any) {
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
        this.userRecordbody.forEach(parel => { if (parel.title == 'Crud') parel.detail.forEach(carel => { (carel.name == 'view') ? carel.show = true : carel.show = false }) })
        this.editabel = true;
        this.userDetails.data.forEach(el => {
          el.show = true;
          el.detail.forEach(coel => { coel.show = true })
        });
        break;
      case 'viewRecord':
        this.userRecordbody.forEach(parel => {
          if (parel.title == 'Crud') parel.detail.forEach(carel => {
            (carel.name == 'edit') ? carel.show = true : carel.show = false;
            if (carel.name == 'delete') carel.show = true;
          });
        })
        this.editabel = false;
        this.hierarchyViewdata(this.jitNodeData)
        break;
      case 'allotimgLoad':
        this.userRecordbody.forEach(parel => { (parel.title == 'Buttons') ? parel.detail.forEach(carel => { (carel.name == 'cardimage') ? (this.checkcardRecord.tagid == '') ? carel.show = true : carel.show = false : '' }) : ''; })
        break;
      case 'salaryslipclick':
        console.log(this.salaryslipJson.show);
        (this.salaryslipJson.show == true) ? this.salaryslip.show() : swal('Salary Not found', '', 'info');
        break;
      case 'salmodaldismiss':
        this.salaryslip.hide();
        break;
      case 'printsalaryslip':
        var printsal_info = this.printslip.nativeElement.innerHTML;
        var orignal_content = document.body.innerHTML;
        document.body.innerHTML = printsal_info;
        window.print();
        document.body.innerHTML = orignal_content;
        window.location.reload();
        break;
      default:
        break;
    }
  }
  callFunction(mode: any) {
    var requestObj = JSON.stringify({ tagdata: this.clickedUserid })
    switch (mode) {
      case 'cardallot':
        callUrl({ mode: 'CLEARASSOCIATION', data: requestObj }, (resp: any) => { if (resp == '"success"') callUrl({ mode: 'GETCARDID', data: requestObj }, (resp: any) => { this.objectToarray(JSON.parse(resp), 'fromCardallot') }) })
        break;
      case 'getcardid':
        if (this.checkcardRecord.tagid == '') callUrl({ mode: 'GETCARDID', data: requestObj }, (resp: any) => { this.objectToarray(JSON.parse(resp), 'fromCardallot') })
        this.clicked('allotimgLoad');
        break;
      case 'deleteRecord':
        callUrl({ mode: 'DELETE_USERS', data: JSON.stringify({ prid: this.clickedUserid }) }, (resp: any) => { this.addUserNode2GUI(JSON.parse(resp), 'deleteusers') })
        break;
      case 'addusers':
        var userData = {}
        $('.inputusers').each((_, r) => { userData[r.id.substr(7).toLowerCase()] = $(r).val() })
        var i = 0; i++; userData['prid'] = (new Date).getTime() + i - 2678400;
        callUrl({ mode: 'REGISTER', data: JSON.stringify(userData) }, (resp: any) => {
          resp = JSON.parse(resp);
          resp['id'] = resp.prid;
          delete resp['prid'];
          this.addUserNode2GUI(resp, 'addusers');
        })
        break;
      case 'updateData':
        var updObjt = {};
        $('.updatedetail').each((_, el) => { updObjt[el.id] = $(el).html() });
        updObjt['prid'] = this.clickedUserid;
        updObjt['boss'] = this.rootUserid;
        callUrl({ mode: 'UPDATE_USERS', data: JSON.stringify(updObjt) }, (resp: any) => {
          resp = JSON.parse(resp);
          resp.id = resp.prid;
          delete resp['prid'];
          this.addUserNode2GUI(resp, 'updateuser');
        })
        break;
      case 'salaryslip_request':
        callUrl({ mode: 'SALARYSLIP', data: JSON.stringify({ prid: this.clickedUserid }) }, (resp: any) => {
          resp = JSON.parse(resp)
          this.salaryslipJson.data.forEach(salJson => { salJson.detail = [] })
          var salaryObj: any = {};
          (resp.length == 0) ? this.salaryslipJson.show = false : this.salaryslipJson.show = true;
          resp.forEach(el => { salaryObj = el });

          //code for userdetail
          var userarray: any = [{ key: 'fname', value: 'Firstname' }, { key: 'lname', value: 'Lastname' }, { key: 'createdAt', value: 'Date of Joining' }]
          this.users.forEach(usel => { if (usel.id == salaryObj.prid) this.salaryslipJson.data.forEach(wrel => { userarray.forEach(nel => { (wrel.title == 'User Detail') ? wrel.detail.push({ head: nel.value, value: usel[nel.key] }) : '' }) }) })

          //code for display gross icome and calculation
          var grossincome: any = ['basic_salary', 'hra', 'ta', 'da', 'overtime', 'bonus', 'house_rent'];
          var calculategross = 0;
          grossincome.forEach(addel => { calculategross = calculategross + salaryObj[addel] })
          salaryObj['grossincome'] = calculategross;
          grossincome.push('grossincome')
          grossincome.forEach(grossel => { this.salaryslipJson.data.forEach(wrel => { if (wrel.title == 'Grossincome') wrel.detail.push({ head: grossel, value: salaryObj[grossel] }) }) })

          //code for display extra icome and calculation
          var extraInList = ['medical', 'telephone_internet', 'other'];
          var calculate_extra = 0;
          extraInList.forEach(eil => { calculate_extra = calculate_extra + salaryObj[eil] })
          salaryObj['extraincome'] = calculate_extra
          extraInList.push('extraincome')
          this.salaryslipJson.data.forEach(wrsj => { if (wrsj.title == 'Extraincome') extraInList.forEach(exel => { wrsj.detail.push({ head: exel, value: salaryObj[exel] }) }) })

          // code for grand total
          this.salaryslipJson.data.forEach(gtel => { if (gtel.title == 'Totalicome') gtel.total = calculategross + calculate_extra })

          // code for display permission officer Id
          var salaryslipPermit = ['prepared_by', 'check_by', 'authorised_by'];
          this.salaryslipJson.data.forEach(elpo => { if (elpo.title == 'salary_permit') salaryslipPermit.forEach(spel => { elpo.detail.push({ head: spel, value: salaryObj[spel] }) }) })

          //Use to store current_salary into database
          callUrl({ mode: "CURRENT_SALARY", data: JSON.stringify({ prid: this.clickedUserid, current_salary: calculategross + calculate_extra }) }, (resp: any) => { })
        })
        break;
    }
  }
  objectToarray(input: any, mode: any) {
    switch (mode) {
      case 'fromCardallot':
        var obj;
        input.forEach(el => { obj = el })
        this.checkcardRecord = obj;
        this.callFunction('getcardid');
        break;
    }
  }
  populateCalendarAttendance(prid: any, dataInterest = moment()) {
    this.dataService.setServicedata("prid", prid)
    $('#calendar').hide();
    callUrl({ mode: 'GETATTENDANCE', data: JSON.stringify({ prid: prid, month: dataInterest.month() + 1, year: dataInterest.year() }) }, (resp: any) => {
      var attendance = JSON.parse(resp);
      var workinghours;
      if (attendance.length != 0) {
        $('#calendar').show();
        $('#calendar').fullCalendar({ defaultDate: moment().format('YYYY-MM-DD'), editable: true, eventLimit: false });
        var eventsCurrent = [];
        var intAtt = attendance.sort((a, b) => { return a.createdAt - b.createdAt });
        for (var idx = 0; idx < intAtt.length; idx++) {
          var atUnixTime = moment(intAtt[idx].createdAt, 'YYYY-MM-DD HH:mm:SS').unix()
          if (intAtt[idx].mode === 'OUT') {
            var idxIn = idx;
            var evt = { end: moment.unix(atUnixTime).format('YYYY-MM-DD HH:mm:SS') }
            while (idxIn-- > 0) {
              var possEnd = moment(intAtt[idxIn].createdAt, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
              (intAtt[idxIn].mode === 'IN') ? evt['start'] = possEnd : evt.end = possEnd;
              if (intAtt[idxIn].mode === 'IN') break;
            }
            eventsCurrent.push(evt);
          }
        }
        eventsCurrent.forEach(pushtime => {
          var startTime = moment(pushtime.start, 'YYYY-MM-DD HH:mm:SS');
          var endTime = moment(pushtime.end, 'YYYY-MM-DD HH:mm:SS');
          workinghours = endTime.diff(startTime, 'hours');
          pushtime['title'] = (workinghours + 1) + ' hrs';
        });
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', eventsCurrent);
      }
    })
  }
}