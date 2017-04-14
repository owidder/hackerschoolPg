'use strict';

/* global WORLD */
/* global d3 */

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

