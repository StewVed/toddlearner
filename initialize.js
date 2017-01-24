//Modified from stewved/gameTemplate/initialize.s - part of my gameTemplate project.
//hopefully comprehensive HTML cancel fullscreen:
var killFS = (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
//kick up fullscreen:
var getFS = (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen);
//mousewheel event, based on the all-encompassing mozDev version
var mouseWheelType = 'onwheel'in document.createElement('div') ? 'wheel' : document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll';
/*
 * Keys to ignore... alt-tab is annoying, so don't bother with alt for example
 * 16 = shift
 * 17 = Ctrl
 * 18 = Alt (and 17 if altGr)
 * 91 = windows key
 * 116 = F5 - browser refresh
 * 122 = F11 - Full Screen Toggle
*/
var keysIgnore = [0, 16, 17, 18, 91, 116, 122];
/*
 * left,up,right,down,A,B,X,Y   you can add more should your game require it.
*/
var keysDefault = {100:0,101:1,97:2,98:3};
/*
 * the currently used keys are loaded on init
*/
var keysCurrent;
//Input events vars to hold the event info:
var inputType;
// touch|gamePad|mouse|keyboard - depending on game type you could add GPS or whatever else HTML supports...
//Mouse:
var mouseVars = [];
//Gamepad:
var gamePadVars = [];
var gamepadReMap = [2,3,0,1];
//keyboard:
var keyVars = [];
//For touch-enabled devices
var touchVars = [];
//global array to handle ongoing touch events
// Create the main sound var
var WinAudioCtx = new (window.AudioContext || window.webkitAudioContext);


var nums = []
, zSize
, z03
, globVol = .33 //the volume of the beeps in the game.
, randing = 0   //whether the game is generating and playing the new number sequence
, buttons = 4   //how many buttons to use in the game - 4 by default
, level = 1     //starting/current level
, turns = 0     //the total number of turns played this game
, t = 600       //for how long something takes to animate... pause time.
, saveY         //whether the user allows saving to HTML5 local storage

//I think I will just do darker and lighter as 25% and 90% or somerthing.
//eg. hslClrs[0][0] is 'red', hslClrs[2][2] is 48
, hsls = [
   {text:'red', h:0, l:50}
 , {text:'orange', h:31, l:50}
 , {text:'yellow', h:60, l:48}
 , {text:'green', h:120, l:45}
 , {text:'blue', h:220, l:50}
 , {text:'purple', h:270, l:50}
 , {text:'pink', h:320, l:50}
 ]
, zShapes = [
    {text:'circle', path:null}
  , {text:'triangle', path:null}
  , {text:'square', path:null}
  , {text:'star', path:null}
  , {text:'heart', path:null}
]
, gameWindow    //vars to hold variables for the window
, zObjects = []
;

function Init() {
  //Add event listeners to the game element
  addEventListeners();
  //initialize the mouse event
  mouseClear();
  //initialize the scroll vars
  scrollClear();
  //window management vars
  gameWindow = {
    initWidth:640, initHeight:360, width:0, height:0, scale:1
  };

  gameVars = {
      go:0        //only process changes on an event
    , tWoz:0      //Time on Last Frame
    , tslf:0      //Time Since Last Frame
    , tFrame:0    //Window Animation Frame timer
    , tfps:5      //how many frames have passed (to the fpsLimit)
    , fpsLimit:2  //how many anim frames to skip (60, 30, 15)
    , gameObject: null
    , gameObjectLast: null
    , gameBack:null, gameMain:null, gameFore:null
    , gameBackCTX:null, gameMainCTX:null, gameForeCTX:null
  };

  //Create the canvas elements for the game:
  document.body.innerHTML =
  '<div id="cont">' +
    '<canvas id="gameBack" style="position:absolute;margin:0;left:0;"></canvas>' +
    '<canvas id="gameMain" style="position:absolute;margin:0;left:0;"></canvas>' +
    '<canvas id="gameFore" style="position:absolute;margin:0;left:0;"></canvas>' +
  '</div>';

  //check for saved data. If set, the user has chosed to either save or not save data.
  storageCheck();

  //for the moment, just use the default keyset:
  keysCurrent = keysDefault;

  //check if the user has modified the volume level:
  var dataToLoad = storageLoad('vol');
  if (dataToLoad) {
    globVol = parseFloat(dataToLoad);
  }

  //make a link to the game areas in memory for quicker access:
  gameVars.gameBack = document.getElementById('gameBack');
  gameVars.gameMain = document.getElementById('gameMain');
  gameVars.gameFore = document.getElementById('gameFore');

  //Make links to the 2D contexts of each canvas
  gameVars.gameBackCTX = gameVars.gameBack.getContext('2d');
  gameVars.gameMainCTX = gameVars.gameMain.getContext('2d');
  gameVars.gameForeCTX = gameVars.gameFore.getContext('2d');

  //now that everything is set up, make a recurring checker for button presses:
  gamePadsButtonEventCheck();
  resize();
  newGame();
}
function addEventListeners() {
  window.addEventListener('resize', resize, false);
  /*
   * I only want to pick up input events on the game,
   * if this doesn't work, go back to window/document
   * and use blur/focus/pause.
   */
  window.addEventListener('contextmenu', bubbleStop, false);
  window.addEventListener('dblclick', bubbleStop, false);
  window.addEventListener(mouseWheelType, mouseWheel, false);
  window.addEventListener('touchstart', touchDown, false);
  window.addEventListener('touchmove', touchMove, false);
  window.addEventListener('touchcancel', touchUp, false);
  window.addEventListener('touchend', touchUp, false);
  window.addEventListener('touchleave', touchUp, false);
  window.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mousemove', mouseMove, false);
  window.addEventListener('mouseup', mouseUp, false);
  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);
}
