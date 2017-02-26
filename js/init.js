'use strict';

WORLD.init = function() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    var svg = d3.select("#field")
        .attr("width", width)
        .attr("height", height);
    var gNobodies = svg.append("g");
    var gStatic = svg.append("g");
    var gDynamic = svg.append("g");

    var engine = Matter.Engine.create();

    Matter.Engine.run(engine);
    var d3Renderer = new MatterD3Renderer(engine, gStatic, gDynamic);
    Matter.Events.on(engine, "afterUpdate", function () {
        d3Renderer.renderD3();
    });

    WORLD.engine = engine;
    WORLD.gDynamic = gDynamic;
    WORLD.gStatic = gStatic;
    WORLD.gNobodies = gNobodies;
    WORLD.svg = svg;
    WORLD.width = width;
    WORLD.height = height;

    WORLD.showSplash("world initialized");
};