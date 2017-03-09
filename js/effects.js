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
    WORLD.svg.append("text")
        .attr("class", "message " + className)
        .attr("x", x)
        .attr("y", y)
        .style("opacity", 0)
        .style("font-size", fontSize)
        .text(message);

    WORLD.svg.selectAll("text.message")
        .transition()
        .duration(1000)
        .style("opacity", 0.7)
        .on("end", function() {
            WORLD.svg.selectAll("text.message")
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .on("end", function () {
                    WORLD.svg.selectAll("text.message")
                        .remove();
                });
        });
};

WORLD.uuid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

WORLD.displayMap = {};

WORLD.createDisplay = function(x, y) {
    var id = WORLD.uuid();
};