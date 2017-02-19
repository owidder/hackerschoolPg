'use strict';

var WORLD;
function initWorld() {

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
}