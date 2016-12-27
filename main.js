/*
  Learning game for toddlers by StewVed.
*/

function resize() {
  //maybe I should make the game bit a squre, then have the scores bit
  //however amount of space is left? what if the available area is square?
  //regardless, let's begin by finding the smallest size out of length and width:
  var a, b, portraitLayout;

  document.body.style.width = window.innerWidth + 'px';
  document.body.style.height = window.innerHeight + 'px';

  if (window.innerWidth > window.innerHeight) {
    a = window.innerHeight;
    b = window.innerWidth;
    portraitLayout = 0;
  }
  else {
    a = window.innerWidth;
    b = window.innerHeight;
    portraitLayout = 1;
  }

  var gWidth = document.body.offsetWidth;
  var gHeight = (gWidth / (16 / 9));
  if (gHeight > document.body.offsetHeight) {
    gHeight = document.body.offsetHeight;
    gWidth = gHeight * (16 / 9);
  }
  document.getElementById('cont').style.width = gWidth + 'px';
  document.getElementById('cont').style.height = gHeight + 'px';

  //when the available screen is not 16/9, center the game.
  //this should default as 0px for both generaly.
  document.getElementById('cont').style.top = resizeCenter(document.body.offsetHeight, document.getElementById('cont').offsetHeight);
  document.getElementById('cont').style.left = resizeCenter(document.body.offsetWidth, document.getElementById('cont').offsetWidth);

  //detect the new size of the available area, make a note of it and resize the canvas
  gameWindow.width = document.getElementById('cont').offsetWidth;
  gameVars.gameBack.width = gameWindow.width;
  gameVars.gameMain.width = gameWindow.width;
  gameVars.gameFore.width = gameWindow.width;

  gameWindow.height = document.getElementById('cont').offsetHeight;
  gameVars.gameBack.height = gameWindow.height;
  gameVars.gameMain.height = gameWindow.height;
  gameVars.gameFore.height = gameWindow.height;

  //calculate the size ratio from initial/base - let's do 640 x 360
  gameVars.scale = gameWindow.width / gameWindow.initWidth;

}
function resizeCenter(a, b) {
  return Math.round((a / 2) - (b / 2)) + 'px';
}
function randNums() {

  zObjects = [];
/*
  zObjects.push(
  {
    path:new Path2D() //the path of the object
  , type:2  //the shape: 0=circle, 1=triangle, 2=square, etc.
  , color:0 //the color of the object.
  , x:5     //start horizontal coordinate of the object
  , y:5     //start vertical coordinate of the object
  , w:50     //width of the object
  , h:50     //height of the object
  }
  );
  //the zObject array would be something like this:
  zObjects.push(
  {
    path:new Path2D() //the path of the object
  , type:1  //the shape: 0=circle, 1=triangle, 2=square, etc.
  , color:3 //the color of the object.
  , x:60     //start horizontal coordinate of the object
  , y:60     //start vertical coordinate of the object
  , w:50     //width of the object
  , h:50     //height of the object
  }
  );

  zObjects.push(
  {
    path:new Path2D() //the path of the object
  , type:0  //the shape: 0=circle, 1=triangle, 2=square, etc.
  , color:4 //the color of the object.
  , x:115     //start horizontal coordinate of the object
  , y:115     //start vertical coordinate of the object
  , w:50     //width of the object
  , h:50     //height of the object
  }
  );
  */
  for (var a = 0; a < 3; a++) {
    var b = (a * 55) + 5;

    zObjects.push({
        path:new Path2D() //the path of the object
      , type:Math.round(Math.random() * 2)   //the shape: 0=circle, 1=triangle, 2=square, etc.
      , color:Math.round(Math.random() * 6) //the color of the object.
      , x:b     //start horizontal coordinate of the object
      , y:55     //start vertical coordinate of the object
      , w:50     //width of the object
      , h:50     //height of the object
      });
  }
  
  createObjects();
}
function newGame() {
  playing = null ;
  Win = 1;
  turn = 0;
  randing = 1;
  randNums();
  //this can be used for reseting as well as the initial setup.
  window.clearInterval(gameVars.tFrame);

  gameVars.tWoz = new Date().getTime();
  gameMainLoop();
}
function endUp(num) {
  if (!randing) {
    //turn the correct button green:
    ButtonBackColor(nums[combo], 80);
    if (num != nums[combo]) {
      //if the pressed button is not the correct button:
      //turn the presssed button red:
      ButtonBackColor(num, 30);
      //user win = false!
      Win = 0;
      //you only lose if you get one wrong
      //end the round now regardless of how many more clicks are left in this level.
      combo = (level - 1);
    }
    combo++;
    if (combo >= level) {
      endTurn();
    }
    soundBeep('sine', 750, 1, 100);
  }
}
function endTurn() {
  combo = 0;
  turns++;
  if (Win) {
    score++;
    window.setTimeout(function() {
      soundBeep('sine', 1000, 1, 100)
    }, 100);
  } else {
    score--;
    window.setTimeout(function() {
      soundBeep('sine', 500, 1, 100)
    }, 100);
  }
  updateProgress();
  if (score >= threshold) {
    end1(1, '100%');
    window.setTimeout(function() {
      soundBeep('sine', 1500, 1, 100)
    }, 200);
  } else if (score <= -threshold) {
    end1(-1, '-300%');
    window.setTimeout(function() {
      soundBeep('sine', 330, 1, 100);
    }, 200);
  }
  newGame();
}
function end1(num, x) {
  score = 0;
  level += num;
  if (level < 1) {
    level = 1;
  }
  window.setTimeout(function() {
    document.getElementById('pa').style.left = x;
  }, t);
  window.setTimeout(function() {
    levelChange();
  }, t * 2);
}
function ButtonBackColor(a, zLux) {
  if (document.getElementById(a)) {
    document.getElementById(a).style.transition = '0s';
    document.getElementById(a).style.backgroundColor = 'hsl(' + hslClrs[a][0] + ', 100%, ' + zLux + '%)'; //hslLs[a];

    window.setTimeout(function(){
      document.getElementById(a).style.transition = '.3s';
      document.getElementById(a).style.backgroundColor = 'hsl(' + hslClrs[a][0] + ', 100%, ' + hslClrs[a][1] + '%)'; //hsls[a];
    }, (t * .5));
  }
}
// fullscreen handling from webtop then simplified for this project...
function fullScreenToggle() {
  var isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (isFS) {
    killFS.call(document, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsd')
      document.getElementById('fs').classList.add('fsu');
    }
  } else {
    getFS.call(document.documentElement, function() {});
    if (document.getElementById('fs')) {
      document.getElementById('fs').classList.remove('fsu')
      document.getElementById('fs').classList.add('fsd');
    }
  }
}
function toggleSettings() {
  if (document.getElementById('settns').style.visibility === 'hidden') {
    document.getElementById('settns').style.visibility = 'visible';
  } else {
    document.getElementById('settns').style.visibility = 'hidden';
    newGame();
  }
}

function gameMainLoop() {
  if (!gameVars) {
    return; //happens when the window is closed.
  }

  if (!gameVars.paused) {
    /*
     * Find the amount of time that has gone by since last frams
    */
    var tNow = new Date().getTime();
    var frameTime = (tNow - gameVars.tWoz);
    gameVars.tWoz = tNow;
    if (frameTime) {
      /*
       * update any gamepads here.
       * The mouse, touch, and keyboard inputs are updated as they change.
      */
      gamePadUpdate();
      //make it do a different set of shapes each tick.
      randNums();

      //gameRenderBack();
      gameRenderMain();
      //gameRenderFore();
    }
    gameVars.tFrame = window.requestAnimationFrame(function(){gameMainLoop()});

  }
}


function gamePause(yes) {
  // needs a conditional to check for focus really

  if (yes) {

  }
  gameVars.paused = yes;
}

function gameRenderBack() {
  //use this canvas for static backgrounds and paralax type stuff.
}

function createObjects() {
  //the Path2D would be zObjects[x].path
  /*
  MDN examples:
  var rectangle = new Path2D();
  rectangle.rect(10, 10, 50, 50);

  var circle = new Path2D();
  circle.moveTo(125, 35);
  circle.arc(100, 35, 25, 0, 2 * Math.PI);

  ctx.stroke(rectangle);
  ctx.fill(circle);
  */
  for (var x of zObjects) {
    //circle
    if (x.type == 0) {
      x.path.arc(
        (x.x + Math.floor(x.w / 2))
      , (x.y + Math.floor(x.h / 2)) // half the height + 5
      , Math.floor(x.h / 2) //radius = half the height of circle.
      , 0, 2 * Math.PI); //these two alway same to make circle.
    }
    //Triangle
    else if (x.type == 1){
      x.path.moveTo((x.x + Math.floor(x.w / 2)), x.y); //half the length of the start to the width
      x.path.lineTo((x.x + x.w), (x.y + x.h));//bottom-right
      x.path.lineTo(x.x, (x.y + x.h)); //bottom-left
    }
    //Square
    else if (x.type == 2){
      x.path.rect(x.x, x.y, x.w, x.h);
    }
    //more can go here :D
  }
}

function gameRenderMain() {
  //clear the entire canvas:
  gameVars.gameMainCTX.clearRect(0,0,gameWindow.width,gameWindow.height);

  //loop through all o fthe objects and fill/draw each one's path
  for (var x of zObjects) {
    gameVars.gameMainCTX.fillStyle = hsls[x.color][0];
    gameVars.gameMainCTX.fill(x.path);
  }

  //for moving ojects around, take the selected ojbect
  //out of the array, and add it to the end of the array.
  //this should make sure that it is above all of the other objects

}

function gameRenderFore() {
  // Use this canvas for scores and messages.
  gameVars.gameForeCTX.font = '100% Arial'; //
  gameVars.gameForeCTX.fillStyle = '#0f0'; //proper green
  gameVars.gameForeCTX.textAlign = 'center'; //

  //add the score, top-right with 3 pixels from edge
  gameVars.gameForeCTX.fillText(
    zTextToDisplay
    , 10 //horizontal start coordinate
    , 10 //vertical start coordinate
  );
}


// example: soundBeep('sine', 500, 1, 100);setTimeout(function(){soundBeep('sine', 750, 1, 100)}, 100);
function soundBeep(type, frequency, volume, duration) {
  //make the volume comform to the globally set volume
  volume *= globVol;
  volume *= .5;
  //make the entire game queiter.
  //create a HTML5 audio occilator thingy
  var zOscillator = WinAudioCtx.createOscillator();
  //create a HTML5 audio volume thingy
  var zGain = WinAudioCtx.createGain();
  //link the volume to the occilator
  zOscillator.connect(zGain);
  zGain.connect(WinAudioCtx.destination);
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
