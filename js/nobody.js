'use strict';

WORLD.circle = function(cx, cy, r, color, className) {
    if(className == null) {
        className = "";
    }
    WORLD.gNobodies.append("circle")
        .attr("class", className)
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
        .attr("style", "fill: " + color);
};

WORLD.rectangle = function(x, y, width, height, color, className) {
    if(className == null) {
        className = "";
    }
    WORLD.gNobodies.append("rect")
        .attr("class", className)
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("style", "fill: " + color);
};