'use strict';

/* global WORLD */

WORLD.speek = function (text, voiceNum) {
    var msg = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[voiceNum];
    window.speechSynthesis.speak(msg);
};
