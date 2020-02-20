// tslint:disable: curly
import { Component, OnInit } from '@angular/core';
import { callUrl } from '../ajaxes';

declare var $jit: any;

let rgraph: any;

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  graphData: any;
  showTree: any;

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
        // domElement.onclick = _ => { this.hierarchyViewdata(node) }
        // domElement.onmouseover = _ => { $('#info' + domElement.id).show() }
        // domElement.onmouseout = _ => { $('#info' + domElement.id).hide() }
      },
    });
  }

  createDataTree(dataset) { // legacy code to convert flat data to hirarechy
    const hashTable = Object.create(null);
    dataset.forEach(aData => hashTable[aData.id] = { ...aData, children: [] });
    const dataTree = [];
    dataset.forEach(aData => {
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
  ngOnInit() {
    this.initJIT();
    callUrl({mode: 'GETINITDATA'}, (resp: string) => {
      resp = JSON.parse(resp);
      // this.createDataTree(resp)
      console.log(resp);
    });
  }

}
