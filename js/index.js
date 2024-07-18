// Handles page setup.
window.onload = () => {
  document.getElementById("demo-grid-refresh").addEventListener("click", () => {
    demoRandomize();
  });
  document.getElementById("demo-grid-tiles-wrapper").addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  document.getElementById("demo-grid-tiles-wrapper").addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (event.touches.length === 1) {
      demoTileChange(event.touches[0].target, false);
    } else if (event.touches.length > 1 && event.touches[0].target.classList.contains("demo-grid-tile-selected")) {
      demoTileChange(event.touches[1].target, true);
    }
  });
  document.querySelectorAll(".demo-grid-tile-image").forEach((gridItem) => {
    gridItem.addEventListener("click", (event) => {
      demoTileChange(gridItem, event.ctrlKey);
    });
  });
  document.querySelectorAll(".demo-grid-color-input").forEach((colorInput) => {
    colorInput.addEventListener("input", () => {
      demoColorChange(colorInput);
    });
    colorInput.addEventListener("focusout", () => {
      demoColorFocusOut(colorInput);
    });
  });
  document.querySelectorAll(".demo-grid-slider").forEach((slider) => {
    slider.addEventListener("change", () => {
      demoSliderChange(slider);
    });
  });
  document.getElementById("demo-grid-copy-button").addEventListener("click", () => {
    demoCanvasCopy();
  });
};

// Handles changing the demo page tile style value.
function demoSetStyle(style, load) {
  // Adding and removing demo-grid-tile-selected class to highlight the tiles selected.
  let tiles = document.getElementsByClassName("demo-grid-tile-selected");
  while (tiles.length) {
    tiles[0].classList.remove("demo-grid-tile-selected");
  }
  let tileStyles = style.split("&");
  tileStyles.forEach((tileStyle) => {
    document.getElementById("demo-grid-tile-image-" + tileStyle).classList.add("demo-grid-tile-selected");
  });
  document.getElementById("truchet-tiles").setAttribute("data-style", style);
  tilesSetStyle(style, load);
}

// Handles changing the demo page tile color values.
function demoSetColor(color, number, load) {
  // Modifying the color selection background and value to match the color selected.
  let colorInputElement = document.getElementById("demo-grid-color-input-" + number);
  colorInputElement.style.backgroundImage = "radial-gradient(circle, #F1F3F4 50%, " + color + ")";
  colorInputElement.style.borderColor = "#292F33";
  colorInputElement.value = color;
  colorInputElement.setAttribute("data-value", color);
  document.getElementById("truchet-tiles").setAttribute("data-color-" + number, color);
  tilesSetColor(color, number, load);
}

// Handles changing the demo page tile thickness value.
function demoSetThickness(thickness, load) {
  // Setting the slider value.
  document.getElementById("demo-grid-outline-thickness-slider").value = thickness;
  document.getElementById("truchet-tiles").setAttribute("data-outline-thickness", thickness);
  tilesSetThickness(thickness, load);
}

// Handles changing the demo page tile size value.
function demoSetSize(size, load) {
  // Setting the slider value.
  document.getElementById("demo-grid-size-slider").value = size;
  document.getElementById("truchet-tiles").setAttribute("data-size", size);
  tilesSetSize(size, load);
}

// Handles loading all tile values at once.
function demoLoadAllTiles(tilesStyle, tilesColor1, tilesColor2, tilesColor3, tilesThickness, tilesSize) {
  demoSetStyle(tilesStyle, false);
  demoSetColor(tilesColor1, 1, false);
  demoSetColor(tilesColor2, 2, false);
  demoSetColor(tilesColor3, 3, false);
  demoSetThickness(tilesThickness, false);
  demoSetSize(tilesSize, false);
  tilesLoad();
}

// Setting pseudo-randomized values for the truchet tiles demo page.
function demoRandomize() {
  // Setting demo tile style.
  let tilesRandStyle;
  if (demoGetRandInt(1, 100) > 15) {
    // 85% of the time show individual tile styles.
    tilesRandStyle = String(demoGetRandInt(1, 15));
  } else {
    // 15% of the time show multiple tile styles.
    let s = demoGetRandInt(5, 15);
    let lowerLimit = null;
    let upperLimit = null;
    if (s >= 5 && s <= 6) {
      lowerLimit = 5;
      upperLimit = 6;
    } else if (s >= 7 && s <= 10) {
      lowerLimit = 7;
      upperLimit = 10;
    } else if (s >= 11 && s <= 15) {
      lowerLimit = 11;
      upperLimit = 15;
    }
    let newDemoStyle = String(s);
    let styleArray = [];
    for (let i = lowerLimit; i <= upperLimit; i++) {
      if (i != s) {
        styleArray.push(i);
      }
    }
    let randMultiple = demoGetRandInt(1, styleArray.length);
    for (let i = 0; i < randMultiple; i++) {
      let randIndex = demoGetRandInt(0, styleArray.length - 1);
      newDemoStyle = newDemoStyle + "&" + String(styleArray.splice(randIndex, 1)[0]);
    }
    tilesRandStyle = newDemoStyle;
  }
  // Setting demo tile colors.
  let tilesRandColor1 =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, 0);
  let tilesRandColor2 =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, 0);
  let tilesRandColor3 =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, 0);
  // Setting demo tile outline thickness.
  let tilesRandThickness;
  if (demoGetRandInt(1, 100) > 15) {
    // 85% of the time pick a random outline thickness from 25-100.
    tilesRandThickness = String(demoGetRandInt(25, 100));
  } else {
    // 15% of the time show no outline.
    tilesRandThickness = "0";
  }
  // Setting demo tile size.
  let tilesRandSize;
  if (demoGetRandInt(1, 100) > 15) {
    // 85% of the time pick a data size between 5 and 15.
    tilesRandSize = String(demoGetRandInt(5, 15));
  } else {
    // 15% of the time pick a data size between 1-5 or 16-50.
    let randSize = demoGetRandInt(1, 40);
    if (randSize >= 6 && randSize <= 15) {
      randSize = randSize + 10;
    }
    tilesRandSize = String(randSize);
  }
  demoLoadAllTiles(
    tilesRandStyle,
    tilesRandColor1,
    tilesRandColor2,
    tilesRandColor3,
    tilesRandThickness,
    tilesRandSize
  );
}

// Handle changing tiles on the demo page.
function demoTileChange(element, multiple) {
  if (!multiple) {
    // Selecting one tile.
    demoSetStyle(element.getAttribute("data-value"), true);
  } else {
    // Selecting multiple tiles.
    let elementStyle = element.getAttribute("data-value");
    let selectedTiles = document.getElementsByClassName("demo-grid-tile-selected");
    let selectedStyles = Array.from(selectedTiles).map((x) => x.getAttribute("data-value"));
    let newTile = true;
    let newStyle = "";
    // Checking to see if selecting a tile that is already selected.
    for (let i = 0; i < selectedStyles.length; i++) {
      if (elementStyle === selectedStyles[i]) {
        newTile = false;
        if (selectedStyles.length > 1) {
          // Remove tile already selected.
          selectedStyles.splice(i, 1);
          newStyle = selectedStyles.join("&");
          demoSetStyle(newStyle, true);
        }
        break;
      }
    }
    if (newTile) {
      // Adding new tile.
      selectedStyles.push(elementStyle);
      newStyle = selectedStyles.join("&");
      demoSetStyle(newStyle, true);
    }
  }
}

// Overrides moving to the next input field and keeping keyboard open on Enter for color input fields.
let elements = document.getElementsByClassName("demo-grid-color-input");
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      this.blur();
    }
  });
}

// Handles all the color input fields.
function demoColorChange(element) {
  let styleTest = new Option().style;
  styleTest.color = element.value;
  let isColor = styleTest.color !== "";
  if (isColor) {
    // Checks if input is valid color.
    if (element.id == "demo-grid-color-input-1") {
      demoSetColor(element.value, 1, true);
    } else if (element.id == "demo-grid-color-input-2") {
      demoSetColor(element.value, 2, true);
    } else if (element.id == "demo-grid-color-input-3") {
      demoSetColor(element.value, 3, true);
    }
  } else {
    // Show error color if input is invalid color.
    element.style.borderColor = "#cc0000";
  }
}

// Handles when a demo color input field is out of focus. Resets element value to the last valid demo color.
function demoColorFocusOut(element) {
  element.value = element.getAttribute("data-value");
  element.style.borderColor = "#292F33";
}

// Handles changes in the slider fields.
function demoSliderChange(element) {
  if (element.id == "demo-grid-outline-thickness-slider") {
    demoSetThickness(element.value, true);
  } else if (element.id == "demo-grid-size-slider") {
    demoSetSize(element.value, true);
  }
}

// Handles copying the canvas element to clipboard.
function demoCanvasCopy() {
  let canvasElement = document.getElementById("truchet-tiles");
  let html_string =
    "<canvas id='truchet-tiles' " +
    "data-style='" +
    canvasElement.getAttribute("data-style") +
    "' " +
    "data-color-1='" +
    canvasElement.getAttribute("data-color-1") +
    "' " +
    "data-color-2='" +
    canvasElement.getAttribute("data-color-2") +
    "' " +
    "data-color-3='" +
    canvasElement.getAttribute("data-color-3") +
    "' " +
    "data-outline-thickness='" +
    canvasElement.getAttribute("data-outline-thickness") +
    "' " +
    "data-size='" +
    canvasElement.getAttribute("data-size") +
    "' " +
    "></canvas>";
  navigator.clipboard.writeText(html_string);
}

// Helper function to randomize int value between min and max inclusive.
function demoGetRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
