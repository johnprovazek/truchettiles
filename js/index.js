// Handles changing the demo page tile style value.
function demoSetStyle(style, load){
  // Adding and removing tile-selected class to highlight the tiles selected.
  let tiles = document.getElementsByClassName('tile-selected');
  while (tiles.length) {
    tiles[0].classList.remove('tile-selected');
  }
  let tileStyles = style.split('&');
  for (let i = 0; i < tileStyles.length; i++) {
    document.getElementById('tile-image-' + tileStyles[i]).classList.add('tile-selected');
  }
  document.getElementById('truchet-tiles').setAttribute('data-style', style);
  tilesSetStyle(style, load);
}

// Handles changing the demo page tile color1 value.
function demoSetColor1(color, load){
  // Modifying the color selection background and value to match the color selected.
  let colorInput1Element = document.getElementById('color-input-1');
  colorInput1Element.style.backgroundImage = 'radial-gradient(circle, #F1F3F4 50%, ' + color + ')';
  colorInput1Element.style.borderColor = '#292F33';
  colorInput1Element.value = color;
  colorInput1Element.setAttribute('data-value', color);
  document.getElementById('truchet-tiles').setAttribute('data-color-1', color);
  tilesSetColor1(color, load);
}

// Handles changing the demo page tile color2 value.
function demoSetColor2(color, load){
  // Modifying the color selection background and value to match the color selected.
  let colorInput2Element = document.getElementById('color-input-2');
  colorInput2Element.style.backgroundImage = 'radial-gradient(circle, #F1F3F4 50%, ' + color + ')';
  colorInput2Element.style.borderColor = '#292F33';
  colorInput2Element.value = color;
  colorInput2Element.setAttribute('data-value', color);
  document.getElementById('truchet-tiles').setAttribute('data-color-2', color);
  tilesSetColor2(color, load);
}

// Handles changing the demo page tile color3 value.
function demoSetColor3(color, load){
  // Modifying the color selection background and value to match the color selected.
  let colorInput3Element = document.getElementById('color-input-3');
  colorInput3Element.style.backgroundImage = 'radial-gradient(circle, #F1F3F4 50%, ' + color + ')';
  colorInput3Element.style.borderColor = '#292F33';
  colorInput3Element.value = color;
  colorInput3Element.setAttribute('data-value', color);
  document.getElementById('truchet-tiles').setAttribute('data-color-3', color);
  tilesSetColor3(color, load);
}

// Handles changing the demo page tile thickness value.
function demoSetThickness(thickness, load){
  // Setting the slider value.
  document.getElementById('outline-thickness-slider').value = thickness;
  document.getElementById('truchet-tiles').setAttribute('data-outline-thickness', thickness);
  tilesSetThickness(thickness, load);
}

// Handles changing the demo page tile size value.
function demoSetSize(size, load){
  // Setting the slider value.
  document.getElementById('size-slider').value = size;
  document.getElementById('truchet-tiles').setAttribute('data-size', size);
  tilesSetSize(size, load);
}

// Handles loading all tile values at once.
function demoLoadAllTiles(tilesStyle,tilesColor1,tilesColor2,tilesColor3,tilesThickness,tilesSize){
  demoSetStyle(tilesStyle, false);
  demoSetColor1(tilesColor1, false);
  demoSetColor2(tilesColor2, false);
  demoSetColor3(tilesColor3, false);
  demoSetThickness(tilesThickness, false);
  demoSetSize(tilesSize, false);
  tilesLoad();
}

// Setting pseudo-randomized values for the truchet tiles demo page.
function demoRandomize(){
  // Setting demo tile style.
  let tilesRandStyle;
  if (demoGetRandInt(1,100) > 15){ // 85% of the time show individual tile styles.
    tilesRandStyle = String(demoGetRandInt(1,15));
  }
  else{ // 15% of the time show multiple tile styles.
    let s = demoGetRandInt(5,15);
    let lowerLimit = null;
    let upperLimit = null;
    if(s >= 5 && s <= 6){
      lowerLimit = 5;
      upperLimit = 6;
    }
    else if(s >= 7 && s <= 10){
      lowerLimit = 7;
      upperLimit = 10;
    }
    else if(s >= 11 && s <= 15){
      lowerLimit = 11;
      upperLimit = 15;
    }
    newDemoStyle = String(s);
    let sArr = [];
    for (let i = lowerLimit; i <= upperLimit; i++) {
      if(i != s){
        sArr.push(i);
      }
    }
    let randMultiple = demoGetRandInt(1,sArr.length);
    for (let i = 0; i < randMultiple; i++) {
      let randIndex = demoGetRandInt(0,sArr.length-1);
      newDemoStyle = newDemoStyle + '&' + String(sArr.splice(randIndex, 1)[0]);
    }
    tilesRandStyle = newDemoStyle;
  }
  // Setting demo tile colors
  let tilesRandColor1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,0);
  let tilesRandColor2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,0);
  let tilesRandColor3 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,0);
  // Setting demo tile outline thickness
  let tilesRandThickness;
  if (demoGetRandInt(1,100) > 15){ // 85% of the time pick a random outline thickness from 25-100.
    tilesRandThickness = String(demoGetRandInt(25,100));
  }
  else{ // 15% of the time show no outline.
    tilesRandThickness = '0';
  }
  // Setting demo tile size.
  let tilesRandSize;
  if (demoGetRandInt(1,100) > 15){ // 85% of the time pick a data size between 5 and 15.
    tilesRandSize = String(demoGetRandInt(5,15));
  }
  else{ // 15% of the time pick a data size between 1-5 or 16-50.
    let r_size = demoGetRandInt(1,40);
    if (r_size >= 6 && r_size <= 15){
      r_size = r_size + 10;
    }
    tilesRandSize = String(r_size);
  }
  demoLoadAllTiles(tilesRandStyle,tilesRandColor1,tilesRandColor2,tilesRandColor3,tilesRandThickness,tilesRandSize);
}

// Overwrites Context Menu for touching image on mobile.
function demoTilesPreventContextMenuMobile(event){
  event.preventDefault();
  return false;
}

// Handles selecting tiles on the demo page on mobile.
document.getElementById('tiles-wrapper').addEventListener('touchstart', function (e) {
  e.preventDefault() // Turns off onclick event.
  if(e.touches.length === 1){
    demoTileChange(e, e.touches[0].target, false);
  }
  else if(e.touches.length > 1 && e.touches[0].target.classList.contains('tile-selected')) {
    console.log()
    demoTileChange(e, e.touches[1].target, true);
  }
});

// Handle selecting tiles on the demo page.
function demoTileSelect(event, element){
  demoTileChange(event,element,event.ctrlKey)
}

// Handle changing tiles on the demo page.
function demoTileChange(event, element, multiple){
  if(!multiple){ // Selecting one tile.
    demoSetStyle(element.getAttribute('data-value'), true);
  }
  else{ // Selecting multiple tiles.
    let elementStyle = element.getAttribute('data-value');
    let selectedTiles = document.getElementsByClassName('tile-selected');
    let selectedStyles = Array.from(selectedTiles).map(x => x.getAttribute('data-value'));
    let newTile = true;
    let newStyle = '';
    // Checking to see if selecting a tile that is already selected.
    for (let i = 0; i < selectedStyles.length; i++) {
      if(elementStyle === selectedStyles[i]){
        newTile = false;
        if(selectedStyles.length > 1){ // Remove tile already selected.
          selectedStyles.splice(i, 1);
          newStyle = selectedStyles.join('&');
          demoSetStyle(newStyle, true);
        }
        break;
      }
    }
    if (newTile){ // Adding new tile.
      selectedStyles.push(elementStyle);
      newStyle = selectedStyles.join('&');
      demoSetStyle(newStyle, true);
    }
  }
}

// Overrides moving to the next input field and keeping keyboard open on Enter for color input fields.
var elements = document.getElementsByClassName('color-input');
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      this.blur();
    }
  });
}

// Handles all the color input fields.
function demoColorChange(element) {
  let styleTest = new Option().style;
  styleTest.color = element.value;
  let isColor =  styleTest.color !== '';
  if(isColor){ // Checks if input is valid color.
    if(element.id == 'color-input-1'){
      demoSetColor1(element.value, true);
    }
    else if(element.id == 'color-input-2'){
      demoSetColor2(element.value, true);
    }
    else if(element.id == 'color-input-3'){
      demoSetColor3(element.value, true);
    }
  }
  else{ // Show error color if input is invalid color.
    element.style.borderColor = '#cc0000';
  }
}

// Handles when a demo color input field is out of focus. Resets element value to the last valid demo color.
function demoColorFocusOut(element){
  element.value = element.getAttribute('data-value');
  element.style.borderColor = '#292F33';
}

// Handles changes in the slider fields.
function demoSliderChange(element) {
  if(element.id == 'outline-thickness-slider'){
    demoSetThickness(element.value, true);
  }
  else if(element.id == 'size-slider'){
    demoSetSize(element.value, true);
  }
}

// Handles copying the canvas element to clipboard.
function demoCanvasCopy(){
  let canvasElement = document.getElementById('truchet-tiles');
  let html_string = '<canvas id=\'truchet-tiles\' ' +
                      'data-style=\'' + canvasElement.getAttribute('data-style') + '\' ' +
                      'data-color-1=\'' + canvasElement.getAttribute('data-color-1') + '\' ' +
                      'data-color-2=\'' + canvasElement.getAttribute('data-color-2') + '\' ' +
                      'data-color-3=\'' + canvasElement.getAttribute('data-color-3') + '\' ' +
                      'data-outline-thickness=\'' + canvasElement.getAttribute('data-outline-thickness') + '\' ' +
                      'data-size=\'' + canvasElement.getAttribute('data-size') + '\' ' +
                    '></canvas>';
  navigator.clipboard.writeText(html_string);
}

// Helper function to randomize int value between min and max inclusive.
function demoGetRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}