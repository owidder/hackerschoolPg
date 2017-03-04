'use strict';

/* global WORLD */
/* global SimplePromise */
/* global Matter */

WORLD.addRemovePromise = function(body) {
    body.removePromise = new SimplePromise();
};

WORLD.circleBody = function(cx, cy, r, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var circle = Matter.Bodies.circle(cx, cy, r, {
        isStatic: isStatic, color: color
    });
    WORLD.addRemovePromise(circle);
    Matter.World.add(WORLD.engine.world, [circle]);

    return circle.id;
};

WORLD.removeBody = function(body) {
    Matter.World.remove(WORLD.engine.world, body);
};

WORLD.removeBodyWithId = function(bodyId) {
    var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
    WORLD.removeBody(body);
};

WORLD.makeBodyDynamic = function(bodyId) {
    var body = WORLD.getBodyFromId(bodyId);
    Matter.Body.setStatic(body, false);
};

WORLD.makeBodyStatic = function(bodyId) {
    var body = WORLD.getBodyFromId(bodyId);
    Matter.Body.setStatic(body, true);
};

WORLD.getBodyFromId = function(bodyId) {
    var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
    return body;
};

WORLD.rectangleBody = function(cx, cy, width, height, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    var rectangle = Matter.Bodies.rectangle(cx, cy, width, height, {
        isStatic: isStatic, color: color
    });
    WORLD.addRemovePromise(rectangle);
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

WORLD.gc = function() {
    function isDynamic(body) {
        return !body.isStatic;
    }
    var dynamicBodies = Matter.Composite.allBodies(WORLD.engine.world).filter(isDynamic);
    dynamicBodies.forEach(function(body) {
        if(body.position.x > WORLD.width) {
            body.removePromise.resolve();
            WORLD.removeBody(body);
        }
    })
};

WORLD.startGc = function () {
    setInterval(WORLD.gc, 1000);
};