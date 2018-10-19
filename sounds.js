function soundPlay(a) {
  if (a && !isMuted) {
    //empty the speech variable
    speakWord = null;
    //create the sound context thingy now
    speakWord = audioCtx.createBufferSource();
    //specify the sound buffer to use
    speakWord.buffer = audioSprite;
    //connect the volume to the audiobuffer
    speakWord.connect(audioVolume).connect(audioCtx.destination);
    //add event when the audio finishes
    speakWord.addEventListener('ended', function(){soundEnded(this)})
    //play the sound, specifying when to start and how long to play for
    speakWord.start(0, a.aStart, a.aDuration);//  - audioCtx.currentTime
    //uncomment to test everything is working correctly.
    //console.log('playing ' + a.text);
  }
}
function soundEnded(zElem) {
  //this should fire when a buffer has stopped playing.
  //I will use this to play the next word in the sequence...
  /* TODO
    make an array with the words that have to be shown and played.
    eg.
    wordList = [0,1,2]
    for "Which is the"
    now, the bugger is, how do I do the colour and shape?
    multi array?
    might not be needed, since every time will be either,
    "Where is the", or "That is a" or, "Yes. That is the",
    followed by the color of the object,
    followed by the shape of the object.
    Later, I can also add how many of them there are, and make smaller
    versions of the shapes to fit more than one in a slot.

    Would I need this though? I could just set up delayed audiobuffers
    for all of the words. however, if I did that, I wouldn't know when
    

    right, how about copying all of the words into the wordList array?
    wordList[0] = 1;
    wordList[1] = {word:'yes!', start:7, duration:1};
  */
    //debugger;


  wordList[0] ++;
  if (wordList[0] < wordList.length) {
    soundPlay(wordList[wordList[0]]);
  }
  else {
    if (wordList[1] !== 'ask') {
      endYN(wordList[1]);
    }
  }
}
function updateVolume() {
  audioVolume.gain.value = globVol;
}