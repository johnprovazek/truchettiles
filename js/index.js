import { tilesSetData } from "./truchet-tiles.js";
import {
  getPresetDataIndex,
  getRand,
  getRandHexColors,
  getRandToString,
  isColorTransparent,
  withChancePercentage,
} from "./utils.js";
import * as CONFIG from "./constants.js";

// Grid HTML elements.
const demoGridContainer = document.getElementById("demo-grid-container");
const randomizeButton = document.getElementById("demo-grid-randomize-button");
const tiles = document.querySelectorAll(".demo-grid-tile");
const colorInputs = document.querySelectorAll(".demo-grid-color-input-field");
const colorButtons = document.querySelectorAll(".demo-grid-color-button");
const strokeSizeSlider = document.getElementById("demo-grid-stroke-size-slider");
const tileSizeSlider = document.getElementById("demo-grid-tile-size-slider");
const copyButton = document.getElementById("demo-grid-copy-button");

// Color picker HTML elements.
const colorPickerContainer = document.getElementById("color-picker-container");
const colorPicker = document.getElementById("color-picker");
const colorPickerItems = [];
const colorPickerOutsideArea = document.getElementById("color-picker-outside-area");

// Rendering and timeout variables.
let colorPickerMouseTimeoutID = null; // Timeout to prevent changing color too fast in the color picker.
let canvasRenderAnimationFrameID = null; // Frame ID used to throttle canvas redraws.

// Current tiles data.
let tilesData = {
  pattern: null,
  primaryColor: null,
  secondaryColor: null,
  strokeColor: null,
  strokeSize: null,
  tileSize: null,
};

let activeColorType = null; // When color picker is active this is the corresponding color type.

// Handles page setup.
window.addEventListener("load", () => {
  // Adding color picker items to the DOM (139 colors).
  addColorPickerItems();

  // Setting up grid event listeners.
  randomizeButton.addEventListener("click", () => randomizeTiles(false));
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
    tile.addEventListener("contextmenu", (event) => event.preventDefault());
    tile.addEventListener("touchstart", handleTileTouch);
  });
  colorInputs.forEach((colorInput) => {
    colorInput.addEventListener("input", () => handleKeyboardColorChange(colorInput));
    colorInput.addEventListener("focusout", () => handleColorInputFocusOut(colorInput));
    colorInput.addEventListener("keyup", (event) => handleColorInputEnterKey(event, colorInput));
  });
  colorButtons.forEach((colorButton) => {
    colorButton.addEventListener("click", (event) => handleColorButtonClick(event, colorButton));
  });
  handleSliderEvents(strokeSizeSlider, "strokeSize");
  handleSliderEvents(tileSizeSlider, "tileSize");
  copyButton.addEventListener("click", copyCanvasToClipboard);

  // Setting up color picker event listeners.
  colorPickerContainer.addEventListener("mouseleave", handleColorPickerMouseLeave);
  colorPickerItems.forEach((colorItem) => {
    colorItem.addEventListener("pointerenter", (event) => handleColorPickerItemPointerEnter(event, colorItem));
    colorItem.addEventListener("click", (event) => handleColorPickerItemClick(event, colorItem));
  });
  colorPickerOutsideArea.addEventListener("click", (event) => handleColorPickerOutsideClick(event));

  // Initializing the demo page with tiles.
  randomizeTiles(true);
});

// Adds color picker items (139 colors).
const addColorPickerItems = () => {
  const documentFragment = document.createDocumentFragment();
  CONFIG.HTML_COLORS.forEach((color) => {
    const colorPickerItem = document.createElement("div");
    colorPickerItem.className = "color-picker-item";
    colorPickerItem.dataset.colorName = color.name;
    colorPickerItem.dataset.hexValue = color.hex;
    colorPickerItem.style.backgroundColor = color.hex;
    const name = document.createElement("span");
    name.textContent = color.name;
    colorPickerItem.appendChild(name);
    const hex = document.createElement("i");
    hex.textContent = color.hex;
    colorPickerItem.appendChild(hex);
    colorPickerItems.push(colorPickerItem);
    documentFragment.appendChild(colorPickerItem);
  });
  colorPicker.appendChild(documentFragment);
};

// Handles setting up tile data with constrained randomness.
const randomizeTiles = (init) => {
  if (init) {
    // Initial load uses preset data so the application is guaranteed to look decent.
    const presetDataList = CONFIG.PRESET_DATA_LIST;
    const presetDataIndex = getPresetDataIndex(presetDataList.length, CONFIG.PRESET_DATA_INDEX_LOCAL_STORAGE_KEY);
    demoSetData(presetDataList[presetDataIndex]);
  } else {
    // Randomize button yields tile data with some constrained randomness.
    const [randPrimaryColor, randSecondaryColor, randStrokeColor] = getRandHexColors();
    demoSetData({
      pattern: withChancePercentage(80) ? getRandToString(1, 15) : getRandMultiplePatterns(),
      primaryColor: randPrimaryColor,
      secondaryColor: randSecondaryColor,
      strokeColor: randStrokeColor,
      strokeSize: getRandToString(48, 100),
      tileSize: getRandToString(20, 100),
    });
  }
};

// Handles getting a randomized pattern made from multiple matching patterns.
const getRandMultiplePatterns = () => {
  const randRangeIndex = getRand(0, CONFIG.MATCHING_PATTERNS.length - 1);
  const randMatchRange = CONFIG.MATCHING_PATTERNS[randRangeIndex].slice();
  const randTileCount = getRand(2, randMatchRange.length);
  const randIndices = [];
  while (randIndices.length < randTileCount) {
    const randIndex = getRand(0, randMatchRange.length - 1);
    if (!randIndices.includes(randIndex)) {
      randIndices.push(randIndex);
    }
  }
  randIndices.sort((a, b) => a - b);
  const multipleTilePatterns = randIndices.map((index) => randMatchRange[index]);
  return multipleTilePatterns.join("&");
};

// Handles selecting tiles on desktop. Allows selecting multiple tiles when holding down the "Ctrl" key.
const handleTileClick = (event) => {
  const target = event.target.closest(".demo-grid-tile");
  if (target) {
    selectedTile(target, event.ctrlKey);
  }
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

// Handles when a user selects a tile to change the pattern.
const selectedTile = (element, multipleTilesClicked) => {
  const newPatternID = element.dataset.patternId;
  // Selecting one tile.
  if (!multipleTilesClicked) {
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
const handleKeyboardColorChange = (element) => {
  const newColor = element.value;
  const colorType = element.parentNode.dataset.colorType;
  const isValidColor = CSS.supports("color", newColor);
  if (isValidColor) {
    demoSetData({ ...tilesData, [colorType]: newColor });
  } else {
    element.classList.add("color-error");
  }
};

// Handles when a demo color input field moves out of focus.
const handleColorInputFocusOut = (element) => {
  const colorType = element.parentNode.dataset.colorType;
  element.value = tilesData[colorType];
  element.classList.remove("color-error");
};

// Handles preventing input field from jumping to the next input field when the "Enter" key is pressed.
const handleColorInputEnterKey = (event, colorInput) => {
  if (event.key === "Enter") {
    colorInput.blur();
  }
};

// Handles the click event for the input field color buttons, launching the color picker.
const handleColorButtonClick = (event, colorButton) => {
  event.stopPropagation();
  activeColorType = colorButton.parentNode.dataset.colorType;
  colorPickerContainer.classList.remove("hidden");
  demoGridContainer.classList.add("hidden");
  colorPickerOutsideArea.classList.add("clickable");
};

// Updates slider thumb location.
const updateSliderThumbLocation = (slider, value) => {
  const sliderThumb = slider.querySelector(".demo-grid-slider-thumb");
  const percent = (value / slider.dataset.max) * 100;
  sliderThumb.style.left = `${percent}%`;
  sliderThumb.textContent = value;
};

// Handles interaction with the sliders.
const handleSliderEvents = (slider, key) => {
  const sliderClickableArea = slider.querySelector(".demo-grid-slider-container");
  const sliderTrack = slider.querySelector(".demo-grid-slider-thumb-container");
  const sliderThumb = slider.querySelector(".demo-grid-slider-thumb");
  const maxValue = parseInt(slider.dataset.max, 10);
  let grabOffset = 0;
  let trackRectangle;

  const updateSliderValue = (event) => {
    const relativeSliderThumbLeft = event.clientX - grabOffset - trackRectangle.left;
    const percent = relativeSliderThumbLeft / trackRectangle.width;
    const clampedPercent = Math.max(0, Math.min(1, percent));
    const newValue = Math.round(clampedPercent * maxValue);
    if (tilesData[key] !== newValue) {
      tilesData[key] = newValue;
      updateSliderThumbLocation(slider, newValue);
      scheduleCanvasRender();
    }
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", updateSliderValue);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  sliderClickableArea.addEventListener("pointerdown", (event) => {
    sliderClickableArea.setPointerCapture(event.pointerId);
    trackRectangle = sliderTrack.getBoundingClientRect();
    const sliderThumbRectangle = sliderThumb.getBoundingClientRect();
    const sliderThumbClicked =
      event.clientX >= sliderThumbRectangle.left && event.clientX <= sliderThumbRectangle.right;
    if (sliderThumbClicked) {
      grabOffset = event.clientX - sliderThumbRectangle.left;
    } else {
      grabOffset = sliderThumbRectangle.width / 2;
    }
    updateSliderValue(event);
    window.addEventListener("pointermove", updateSliderValue);
    window.addEventListener("pointerup", handlePointerUp);
  });
};

// Handles copying the truchet tiles canvas element to the clipboard.
const copyCanvasToClipboard = () => {
  const htmlCanvasString = `<canvas id="truchet-tiles"
    data-pattern="${tilesData.pattern}"
    data-primary-color="${tilesData.primaryColor}"
    data-secondary-color="${tilesData.secondaryColor}"
    data-stroke-color="${tilesData.strokeColor}"
    data-stroke-size="${tilesData.strokeSize}"
    data-tile-size="${tilesData.tileSize}"
  ></canvas>`;
  navigator.clipboard.writeText(htmlCanvasString);
};

// Handles mousing outside the color picker.
const handleColorPickerMouseLeave = () => {
  if (!colorPickerContainer.classList.contains("hidden")) {
    clearTimeout(colorPickerMouseTimeoutID);
    tilesSetData(tilesData);
  }
};

// Handles changing demo colors when color picker colors are moused over.
const handleColorPickerItemPointerEnter = (event, colorItem) => {
  if (event.pointerType === "mouse") {
    clearTimeout(colorPickerMouseTimeoutID);
    colorPickerMouseTimeoutID = setTimeout(() => {
      const colorName = colorItem.dataset.colorName;
      tilesSetData({ ...tilesData, [activeColorType]: colorName });
    }, CONFIG.COLOR_PICKER_COLOR_CHANGE_DELAY_MS);
  }
};

// Handles changing demo colors when color picker colors are clicked.
const handleColorPickerItemClick = (event, colorItem) => {
  clearTimeout(colorPickerMouseTimeoutID);
  const color = event.ctrlKey ? colorItem.dataset.hexValue : colorItem.dataset.colorName;
  colorPickerContainer.classList.add("hidden");
  demoGridContainer.classList.remove("hidden");
  colorPickerOutsideArea.classList.remove("clickable");
  demoSetData({ ...tilesData, [activeColorType]: color });
};

// Handles clicking outside the color picker.
const handleColorPickerOutsideClick = (event) => {
  if (colorPickerContainer.classList.contains("hidden")) {
    return;
  }
  if (!colorPickerContainer.contains(event.target)) {
    clearTimeout(colorPickerMouseTimeoutID);
    tilesSetData(tilesData);
    colorPickerContainer.classList.add("hidden");
    demoGridContainer.classList.remove("hidden");
    colorPickerOutsideArea.classList.remove("clickable");
  }
};

// Handles changes to demo data.
const demoSetData = (newData) => {
  tilesData = newData;
  // Checking for transparency in the colors.
  const hasTransparency = [tilesData.primaryColor, tilesData.secondaryColor, tilesData.strokeColor].some(
    isColorTransparent,
  );
  document.documentElement.classList.toggle("transparent-background", hasTransparency);
  colorInputs.forEach((input) => {
    const colorType = input.parentNode.dataset.colorType;
    const color = tilesData[colorType];
    input.value = color;
    input.style.backgroundImage = `linear-gradient(to right, ${color}, ${CONFIG.TILES_COLOR_WHITE} ${CONFIG.COLOR_INPUT_FIELD_GRADIENT_PERCENT}%)`;
    input.classList.remove("color-error");
  });
  tiles.forEach((tile) => {
    const patternID = tile.dataset.patternId;
    const activePatternsIDs = new Set(tilesData.pattern.split("&"));
    if (activePatternsIDs.has(patternID)) {
      tile.classList.add("tile-active");
    } else {
      tile.classList.remove("tile-active");
    }
  });
  updateSliderThumbLocation(strokeSizeSlider, tilesData.strokeSize);
  updateSliderThumbLocation(tileSizeSlider, tilesData.tileSize);
  scheduleCanvasRender();
};

// Throttles canvas updates.
const scheduleCanvasRender = () => {
  if (canvasRenderAnimationFrameID) {
    return;
  }
  canvasRenderAnimationFrameID = requestAnimationFrame(() => {
    tilesSetData(tilesData);
    canvasRenderAnimationFrameID = null;
  });
};
