'use strict';

/* global WORLD */
/* global d3 */

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

WORLD.showText = function(id, text, x, y, fontSize, className) {
    WORLD.gText.selectAll("text._" + id)
        .data([id])
        .enter()
        .append("text")
        .attr("class", "message _" + id + " " + className);

    WORLD.gText.selectAll("text._" + id)
        .attr("x", x)
        .attr("y", y)
        .style("font-size", fontSize + "em")
        .text(text);
};

WORLD.removeText = function(id) {
    WORLD.gText.selectAll("text._" + id)
        .data([])
        .exit()
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
};

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

WORLD.Display = function(text, x, y, fontSize, className) {
    var that = this;
    function show() {
        WORLD.showText(that.id, that.text, that.x, that.y, that.fontSize, that.className);
    }

    this.changeText = function (text) {
        this.text = text;
        show();
    };

    this.move = function (x, y) {
        this.x = x;
        this.y = y;
        show();
    };

    this.setFontSize = function (fontSize) {
        this.fontSize = fontSize;
        show()
    };

    this.add = function (a) {
        this.text = String(parseInt(this.text) + a);
        show();
    };

    this.sub = function (s) {
        this.text = String(parseInt(this.text) - s);
        show();
    };

    this.remove = function () {
        WORLD.removeText(this.id);
    };

    this.id = WORLD.uid();
    this.text = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.className = className != null ? className : "";

    show();
};

