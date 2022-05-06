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
const svg_array = [];
// var t01_svg="<circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' />"
// var t12_svg='<g id="group"><path class="fillColor" d="M800,1200L800,0h400v400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200v400h-400Z" style="stroke-width:0;"/><ellipse class="fillColor" rx="400" ry="400" style="stroke-width:0;"/><ellipse class="fillColor" rx="400" ry="400" cy="1200" style="stroke-width:0;"/></g>'
// var t15_svg='<g id="group"><path class="strokeColor" d="M 600,0 A 600,600 0 0 1 0,600 M 1200,600 A 600,600 0 0 0 600,1200" style="fill:none;stroke-width:150;stroke-linecap:butt;" /></g>'




svg_array[5]  = '<g id="group"><path class="fillColor" d="M0,1200v-400c200,0,400,200,400,400h-400ZM0,0h400c0,115.06673,33.09963,230.13221,89.77741,335.6755C715.04792,260.69457,800,130.34729,800,0h400v400c-192.55873,0-292.4203,139.04574-344.20883,305.57693c0,0,.00001,0,.00001,0C703.58552,621.59884,571.91949,488.63746,489.77742,335.6755C369.40129,375.7425,208.95815,400,0.00001,400L0,399.99993L0,0ZM1200,1200h-399.99999c0-103.72064,0-315.02097,55.79117-494.42307C963.65108,765.08765,1081.82554,800,1200,800v400Z" style="stroke-width:0;"/><path d="M800,0.000002C800,200,600,400,0.000004,400.000002" style="fill:none;stroke-width:30;stroke:#000000;"/><path d="M0.000004,800C200.000002,800,400,1000.000001,400,1200" style="fill:none;stroke-width:30;stroke:#000000;"/><path d="M1200,400.000002C800,400.000002,800,1000,800,1200" style="fill:none;stroke-width:30;stroke:#000000;"/><path d="M400,0.000001C400,400.007541,800,799.999999,1200,800" style="fill:none;stroke-width:30;stroke:#000000;"/></g>'
svg_array[7]  = '<g id="group"><path class="fillColor" d="M240,1200c0-240,240-366.96105,240-600C480,353.03458,240,240,240,0.00001L239.99998,0h240.00006L480,0.00001C480,480,960,720,960,1200h-240c1.29212-77.22177-10.28015-166.66001-24.69958-240-20.68019-105.18335-54.55499-172.7924-126.92505-85.94833C502.18165,953.48413,480,1057.06558,480.00004,1200L240,1200Z" style="stroke-width:0;"/><path class="fillColor" d="M-360,600c0-198.82251,161.17749-360,360-360s360,161.17749,360,360-161.17749,360-360,360-360-161.17749-360-360ZM0,720c66.27417,0,120-53.72583,120-120s-53.72583-120-120-120-120,53.72583-120,120s53.72583,120,120,120Z" style="stroke-width:0;"/><path class="fillColor" d="M720,0c0-265.09668,214.90332-480,480-480s480,214.90332,480,480-214.90332,480-480,480-480-214.90332-480-480Zm480,240c132.54834,0,240-107.45166,240-240s-107.45166-240-240-240-240,107.45166-240,240s107.45166,240,240,240Z" style="stroke-width:0;"/><path class="fillColor" d="M1341.003417,874.051668L1200,720c-141.992166,0-150.683034-94.527751-223.227209-50.012006-48.963587,30.045838-48.307068,102.757318,5.564044,176.936599C1016.206355,893.562143,1096.956141,960,1199.999999,960l141.003418-85.948332Z" style="stroke-width:0;"/></g>'
svg_array[8]  = '<g id="group"><path class="strokeColor" d="M400,0.000028C400,300,800.000003,300,800,0.000028" style="fill:none;stroke-width:60;"/><path class="strokeColor" d="M0.000003,800C600.000001,800,600,400,1200,400" style="fill:none;stroke-width:60;"/><path class="strokeColor" d="M0,400c600.000003,0,800,400,800,800" style="fill:none;stroke-width:60;"/><path class="strokeColor" d="M400,1200c0-200,400.000001-400,800.000001-400" style="fill:none;stroke-width:60;"/></g>'
svg_array[10] = '<g id="group"><path class="fillColor" d="M0,720C397.64502,720,720,397.64502,720,0h240v0c0,480-480,480-480,1200h-240c0-132.54834-107.45166-240-240-240v-240Z" style="stroke-width:0;"/><path class="fillColor" d="M-480,0c0-265.09668,214.90332-480,480-480s480,214.90332,480,480-214.90332,480-480,480-480-214.90332-480-480ZM0,240C132.54834,240,240,132.54834,240,0s-107.45166-240-240-240-240,107.45166-240,240s107.45166,240,240,240Z" style="stroke-width:0;"/><path class="fillColor" d="M720,1200c0-600,240-960,480-960h1279.36669l16.16674,1433.58356L720,1696.217L720,1200Zm480,240c132.54834,0,240-107.45166,240-240s-107.45166-240-240-240-240,107.45166-240,240s107.45166,240,240,240Zm0-720c66.27417,0,120-53.72583,120-120s-53.72583-120-120-120-120,53.72583-120,120s53.72583,120,120,120Z" style="stroke-width:0;"/></g>'
svg_array[11] = '<g id="group"><path class="fillColor" d="M-121.523678,-15.655787L0,240l960,959.999999l142.688875,213.274585l247.708559-305.02955-150.397435-148.245035-960-959.999987-97.437693-146.675204-264.085984,131.019405Z" style="stroke-width:0;"/><path class="fillColor" d="M1074.02838,-158.95826L1366.774861,98.986191l-166.774862,141.01381-240-239.999989L1074.02838,-158.95826Z" style="stroke-width:0;"/><path class="fillColor" d="M-90.816005,928.093355L0,960l239.999999,239.999999-261.211947,135.481814-69.604057-407.388458Z" style="stroke-width:0;"/></g>'
svg_array[12] = '<g id="group"><path class="fillColor" d="M800,1200L800,0h400v400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200v400h-400Z" style="stroke-width:0;"/><ellipse class="fillColor" rx="400" ry="400" style="stroke-width:0;"/><ellipse class="fillColor" rx="400" ry="400" cy="1200" style="stroke-width:0;"/></g>'



svg_array[13] = '<g id="group"><path class="fillColor" d="M200,0.000014c0,47.495337-7.240042,35.950957-27.441694,78.972944-5.737301,12.218312-17.65484,48.111754-9.685417,85.958082c4.422414,21.001789,21.156103,29.824644,26.634898,62.955214c1.907258,11.533294-7.647762,35.863546-9.685418,38.741671-19.111642,26.994583-60.294688,15.197243-95.643499-10.896095C55.409568,234.495271,34.51108,200,0,200L0.00001,0L200,0.000014Z" style="stroke-width:0;"/><path class="fillColor" d="M0.00001,400c44.370614,0,163.303008,3.580943,172.558296,59.247809c11.894487,71.540593-19.212811,69.708569-9.685417,160.887758c5.00234,47.873456,6.518585,94.908635,0,133.078932-6.874949,40.257026-34.716471,58.805638-68.506384,58.805638C68.517139,812.020137,72.966543,800,0.00001,800v-400Z" style="stroke-width:0;"/><path class="fillColor" d="M200,1199.999999h-199.99999v-199.999999c35.694178,0,74.910141,5.80091,140.192033-43.160509c20.299966-15.224974,75.720857-95.358712,85.288125-115.607402c19.761356-41.824015,22.779271-114.463738,60.111909-120.320675c41.724713-1.098018,42.431936,52.517848,42.431936,109.615834c0,46.302255-52.605194,146.12996-84.080392,195.091379C205.209775,1085.871276,200,1084.93339,200,1199.999999Z" style="stroke-width:0;"/><path class="fillColor" d="M800,0.000014h-400c0,164.931026,55.486818,175.165729,37.566118,244.121892-9.945325,38.268119-98.563849,109.316268-87.811429,137.989388c16.038652,42.769739,91.022322,14.986002,143.365598,87.811428c41.21761,57.346239,1.79207,130.077285,78.851079,130.077285s24.534931-114.166112,68.098658-171.294894c13.714057-17.984398,90.381963-112.807202,125.444898-200.818859C803.76098,131.884621,800,41.3133,800,0.000014Z" style="stroke-width:0;"/><path class="fillColor" d="M1200,200c-200,0-260.665797,199.688573-330.581946,114.57326C814.005169,247.114095,1000.045868,200,1000,0.000014L1200,0v200Z" style="stroke-width:0;"/><path class="fillColor" d="M400,1200c0-304.94516,126.54839-303.46482,255.22273-358.76791c101.82624-43.76401,86.46481-170.56502,124.06445-207.61806C872.28665,541.96651,943.86247,618.42247,1000,481.69838c35.09041-108.06605,116.03355-81.69837,200-81.69837v400c-76.83093,0-156.94288-66.25323-213.55422-27.55425-53.25708,36.40603-63.60634,83.12732-93.59446,155.99077-12.78437,31.06275-54.67326,62.76739-68.24596,97.18211-25.97939,65.8729-24.51362,78.3075-24.60535,174.38137L400,1200Z" style="stroke-width:0;"/><path class="fillColor" d="M1000,1200c0-87.152491,22.641138-83.462055,61.759765-129.223467C1095.348553,1031.48399,1121.544836,1000.000001,1200,1000v200h-200Z" style="stroke-width:0;"/></g>'




svg_array[15] = '<g id="group"><path class="strokeColor" d="M 600,0 A 600,600 0 0 1 0,600 M 1200,600 A 600,600 0 0 0 600,1200" style="fill:none;stroke-width:150;stroke-linecap:butt;" /></g>'

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
    var svg_html_el = new DOMParser().parseFromString(svg_array[style], "text/xml");
    svg_el.appendChild(svg_html_el.documentElement)
    group = svg_el.getElementById("group")

    var fillItems = group.getElementsByClassName("fillColor");
    for (var i = 0; i < fillItems.length; i++) {
        // console.log(fillItems[i])
        fillItems[i].setAttribute('style',fillItems[i].getAttribute('style')+'fill:'+color_1)
    }

    var strokeItems = group.getElementsByClassName("strokeColor");
    for (var i = 0; i < strokeItems.length; i++) {
        // console.log(strokeItems[i])
        strokeItems[i].setAttribute('style',strokeItems[i].getAttribute('style')+'stroke:'+color_1)
    }

    console.log(svg_el)

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