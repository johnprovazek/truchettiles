# truchettiles

## Description

This project is an implementation of [truchet tiles](https://en.wikipedia.org/wiki/Truchet_tiles) using the `<canvas>` element. The purpose of this project is to create a template for interactive truchet tile backgrounds that could be used in web projects. You can access a demo at [johnprovazek.com/truchettiles](https://www.johnprovazek.com/truchettiles/).

Built using vanilla JavaScript utilizing the `<canvas>` element.

## Installation

To utilize truchet tiles in your own project start by placing a `<canvas>` element with the id "truchettiles" within the body of your html file. There are six attributes that need to be added to the `<canvas>` element to properly setup the truchet tiles.

- `data-style` is the style of tile you would like to use. This value should be either in the range 1-15 or styles could be combined with the "&" as a delimiter.
- `data-color-1` is the main color of the tile. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example. 
- `data-color-2` is the background color of the tile. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example. 
- `data-color-2` is the color of the shape outline. This could be represented as "#FFFFFF", "red", or "rgb(100,200,100)" for example. 
- `data-outline-thickness` is the size of the outline thickness. This needs to be in the range 0-100. A "0" thickness would represent no outline.
- `data-size` is the size of the tiles. This needs to be in the range 1-100

Here's an example `<canvas>` element with the attributes filled out:
```
<canvas id="truchettiles" data-style="7" data-color-1="#C41E3A" data-color-2="#0C2340" data-color-3="#FEDB00" data-outline-thickness="50" data-size="12"></canvas>
```
You can use the [demo](https://www.johnprovazek.com/truchettiles/) to test out different configurations. In the demo there is a button that can be used to copy the configuration to your project.

You will need to include the files [truchettiles.js](./js/truchettiles.js) and [truchettiles.css](./css/truchettiles.css) in your project. You may need to make some adjustments to get this to work with your project. This project is built assuming the body has a margin of 0 and the height and width are at 100vw and 100vh.

## Usage

Interact with the `<canvas>` with your mouse to change the orientation of the tiles.

## Credits

The majority of the truchet tile designs I used were taken from this [website](http://arearugscarpet.blogspot.com/2014/04/the-curse-of-truchets-tiles.html).

## Bugs & Improvements

- Develop a function to randomize the attributes on the demo website so every page refresh generates a new design.
- Add "Control + Click" ability to deselect tile in a group.
- Add an info option that when hovered over gives the user instructions.
- Use a linter and a style guide. 