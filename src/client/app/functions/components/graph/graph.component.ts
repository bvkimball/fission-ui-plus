import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-graph',
    template: '<app-cytoscape [elements]="graphData" [layout]="layout" ></app-cytoscape>',
    styles: [`
      app-cytoscape {
        height: 100vh;
        float: left;
        width: 100%;
        padding: 20px;
        position: relative;
    }`],
})
export class GraphComponent {

    @Input() set data(value: any) {
        const nodes = Object.keys(value.tasks).map((key) => {
            return {
                data: Object.assign({
                    id: this.uuidv4(),
                    name: key,
                    colorCode: (value.output === key) ? 'red' : 'blue',
                    shapeType: 'roundrectangle',
                    weight: 100
                }, value.tasks[key])
            };
        });
        const edges = [];
        nodes.forEach((node: any) => {
            if ( node.data.requires && node.data.requires.length ) {
                node.data.requires.forEach((taskName: string) => {
                    const task: any = nodes.find((n: any) => n.data.name === taskName);
                    edges.push({
                        data: {
                            source: task.data.id, target: node.data.id, colorCode: 'blue', strength: 10
                        }
                    });
                });
            }
        });
        this.graphData = {
            nodes: nodes,
            edges: edges
        };
        console.log(this.graphData);
        // console.log(this.workflow);
    }

    layout = {
        name: 'dagre',
        rankDir: 'LR',
        directed: true,
        padding: 0
    };

    graphData = {
        nodes: [
            { data: { id: 'a', name: 'Signup', weight: 100, colorCode: 'blue', shapeType: 'roundrectangle' } },
            { data: { id: 'b', name: 'User Profile', weight: 100, colorCode: 'magenta', shapeType: 'roundrectangle' } },
            { data: { id: 'c', name: 'Billing', weight: 100, colorCode: 'magenta', shapeType: 'roundrectangle' } },
            { data: { id: 'd', name: 'Sales', weight: 100, colorCode: 'orange', shapeType: 'roundrectangle' } },
            { data: { id: 'e', name: 'Referral', weight: 100, colorCode: 'orange', shapeType: 'roundrectangle' } },
            { data: { id: 'f', name: 'Loan', weight: 100, colorCode: 'orange', shapeType: 'roundrectangle' } },
            { data: { id: 'j', name: 'Support', weight: 100, colorCode: 'red', shapeType: 'roundrectangle' } },
            { data: { id: 'k', name: 'Sink Event', weight: 100, colorCode: 'green', shapeType: 'roundrectangle' } }
        ],
        edges: [
            { data: { source: 'a', target: 'b', colorCode: 'blue', strength: 10 } },
            { data: { source: 'b', target: 'c', colorCode: 'blue', strength: 10 } },
            { data: { source: 'c', target: 'd', colorCode: 'blue', strength: 10 } },
            { data: { source: 'c', target: 'e', colorCode: 'blue', strength: 10 } },
            { data: { source: 'c', target: 'f', colorCode: 'blue', strength: 10 } },
            { data: { source: 'e', target: 'j', colorCode: 'red', strength: 10 } },
            { data: { source: 'e', target: 'k', colorCode: 'green', strength: 10 } }
        ]
    };

    constructor() {
    }

    private uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          // tslint:disable-next-line:no-bitwise
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
}
