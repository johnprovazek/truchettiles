# truchettiles

## Description

This project implements an interactive [truchet tile](https://en.wikipedia.org/wiki/Truchet_tiles) background that is designed to be used in web projects. You can access a demo at [johnprovazek.com/truchettiles](https://www.johnprovazek.com/truchettiles/).

Built using vanilla JavaScript.

<div align="center">
  <picture>
    <img src="https://github.com/user-attachments/assets/2ce85a89-beea-4778-ae01-4252f9d35a32" width="830px">
  </picture>
</div>

## Installation

To utilize truchet tiles in your own project start by placing a `<canvas>` element with the id "truchet-tiles" within the body of your html file. There are six attributes that need to be added to the `<canvas>` element to properly setup the truchet tiles.

- `data-style` is the style of tile you would like to use. This value should be either in the range 1-15 or styles could be combined with "&" as a delimiter.
- `data-color-1` is the main color of the tile. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example.
- `data-color-2` is the background color of the tile. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example.
- `data-color-3` is the color of the shape outline. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example.
- `data-outline-thickness` is the size of the outline thickness. This needs to be in the range 0-100. A "0" thickness would represent no outline.
- `data-size` is the size of the tiles. This needs to be in the range 1-50.

Here's an example `<canvas>` element with the attributes filled out:

```html
<canvas
  id="truchet-tiles"
  data-style="7"
  data-color-1="#C41E3A"
  data-color-2="#0C2340"
  data-color-3="#FEDB00"
  data-outline-thickness="50"
  data-size="12"
></canvas>
```

You can use the [demo page](https://www.johnprovazek.com/truchettiles/) to test out different configurations. In the [demo page](https://www.johnprovazek.com/truchettiles/) there is a button that can be used to copy the demo configuration to your project.

You will need to include the files [truchettiles.js](./js/truchettiles.js) and [truchettiles.css](./css/truchettiles.css) in your project.

You may need to make some adjustments to get this to work with your project. This project is built assuming the body has a margin of 0, min-height of 100lvh, and min-width of 100lvw

## Usage

Interact with the `<canvas>` with your mouse to change the orientation of the tiles.

## Credits

The majority of the truchet tile designs were taken from this [website](http://arearugscarpet.blogspot.com/2014/04/the-curse-of-truchets-tiles.html).

## Bugs & Improvements

- Add a color picker.
- Fix demo issues when zooming in on browsers.
- Restructure the demo grid and fix overflow issue.
- Add an info option to the demo page to give user instructions.
- Consider adding value of the slider in the slider thumb.
- Investigate and fix bug where occasionally tiles will be drawn on canvas with small noticeable gaps on the tiles edge.
