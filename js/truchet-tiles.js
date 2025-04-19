// Setting up canvas and canvas context.
const truchetTilesElement = document.getElementById("truchet-tiles");
const canvas = truchetTilesElement instanceof HTMLCanvasElement ? truchetTilesElement : null;
const canvasContext = canvas ? canvas.getContext("2d") : null;

let activeDevicePixelRatio; // Active device pixel ratio.
let activePattern = null; // Active truchet tile pattern.
let activeSize = null; // Active truchet tile size.
let activeX = -1; // Active X value corresponding to which grid tile was last moused over.
let activeY = -1; // Active Y value corresponding to which grid tile was last moused over.
let canvasLength; // Height and width of the canvas.
let debug = false; // Enables debugging features.
let keyboardInputBuffer = []; // Stores keyboard input to check for konami code. Used to enable debugging features.
let tileLength; // Height and width of a tile.
let tiles; // Holds SVG tiles in use. This includes each rotation of a tile.
let tilesGrid; // 2D array holding the index of each tile in each grid location.
let totalRotations; // Total count of tiles including each rotation on the canvas.
let tilesData = {}; // Truchet tile data.
let canvasRendered = false; // Prevents events on canvas unless rendered.

const BASE_SVG_TILES = Array(15); // Base SVG tiles before color and stroke width are applied.
BASE_SVG_TILES[0] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M500 1200a700 700 0 0 1 700-700v200a500 500 0 0 0-500 500H500zM700 0A700 700 0 0 1 0 700V500A500 500 0 0 0 500 0h200z"/>
  <path class="strokeColor" style="fill:none;" d="M0 500A500 500 0 0 0 500 0M700 0A700 700 0 0 1 0 700M1200 700a500 500 0 0 0-500 500M500 1200a700 700 0 0 1 700-700"/>
</g>`;
BASE_SVG_TILES[1] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M240 0l960 960v240H960L0 240V0h240zM1200 240L960 0h240v240zM0 1200V960l240 240H0z"/>
  <path class="strokeColor" style="fill:none;" stroke-linecap="square" d="M1200 240L960 0M240 0l960 960v0M960 1200L0 240M0 960l240 240"/>
</g>`;
BASE_SVG_TILES[2] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M1045 600c0-300 0-300 155-300v150c-80 0-80 0-80 150s0 150 80 150v150c-155 0-155 0-155-300zM900 1200V0H750c0 150 0 150-150 150S450 150 450 0H300v301.6C300 450 300 450 550 450s250 0 250 150c0 100-50 30-50 150v450"/>
  <path class="fillColor" style="stroke-width:0;" d="M0 300c150 0 150 0 150 150s0 150 150 150 150 0 150 150v450l-150 4.9v-155c0-158.3 0-148.3-150-148.3-38.3 0-90.6-1.6-150-1.6V750h150c150 0 150-10 150-25s0-25-150-25c-50 0-50 0-50-100v-50c0-100 0-100-100-100V300z"/>
  <path class="strokeColor" style="fill:none;" d="M1201.4 900.9c-158 0-158 0-158-301 0-300.8 0-300.8 158-300.8" transform="matrix(.9814 0 0 .99702 21 1.8)"/>
  <path class="strokeColor" style="fill:none;" d="M1200 450c-80 0-80 0-80 150s0 150 80 150M900 1200V0M750 0c0 150 0 150-150 150S450 150 450 0"/>
  <path class="strokeColor" style="fill:none;" d="M300 0v301.6C300 450 300 450 550 450s250 0 250 150c0 100-50 30-50 150v450"/>
  <path class="strokeColor" style="fill:none;" d="M0 300c150 0 150 0 150 150s0 150 150 150 150 0 150 150v450"/>
  <path class="strokeColor" style="fill:none;" d="M300 1200v-150c0-158.4 0-148.4-150-148.4-38.3 0-90.6-1.6-150-1.6M0 750h150c150 0 150-10 150-25s0-25-150-25c-50 0-50 0-50-100v-50c0-100 0-100-100-100"/>
</g>`;
BASE_SVG_TILES[3] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M200 0c0 47.5-7.2 36-27.4 79a148.1 148.1 0 0 0-9.7 86c4.4 21 21.1 29.8 26.6 62.9 2 11.5-7.6 35.8-9.7 38.7-19 27-60.3 15.2-95.6-10.9C55.4 234.5 34.5 200 0 200V0h200zM0 400c44.4 0 163.3 3.6 172.6 59.2 11.9 71.6-19.3 69.8-9.7 161 5 47.8 6.5 94.8 0 133-7 40.3-34.7 58.8-68.5 58.8C68.5 812 73 800 0 800V400zM200 1200H0v-200c35.7 0 75 5.8 140.2-43.2 20.3-15.2 75.7-95.3 85.3-115.6 19.7-41.8 22.8-114.4 60-120.3 41.8-1 42.5 52.5 42.5 109.6 0 46.3-52.6 146.2-84 195.1-38.8 60.3-44 59.3-44 174.4zM800 0H400c0 165 55.5 175.2 37.6 244.1-10 38.3-98.6 109.3-87.8 138 16 42.8 91 15 143.3 87.8C534.3 527.3 495 600 572 600s24.5-114.2 68-171.3c13.8-18 90.5-112.8 125.5-200.8C803.8 131.9 800 41.3 800 0zM1200 200c-200 0-260.7 199.7-330.6 114.6C814 247 1000 200 1000 0h200v200zM400 1200c0-305 126.5-303.5 255.2-358.8 101.8-43.7 86.5-170.5 124-207.6 93-91.6 164.7-15.2 220.8-152 35-108 116-81.6 200-81.6v400c-76.8 0-157-66.3-213.6-27.6-53.2 36.5-63.6 83.2-93.5 156-12.8 31-54.7 62.8-68.3 97.2-26 65.9-24.5 78.3-24.6 174.4H400zM1000 1200c0-87.2 22.6-83.5 61.8-129.2 33.5-39.3 59.7-70.8 138.2-70.8v200h-200z"/>
  <path class="strokeColor" style="fill:none;" d="M200 0c0 47.5-7.2 36-27.4 79a148.1 148.1 0 0 0-9.7 86c4.4 21 21.1 29.8 26.6 62.9 2 11.5-7.6 35.8-9.7 38.7-19 27-60.3 15.2-95.6-10.9C55.4 234.5 34.5 200 0 200M0 400c44.4 0 163.3 3.6 172.6 59.2 11.9 71.6-19.3 69.8-9.7 161 5 47.8 6.5 94.8 0 133-7 40.3-34.7 58.8-68.5 58.8C68.5 812 73 800 0 800M0 1000c35.7 0 75 5.8 140.2-43.2 20.3-15.2 75.7-95.3 85.3-115.6 19.7-41.8 22.8-114.4 60-120.3 41.8-1 42.5 52.5 42.5 109.6 0 46.3-52.6 146.2-84 195.1-38.8 60.3-44 59.3-44 174.4M400 0c0 165 55.5 175.2 37.6 244.1-10 38.3-98.6 109.3-87.8 138 16 42.8 91 15 143.3 87.8C534.3 527.3 495 600 572 600s24.5-114.2 68-171.3c13.8-18 90.5-112.8 125.5-200.8C803.8 131.9 800 41.3 800 0M1200 200c-200 0-260.7 199.7-330.6 114.6C814 247 1000 200 1000 0M1200 800c-76.8 0-157-66.3-213.6-27.6-53.2 36.5-63.6 83.2-93.5 156-12.8 31-54.7 62.8-68.3 97.2-26 65.9-24.5 78.3-24.6 174.4M400 1200c0-305 126.5-303.5 255.2-358.8 101.8-43.7 86.5-170.5 124-207.6 93-91.6 164.7-15.2 220.8-152 35-108 116-81.6 200-81.6M1000 1200c0-87.2 22.6-83.5 61.8-129.2 33.5-39.3 59.7-70.8 138.2-70.8"/>
</g>`;
BASE_SVG_TILES[4] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M0 200c220 0 400 180 400 400v600H200A200 200 0 0 0 0 1000V800a200 200 0 1 0 0-400V200zM800 1200V600c0-220 180-400 400-400v200a200 200 0 1 0 0 400v200a200 200 0 0 0-200 200H800z"/>
  <path class="fillColor" style="stroke-width:0;" d="M600 400A400 400 0 0 1 200 0h200a200 200 0 1 0 400 0h200c0 221-179 400-400 400z"/>
  <path class="strokeColor" style="fill:none;" d="M0 200c220 0 400 180 400 400v600M200 1200A200 200 0 0 0 0 1000M0 800a200 200 0 1 0 0-400M800 1200V600c0-220 180-400 400-400M1200 400a200 200 0 1 0 0 400M1200 1000a200 200 0 0 0-200 200M400 0a200 200 0 1 0 400 0M1000 0a400 400 0 1 1-800 0"/>
</g>`;
BASE_SVG_TILES[5] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M400 0c0 221-179 400-400 400V200A200 200 0 0 0 200 0h200zM1200 1000c-200 0-400-200-400-1000h200a200 200 0 0 0 200 200v200a200 200 0 1 0 0 400v200zM0 800c800 0 1000 200 1000 400H800a200 200 0 1 0-400 0H200A200 200 0 0 0 0 1000V800z"/>
  <path class="strokeColor" style="fill:none;" d="M1000 0a200 200 0 0 0 200 200M1200 400a200 200 0 1 0 0 400M1200 1000c-200 0-400-200-400-1000M0 200A200 200 0 0 0 200 0M400 0c0 221-179 400-400 400M800 1200a200 200 0 1 0-400 0M200 1200A200 200 0 0 0 0 1000M0 800c800 0 1000 200 1000 400"/>
</g>`;
BASE_SVG_TILES[6] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M840 1080a120 120 0 0 1 120 120H720a120 120 0 0 1 120-120zM120 360A120 120 0 0 1 0 480V240a120 120 0 0 1 120 120zM240 0a360 360 0 1 1 720 0 360 360 0 0 1-720 0zm360 120a120 120 0 1 0 0-240 120 120 0 0 0 0 240z"/>
  <path class="fillColor" style="stroke-width:0;" d="M0 720c600 0 800-480 1200-480v240C600 480 400 960 0 960M240 1200c0-240 560-480 960-480v240c-400 0-720-100-720 240H240z"/>
  <path class="strokeColor" style="fill:none;" d="M720 1200a120 120 0 1 1 240 0M0 240a120 120 0 1 1 0 240M960 0a360 360 0 1 1-720 0M480 0a120 120 0 1 0 240 0M240 1200c0-240 560-480 960-480M1200 960c-400 0-720-100-720 240M0 720c600 0 800-480 1200-480M1200 480C600 480 400 960 0 960"/>
</g>`;
BASE_SVG_TILES[7] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M120 360A120 120 0 0 1 0 480V240a120 120 0 0 1 120 120z"/>
  <path class="fillColor" style="stroke-width:0;" d="M0 720c240 0 400-120 400-360 0-180-160-180-160-360h240c0 600 480 960 480 1200H720c0-370-420-500-480-370-50.6 109.7 240 130 240 370H240A240 240 0 0 0 0 960V720zM1200 480A480 480 0 0 1 720 0h240a240 240 0 0 0 240 240v240zM1200 720v240c-200 0-450-360-340-440 101.3-73.7 140 200 340 200z"/>
  <path class="strokeColor" style="fill:none;" d="M0 240a120 120 0 1 1 0 240M480 0c0 600 480 960 480 1200M720 1200c0-370-420-500-480-370-50.6 109.7 240 130 240 370M240 1200A240 240 0 0 0 0 960"/>
  <path class="strokeColor" style="fill:none;" d="M0 720c240 0 400-120 400-360 0-180-160-180-160-360M1200 480A480 480 0 0 1 720 0M960 0a240 240 0 0 0 240 240M1200 960c-200 0-450-360-340-440 101.3-73.7 140 200 340 200"/>
</g>`;
BASE_SVG_TILES[8] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M360 600A360 360 0 0 1 0 960V720a120 120 0 1 0 0-240V240a360 360 0 0 1 360 360zM720 0h240a240 240 0 0 0 240 240v240A480 480 0 0 1 720 0z"/>
  <path class="fillColor" style="stroke-width:0;" d="M240 1200c0-240 240-367 240-600 0-247-240-360-240-600h240c0 480 480 720 480 1200H720c1.3-77.2-10.3-166.7-24.7-240-20.7-105.2-54.6-172.8-127-86-66.1 79.5-88.3 183-88.3 326H240zM1200 720c-142 0-150.7-94.5-223.2-50-49 30-48.3 102.7 5.5 177 34 46.6 114.7 113 217.7 113"/>
  <path class="strokeColor" style="fill:none;" d="M0 240a360 360 0 1 1 0 720M0 720a120 120 0 1 0 0-240M1200 480A480 480 0 0 1 720 0h0M960 0a240 240 0 0 0 240 240M480 0h0c0 480 480 720 480 1200M720 1200c1.3-77.2-10.3-166.7-24.7-240-20.7-105.2-54.6-172.8-127-86-66.1 79.5-88.3 183-88.3 326"/>
  <path class="strokeColor" style="fill:none;" d="M240 1200c0-240 240-367 240-600 0-247-240-360-240-600h0M1200 720c-142 0-150.7-94.5-223.2-50-49 30-48.3 102.7 5.5 177 34 46.6 114.7 113 217.7 113"/>
</g>`;
BASE_SVG_TILES[9] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M0 720A720 720 0 0 0 720 0h240c0 480-480 480-480 1200H240A240 240 0 0 0 0 960V720z"/>
  <path class="fillColor" style="stroke-width:0;" d="M480 0c0 265-215 480-480 480V240A240 240 0 0 0 240 0h240zM1080 600a120 120 0 0 0 120 120v240a240 240 0 0 0-240 240H720c0-600 240-960 480-960v240a120 120 0 0 0-120 120z"/>
  <path class="strokeColor" style="fill:none;" d="M960 0v0c0 480-480 480-480 1200M240 1200A240 240 0 0 0 0 960M0 720A720 720 0 0 0 720 0M480 0c0 265-215 480-480 480M0 240A240 240 0 0 0 240 0M1200 480a120 120 0 1 0 0 240M1200 960a240 240 0 0 0-240 240M720 1200c0-600 240-960 480-960"/>
</g>`;
BASE_SVG_TILES[10] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M0 1200V800c618.2 0 519.8-238.8 812.3-347.4C800 336.9 800 188 800 0h400v400c-181.8 0-301.6 20.7-387.7 52.6C839.3 705.8 925.4 800 1200 800v400H800c0-260-400-260-400 0H0zM0 0h400c0 220-180 400-400 400V0z"/>
  <path class="strokeColor" style="fill:none;" d="M0 400c220 0 400-180 400-400M800 0c0 600 0 800 400 800M1200 400C400 400 800 800 0 800M400 1200c0-260 400-260 400 0"/>
</g>`;
BASE_SVG_TILES[11] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M0 1200V800c200 0 400 200 400 400H0zM0 0h400c0 115 33 230.1 89.8 335.7C715 260.7 800 130.3 800 0h400v400c-192.6 0-292.4 139-344.2 305.6a936.5 936.5 0 0 1-366-370C369.4 375.8 209 400 0 400V0zm1200 1200H800c0-103.7 0-315 55.8-494.4C963.7 765 1081.8 800 1200 800v400z"/>
  <path class="strokeColor" style="fill:none;" d="M800 0c0 200-200 400-800 400M0 800c200 0 400 200 400 400M1200 400c-400 0-400 600-400 800M400 0c0 400 400 800 800 800"/>
</g>`;
BASE_SVG_TILES[12] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M0 1200V800h400c0-250 400-250 400 0h400v400H800V800H400v400H0zM0 0h400c0 106.4 56.6 212.8 200 289.1C474 356.2 280.7 400 0 400V0zm1200 0v400c-280.7 0-474-43.8-600-110.9 143.4-76.3 200-182.7 200-289V0h400z"/>
  <path class="strokeColor" style="fill:none;" d="M0 400c600 0 800-200 800-400M400 0c0 200 200 400 800 400M0 800h1200M400 1200V800c0-250 400-250 400 0v400"/>
</g>`;

BASE_SVG_TILES[13] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M0 1200V800c260 0 407.3-75.1 539.6-160.2C390.8 495.5 195.4 400 0 400V0h1200v400c-340 0-487.3 128.5-660.4 239.8a924.6 924.6 0 0 1 170.6 224.5C830.6 824.3 991 800 1200 800v400H400l173.6 46.3L800 1200c0-115-33.1-230.1-89.8-335.7C485 939.3 400 1069.7 400 1200H0zM800 0H400c0 270 400 270 400 0zM539.6 639.8z"/>
  <path class="strokeColor" style="fill:none;" d="M0 400c400 0 800 400 800 800M0 800c600 0 600-400 1200-400M400 1200c0-200 200-400 800-400M400 0c0 270 400 270 400 0"/>
</g>`;
BASE_SVG_TILES[14] = `<g id="group">
  <path class="fillColor" style="stroke-width:0;" d="M800 1200V0h400v400a200 200 0 1 0 0 400v400H800zM0 0h400c0 221-179 400-400 400V0zM0 1200V800c221 0 400 179 400 400H0z"/>
  <path class="strokeColor" style="fill:none;" d="M800 1200V0M1200 400a200 200 0 1 0 0 400M400 0c0 221-179 400-400 400M0 800c221 0 400 179 400 400"/>
</g>`;
const DATA_RANGES = {
  // Allowed ranges for truchet tile data.
  pattern: {
    min: 1,
    max: 15,
  },
  stroke: {
    min: 1,
    max: 25,
  },
  size: {
    min: 1,
    max: 25,
  },
};
const DEBUG_COLOR = "#292f33"; // Debug color used to highlight grid and mouse location.
const DEFAULT_PATTERN = "9"; // Default truchet tile pattern.
const DEFAULT_COLOR_1 = "#DEE1E6"; // Default truchet tile color 1.
const DEFAULT_COLOR_2 = "#F1F3F4"; // Default truchet tile color 2.
const DEFAULT_COLOR_3 = "#292F33"; // Default truchet tile color 3.
const DEFAULT_STROKE = "20"; // Default truchet tile stroke.
const DEFAULT_SIZE = "12"; // Default truchet tile size.
const KONAMI_CODE = [
  // Konami code. When these values are entered in sequence this will enable debugging features.
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
const MULTIPLIER_INCREMENT = 0.1; // Multiplier increment for canvas length adjustment.
const NUM_COLORS = 3; // Number of total truchet tile colors.
const TWO_ROTATIONS_PATTERNS = [1, 2]; // Patterns that have only two unique rotations.

// Event listener for load event. Sets up the truchet tile canvas background.
window.addEventListener("load", () => {
  if (canvas) {
    // Setting canvas CSS values.
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-100";
    // Setting up tiles data.
    tilesSetData({
      pattern: canvas?.getAttribute("data-pattern") ?? DEFAULT_PATTERN,
      color1: canvas?.getAttribute("data-color-1") ?? DEFAULT_COLOR_1,
      color2: canvas?.getAttribute("data-color-2") ?? DEFAULT_COLOR_2,
      color3: canvas?.getAttribute("data-color-3") ?? DEFAULT_COLOR_3,
      stroke: canvas?.getAttribute("data-stroke") ?? DEFAULT_STROKE,
      size: canvas?.getAttribute("data-size") ?? DEFAULT_SIZE,
    });
  } else {
    console.error(
      `truchet-tiles <canvas> not setup. Ensure there is a <canvas> element with id="truchet-tiles" under the html body.`
    );
  }
});

// Event listener for resize event.
window.addEventListener("resize", () => {
  if (canvasRendered) {
    const newDPR = window.devicePixelRatio !== activeDevicePixelRatio;
    const screenExtended = window.screen.isExtended === undefined ? true : window.screen.isExtended;
    const newCanvasLength = screenExtended && getScaledCanvasLength() !== canvasLength;
    if (newDPR || newCanvasLength) {
      setupCanvas();
      drawTiles();
    }
  }
});

// Event listener for mouse movements.
document.addEventListener("mousemove", (event) => {
  if (canvasRendered) {
    tilesMouseMove(event);
  }
});

// Enables debugging features if konami code is entered.
document.addEventListener("keydown", (event) => {
  if (canvasRendered && !debug) {
    keyboardInputBuffer.push(event.key);
    if (keyboardInputBuffer.length > KONAMI_CODE.length) {
      keyboardInputBuffer.shift();
    }
    if (
      keyboardInputBuffer.length === KONAMI_CODE.length &&
      keyboardInputBuffer.every((key, index) => key === KONAMI_CODE[index])
    ) {
      debug = true;
      drawTiles();
    }
  }
});

// Handles validating new input data and updating the tiles.
export const tilesSetData = (inputData) => {
  if (canvas) {
    // Validating Pattern.
    const patternIDs = inputData.pattern.split("&");
    const isValidPattern = patternIDs.every((patternID) => {
      const numPatternID = parseInt(patternID, 10);
      return !isNaN(numPatternID) && numPatternID >= DATA_RANGES.pattern.min && numPatternID <= DATA_RANGES.pattern.max;
    });
    if (isValidPattern) {
      tilesData.pattern = inputData.pattern;
    } else {
      console.error(
        `The pattern "${inputData.pattern}" is invalid. ` +
          `Patterns needs to be in the range ${DATA_RANGES.pattern.min}-${DATA_RANGES.pattern.max}. ` +
          `Patterns can be combined with "&" as a delimiter. Using last valid pattern or default value.`
      );
    }
    // Validating Colors.
    for (let i = 1; i <= NUM_COLORS; i++) {
      const color = `color${i}`;
      const colorValue = inputData[color];
      if (colorValue == null) {
        continue;
      }
      const isValidColor = CSS.supports("color", colorValue);
      if (isValidColor) {
        tilesData[color] = colorValue;
      } else {
        console.error(`${color}: "${colorValue}" is not a valid color. Using last valid color or default.`);
      }
    }
    // Validating Stroke.
    const stroke = parseInt(inputData.stroke, 10);
    if (!isNaN(stroke) && stroke >= DATA_RANGES.stroke.min && stroke <= DATA_RANGES.stroke.max) {
      tilesData.stroke = stroke;
    } else {
      console.error(
        `stroke: "${stroke}" is out of the range ${DATA_RANGES.stroke.min}-${DATA_RANGES.stroke.max}. ` +
          `Using last valid stroke or default.`
      );
    }
    // Validating Size.
    const size = parseInt(inputData.size, 10);
    if (!isNaN(size) && DATA_RANGES.size.min && size <= DATA_RANGES.size.max) {
      tilesData.size = size;
    } else {
      console.error(
        `size: "${size}" is out of the range ${DATA_RANGES.size.min}-${DATA_RANGES.size.max}. ` +
          `Using last valid size or default.`
      );
    }
    // Updating truchet tiles canvas.
    tilesLoad();
  } else {
    console.error(
      `tilesSetData() called but truchet-tiles <canvas> not setup. Ensure there is a <canvas> element with id="truchet-tiles" under the html body.`
    );
  }
};

// Builds an SVG data URI.
const buildSVG = (baseSVG, rotation) => {
  const SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  SVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  SVG.setAttribute("width", "1200");
  SVG.setAttribute("height", "1200");
  SVG.style.backgroundColor = tilesData.color2;
  const htmlElementSVG = new DOMParser().parseFromString(baseSVG, "text/xml");
  SVG.appendChild(htmlElementSVG.documentElement);
  const group = SVG.children[0];
  group.setAttribute("transform", `rotate(${rotation * 90},600,600)`);
  const fillItems = group.getElementsByClassName("fillColor");
  for (const fillItem of fillItems) {
    fillItem.setAttribute("style", `${fillItem.getAttribute("style")}fill:${tilesData.color1}`);
  }
  const strokeItems = group.getElementsByClassName("strokeColor");
  for (const strokeItem of strokeItems) {
    strokeItem.setAttribute(
      "style",
      `${strokeItem.getAttribute("style")}stroke:${tilesData.color3};stroke-width:${tilesData.stroke * 3}`
    );
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG.outerHTML)}`;
};

// Handles loading tile images.
const handleImageLoadOrError = (resolve, reject) => {
  let imageLoadCounter = 0;
  return (event) => {
    imageLoadCounter++;
    if (imageLoadCounter === totalRotations) {
      resolve();
    } else if (event.type === "error") {
      reject(`Error loading image: ${event.target.src}`);
    }
  };
};

// Gets the scaled canvas length.
const getScaledCanvasLength = () => {
  const screenLength = Math.max(window.screen.height, window.screen.width);
  const windowLength = Math.max(window.innerHeight, window.innerWidth);
  let multiplier = 1;
  let scaledCanvasLength = screenLength;
  while (scaledCanvasLength < windowLength) {
    multiplier = multiplier + MULTIPLIER_INCREMENT;
    scaledCanvasLength = Math.round(screenLength * multiplier);
  }
  return scaledCanvasLength;
};

// Sets up canvas.
const setupCanvas = () => {
  canvasLength = getScaledCanvasLength();
  activeDevicePixelRatio = window.devicePixelRatio;
  canvas.width = Math.round(canvasLength * activeDevicePixelRatio);
  canvas.height = Math.round(canvasLength * activeDevicePixelRatio);
  canvas.style.width = `${canvasLength}px`;
  canvas.style.height = `${canvasLength}px`;
  tileLength = Math.round((canvasLength * activeDevicePixelRatio) / tilesData.size);
};

// Randomizes the tile grid.
const randomizeTileGrid = () => {
  tilesGrid = Array(tilesData.size);
  for (let i = 0; i < tilesData.size; i++) {
    tilesGrid[i] = Array(tilesData.size);
    for (let j = 0; j < tilesData.size; j++) {
      tilesGrid[i][j] = Math.floor(Math.random() * totalRotations);
    }
  }
};

// Draws tiles on the canvas.
const drawTiles = () => {
  for (let i = 0; i < tilesData.size; i++) {
    for (let j = 0; j < tilesData.size; j++) {
      canvasContext.drawImage(tiles[tilesGrid[i][j]], i * tileLength, j * tileLength, tileLength, tileLength);
      if (debug) {
        canvasContext.strokeStyle = DEBUG_COLOR;
        canvasContext.lineWidth = 5;
        canvasContext.strokeRect(i * tileLength, j * tileLength, tileLength, tileLength);
      }
    }
  }
};

// Handles loading the canvas tiles background.
const tilesLoad = () => {
  const patternArray = tilesData.pattern.split("&");
  totalRotations = patternArray.length * 4;
  tiles = Array(totalRotations);
  const imageLoadPromise = new Promise((resolve, reject) => {
    const loadHandler = handleImageLoadOrError(resolve, reject);
    for (let i = 0; i < totalRotations; i++) {
      tiles[i] = new Image();
      tiles[i].onload = loadHandler;
      tiles[i].onerror = loadHandler;
    }
    // Applying settings to the SVGs.
    for (let i = 0; i < patternArray.length; i++) {
      const patternIndex = parseInt(patternArray[i], 10) - 1;
      const baseSVG = BASE_SVG_TILES[patternIndex];
      for (let rotation = 0; rotation < 4; rotation++) {
        const imageIndex = rotation + i * 4;
        tiles[imageIndex].src = buildSVG(baseSVG, rotation);
      }
    }
  });
  imageLoadPromise
    .then(() => {
      setupCanvas();
      if (activePattern !== tilesData.pattern || activeSize !== tilesData.size) {
        randomizeTileGrid();
        activePattern = tilesData.pattern;
        activeSize = tilesData.size;
      }
      drawTiles();
      canvasRendered = true;
    })
    .catch((error) => console.error(error));
};

// Handles rotating truchet tiles when they are moused over.
const tilesMouseMove = (event) => {
  const mouseX = Math.floor(event.clientX * activeDevicePixelRatio);
  const mouseY = Math.floor(event.clientY * activeDevicePixelRatio);
  const gridX = Math.floor(mouseX / tileLength);
  const gridY = Math.floor(mouseY / tileLength);
  if ((gridX != activeX || gridY != activeY) && gridX < tilesData.size && gridY < tilesData.size) {
    if (!tilesData.pattern.includes("&") && TWO_ROTATIONS_PATTERNS.includes(parseInt(tilesData.pattern, 10))) {
      tilesGrid[gridX][gridY] = (tilesGrid[gridX][gridY] + 1) % 4;
    } else {
      let randTileIndex = Math.floor(Math.random() * totalRotations);
      while (randTileIndex === tilesGrid[gridX][gridY]) {
        randTileIndex = Math.floor(Math.random() * totalRotations);
      }
      tilesGrid[gridX][gridY] = randTileIndex;
    }
    canvasContext.drawImage(
      tiles[tilesGrid[gridX][gridY]],
      gridX * tileLength,
      gridY * tileLength,
      tileLength,
      tileLength
    );
    if (debug) {
      canvasContext.strokeStyle = DEBUG_COLOR;
      canvasContext.lineWidth = 6;
      canvasContext.strokeRect(gridX * tileLength, gridY * tileLength, tileLength, tileLength);
    }
    activeX = gridX;
    activeY = gridY;
  }
  if (debug) {
    const radius = 2.5;
    canvasContext.beginPath();
    canvasContext.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
    canvasContext.fillStyle = DEBUG_COLOR;
    canvasContext.fill();
  }
};
