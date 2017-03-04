'use strict';

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
    else if(!isNaN(fontSize)) {
        fontSize += "em";
    }
    WORLD.svg.append("text")
        .attr("class", "message " + className)
        .attr("x", x)
        .attr("y", y)
        .style("opacity", 0)
        .text(message);

    WORLD.svg.selectAll("text.message")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function() {
            WORLD.svg.selectAll("text.message")
                .transition()
                .duration(1000)
                .style("opacity", 0)
                .on("end", function () {
                    WORLD.svg.selectAll("text.message")
                        .remove();
                })
        });
}

WORLD.createDisplay = function(x, y) {
    
};