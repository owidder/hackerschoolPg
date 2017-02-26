'use strict';

WORLD.circleBody = function(cx, cy, r, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var circle = Matter.Bodies.circle(cx, cy, r, {
        isStatic: isStatic, color: color
    });
    Matter.World.add(WORLD.engine.world, [circle]);
};

WORLD.rectangleBody = function(cx, cy, width, height, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var rectangle = Matter.Bodies.rectangle(cx, cy, width, height, {
        isStatic: isStatic, color: color
    });
    Matter.World.add(WORLD.engine.world, [rectangle]);

    return rectangle.id;
};