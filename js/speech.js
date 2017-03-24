'use strict';

/* global WORLD */

WORLD.speek = function (text, voiceNum) {

    var msg = WORLD.currentMessage;
    if(msg == null) {
        msg = new SpeechSynthesisUtterance(text);
        WORLD.currentMessage = msg;
    }

    if(voiceNum != WORLD.currentVoiceNum) {
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[voiceNum];
        WORLD.currentVoiceNum = voiceNum;
    }

    msg.text = text;

    window.speechSynthesis.speak(msg);
};

