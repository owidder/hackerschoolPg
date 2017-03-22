'use strict';

/* global WORLD */

WORLD.speek = function (text, voiceName) {
    var voiceNum = voiceName == null ? 0 : window.speechSynthesis.getVoices().filter(function (voice) {
            voice.name == voiceName;
        })[0];

    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
};
