'use strict';

var WORLD;
function initWorld() {

    function showSplash() {
        svg.append("text")
            .attr("class", "message")
            .attr("x", width/2)
            .attr("y", height/2)
            .style("opacity", 0)
            .text("world initialized");

        svg.selectAll("text.message")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .on("end", function() {
                svg.selectAll("text.message")
                    .transition()
                    .duration(1000)
                    .style("opacity", 0)
                    .on("end", function () {
                        svg.selectAll("text.message")
                            .remove();
                    })
            });
    }

    var width = window.innerWidth;
    var height = window.innerHeight;

    var svg = d3.select("#field")
        .attr("width", width)
        .attr("height", height);
    var gStatic = svg.append("g");
    var gDynamic = svg.append("g");

    var engine = Matter.Engine.create();

    Matter.Engine.run(engine);
    var d3Renderer = new MatterD3Renderer(engine, gStatic, gDynamic);
    Matter.Events.on(engine, "afterUpdate", function () {
        d3Renderer.renderD3();
    });

    WORLD = {
        engine: engine,
        gDynamic: gDynamic,
        svg: svg,
        width: width,
        height: height
    };

    showSplash();
}