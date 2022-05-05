var screenHeight;
var screenWidth;
var screenMax
var numSquares;
var tileDistance;
var width_tiles;
var height_tiles;
var imgArray = new Array();
var imgGridArray;
cur_mouse_box_x = 20000;
cur_mouse_box_y = 20000;
var t01_svg="<circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' />"
var t12_svg='<g id="group"><path class="fillColor" d="M800,1200L800,0h400v400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200v400h-400Z" style="stroke-width:0;"/><ellipse class="fillColor" rx="400" ry="400" style="stroke-width:0;"/><ellipse class="fillColor" rx="400" ry="400" cy="1200" style="stroke-width:0;"/></g>'
var t15_svg='<g id="group"><path class="strokeColor" d="M 600,0 A 600,600 0 0 1 0,600 M 1200,600 A 600,600 0 0 0 600,1200" style="fill:none;stroke-width:150;stroke-linecap:butt;" /></g>'

function tilesOnResize() {
    var canvas = document.getElementById("truchettiles");
    var context = canvas.getContext("2d");
    var scaledWidth = Math.round(document.documentElement.clientWidth * window.devicePixelRatio)
    var scaledHeight = Math.round(document.documentElement.clientHeight * window.devicePixelRatio)
    canvas.width = scaledWidth
    canvas.height = scaledHeight
    for (var i = 0; i < numSquares; i++) {
        for (var j = 0; j < numSquares; j++) {
            context.drawImage(imgArray[imgGridArray[i][j]], i*tileDistance, j*tileDistance, tileDistance, tileDistance);
        }
    }
}

function tilesInit(style,color_1,color_2,size) {
    var Counter = 0;
    var TotalImages = 4;
    imgArray[0] = new Image();
    imgArray[1] = new Image();
    imgArray[2] = new Image();
    imgArray[3] = new Image();
    var notLoadedImages = [];
    var onloadCallback = function(){
        Counter++;
        if(Counter < TotalImages){
            return;
        }
        allLoadedCallback();
    };
    var onerrorCallback = function(msg){
        Counter++;
        notLoadedImages.push(this);
        if(Counter < TotalImages){
            return;
        }
        allLoadedCallback();
    };
    var allLoadedCallback = function(){
        var canvas = document.getElementById("truchettiles");
        var context = canvas.getContext("2d");

        screenHeight = window.screen.height * window.devicePixelRatio
        screenWidth = window.screen.width * window.devicePixelRatio
        screenMax = Math.max(screenHeight, screenWidth);
        numSquares = parseInt(size)
        var screenTileDistance = Math.ceil(screenMax/numSquares);

        var scaledHeight = Math.round(document.documentElement.clientHeight * window.devicePixelRatio)
        var scaledWidth = Math.round(document.documentElement.clientWidth * window.devicePixelRatio)
        var scaledMax = Math.max(scaledWidth, scaledHeight);
        var scaledTileDistance = Math.ceil(scaledMax/numSquares);

        tileDistance = Math.max(scaledTileDistance, screenTileDistance);

        canvas.width = scaledWidth
        canvas.height = scaledHeight
        imgGridArray = new Array(numSquares);
        for (var i = 0; i < numSquares; i++) {
            imgGridArray[i] = new Array(numSquares);
            for (var j = 0; j < numSquares; j++) {
                imgGridArray[i][j] = tilesGetRandomInt(4)
                context.drawImage(imgArray[imgGridArray[i][j]], i*tileDistance, j*tileDistance, tileDistance, tileDistance);
            }
        }
    };

    imgArray[0].onload = onloadCallback;
    imgArray[1].onload = onloadCallback;
    imgArray[2].onload = onloadCallback;
    imgArray[3].onload = onloadCallback;
    imgArray[0].onerror = onerrorCallback;
    imgArray[1].onerror = onerrorCallback;
    imgArray[2].onerror = onerrorCallback;
    imgArray[3].onerror = onerrorCallback;
    
    svg_el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg_el.setAttribute('xmlns',"http://www.w3.org/2000/svg")
    svg_el.setAttribute("width", "1200");
    svg_el.setAttribute("height", "1200");
    svg_el.style.backgroundColor = color_2
    var svg_html_el = new DOMParser().parseFromString(t12_svg, "text/xml");
    svg_el.appendChild(svg_html_el.documentElement)
    group = svg_el.getElementById("group")

    var fillItems = group.getElementsByClassName("fillColor");
    for (var i = 0; i < fillItems.length; i++) {
        console.log(fillItems[i])
        fillItems[i].setAttribute('style',fillItems[i].getAttribute('style')+'fill:'+color_1)
    }

    var strokeItems = group.getElementsByClassName("strokeColor");
    for (var i = 0; i < strokeItems.length; i++) {
        console.log(strokeItems[i])
        strokeItems[i].setAttribute('style',strokeItems[i].getAttribute('style')+'stroke:'+color_1)
    }

    imgArray[0].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg_el.outerHTML);

    group.setAttribute("transform", "rotate(90,600,600)");
    imgArray[1].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg_el.outerHTML);

    group.setAttribute("transform", "rotate(180,600,600)");
    imgArray[2].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg_el.outerHTML);

    group.setAttribute("transform", "rotate(270,600,600)");
    imgArray[3].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg_el.outerHTML);
}

function tilesGetRandomInt(max) {
    return Math.floor(Math.random() * max);
}

document.body.addEventListener('mousemove',function(e) {
    var canvas = document.getElementById("truchettiles");
    var context = canvas.getContext("2d");
    var scrollbar_adjustment = (window.innerWidth * window.devicePixelRatio) / (document.body.clientWidth * window.devicePixelRatio)
    var first_x = (e.clientX * window.devicePixelRatio) * scrollbar_adjustment
    var first_y = (e.clientY * window.devicePixelRatio)
    var x = Math.floor(first_x / tileDistance)
    var y = Math.floor(first_y / tileDistance)
    if(x != cur_mouse_box_x || y != cur_mouse_box_y){
        var style = document.getElementById("truchettiles").getAttribute("data-style")
        if(style == "15" || style == "10"){
            if(imgGridArray[x][y] == 0){
                imgGridArray[x][y] = 1;
            }
            else if(imgGridArray[x][y] == 1){
                imgGridArray[x][y] = 2;
            }
            else if(imgGridArray[x][y] == 2){
                imgGridArray[x][y] = 3;
            }
            else if(imgGridArray[x][y] == 3){
                imgGridArray[x][y] = 0;
            }
        }
        else{
            var random_int = tilesGetRandomInt(4)
            while(random_int == imgGridArray[x][y]){
                random_int = tilesGetRandomInt(4)
            }
            imgGridArray[x][y] = random_int
        }
        context.clearRect(x*tileDistance, y*tileDistance, tileDistance, tileDistance);
        context.drawImage(imgArray[imgGridArray[x][y]], x*tileDistance, y*tileDistance, tileDistance, tileDistance)
        cur_mouse_box_x = x;
        cur_mouse_box_y = y;
    }
},true);