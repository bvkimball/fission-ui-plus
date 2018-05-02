import {Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter, AfterViewInit, ViewChild, AfterContentChecked} from '@angular/core';

declare var cytoscape: any;

@Component({
    selector: 'app-cytoscape',
    template: `
        <div id="cy" #gph></div>
    `,
    styles: [`#cy {
        height: 100%;
        width: 100%;
        position: relative;
        left: 0;
        top: 0;
        z-index: 999;
    }`]
})
export class CytoscapeComponent implements OnChanges, AfterContentChecked {

    @Input() public elements: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;

    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('gph') gph;
    private isVisible = false;

    public constructor(private renderer: Renderer, private el: ElementRef) {

        this.layout = this.layout || {
                name: 'grid',
                directed: true,
                padding: 0
            };

        this.zoom = this.zoom || {
                min: 0.1,
                max: 1.5
            };

        this.style = this.style || cytoscape.stylesheet()
            .selector('node')
            .css({
                'shape': 'data(shapeType)',
                'width': 'mapData(weight, 40, 80, 20, 100)',
                'content': 'data(name)',
                'text-valign': 'center',
                'text-outline-width': 1,
                'text-outline-color': 'data(colorCode)',
                'background-color': 'data(colorCode)',
                'color': '#fff',
                'font-size': 10
            })
            .selector(':selected')
            .css({
                'border-width': 1,
                'border-color': 'black'
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'opacity': 0.666,
                'width': 'mapData(strength, 70, 100, 2, 6)',
                'target-arrow-shape': 'triangle',
                'line-color': 'data(colorCode)',
                'source-arrow-color': 'data(colorCode)',
                'target-arrow-color': 'data(colorCode)'
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'dotted',
                'target-arrow-shape': 'diamond'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            });
    }

    public ngOnChanges(): any {
        this.render();
        console.log(this.el.nativeElement);
    }

    public ngAfterContentChecked(): void {
        if (this.isVisible === false && this.gph.nativeElement.offsetParent != null) {
            console.log('isVisible switched from false to true');
            this.isVisible = true;
            this.render();
        } else if (this.isVisible === true && this.gph.nativeElement.offsetParent == null) {
            console.log('isVisible switched from true to false');
            this.isVisible = false;
        }
    }

    public render() {
        console.log('RENDER');
      const localselect = this.select;
      const cy = cytoscape({
            container : this.el.nativeElement.querySelector('#cy'),
            layout: this.layout,
            minZoom: this.zoom.min,
            maxZoom: this.zoom.max,
            boxSelectionEnabled: false,
            autounselectify: true,
            zoomingEnabled: false,
            style: this.style,
            elements: this.elements,
        });


        cy.on('tap', 'node', function(e) {
            const node = e.cyTarget;
            console.log('clicked', e.target, node);
            // localselect.emit(node.data('name'));
        });
    }

}
