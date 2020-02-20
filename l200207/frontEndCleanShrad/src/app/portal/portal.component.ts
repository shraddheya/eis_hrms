// tslint:disable: curly
import { Component, OnInit, ViewChild } from '@angular/core';
import { callUrl } from '../ajaxes';
import { ModalDirective } from 'angular-bootstrap-md';
//import { runInThisContext } from 'vm';

declare var $jit: any;

let rgraph: any;

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {
  @ViewChild('addUsers', { static: true }) addUsers: ModalDirective;
  graphData: any;
  showTree: any;
  posts: any;
  accesslevels: any;
  users: any;
  adduserBosslist = {show:false}
  adduserAlldetail = {show:false}
  selOfBoss: any;
  selOfPost: any;
  selOfTitle: any;
  selOfPermision: any;
  constructor() { }


  initJIT() {
    rgraph = new $jit.RGraph({
      injectInto: 'hierarchy',
      background: { CanvasStyles: { strokeStyle: '#ccc' } },
      Navigation: { enable: true, panning: true, zooming: 7 },
      Node: { color: '#FFFFFF' },
      Edge: { color: '#C0C0C0', lineWidth: 1.4, spline: false },
      onCreateLabel: (domElement, node) => {
        domElement.innerHTML = node.fname +  + (node.mname ? node.mname + ' ' : '') + '  ' + node.lname;
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
              <div class="row">
               <div class="col-2">UserID</div>
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
    });
  }
  changeIps_addGUIusers(mode) {
    switch (mode) {
      case "usrAdd_post":
        this.selOfBoss = this.users;
        this.selOfTitle = ["Mr","Mrs","Ms"];
        this.selOfPermision = [{name:"All Permission",value:"1"},{name:"Read, Add, Update",value:"2"},{name:"Only Read",value:"3"},]
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
    console.log(data)
  }
  clicked(mode){
   switch(mode){
     case 'addUser':
       this.addUsers.show();
       this.selOfPost = this.posts
       break;
      case 'dismissAddusermodal':
       this.addUsers.hide();
       break;
      default:
        break;
   }
  }
  mainupulationSend(mode) {
    switch (mode) {
      case ('addusers'):
        var userData = {}
        $('.inputusers').each((_, r) => { userData[r.id.substr(7).toLowerCase()] = $(r).val() })
        var i = 0; i++; userData["prid"] = (new Date).getTime() + i - 2678400;
        callUrl({ mode: "REGISTER", data: JSON.stringify(userData) }, res => {
          console.log(res)
        })
        return
      }
  }
  ngOnInit() {
    this.initJIT();
    callUrl({mode: 'GETINITDATA'}, (resp: any) => {
      resp = JSON.parse(resp);
      this.accesslevels = resp.accesslevels;
      this.posts = resp.posts;
      this.users = resp.users;
      this.createDataTree(this.users);
      console.log(resp);
    });
  }
}