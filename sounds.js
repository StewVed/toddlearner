/*
  hopefully, I will be able to set up fully working audio bits of a single big sound file.

  time in seconds, so "yes" end is 3.18 seconds.

  there appear to be a vouple of methods for playing audio (and video).
  The method that I have used before is the zElem.currentTime=n(in seconds), zElem.play(), and zElem.pause()
  methods to pause:
  have a function for monitoring the timeupdate event for the audio element
  this fires anywhere between 4Hz, and 66Hz - that kind of resolution will hopefully be enough.
  window.setTimeout(function(){mediaElement.pause();}, 10); // play for 10ms
  this is a bit guff though, because setTimeout isn't that great.

  there might be another, simpler one that uses the src to say where to play within the file:
  http://foo.com/video.ogg#t=10,20
  Specifies that the video should play the range 10 seconds through 20 seconds.
  I've only seen this once in the firefox dev page, but that would be great, since the browser
  would sort it all out for me.


  I will be using the Web Audio API for the sounds, instead of the
  <audio> element, but I haven't quite learned it yet.
  Specific info (2017-02-07) seems non-existant, so I will have to
  try to get it working on my own!
*/

function initSounds() {
  /*
    I will try to load the audio file using the good old xhr approach,
    then add it to the audioBuffer.
  */
}
function soundPlay() {
  //
}
function soundTimeUpdate(zAudio) {
  //this will also serve to pause the audio.
  if (zAudio.currentTime > zAudio.stopTime) {
    zAudio.pause();
  }
}





// example: soundBeep('sine', 500, 1, 100);setTimeout(function(){soundBeep('sine', 750, 1, 100)}, 100);
function soundBeep(type, frequency, volume, duration) {
  //make the volume comform to the globally set volume
  volume *= globVol;
  volume *= .5;
  //make the entire game queiter.
  //create a HTML5 audio occilator thingy
  var zOscillator = audioCtx.createOscillator();
  //create a HTML5 audio volume thingy
  var zGain = audioCtx.createGain();
  //link the volume to the occilator
  zOscillator.connect(zGain);
  zGain.connect(audioCtx.destination);
  //set up the audio beep to what is needed:
  zOscillator.type = type;
  //default = 'sine' — other values are 'square', 'sawtooth', 'triangle' and 'custom'
  zOscillator.frequency.value = frequency;
  zGain.gain.value = volume;
  //start the audio beep, and set a timeout to stop it:
  zOscillator.start();
  window.setTimeout(function() {
    window.setTimeout(function() {
      zOscillator.stop()
    }, 25);
    //stop once the volume is riiiight down.
    zGain.gain.value = 0.001;
    //hopefully stop that cilck at the end that can happen.
  }, duration);
  //default to qurter of a second for the beep if no time is specified
}
