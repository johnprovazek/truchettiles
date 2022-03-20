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

window.addEventListener('load', function(event){
    tilesOnLoad()
});

window.addEventListener('resize', function(event){
    tilesOnResize()
});

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

function tilesOnLoad() {
    var canvas = document.getElementById("truchettiles");
    var context = canvas.getContext("2d");
    cur_mouse_box_x = 20000;
    cur_mouse_box_y = 20000;
    screenHeight = window.screen.height
    screenWidth = window.screen.width
    numSquares = 50
    tile_distance = Math.ceil(screenWidth/numSquares)
    canvas.width = screenWidth
    canvas.height = screenHeight
    var Counter = 0;
    var TotalImages = 2;
    imgArray[0] = new Image();
    imgArray[1] = new Image();
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
                imgGridArray[i][j] = tilesGetRandomInt(2)
                context.drawImage(imgArray[imgGridArray[i][j]], i*tile_distance, j*tile_distance, tile_distance, tile_distance);
            }
        }
        tilesOnResize()
    };
    imgArray[0].onload = onloadCallback;
    imgArray[1].onload = onloadCallback;
    imgArray[0].onerror = onerrorCallback;
    imgArray[1].onerror = onerrorCallback;
    imgArray[0].src = "img/tile_a.svg";
    imgArray[1].src = "img/tile_b.svg";
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
        if(imgGridArray[x][y] == 1)
        {
            imgGridArray[x][y] = 0
        }
        else if(imgGridArray[x][y] == 0)
        {
            imgGridArray[x][y] = 1
        }
        context.clearRect(x*tile_distance, y*tile_distance, tile_distance, tile_distance);
        context.drawImage(imgArray[imgGridArray[x][y]], x*tile_distance, y*tile_distance, tile_distance, tile_distance)
        cur_mouse_box_x = x;
        cur_mouse_box_y = y;
    }
},true);