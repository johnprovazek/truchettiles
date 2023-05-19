var demo_truchet_tiles_element = document.getElementById("truchettiles")
var demo_style = demo_truchet_tiles_element.getAttribute("data-style")
var demo_color_1 = demo_truchet_tiles_element.getAttribute("data-color-1")
var demo_color_2 = demo_truchet_tiles_element.getAttribute("data-color-2")
var demo_color_3 = demo_truchet_tiles_element.getAttribute("data-color-3")
var demo_thickness = demo_truchet_tiles_element.getAttribute("data-outline-thickness")
var demo_size = demo_truchet_tiles_element.getAttribute("data-size")

// Calls tilesLoad
function demoLoadTiles(){
  // Adding and removing tileSelected class to highlight the tiles selected
  let tiles = document.getElementsByClassName("tileSelected")
  while (tiles.length) {
    tiles[0].classList.remove("tileSelected");
  }
  let s_tiles = demo_style.split('&');
  for (let i = 0; i < s_tiles.length; i++) {
    document.getElementById('tile_image_' + s_tiles[i]).classList.add("tileSelected")
  }

  // Modifying the color selection background and value to match the color selected
  let colorinput1_element = document.getElementById('colorinput1')
  colorinput1_element.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + demo_color_1 + ")";
  colorinput1_element.style.borderColor = "#292F33"
  colorinput1_element.value = demo_color_1
  let colorinput2_element = document.getElementById('colorinput2')
  colorinput2_element.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + demo_color_2 + ")";
  colorinput2_element.style.borderColor = "#292F33"
  colorinput2_element.value = demo_color_2
  let colorinput3_element = document.getElementById('colorinput3')
  colorinput3_element.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + demo_color_3 + ")";
  colorinput3_element.style.borderColor = "#292F33"
  colorinput3_element.value = demo_color_3

  // Adjusting the sliders
  let thickness_slider_element = document.getElementById('outlinethicknessslider')
  thickness_slider_element.value = demo_thickness
  let sizes_slider_element = document.getElementById('sizeslider')
  sizes_slider_element.value = demo_size

  tilesLoad(demo_style,demo_color_1,demo_color_2,demo_color_3,demo_thickness,demo_size)
}

// Randomizing function
function demoGetRandInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Pseudo-randomize values for the truchet tiles demo page
function demoRandomize(){
  // Setting demo tile style
  if (demoGetRandInt(1,100) > 15){ // 85% of the time show individual tile styles
    demo_style = String(demoGetRandInt(1,15))
  }
  else{ // 15% of the time show multiple tile styles 
    let s = demoGetRandInt(5,15)
    let lowerLimit = null
    let upperLimit = null
    if(s >= 5 && s <= 6){
      lowerLimit = 5
      upperLimit = 6
    }
    else if(s >= 7 && s <= 10){
      lowerLimit = 7
      upperLimit = 10
    }
    else if(s >= 11 && s <= 15){
      lowerLimit = 11
      upperLimit = 15
    }
    demo_style = String(s)
    let sArr = []
    for (let i = lowerLimit; i <= upperLimit; i++) {
      if(i != s){
        sArr.push(i)
      }
    }
    let randMultiple = demoGetRandInt(1,sArr.length)
    for (let i = 0; i < randMultiple; i++) {
      let randIndex = demoGetRandInt(0,sArr.length-1)
      demo_style = demo_style + '&' + String(sArr.splice(randIndex, 1)[0])
    }
  }

  // Setting demo tile colors
  demo_color_1 = '#' + Math.floor(Math.random()*16777215).toString(16);
  demo_color_2 = '#' + Math.floor(Math.random()*16777215).toString(16);
  demo_color_3 = '#' + Math.floor(Math.random()*16777215).toString(16);

  // Setting demo tile outline thickness
  if (demoGetRandInt(1,100) > 15){ // 85% of the time pick a random outline thickness from 25-100
    demo_thickness = String(demoGetRandInt(25,100))
  }
  else{ // 15% of the time show no outline
    demo_thickness = "0"
  }

  // Setting demo tile size
  if (demoGetRandInt(1,100) > 15){ // 85% of the time pick a data size between 5 and 15
    demo_size = String(demoGetRandInt(6,15))
  }
  else{ // 15% of the time pick a data size between 1-5 or 16-50
    let r_size = demoGetRandInt(1,40)
    if (r_size >= 6 && r_size <= 15){
      r_size = r_size + 10
    }
    demo_size = String(r_size)
  }

  // Load the new tiles
  demoLoadTiles()
}

// Handle selecting tiles on the demo page
function demoTileSelect(event, element){
  if(!event.ctrlKey){
    demo_style = element.getAttribute("data-value")
    demoLoadTiles()
  }
  else{
    let element_style = element.getAttribute("data-value")
    let s_tiles = demo_style.split('&');
    let new_tile = true
    for (let i = 0; i < s_tiles.length; i++) {
      if(element_style === s_tiles[i]){
        new_tile = false
        if(s_tiles.length > 1){
          s_tiles.splice(i, 1);
          demo_style = s_tiles.join("&");
          demoLoadTiles()
        }
        break;
      }
    }
    if (new_tile){
      demo_style = demo_style + '&' + element.getAttribute('data-value')
      demoLoadTiles()
    }
  }
}

// Handles all the color input fields
function demoColorChange(element) {
  console.log("here")
  let styleTest = new Option().style;
  styleTest.color = element.value;
  let isColor =  styleTest.color !== '';
  if(isColor){ // Checks if input is valid color
    if(element.id == "colorinput1"){
      demo_color_1 = element.value
    }
    else if(element.id == "colorinput2"){
      demo_color_2 = element.value
    }
    else if(element.id == "colorinput3"){
      demo_color_3 = element.value
    }
    demoLoadTiles()
    element.style.borderColor = "#292F33"
  }
  else{ // Error flash if input is invalid color
    element.style.borderColor = "#cc0000"
  }
}

// Handles when a demo color input field is out of focus. Resets element value to the last valid demo color.
function demoColorFocusOut(element){
  if(element.id == "colorinput1"){
    element.value = demo_color_1
  }
  else if(element.id == "colorinput2"){
    element.value = demo_color_2
  }
  else if(element.id == "colorinput3"){
    element.value = demo_color_3
  }
  element.style.borderColor = "#292F33"
}

// Handles changes in the slider fields
function demoSliderChange(element) {
  if(element.id == "outlinethicknessslider"){
    demo_thickness = element.value
  }
  else if(element.id == "sizeslider"){
    demo_size = element.value
  }
  demoLoadTiles()
}

function demoCanvasCopy(){
  var html_string = "<canvas id=\"demo_truchet_tiles_element\" data-style=\"" + demo_style + "\" data-color-1=\"" + demo_color_1 + "\" data-color-2=\"" + demo_color_2 + "\" data-color-3=\"" + demo_color_3 + "\" data-outline-thickness=\"" + demo_thickness + "\" data-size=\"" + demo_size + "\"></canvas>"
  navigator.clipboard.writeText(html_string);
}


// element.animate(
//   {
//     borderColor: ["red", "black"],
//   },
//   {
//     duration: 200,
//     iterations: 3,
//   }
// );