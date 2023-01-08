var ids = 0;
var inputColor = document.getElementById('colorPicker');
var inputThickness = document.getElementById('thicknessSlider');
var inputStrokeColor = document.getElementById('strokeColorPicker');
var inputBackgroundColor = document.getElementById('backgroundColorPicker');

var pressingM = false;
var pressingLeft = false;

var svg = document.getElementById('svg');
var drawSquare = document.getElementById('drawSquare');
var drawCircle = document.getElementById('drawCircle');
var drawPoly = document.getElementById('drawPoly');
var drawePolyLine = document.getElementById('drawPolyLine')

// constants:
var M_LEFT = 0, M_RIGHT = 2, M_MIDD = 1, DEL = 8;
var x1 = 0, y1 = 0;
var selected = null;
var currentFigure = 'rect';
var allElements = [];
var deletedElements = [];

function deleteAll() {
    while (allElements.length != 0) {
        deletedElements.push(svg.lastChild);
        svg.removeChild(svg.lastChild);
        allElements.pop();
    }
}

function undo() {
    if (allElements.length != 0) {
        deletedElements.push(svg.lastChild);
        svg.removeChild(svg.lastChild);
        allElements.pop();
    }
}

function redo() {
    if (deletedElements.length != 0) {
        allElements.push(deletedElements.pop());
        svg.appendChild(allElements[allElements.length - 1]);
    }
}

function updateFigure(figureName) {
    currentFigure = figureName
    console.log(figureName)
}

function setSelectionCoords(type, object, x1, y1, x2, y2) {
    switch (type) {
        case 'rect': {
            object.setAttributeNS(null, "x", Math.min(x1, x2));
            object.setAttributeNS(null, "y", Math.min(y1, y2));
            object.setAttributeNS(null, "width", Math.max(x1, x2) - Math.min(x1, x2));
            object.setAttributeNS(null, "height", Math.max(y1, y2) - Math.min(y1, y2));
            break;
        }
        case 'poly': {
            object.setAttributeNS(null, "points", `${(x1 + x2) / 2},${Math.min(y1, y2)} 
			        ${Math.max(x1, x2)},${(y1 + y2) / 2}
			        ${(x1 + x2) / 2},${Math.max(y1, y2)}
			        ${Math.min(x1, x2)},${(y1 + y2) / 2}`)
            break;
        }
        case 'circle': {
            object.setAttributeNS(null, "cx", (x1 + x2) / 2)
            object.setAttributeNS(null, "cy", (y1 + y2) / 2)
            object.setAttributeNS(null, "rx", (Math.max(x1, x2) - Math.min(x1, x2)) / 2)
            object.setAttributeNS(null, "ry", (Math.max(y1, y2) - Math.min(y1, y2)) / 2)
            break;
        }
        case 'polyline': {
            if (x2 == null && y2 == null) {
                object.setAttributeNS(null, "points", `${x1},${y1}`);
            } else {
                points = object.getAttribute('points');
                points += ` ${x2},${y2}`
                object.setAttributeNS(null, "points", points);
            }
        }
    }
}

svg.onmousedown = function (event) {
    console.log('svg.mousedown')
    if (event.button == M_LEFT) {
        x1 = event.pageX - this.getBoundingClientRect().left;
        y1 = event.pageY - this.getBoundingClientRect().top;
        if (currentFigure == 'rect') {
            setSelectionCoords(currentFigure, drawSquare, x1, y1, x1, y1);
            drawSquare.style.display = 'block';
        }
        if (currentFigure == 'circle') {
            setSelectionCoords(currentFigure, drawCircle, x1, y1, x1, y1);
            drawCircle.style.display = 'block';
        }
        if (currentFigure == 'poly') {
            setSelectionCoords(currentFigure, drawPoly, x1, y1, x1, y1);
            drawPoly.style.display = 'block';
        }
        if (currentFigure == 'polyline') {
            setSelectionCoords(currentFigure, drawePolyLine, x1, y1, null, null);
            drawePolyLine.style.display = 'block';
        }
    }
    if (event.button == M_RIGHT) {
        let elements = document.querySelectorAll('#svg *');
        elements.forEach(el => el.classList.remove('Selected'));
        selected = null;
        console.log('deselected')
    }
}
svg.onmousemove = function (event) {
    console.log('svg.mousemove')

    x2 = event.pageX - this.getBoundingClientRect().left;
    y2 = event.pageY - this.getBoundingClientRect().top;
    if (currentFigure == 'rect') {
        setSelectionCoords(currentFigure, drawSquare, x1, y1, x2, y2);
    }
    if (currentFigure == 'circle') {
        setSelectionCoords(currentFigure, drawCircle, x1, y1, x2, y2);
    }
    if (currentFigure == 'poly') {
        setSelectionCoords(currentFigure, drawPoly, x1, y1, x2, y2);
    }
    if (currentFigure == 'polyline') {
        if (x1 && y1 && event.button == M_LEFT) {
            setSelectionCoords(currentFigure, drawePolyLine, x1, y1, x2, y2);
        }
    }
}
svg.onmouseup = function (event) {
    console.log('svg.mouseup')

    if (event.button == M_LEFT) {
        x2 = event.pageX - this.getBoundingClientRect().left;
        y2 = event.pageY - this.getBoundingClientRect().top;

        drawCircle.style.display = 'none';
        drawPoly.style.display = 'none';
        drawSquare.style.display = 'none';
        drawePolyLine.style.display = 'none';

        switch (currentFigure) {
            case 'rect': {
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
                setSelectionCoords(currentFigure, newElement, x1, y1, x2, y2);
                newElement.setAttributeNS(null, 'fill', inputColor.value);
                break;
            }
            case 'poly': {
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon')
                setSelectionCoords(currentFigure, newElement, x1, y1, x2, y2);
                newElement.setAttributeNS(null, 'fill', inputColor.value);
                break;
            }
            case 'circle': {
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')
                setSelectionCoords(currentFigure, newElement, x1, y1, x2, y2);
                newElement.setAttributeNS(null, 'fill', inputColor.value);
                break;
            }
            case 'polyline': {
                newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline')
                newElement.setAttributeNS(null, 'points', drawePolyLine.getAttribute('points'));
                newElement.style.fill = 'none'
                break;
            }
        }
        x1 = x2 = null;

        newElement.setAttributeNS(null, 'id', ++ids);
        newElement.setAttributeNS(null, 'stroke', inputStrokeColor.value);
        newElement.setAttributeNS(null, 'stroke-width', inputThickness.value);

        newElement.onmousedown = function (event) {
            if (event.button == M_RIGHT) {
                if (selected != null && selected.id == event.target.id) {
                    // deselectam tot
                    let elements = document.querySelectorAll('#svg *');
                    elements.forEach(el => el.classList.remove('Selected'));
                    selected = null;
                    console.log('deselected')
                }
                else {
                    let elements = document.querySelectorAll('#svg *');
                    elements.forEach(el => el.classList.remove('Selected'));
                    event.target.classList.add('Selected');
                    selected = event.target;
                    console.log(selected.id, newElement.id)
                }
                event.stopPropagation();
            }
            if (event.button == M_LEFT) {
                if (selected && selected.id == event.target.id) {
                    event.stopPropagation();
                    pressingLeft = true;
                }
            }
            if (event.button == M_MIDD) {
                if (selected && selected.id == event.target.id) {
                    event.stopPropagation();
                }
            }
        }
        newElement.onmousemove = function (event) {
            if (selected && selected.id == event.target.id) {
                event.stopPropagation();
                if (pressingLeft) {
                    if (selected.nodeName == 'rect') {
                        selected.attributes.x.value = event.clientX - 1 / 2 * (selected.attributes.height.value);
                        selected.attributes.y.value = event.clientY - 1 / 2 * (selected.attributes.width.value);
                    }
                    if (selected.nodeName == 'ellipse') {
                        selected.attributes.cx.value = event.clientX;
                        selected.attributes.cy.value = event.clientY;
                    }
                    if (selected.nodeName == 'polygon') {
                        let points = selected.getAttribute('points');
                        points = points.split(' ');
                        points = points.map((p) => {
                            return points.split(',').map(parseInt);
                        });
                        console.log(points);
                    }
                }
            }
        }
        newElement.onmouseup = function (event) {
            if (selected && selected.id == event.target.id) {
                if (event.button == M_LEFT) {
                    pressingLeft = false;
                }
                event.stopPropagation();
            }
        }
        svg.appendChild(newElement);
        allElements.push(newElement);
    }

}

inputColor.onchange = function (event) {
    if (selected != null && selected.nodeName != 'polyline') {
        selected.setAttributeNS(null, 'fill', inputColor.value);
    }
}
inputStrokeColor.onchange = function (event) {
    if (selected != null) {
        selected.setAttributeNS(null, 'stroke', inputStrokeColor.value);
    }
}
inputThickness.onchange = function (event) {
    if (selected != null) {
        selected.setAttributeNS(null, 'stroke-width', inputThickness.value);
    }
}
inputBackgroundColor.onchange = function () {
    svg.style.background = inputBackgroundColor.value
}

svg.oncontextmenu = function (e) {
    e.preventDefault();
}

document.onkeydown = function (event) {
    if (event.keyCode == DEL && selected) {
        deletedElements.push(selected);
        selected.remove();
        allElements.pop();
        selected.classList.remove('Selected');
        selected = null;
    }
    if (event.keyCode == 77) {
        pressingM = true;
    }
}

document.onkeyup = function (event) {
    if (event.keyCode == 77) {
        pressingM = false;
    }
}

function downloadSVG(filename, content) {
    var downloadElem = document.createElement('a');
    downloadElem.setAttribute('href', 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(content))
    downloadElem.setAttribute('download', filename);

    downloadElem.style.display = 'none';
    document.body.appendChild(downloadElem);
    downloadElem.click();
    document.body.removeChild(downloadElem);
}

function download(href, name) {
    var a = document.createElement('a');

    a.download = name;
    a.href = href;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function downloadPNG() {
    let width = window.innerWidth;
    let height = 650;
    let continut = svg.outerHTML;
    let blob = new Blob([continut], { type: 'image/svg+xml;charset=utf-8' });
    let objUrl = URL.createObjectURL(blob);
    let img = new Image();
    img.src = objUrl;
    img.addEventListener('load', () => {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        //obtinem img din canvas:
        let actualImage = canvas.toDataURL();
        download(actualImage, 'svgToPng.png');
    })
}

function saveLocal() {
    let svgContent = new XMLSerializer().serializeToString(svg);
    localStorage.setItem('svgContent', svgContent);
    console.log(svgContent);
}

function loadLocal() {
    let svgStringContent = localStorage.getItem('svgContent');
    let parser = new DOMParser();
    let svgActual = parser.parseFromString(svgStringContent,
        "image/svg+xml");
    let svgElement = svgActual.documentElement;
    let i = 4;
    let list = svgElement.children;
    while (list.length != 4) {
        element = list[i];
        element.id = ++ids;
        element.onmousedown = function (event) {
            if (event.button == M_RIGHT) {
                if (selected != null && selected.id == event.target.id) {
                    // deselectam tot
                    let elements = document.querySelectorAll('#svg *');
                    elements.forEach(el => el.classList.remove('Selected'));
                    selected = null;
                    console.log('deselected')
                }
                else {
                    let elements = document.querySelectorAll('#svg *');
                    elements.forEach(el => el.classList.remove('Selected'));
                    event.target.classList.add('Selected');
                    selected = event.target;
                }
                event.stopPropagation();
            }
            if (event.button == M_LEFT) {
                if (selected && selected.id == event.target.id) {
                    event.stopPropagation();
                    pressingLeft = true;
                }
            }
            if (event.button == M_MIDD) {
                if (selected && selected.id == event.target.id) {
                    event.stopPropagation();
                }
            }
        }
        element.onmousemove = function (event) {
            if (selected && selected.id == event.target.id) {
                event.stopPropagation();
                if (pressingLeft) {
                    if (selected.nodeName == 'rect') {
                        selected.attributes.x.value = event.clientX - 1 / 2 * (selected.attributes.height.value);
                        selected.attributes.y.value = event.clientY - 1 / 2 * (selected.attributes.width.value);
                    }
                    if (selected.nodeName == 'ellipse') {
                        selected.attributes.cx.value = event.clientX;
                        selected.attributes.cy.value = event.clientY;
                    }
                }
            }
        }
        element.onmouseup = function (event) {
            if (selected && selected.id == event.target.id) {
                if (event.button == M_LEFT) {
                    pressingLeft = false;
                }
                event.stopPropagation();
            }
        }
        svg.appendChild(element);
    }
    // while (svgElement.firstElementChild != null) {
    //     if (count > 3) {
    //         svgElement.firstElementChild.id = ++ids;
    //         svgElement.firstElementChild.onmousedown = function (event) {
    //             if (event.button == M_RIGHT) {
    //                 if (selected != null && selected.id == event.target.id) {
    //                     // deselectam tot
    //                     let elements = document.querySelectorAll('#svg *');
    //                     elements.forEach(el => el.classList.remove('Selected'));
    //                     selected = null;
    //                     console.log('deselected')
    //                 }
    //                 else {
    //                     let elements = document.querySelectorAll('#svg *');
    //                     elements.forEach(el => el.classList.remove('Selected'));
    //                     event.target.classList.add('Selected');
    //                     selected = event.target;
    //                 }
    //                 event.stopPropagation();
    //             }
    //             if (event.button == M_LEFT) {
    //                 if (selected && selected.id == event.target.id) {
    //                     event.stopPropagation();
    //                     pressingLeft = true;
    //                 }
    //             }
    //             if (event.button == M_MIDD) {
    //                 if (selected && selected.id == event.target.id) {
    //                     event.stopPropagation();
    //                 }
    //             }
    //         }
    //         svgElement.firstElementChild.onmousemove = function (event) {
    //             if (selected && selected.id == event.target.id) {
    //                 event.stopPropagation();
    //                 if (pressingLeft) {
    //                     if (selected.nodeName == 'rect') {
    //                         selected.attributes.x.value = event.clientX - 1 / 2 * (selected.attributes.height.value);
    //                         selected.attributes.y.value = event.clientY - 1 / 2 * (selected.attributes.width.value);
    //                     }
    //                     if (selected.nodeName == 'ellipse') {
    //                         selected.attributes.cx.value = event.clientX;
    //                         selected.attributes.cy.value = event.clientY;
    //                     }
    //                 }
    //             }
    //         }
    //         svgElement.firstElementChild.onmouseup = function (event) {
    //             if (selected && selected.id == event.target.id) {
    //                 if (event.button == M_LEFT) {
    //                     pressingLeft = false;
    //                 }
    //                 event.stopPropagation();
    //             }
    //         }
    //         svg.appendChild(svgElement.firstElementChild);
    //     }
    //     if (svgElement.firstElementChild != null) {

    //         svgElement.removeChild(svgElement.firstElementChild);
    //     }
    //     count++;
    // }
}
