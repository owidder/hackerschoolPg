'use strict';

function onClick(func) {
    $(document).click(function (event) {
        func(event.clientX, event.clientY, event);
    });
}

function initTouch() {
    if(!WORLD.touchInitialized) {
        TouchEmulator();
        WORLD.touchInitialized == true;
    }
}

function onTouchStart(func) {
    initTouch();
    document.body.addEventListener('touchstart', function(event) {
        func(event.touches[0].clientX, event.touches[0].clientY, event);
    });
}

function onTouchEnd(func) {
    initTouch();
    document.body.addEventListener('touchend', function (event) {
        func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
    })
}

function onTouch(func) {
    initTouch();
    document.body.addEventListener('touchend', function (event) {
        if(WORLD.touchMove) {
            WORLD.touchMove = false;
        }
        else {
            func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
        }
    })
}

function onTouchMove(func) {
    initTouch();
    document.body.addEventListener('touchmove', function (event) {
        WORLD.touchMove = true;
        func(event.changedTouches[0].clientX, event.changedTouches[0].clientY, event);
    })
}

function onCollisionStart(id, func) {
    Matter.Events.on(WORLD.engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if(pair.bodyA.id == id || pair.bodyB.id == id) {
                func(pair);
            }
        }
    });

}