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
  //redraw the objects to the new size
  drawObjects();
  //run the main game loop to sort any changes, and then render.
  anEvent();
  gameVars.go = 1;
  gameRenderFore();
}
function resizeCenter(a, b) {
  return Math.round((a / 2) - (b / 2)) + 'px';
}
function createObjects() {
  /*
    my game scaling system relies on the game itself being a fixed
    size, and then only scaling it when rendering.

    This means that when dealing with anything about the game,
    do the initial width and height, which I have set to 640 x 360.

    When the game is rendered, it is scaled to the current size of
    the window at that point.

    (I imagine this is the method most games use since it makes sense!)
  */
  zObjects = [];

  //lets just make it always three for the moment.
  var zwidth = gameWindow.initWidth;

  var z03 = Math.floor(zwidth * .02);
  zwidth -= (4 * z03);
  var z33 = Math.floor(zwidth * .33);  

  for (var a = 0; a < 3; a++) {
    //generate a new color/shape combo
    var ting;

    while (!ting) {
      ting = randObject();
    }

    var b = Math.floor((a * z33) + z03 + (a * z03));

    zObjects.push({
        path:null //the path of the object
      , type:ting[0]  //the shape: 0=circle, 1=triangle, 2=square, etc.
      , color:ting[1] //the color of the object.
      , x:b         //start horizontal coordinate of the object
      , y:z03       //start vertical coordinate of the object
      , w:z33       //width of the object
      , h:z33       //height of the object
      });

      ting = null;
  }
  gameVars.picked = Math.round(Math.random() * 2);
  drawObjects();
  gameVars.go = 1;
  userAsk();
}

function randObject() {
    var nType = Math.round(Math.random() * 2);
    var nColor = Math.round(Math.random() * 6);
    var allGood = 1;

    //while these two match another object, re-choose.
    for (var x of zObjects) {
      if (nType === x.type && nColor === x.color){
        allGood = 0;
        break;
      }
    }
    if (allGood) {
      return [nType, nColor];
    }
    else {
      return null;
    }
}
function drawObjects() {
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

  //These are scaled to the current game window!
  for (var x of zObjects) {
    x.path = new Path2D();
    //circle
    if (x.type == 0) {
      x.path.arc(
        gScale(x.x + Math.floor(x.w / 2))
      , gScale(x.y + Math.floor(x.h / 2)) // half the height + 5
      , gScale(x.h / 2) //radius = half the height of circle.
      , 0, 2 * Math.PI); //these two are always same to make circle.
    }
    //Triangle
    else if (x.type == 1){
      x.path.moveTo(gScale(x.x + Math.floor(x.w / 2)), gScale(x.y)); //half the length of the start to the width
      x.path.lineTo(gScale(x.x + x.w), gScale(x.y + x.h));//bottom-right
      x.path.lineTo(gScale(x.x), gScale(x.y + x.h)); //bottom-left
    }
    //Square
    else if (x.type == 2){
      x.path.rect(gScale(x.x), gScale(x.y), gScale(x.w), gScale(x.h));
    }
    //add more objects here :D
  }
}
function gScale(a) {
  //since this is called so many times, it is put in it's own function.
  return Math.floor(a * gameVars.scale);
}

function userAsk() {
  gameVars.gameForeText = 'Which is the ' + 
  hsls[zObjects[gameVars.picked].color][0] +
  ' ' +
  shps[zObjects[gameVars.picked].type] +
  '?';
  gameVars.gameForeColor = 'black';

  //gameVars.gameForeText = 'Yes! That is the yellow triangle'; 

  gameRenderFore();
}
function userRight() {
  gameVars.gameForeText = 'Yes! That is the ' + 
  hsls[zObjects[gameVars.picked].color][0] +
  ' ' +
  shps[zObjects[gameVars.picked].type] +
  '.';
  gameVars.gameForeColor = 'green';
  gameRenderFore();

  //make it do a different set of shapes each tick.
  window.setTimeout(function() {
    createObjects();
  }, 2000);
}
function userWrong(num) {
  gameVars.gameForeText = 'That is a ' + 
  hsls[zObjects[num].color][0] +
  ' ' +
  shps[zObjects[num].type] +
  '.';
  gameVars.gameForeColor = 'red';
  gameRenderFore();

  window.setTimeout(function() {
    userAsk();
  }, 2000);
}

function newGame() {
  playing = null ;
  Win = 1;
  turn = 0;
  randing = 1;
  createObjects();
  //this can be used for reseting as well as the initial setup.
  window.clearInterval(gameVars.tFrame);

  gameVars.tWoz = new Date().getTime();
  gameMainLoop();
}
function endUp() {
  var ting = findObject({clientX:mouseVars.xCurrent, clientY:mouseVars.yCurrent});
  if (isFinite(parseInt(ting))) {
    if (ting === gameVars.picked) {
      userRight();
    }
    else {
      userWrong(parseInt(ting));
    }
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
function findObject(e) {

  var ting = null;
  var mx = (Math.floor((e.clientX - document.getElementById('cont').offsetLeft) / gameVars.scale));
  var my = (Math.floor((e.clientY - document.getElementById('cont').offsetTop) / gameVars.scale));

  for (var x = 0; x < zObjects.length; x++) {
    if (
      (mx >= zObjects[x].x && 
      mx <= (zObjects[x].x + zObjects[x].w))
      &&
      (my >= zObjects[x].y && 
      my <= (zObjects[x].y + zObjects[x].h))
    ) {
      ting = x;
    }
  }
  return ting;
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
  if (gameVars) {
    /*
     update gamepads here.
     The mouse, touch, and keyboard inputs are updated
     as they change.
    */
    gamePadUpdate();
    gameVars.tfps++;
    if (gameVars.go) {
      /*
       * Find the amount of time that has gone by since last frams
      */
      var tNow = new Date().getTime();
      gameVars.tslf = (tNow - gameVars.tWoz);
      gameVars.tWoz = tNow;
      /*
        because there is little need for any game to render at 60FPS
        because humans can only notice movement up to about 30FPS
        (DVD movies are 24.9FPS or so for example)
        user can change
        that to further lower the frame-rate, thus saving more power.
      */
      /*
        TODO: slider it settings to up the frameTime limit!
      */
      if (gameVars.tslf && gameVars.tfps > gameVars.fpsLimit) {

        if (gameVars.goBack) {
          gameRenderBack();
          gameVars.goBack = 0;
        }

        gameRenderMain();

        //reset the frame skipper
        gameVars.tfps = 0;
        //effectively pause the game until the next event.
        gameVars.go = 0;
      }
    }
  }

  gameVars.tFrame = window.requestAnimationFrame(function(){gameMainLoop()});
}


function gamePause(a) {
  // needs a conditional to check for focus really

  if (a) {

  }
  gameVars.go = a;
}

function gameRenderBack() {
  //use this canvas for static backgrounds and paralax type stuff.
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
//clear the entire canvas:
  gameVars.gameForeCTX.clearRect(0,0,gameWindow.width,gameWindow.height);

  // Use this canvas for scores and messages.
  gameVars.gameForeCTX.font = 'bold ' + (gameVars.scale * 250) + '% Arial'; //
  gameVars.gameForeCTX.fillStyle = gameVars.gameForeColor; //proper green
  //gameVars.gameForeCTX.textAlign = 'center'; //

  //add the score, top-right with 3 pixels from edge
  gameVars.gameForeCTX.fillText(
    gameVars.gameForeText
    , (gameWindow.width / 2) - Math.round(gameVars.gameForeCTX.measureText(gameVars.gameForeText).width / 2) //horizontal start coordinate
    , Math.round(300 * gameVars.scale) //vertical start coordinate
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
