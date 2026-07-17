// Canvas Setup.
const truchetTilesElement = document.getElementById("truchet-tiles");
const canvas = truchetTilesElement instanceof HTMLCanvasElement ? truchetTilesElement : null;
const canvasContext = canvas ? canvas.getContext("2d") : null;

// Tile data and state.
let tilesData = {}; // Truchet tile data.
let previousTilesData = {}; // Previous tile data used to optimize rendering on changes.
let tiles = null; // Array holding SVG tiles in use. This includes each rotation of a tile (4 rotations per tile).
let tilesGrid = null; // 2D array holding the index of each tile at each grid location.
let totalRotations = 0; // Total count of tiles including rotations (4 rotations per tile).
let currentPattern = null; // Tile pattern currently displayed.
let currentTileSize = null; // Tile size currently in use.

// Canvas dimensions.
let devicePixelRatio = 1; // Active device pixel ratio.
let canvasSize = 0; // Height and width of the canvas (canvas is a square).
let canvasTileSize = 0; // Height and width of a tile on the canvas (tile is a square).

// Render and lifecycle flags.
let isCanvasRendered = false; // Prevents events on canvas unless the canvas is rendered.
let isLoading = false; // Prevents overlapping image loads.
let isRenderQueued = false; // Flags if a render is requested.
let isSolidBackground = false; // Solid background exception flag.

// Mouse interaction.
let lastHoveredColumnIndex = -1; // Column index of the last tile that was moused over.
let lastHoveredRowIndex = -1; // Row index of the last tile that was moused over.

// Debugging.
let debug = false; // Toggles debugging features.
let keyboardInputBuffer = []; // Stores keyboard input to check for Konami code. Used to enable debugging features.

// Scaling configurations.
const CANVAS_LENGTH_MULTIPLIER_INCREMENT = 0.1; // Multiplier increment for canvas length adjustment.
const TILE_SIZE_SCALE = 0.25; // Tile size scale multiplier.
const STROKE_SIZE_SCALE = 0.75; // Stroke size scale multiplier.

// Data types.
const COLOR_TYPES = ["primaryColor", "secondaryColor", "strokeColor"];
const SLIDER_TYPES = ["strokeSize", "tileSize"];

// Default data values.
const DATA_DEFAULTS = {
  pattern: "9",
  primaryColor: "#DEE1E6",
  secondaryColor: "#F1F3F4",
  strokeColor: "#292F33",
  strokeSize: "80",
  tileSize: "48",
};
const Z_INDEX_DEFAULT = -10000;

// Allowed data ranges.
const DATA_RANGES = {
  pattern: {
    min: 1,
    max: 15,
  },
  strokeSize: {
    min: 0,
    max: 100,
  },
  tileSize: {
    min: 0,
    max: 100,
  },
};

// Debugging.
const DEBUG_COLOR = "#292f33"; // Debug color used to highlight grid and mouse location.
const DEBUG_LINE_WIDTH = 6; // Debug line width.
const DEBUG_CURSOR_DOT_RADIUS = 2.5; // Debug cursor dot radius.

// Konami code. When these values are entered in sequence this will toggle debugging features.
const KONAMI_CODE = [
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
const KONAMI_SEQUENCE = KONAMI_CODE.join(",");

// Base SVG tile paths before color and style are applied.
const BASE_SVG_TILES = [
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 0,200 C 200,200 200,200 200,0 H 0 Z M 400,0 C 400,200 400,200 600,200 800,200 800,200 800,0 Z M 1000,0 C 1000,200 1000,200 1200,200 V 0 Z M 1000,1200 C 1000,1000 1000,1000 1200,1000 V 1200 Z M 0,1000 C 200,1000 200,1000 200,1200 H 0 Z M 0,400 C 200,400 200,400 200,600 200,800 200,800 0,800 Z M 800,1200 V 1000 C 800,800 800,800 1000,800 H 1200 V 400 H 600 C 400,400 400,400 400,600 V 1200 Z" />
    <path ${secondaryColorStyle} d="M 0,400 C 200,400 200,400 200,600 200,800 200,800 0,800 V 1000 C 200,1000 200,1000 200,1200 H 400 V 600 C 400,400 400,400 600,400 H 1200 V 200 C 1000,200 1000,200 1000,0 H 800 C 800,200 800,200 600,200 400,200 400,200 400,0 H 200 C 200,200 200,200 0,200 Z M 1000,1200 C 1000,1000 1000,1000 1200,1000 V 800 H 1000 C 800,800 800,800 800,1000 V 1200 Z" />
    <path ${strokeColorStyle} d="M 800,1200 V 1000 C 800,800 800,800 1000,800 H 1200 M 400,1200 V 600 C 400,400 400,400 600,400 H 1200 M 1000,1200 C 1000,1000 1000,1000 1200,1000 M 0,1000 C 200,1000 200,1000 200,1200 M 0,400 C 200,400 200,400 200,600 200,800 200,800 0,800 M 1000,0 C 1000,200 1000,200 1200,200 M 400,0 C 400,200 400,200 600,200 800,200 800,200 800,0 M 0,200 C 200,200 200,200 200,0" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 350,0 C 350,193.29966 193.29966,350 0,350 V 150 C 82.842712,150 150,82.842712 150,0 Z M 0,700 H 75 C 325,700 420,855 500,775 530,745 480,660 435,600 420,580 420,555 440,540 605,410 700,210 700,0 H 500 C 500,132.60824 447.32158,259.7852 353.55339,353.55339 259.7852,447.32158 132.60824,500 0,500 Z M 1200,150 C 1117.1573,150 1050,82.842712 1050,0 H 850 C 850,193.29966 1006.7003,350 1200,350 Z M 0,1050 C 100,1050 175,995 175,925 175,865 90,850 0,850 Z M 700,1200 C 700,950 855,855 775,775 695,695 535,950 425,950 273.12169,950 150,1061.9288 150,1200 H 350 C 350,1158.5786 383.57864,1125 425,1125 466.42136,1125 500,1158.5786 500,1200 Z M 1200,700 C 1158.5786,700 1125,733.57864 1125,775 1125,816.42136 1158.5786,850 1200,850 V 1050 C 1117.1573,1050 1050,1117.1573 1050,1200 H 850 C 850,950 950,885 950,775 950,665 695,505 775,425 855,345 950,500 1200,500 Z" />
    <path ${secondaryColorStyle} d="M 0,150 C 82.842712,150 150,82.842712 150,0 H 0 Z M 500,0 C 500,132.60824 447.32158,259.7852 353.55339,353.55339 259.7852,447.32158 132.60824,500 0,500 V 350 C 193.29966,350 350,193.29966 350,0 Z M 1050,0 C 1050,82.842712 1117.1573,150 1200,150 V 0 Z M 350,1200 C 350,1158.5786 383.57864,1125 425,1125 466.42136,1125 500,1158.5786 500,1200 Z M 1200,700 C 1158.5786,700 1125,733.57864 1125,775 1125,816.42136 1158.5786,850 1200,850 Z M 1200,1050 C 1117.1573,1050 1050,1117.1573 1050,1200 H 1200 Z M 1200,500 C 950,500 855,345 775,425 695,505 950,665 950,775 950,885 850,950 850,1200 H 700 C 700,950 855,855 775,775 695,695 535,950 425,950 273.12169,950 150,1061.9288 150,1200 H 0 V 1050 C 100,1050 175,995 175,925 175,865 90,850 0,850 V 700 H 75 C 325,700 420,855 500,775 530,745 480,660 435,600 420,580 420,555 440,540 605,410 700,210 700,0 H 850 C 850,193.29966 1006.7003,350 1200,350 Z" />
    <path ${strokeColorStyle} d="M 0,1050 C 100,1050 175,995 175,925 175,865 90,850 0,850 M 0,700 H 75 C 325,700 420,855 500,775 530,745 480,660 435,600 420,580 420,555 440,540 605,410 700,210 700,0 M 0,500 A 500,500 0 0 0 500,0 M 1200,1050 A 150,150 0 0 0 1050,1200 M 1200,700 A 75,75 0 0 0 1200,850 M 1200,500 C 950,500 855,345 775,425 695,505 950,665 950,775 950,885 850,950 850,1200 M 850,0 A 350,350 0 0 0 1200,350 M 1050,0 A 150,150 0 0 0 1200,150 M 350,1200 A 75,75 0 0 1 500,1200 M 0,350 A 350,350 0 0 0 350,0 M 0,150 A 150,150 0 0 0 150,0 M 700,1200 C 700,950 855,855 775,775 695,695 535,950 425,950 A 275,250 0 0 0 150,1200" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 1200,750 C 1120,750 1120,750 1120,600 1120,450 1120,450 1200,450 V 300 H 1160 C 1010,300 1010,300.00819 1010,600 1010,900 1010,900 1160,900 H 1200 Z M 900,1200 V 0 H 750 C 750,150 750,150 600,150 450,150 450,150 450,0 H 300 V 300 C 300,450 300,450 545,450 790,450 790,450 790,600 790,700 750,630 750,750 V 1200 Z M 300,1200 V 1050 C 300,900 300,900 150,900 H 0 V 750 C 80,750 80,750 80,600 80,450 80,450 0,450 V 300 H 40 C 190,300 190,300 190,450 190,600 190,600 340,600 450,600 450,600 450,750 V 1200 Z" />
    <path ${secondaryColorStyle} d="M 1200,450 C 1120,450 1120,450 1120,600 1120,750 1120,750 1200,750 Z M 900,1200 V 0 H 1200 V 300 H 1160 C 1010,300 1010,300.00819 1010,600 1010,900 1010,900 1160,900 H 1200 V 1200 Z M 750,0 C 750,150 750,150 600,150 450,150 450,150 450,0 Z M 750,1200 V 750 C 750,630 790,700 790,600 790,450 790,450 545,450 300,450 300,450 300,300 V 0 H 0 V 300 H 40 C 190,300 190,300 190,450 190,600 190,600 340,600 450,600 450,600 450,750 V 1200 Z M 300,1200 V 1050 C 300,900 300,900 150,900 H 0 V 1200 Z M 0,450 C 80,450 80,450 80,600 80,750 80,750 0,750 Z" />
    <path ${strokeColorStyle} d="M 0,450 C 80,450 80,450 80,600 80,750 80,750 0,750 M 300,1200 V 1050 C 300,900 300,900 150,900 H 0 M 0,300 H 40 C 190,300 190,300 190,450 190,600 190,600 340,600 450,600 450,600 450,750 V 1200 M 300,0 V 300 C 300,450 300,450 545,450 790,450 790,450 790,600 790,700 750,630 750,750 V 1200 M 900,1200 V 0 M 750,0 C 750,150 750,150 600,150 450,150 450,150 450,0 M 1200,450 C 1120,450 1120,450 1120,600 1120,750 1120,750 1200,750 M 1200,300 H 1160 C 1010,300 1010,300.00819 1010,600 1010,900 1010,900 1160,900 H 1200" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 1000,1200 C 1000,1120 960,1180 960,1040 960,1010 980,960 1060,960 1130,960 1110,1000 1200,1000 V 1200 Z M 1200,200 C 1080,200 940,330 940,170 940,100 1000,50 1000,0 H 1200 Z M 200,0 C 200,70 310,110 310,160 310,250 230,320 180,320 140,320 30,200 0,200 V 0 Z M 0,1000 C 50,1000 130,900 170,900 210,900 240,970 240,1090 240,1140 200,1140 200,1200 H 0 Z M 1200,800 C 1160,800 1090,830 1000,830 890,830 840,900 840,1000 840,1090 800,1110 800,1200 H 400 C 400,1030 380,1040 380,950 380,830 570,640 710,640 820,640 840,450 960,450 1020,450 1100,400 1200,400 Z M 0,800 C 50,800 160,710 290,710 480,710 460,500 590,500 740,500 800,240 800,0 H 400 C 400,110 530,330 420,330 320,330 310,450 210,450 80,450 40,400 0,400 Z" />
    <path ${secondaryColorStyle} d="M 0,400 C 40,400 80,450 210,450 310,450 320,330 420,330 530,330 400,110 400,0 H 200 C 200,70 310,110 310,160 310,250 230,320 180,320 140,320 30,200 0,200 Z M 400,1200 C 400,1030 380,1040 380,950 380,830 570,640 710,640 820,640 840,450 960,450 1020,450 1100,400 1200,400 V 200 C 1080,200 940,330 940,170 940,100 1000,50 1000,0 H 800 C 800,240 740,500 590,500 460,500 480,710 290,710 160,710 50,800 0,800 V 1000 C 50,1000 130,900 170,900 210,900 240,970 240,1090 240,1140 200,1140 200,1200 Z M 1000,1200 C 1000,1120 960,1180 960,1040 960,1010 980,960 1060,960 1130,960 1110,1000 1200,1000 V 800 C 1160,800 1090,830 1000,830 890,830 840,900 840,1000 840,1090 800,1110 800,1200 Z" />
    <path ${strokeColorStyle} d="M 200,0 C 200,70 310,110 310,160 310,250 230,320 180,320 140,320 30,200 0,200 M 0,400 C 40,400 80,450 210,450 310,450 320,330 420,330 530,330 400,110 400,0 M 0,1000 C 50,1000 130,900 170,900 210,900 240,970 240,1090 240,1140 200,1140 200,1200 M 0,800 C 50,800 160,710 290,710 480,710 460,500 590,500 740,500 800,240 800,0 M 1200,200 C 1080,200 940,330 940,170 940,100 1000,50 1000,0 M 1200,800 C 1160,800 1090,830 1000,830 890,830 840,900 840,1000 840,1090 800,1110 800,1200 M 400,1200 C 400,1030 380,1040 380,950 380,830 570,640 710,640 820,640 840,450 960,450 1020,450 1100,400 1200,400 M 1000,1200 C 1000,1120 960,1180 960,1040 960,1010 980,960 1060,960 1130,960 1110,1000 1200,1000" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 0,1050 C 30,1050 50,1060 50,1090 50,1130 80,1140 110,1140 130,1140 150,1170 150,1200 H 0 Z M 350,1200 C 350,1160 360,1160 360,1120 360,1090 430,1060 450,1060 480,1060 500,1180 500,1200 Z M 1050,1200 C 1050,1140 1010,1170 1010,1090 1010,1040 1050,1030 1080,1030 1150,1030 1150,1050 1200,1050 V 1200 Z M 1200,350 C 1170,350 1160,290 1120,290 1080,290 1020,280 1000,280 950,280 880,310 880,370 880,420 830,400 830,470 830,540 880,600 880,640 880,670 910,740 910,800 910,830 930,910 970,910 1010,910 1150,850 1200,850 V 700 C 1150,700 1030,700 1030,650 1030,600 1000,590 1000,540 1000,510 1030,460 1070,460 1110,460 1170,500 1200,500 Z M 1050,0 C 1050,50 1080,80 1080,120 1080,180 1160,150 1200,150 V 0 Z M 700,0 C 700,20 650,50 650,100 650,150 640,210 600,210 510,210 440,230 440,200 440,170 470,140 470,100 470,50 500,20 500,0 H 350 C 350,60 310,100 310,160 310,220 270,160 270,270 270,310 350,300 410,300 460,300 510,370 570,370 620,370 770,350 770,280 770,250 850,210 850,160 V 0 Z M 0,150 C 60,150 70,180 100,180 120,180 180,140 180,100 180,50 150,40 150,0 H 0 Z M 700,1200 C 700,1130 630,1090 630,940 630,880 590,780 590,700 590,640 490,650 410,650 340,650 310,660 270,660 200,660 170,640 170,600 170,560 160,540 130,540 80,540 40,500 0,500 V 350 C 50,350 80,380 180,380 210,380 310,410 310,500 310,520 320,540 400,540 420,540 520,500 570,500 610,500 720,530 720,590 720,630 780,800 780,860 780,940 850,1130 850,1200 Z M 0,700 C 70,700 110,760 160,760 200,760 230,820 280,820 360,820 420,770 450,770 480,770 480,920 440,920 360,920 310,1000 250,1000 210,1000 160,950 120,950 60,950 40,850 0,850 Z" />
    <path ${secondaryColorStyle} d="M 500,1200 C 500,1180 480,1060 450,1060 430,1060 360,1090 360,1120 360,1160 350,1160 350,1200 H 150 C 150,1170 130,1140 110,1140 80,1140 50,1130 50,1090 50,1060 30,1050 0,1050 V 850 C 40,850 60,950 120,950 160,950 210,1000 250,1000 310,1000 360,920 440,920 480,920 480,770 450,770 420,770 360,820 280,820 230,820 200,760 160,760 110,760 70,700 0,700 V 500 C 40,500 80,540 130,540 160,540 170,560 170,600 170,640 200,660 270,660 310,660 340,650 410,650 490,650 590,640 590,700 590,780 630,880 630,940 630,1090 700,1130 700,1200 Z M 0,150 C 60,150 70,180 100,180 120,180 180,140 180,100 180,50 150,40 150,0 H 350 C 350,60 310,100 310,160 310,220 270,160 270,270 270,310 350,300 410,300 460,300 510,370 570,370 620,370 770,350 770,280 770,250 850,210 850,160 V 0 H 1050 C 1050,50 1080,80 1080,120 1080,180 1160,150 1200,150 V 350 C 1170,350 1160,290 1120,290 1080,290 1020,280 1000,280 950,280 880,310 880,370 880,420 830,400 830,470 830,540 880,600 880,640 880,670 910,740 910,800 910,830 930,910 970,910 1010,910 1150,850 1200,850 V 1050 C 1150,1050 1150,1030 1080,1030 1050,1030 1010,1040 1010,1090 1010,1170 1050,1140 1050,1200 H 850 C 850,1130 780,940 780,860 780,800 720,630 720,590 720,530 610,500 570,500 520,500 420,540 400,540 320,540 310,520 310,500 310,410 210,380 180,380 80,380 50,350 0,350 Z M 1200,500 C 1170,500 1110,460 1070,460 1030,460 1000,510 1000,540 1000,590 1030,600 1030,650 1030,700 1150,700 1200,700 Z M 500,0 C 500,20 470,50 470,100 470,140 440,170 440,200 440,230 510,210 600,210 640,210 650,150 650,100 650,50 700,20 700,0 Z" />
    <path ${strokeColorStyle} d="M 350,1200 C 350,1160 360,1160 360,1120 360,1090 430,1060 450,1060 480,1060 500,1180 500,1200 M 0,500 C 40,500 80,540 130,540 160,540 170,560 170,600 170,640 200,660 270,660 310,660 340,650 410,650 490,650 590,640 590,700 590,780 630,880 630,940 630,1090 700,1130 700,1200 M 1200,350 C 1170,350 1160,290 1120,290 1080,290 1020,280 1000,280 950,280 880,310 880,370 880,420 830,400 830,470 830,540 880,600 880,640 880,670 910,740 910,800 910,830 930,910 970,910 1010,910 1150,850 1200,850 M 1200,500 C 1170,500 1110,460 1070,460 1030,460 1000,510 1000,540 1000,590 1030,600 1030,650 1030,700 1150,700 1200,700 M 350,1200 C 350,1160 360,1160 360,1120 360,1090 430,1060 450,1060 480,1060 500,1180 500,1200 M 500,0 C 500,20 470,50 470,100 470,140 440,170 440,200 440,230 510,210 600,210 640,210 650,150 650,100 650,50 700,20 700,0 M 350,0 C 350,60 310,100 310,160 310,220 270,160 270,270 270,310 350,300 410,300 460,300 510,370 570,370 620,370 770,350 770,280 770,250 850,210 850,160 850,80 850,60 850,0 M 1050,1200 C 1050,1140 1010,1170 1010,1090 1010,1040 1050,1030 1080,1030 1150,1030 1150,1050 1200,1050 M 1050,0 C 1050,50 1080,80 1080,120 1080,180 1160,150 1200,150 M 0,1050 C 30,1050 50,1060 50,1090 50,1130 80,1140 110,1140 130,1140 150,1170 150,1200 M 0,700 C 70,700 110,760 160,760 200,760 230,820 280,820 360,820 420,770 450,770 480,770 480,920 440,920 360,920 310,1000 250,1000 210,1000 160,950 120,950 60,950 40,850 0,850 M 0,500 C 40,500 80,540 130,540 160,540 170,560 170,600 170,640 200,660 270,660 310,660 340,650 410,650 490,650 590,640 590,700 590,780 630,880 630,940 630,1090 700,1130 700,1200 M 0,350 C 50,350 80,380 180,380 210,380 310,410 310,500 310,520 320,540 400,540 420,540 520,500 570,500 610,500 720,530 720,590 720,630 780,800 780,860 780,940 850,1130 850,1200 M 0,150 C 60,150 70,180 100,180 120,180 180,140 180,100 180,50 150,40 150,0" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 1100,1200 C 1100,1144.7715 1144.7715,1100 1200,1100 V 900 C 1034.3146,900 900,1034.3146 900,1200 Z M 700,1200 C 700,1067.3918 752.67842,940.2148 846.44661,846.44661 940.2148,752.67842 1067.3918,700 1200,700 V 500 C 1014.3485,500 836.30072,573.74979 705.02525,705.02525 573.74979,836.30072 500,1014.3485 500,1200 Z M 105.02525,1094.9747 C 111.74318,1024.9348 125.16573,955.70096 145.10839,888.22494 169.01443,807.33881 202.14422,729.4706 243.84471,656.15529 341.68927,484.13084 484.13084,341.68927 656.15529,243.84472 729.47059,202.14424 807.3388,169.01444 888.22492,145.1084 955.70095,125.16574 1024.9348,111.74319 1094.9747,105.02525 1129.883,101.677 1164.9315,99.999997 1200,100 V 300 C 961.30516,300 732.38664,394.82116 563.6039,563.6039 394.82116,732.38664 300,961.30516 300,1200 H 100 C 99.999997,1164.9315 101.677,1129.883 105.02525,1094.9747 Z M 1094.9747,105.02525 C 1098.323,70.116952 1100,35.068507 1100,0 H 900 C 900,48.608078 896.0621,97.13627 888.22495,145.10839 M 888.22492,145.1084 C 955.70095,125.16574 1024.9348,111.74319 1094.9747,105.02525 M 243.84471,656.15528 C 165.81663,685.15258 83.241962,700 0,700 V 500 C 132.60824,500 259.7852,447.32158 353.55339,353.55339 447.32158,259.7852 500,132.60824 500,0 H 700 C 700,83.241962 685.15258,165.81663 656.15528,243.84471 M 243.84471,656.15529 C 341.68927,484.13084 484.13084,341.68927 656.15529,243.84472 M 0,300 C 165.68542,300 300,165.68542 300,0 H 100 C 100,55.228475 55.228475,100 0,100 Z M 105.02527,1094.9747 C 70.116966,1098.323 35.068513,1100 0,1100 V 900 C 48.608078,900 97.13627,896.0621 145.10839,888.22495 M 105.02525,1094.9747 C 111.74318,1024.9348 125.16573,955.70096 145.10839,888.22494" />
    <path ${secondaryColorStyle} d="M 1100,1200 C 1100,1144.7715 1144.7715,1100 1200,1100 V 1200 Z M 900,1200 C 900,1034.3146 1034.3146,900 1200,900 V 700 C 1067.3918,700 940.2148,752.67842 846.44661,846.44661 752.67842,940.2148 700,1067.3918 700,1200 Z M 500,1200 C 500,1014.3485 573.74979,836.30072 705.02525,705.02525 836.30072,573.74979 1014.3485,500 1200,500 V 300 C 961.30516,300 732.38664,394.82116 563.6039,563.6039 394.82116,732.38664 300,961.30516 300,1200 Z M 1094.9747,105.02525 C 1129.883,101.677 1164.9315,99.999997 1200,100 V 0 H 1100 C 1100,35.068507 1098.323,70.116952 1094.9747,105.02525 M 888.22495,145.10839 C 896.0621,97.13627 900,48.608078 900,0 H 700 C 700,83.241962 685.15258,165.81663 656.15528,243.84471 M 656.15529,243.84472 C 729.47059,202.14424 807.3388,169.01444 888.22492,145.1084 M 0,500 C 132.60824,500 259.7852,447.32158 353.55339,353.55339 447.32158,259.7852 500,132.60824 500,0 H 300 C 300,165.68542 165.68542,300 0,300 Z M 100,0 C 100,55.228475 55.228475,100 0,100 V 0 Z M 145.10839,888.22495 C 97.13627,896.0621 48.608078,900 0,900 V 700 C 83.241962,700 165.81663,685.15258 243.84471,656.15528 M 145.10839,888.22494 C 169.01443,807.33881 202.14422,729.4706 243.84471,656.15529 M 105.02527,1094.9747 C 70.116966,1098.323 35.068513,1100 0,1100 V 1200 H 100 C 99.999997,1164.9315 101.677,1129.883 105.02525,1094.9747" />
    <path ${strokeColorStyle} d="M 1100,0 A 1100,1100 0 0 1 1094.9747,105.02525 M 105.02527,1094.9747 A 1100,1100 0 0 1 0,1100 M 900,0 A 900,900 0 0 1 888.22495,145.10839 M 145.10839,888.22495 A 900,900 0 0 1 0,900 M 700,0 A 700,700 0 0 1 656.15528,243.84471 M 243.84471,656.15528 A 700,700 0 0 1 0,700 M 100,1200 A 1100,1100 0 0 1 105.02525,1094.9747 M 105.02525,1094.9747 A 1100,1100 0 0 1 145.10839,888.22494 M 145.10839,888.22494 A 1100,1100 0 0 1 243.84471,656.15529 M 243.84471,656.15529 A 1100,1100 0 0 1 656.15529,243.84472 M 656.15529,243.84472 A 1100,1100 0 0 1 888.22492,145.1084 M 888.22492,145.1084 A 1100,1100 0 0 1 1094.9747,105.02525 M 1094.9747,105.02525 A 1100,1100 0 0 1 1200,100 M 500,0 A 500,500 0 0 1 0,500 M 300,0 A 300,300 0 0 1 0,300 M 100,0 A 100,100 0 0 1 0,100 M 300,1200 A 900,900 0 0 1 1200,300 M 500,1200 A 700,700 0 0 1 1200,500 M 700,1200 A 500,500 0 0 1 1200,700 M 900,1200 A 300,300 0 0 1 1200,900 M 1100,1200 A 100,100 0 0 1 1200,1100" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 400,0 C 400,221 221,400 0,400 V 200 A 200,200 0 0 0 200,0 Z M 1200,1000 C 1000,1000 800,800 800,0 H 1000 A 200,200 0 0 0 1200,200 V 400 A 200,200 0 1 0 1200,800 Z M 0,800 C 800,800 1000,1000 1000,1200 H 800 A 200,200 0 1 0 400,1200 H 200 A 200,200 0 0 0 0,1000 Z" />
    <path ${secondaryColorStyle} d="M 200,1200 C 200,1089.5431 110.45695,1000 0,1000 V 1200 Z M 0,200 C 110.45695,200 200,110.45695 200,0 H 0 Z M 1000,0 C 1000,110.45695 1089.5431,200 1200,200 V 0 Z M 1200,400 C 1089.543,400 1000.0001,489.54305 1000.0001,600 1000.0001,710.45695 1089.543,800 1200,800 Z M 800,1200 C 800,1089.543 710.45695,1000.0001 600,1000.0001 489.54305,1000.0001 400,1089.543 400,1200 Z M 1200,1000 C 1000,1000 800,800 800,0 H 400 C 400,221 221,400 0,400 V 800 C 800,800 1000,1000 1000,1200 H 1200 Z" />
    <path ${strokeColorStyle} d="M 1000,0 A 200,200 0 0 0 1200,200 M 1200,400 A 200,200 0 1 0 1200,800 M 1200,1000 C 1000,1000 800,800 800,0 M 0,200 A 200,200 0 0 0 200,0 M 400,0 C 400,221 221,400 0,400 M 800,1200 A 200,200 0 1 0 400,1200 M 200,1200 A 200,200 0 0 0 0,1000 M 0,800 C 800,800 1000,1000 1000,1200" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 0,240 C 66.274215,240 120,293.72583 120,360 120,426.27417 66.274215,480 0,480 Z M 720,1200 C 720,1000 430,760 340,880 250,1000 480,1000 480,1200 H 240 C 240,1067.4517 132.54834,960 0,960 V 720 C 182.25397,720 330,572.25397 330,390 330,270 240,120 240,0 H 480 C 480,600 960,960 960,1200 Z M 1200,960 C 1000,960 760,670 880,580 1000,490 1000,720 1200,720 Z M 1200,480 C 1072.6961,480 950.60621,429.42872 860.58875,339.41125 770.57128,249.39379 720,127.30392 720,0 H 960 C 960,132.54834 1067.4517,240 1200,240 Z" />
    <path ${secondaryColorStyle} d="M 0,240 C 66.274215,240 120,293.72583 120,360 120,426.27417 66.274215,480 0,480 V 720 C 182.25397,720 330,572.25397 330,390 330,270 240,120 240,0 H 0 Z M 240,1200 C 240,1067.4517 132.54834,960 0,960 V 1200 Z M 480,1200 C 480,1000 250,1000 340,880 430,760 720,1000 720,1200 Z M 1200,960 C 1000,960 760,670 880,580 1000,490 1000,720 1200,720 V 480 C 1072.6961,480 950.60621,429.42872 860.58875,339.41125 770.57128,249.39379 720,127.30392 720,0 H 480 C 480,600 960,960 960,1200 H 1200 Z M 960,0 C 960,132.54834 1067.4517,240 1200,240 V 0 Z" />
    <path ${strokeColorStyle} d="M 480,1200 C 480,1000 250,1000 340,880 430,760 720,1000 720,1200 M 0,720 A 330,330 0 0 0 330,390 C 330,270 240,120 240,0 M 1200,480 A 480,480 0 0 1 720,0 M 960,0 A 240,240 0 0 0 1200,240 M 1200,960 C 1000,960 760,670 880,580 1000,490 1000,720 1200,720 M 0,240 A 120,120 0 0 1 0,480 M 480,0 C 480,600 960,960 960,1200 M 240,1200 A 240,240 0 0 0 0,960" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 240,1200 C 240,960 480,833 480,600 480,353 240,240 240,0 H 480 C 480,480 960,720 960,1200 H 720 C 721.3,1122.8 709.7,1033.3 695.3,960 674.6,854.8 640.7,787.2 568.3,874 502.2,953.5 480,1057 480,1200 Z M 1200,720 C 1058,720 1049.3,625.5 976.8,670 927.8,700 928.5,772.7 982.3,847 1016.3,893.6 1097,960 1200,960 M 360,600 A 360,360 0 0 1 0,960 V 720 A 120,120 0 1 0 0,480 V 240 A 360,360 0 0 1 360,600 Z M 720,0 H 960 A 240,240 0 0 0 1200,240 V 480 A 480,480 0 0 1 720,0 Z" />
    <path ${secondaryColorStyle} d="M 0,720 C 66.274215,720 119.99995,666.27417 119.99995,600 119.99995,533.72583 66.274215,480 0,480 Z M 960,0 C 960,132.54834 1067.4517,240 1200,240 V 0 Z M 720,1200 C 721.3,1122.8 709.7,1033.3 695.3,960 674.6,854.8 640.7,787.2 568.3,874 502.2,953.5 480,1057 480,1200 Z M 240,1200 C 240,960 480,833 480,600 480,353 240,240 240,0 V 0 H 0 V 240 C 198.82264,240 359.99984,401.17749 359.99984,600 359.99984,798.82251 198.82264,960 0,960 V 1200 Z M 720,0 V 0 C 720,127.30392 770.57128,249.39379 860.58875,339.41125 950.60621,429.42872 1072.6961,480 1200,480 V 720 C 1058,720 1049.3,625.5 976.8,670 927.8,700 928.5,772.7 982.3,847 1016.3,893.6 1097,960 1200,960 V 1200 H 960 C 960,720 480,480 480,0 V 0 Z" />
    <path ${strokeColorStyle} d="M 240,1200 C 240,960 480,833 480,600 480,353 240,240 240,0 V 0 M 1200,720 C 1058,720 1049.3,625.5 976.8,670 927.8,700 928.5,772.7 982.3,847 1016.3,893.6 1097,960 1200,960 M 0,240 A 360,360 0 1 1 0,960 M 0,720 A 120,120 0 1 0 0,480 M 1200,480 A 480,480 0 0 1 720,0 V 0 M 960,0 A 240,240 0 0 0 1200,240 M 480,0 V 0 C 480,480 960,720 960,1200 M 720,1200 C 721.3,1122.8 709.7,1033.3 695.3,960 674.6,854.8 640.7,787.2 568.3,874 502.2,953.5 480,1057 480,1200" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 960,0 C 960,200 660,435 580,325 506.3,223.7 720,200 720,0 Z M 720,1200 C 720,600 960,240 1200,240 V 480 C 1133.7258,480 1080.0001,533.72583 1080.0001,600 1080.0001,666.27417 1133.7258,720 1200,720 V 960 C 1067.4517,960 960,1067.4517 960,1200 Z M 240,1200 C 240,1067.4517 132.54834,960 0,960 V 720 C 242.06538,720 181.06813,827.17278 350.70529,657.53562 444.78674,557.20601 571.9975,498.9965 620,564.99994 693.7,666.29994 480,689.99994 480,889.9999 V 1200 Z M 0,240 C 132.54834,240 240,132.54834 240,0 H 480 C 480,265 265,480 0,480 Z" />
    <path ${secondaryColorStyle} d="M 0,240 C 132.54834,240 240,132.54834 240,0 H 0 Z M 240,1200 C 240,1067.4517 132.54834,960 0,960 V 1200 Z M 1200,960 C 1067.4517,960 960,1067.4517 960,1200 H 1200 Z M 1200,480 C 1133.7258,480 1080.0001,533.72583 1080.0001,600 1080.0001,666.27417 1133.7258,720 1200,720 Z M 960,0 C 960,200 660,435 580,325 506.3,223.7 720,200 720,0 H 480 C 480,265 265,480 0,480 V 720 C 242.06538,720 181.06813,827.17278 350.70529,657.53562 444.78674,557.20601 571.9975,498.9965 620,564.99994 693.7,666.29994 480,689.99994 480,889.9999 V 1200 H 720 C 720,600 960,240 1200,240 V 0 Z" />
    <path ${strokeColorStyle} d="M 960,0 C 960,200 660,435 580,325 506.3,223.7 720,200 720,0 M 240,1200 A 240,240 0 0 0 0,960 M 480,1200 V 889.9999 C 480,689.99994 693.7,666.29994 620,564.99994 571.9975,498.9965 444.78674,557.20601 350.70529,657.53562 181.06813,827.17278 242.06538,720 0,720 M 480,0 C 480,265 265,480 0,480 M 0,240 A 240,240 0 0 0 240,0 M 1200,480 A 120,120 0 1 0 1200,720 M 1200,960 A 240,240 0 0 0 960,1200 M 720,1200 C 720,600 960,240 1200,240" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 0,1200 V 800 C 618.2,800 519.8,561.2 812.3,452.6 800,336.9 800,188 800,0 H 1200 V 400 C 1018.2,400 898.4,420.7 812.3,452.6 839.3,705.8 925.4,800 1200,800 V 1200 H 800 C 800,940 400,940 400,1200 Z M 0,0 H 400 C 400,220 220,400 0,400 Z" />
    <path ${secondaryColorStyle} d="M 400,1200 C 400,940 800,940 800,1200 Z M 812.3315,452.58835 C 519.83249,561.15161 618.18881,800 0,800 V 400 C 220,400 400,220 400,0 H 800 C 800,188.13511 800,336.94264 812.3315,452.58835 M 812.3315,452.58835 C 839.32758,705.75962 925.42341,800 1200,800 V 400 C 1018.1888,400 898.35634,420.65957 812.3315,452.58835" />
    <path ${strokeColorStyle} d="M0 400c220 0 400-180 400-400M800 0c0 600 0 800 400 800M1200 400C400 400 800 800 0 800M400 1200c0-260 400-260 400 0" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 0,1200 V 800 C 200,800 400,1000 400,1200 Z M 0,0 H 400 C 400,115 433,230.1 489.8,335.7 715,260.7 800,130.3 800,0 H 1200 V 400 C 1007.4,400 907.6,539 855.8,705.6 A 936.5,936.5 0 0 1 489.8,335.6 C 369.4,375.8 209,400 0,400 Z M 1200,1200 H 800 C 800,1096.3 800,885 855.8,705.6 963.7,765 1081.8,800 1200,800 Z" />
    <path ${secondaryColorStyle} d="M 489.77892,335.67501 C 433.10022,230.13116 400,115.06558 400,0 H 800 C 800,130.347 715.0483,260.694 489.77889,335.67501 M 855.79152,705.57573 C 963.65132,765.08706 1081.8257,800 1200,800 V 400 C 1007.4418,400 907.58026,539.04497 855.79161,705.57554 M 855.79161,705.57554 C 800,884.97794 800,1096.2791 800,1200 H 400 C 400,1000 200,800 0,800 V 400 C 208.959,400 369.40259,375.7423 489.77889,335.67501 M 489.77892,335.67501 C 571.92116,488.6356 703.58665,621.59713 855.79152,705.57573" />
    <path ${strokeColorStyle} d="M 800,0 C 800,200 600,400 0,400 M 0,800 C 200,800 400,1000 400,1200 M 1200,400 C 800,400 800,1000 800,1200 M 400,0 C 400,400 800,800 1200,800" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M 0,1200 V 800 H 400 C 400,550 800,550 800,800 H 1200 V 1200 H 800 V 800 H 400 V 1200 Z M 0,0 H 400 C 400,106.4 456.6,212.8 600,289.1 474,356.2 280.7,400 0,400 Z M 1200,0 V 400 C 919.3,400 726,356.2 600,289.1 743.4,212.8 800,106.4 800,0.1 V 0 Z" />
    <path ${secondaryColorStyle} d="M 0,800 V 400 C 280.74669,400 473.91705,356.21183 600,289.12446 726.08298,356.21184 919.25333,400 1200,400 V 800 H 800 C 800,550 400,550 400,800 Z M 600.00003,289.12446 C 743.3763,212.83553 800,106.41778 800,0 H 400 C 400,106.41778 456.62371,212.83555 600,289.12448 M 800,800 V 800 1200 H 400 V 800 M 400,800 800,800" />
    <path ${strokeColorStyle} d="M0 400c600 0 800-200 800-400M400 0c0 200 200 400 800 400M0 800h1200M400 1200V800c0-250 400-250 400 0v400" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M0 1200V800c260 0 407.3-75.1 539.6-160.2C390.8 495.5 195.4 400 0 400V0h1200v400c-340 0-487.3 128.5-660.4 239.8a924.6 924.6 0 0 1 170.6 224.5C830.6 824.3 991 800 1200 800v400H400l173.6 46.3L800 1200c0-115-33.1-230.1-89.8-335.7C485 939.3 400 1069.7 400 1200H0zM800 0H400c0 270 400 270 400 0zM539.6 639.8z" />
    <path ${secondaryColorStyle} d="M 400,0 C 400,270 800,270 800,0 Z M 0,400 C 400,400 800,800 800,1200 H 400 C 400,1000 600,800 1200,800 V 400 C 600,400 600,800 0,800 Z" />
    <path ${strokeColorStyle} d="M0 400c400 0 800 400 800 800M0 800c600 0 600-400 1200-400M400 1200c0-200 200-400 800-400M400 0c0 270 400 270 400 0" />
  `,
  (primaryColorStyle, secondaryColorStyle, strokeColorStyle) => `
    <path ${primaryColorStyle} d="M800 1200V0h400v400a200 200 0 1 0 0 400v400H800zM0 0h400c0 221-179 400-400 400V0zM0 1200V800c221 0 400 179 400 400H0z" />
    <path ${secondaryColorStyle} d="M 800,1200 V 0 H 400 C 400,221 221,400 0,400 V 800 C 221,800 400,979 400,1200 Z M 1200,400 C 1089.543,400 1000,489.54305 1000,600 1000,710.45695 1089.543,800 1200,800 Z" />
    <path ${strokeColorStyle} d="M800 1200V0M1200 400a200 200 0 1 0 0 400M400 0c0 221-179 400-400 400M0 800c221 0 400 179 400 400" />
  `,
];

// Event listener for load event. Sets up truchet tile canvas background.
window.addEventListener("load", () => {
  if (canvas) {
    // Setting canvas CSS values.
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = canvas.getAttribute("data-z-index") ?? Z_INDEX_DEFAULT;

    // Setting up tiles data.
    tilesSetData({
      pattern: canvas.getAttribute("data-pattern") ?? DATA_DEFAULTS.pattern,
      primaryColor: canvas.getAttribute("data-primary-color") ?? DATA_DEFAULTS.primaryColor,
      secondaryColor: canvas.getAttribute("data-secondary-color") ?? DATA_DEFAULTS.secondaryColor,
      strokeColor: canvas.getAttribute("data-stroke-color") ?? DATA_DEFAULTS.strokeColor,
      strokeSize: canvas.getAttribute("data-stroke-size") ?? DATA_DEFAULTS.strokeSize,
      tileSize: canvas.getAttribute("data-tile-size") ?? DATA_DEFAULTS.tileSize,
    });
  } else {
    console.error(
      `truchet-tiles <canvas> not setup. Ensure there is a <canvas> element with id="truchet-tiles" under the html body.`,
    );
  }
});

// Event listener for resize event.
window.addEventListener("resize", () => {
  if (!isCanvasRendered) {
    return;
  }
  const scaledCanvasSize = getScaledCanvasSize();
  if (window.devicePixelRatio !== devicePixelRatio || scaledCanvasSize !== canvasSize) {
    configureCanvas(scaledCanvasSize);
    drawTiles();
  }
});

// Event listener for mouse movements.
document.addEventListener(
  "mousemove",
  (event) => {
    if (isCanvasRendered) {
      handleMouseMove(event);
    }
  },
  { passive: true },
);

// Toggles debugging features when Konami code is entered.
document.addEventListener("keydown", (event) => {
  if (!isCanvasRendered) {
    return;
  }
  keyboardInputBuffer.push(event.key);
  if (keyboardInputBuffer.length > KONAMI_CODE.length) {
    keyboardInputBuffer.shift();
  }
  if (keyboardInputBuffer.join(",") === KONAMI_SEQUENCE) {
    debug = !debug;
    keyboardInputBuffer = [];
    drawTiles();
  }
});

// Gets scaled canvas length.
const getScaledCanvasSize = () => {
  const screenLength = Math.max(window.screen.height, window.screen.width);
  const windowLength = Math.max(window.innerHeight, window.innerWidth);
  if (screenLength >= windowLength) {
    return screenLength;
  }
  const ratio = windowLength / screenLength;
  const steps = Math.ceil((ratio - 1) / CANVAS_LENGTH_MULTIPLIER_INCREMENT);
  const finalMultiplier = 1 + steps * CANVAS_LENGTH_MULTIPLIER_INCREMENT;
  return Math.round(screenLength * finalMultiplier);
};

// Sets up the main canvas.
const configureCanvas = (inputCanvasSize = null) => {
  canvasSize = inputCanvasSize || getScaledCanvasSize();
  devicePixelRatio = window.devicePixelRatio;
  canvas.width = Math.round(canvasSize * devicePixelRatio);
  canvas.height = Math.round(canvasSize * devicePixelRatio);
  canvas.style.width = `${canvasSize}px`;
  canvas.style.height = `${canvasSize}px`;
  if (isSolidBackground) {
    canvasTileSize = 0;
    return;
  }
  const gridSize = Math.ceil(tilesData.tileSize * TILE_SIZE_SCALE);
  canvasTileSize = Math.round((canvasSize * devicePixelRatio) / gridSize);
};

// Validates and updates tiles data, reverting back to last valid tiles data or default values if necessary.
const validateAndUpdateData = (inputData, currentData) => {
  if (!inputData || typeof inputData !== "object") {
    return currentData;
  }
  const updatedData = { ...currentData };

  // Validating pattern.
  if (inputData.pattern !== undefined) {
    const isValidPattern = inputData.pattern.split("&").every((patternIndexString) => {
      const patternIndex = parseInt(patternIndexString, 10);
      return !isNaN(patternIndex) && patternIndex >= DATA_RANGES.pattern.min && patternIndex <= DATA_RANGES.pattern.max;
    });
    if (isValidPattern) {
      updatedData.pattern = inputData.pattern;
    } else {
      console.error(
        `The pattern "${inputData.pattern}" is invalid. ` +
          `Patterns needs to be in the range ${DATA_RANGES.pattern.min}-${DATA_RANGES.pattern.max}. ` +
          `Patterns can be combined with "&" as a delimiter. Using last valid pattern or default value.`,
      );
    }
  }

  // Validating colors.
  for (const colorType of COLOR_TYPES) {
    if (inputData[colorType] !== undefined) {
      const colorValue = inputData[colorType];
      if (colorValue == null) {
        continue;
      }
      const isValidColor = CSS.supports("color", colorValue);
      if (isValidColor) {
        updatedData[colorType] = colorValue;
      } else {
        console.error(`${colorType}: "${colorValue}" is not a valid color. Using last valid color or default.`);
      }
    }
  }

  // Validating stroke and size.
  for (const sliderType of SLIDER_TYPES) {
    if (inputData[sliderType] !== undefined) {
      const value = parseInt(inputData[sliderType], 10);
      const range = DATA_RANGES[sliderType];
      if (!isNaN(value) && value >= range.min && value <= range.max) {
        updatedData[sliderType] = value;
      } else {
        console.error(
          `${sliderType}: "${inputData[sliderType]}" is out of the range ${range.min}-${range.max}. ` +
            `Using last valid ${sliderType} or default.`,
        );
      }
    }
  }

  return updatedData;
};

// Handles updating truchet tiles with new data values.
export const tilesSetData = (inputData) => {
  if (!canvas) {
    console.error(
      `tilesSetData() called but truchet-tiles <canvas> not setup. Ensure there is a <canvas> element with id="truchet-tiles" under the html body.`,
    );
    return;
  }

  // Validate and update data.
  tilesData = validateAndUpdateData(inputData, tilesData);
  isSolidBackground = tilesData.tileSize === 0;

  // Determine type of update required.
  const svgNeedsRebuild =
    tilesData.pattern !== previousTilesData.pattern ||
    tilesData.primaryColor !== previousTilesData.primaryColor ||
    tilesData.secondaryColor !== previousTilesData.secondaryColor ||
    tilesData.strokeColor !== previousTilesData.strokeColor ||
    tilesData.strokeSize !== previousTilesData.strokeSize;
  const sizeChanged = tilesData.tileSize !== previousTilesData.tileSize;
  previousTilesData = { ...tilesData };

  // Full update.
  if (svgNeedsRebuild) {
    if (isLoading) {
      isRenderQueued = true;
    } else {
      loadTiles();
    }
    return;
  }

  // Fast update.
  if (sizeChanged && isCanvasRendered) {
    currentTileSize = tilesData.tileSize;
    configureCanvas();
    randomizeTileGrid(true);
    drawTiles();
  }
};

// Builds SVG data URI.
const buildSVG = (buildBasePaths, rotation) => {
  const primaryColorStyle = `style="stroke-width:0;fill:${tilesData.primaryColor};"`;
  const secondaryColorStyle = `style="stroke-width:0;fill:${tilesData.secondaryColor};"`;
  const strokeColorStyle = `style="fill:none;stroke:${tilesData.strokeColor};stroke-width:${tilesData.strokeSize * STROKE_SIZE_SCALE};"`;
  const basePaths = buildBasePaths(primaryColorStyle, secondaryColorStyle, strokeColorStyle);
  const svgString = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
    <g id="group" transform="rotate(${rotation * 90},600,600)">
      ${basePaths}
    </g>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// Handles loading the canvas tiles background.
const loadTiles = () => {
  isLoading = true;
  isRenderQueued = false;
  const patterns = tilesData.pattern.split("&");
  const newTotalRotations = patterns.length * 4;
  if (totalRotations !== newTotalRotations || !tiles) {
    totalRotations = newTotalRotations;
    tiles = Array(totalRotations);
    for (let i = 0; i < totalRotations; i++) {
      tiles[i] = new Image();
    }
  }

  const imagePromises = [];
  for (let i = 0; i < patterns.length; i++) {
    const patternIndex = parseInt(patterns[i], 10) - 1;
    const baseSVG = BASE_SVG_TILES[patternIndex];
    for (let rotation = 0; rotation < 4; rotation++) {
      const imageIndex = rotation + i * 4;
      const image = tiles[imageIndex];
      const loadPromise = new Promise((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(`Error loading image: ${image.src}`);
      });
      imagePromises.push(loadPromise);
      image.src = buildSVG(baseSVG, rotation);
    }
  }

  Promise.all(imagePromises)
    .then(() => {
      configureCanvas();
      if (currentPattern !== tilesData.pattern || currentTileSize !== tilesData.tileSize) {
        const preserveRotations = currentPattern === tilesData.pattern;
        randomizeTileGrid(preserveRotations);
        currentPattern = tilesData.pattern;
        currentTileSize = tilesData.tileSize;
      }
      drawTiles();
      isCanvasRendered = true;
      isLoading = false;
      if (isRenderQueued) {
        loadTiles();
      }
    })
    .catch((error) => {
      console.error(error);
      isLoading = false;
    });
};

// Randomizes tile grid.
const randomizeTileGrid = (preserveRotations = false) => {
  const newGridSize = Math.ceil(tilesData.tileSize * TILE_SIZE_SCALE);
  if (preserveRotations && tilesGrid) {
    const oldGridSize = tilesGrid.length;
    if (newGridSize > oldGridSize) {
      const newGrid = [];
      for (let x = 0; x < newGridSize; x++) {
        newGrid[x] = [];
        for (let y = 0; y < newGridSize; y++) {
          if (x < oldGridSize && y < oldGridSize) {
            newGrid[x][y] = tilesGrid[x][y];
          } else {
            newGrid[x][y] = Math.floor(Math.random() * totalRotations);
          }
        }
      }
      tilesGrid = newGrid;
    } else if (newGridSize < oldGridSize) {
      tilesGrid = tilesGrid.slice(0, newGridSize).map((col) => col.slice(0, newGridSize));
    }
  } else {
    tilesGrid = [];
    for (let x = 0; x < newGridSize; x++) {
      tilesGrid[x] = [];
      for (let y = 0; y < newGridSize; y++) {
        tilesGrid[x][y] = Math.floor(Math.random() * totalRotations);
      }
    }
  }
};

// Draws tiles on canvas.
const drawTiles = () => {
  if (isSolidBackground) {
    canvasContext.fillStyle = tilesData.primaryColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  const gridSize = Math.ceil(tilesData.tileSize * TILE_SIZE_SCALE);
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      canvasContext.drawImage(
        tiles[tilesGrid[i][j]],
        i * canvasTileSize,
        j * canvasTileSize,
        canvasTileSize,
        canvasTileSize,
      );
      if (debug) {
        canvasContext.strokeStyle = DEBUG_COLOR;
        canvasContext.lineWidth = 5;
        canvasContext.strokeRect(i * canvasTileSize, j * canvasTileSize, canvasTileSize, canvasTileSize);
      }
    }
  }
};

// Handles rotating tiles when they are moused over.
const handleMouseMove = (event) => {
  if (isSolidBackground) {
    return;
  }
  const mouseX = Math.floor(event.clientX * devicePixelRatio);
  const mouseY = Math.floor(event.clientY * devicePixelRatio);
  const columnIndex = Math.floor(mouseX / canvasTileSize);
  const rowIndex = Math.floor(mouseY / canvasTileSize);
  const gridSize = Math.ceil(tilesData.tileSize * TILE_SIZE_SCALE);
  if (
    (columnIndex != lastHoveredColumnIndex || rowIndex != lastHoveredRowIndex) &&
    columnIndex >= 0 &&
    columnIndex < gridSize &&
    rowIndex >= 0 &&
    rowIndex < gridSize
  ) {
    let randTileIndex;
    do {
      randTileIndex = Math.floor(Math.random() * totalRotations);
    } while (randTileIndex === tilesGrid[columnIndex][rowIndex]);
    tilesGrid[columnIndex][rowIndex] = randTileIndex;
    canvasContext.clearRect(columnIndex * canvasTileSize, rowIndex * canvasTileSize, canvasTileSize, canvasTileSize);
    canvasContext.drawImage(
      tiles[tilesGrid[columnIndex][rowIndex]],
      columnIndex * canvasTileSize,
      rowIndex * canvasTileSize,
      canvasTileSize,
      canvasTileSize,
    );
    if (debug) {
      canvasContext.strokeStyle = DEBUG_COLOR;
      canvasContext.lineWidth = DEBUG_LINE_WIDTH;
      canvasContext.strokeRect(columnIndex * canvasTileSize, rowIndex * canvasTileSize, canvasTileSize, canvasTileSize);
    }
    lastHoveredColumnIndex = columnIndex;
    lastHoveredRowIndex = rowIndex;
  }
  if (debug) {
    canvasContext.beginPath();
    canvasContext.arc(mouseX, mouseY, DEBUG_CURSOR_DOT_RADIUS, 0, 2 * Math.PI);
    canvasContext.fillStyle = DEBUG_COLOR;
    canvasContext.fill();
  }
};
