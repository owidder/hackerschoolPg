'use strict';

/* global WORLD */
/* global SimplePromise */
/* global Matter */
/* global MatterD3Renderer */
/* global d3 */

/**
 * Create a circle shaped body
 * @param {number} cx - x coordinate of the center
 * @param {number} cy - y coordinate of the center
 * @param {number} r - radius
 * @param {boolean} isStatic - true = static (default: false)
 * @param {string} color - fill color (default: 'black')
 * @returns the created body
 */
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

/**
 * remove the body from the world
 * @param body - body to remove
 */
WORLD.removeBody = function(body) {
    Matter.World.remove(WORLD.engine.world, body);
};

/**
 * move a body (stepwise) to a x/y-coordinate
 *
 * @param body - body to move
 * @param duration - duration (in milliseconds) for each step
 * @param toX - x coordinate to move to
 * @param toY - y coordinate to move to
 * @returns Promise that resolves, when the body has arrived
 */
WORLD.moveBody = function(body, duration, toX, toY) {
    var finishedPromise = new SimplePromise();
    var currentX = body.position.x;
    var currentY = body.position.y;
    var _toX = (toX == null ? currentX : toX);
    var _toY = (toY == null ? currentY : toY);

    WORLD.moveRecursive(body, duration, _toX, _toY, finishedPromise);
    return finishedPromise.promise;
};

/**
 * let the background flash
 * @param color - color of the flash
 */
WORLD.backgroundColorFlash = function(color) {
    d3.selectAll("svg")
        .transition()
        .duration(300)
        .style("background-color", color)
        .on("end", function () {
            d3.selectAll("svg")
                .transition()
                .duration(1000)
                .style("background-color", "white");
        });
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
WORLD.showSplash = function(message, fontSize, x, y, className) {
    if(className == null) {
        className = "";
    }
    if(x == null) {
        x = WORLD.width/2;
    }
    if(y == null) {
        y = WORLD.height/2;
    }
    if(fontSize == null) {
        fontSize = "5em";
    }
    if(!isNaN(fontSize)) {
        fontSize += "em";
    }

    var id = WORLD.uid();

    WORLD.showText(id, message, x, y, fontSize, className);
    WORLD.removeText(id);
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
WORLD.Display = function(text, x, y, fontSize, className) {
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
 * https://cdn.rawgit.com/iterawidder/hackerschoolPg/v3/voices.html
 */
WORLD.speek = function (text, voiceNum) {

    var msg = WORLD.currentMessage;
    if(msg == null) {
        msg = new SpeechSynthesisUtterance(text);
        WORLD.currentMessage = msg;
    }

    if(voiceNum != WORLD.currentVoiceNum) {
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[voiceNum];
        WORLD.currentVoiceNum = voiceNum;
    }

    msg.text = text;

    window.speechSynthesis.speak(msg);
};

/**
 * call the given function, when a touch&move (drag) happened
 * @param {function} func - called with current x and y coordinates
 */
WORLD.onTouchMove = function(func) {
    WORLD.svg.call(
        d3.drag()
            .on('drag', dragged )
    );

    function dragged() {
        func(d3.event.x, d3.event.y);
    }
};

/**
 * call the given function when the given body collides with anything
 * @param body - body to watch for collision
 * @param func - function to call with parameter 'pair' which has both colliding bodies:  'pair.bodyA' and 'pair.bodyB'
 */
WORLD.onCollisionStart = function(body, func) {
    Matter.Events.on(WORLD.engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if(pair.bodyA.id == body.id || pair.bodyB.id == body.id) {
                func(pair);
            }
        }
    });
};
