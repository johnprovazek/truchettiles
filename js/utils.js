import tinycolor from "./tinycolor.js";
import { TILES_COLOR_BLACK } from "./constants.js";

// Randomizes integer value between min and max inclusive of min and max.
export const getRand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Returns a palette of three randomly generated colors in hex format.
export const getRandHexColors = () => {
  const baseColor = `hsl(${getRand(0, 360)}, ${getRand(60, 100)}%, ${getRand(40, 60)}%)`;
  const harmonyChoices = ["analogous", "complement", "splitcomplement", "monochromatic", "triad"];
  const randomHarmony = harmonyChoices[getRand(0, harmonyChoices.length - 1)];
  let colors;
  switch (randomHarmony) {
    case "analogous":
      colors = tinycolor(baseColor).analogous(3, 5);
      break;
    case "complement":
      colors = [tinycolor(baseColor), tinycolor(baseColor).complement(), tinycolor(TILES_COLOR_BLACK)];
      break;
    case "splitcomplement":
      colors = tinycolor(baseColor).splitcomplement();
      break;
    case "monochromatic":
      colors = [tinycolor(baseColor), tinycolor(baseColor).lighten(15), tinycolor(baseColor).lighten(30)];
      break;
    case "triad":
      colors = tinycolor(baseColor).triad();
      break;
    default:
      colors = [tinycolor.random(), tinycolor.random(), tinycolor.random()];
  }
  return colors.map((t) => t.toHexString());
};

// Randomizes integer value between min and max inclusive of min and max, casted to a string value.
export const getRandToString = (min, max) => {
  return String(getRand(min, max));
};

// Takes a percentage as input and will return true that percentage of the time.
export const withChancePercentage = (percentage) => {
  const validatedPercentage = percentage <= 100 && percentage >= 0 ? percentage : 50;
  return getRand(1, 100) > 100 - validatedPercentage;
};
