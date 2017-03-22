'use strict';

/* global WORLD */

WORLD.speek = function (text) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
};