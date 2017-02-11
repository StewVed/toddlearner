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
  //audioSprite is an AudioBufferSourceNode.

  //let's create a new audio thing, and use the audioSprite as it's src.
/*
  for (var a of zWords) {
    a.aBuffer = audioSprite.buffer.slice(0,5000);
  }
*/

  //dunno if this is needed, as this file won't be played.
  audioSprite.connect(audioCtx.destination);

  //add my own variable to the audio element variable thingy
  //audioSprite.stopTime = 3.25;
  //add event listener for the time update of the playing audio.
  audioSprite.addEventListener('timeupdate', function() {
      soundTimeUpdate(this)
    });
  /*
    audioSprite.addEventListener('load', function() {
      soundTimeUpdate(this)
    });
  */


  var tmpBuffer = audioSprite.buffer.getChannelData(0);
  //as I understand it, tmpBuffer should be a Float32Array.
  //I should now be able to use slices of it to make the
  //buffers for the individual words!

  //test#1 can I access an element in the array?
  var t1 = tmpBuffer[0];

  //test#2 can I copy a slice of the array?
  var t2 = tmpBuffer.slice(0,10);

  //awesome. Now, let us try to put a little bit of the array
  //in to a new audioBuffer.
  var zSampleRate = audioSprite.buffer.sampleRate;
/*
  I know in seconds where/when each word is in my sprite file.
  To find the frame numbers of the seconds, I should be able to
  take the sampleRate, and figure it out!

  for my wav file, converter into the audioSprite, this gives:
  duration 25.335986394557825
  length: 1117317
  numberOfChannels: 1
  sampleRate: 44100

  OK then. 1117317 / 44100 = 25.335986394557825
  I think there are 44100 samples in every second of the audio.

  So, the first word, which, starts at 0, and ends at .42
  this should mean that I'd need from 0 to 18522 (44100*.42)
  to get that word.
*/

/*
https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer/getChannelData
// Stereo
var channels = 2;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = audioCtx.sampleRate * 2.0;

var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

button.onclick = function() {
  // Fill the buffer with white noise;
  //just random values between -1.0 and 1.0
  for (var channel = 0; channel < channels; channel++) {
   // This gives us the actual ArrayBuffer that contains the data
   var nowBuffering = myArrayBuffer.getChannelData(channel);
   for (var i = 0; i < frameCount; i++) {
     // Math.random() is in [0; 1.0]
     // audio needs to be in [-1.0; 1.0]
     nowBuffering[i] = Math.random() * 2 - 1;
   }
  }

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = audioCtx.createBufferSource();
  // set the buffer in the AudioBufferSourceNode
  source.buffer = myArrayBuffer;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);
  // start the source playing
  source.start();
*/

  //Using the knowlage learned from the code above, let us try!
  var zFrameStart = 0;
  var zFrameEnd = zSampleRate * .42;
  var zFrameLength = zFrameEnd - zFrameStart
  var tmpAudioBuffer = audioCtx.createBuffer(1, zFrameLength, zSampleRate);
  var tmpAudioBufferBuffer = tmpAudioBuffer.getChannelData(0);

  for (var x = zFrameStart; x < zFrameEnd; x++) {
     tmpAudioBufferBuffer[x] = tmpBuffer[x];
  }

  //could I just do:
  //tmpAudioBufferBuffer = tmpBuffer.slice(zFrameStart,zFrameEnd);

  //pause here - VERY useful for debugging obfucated scripts...
  //like ones that are dynamically loaded!
  debugger;

  var newAudioBuffer = audioCtx.createBufferSource();
  newAudioBuffer.buffer = tmpAudioBuffer;
  newAudioBuffer.connect(audioCtx.destination);



  soundPlay(newAudioBuffer)
}
function soundPlay(zAudio) {
  zAudio.start();
}
function soundTimeUpdate(zAudio) {
  //this doesn't fire. maybe audiobuffers don't have the event?
    debugger;
  //this will also serve to pause the audio.
  if (zAudio.currentTime > zAudio.stopTime) {
    zAudio.stop();
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
