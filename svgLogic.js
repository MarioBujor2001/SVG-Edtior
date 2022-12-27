var svg = document.getElementById('svg');
var svgNS = svg.namespaceURI;
var ids = 0;
var mousepozEdit = {
    x: 10,
    y: 10
}

var mousepozDraw = {
    x: 10,
    y: 10
}

var mouseState = 0;
var figureStare = 0;
var callingFigureId = 0;
var forDeleteId = 0;

class Circle {
    static TYPE = 'circle';
    constructor(fill, stroke, stroke_width, cx, cy, r) {
        this.fill = fill;
        this.stroke = stroke;
        this.stroke_width = stroke_width;
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    get Fill() {
        return this.fill;
    }
    set Fill(v) {
        this.fill = v;
    }
    get Stroke() {
        return this.stroke;
    }
    set Stroke(v) {
        this.stroke = v;
    }
    get Stroke_width() {
        return this.stroke_width;
    }
    set Stroke_width(v) {
        this.stroke_width = v;
    }
    get Cx() {
        return this.cx;
    }
    set Cx(v) {
        this.cx = v;
    }
    get Cy() {
        return this.cy;
    }
    set Cy(v) {
        this.cy = v;
    }
    get R() {
        return this.r;
    }
    set R(v) {
        this.r = v;
    }

    values() {
        return {
            id: ++ids,
            cx: this.cx,
            cy: this.cy,
            r: this.r,
            fill: this.fill,
            'stroke-width': this.stroke_width
        }
    }

    factory() {
        let element = document.createElementNS(svgNS, Circle.TYPE);
        let valori = this.values();
        for (let val in valori) {
            element.setAttributeNS(null, val, valori[val])

            element.onmousedown = function (e) {
                console.log('apel MD')
                callingFigureId = element.attributes.id.value;
                console.log(callingFigureId);
                e.stopPropagation();
                mousepozEdit.x = e.clientX;
                mousepozEdit.y = e.clientY;
                if (e.button == 0) {
                    figureStare = 1;
                }
            }
            element.onmousemove = function (e) {
                console.log('apel MM')
                e.stopPropagation();
                if (figureStare == 1) {
                    mousepozEdit.x = e.clientX;
                    mousepozEdit.y = e.clientY;
                }
            }
            element.onmouseup = function (e) {
                console.log('apel MU')
                callingFigureId = 0;
                e.stopPropagation();
                if (figureStare == 1) {
                    figureStare = 0;
                }
            }
            element.oncontextmenu = function (e) {
                e.stopPropagation();
                forDeleteId = element.attributes.id.value;
            }
        }
        return element;
    }
}
class Rect {
    static TYPE = 'rect';
    constructor(fill, stroke, stroke_width, x, y, w, h) {
        this.fill = fill;
        this.stroke = stroke;
        this.stroke_width = stroke_width;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get Fill() {
        return this.fill;
    }
    set Fill(v) {
        this.fill = v;
    }
    get Stroke() {
        return this.stroke;
    }
    set Stroke(v) {
        this.stroke = v;
    }
    get Stroke_width() {
        return this.stroke_width;
    }
    set Stroke_width(v) {
        this.stroke_width = v;
    }
    get X() {
        return this.x;
    }
    set X(v) {
        this.x = v;
    }
    get Y() {
        return this.y;
    }
    set Y(v) {
        this.y = v;
    }
    get H() {
        return this.h;
    }
    set H(v) {
        this.h = v;
    }
    get W() {
        return this.w;
    }
    set W(v) {
        this.w = v;
    }

    values() {
        return {
            id: ++ids,
            x: this.x,
            y: this.x,
            width: this.w,
            height: this.h,
            fill: this.fill,
            'stroke-width': this.stroke_width
        }
    }

    factory() {
        let element = document.createElementNS(svgNS, Rect.TYPE);
        let valori = this.values();
        // console.log(valori)
        for (let val in valori) {
            element.setAttributeNS(null, val, valori[val])
        }
        element.onmousedown = function (e) {
            callingFigureId = element.attributes.id.value;
            e.stopPropagation();
            mousepozEdit.x = e.clientX;
            mousepozEdit.y = e.clientY;
            if (e.button == 0) {
                figureStare = 1;
            }
        }
        element.onmousemove = function (e) {
            e.stopPropagation();
            if (figureStare == 1) {
                mousepozEdit.x = e.clientX;
                mousepozEdit.y = e.clientY;
            }
        }
        element.onmouseup = function (e) {
            callingFigureId = 0;
            e.stopPropagation();
            if (figureStare == 1) {
                figureStare = 0;
            }
        }
        return element;
    }
}
class CurrentDrawing {
    static inputThickness = document.getElementById('thicknessSlider');
    static inputColor = document.getElementById('colorPicker');
    static isEdit = document.getElementById('edit');
    static isDraw = document.getElementById('draw');
    static elements = [];
    static deletedElements = [];

    static undo() {
        if (CurrentDrawing.elements.length != 0) {
            // console.log(svg.getElementById(CurrentDrawing.elements[CurrentDrawing.elements.length - 1].id))
            svg.removeChild(svg.getElementById(CurrentDrawing.elements[CurrentDrawing.elements.length - 1].id));
            let e = CurrentDrawing.elements.pop();
            CurrentDrawing.deletedElements.push(e);
            console.log('deleted one')
        }
    }
    static redo() {
        if (CurrentDrawing.deletedElements.length != 0) {
            let toAdd = CurrentDrawing.deletedElements.pop();
            svg.appendChild(toAdd);
            CurrentDrawing.elements.push(toAdd);
            console.log('added one');
        }
    }

    static addOne(svgElement) {
        svgElement.Stroke_width = CurrentDrawing.inputThickness.value;
        svgElement.Fill = CurrentDrawing.inputColor.value;
        svgElement.Stroke = CurrentDrawing.inputColor.value;
        // return obiect html
        let e = svgElement.factory();
        svg.appendChild(e);
        CurrentDrawing.elements.push(e)
    }
    static clearScreen() {
        console.log(CurrentDrawing.elements);
        for (let i = 0; i < CurrentDrawing.elements.length; i++) {
            svg.removeChild(svg.getElementById(CurrentDrawing.elements[i].id));
        }
        // retin tot ce am sters pt redo
        CurrentDrawing.deletedElements = CurrentDrawing.elements;
        CurrentDrawing.elements = [];
    }
}

svg.onmousedown = function (e) {

    pozitie = svg.getBoundingClientRect();
    mousepozDraw.x = e.clientX;
    mousepozDraw.y = e.clientY;
    if (e.button == 0) {
        mouseState = 1;
    }
}
svg.onmousemove = function (e) {

    if (mouseState == 1) {
        mousepozDraw.x = e.clientX;
        mousepozDraw.y = e.clientY;
    }
}
svg.onmouseup = function (e) {

    if (mouseState == 1) {
        mouseState = 0;
    }
}

svg.oncontextmenu = function (e) {
    e.preventDefault();
}

function desen() {
    if (mouseState == 1) {
        let c = new Circle('any', 'any', 'any',
            mousepozDraw.x + 10,
            mousepozDraw.y + 10,
            CurrentDrawing.inputThickness.value);
        // console.log(c)
        // desenez pe ecran
        CurrentDrawing.addOne(c);
    }
}

function mutaElement() {
    if (figureStare == 1) {
        // ce element html e in momentul de fata clicked
        if (callingFigureId != 0) {
            figura = svg.getElementById(callingFigureId);
            if (figura && figura.nodeName == 'circle') {
                figura.attributes.cx.value = mousepozEdit.x;
                figura.attributes.cy.value = mousepozEdit.y;
            } else if (figura && figura.nodeName == 'rect') {
                figura.attributes.x.value = mousepozEdit.x - 1 / 2 * (figura.attributes.height.value);
                figura.attributes.y.value = mousepozEdit.y - 1 / 2 * (figura.attributes.width.value);
            }
            svg.removeChild(figura);
            svg.appendChild(figura);
        }
    }
}

// function stergeSelectat() {
//     if (forDeleteId != 0) {
//         svg.removeChild(document.getElementById(forDeleteId));
//         CurrentDrawing.
//     }
// }

// window.addEventListener('keypress', (e) => {
//     console.log(e.code)
// })

// function decide() {
//     if (CurrentDrawing.isEdit.checked) {
//         mouseState = 0;
//         mutaElement();
//     } else if (CurrentDrawing.isDraw.checked) {
//         figureStare = 0;
//         desen();
//     }
// }
// window.setInterval(decide, 10);
window.setInterval(desen, 10);
window.setInterval(mutaElement, 10);
