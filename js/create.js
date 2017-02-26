'use strict';

WORLD.circleBody = function(x, y, r, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var circle = Matter.Bodies.circle(x, y, r, {
        isStatic: isStatic, color: color
    });
    Matter.World.add(WORLD.engine.world, [circle]);
};

WORLD.rectangleBody = function(x, y, width, height, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var rectangle = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: isStatic, color: color
    });
    Matter.World.add(WORLD.engine.world, [rectangle]);

    return rectangle.id;
};