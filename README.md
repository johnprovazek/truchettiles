# truchettiles

## Description

This project is an implementation of [truchet tiles](https://en.wikipedia.org/wiki/Truchet_tiles) using the `<canvas>` element. The purpose of this project is to create a template for interactive truchet tile backgrounds that could be used in web projects. You can access a demo at [johnprovazek.com/truchettiles](https://www.johnprovazek.com/truchettiles/). This project is almost complete, I'm just missing the SVG files. There is currently one tile working that can be seen in the demo.

Built using vanilla JavaScript utilizing the `<canvas>` element.

## Installation

To utilize truchet tiles in your own project start by placing a `<canvas>` element with the id "truchettiles" within the body of your html file. There are four attributes that need to be added to the `<canvas>` element to properly setup the truchet tiles.

- `data-style` is the style of tile you would like to use. This value needs to be in the range: 1-15.
- `data-color-1` is one color of the tile. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example. 
- `data-color-2` is one color of the tile. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example. 
- `data-size` is the size of the tiles. This needs to be in the range 1-100

Here's and example `<canvas>` element with the attributes filled out:
```
<canvas id="truchettiles" data-style="15" data-color-1="#000000" data-color-2="#FFFFFF" data-size="50"></canvas>
```
There is a [demo](https://www.johnprovazek.com/truchettiles/) you can use to test out different configurations. The demo has a button to copy the canvas configuration at the bottom.

Next you will need to include the file [truchettiles.js](./js/truchettiles.js).

Next you will need to include the file [truchettiles.css](./css/truchettiles.css). You may need to make some adjustments to get this to work with your project. This project is built assuming the body has a margin of 0 and the height and width are at 100vw and 100vh.

## Usage

Interact with the `<canvas>` with your mouse to change the orientation of the tiles.

## Bugs & Improvements

- Create the SVG tiles.
- Fix Mobile
