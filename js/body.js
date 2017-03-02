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

WORLD.Mover = function(body, duration, toX, toY, promise) {
    var that = this;

    that.toX = toX;
    that.toY = toY;
    that.body = body;
    that.promise = promise;
    that.duration = duration;

    that.move = function() {
        var currentX = that.body.position.x;
        var currentY = that.body.position.y;
        var diffX = that.toX - currentX;
        var diffY = that.toY - currentY;
        var directionX = Math.sign(diffX);
        var directionY = Math.sign(diffY);
        if(Math.abs(diffX) < 2 && Math.abs(diffY) < 2) {
            that.promise.resolve();
        }
        else {
            Matter.Body.setPosition(that.body, {x: currentX + directionX, y: currentY + directionY});
            setTimeout(that.move, that.duration);
        }
    };
};

WORLD.moveBody = function(bodyId, duration, toX, toY) {
    var finishedPromise = new SimplePromise();
    var body = Matter.Composite.get(WORLD.engine.world, bodyId, "body");
    var currentX = body.position.x;
    var currentY = body.position.y;
    var _toX = (toX == null ? currentX : toX);
    var _toY = (toY == null ? currentY : toY);

    (new WORLD.Mover(body, duration, _toX, _toY, finishedPromise)).move();
    return finishedPromise.promise;
};