'use strict';

/* global WORLD */
/* global SimplePromise */
/* global Matter */

WORLD.circleBody = function(cx, cy, r, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    if(color == null) {
        color = "black";
    }
    var circle = Matter.Bodies.circle(cx, cy, r, {
        isStatic: isStatic, color: color
    });
    WORLD.addRemovePromise(circle);
    Matter.World.add(WORLD.engine.world, [circle]);

    return circle;
};

/**
 * Create a rectangle shaped body
 *
 * @param cx - x coord of the center of the rectangle
 * @param cy - y coord of the center of the rectangle
 * @param width - width of the rectangle
 * @param height - height of the rectangle
 * @param isStatic - true = static (default: false)
 * @param color - fill color (default: 'black')
 * @returns the created body
 */
WORLD.rectangleBody = function(cx, cy, width, height, isStatic, color) {
    if(isStatic == null) {
        isStatic = false;
    }
    if(color == null) {
        color = "black";
    }

    var rectangle = Matter.Bodies.rectangle(cx, cy, width, height, {
        isStatic: isStatic, color: color
    });
    WORLD.addRemovePromise(rectangle);
    Matter.World.add(WORLD.engine.world, [rectangle]);

    return rectangle;
};

WORLD.removeBody = function(body) {
    Matter.World.remove(WORLD.engine.world, body);
};

WORLD.moveBody = function(body, duration, toX, toY) {
    var finishedPromise = new SimplePromise();
    var currentX = body.position.x;
    var currentY = body.position.y;
    var _toX = (toX == null ? currentX : toX);
    var _toY = (toY == null ? currentY : toY);

    WORLD.moveRecursive(body, duration, _toX, _toY, finishedPromise);
    return finishedPromise.promise;
};

WORLD.addRemovePromise = function(body) {
    body.removePromise = new SimplePromise();
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

WORLD.gc = function() {
    function isDynamic(body) {
        return !body.isStatic;
    }
    var dynamicBodies = Matter.Composite.allBodies(WORLD.engine.world).filter(isDynamic);
    dynamicBodies.forEach(function(body) {
        if(body.position.y > WORLD.height) {
            body.removePromise.resolve();
            WORLD.removeBody(body);
        }
    })
};

WORLD.startGc = function () {
    setInterval(WORLD.gc, 1000);
};