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

  //lets just make it always three for the moment.
  var zwidth = gameWindow.initWidth;

  z03 = Math.floor(zwidth * .02);
  zwidth -= (4 * z03);
  zSize = Math.floor(zwidth * .33);

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

  for (var a = 0; a < 3; a++) {
    //generate a new color/shape combo
    var ting;

    while (!ting) {
      ting = randObject();
    }

    var b = Math.floor((a * zSize) + z03 + (a * z03));

    zObjects.push({
        type:ting[0]  //the shape: 0=circle, 1=triangle, 2=square, etc.
      , color:ting[1] //the color of the object.
      , x:b         //start horizontal coordinate of the object
      , y:z03 * 2       //start vertical coordinate of the object
      });

    ting = null;
  }
  gameVars.picked = Math.round(Math.random() * 2);
  drawObjects();
  userAsk();
}

function randObject() {
    var nType = Math.round(Math.random() * (zShapes.length-1));
    var nColor = Math.round(Math.random() * (zColors.length-1));
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
  //These are scaled to the current game window!

  //circle
  zShapes[0].path = new Path2D();
  zShapes[0].path.arc(
    gScale(.5)
  , gScale(.5) // half the height + 5
  , gScale(.5) //radius = half the height of circle.
  , 0, 2 * Math.PI); //these two are always same to make circle.
  zShapes[0].path.closePath();

  //Triangle
  zShapes[1].path = new Path2D();
  zShapes[1].path.moveTo(gScale(.5), gScale(.025)); //half the length of the start to the width
  zShapes[1].path.lineTo(gScale(.975), gScale(.975));//bottom-right
  zShapes[1].path.lineTo(gScale(.025), gScale(.975)); //bottom-left
  zShapes[1].path.closePath();

  //Square
  zShapes[2].path = new Path2D();
  zShapes[2].path.rect(gScale(.025), gScale(.025), gScale(.95), gScale(.95));
  zShapes[2].path.closePath();

  //Star
  zShapes[3].path = new Path2D();
  //Done by eye from co-ords on a star created in inkscape!
  zShapes[3].path.moveTo(gScale(.5), 0); //outer-top-middle
  zShapes[3].path.lineTo(gScale(.64), gScale(.38));//inner-top-right
  zShapes[3].path.lineTo(gScale(1), gScale(.4));//outer-top-right
  zShapes[3].path.lineTo(gScale(.7), gScale(.62));//inner-bottom-right
  zShapes[3].path.lineTo(gScale(.8), gScale(1));//outer-bottom-right
  zShapes[3].path.lineTo(gScale(.5), gScale(.77));//inner-bottom-middle
  zShapes[3].path.lineTo(gScale(.2), gScale(1));//inner-bottom-left
  zShapes[3].path.lineTo(gScale(.3), gScale(.62));//inner-bottom-left
  zShapes[3].path.lineTo(0, gScale(.4));//outer-top-left
  zShapes[3].path.lineTo(gScale(.38), gScale(.38));//inner-top-left
  zShapes[3].path.lineTo(gScale(.5), 0); //outer-top-middle
  zShapes[3].path.closePath();

  //Heart
  zShapes[4].path = new Path2D();

  zShapes[4].path.moveTo(gScale(.1), gScale(.5));

  zShapes[4].path.bezierCurveTo(
     gScale(-.325)
    ,gScale(-.1)
    ,gScale(.7)
    ,gScale(-.2)
    ,gScale(.5)
    ,gScale(.5)
  );

  zShapes[4].path.bezierCurveTo(
     gScale(.3)
    ,gScale(-.2)
    ,gScale(1.325)
    ,gScale(-.1)
    ,gScale(.9)
    ,gScale(.5)
  );
  //right diagonal line
  zShapes[4].path.lineTo(gScale(.5), gScale(1));
  zShapes[4].path.closePath();
/*
  //Numbers from 0 - 9
  for (var x = 5; x < 15; x++) {
    zShapes[x].path = new Path2D();
    // addText(DOMString text, CanvasDrawingStyles styles, any transformation, any x_path, optional unrestricted double y_maxWidth, optional unrestricted double maxWidth)
    zShapes[x].path = (x-5).toString(); //should be 0-9
  }

  I think I will have to only do a number of objects and ask for that number.
  eg. where are the 3 red squares, and have 3 small red squares in a single tile.
*/
  //render the new shapes
  gameVars.go = 1;
}
function gScale(a) {
  a *= zSize;
  //since this is called so many times, it is put in it's own function.
  return Math.floor(a * gameVars.scale);
}

function resetWordList() {
  wordList = [];
  wordList[0] = 2;
}

function userAsk() {
  gameVars.gameForeText = 'Which is the ' + 
  zColors[zObjects[gameVars.picked].color].text +
  ' ' +
  zShapes[zObjects[gameVars.picked].type].text +
  '?';
  gameVars.gameForeColor = 'black';

  wordList.push('ask');
  wordList.push(zWords[0]);
  wordList.push(zWords[2]);
  wordList.push(zWords[4]);
  wordList.push(zColors[zObjects[gameVars.picked].color]);
  wordList.push(zShapes[zObjects[gameVars.picked].type]);
/*
  for making sure each word is in the correct place:

  for (var a of zWords) {
    //wordList.push(a);
  }
  for (var a of zColors) {
    wordList.push(a);
  }
  for (var a of zShapes) {
    wordList.push(a);
  }
  for (var a of zNumbers) {
    wordList.push(a);
  }
*/
  soundPlay(wordList[wordList[0]]);

  gameRenderFore();

  randing = 0;
}
function userRight() {
  soundPlay(zWords[5].aBuffer);
  gameVars.gameForeText = 'Yes! That is the ' +
  zColors[zObjects[gameVars.picked].color].text +
  ' ' +
  zShapes[zObjects[gameVars.picked].type].text +
  '.';
  gameVars.gameForeColor = 'green';

  wordList.push('right');
  wordList.push(zWords[6]);
  wordList.push(zWords[1]);
  wordList.push(zWords[2]);
  wordList.push(zWords[4]);
  wordList.push(zColors[zObjects[gameVars.picked].color]);
  wordList.push(zShapes[zObjects[gameVars.picked].type]);
  soundPlay(wordList[wordList[0]]);

  gameRenderFore();
}
function userWrong(num) {
  soundPlay(zWords[3].aBuffer);
  gameVars.gameForeText = 'That is a ' +
  zColors[zObjects[num].color].text +
  ' ' +
  zShapes[zObjects[num].type].text +
  '.';
  gameVars.gameForeColor = 'red';

  wordList.push('wrong');
  wordList.push(zWords[1]);
  wordList.push(zWords[2]);
  wordList.push(zWords[5]);
  wordList.push(zColors[zObjects[num].color]);
  wordList.push(zShapes[zObjects[num].type]);
  soundPlay(wordList[wordList[0]]);

  gameRenderFore();
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
  var ting = parseInt(gameVars.gameObject);
  if (isFinite(ting)) {
    if (ting === gameVars.picked) {
      userRight();
    }
    else {
      userWrong(parseInt(ting));
    }
  }
  else {
    gameVars.gameObject = null;
    randing = 0;
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

/*
could I just use: boolean ctx.isPointInPath(path, x, y);
*/
  var ting = null;
  var mx = (Math.floor((e.clientX - document.getElementById('cont').offsetLeft) / gameVars.scale));
  var my = (Math.floor((e.clientY - document.getElementById('cont').offsetTop) / gameVars.scale));

  for (var x = 0; x < zObjects.length; x++) {
    if (
      (mx >= zObjects[x].x && 
      mx <= (zObjects[x].x + zSize))
      &&
      (my >= zObjects[x].y && 
      my <= (zObjects[x].y + zSize))
    ) {
      ting = x;
    }
  }
  return ting;
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
        TODO: slider in settings to up the frameTime limit!
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
  //to handle the numbers and letters, set a scaled font size
  gameVars.gameMainCTX.font = 'bold ' + (gameVars.scale * 1650) + '% Arial'; //

  //loop through all o fthe objects and fill/draw each one's path
  for (var x of zObjects) {
    var a = Math.floor(x.x * gameVars.scale);
    var b = Math.floor(x.y * gameVars.scale);
    gameVars.gameMainCTX.fillStyle = zColors[x.color].text;
    gameVars.gameMainCTX.translate(a, b);
    if (x.type < 5) {
      gameVars.gameMainCTX.fill(zShapes[x.type].path);
    }
    else if (x.type >= 5) {
      gameVars.gameMainCTX.fillText(
          zShapes[x.type].path
        , Math.round(23 * gameVars.scale)//((50 * gameVars.scale) / 2) - Math.round(gameVars.gameForeCTX.measureText(zShapes[x.type].path).width / 2) //horizontal start coordinate
        , Math.round(190 * gameVars.scale) //vertical start coordinate
      );
    }
    gameVars.gameMainCTX.translate(-a, -b);
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
  //gameVars.gameForeCTX.textAlign = 'center';

  gameVars.gameForeCTX.fillText(
    gameVars.gameForeText
    , (gameWindow.width / 2) - Math.round(gameVars.gameForeCTX.measureText(gameVars.gameForeText).width / 2) //horizontal start coordinate
    , Math.round(300 * gameVars.scale) //vertical start coordinate
  );
}
