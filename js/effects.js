'use strict';

function backgroundColorFlash(color) {
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
}

function showSplash(message, className) {
    if(className == null) {
        className = "";
    }
    WORLD.svg.append("text")
        .attr("class", "message " + className)
        .attr("x", WORLD.width/4)
        .attr("y", WORLD.height/2)
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

