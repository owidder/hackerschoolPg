'use strict';

function circle(x, y, r, isStatic) {
    if(isStatic == null) {
        isStatic = false;
    }
    var circle = Matter.Bodies.circle(x, y, r, {
        isStatic: isStatic
    });
    Matter.World.add(WORLD.engine.world, [circle]);
}

function rectangle(x, y, width, height, isStatic) {
    if(isStatic == null) {
        isStatic = false;
    }
    var rectangle = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: isStatic
    });
    Matter.World.add(WORLD.engine.world, [rectangle]);
}