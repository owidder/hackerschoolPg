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

