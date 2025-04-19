import { tilesSetData } from "./truchet-tiles.js";
import { getRand, getRandHexColors, getRandToString, withChancePercentage } from "./utils.js";
import {
  COLOR_CHANGE_DELAY_MS,
  COLOR_COUNT,
  GRADIENT_PERCENT,
  MATCHING_DESIGNS,
  PIXEL_EDGE_ALLOWANCE,
  TILES_COLOR_WHITE,
} from "./constants.js";

// HTML Elements.
const canvasCopyButton = document.getElementById("demo-grid-copy-button");
const colorInputs = document.querySelectorAll(".demo-grid-color-input > input");
const colorPicker = document.getElementById("color-picker");
const colorPickerFlex = document.getElementById("color-picker-flex");
const colorPickerItems = document.querySelectorAll(".color-picker-item");
const mainPanel = document.getElementById("main-panel");
const openColorPickerButtons = document.querySelectorAll(".open-color-picker-button");
const randomizeButton = document.getElementById("demo-grid-randomize-button");
const sizeSlider = document.querySelector("#demo-grid-size-slider > input");
const strokeSlider = document.querySelector("#demo-grid-stroke-slider > input");
const tiles = document.querySelectorAll(".demo-grid-tile");

let activeColorPickerNumber = null; // When color picker is active this is the relevant color number.
let colorPickerMouseTimeoutID = null; // Timeout to prevent changing color too fast when mousing over the color picker.
let colorPickerResizeTimeoutID = null; // Timeout to prevent calling setColorPickerEdgeClasses too often on resizes.
let tilesData = {
  // Current tiles data.
  pattern: null,
  color1: null,
  color2: null,
  color3: null,
  stroke: null,
  size: null,
};

// Handles page setup.
window.addEventListener("load", () => {
  // Setting up event listeners.
  canvasCopyButton.addEventListener("click", copyCanvasToClipboard);
  colorInputs.forEach((colorInput) => {
    colorInput.addEventListener("input", () => keyboardColorChange(colorInput));
    colorInput.addEventListener("focusout", () => colorInputFocusOut(colorInput));
    colorInput.addEventListener("keyup", (event) => handleColorInputEnterKey(event, colorInput));
  });
  colorPicker.addEventListener("mouseleave", handleColorPickerMouseLeave);
  colorPickerItems.forEach((colorItem) => {
    colorItem.addEventListener("mouseenter", (event) => handleColorPickerItemMouse(event, colorItem));
    colorItem.addEventListener("click", () => handleColorPickerItemClick(colorItem));
  });
  document.body.addEventListener("click", (event) => handleColorPickerOutsideClick(event));
  openColorPickerButtons.forEach((colorPickerButton) => {
    colorPickerButton.addEventListener("click", () => handleOpenColorPickerButtonClick(colorPickerButton));
  });
  randomizeButton.addEventListener("click", randomizeTileConfigurations);
  sizeSlider.addEventListener("change", () => demoSetData({ ...tilesData, size: sizeSlider.value }));
  strokeSlider.addEventListener("change", () => demoSetData({ ...tilesData, stroke: strokeSlider.value }));
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
    tile.addEventListener("contextmenu", (event) => event.preventDefault());
    tile.addEventListener("touchstart", handleTileTouch);
  });
  // Initializing the demo page with tiles.
  initTiles();
});

// Handles page resize events.
window.addEventListener("resize", () => {
  handleColorPickerResize();
});

// Handles initializing the demo with tiles.
const initTiles = () => {
  randomizeTileConfigurations();
  sizeSlider.classList.remove("thumb-hidden");
  strokeSlider.classList.remove("thumb-hidden");
};

// Handles updating the demos truchet tile data.
const demoSetData = (data) => {
  // Processing Pattern.
  const activeTiles = document.getElementsByClassName("demo-grid-tile-selected");
  Array.from(activeTiles).forEach((activeTile) => {
    activeTile.classList.remove("demo-grid-tile-selected");
  });
  const tilePatternIDs = data.pattern.split("&");
  tilePatternIDs.forEach((tilePatternID) => {
    const gridTile = document.querySelector(`.demo-grid-tile[data-pattern-id="${tilePatternID}"]`);
    gridTile.classList.add("demo-grid-tile-selected");
  });
  // Processing Colors.
  for (let i = 0; i < COLOR_COUNT; i++) {
    const color = data[`color${i + 1}`];
    const colorInputElement = document.querySelector(`.demo-grid-color-input[data-color-number="${i + 1}"] > input`);
    colorInputElement.style.backgroundImage = `linear-gradient(to right, ${color}, ${TILES_COLOR_WHITE} ${GRADIENT_PERCENT}%)`;
    colorInputElement.classList.remove("color-input-border-error");
    colorInputElement.value = color;
  }
  // Processing Stroke.
  strokeSlider.value = data.stroke;
  // Processing Size.
  sizeSlider.value = data.size;
  // Setting data and updating tiles.
  tilesData = data;
  tilesSetData(tilesData);
};

// Handles changing demo colors when color picker colors are moused over.
const handleColorPickerItemMouse = (event, colorItem) => {
  if (!event.sourceCapabilities.firesTouchEvents) {
    clearTimeout(colorPickerMouseTimeoutID);
    colorPickerMouseTimeoutID = setTimeout(() => {
      const colorName = colorItem.dataset.colorName;
      tilesSetData({ ...tilesData, [`color${activeColorPickerNumber}`]: colorName });
    }, COLOR_CHANGE_DELAY_MS);
  }
};

// Handles changing demo colors when color picker colors are clicked.
const handleColorPickerItemClick = (colorItem) => {
  clearTimeout(colorPickerMouseTimeoutID);
  const colorName = colorItem.dataset.colorName;
  colorPicker.classList.add("hidden");
  document.body.classList.remove("clickable");
  demoSetData({ ...tilesData, [`color${activeColorPickerNumber}`]: colorName });
};

// Handles updating the color picker edge classes on resize events.
const handleColorPickerResize = () => {
  if (!colorPicker.classList.contains("hidden")) {
    clearTimeout(colorPickerResizeTimeoutID);
    colorPickerResizeTimeoutID = setTimeout(() => setColorPickerEdgeClasses(), COLOR_CHANGE_DELAY_MS);
  }
};

// Handles mousing outside the color picker.
const handleColorPickerMouseLeave = () => {
  if (!colorPicker.classList.contains("hidden")) {
    clearTimeout(colorPickerMouseTimeoutID);
    tilesSetData(tilesData);
  }
};

// Handles clicking outside the color picker.
const handleColorPickerOutsideClick = (event) => {
  if (!colorPicker.classList.contains("hidden") && !mainPanel.contains(event.target)) {
    clearTimeout(colorPickerMouseTimeoutID);
    tilesSetData(tilesData);
    colorPicker.classList.add("hidden");
    document.body.classList.remove("clickable");
  }
};

// Handles adding classes to color picker items along flex container edges to prevent scaling past container.
const setColorPickerEdgeClasses = () => {
  const edges = ["top", "bottom", "left", "right"];
  const flexEdges = {
    top: colorPickerFlex.offsetTop,
    bottom: colorPickerFlex.scrollHeight,
    left: colorPickerFlex.offsetLeft,
    right: colorPickerFlex.offsetLeft + colorPickerFlex.offsetWidth,
  };
  colorPickerItems.forEach((colorPickerItem) => {
    const colorPickerItemStyle = window.getComputedStyle(colorPickerItem);
    const itemEdges = {
      top: colorPickerItem.offsetTop - parseFloat(colorPickerItemStyle.paddingTop),
      bottom: colorPickerItem.offsetTop + colorPickerItem.offsetHeight + parseFloat(colorPickerItemStyle.paddingBottom),
      left: colorPickerItem.offsetLeft - parseFloat(colorPickerItemStyle.paddingLeft),
      right: colorPickerItem.offsetLeft + colorPickerItem.offsetWidth + parseFloat(colorPickerItemStyle.paddingRight),
    };
    const scaleOriginClass =
      "scale-origin" +
      edges
        .filter((edge) => Math.abs(itemEdges[edge] - flexEdges[edge]) < PIXEL_EDGE_ALLOWANCE)
        .map((edge) => `-${edge}`)
        .join("");
    colorPickerItem.className = `color-picker-item ${scaleOriginClass}`;
  });
};

// Handles selecting tiles on mobile. Allows selecting multiple tiles when tapping and holding down a tile.
const handleTileTouch = (event) => {
  event.preventDefault();
  const touchedTiles = Array.from(event.touches)
    .map((touch) => touch.target.closest(".demo-grid-tile"))
    .filter((tile) => tile !== null);
  if (touchedTiles.length === 1) {
    selectedTile(touchedTiles[0], false);
  } else if (touchedTiles.length > 1 && tilesData.pattern.split("&").includes(touchedTiles[0].dataset.patternId)) {
    selectedTile(touchedTiles[1], true);
  }
};

// Handles selecting tiles on desktop. Allows selecting multiple tiles when holding down the "Ctrl" key.
const handleTileClick = (event) => {
  const target = event.target.closest(".demo-grid-tile");
  if (target) {
    selectedTile(target, event.ctrlKey);
  }
};

// Handles preventing input field from jumping to the next input field when the "Enter" key is pressed.
const handleColorInputEnterKey = (event, colorInput) => {
  if (event.key === "Enter") {
    colorInput.blur();
  }
};

// Handles the click event for color picker buttons.
const handleOpenColorPickerButtonClick = (colorPickerButton) => {
  activeColorPickerNumber = parseInt(colorPickerButton.parentNode.dataset.colorNumber, 10);
  colorPicker.classList.remove("hidden");
  document.body.classList.add("clickable");
  setColorPickerEdgeClasses();
};

// Handles setting up pseudo-randomized tile configuration values.
const randomizeTileConfigurations = () => {
  const [randColor1, randColor2, randColor3] = getRandHexColors();
  demoSetData({
    pattern: withChancePercentage(80) ? getRandToString(1, 15) : getRandMultiplePatterns(),
    color1: randColor1,
    color2: randColor2,
    color3: randColor3,
    stroke: getRandToString(12, 25),
    size: getRandToString(5, 25),
  });
};

// Handles getting a randomized pattern made from multiple matching patterns.
const getRandMultiplePatterns = () => {
  const randRangeIndex = getRand(0, MATCHING_DESIGNS.length - 1);
  const randMatchRange = MATCHING_DESIGNS[randRangeIndex].slice();
  const randTileCount = getRand(2, randMatchRange.length);
  const randIndices = [];
  while (randIndices.length < randTileCount) {
    const randomIndex = getRand(0, randMatchRange.length - 1);
    if (!randIndices.includes(randomIndex)) {
      randIndices.push(randomIndex);
    }
  }
  randIndices.sort((a, b) => a - b);
  const multipleTilePatterns = randIndices.map((index) => randMatchRange[index]);
  return multipleTilePatterns.join("&");
};

// Handles when a user selects a tile to change the pattern.
const selectedTile = (element, multiple) => {
  const newPatternID = element.dataset.patternId;
  // Selecting one tile.
  if (!multiple) {
    demoSetData({ ...tilesData, pattern: newPatternID });
    return;
  }
  // Selecting multiple tiles.
  const activePatternsIDs = new Set(tilesData.pattern.split("&"));
  const isCurrentlySelected = activePatternsIDs.has(newPatternID);
  const isOnlyItemSelected = activePatternsIDs.size === 1 && isCurrentlySelected;
  if (isCurrentlySelected && isOnlyItemSelected) {
    return;
  } else if (isCurrentlySelected) {
    activePatternsIDs.delete(newPatternID);
  } else {
    activePatternsIDs.add(newPatternID);
  }
  const newPattern = Array.from(activePatternsIDs).join("&");
  demoSetData({ ...tilesData, pattern: newPattern });
};

// Handles user keyboard input changes for color values.
const keyboardColorChange = (element) => {
  const newColor = element.value;
  const colorInputNumber = parseInt(element.parentNode.dataset.colorNumber, 10);
  const isValidColor = CSS.supports("color", newColor);
  if (isValidColor) {
    demoSetData({ ...tilesData, [`color${colorInputNumber}`]: newColor });
  } else {
    element.classList.add("color-input-border-error");
  }
};

// Handles when a demo color input field moves out of focus.
const colorInputFocusOut = (element) => {
  const colorInputNumber = parseInt(element.parentNode.dataset.colorNumber, 10);
  element.value = tilesData[`color${colorInputNumber}`];
  element.classList.remove("color-input-border-error");
};

// Handles copying the truchet tiles canvas element to the clipboard.
const copyCanvasToClipboard = () => {
  const htmlCanvasString = `<canvas id="truchet-tiles"
    data-pattern="${tilesData.pattern}"
    data-color-1="${tilesData.color1}"
    data-color-2="${tilesData.color2}"
    data-color-3="${tilesData.color3}"
    data-stroke="${tilesData.stroke}"
    data-size="${tilesData.size}"
  ></canvas>`;
  navigator.clipboard.writeText(htmlCanvasString);
};
