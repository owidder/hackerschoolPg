'use strict';

function circle(x, y, r, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var circle = Matter.Bodies.circle(x, y, r, {
        isStatic: isStatic, className: "color-" + color
    });
    Matter.World.add(WORLD.engine.world, [circle]);
}

function rectangle(x, y, width, height, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var rectangle = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: isStatic, color: color
    });
    Matter.World.add(WORLD.engine.world, [rectangle]);

    return rectangle;
}