// tslint:disable: curly
// tslint:disable-next-line: triple-equals
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { callUrl } from '../ajaxes';
import { ModalDirective } from 'angular-bootstrap-md';
import { DataserviceService } from '../dataservice.service';
import moment from 'moment';
import $ from 'jquery';
import 'fullcalendar';
declare var swal: any;
declare var $jit: any;
let rgraph: any;
const userAccess: any = {};
// var test;
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
  // tslint:disable-next-line: new-parens
  datetime = new Date;
  graphData: any;
  showTree: any;
  posts: any;
  accesslevels: any;
  users: any;
  adduserBosslist: any = { show: false };
  adduserAlldetail: any = { show: false };
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
        clickFun: (_: any) => {
          this.clicked('editRecord');
        },
        style: 'nav-link waves-light text-dark h3',
        show: false
      }, {
        name: 'view',
        icon: 'eye',
        clickFun: (_: any) => {
          this.clicked('viewRecord');
        },
        style: 'nav-link waves-light text-dark h3',
        show: false
      }, {
        name: 'delete',
        icon: 'trash',
        clickFun: (_: any) => {
          this.callFunction('deleteRecord');
        },
        style: 'nav-link waves-light text-dark h3',
        show: false
      }]
    }, {
      title: 'Buttons',
      detail: [{
        name: 'cardbutton',
        title: 'Allot',
        icon: 'id-card-alt',
        clickFun: (_: any) => {
          this.callFunction('cardallot');
        },
        style: 'waves-light rounded mb-0 h6 text-center z-depth-2 bg-dark text-white px-4 py-3',
        show: true
      }, {
        name: 'salaryslip',
        title: '0',
        icon: 'rupee-sign',
        clickFun: (_: any) => {
          this.clicked('salaryslipclick');
        },
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
    data: [
      { title: 'User Detail', detail: [] },
      { title: 'Grossincome', detail: [] },
      { title: 'Extraincome', detail: [] },
      { title: 'Totalicome', total: 0 },
      { title: 'salary_permit', detail: [] }
    ],
    show: true
  };
  userDetails: any = {
    data: [
      { title: 'Basic Detail', detail: [], show: true },
      { title: 'Permanent Address', detail: [], show: true },
      { title: 'Corresponding Address', detail: [], show: true }
    ]
  };
  constructor(private dataService: DataserviceService) { }
  ngOnInit() {
    this.initJIT();
    callUrl({ mode: 'GETINITDATA' }, (resp: any) => {
      // tslint:disable-next-line: triple-equals
      if (resp != 'eNOTLOGGEDIN') {
        resp = JSON.parse(resp);
        console.log(resp);
        this.accesslevels = resp.accesslevels;
        this.posts = resp.posts;
        this.users = resp.users;
        const permission: any = {
          operation: 'Crud', data: [
            { type: 100, value: ['edit', 'delete'], show: true },
            { type: 2, value: ['edit'], show: true },
            { type: 3, show: false }]
        };
        // Perssion code
        this.users.forEach(permit => {
          if (!permit.boss) { // This condition is used to check root user
            this.loginuserid = permit.id;
            // tslint:disable-next-line: no-string-literal
            userAccess['image'] = atob(permit.picture);
            permission.data.forEach(perel => {
              // tslint:disable-next-line: triple-equals
              if (permit.permissions == perel.type) {// Below condition is use to check permission
                this.addButton = perel.show;
                this.userRecordbody.forEach(crdel => {
                  // tslint:disable-next-line: triple-equals
                  if (crdel.title == permission.operation) {
                    crdel.detail.forEach(stel => {
                      perel.value.forEach(valel => {
                        // tslint:disable-next-line: triple-equals
                        if (stel.name == valel) stel.show = perel.show;
                      });
                    });
                  }
                });
              }
            });
          }
          if ((permit.post >= 1) && (permit.post <= 3)) {
            // tslint:disable-next-line: no-string-literal
            userAccess['admin'] = true;
          }// Check Admin feature authority
        });
        // tslint:disable-next-line: no-shadowed-variable
        callUrl({ mode: 'NOTIFICATION', data: JSON.stringify({ whom: this.loginuserid }) }, (resp: any) => {
          // tslint:disable-next-line: no-string-literal
          userAccess['notification'] = JSON.parse(resp);
          this.dataService.setServicedata('portal', userAccess);
        });
        this.createDataTree(this.users);
      }
    });
  }
  addUserNode2GUI(user: any, mode: any, isPermanent: any = true) {
    switch (mode) {
      case 'addusers':
        this.users.push(user);
        this.createDataTree(this.users);
        swal('User Added', '', 'success');
        this.addUsers.hide();
        break;
      case 'deleteusers':
        console.log(user);
        // tslint:disable-next-line: only-arrow-functions
        this.users.forEach(function (item: any, index: any, object: any) {
          if (item.id === user.prid) object.splice(index, 1);
        });
        this.createDataTree(this.users);
        swal('Suuccesfully Deleted', '', 'success');
        this.hierachyView.hide();
        break;
      case 'updateuser':
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id === user.id) {
            this.users.splice(i, 1);
            i--;
          }
        }
        this.users.push(user);
        this.createDataTree(this.users);
        swal('Succesfully Updated', '', 'success');
        this.hierachyView.hide();
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
        // domElement.innerHTML = node.fname + + (node.mname ? node.mname + ' ' : '') + '  ' + node.lname;
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
        domElement.onclick = _ => { this.hierarchyViewdata(node); };
        domElement.onmouseover = _ => { $('#info' + domElement.id).show(); };
        domElement.onmouseout = _ => { $('#info' + domElement.id).hide(); };
      },
      onPlaceLabel: (domElement, node) => {
        const style = domElement.style;
        style.display = ''; style.cursor = 'pointer';
        if (node._depth <= 1) {
          style.fontSize = '1.2em';
          style.color = '#FFFFFF';
          // tslint:disable-next-line: triple-equals
        } else if (node._depth == 2) {
          style.fontSize = '1.2em';
          style.color = '#FFFFFF';
        } else {
          style.display = 'block';
          style.fontSize = '1.2em';
          style.color = '#FFFFFF';
        }
        // tslint:disable-next-line: radix
        const left = parseInt(style.left);
        const w = domElement.offsetWidth;
        style.left = (left - w / 7) + 'px';
      }
    });
  }
  changeIps_addGUIusers(mode: any) {
    switch (mode) {
      case 'usrAdd_post':
        this.selOfBoss = this.users;
        this.selOfTitle = ['Mr', 'Mrs', 'Ms'];
        this.selOfPermision = [
          { name: 'All Permission', value: '1' },
          { name: 'Read, Add, Update', value: '2' },
          { name: 'Only Read', value: '3' }];
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
    this.clickedUserid = data.id; // Get Id after clicked
    this.rootUserid = data.boss;  // Get Boss Id after clicked
    // Used for display current salary of clicked user
    this.userRecordbody.forEach(urel => {
      urel.detail.forEach(udel => {
        // tslint:disable-next-line: triple-equals
        if (udel.name == 'salaryslip') (data.current_salary == undefined) ? udel.title = '0' : udel.title = data.current_salary;
      });
    });
    // This object is used to show value and icon dynamically for UI
    const clickedData: any = {};
    // tslint:disable-next-line: no-string-literal
    this.users[0]['boss'] = data.boss;
    // tslint:disable-next-line: no-string-literal
    this.users[0]['email'] = this.users[0].mail;
    // Below code is used to make user detail for UI
    Object.keys(this.users[0]).forEach(el => { clickedData[el] = { value: data[el], icon: '' }; });
    // Below code is used to filter address field form clickedData object
    const recordArrray = [
      { key: 'houseno', icon: 'home' },
      { key: 'area', icon: 'road' },
      { key: 'city', icon: 'city' },
      { key: 'state', icon: 'flag' },
      { key: 'country', icon: 'globe' },
      { key: 'pincode', icon: 'keyboard' }
    ];
    recordArrray.forEach(makeedit => {
      Object.keys(clickedData).forEach(test1 => {
        if (test1.endsWith(makeedit.key)) clickedData[test1].icon = makeedit.icon;
      });
    });
    this.userDetails.data.forEach(el => { el.detail = []; });
    // Below code is used to store user data
    this.userDetails.data.forEach(clickel => {
      // tslint:disable-next-line: triple-equals
      if (clickel.title == 'Basic Detail') {
        clickel.detail.push({
          title: 'name',
          record: [
            { key: 'title', value: clickedData.title.value },
            { key: 'fname', value: clickedData.fname.value },
            { key: 'mname', value: clickedData.mname.value },
            { key: 'lname', value: clickedData.lname.value },
          ],
          icon: 'user',
          show: 'true'
        });
        clickel.detail.push({
          title: 'email',
          record: [
            { key: 'email', value: clickedData.email.value }],
          icon: 'envelope',
          // tslint:disable-next-line: triple-equals
          show: (clickedData.email.value == undefined || clickedData.email.value == '') ? false : true
        });
        clickel.detail.push({
          title: 'contactno',
          record: [
            { key: 'contactno', value: clickedData.contactno.value }],
          icon: 'phone',
          // tslint:disable-next-line: triple-equals
          show: (clickedData.contactno.value == undefined || clickedData.contactno.value == '') ? false : true
        });
      }
      // tslint:disable-next-line: triple-equals
      if (clickel.title == 'Permanent Address') Object.keys(clickedData).forEach(el => {
        if (el.startsWith('address_p')) {
          clickel.detail.push({
            title: el,
            record: [{ key: el, value: clickedData[el].value }],
            icon: clickedData[el].icon,
            // tslint:disable-next-line: triple-equals
            show: (clickedData[el].value == undefined || clickedData[el].value == 0 || clickedData[el].value == '') ? false : true
          });
        }
      });
      // tslint:disable-next-line: triple-equals
      if (clickel.title == 'Corresponding Address') Object.keys(clickedData).forEach(el => {
        if (el.startsWith('address_c')) {
          clickel.detail.push({
            title: el,
            record: [{ key: el, value: clickedData[el].value }],
            icon: clickedData[el].icon,
            // tslint:disable-next-line: triple-equals
            show: (clickedData[el].value == undefined || clickedData[el].value == 0 || clickedData[el].value == '') ? false : true
          });
        }
      });
    });
    const checkobj: any = { address_p: [], address_c: [] }; // Used to check defined values
    Object.keys(clickedData).forEach(el => {
      if (el.startsWith('address_p')) {
        // tslint:disable-next-line: triple-equals
        if (clickedData[el].value != '' || clickedData[el].value != 0) checkobj.address_p.push(clickedData[el].value);
      }
      if (el.startsWith('address_c')) {
        // tslint:disable-next-line: triple-equals
        if (clickedData[el].value != '' || clickedData[el].value != 0) checkobj.address_c.push(clickedData[el].value);
      }
    });
    this.userDetails.data.forEach(apel => {
      // tslint:disable-next-line: triple-equals
      if (apel.title == 'Permanent Address') (checkobj.address_p == 0) ? apel.show = false : apel.show = true;
      // tslint:disable-next-line: triple-equals
      if (apel.title == 'Corresponding Address') (checkobj.address_c == 0) ? apel.show = false : apel.show = true;
    });
    // this.userDetails.data.forEach(acel => { if(acel.title == 'Corresponding Address') acel.show = false });
    this.populateCalendarAttendance(data.id);
    this.callFunction('salaryslip_request');
    this.hierachyView.show();
  }
  clicked(mode: any) {
    switch (mode) {
      case 'addUser':
        this.addUsers.show();
        this.selOfPost = this.posts;
        break;
      case 'dismissAddusermodal':
        this.addUsers.hide();
        break;
      case 'dismissRecordmodal':
        this.hierachyView.hide();
        break;
      case 'editRecord':
        this.userRecordbody.forEach(parel => {
          // tslint:disable-next-line: triple-equals
          if (parel.title == 'Crud')
            // tslint:disable-next-line: triple-equals
            parel.detail.forEach(carel => { (carel.name == 'view') ? carel.show = true : carel.show = false; });
        });
        this.editabel = true;
        this.userDetails.data.forEach(el => {
          el.show = true;
          el.detail.forEach(coel => { coel.show = true; });
        });
        break;
      case 'viewRecord':
        this.userRecordbody.forEach(parel => {
          // tslint:disable-next-line: triple-equals
          if (parel.title == 'Crud') parel.detail.forEach(carel => {
            // tslint:disable-next-line: triple-equals
            (carel.name == 'edit') ? carel.show = true : carel.show = false;
            // tslint:disable-next-line: triple-equals
            if (carel.name == 'delete') carel.show = true;
          });
        });
        this.editabel = false;
        this.hierarchyViewdata(this.jitNodeData);
        break;
      case 'allotimgLoad':
        this.userRecordbody.forEach(parel => {
          // tslint:disable-next-line: triple-equals
          if (parel.title == 'Buttons') {
            parel.detail.forEach(carel => {
              // tslint:disable-next-line: triple-equals
              if (carel.name == 'cardimage') {
                // tslint:disable-next-line: triple-equals
                if (this.checkcardRecord.tagid == '') { carel.show = true; } else if (this.checkcardRecord.tagid != '') {
                  carel.show = false;
                  swal('Card Alloted', '', 'success');
                }
              }
            });
          }
        });
        break;
      case 'salaryslipclick':
        // tslint:disable-next-line: triple-equals
        (this.salaryslipJson.show == true) ? this.salaryslip.show() : swal('Salary Not found', '', 'info');
        break;
      case 'salmodaldismiss':
        this.salaryslip.hide();
        break;
      case 'printsalaryslip':
        const printsalInfo = this.printslip.nativeElement.innerHTML;
        const orignalContent = document.body.innerHTML;
        document.body.innerHTML = printsalInfo;
        window.print();
        document.body.innerHTML = orignalContent;
        window.location.reload();
        break;
      default:
        break;
    }
  }
  callFunction(mode: any) {
    // tslint:disable-next-line: prefer-const
    let requestObj = JSON.stringify({ tagdata: this.clickedUserid });
    switch (mode) {
      case 'cardallot':
        callUrl({ mode: 'CLEARASSOCIATION', data: requestObj }, (resp: any) => {
          // tslint:disable-next-line: triple-equals
          if (resp == '"success"') callUrl({ mode: 'GETCARDID', data: requestObj }, (resps: any) => {
            this.objectToarray(JSON.parse(resps), 'fromCardallot');
          });
        });
        break;
      case 'getcardid':
        // tslint:disable-next-line: triple-equals
        if (this.checkcardRecord.tagid == '')
          callUrl({ mode: 'GETCARDID', data: requestObj }, (resp: any) => {
            this.objectToarray(JSON.parse(resp), 'fromCardallot');
          });
        this.clicked('allotimgLoad');
        break;
      case 'deleteRecord':
        callUrl({ mode: 'DELETE_USERS', data: JSON.stringify({ prid: this.clickedUserid }) }, (resp: any) => {
          this.addUserNode2GUI(JSON.parse(resp), 'deleteusers');
        });
        break;
      case 'addusers':
        // tslint:disable-next-line: prefer-const
        let userData = {};
        $('.inputusers').each((_, r) => { userData[r.id.substr(7).toLowerCase()] = $(r).val(); });
        // tslint:disable-next-line: no-string-literal
        let i = 0; i++; userData['prid'] = (this.datetime).getTime() + i - 2678400;
        callUrl({ mode: 'REGISTER', data: JSON.stringify(userData) }, (resp: any) => {
          resp = JSON.parse(resp);
          // tslint:disable-next-line: no-string-literal
          resp['id'] = resp.prid;
          // tslint:disable-next-line: no-string-literal
          delete resp['prid'];
          this.addUserNode2GUI(resp, 'addusers');
        });
        break;
      case 'updateData':
        // tslint:disable-next-line: prefer-const
        let updObjt = {};
        $('.updatedetail').each((_, el) => { updObjt[el.id] = $(el).html(); });
        // tslint:disable-next-line: no-string-literal
        updObjt['prid'] = this.clickedUserid;
        // tslint:disable-next-line: no-string-literal
        updObjt['boss'] = this.rootUserid;
        callUrl({ mode: 'UPDATE_USERS', data: JSON.stringify(updObjt) }, (resp: any) => {
          resp = JSON.parse(resp);
          resp.id = resp.prid;
          // tslint:disable-next-line: no-string-literal
          delete resp['prid'];
          this.addUserNode2GUI(resp, 'updateuser');
        });
        break;
      case 'salaryslip_request':
        callUrl({ mode: 'SALARYSLIP', data: JSON.stringify({ prid: this.clickedUserid }) }, (resp: any) => {
          resp = JSON.parse(resp);
          this.salaryslipJson.data.forEach(salJson => { salJson.detail = []; });
          let salaryObj: any = {};
          // tslint:disable-next-line: triple-equals
          (resp.length == 0) ? this.salaryslipJson.show = false : this.salaryslipJson.show = true;
          resp.forEach(el => { salaryObj = el; });

          // code for userdetail
          // tslint:disable-next-line: prefer-const
          let userarray: any = [
            { key: 'fname', value: 'Firstname' },
            { key: 'lname', value: 'Lastname' },
            { key: 'createdAt', value: 'Date of Joining' }];
          this.users.forEach(usel => {
            // tslint:disable-next-line: triple-equals
            if (usel.id == salaryObj.prid) this.salaryslipJson.data.forEach(wrel => {
              userarray.forEach(nel => {
                // tslint:disable-next-line: triple-equals
                if (wrel.title == 'User Detail') wrel.detail.push({ head: nel.value, value: usel[nel.key] });
              });
            });
          });

          // code for display gross icome and calculation
          const grossincome: any = ['basic_salary', 'hra', 'ta', 'da', 'overtime', 'bonus', 'house_rent'];
          let calculategross = 0;
          grossincome.forEach(addel => { calculategross = calculategross + salaryObj[addel]; });
          // tslint:disable-next-line: no-string-literal
          salaryObj['grossincome'] = calculategross;
          grossincome.push('grossincome');
          grossincome.forEach(grossel => {
            this.salaryslipJson.data.forEach(wrel => {
              // tslint:disable-next-line: triple-equals
              if (wrel.title == 'Grossincome') wrel.detail.push({ head: grossel, value: salaryObj[grossel] });
            });
          });

          // code for display extra icome and calculation
          // tslint:disable-next-line: prefer-const
          let extraInList = ['medical', 'telephone_internet', 'other'];
          // tslint:disable-next-line: variable-name
          let calculate_extra = 0;
          extraInList.forEach(eil => { calculate_extra = calculate_extra + salaryObj[eil]; });
          // tslint:disable-next-line: no-string-literal
          salaryObj['extraincome'] = calculate_extra;
          extraInList.push('extraincome');
          this.salaryslipJson.data.forEach(wrsj => {
            // tslint:disable-next-line: triple-equals
            if (wrsj.title == 'Extraincome') extraInList.forEach(exel => { wrsj.detail.push({ head: exel, value: salaryObj[exel] }); });
          });

          // code for grand total
          // tslint:disable-next-line: triple-equals
          this.salaryslipJson.data.forEach(gtel => { if (gtel.title == 'Totalicome') gtel.total = calculategross + calculate_extra; });

          // code for display permission officer Id
          // tslint:disable-next-line: prefer-const
          let salaryslipPermit = ['prepared_by', 'check_by', 'authorised_by'];
          this.salaryslipJson.data.forEach(elpo => {
            // tslint:disable-next-line: triple-equals
            if (elpo.title == 'salary_permit') salaryslipPermit.forEach(spel => {
              elpo.detail.push({ head: spel, value: salaryObj[spel] });
            });
          });

          // Use to store current_salary into database
          callUrl({
            mode: 'CURRENT_SALARY',
            data: JSON.stringify({
              prid: this.clickedUserid,
              current_salary: calculategross + calculate_extra
            })
          }, () => { });
        });
        break;
    }
  }
  objectToarray(input: any, mode: any) {
    switch (mode) {
      case 'fromCardallot':
        let obj;
        input.forEach(el => { obj = el; });
        this.checkcardRecord = obj;
        this.callFunction('getcardid');
        break;
    }
  }
  populateCalendarAttendance(prid: any, dataInterest = moment()) {
    this.dataService.setServicedata('prid', prid);
    $('#calendar').hide();
    callUrl({
      mode: 'GETATTENDANCE',
      data: JSON.stringify({
        prid, month: dataInterest.month() + 1, year: dataInterest.year()
      })
    }, (resp: any) => {
      const attendance = JSON.parse(resp);
      let workinghours;
      // tslint:disable-next-line: triple-equals
      if (attendance.length != 0) {
        $('#calendar').show();
        $('#calendar').fullCalendar({ defaultDate: moment().format('YYYY-MM-DD'), editable: true, eventLimit: false });
        // tslint:disable-next-line: prefer-const
        let eventsCurrent = [];
        const intAtt = attendance.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
        for (let idx = 0; idx < intAtt.length; idx++) {
          const atUnixTime = moment(intAtt[idx].createdAt, 'YYYY-MM-DD HH:mm:SS').unix();
          if (intAtt[idx].mode === 'OUT') {
            let idxIn = idx;
            // tslint:disable-next-line: prefer-const
            let evt = { end: moment.unix(atUnixTime).format('YYYY-MM-DD HH:mm:SS') };
            while (idxIn-- > 0) {
              const possEnd = moment(intAtt[idxIn].createdAt, 'YYYY-MM-DD HH:mm:SS').format('YYYY-MM-DD HH:mm:SS');
              // tslint:disable-next-line: no-string-literal
              (intAtt[idxIn].mode === 'IN') ? evt['start'] = possEnd : evt.end = possEnd;
              if (intAtt[idxIn].mode === 'IN') break;
            }
            eventsCurrent.push(evt);
          }
        }
        eventsCurrent.forEach(pushtime => {
          // tslint:disable-next-line: prefer-const
          let startTime = moment(pushtime.start, 'YYYY-MM-DD HH:mm:SS');
          const endTime = moment(pushtime.end, 'YYYY-MM-DD HH:mm:SS');
          workinghours = endTime.diff(startTime, 'hours');
          pushtime.title = (workinghours + 1) + ' hrs';
        });
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', eventsCurrent);
      }
    });
  }
}
