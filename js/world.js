'use strict';

/* global d3 */
/* global Math */
/* global SimplePromise */
/* global Matter */
/* global $ */

/**
 *
 * @param {string} svgId - id of the svg element used for the drawing (default: 'field')
 * @constructor
 */
var World = function(svgId) {
    var thisWorld = this;

    if(svgId == null) {
        svgId = "field";
    }

    var width = window.innerWidth;
    var height = window.innerHeight;

    var svg = d3.select("#" + svgId)
        .attr("width", width)
        .attr("height", height);
    var gNobodies = svg.append("g");
    var gStatic = svg.append("g");
    var gDynamic = svg.append("g");
    var gText = svg.append("g");

    var engine = Matter.Engine.create();

    Matter.Engine.run(engine);

    var d3Renderer = new MatterD3Renderer(engine, gStatic, gDynamic);
    Matter.Events.on(engine, "afterUpdate", function () {
        d3Renderer.renderD3();
    });

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
        addRemovePromise(circle);
        Matter.World.add(engine.world, [circle]);

        return circle;
    };

    /**
     * remove the body from the world
     * @param {Body} body - body to remove
     */
    this.removeBody = function(body) {
        Matter.World.remove(engine.world, body);
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
        if(isStatic == null) {
            isStatic = false;
        }
        if(color == null) {
            color = "black";
        }

        var rectangle = Matter.Bodies.rectangle(cx, cy, width, height, {
            isStatic: isStatic, color: color
        });
        addRemovePromise(rectangle);
        Matter.World.add(engine.world, [rectangle]);

        return rectangle;
    };

    /**
     * Rotate a body by an angle in degree (0 - 360)
     *
     * @param {Body} body - body to rotate
     * @param {number} angle - angle in degree (0 - 360)
     */
    this.rotateBodyByDegree = function (body, angle) {
        Matter.Body.rotate(body, angle / 180 * Math.PI);
    };
    
    /**
     * Rotate a body by an angle in radiant (0 - 2 * Math.PI)
     *
     * @param {Body} body - body to rotate
     * @param {number} angle - angle in radiant (0 - 2 * Math.PI)
     */
    this.rotateBodyByRadiant = function (body, angle) {
        Matter.Body.rotate(body, angle);
    };

    /**
     * scale the body
     *
     * @param {Body} body - body to scale
     * @param {number} scaleX - scale factor in x dimension
     * @param {number} scaleY - scale factor in y dimension
     */
    this.scaleBody = function(body, scaleX, scaleY) {
        Matter.Body.scale(body, scaleX, scaleY);
    };

    this.getCurrentCenterOfBody = function(body) {
        var cx = (body.bounds.min.x + body.bounds.max.x) / 2;
        var cy = (body.bounds.min.y + body.bounds.max.y) / 2;

        return [cx, cy];
    };

    this.setInertiaForBody = function(body, inertia) {
        Matter.Body.setInertia(body, inertia);
    };

    /**
     * apply a force to a body in x direction
     * @param {Body} body - body to apply force on
     * @param {number} force - force to apply (force < 0 -> to the left, forcce > 0 -> to the right)
     */
    this.applyXForceToBody = function(body, force) {
        body.force.x += force;
    };

    this.applyYForceToBody = function(body, force) {
        body.force.y += force;
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
        var finishedPromise = new SimplePromise();
        var currentX = body.position.x;
        var currentY = body.position.y;
        var _toX = (toX == null ? currentX : toX);
        var _toY = (toY == null ? currentY : toY);

        moveRecursive(body, duration, _toX, _toY, finishedPromise);
        return finishedPromise.promise;
    };

    function addRemovePromise(body) {
        body.removePromise = new SimplePromise();
    }

    this.onBodyRemoved = function (body, func) {
        body.removePromise.promise.then(func);
    };

    this.removeBodyWithId = function(bodyId) {
        var body = Matter.Composite.get(engine.world, bodyId, "body");
        this.removeBody(body);
    };

    this.makeBodyDynamic = function(bodyId) {
        var body = this.getBodyFromId(bodyId);
        Matter.Body.setStatic(body, false);
    };

    this.makeBodyStatic = function(bodyId) {
        var body = this.getBodyFromId(bodyId);
        Matter.Body.setStatic(body, true);
    };

    this.getBodyFromId = function(bodyId) {
        var body = Matter.Composite.get(engine.world, bodyId, "body");
        return body;
    };

    function moveRecursive(body, duration, toX, toY, promise) {
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
                moveRecursive(body, duration, toX, toY, promise);
            }, duration);
        }
    }

    function startGc() {
        function gc() {
            function isDynamic(body) {
                return !body.isStatic;
            }
            var dynamicBodies = Matter.Composite.allBodies(engine.world).filter(isDynamic);
            dynamicBodies.forEach(function(body) {
                if(body.position.y > height) {
                    body.removePromise.resolve();
                    thisWorld.removeBody(body);
                }
            })
        }

        setInterval(gc, 1000);
    }

    /**
     * let the background flash
     * @param {string} color - color of the flash
     */
    this.backgroundColorFlash = function(color) {
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
     * @param {string} fontSize - size of the text (default: '5em')
     * @param {number} x - x coordinate of the text (default: width/2)
     * @param {number} y - y coordinate of the text (default: height/2)
     * @param {string} className - CSS class (default: '')
     */
    this.showSplash = function(message, fontSize, x, y, className) {
        if(className == null) {
            className = "";
        }
        if(x == null) {
            x = width/2;
        }
        if(y == null) {
            y = height/2;
        }
        if(fontSize == null) {
            fontSize = "5em";
        }
        if(!isNaN(fontSize)) {
            fontSize += "em";
        }

        var id = uid();

        this.showText(id, message, x, y, fontSize, className);
        this.removeText(id);
    };

    this.showText = function(id, text, x, y, fontSize, className) {
        gText.selectAll("text._" + id)
            .data([id])
            .enter()
            .append("text")
            .attr("class", "message _" + id + " " + className);

        gText.selectAll("text._" + id)
            .attr("x", x)
            .attr("y", y)
            .style("font-size", fontSize + "em")
            .text(text);
    };

    this.removeText = function(id) {
        gText.selectAll("text._" + id)
            .data([])
            .exit()
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove();
    };

    function uid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }

    /**
     * Display class
     *
     * @constructor
     */
    var Display = function(text, x, y, fontSize, className) {
        var thisDisplay = this;

        function show() {
            thisWorld.showText(thisDisplay.id, thisDisplay.text, thisDisplay.x, thisDisplay.y, thisDisplay.fontSize, thisDisplay.className);
        }

        /**
         * change the shown text
         * @param {string} text - new text to show
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
            thisWorld.removeText(this.id);
        };

        this.id = uid();
        this.text = text;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize || 1;
        this.className = className != null ? className : "";

        show();
    };

    /**
     * create a new Display
     *
     * @param {string} text - initial text to show
     * @param {number} x - x coord
     * @param {number} y - y coord
     * @param {number} fontSize - size of the text (in 'em')
     * @param {string} className - CSS class (default: '')
     */
    this.createDisplay = function(text, x, y, fontSize, className) {
        return new Display(text, x, y, fontSize, className);
    };

    /**
     * speak something with one of the browser voices
     * @param {string} text - text to speak
     * @param {number} voiceNum - number of the voice to use
     * {@link https://cdn.rawgit.com/iterawidder/hackerschoolPg/v3/voices.html}
     */
    this.speek = function (text, voiceNum) {
        var msg = this.currentMessage;
        if(msg == null) {
            msg = new SpeechSynthesisUtterance(text);
            this.currentMessage = msg;
        }

        if(voiceNum != this.currentVoiceNum) {
            var voices = window.speechSynthesis.getVoices();
            msg.voice = voices[voiceNum];
            this.currentVoiceNum = voiceNum;
        }

        msg.text = text;

        window.speechSynthesis.speak(msg);
    };

    /**
     * call the given function, when a touch&move (drag) happened
     * @param {Function} func - called with current x and y coordinates
     */
    this.onTouchMove = function(func) {
        svg.call(
            d3.drag()
                .on('drag', function () {
                    func(d3.event.x, d3.event.y);
                })
        );
    };

    /**
     * call a function when the given body collides with anything
     * @param {Body} body - body to watch for collision
     * @param {Function} func - function to call with parameter 'pair' which has both colliding bodies:  'pair.bodyA' and 'pair.bodyB'
     */
    this.onCollisionStart = function(body, func) {
        Matter.Events.on(engine, 'collisionStart', function(event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if(pair.bodyA.id == body.id || pair.bodyB.id == body.id) {
                    func(pair);
                }
            }
        });
    };

    /**
     * call a function when 2 dedicated bodies collide
     * @param {Body} body1 - first body
     * @param {Body} body2 - second body
     * @param {Function} func - function to call with parameter 'pair' which has both colliding bodies:  'pair.bodyA' and 'pair.bodyB'
     */
    this.on2BodiesCollisionStart = function(body1, body2, func) {
        Matter.Events.on(engine, 'collisionStart', function(event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if((pair.bodyA.id == body1.id && pair.bodyB.id == body2.id) || (pair.bodyA.id == body2.id && pair.bodyB.id == body1.id)) {
                    func(pair);
                }
            }
        });
    };

    /**
     * call the function when the mouse is clicked
     *
     * @param {Function} func - function to call (gets x and y as number parameter)
     */
    this.onClick = function(func) {
        $(document).click(function (event) {
            func(event.clientX, event.clientY, event);
        });
    };

    this.initTouch = function() {
        if(!this.touchInitialized) {
            TouchEmulator();
            this.touchInitialized == true;
        }
    };

    this.onTouchStart = function(func) {
        this.initTouch();
        document.body.addEventListener('touchstart', function(event) {
            func(event.touches[0].clientX, event.touches[0].clientY, event);
        });
    };

    this.onTouchEnd = function(func) {
        this.initTouch();
        document.body.addEventListener('touchend', function (event) {
            func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
        })
    };

    /**
     * call a function when the screen is touched anywhere
     * @param {Function} func - function to call (gets the x/y coordinates of the touch as parameters 'x' and 'y')
     */
    this.onTouch = function(func) {
        this.initTouch();
        document.body.addEventListener('touchend', function (event) {
            if(this.touchMove) {
                this.touchMove = false;
            }
            else {
                func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
            }
        })
    };

    this.circle = function(cx, cy, r, color, className) {
        if(className == null) {
            className = "";
        }
        gNobodies.append("circle")
            .attr("class", className)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r)
            .attr("style", "fill: " + color);
    };

    this.rectangle = function(x, y, width, height, color, className) {
        if(className == null) {
            className = "";
        }
        gNobodies.append("rect")
            .attr("class", className)
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("style", "fill: " + color);
    };

    this.getWidth = function () {
        return width;
    };

    this.getHeight = function () {
        return height;
    };

    startGc();
};
