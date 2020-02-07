var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

function init(){
    // init data
    
    var json = {
      id: "190_0",  // Admin
      name: "Chairmain",
      children: [
        // Employee Data Maintenence
          {
            id: "306208_1",
            name:"Employee Data Maintenence",
            data: {
              relation: "<h4></h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: collaboration)</div></li><li>Cypress Hill <div>(relation: collaboration)</div></li></ul>"
            }
          },
        // Employee and manager self service
          {
            id: "306208_0",
            name: "Employee and manager self service",
            data: {
              relation: "<h4>Neil Young & Pearl Jam</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: collaboration)</div></li><li>Neil Young <div>(relation: collaboration)</div></li></ul>"
            }
          },
         //Attendence
          {
            id: "236797_5",
            name: "Attendence",
            data: {
              relation: "<h4>Jeff Ament</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Temple of the Dog <div>(relation: member of band)</div></li><li>Mother Love Bone <div>(relation: member of band)</div></li><li>Green River <div>(relation: member of band)</div></li><li>M.A.C.C. <div>(relation: collaboration)</div></li><li>Three Fish <div>(relation: member of band)</div></li><li>Gossman Project <div>(relation: member of band)</div></li></ul>"
                },
            children: [{
                id: "1756_6",
                name: "Time & Attendence",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                     }
                },
                {
                id: "14581_7",
                name: "Face Recognition System (Single)",
                data:{
                    relation: "<h4>Mother Love Bone</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                     },
                }]
          },
          //Training and skills development
          {
           id:"32323_6",
           name:"Training and skills development",
           data:{
              relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
            },
                                    //+//
           children:[
             //1
              {
              id:"32323_1",
              name:" Strategic business priorities",
              data:{
                relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
              }
             },
             //2
             {
              id:"32323_2",
              name:"Training needs analysis",
              data:{
                relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
              },
              children:[
                        {
                          id:"23323_1",
                          name:"Reporting",
                          data:{
                            relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                           }
                        },
                        {
                          id:"23323_2",
                          name:"Learning programs selection",
                          data:{
                            relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                           }
                        },
                        {
                          id:"23323_4",
                          name:"Racking progress",
                          data:{
                            relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                           }
                        }
                      ]
             },
             //3
             {
              id:"32323_3",
              name:"Skill audit",
              data:{
                relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
              }
             }
            ]
                             //+//
           },
           //Performance managment
           {
            id:"32323_0",
            name:"Performance managment",
            data:{
              relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
            },
            children:[
              {
                id:"2332",
                name:"Setting Performance Goals",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
              },
              {
                id:"23232",
                name:"Delegating Responsibilities",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
              },
              {
                id:"09832",
                name:"Coaching for commitment",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
              },
              {
                id:"232323",
                name:"Motivating and Recognizing",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
              },
              {
                id:"0988",
                name:"Evaluating Performance",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
              },
              {
                id:"098",
                name:"PLanning career development",
                data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
              }
            ]
           },
           //Account
           {
             id:"12313",
             name:"Account",
             data:{
              relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
             },
             children:[
               {
                id:"1909090",
                name:"Salary Managmentt",
                data:{
                 relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                }
               },
               {
                id:"1909091",
                name:"Loan Managment ",
                data:{
                 relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                }
               }
             ]
           },
           //Tracking
           {
            id:"098098",
            name:"Tracking",
            data:{
             relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
            },
            children:[
              {
                id:"34343",
                 name:"Assets Tracking",
                 data:{
                 relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                 }
              },
              {
                id:"23343",
                 name:"Project/Task Tracking",
                 data:{
                 relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                 }
              }
            ]
           },
           //Payroll
           {
            id:"56566",
             name:"Payroll",
             data:{
             relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
             },
             children:[
                 {
                  id:"565634",
                  name:"Master",
                  data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                  }
                 },
                 {
                  id:"565635",
                  name:"Employee",
                  data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                  }
                 },
                 {
                  id:"565678",
                  name:"Payroll",
                  data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                  }
                },
                {
                  id:"56589",
                  name:"Security",
                  data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                  }
                },
                {
                  id:"56509",
                  name:"Report",
                  data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                  }
                },
                {
                  id:"565987",
                  name:"Statuory Complaince",
                  data:{
                  relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                  }
                },
             ]
           },
           //Reimbursement Managment
           {
             id:"2342334",
             name:"Reimbursement Managment",
             data:{
              relation:"<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
             }
           },
           //HR Helpdesk
           {
            id:"234564",
            name:"HR Helpdesk",
            data:{
             relation:"<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
            }
           }
         ]
       }
    //end
    
    //init RGraph
    var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //Optional: create a background canvas that plots
        //concentric circles.
        background: {
          CanvasStyles: {
            strokeStyle: '#555'
          }
        },
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: true,
          panning: true,
          zooming: 10
        },
        //Set Node and Edge styles.
        Node: {
            color: '#ddeeff'
        },
        
        Edge: {
          color: '#C17878',
          lineWidth:1.5
        },

        onBeforeCompute: function(node){
            Log.write("centering " + node.name + "...");
            //Add the relation list in the right column.
            //This list is taken from the data property of each JSON node.
            $jit.id('inner-details').innerHTML = node.data.relation;
        },
        
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                rgraph.onClick(node.id, {
                    onComplete: function() {
                        Log.write("done");
                    }
                });
            };
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                style.fontSize = "0.8em";
                style.color = "#ccc";
            
            } else if(node._depth == 2){
                style.fontSize = "0.7em";
                style.color = "#494949";
            
            } else {
                style.display = 'none';
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 5) + 'px';
        }
    });
    //load JSON data
    rgraph.loadJSON(json);
    //trigger small animation
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
    //end
    //append information about the root relations in the right column
    $jit.id('inner-details').innerHTML = rgraph.graph.getNode(rgraph.root).data.relation;
}
