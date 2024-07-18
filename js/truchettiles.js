let screenHeight; // Screen height multiplied by devicePixelRatio.
let screenWidth; // Screen width multiplied by devicePixelRatio.
let screenMax; // Max of screen height and screen width.
let numSquares; // Number of squares to be shown along the screenMax.
let tileDistance; // Width of each tile.
let imgArray; // Holds the SVG tiles in use including rotations.
let imgGridArray; // Holds all the SVG tiles on the canvas.
let totalImages; // Total count of images on the canvas.
let curX = -1; // Current x mouse value of which square is being moused over.
let curY = -1; // Current y mouse value of which square is being moused over.

// Defaults values to override.
let tilesStyle = "9";
let tilesColor1 = "#DEE1E6";
let tilesColor2 = "#F1F3F4";
let tilesColor3 = "#292F33";
let tilesThickness = "40";
let tilesSize = "12";

// These values are maintained each time the canvas is drawn.
let liveTilesStyle = null;
let liveTilesDistance = null;

// Base tile SVGs before color and stroke width are applied.
let svgArray = Array(15);
svgArray[0] =
  '<g id="group">' +
  '<path class="fillColor" d="M500,1200c0-386.59932,313.40068-700,700-700v200c-276.14237,0-500,223.85763-500,500h-200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M700,0C700,386.59932,386.59932,700,0,700v-200C276.14237,500,500,276.14237,500,0h200Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,500C276.14237,500,500,276.14237,500,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M700,0C700,386.59932,386.59932,700,0,700" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,700c-276.14237,0-500,223.85763-500,500" style="fill:none;"/>' +
  '<path class="strokeColor" d="M500,1200c0-386.59932,313.40068-700,700-700" style="fill:none;"/>' +
  "</g>";
svgArray[1] =
  '<g id="group">' +
  '<path class="fillColor" d="M240,0L1200,960v0v240h-240L0,240L0,0h240Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1200,240L960,0h240L1200,240Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,1200v-240l240,240h-240Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M1200,240L960,0" style="fill:none;stroke-linecap:square;"/>' +
  '<path class="strokeColor" d="M240,0L1200,960v0" style="fill:none;stroke-linecap:square;"/>' +
  '<path class="strokeColor" d="M960,1200L0,240" style="fill:none;stroke-linecap:square;"/>' +
  '<path class="strokeColor" d="M0,960l240,240" style="fill:none;stroke-linecap:square;"/>' +
  "</g>";
svgArray[2] =
  '<g id="group">' +
  '<path class="fillColor" d="M1045.001403,599.999994c0-300-.00006-299.999994,154.998597-299.999994v150c-79.999295-.000006-79.999295-.000006-79.999295,149.999994s0,150.000006,79.999295,150.000006v149.999999c-154.998597,0-154.998597-.000005-154.998597-300.000005Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M900,1200L900,0h-150c0,150,0,150-150.000002,150s-150,0-149.999998-150h-149.999999c-.000001,165.501712,0,105.958245,0,301.58075C300.000001,449.999999,299.999998,450,549.999998,450s250-.000001,250,150c0,100-50,30-50,150C750,860,750,1110,749.999999,1200" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0.000002,300C150,299.999994,150,299.999993,150,449.999994s.000003,150,150.000003,150s149.999997,0,149.999999,150.000004-.000002,369.831072-.000002,450.000002l-150,4.860503c0-49.596947.000004-119.466065.000003-154.860509c0-158.41925,0-148.41925-150.000003-148.41925-38.278123,0-90.604247-1.580745-150-1.580745l.000002-150.000005c61.789071-.000001,59.999998,0,149.999998,0c150.000003,0,149.999997-10,150-25s.000003-25-150-25c-50,0-50,0-50-100c0-12.600585,0-34.275582,0-50c0-99.999998,0-100-99.999998-99.999998v-149.999996Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M1201.420669,900.892827c-157.93473,0-157.934754,0-157.93469-300.897281-.000064-300.897281-.000071-300.897271,157.93469-300.897269" transform="matrix(.981409 0 0 0.997018 20.914875 1.793635)" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,450c-79.999293,0-79.999294-.000006-79.999294,149.999994s.000001,150,79.999294,150.000006" style="fill:none;"/>' +
  '<path class="strokeColor" d="M900,1200L900,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M750,0c0,150,0,150-150.000002,150s-150,0-149.999998-150" style="fill:none;"/>' +
  '<path class="strokeColor" d="M300.000003,0c-.000001,165.501712-.000002,105.958245-.000002,301.58075C300.000001,449.999999,299.999998,450,549.999998,450s250-.000001,250,150c0,100-50,30-50,150C750,860,750,1110,749.999999,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0.000002,300C150,299.999994,150,299.999993,150,449.999994s.000003,150,150.000003,150s149.999997,0,149.999999,150.000004-.000002,369.831072-.000002,450.000002" style="fill:none;"/>' +
  '<path class="strokeColor" d="M300.000003,1200c0-49.596947.000001-114.605562,0-150.000006c0-158.41925,0-148.41925-150.000003-148.41925-38.278123,0-90.604247-1.580745-150-1.580745" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0.000002,749.999994c61.789071-.000001,59.999998,0,149.999998,0c150.000003,0,149.999997-10,150-25s.000003-25-150-25c-50,0-50,0-50-100c0-12.600585,0-34.275582,0-50c0-99.999998,0-100-99.999998-99.999998" style="fill:none;"/>' +
  "</g>";
svgArray[3] =
  '<g id="group">' +
  '<path class="fillColor" d="M200,0c0,47.495337-7.240042,35.950957-27.441694,78.972944-5.737301,12.218312-17.65484,48.111754-9.685417,85.958082c4.422414,21.001789,21.156103,29.824644,26.634898,62.955214c1.907258,11.533294-7.647762,35.863546-9.685418,38.741671-19.111642,26.994583-60.294688,15.197243-95.643499-10.896095C55.409568,234.495271,34.51108,200,0,200L0,0L200,0Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,400c44.370614,0,163.303008,3.580943,172.558296,59.247809c11.894487,71.540593-19.212811,69.708569-9.685417,160.887758c5.00234,47.873456,6.518585,94.908635,0,133.078932-6.874949,40.257026-34.716471,58.805638-68.506384,58.805638C68.517139,812.020137,72.966543,800,0,800v-400Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M200,1200h-200v-200c35.694178,0,74.910141,5.80091,140.192033-43.160509c20.299966-15.224974,75.720857-95.358712,85.288125-115.607402c19.761356-41.824015,22.779271-114.463738,60.111909-120.320675c41.724713-1.098018,42.431936,52.517848,42.431936,109.615834c0,46.302255-52.605194,146.12996-84.080392,195.091379C205.209775,1085.871276,200,1084.93339,200,1200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M800,0h-400c0,164.931026,55.486818,175.165729,37.566118,244.121892-9.945325,38.268119-98.563849,109.316268-87.811429,137.989388c16.038652,42.769739,91.022322,14.986002,143.365598,87.811428c41.21761,57.346239,1.79207,130.077285,78.851079,130.077285s24.534931-114.166112,68.098658-171.294894c13.714057-17.984398,90.381963-112.807202,125.444898-200.818859C803.76098,131.884621,800,41.3133,800,0Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1200,200c-200,0-260.665797,199.688573-330.581946,114.57326C814.005169,247.114095,1000.045868,200,1000,0L1200,0v200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M400,1200c0-304.94516,126.54839-303.46482,255.22273-358.76791c101.82624-43.76401,86.46481-170.56502,124.06445-207.61806C872.28665,541.96651,943.86247,618.42247,1000,481.69838c35.09041-108.06605,116.03355-81.69837,200-81.69837v400c-76.83093,0-156.94288-66.25323-213.55422-27.55425-53.25708,36.40603-63.60634,83.12732-93.59446,155.99077-12.78437,31.06275-54.67326,62.76739-68.24596,97.18211-25.97939,65.8729-24.51362,78.3075-24.60535,174.38137L400,1200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1000,1200c0-87.152491,22.641138-83.462055,61.759765-129.223467C1095.348553,1031.48399,1121.544836,1000,1200,1000v200h-200Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M200,0c0,47.495337-7.240042,35.950957-27.441694,78.972944-5.737301,12.218312-17.65484,48.111754-9.685417,85.958082c4.422414,21.001789,21.156103,29.824644,26.634898,62.955214c1.907258,11.533294-7.647762,35.863546-9.685418,38.741671-19.111642,26.994583-60.294688,15.197243-95.643499-10.896095C55.409568,234.495271,34.51108,200,0,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,400c44.370614,0,163.303008,3.580943,172.558296,59.247809c11.894487,71.540593-19.212811,69.708569-9.685417,160.887758c5.00234,47.873456,6.518585,94.908635,0,133.078932-6.874949,40.257026-34.716471,58.805638-68.506384,58.805638C68.517139,812.020137,72.966543,800,0,800" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,1000c35.694178,0,74.910141,5.80091,140.192033-43.160509c20.299966-15.224974,75.720857-95.358712,85.288125-115.607402c19.761356-41.824015,22.779271-114.463738,60.111909-120.320675c41.724713-1.098018,42.431936,52.517848,42.431936,109.615834c0,46.302255-52.605194,146.12996-84.080392,195.091379C205.209775,1085.871276,200,1084.93339,200,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0c0,164.931026,55.486818,175.165729,37.566118,244.121892-9.945325,38.268119-98.563849,109.316268-87.811429,137.989388c16.038652,42.769739,91.022322,14.986002,143.365598,87.811428c41.21761,57.346239,1.79207,130.077285,78.851079,130.077285s24.534931-114.166112,68.098658-171.294894c13.714057-17.984398,90.381963-112.807202,125.444898-200.818859C803.76098,131.884621,800,41.3133,800,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,200c-200,0-260.665797,199.688573-330.581946,114.57326C814.005169,247.114095,1000.045868,200,1000,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,800c-76.83093,0-156.94288-66.25323-213.55422-27.55425-53.25708,36.40603-63.60634,83.12732-93.59446,155.99077-12.78437,31.06275-54.67326,62.76739-68.24596,97.18211-25.97939,65.8729-24.51362,78.3075-24.60535,174.38137" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,1200c0-304.94516,126.54839-303.46482,255.22273-358.76791c101.82624-43.76401,86.46481-170.56502,124.06445-207.61806C872.28665,541.96651,943.86247,618.42247,1000,481.69838c35.09041-108.06605,116.03355-81.69837,200-81.69837" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1000,1200c0-87.152491,22.641138-83.462055,61.759765-129.223467C1095.348553,1031.48399,1121.544836,1000,1200,1000" style="fill:none;"/>' +
  "</g>";
svgArray[4] =
  '<g id="group">' +
  '<path class="fillColor" d="M400,0C400,220.9139,220.9139,400,0,400v-200c110.45695,0,200-89.54305,200-200h200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1200,1000C1000,1000,800,800,800,0h200c0,110.45695,89.54305,200,200,200v200c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200v200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,800c800,0,1000,200,1000,400h-200c0-110.45695-89.54305-200-200-200s-200,89.54305-200,200h-200c0-110.45695-89.54305-200-200-200v-200Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M1000,0c0,110.45695,89.54305,200,200,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,1000C1000,1000,800,800,800,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,200c110.45695,0,200-89.54305,200-200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0C400,220.9139,220.9139,400,0,400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M800,1200c0-110.45695-89.54305-200-200-200s-200,89.54305-200,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M200,1200c0-110.45695-89.54305-200-200-200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,800c800,0,1000,200,1000,400" style="fill:none;"/>' +
  "</g>";
svgArray[5] =
  '<g id="group">' +
  '<path class="fillColor" d="M0,200c220,0,400,180,400,400c0,170,0,336.45296,0,600h-200c0-110.45695-89.54305-200-200-200v-200c110.45695,0,200-89.54305,200-200s-89.54305-200-200-200v-200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M800,1200c0-221.85855,0-380.69927,0-600c0-220,180-400,400-400v200c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200v200c-110.45695,0-200,89.54305-200,200h-200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M600,400C379.0861,400,200,220.9139,200,0h200c0,110.45695,89.54305,200,200,200s200-89.54305,200-200h200c0,220.9139-179.0861,400-400,400Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,200c220,0,400,180,400,400c0,170,0,336.45296,0,600" style="fill:none;"/>' +
  '<path class="strokeColor" d="M200,1200c0-110.45695-89.54305-200-200-200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,800c110.45695,0,200-89.54305,200-200s-89.54305-200-200-200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M800,1200c0-221.85855,0-380.69927,0-600c0-220,180-400,400-400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,1000c-110.45695,0-200,89.54305-200,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0c0,110.45695,89.54305,200,200,200s200-89.54305,200-200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1000,0c0,220.9139-179.0861,400-400,400s-400-179.0861-400-400" style="fill:none;"/>' +
  "</g>";
svgArray[6] =
  '<g id="group">' +
  '<path class="fillColor" d="M840,1080c66.27417,0,120,53.72583,120,120h-240c0-66.27417,53.72583-120,120-120Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M120,360c0,66.27417-53.72583,120-120,120v-240c66.27417,0,120,53.72583,120,120Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M240,0c0-198.82251,161.17749-360,360-360s360,161.17749,360,360-161.17749,360-360,360-360-161.17749-360-360ZM600,120c66.27417,0,120-53.72583,120-120s-53.72583-120-120-120-120,53.72583-120,120s53.72583,120,120,120Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,720c600,0,800-480,1200-480v240C600,480,400,960,0,960" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M240,1200c0-240,560-480,960-480v240c-400,0-720-100-720,240h-240Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M720,1200c0-66.27417,53.72583-120,120-120s120,53.72583,120,120" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,240c66.27417,0,120,53.72583,120,120s-53.72583,120-120,120" style="fill:none;"/>' +
  '<path class="strokeColor" d="M960,0c0,198.82251-161.17749,360-360,360s-360-161.17749-360-360" style="fill:none;"/>' +
  '<path class="strokeColor" d="M480,0c0,66.27417,53.72583,120,120,120s120-53.72583,120-120" style="fill:none;"/>' +
  '<path class="strokeColor" d="M240,1200c0-240,560-480,960-480" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,960c-400,0-720-100-720,240" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,720c600,0,800-480,1200-480" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,480C600,480,400,960,0,960" style="fill:none;"/>' +
  "</g>";
svgArray[7] =
  '<g id="group">' +
  '<path class="fillColor" d="M120,360c0,66.27417-53.72583,120-120,120v-240c66.27417,0,120,53.72583,120,120Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,720c240,0,400-120,400-360C400,180,240,180,240,0h240c0,600,480,960,480,1200h-240c0-370-420-500-480-370-50.634992,109.70915,240,130,240,370h-240c0-132.54834-107.45166-240-240-240v-240Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1200,480C934.90332,480,720,265.09668,720,0h240c0,132.54834,107.45166,240,240,240v240Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1200,720v240c-200,0-450-360-340-440c101.33434-73.697702,140,200,340,200Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,240c66.27417,0,120,53.72583,120,120s-53.72583,120-120,120" style="fill:none;"/>' +
  '<path class="strokeColor" d="M480,0c0,600,480,960,480,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M720,1200c0-370-420-500-480-370-50.634992,109.70915,240,130,240,370" style="fill:none;"/>' +
  '<path class="strokeColor" d="M240,1200c0-132.54834-107.45166-240-240-240" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,720c240,0,400-120,400-360C400,180,240,180,240,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,480C934.90332,480,720,265.09668,720,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M960,0c0,132.54834,107.45166,240,240,240" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,960c-200,0-450-360-340-440c101.33434-73.697702,140,200,340,200" style="fill:none;"/>' +
  "</g>";
svgArray[8] =
  '<g id="group">' +
  '<path class="fillColor" d="M360,600C360,798.82251,198.82251,960,0,960v-240c66.27417,0,120-53.72583,120-120s-53.72583-120-120-120v-240c198.82251,0,360,161.17749,360,360Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M720,0h240c0,132.54834,107.45166,240,240,240v240c-265.09668,0-480-214.90332-480-480L720,0Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M240,1200c0-240,240-366.96105,240-600C480,353.03458,240,240,240,0L240,0h240L480,0C480,480,960,720,960,1200h-240c1.29212-77.22177-10.28015-166.66001-24.69958-240-20.68019-105.18335-54.55499-172.7924-126.92505-85.94833C502.18165,953.48413,480,1057.06558,480,1200L240,1200Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1200,720c-141.992166,0-150.683034-94.527751-223.227209-50.012006-48.963587,30.045838-48.307068,102.757318,5.564044,176.936599C1016.206355,893.562143,1096.956141,960,1200,960" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,240c198.82251,0,360,161.17749,360,360s-161.17749,360-360,360" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,720c66.27417,0,120-53.72583,120-120s-53.72583-120-120-120" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,480c-265.09668,0-480-214.90332-480-480L720,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M960,0c0,132.54834,107.45166,240,240,240" style="fill:none;"/>' +
  '<path class="strokeColor" d="M480,0L480,0C480,480,960,720,960,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M720,1200c1.29212-77.22177-10.28015-166.66001-24.69958-240-20.68019-105.18335-54.55499-172.7924-126.92505-85.94833C502.18165,953.48413,480,1057.06558,480,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M240,1200c0-240,240-366.96105,240-600C480,353.03458,240,240,240,0L240,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,720c-141.992166,0-150.683034-94.527751-223.227209-50.012006-48.963587,30.045838-48.307068,102.757318,5.564044,176.936599C1016.206355,893.562143,1096.956141,960,1200,960" style="fill:none;"/>' +
  "</g>";
svgArray[9] =
  '<g id="group">' +
  '<path class="fillColor" d="M0,720C397.64502,720,720,397.64502,720,0h240v0c0,480-480,480-480,1200h-240c0-132.54834-107.45166-240-240-240v-240Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M480,0C480,265.09668,265.09668,480,0,480v-240C132.54834,240,240,132.54834,240,0h240Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M1080,600c0,66.27417,53.72583,120,120,120v240c-132.54834,0-240,107.45166-240,240h-240c0-600,240-960,480-960v240c-66.27417,0-120,53.72583-120,120Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M960,0v0c0,480-480,480-480,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M240,1200c0-132.54834-107.45166-240-240-240" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,720C397.64502,720,720,397.64502,720,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M480,0C480,265.09668,265.09668,480,0,480" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,240C132.54834,240,240,132.54834,240,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,480c-66.27417,0-120,53.72583-120,120s53.72583,120,120,120" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,960c-132.54834,0-240,107.45166-240,240" style="fill:none;"/>' +
  '<path class="strokeColor" d="M720,1200c0-600,240-960,480-960" style="fill:none;"/>' +
  "</g>";
svgArray[10] =
  '<g id="group">' +
  '<path class="fillColor" d="M0,1200v-400c618.18882,0,519.83249-238.84838,812.3315-347.41165C800,336.94264,800,188.13511,800,0h400v400c-181.81118,0-301.64366,20.65957-387.6685,52.58835C839.32758,705.75962,925.42341,800,1200,800v400h-400c0-260-400-260-400,0h-400ZM0,0h400C400,220,220,400,0,400L0,0Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,400C220,400,400,220,400,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M800,0c0,600,0,800,400,800" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,400C400,400,800,800,0,800" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,1200c0-260,400-260,400,0" style="fill:none;"/>' +
  "</g>";
svgArray[11] =
  '<g id="group">' +
  '<path class="fillColor" d="M0,1200v-400c200,0,400,200,400,400h-400ZM0,0h400c0,115.06673,33.09963,230.13221,89.77741,335.6755C715.04792,260.69457,800,130.34729,800,0h400v400c-192.55873,0-292.4203,139.04574-344.20883,305.57693c0,0,0,0,0,0C703.58552,621.59884,571.91949,488.63746,489.77742,335.6755C369.40129,375.7425,208.95815,400,0,400L0,400L0,0ZM1200,1200h-400c0-103.72064,0-315.02097,55.79117-494.42307C963.65108,765.08765,1081.82554,800,1200,800v400Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M800,0C800,200,600,400,0,400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,800C200,800,400,1000,400,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,400C800,400,800,1000,800,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0C400,400.007541,800,800,1200,800" style="fill:none;"/>' +
  "</g>";
svgArray[12] =
  '<g id="group">' +
  '<path class="fillColor" d="M0,1200v-400h400c0-250,400-250,400,0h400v400h-400v-400h-400v400h-400ZM0,0h400c-0,0-.00004.00001-.00006.00001c0,106.41777,56.62372,212.83554,200,289.12447C473.917,356.21184,280.74666,400,0,400L0,0ZM1200,0v400c-280.74666,0-473.917-43.78816-600-110.87552C743.37628,212.83556,800,106.41778,800,0L800,0L1200,0Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,400C600,400,800,200,800,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0C400,200,600,400,1200,400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,800L1200,800" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,1200c0-186.043131,0-300,0-400c0-250,400-250,400,0c0,100,0,200.933141,0,400" style="fill:none;"/>' +
  "</g>";
svgArray[13] =
  '<g id="group">' +
  '<path class="fillColor" d="M0,1200v-400c259.98458,0,407.31585-75.1022,539.6209-160.22189C390.84347,495.47414,195.42173,400,0,400L0,0h1200v400c-340.0154,0-487.34668,128.4561-660.37908,239.77811C607.76823,705.87636,666.12917,782.21954,710.22109,864.325C830.59739,824.2577,991.04099,800,1200,800v400h-800l173.63344,46.30225L800,1200h0c0-115.06558-33.10022-230.13116-89.77892-335.675C484.9517,939.30601,400,1069.653,400,1200h-400ZM800,0h-400c0,270,400,270,400,0ZM539.62091,639.77811c0,0,0,0,0,0s-0-0-0-0v0Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M0,400C400,400,800,800,800,1200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,800C600,800,600,400,1200,400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,1200c0-200,200-400,800-400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0C400,270,800,270,800,0" style="fill:none;"/>' +
  "</g>";
svgArray[14] =
  '<g id="group">' +
  '<path class="fillColor" d="M800,1200L800,0h400v400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200v400h-400Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,0h400C400,220.9139,220.9139,400,0,400L0,0Z" style="stroke-width:0;"/>' +
  '<path class="fillColor" d="M0,1200v-400c220.9139,0,400,179.0861,400,400h-400Z" style="stroke-width:0;"/>' +
  '<path class="strokeColor" d="M800,1200L800,0" style="fill:none;"/>' +
  '<path class="strokeColor" d="M1200,400c-110.45695,0-200,89.54305-200,200s89.54305,200,200,200" style="fill:none;"/>' +
  '<path class="strokeColor" d="M400,0C400,220.9139,220.9139,400,0,400" style="fill:none;"/>' +
  '<path class="strokeColor" d="M0,800c220.9139,0,400,179.0861,400,400" style="fill:none;"/>' +
  "</g>";

// Event listener for load event. Loads the truchet-tiles canvas elements attributes if they are available.
window.addEventListener("load", function () {
  let truchetTiles = document.getElementById("truchet-tiles");
  if (truchetTiles.hasAttribute("data-style")) {
    tilesSetStyle(truchetTiles.getAttribute("data-style"), false);
  }
  if (truchetTiles.hasAttribute("data-color-1")) {
    tilesSetColor(truchetTiles.getAttribute("data-color-1"), 1, false);
  }
  if (truchetTiles.hasAttribute("data-color-2")) {
    tilesSetColor(truchetTiles.getAttribute("data-color-2"), 2, false);
  }
  if (truchetTiles.hasAttribute("data-color-3")) {
    tilesSetColor(truchetTiles.getAttribute("data-color-3"), 3, false);
  }
  if (truchetTiles.hasAttribute("data-outline-thickness")) {
    tilesSetThickness(truchetTiles.getAttribute("data-outline-thickness"), false);
  }
  if (truchetTiles.hasAttribute("data-size")) {
    tilesSetSize(truchetTiles.getAttribute("data-size"), false);
  }
  tilesLoad();
});

// Event listener for resize event.
window.addEventListener("resize", function () {
  tilesOnResize();
});

// Event listener for resize event.
document.body.addEventListener("mousemove", function (event) {
  tilesMouseMove(event);
});

// Setter function for tile style value.
function tilesSetStyle(input, load) {
  // Checking styles are in the appropriate range.
  let withinRange = true;
  let styleArray = input.split("&");
  for (let i = 0; i < styleArray.length; i++) {
    let numStyle = Number(styleArray[i]);
    if (numStyle < 1 || numStyle > 15) {
      console.error(
        "Style '" + input + "' is out of the range 1-15. Using last successful style value or default style value."
      );
      withinRange = false;
    }
  }
  if (withinRange) {
    tilesStyle = input;
  }
  if (load) {
    tilesLoad();
  }
}

// Setter function for all tile color values.
function tilesSetColor(input, number, load) {
  // Checking color is valid.
  let styleTest = new Option().style;
  styleTest.color = input;
  if (styleTest.color !== "") {
    if (number === 1) {
      tilesColor1 = input;
    } else if (number === 2) {
      tilesColor2 = input;
    } else if (number === 3) {
      tilesColor3 = input;
    }
  } else {
    console.error(
      "Color '" +
        input +
        "' is not a valid color. Using last successful color" +
        number +
        " value or default color" +
        number +
        " value."
    );
  }
  if (load) {
    tilesLoad();
  }
}

// Setter function for tile thickness value.
function tilesSetThickness(input, load) {
  // Checking thickness is in the appropriate range.
  let withinRange = true;
  let numThickness = Number(input);
  if (numThickness < 0 || numThickness > 100) {
    console.error(
      "Thickness '" +
        input +
        "' is out of the range 0-100. Using last successful thickness value or default thickness value."
    );
    withinRange = false;
  }
  if (withinRange) {
    tilesThickness = input;
  }
  if (load) {
    tilesLoad();
  }
}

// Setter function for tile size value.
function tilesSetSize(input, load) {
  // Checking thickness is in the appropriate range.
  let withinRange = true;
  let numSize = Number(input);
  if (numSize < 1 || numSize > 50) {
    console.error(
      "Size '" + input + "' is out of the range 1-50. Using last successful size value or default size value."
    );
    withinRange = false;
  }
  if (withinRange) {
    tilesSize = input;
  }
  if (load) {
    tilesLoad();
  }
}

// Handles background resize events.
function tilesOnResize() {
  let canvas = document.getElementById("truchet-tiles");
  let context = canvas.getContext("2d");
  let scaledWidth = Math.round(document.body.clientWidth * window.devicePixelRatio);
  let scaledHeight = Math.round(document.body.clientHeight * window.devicePixelRatio);
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
  for (let i = 0; i < numSquares; i++) {
    for (let j = 0; j < numSquares; j++) {
      context.drawImage(imgArray[imgGridArray[i][j]], i * tileDistance, j * tileDistance, tileDistance, tileDistance);
    }
  }
}

// Handles loading the canvas tiles background.
function tilesLoad() {
  let styleArray = tilesStyle.split("&");
  let imageLoadCounter = 0;
  imgArray = new Array();
  totalImages = 4 * styleArray.length;
  for (let i = 0; i < totalImages; i++) {
    imgArray[i] = new Image();
  }
  // onload callback for SVG images.
  let onLoadCallback = function () {
    imageLoadCounter++;
    if (imageLoadCounter < totalImages) {
      return;
    }
    allLoadedCallback();
  };
  // onerror callback for SVG images.
  let onErrorCallback = function (errorMessage) {
    console.error(errorMessage);
    imageLoadCounter++;
    if (imageLoadCounter < totalImages) {
      return;
    }
    allLoadedCallback();
  };
  // Once all tile images are loaded tiles are randomized and drawn.
  let allLoadedCallback = function () {
    let canvas = document.getElementById("truchet-tiles");
    let context = canvas.getContext("2d");
    screenHeight = window.screen.height * window.devicePixelRatio;
    screenWidth = window.screen.width * window.devicePixelRatio;
    screenMax = Math.max(screenHeight, screenWidth);
    numSquares = Number(tilesSize);
    let screenTileDistance = Math.ceil(screenMax / numSquares);
    let scaledHeight = Math.round(document.body.clientHeight * window.devicePixelRatio);
    let scaledWidth = Math.round(document.body.clientWidth * window.devicePixelRatio);
    let scaledMax = Math.max(scaledWidth, scaledHeight);
    let scaledTileDistance = Math.ceil(scaledMax / numSquares);
    tileDistance = Math.max(scaledTileDistance, screenTileDistance);
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    // Creating a new randomized grid array if the tile style of tile distance value has changed.
    let newStyle = liveTilesStyle === null || liveTilesStyle !== tilesStyle;
    let newDistance = liveTilesDistance === null || liveTilesDistance !== tileDistance;
    if (newStyle || newDistance) {
      imgGridArray = new Array(numSquares);
      for (let i = 0; i < numSquares; i++) {
        imgGridArray[i] = new Array(numSquares);
        for (let j = 0; j < numSquares; j++) {
          imgGridArray[i][j] = Math.floor(Math.random() * totalImages);
        }
      }
    }
    // Drawing tiles on the canvas.
    for (let i = 0; i < numSquares; i++) {
      for (let j = 0; j < numSquares; j++) {
        context.drawImage(imgArray[imgGridArray[i][j]], i * tileDistance, j * tileDistance, tileDistance, tileDistance);
      }
    }
    liveTilesStyle = tilesStyle;
    liveTilesDistance = tileDistance;
  };
  // Setting callback functions for the tile images.
  for (let i = 0; i < totalImages; i++) {
    imgArray[i].onload = onLoadCallback;
    imgArray[i].onerror = onErrorCallback;
  }
  // Applying settings to the SVGs.
  for (let i = 0; i < styleArray.length; i++) {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "1200");
    svgElement.setAttribute("height", "1200");
    svgElement.style.backgroundColor = tilesColor2;
    let svgHtmlElement = new DOMParser().parseFromString(svgArray[styleArray[i] - 1], "text/xml");
    svgElement.appendChild(svgHtmlElement.documentElement);
    // group = svgElement.getElementById("group") // Had to remove to work on iPad.
    let group = svgElement.children[0];
    let fillItems = group.getElementsByClassName("fillColor");
    for (let j = 0; j < fillItems.length; j++) {
      fillItems[j].setAttribute("style", fillItems[j].getAttribute("style") + "fill:" + tilesColor1);
    }
    let strokeItems = group.getElementsByClassName("strokeColor");
    for (let j = 0; j < strokeItems.length; j++) {
      strokeItems[j].setAttribute(
        "style",
        strokeItems[j].getAttribute("style") + "stroke:" + tilesColor3 + ";stroke-width:" + tilesThickness
      );
    }
    imgArray[0 + i * 4].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgElement.outerHTML);
    group.setAttribute("transform", "rotate(90,600,600)");
    imgArray[1 + i * 4].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgElement.outerHTML);
    group.setAttribute("transform", "rotate(180,600,600)");
    imgArray[2 + i * 4].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgElement.outerHTML);
    group.setAttribute("transform", "rotate(270,600,600)");
    imgArray[3 + i * 4].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgElement.outerHTML);
  }
}

// Handles rotating truchet tiles when they are moused over.
function tilesMouseMove(event) {
  let canvas = document.getElementById("truchet-tiles");
  let context = canvas.getContext("2d");
  let scrollbarAdjustment =
    (window.innerWidth * window.devicePixelRatio) / (document.body.clientWidth * window.devicePixelRatio);
  let firstX = event.clientX * window.devicePixelRatio * scrollbarAdjustment;
  let firstY = event.clientY * window.devicePixelRatio;
  let x = Math.floor(firstX / tileDistance);
  let y = Math.floor(firstY / tileDistance);
  if (x != curX || y != curY) {
    // This is for the styles that only have two unique rotations.
    if (tilesStyle === "1" || tilesStyle === "2") {
      if (imgGridArray[x][y] === 0) {
        imgGridArray[x][y] = 1;
      } else if (imgGridArray[x][y] === 1) {
        imgGridArray[x][y] = 2;
      } else if (imgGridArray[x][y] === 2) {
        imgGridArray[x][y] = 3;
      } else if (imgGridArray[x][y] === 3) {
        imgGridArray[x][y] = 0;
      }
    } else {
      let randomInt = Math.floor(Math.random() * totalImages);
      while (randomInt === imgGridArray[x][y]) {
        randomInt = Math.floor(Math.random() * totalImages);
      }
      imgGridArray[x][y] = randomInt;
    }
    context.clearRect(x * tileDistance, y * tileDistance, tileDistance, tileDistance);
    context.drawImage(imgArray[imgGridArray[x][y]], x * tileDistance, y * tileDistance, tileDistance, tileDistance);
    curX = x;
    curY = y;
  }
}
