'use strict';

WORLD.circleBody = function(cx, cy, r, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var circle = Matter.Bodies.circle(cx, cy, r, {
        isStatic: isStatic, color: color
    });
    Matter.World.add(WORLD.engine.world, [circle]);

    return circle.id;
};

WORLD.removeBody = function(body) {
    Matter.World.remove(WORLD.engine.world, body);
};

WORLD.removeBodyIfOutOfScreen = function(bodyId) {
    var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
    if((body.position.x < 0 || body.position.x > WORLD.width) && (body.position.y < 0 || body.position.x > WORLD.height)) {
        WORLD.removeBody(body);
        return true;
    }

    return false;
};

WORLD.removeBodyWithId = function(bodyId) {
    var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
    WORLD.removeBody(body);
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

WORLD.moveRecursive = function (body, duration, toX, toY, promise) {
    var currentX = body.position.x;
    var currentY = body.position.y;
    var diffX = toX - currentX;
    var diffY = toY - currentY;
    var directionX = Math.sign(diffX);
    var directionY = Math.sign(diffY);
    if(Math.abs(diffX) < 2 && Math.abs(diffY) < 2) {
        promise.resolve();
    }
    else {
        Matter.Body.setPosition(body, {x: currentX + directionX, y: currentY + directionY});
        setTimeout(function () {
            WORLD.moveRecursive(body, duration, toX, toY, promise);
        }, duration);
    }
};

WORLD.moveBody = function(bodyId, duration, toX, toY) {
    var finishedPromise = new SimplePromise();
    var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
    var currentX = body.position.x;
    var currentY = body.position.y;
    var _toX = (toX == null ? currentX : toX);
    var _toY = (toY == null ? currentY : toY);

    WORLD.moveRecursive(body, duration, _toX, _toY, finishedPromise)
    return finishedPromise.promise;
};