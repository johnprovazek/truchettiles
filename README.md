# truchettiles

## Description

This project implements an interactive [truchet tiles](https://en.wikipedia.org/wiki/Truchet_tiles) website background.
You can access a demo at [johnprovazek.com/truchettiles](https://www.johnprovazek.com/truchettiles/).

Built with native JavaScript utilizing the canvas element.

<div align="center">
  <picture>
    <img src="https://repository-images.githubusercontent.com/472082067/86824ad6-5254-434d-acaa-b5d142a64aa8" width="830px" alt="Project Thumbnail Image">
  </picture>
</div>

## Installation

To utilize this truchet tiles background in your own project start by placing a canvas element with the id "truchet-tiles" within the body of your HTML file.
There are six attributes that can be configured in the canvas element to setup the truchet tiles background.

- `data-pattern` is the pattern of tile you would like to use. This value needs to be in the range 1-15. Styles can be combined using "&" as a delimiter.
- `data-primary-color` is the primary color of the tile. This could be represented as any valid CSS color.
- `data-secondary-color` is the secondary color of the tile. This could be represented as any valid CSS color.
- `data-stroke-color` is the color of the stroke outline. This could be represented as any valid CSS color.
- `data-stroke-size` is the size of the stroke outline. This needs to be in the range 0-100.
- `data-tile-size` is the size of the tiles. This needs to be in the range 0-100.

Here's an example `<canvas>` element with the attributes filled out:

```html
<canvas
  id="truchet-tiles"
  data-pattern="9"
  data-primary-color="#1ce376"
  data-secondary-color="#60eb9f"
  data-stroke-color="#a4f4c8"
  data-stroke-size="20"
  data-tile-size="16"
></canvas>
```

You can use the [demo page](https://www.johnprovazek.com/truchettiles/) to test out different truchet tile background configurations.
At the bottom of the [demo page](https://www.johnprovazek.com/truchettiles/) there is a button that can be used to copy the configuration to your own project.

You will also need to include the file [truchet-tiles.js](./js/truchet-tiles.js) in your project to get this to work.

## Usage

Interact with the truchet tiles background with your mouse to change the orientation of the tiles.

## Credits

- The majority of the truchet tile designs were adapted from the designs found on this [blog post](http://arearugscarpet.blogspot.com/2014/04/the-curse-of-truchets-tiles.html).
- [TinyColor](https://github.com/bgrins/TinyColor) was used to generate random but harmonious color palettes.

## Bugs & Improvements

- Reconfigure this project as a custom HTML element.
