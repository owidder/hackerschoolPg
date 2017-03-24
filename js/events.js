'use strict';

/* global WORLD */
/* global $ */
/* global TouchEmulator */
/* global Matter */
/* global d3 */

WORLD.onClick = function(func) {
    $(document).click(function (event) {
        func(event.clientX, event.clientY, event);
    });
};

WORLD.initTouch = function() {
    if(!WORLD.touchInitialized) {
        TouchEmulator();
        WORLD.touchInitialized == true;
    }
};

WORLD.onTouchStart = function(func) {
    
    
    WORLD.initTouch();
    document.body.addEventListener('touchstart', function(event) {
        func(event.touches[0].clientX, event.touches[0].clientY, event);
    });
};

WORLD.onTouchEnd = function(func) {
    WORLD.initTouch();
    document.body.addEventListener('touchend', function (event) {
        func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
    })
};

WORLD.onTouch = function(func) {
    WORLD.initTouch();
    document.body.addEventListener('touchend', function (event) {
        if(WORLD.touchMove) {
            WORLD.touchMove = false;
        }
        else {
            func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
        }
    })
};

WORLD.onTouchMove = function(func) {
    WORLD.svg.call(
        d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged )
        .on('end', dragend )        
    );
    
    function dragstarted(){
    }
    
    function dragged() {
        func(d3.event.x, d3.event.y);
    }
    
    function dragend() {
    }
    
   /* 
    WORLD.initTouch();
    document.body.addEventListener('touchmove', function (event) {
        WORLD.touchMove = true;
        func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
    })
    */
};

WORLD.onCollisionStart = function(body, func) {
    Matter.Events.on(WORLD.engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if(pair.bodyA.id == body.id || pair.bodyB.id == body.id) {
                func(pair);
            }
        }
    });
};