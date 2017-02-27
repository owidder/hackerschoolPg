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

WORLD.moveBody = function(bodyId, toX, toY, duration) {
    var finishedPromise = new SimplePromise();

    function oneStep() {
        var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
        var currentX = body.position.x;
        var currentY = body.position.y;
        var directionX = Math.sign(toX - currentX);
        var directionY = Math.sign(toY - currentY);
        if(directionX == 0 && directionY == 0) {
            finishedPromise.resolve();
        }
        else {
            Matter.Body.setPosition(body, {x: currentX + directionX, y: currentY + directionY});
        }
        setTimeout(oneStep, duration);
    }

    oneStep();
    return finishedPromise.promise;
};