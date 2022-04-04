var screenHeight;
var screenWidth;
var numSquares;
var tile_distance;
var width_tiles;
var height_tiles;
var imgArray = new Array();
var imgGridArray;
var cur_mouse_box_x;
var cur_mouse_box_y;
var t01_svg="<circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' />"
var t15_svg="<path id='T15_path_1' d='M 24,0 A 24,24 0 0 0 48,24 M 0,24 A 24,24 0 0 1 24,48' style='fill:none;stroke:black;stroke-width:6;stroke-linecap:butt' />"

// window.addEventListener('load', function(event){
//     tilesInit()
// });

// window.addEventListener('resize', function(event){
//     tilesOnResize()
// });

function tilesOnResize() {
    var canvas = document.getElementById("truchettiles");
    var context = canvas.getContext("2d");
    var scaledWidth = Math.round(window.innerWidth * window.devicePixelRatio)
    var scaledHeight = Math.round(window.innerHeight * window.devicePixelRatio)
    canvas.width = scaledWidth
    canvas.height = scaledHeight
    for (var i = 0; i < width_tiles; i++) {
        for (var j = 0; j < height_tiles; j++) {
            context.drawImage(imgArray[imgGridArray[i][j]], i*tile_distance, j*tile_distance, tile_distance, tile_distance);
        }
    }
}

function tilesInit(style,color_1,color_2,size) {
    var canvas = document.getElementById("truchettiles");
    var context = canvas.getContext("2d");
    cur_mouse_box_x = 20000;
    cur_mouse_box_y = 20000;
    screenHeight = window.screen.height
    screenWidth = window.screen.width
    numSquares = size
    tile_distance = Math.ceil(screenWidth/numSquares)
    canvas.width = screenWidth
    canvas.height = screenHeight
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
    var onerrorCallback = function(){
        Counter++;
        notLoadedImages.push(this);
        if(Counter < TotalImages){
            return;
        }
        allLoadedCallback();
    };
    var allLoadedCallback = function(){
        width_tiles = Math.ceil(numSquares + 1);
        height_tiles = Math.ceil(screenHeight/tile_distance + 1);
        imgGridArray = new Array(width_tiles);
        for (var i = 0; i < width_tiles; i++) {
            imgGridArray[i] = new Array(height_tiles);
            for (var j = 0; j < height_tiles; j++) {
                imgGridArray[i][j] = tilesGetRandomInt(4)
                context.drawImage(imgArray[imgGridArray[i][j]], i*tile_distance, j*tile_distance, tile_distance, tile_distance);
            }
        }
        tilesOnResize()
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
    svg_el.setAttribute("width", "48");
    svg_el.setAttribute("height", "48");
    svg_el.style.backgroundColor = color_2
    svg_el.innerHTML = t15_svg;
    path = svg_el.getElementById('T15_path_1')
    path.style.stroke = color_1;

    var xml = (new XMLSerializer).serializeToString(svg_el);
    imgArray[0].src = "data:image/svg+xml;charset=utf-8,"+xml;

    // path.style.stroke = "red";
    path.setAttribute("transform", "rotate(90)");
    path.setAttribute("transform-origin", "center");
    var xml = (new XMLSerializer).serializeToString(svg_el);
    imgArray[1].src = "data:image/svg+xml;charset=utf-8,"+xml;

    // path.style.stroke = "blue";
    path.setAttribute("transform", "rotate(180)");
    path.setAttribute("transform-origin", "center");
    var xml = (new XMLSerializer).serializeToString(svg_el);
    imgArray[2].src = "data:image/svg+xml;charset=utf-8,"+xml;

    // path.style.stroke = "yellow";
    path.setAttribute("transform", "rotate(270)");
    path.setAttribute("transform-origin", "center");
    var xml = (new XMLSerializer).serializeToString(svg_el);
    imgArray[3].src = "data:image/svg+xml;charset=utf-8,"+xml;
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
    var x = Math.floor(first_x / tile_distance)
    var y = Math.floor(first_y / tile_distance)
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
        context.clearRect(x*tile_distance, y*tile_distance, tile_distance, tile_distance);
        context.drawImage(imgArray[imgGridArray[x][y]], x*tile_distance, y*tile_distance, tile_distance, tile_distance)
        cur_mouse_box_x = x;
        cur_mouse_box_y = y;
    }
},true);