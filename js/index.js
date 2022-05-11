window.addEventListener('load', function(event){
    var truchettiles = document.getElementById("truchettiles")
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    var color_3 = truchettiles.getAttribute("data-color-3")
    var thickness = truchettiles.getAttribute("data-outline-thickness")
    var size = truchettiles.getAttribute("data-size")
    tilesInit(style,color_1,color_2,color_3,thickness,size)
});

window.addEventListener('resize', function(event){
    tilesOnResize()
});

function demoTileSelect(event, element){
    var truchettiles = document.getElementById("truchettiles")
    var style = ""
    if(!event.ctrlKey){
        var tiles = document.getElementsByClassName("tileSelected")
        while (tiles.length) {
            tiles[0].classList.remove("tileSelected");
        }
        element.classList.add("tileSelected")
        style = element.getAttribute("data-value")
    }
    else{
        element.classList.add("tileSelected")
        var tiles = document.getElementsByClassName("tileSelected")
        for (let i = 0; i < tiles.length; i++) {
            var amp = ""
            if(i > 0){
                amp = "&"
            }
            style = style + amp + tiles[i].getAttribute("data-value")
        }
    }
    truchettiles.setAttribute("data-style", style);
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    var color_3 = truchettiles.getAttribute("data-color-3")
    var thickness = truchettiles.getAttribute("data-outline-thickness")
    var size = truchettiles.getAttribute("data-size")
    tilesInit(style,color_1,color_2,color_3,thickness,size)
}

function demoColorChange(element) {
    if(demoIsColor(element.value)){
        var truchettiles = document.getElementById("truchettiles")
        if(element.id == "colorinput1"){
            truchettiles.setAttribute("data-color-1", element.value);
            element.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + element.value + ")";
        }
        else if(element.id == "colorinput2"){
            truchettiles.setAttribute("data-color-2", element.value);
            element.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + element.value + ")";
        }
        else if(element.id == "colorinput3"){
            truchettiles.setAttribute("data-color-3", element.value);
            element.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + element.value + ")";
        }
        var style = truchettiles.getAttribute("data-style")
        var color_1 = truchettiles.getAttribute("data-color-1")
        var color_2 = truchettiles.getAttribute("data-color-2")
        var color_3 = truchettiles.getAttribute("data-color-3")
        var thickness = truchettiles.getAttribute("data-outline-thickness")
        var size = truchettiles.getAttribute("data-size")
        tilesInit(style,color_1,color_2,color_3,thickness,size)
    }
}

function demoSizeChange(element) {
    var truchettiles = document.getElementById("truchettiles")
    if(element.id == "outlinethicknessslider"){
        truchettiles.setAttribute("data-outline-thickness", element.value);
    }
    else if(element.id == "sizeslider"){
        truchettiles.setAttribute("data-size", element.value);
    }
    var style = truchettiles.getAttribute("data-style")
    var color_1 = truchettiles.getAttribute("data-color-1")
    var color_2 = truchettiles.getAttribute("data-color-2")
    var color_3 = truchettiles.getAttribute("data-color-3")
    var thickness = truchettiles.getAttribute("data-outline-thickness")
    var size = truchettiles.getAttribute("data-size")
    tilesInit(style,color_1,color_2,color_3,thickness,size)
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
    var color_3 = truchettiles.getAttribute("data-color-3")
    var thickness = truchettiles.getAttribute("data-outline-thickness")
    var size = truchettiles.getAttribute("data-size")
    var html_string = "<canvas id=\"truchettiles\" data-style=\"" + style + "\" data-color-1=\"" + color_1 + "\" data-color-2=\"" + color_2 + "\" data-color-3=\"" + color_3 + "\" data-outline-thickness=\"" + thickness + "\" data-size=\"" + size + "\"></canvas>"
    navigator.clipboard.writeText(html_string);
}