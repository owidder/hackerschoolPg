'use strict';

/* global WORLD */

/**
 * @constructor
 */
var World = function() {

    /**
     * Create a circle shaped body
     * @param {number} cx - x coordinate of the center
     * @param {number} cy - y coordinate of the center
     * @param {number} r - radius
     * @param {boolean} isStatic - true = static (default: false)
     * @param {string} color - fill color (default: 'black')
     * @returns the created body
     */
    this.circleBody = function(cx, cy, r, isStatic, color) {
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
     * remove the body from the world
     * @param {Body} body - body to remove
     */
    this.removeBody = function(body) {
        WORLD.removeBody(body);
    };

    /**
     * Create a rectangle shaped body
     *
     * @param {number} cx - x coord of the center of the rectangle
     * @param {number} cy - y coord of the center of the rectangle
     * @param {number} width - width of the rectangle
     * @param {number} height - height of the rectangle
     * @param {boolean} isStatic - true = static (default: false)
     * @param {string} color - fill color (default: 'black')
     * @returns the created body
     */
    this.rectangleBody = function(cx, cy, width, height, isStatic, color) {
        WORLD.rectangleBody(cx, cy, width, height, isStatic, color);
    };

    /**
     * move a body (stepwise) to a x/y-coordinate
     *
     * @param {Body} body - body to move
     * @param {number} duration - duration (in milliseconds) for each step
     * @param {number} toX - x coordinate to move to
     * @param {number} toY - y coordinate to move to
     * @returns Promise that resolves, when the body has arrived
     */
    this.moveBody = function(body, duration, toX, toY) {
        WORLD.moveBody(body, duration, toX, toY);
    };

    this.addRemovePromise = function(body) {
        body.removePromise = new SimplePromise();
    };

    this.removeBodyWithId = function(bodyId) {
        var body = Matter.Composite.get(this.engine.world, bodyId, "body");
        this.removeBody(body);
    };

    this.makeBodyDynamic = function(bodyId) {
        var body = this.getBodyFromId(bodyId);
        Matter.Body.setStatic(body, false);
    };

    this.makeBodyStatic = function(bodyId) {
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
    };    /**
     * let the background flash
     * @param {string} color - color of the flash
     */
    this.backgroundColorFlash = function(color) {
        WORLD.backgroundColorFlash(color);
    };

    /**
     * show a splash message
     *
     * @param {string} message - text of the message
     * @param {string} fontSize - size of the text in 'em'
     * @param {number} x - x coordinate of the text (default: WORLD.width/2)
     * @param {number} y - y coordinate of the text (default: WORLD.height/2)
     * @param {string} className - CSS class (default: '')
     */
    this.showSplash = function(message, fontSize, x, y, className) {
        WORLD.showSplash(message, fontSize, x, y, className);
    };

    /**
     * create a display
     *
     * @param {string} text - initial text to show
     * @param {number} x - x coord
     * @param {number} y - y coord
     * @param {number} fontSize - size of the text (in 'em')
     * @param {string} className - CSS class (default: '')
     * @constructor
     */
    this.Display = function(text, x, y, fontSize, className) {
        var that = this;
        function show() {
            WORLD.showText(that.id, that.text, that.x, that.y, that.fontSize, that.className);
        }

        /**
         * change the shown text
         * @param text - new text to show
         */
        this.changeText = function (text) {
            this.text = text;
            show();
        };

        /**
         * move the text to a new position
         *
         * @param {number} x - new x coordinate
         * @param {number} y - new y coordinate
         */
        this.move = function (x, y) {
            this.x = x;
            this.y = y;
            show();
        };

        /**
         * set a new size of the text
         * @param {number} fontSize - new size (in 'em')
         */
        this.setFontSize = function (fontSize) {
            this.fontSize = fontSize;
            show()
        };

        /**
         * if the text is a number (e.g. "10"), add a value to it
         * e.g.: "10" + 5 = "15"
         * @param {number} a - number to add
         */
        this.add = function (a) {
            this.text = String(parseInt(this.text) + a);
            show();
        };

        /**
         * if the text is a number (e.g. "10"), subtract a value from it
         * e.g.: "10" - 5 = "5"
         * @param {number} a - number to subtract
         */
        this.sub = function (s) {
            this.text = String(parseInt(this.text) - s);
            show();
        };

        /**
         * remove the currently shown text
         */
        this.remove = function () {
            WORLD.removeText(this.id);
        };

        this.id = WORLD.uid();
        this.text = text;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize || 1;
        this.className = className != null ? className : "";

        show();
    };

    /**
     * speak something with one of the browser voices
     * @param {string} text - text to speak
     * @param {number} voiceNum - number of the voice to use
     * {@link https://cdn.rawgit.com/iterawidder/hackerschoolPg/v3/voices.html}
     */
    this.speek = function (text, voiceNum) {
        WORLD.speek(text, voiceNum);
    };

    /**
     * call the given function, when a touch&move (drag) happened
     * @param {Function} func - called with current x and y coordinates
     */
    this.onTouchMove = function(func) {
        WORLD.onTouchMove(func);
    };

    /**
     * call the given function when the given body collides with anything
     * @param {Body} body - body to watch for collision
     * @param {Function} func - function to call with parameter 'pair' which has both colliding bodies:  'pair.bodyA' and 'pair.bodyB'
     */
    this.onCollisionStart = function(body, func) {
        WORLD.onCollisionStart(body, func);
    };

    WORLD.init();
};

