window.addEventListener('load', function(event){
    var truchettiles = document.getElementById("truchettiles")
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    var size = truchettiles.getAttribute("data-size")
    tilesInit(style,color_1,color_2,size)
});

window.addEventListener('resize', function(event){
    tilesOnResize()
});


function demoTileSelect(element){
    var tiles = document.getElementsByClassName("tileSelected")
    tiles[0].classList.remove("tileSelected")
    element.classList.add("tileSelected")
    var truchettiles = document.getElementById("truchettiles")
    truchettiles.setAttribute("data-style", element.getAttribute("data-value"));
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    var size = truchettiles.getAttribute("data-size")
    tilesInit(style,color_1,color_2,size)
}

function demoColorChange(element) {
    if(demoIsColor(element.value)){
        var truchettiles = document.getElementById("truchettiles")
        var style = truchettiles.getAttribute("data-style")
        if(element.id == "colorinput1"){
            truchettiles.setAttribute("data-color-1", element.value);
        }
        else if(element.id == "colorinput2"){
            truchettiles.setAttribute("data-color-2", element.value);
        }
        var color_1 = truchettiles.getAttribute("data-color-1")
        var color_2 = truchettiles.getAttribute("data-color-2")
        var size = truchettiles.getAttribute("data-size")
        tilesInit(style,color_1,color_2,size)
    }
}

function demoSizeChange(element) {
    var truchettiles = document.getElementById("truchettiles")
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    truchettiles.setAttribute("data-size", element.value);
    var size = truchettiles.getAttribute("data-size")
    tilesInit(style,color_1,color_2,size)
}

function demoIsColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

function demoCanvasCopy(){
    var truchettiles = document.getElementById("truchettiles")
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    var size = truchettiles.getAttribute("data-size")
    var html_string = "<canvas id=\"truchettiles\" data-style=\"" + style + "\" data-color-1=\"" + color_1 + "\" data-color-2=\"" + color_2 + "\" data-size=\"" + size + "\"></canvas>"
    navigator.clipboard.writeText(html_string);
}