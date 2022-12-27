var svg = document.getElementById('svg');
var svgNS = svg.namespaceURI;
var inputThickness = document.getElementById('thicknessSlider');
var inputColor = document.getElementById('colorPicker');

var elements = [];
var deletedElements = [];

var ids = 0;

var mousepoz = { x: 10, y: 10 };
var pozitieInPatrat = { x: 0, y: 0 };

var thickness;
var color;

function updateThickness() {
    thickness = inputThickness.value;
}
function updateColor() {
    color = inputColor.value;
}

function undo() {
    if (elements.length != 0) {
        svg.removeChild(svg.getElementById(elements[elements.length - 1].id));
        let e = elements.pop();
        deletedElements.push(e);
        console.log('deleted one')
    }
}

function redo() {
    if (deletedElements.length != 0) {
        let toAdd = deletedElements.pop();
        svg.appendChild(toAdd);
        elements.push(toAdd);
        console.log('added one')
    }
}

function creazaElem(nume, valori) {
    nume = document.createElementNS(svgNS, nume);
    for (val in valori) {
        nume.setAttributeNS(null, val, valori[val]);
    }
    nume.addEventListener('mousedown', (e) => {
        if (nume.nodeName === 'rect') {
            console.log(nume.attributes.x.value)
            console.log(nume.attributes.y.value)
        }
        if (nume.nodeName === 'circle') {
            console.log(nume.attributes.cx.value)
            console.log(nume.attributes.cy.value)
        }
        e.stopPropagation();
        if (e.button == 0) {
            miscare = 1;
        }
    })
    return nume;
}
function createRect() {
    updateThickness();
    updateColor();
    var r = creazaElem('rect', {
        id: ++ids,
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: color,
        stroke: 'red',
        'stroke-width': thickness
    });
    svg.appendChild(r);
    elements.push(r);
}
function createCircle() {
    updateThickness();
    updateColor();
    var r = creazaElem('circle', {
        id: ++ids,
        cx: 80,
        cy: 80,
        r: 80,
        fill: color,
        stroke: 'black',
        'stroke-width': thickness
    });
    svg.appendChild(r);
    elements.push(r);
}

function getElements() {
    console.log(elements);
    // console.log(thickness);
    for (i = 0; i < elements.length; i++) {
        // console.log(elements[i])
        // console.log(svg.getElementById(elements[i].id))
        svg.removeChild(svg.getElementById(elements[i].id));
        ids--;
    }
    elements = []
}

//0 nu am dat click
//1 tin click si misc
miscare = 0;

svg.onmousedown = function (e) {
    console.log('first')
    pozitie = svg.getBoundingClientRect();
    mousepoz.x = e.clientX - pozitie.x;
    mousepoz.y = e.clientY - pozitie.y;

    if (e.button == 0) {
        miscare = 1;
        // pozitieInPatrat.x = mousepoz.x - desen.x;
        // pozitieInPatrat.y = mousepoz.y - desen.y;
    }
}

svg.onmousemove = function (e) {
    if (miscare == 1) {
        mousepoz.x = e.clientX;
        mousepoz.y = e.clientY;
    }
}
svg.onmouseup = function (e) {
    if (miscare == 1) {
        miscare = 0;
    }
}

svg.oncontextmenu = function (e) {
    e.preventDefault();
    updateColor();
    console.log(svg.style.background);
    svg.style.background = color
    console.log(color)
}

function desen() {
    // getElements();
    //daca e mouse apasat
    if (miscare == 1) {
        updateThickness();
        updateColor();
        // console.log(thickness)
        var r = creazaElem('circle', {
            id: ++ids,
            cx: mousepoz.x,
            cy: mousepoz.y,
            r: thickness,
            fill: color,
            stroke: color,
            'stroke-width': '1'
        });
        svg.appendChild(r);
        elements.push(r);
    }
}
window.setInterval(desen, 5);

class FormaSVG {

    constructor(tip, fill, stroke, x, y, valori) {
        this.tip = tip;
        this.fill = fill;
        this.stroke = stroke;
        this.x = x;
        this.y = y;
        this.element = this.factory(valori)
    }

    get elementVal() {
        return this.element;
    }

    set elementVal(v) {
        this.element = v;
    }

    get xVal() {
        return this.x;
    }

    set xVal(v) {
        this.x = v;
    }

    get tipVal() {
        return this.tip;
    }

    set tipVal(v) {
        this.tip = v;
    }

    factory(valori) {
        nume = document.createElementNS(svgNS, tip);
        for (val in valori) {
            nume.setAttributeNS(null, val, valori[val]);
        }
        nume.addEventListener('mousedown', (e) => {
            if (nume.nodeName === 'rect') {
                console.log(nume.attributes.x.value)
                console.log(nume.attributes.y.value)
            }
            if (nume.nodeName === 'circle') {
                console.log(nume.attributes.cx.value)
                console.log(nume.attributes.cy.value)
            }
            e.stopPropagation();
            if (e.button == 0) {
                miscare = 1;
            }
        })
        return nume;
    }

}

// class RectSVG extends FormaSVG {
// constructor(tip, fill, x, y, valori)
// }

// forma = new FormaSVG('blue', 'blue', 'blue', 10, 10);
// forma.xVal = 20
// console.log(forma.tip)


