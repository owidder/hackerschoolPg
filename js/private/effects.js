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

    var id = WORLD.uid();

    WORLD.showText(id, message, x, y, fontSize, className);
    WORLD.removeText(id);
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

