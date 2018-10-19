//Modified from stewved/gameTemplate/initialize.s - part of my gameTemplate project.
//hopefully comprehensive HTML cancel fullscreen:
var killFS = (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
//kick up fullscreen:
var getFS = (document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen);
//mousewheel event, based on the all-encompassing mozDev version
var mouseWheelType = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll';
/*
 * Keys to ignore... alt-tab is annoying, so don't bother with alt for example
 * 16 = shift
 * 17 = Ctrl
 * 18 = Alt (and 17 if altGr)
 * 91 = windows key
 * 116 = F5 - browser refresh
 * 122 = F11 - Full Screen Toggle
 * 123 = F12 - Dev tools.
*/
var keysIgnore = [0, 16, 17, 18, 91, 116, 122, 123];
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
//from webtop project - 
var imgSocs = 'style="background:center/contain no-repeat url(\'images/';
//base64 code for an empty 1x1 png:
var imgDummy = ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjAAIAAAQAASDSLW8AAAAASUVORK5CYII="';
// Create the audio part of the game:
//the main audio file will be put in here:
var audioSprite;
//I hate vendor prefixes! Why not just keep to the W3 specs?!?!?!
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new window.AudioContext();
var audioVolume = audioCtx.createGain();
/*
  For this project, there will only be one sound - the voice speaking the words.
  If the user clicks a button before the end of the speech, I have to be able
  to stop it mid-speach to respond to the user's input
*/
var speakWord;

var nums = []
, zSize
, z03
, globVol = .33 //the volume of the beeps in the game.
, isMuted = false //as the user muted the game?
, randing = 0   //whether the game is generating and playing the new number sequence
, buttons = 4   //how many buttons to use in the game - 4 by default
, level = 1     //starting/current level
, turns = 0     //the total number of turns played this game
, t = 600       //for how long something takes to animate... pause time.
, saveY         //whether the user allows saving to HTML5 local storage

, wordList

, zWords = [
    {text:'Which', aStart:0.246, aDuration:.580}
  , {text:'That', aStart:1.083, aDuration:.560}
  , {text:'is', aStart:1.948, aDuration:.465}
  , {text:'are', aStart:2.626, aDuration:.535}
  , {text:'the', aStart:3.495, aDuration:.430}
  , {text:'a', aStart:4.181, aDuration:.485}
  , {text:'Yes!', aStart:5.090, aDuration:.715}
  , {text:'s', aStart:5.445, aDuration:.369} //the s of yes :D
]
, zNumbers = [
    {text:'1', aStart:6.137, aDuration:.485}
  , {text:'2', aStart:6.872, aDuration:.438}
  , {text:'3', aStart:7.555, aDuration:.459}
  , {text:'4', aStart:8.263, aDuration:.511}
  , {text:'5', aStart:9.023, aDuration:.717}
  , {text:'6', aStart:9.990, aDuration:.710}
  , {text:'7', aStart:10.948, aDuration:.784}
  , {text:'8', aStart:11.983, aDuration:.559}
  , {text:'9', aStart:12.788, aDuration:.640}
  , {text:'10', aStart:13.679, aDuration:.608}
]
//I think I will just do darker and lighter as 25% and 90% or somerthing.
//eg. hslClrs[0][0] is 'red', hslClrs[2][2] is 48
, zColors = [
   {text:'red', h:0, l:50, aStart:14.587, aDuration:.605}
 , {text:'orange', h:31, l:50, aStart:15.441, aDuration:.625}
 , {text:'yellow', h:60, l:48, aStart:16.316, aDuration:.375}
 , {text:'green', h:120, l:45, aStart:16.936, aDuration:.500}
 , {text:'blue', h:220, l:50, aStart:17.696, aDuration:.450}
 , {text:'purple', h:270, l:50, aStart:18.398, aDuration:.630}
 , {text:'pink', h:320, l:50, aStart:19.279, aDuration:.550}
 ]
, zShapes = [
    {text:'circle', path:null, aStart:20.079, aDuration:.865}
  , {text:'triangle', path:null, aStart:21.199, aDuration:.755}
  , {text:'square', path:null, aStart:22.209, aDuration:.775}
  , {text:'star', path:null, aStart:23.239, aDuration:.830}
  , {text:'heart', path:null, aStart:24.318, aDuration:.765}
]
, gameWindow    //vars to hold variables for the window
//gameVars woz ere! Now in loader file so app knows when it can display a popup toast.
, zObjects = []
;

function Init() {
  //Add event listeners to the game element
  addEventListeners();
  //check for saved data. If set, the user has chosed to either save or not save data.
  storageCheck();
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


  //for the moment, just use the default keyset:
  keysCurrent = keysDefault;

  //check if the user has modified the volume level:
  var dataToLoad = storageLoad('vol');
  if (dataToLoad) {
    globVol = parseFloat(dataToLoad);
    updateVolume();
  }
  var dataToLoad = storageLoad('muted');
  if (dataToLoad) {
    isMuted = parseInt(dataToLoad);
  }

  //make a link to the game areas in memory for quicker access:
  gameVars.gameBack = document.getElementById('gameBack');
  gameVars.gameMain = document.getElementById('gameMain');
  gameVars.gameFore = document.getElementById('gameFore');

  //Make links to the 2D contexts of each canvas
  gameVars.gameBackCTX = gameVars.gameBack.getContext('2d');
  gameVars.gameMainCTX = gameVars.gameMain.getContext('2d');
  gameVars.gameForeCTX = gameVars.gameFore.getContext('2d');

  //create the settings window here so that it is
  //all loaded when needed.
  settingsCreate();

  settingsButton();
  //now that everything is set up, make a recurring checker for button presses:
  gamePadsButtonEventCheck();
  resize();
  resetWordList();
  playButton();
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
function playButton() {
  /*
    get the user to click/tap the display
    before thegame beings, also giving the user
    a chance to mute the game before it plays.
    clicking the play button calls newGame();
  */
  //create a semi-opaque rounded rectangle on the top-right, and put the message into it.
  var newElem = document.createElement('div');
  newElem.id = 'pB';
  newElem.classList = 'playOverlay';

  newElem.innerHTML =
    '<div id="playButtons" style="position:absolute;width:100%;" >' +
      //Play button
      '<div id="playB" class="uButtons uButtonGreen" style="position:relative;margin:0;font-size:3em;box-sizing:border-box;">&nbsp;Play&nbsp;</div>' +
      '<br><br>' +
      /*
        mute/unmute toggler
        &#128266; &#x1F50A; - speaker with sound waves
        &#128263; &#x1F507; - speaker with diagonal line through (muted)
      */
      '<div id="pmuteToggle" class="uButtons uButtonGreen" style="position:relative;margin:0;font-size:2em;box-sizing:border-box;">&#128266;</div>' +
    '</div>'
    ;
  document.body.appendChild(newElem);
  if (isMuted) {
    //switch grey to green
    swapToggler('pmuteToggle');
  }
  resize();
}
function xtraInputs(zId) {
  if (zId === 'playB') {
     document.body.removeChild(document.getElementById('pB'));
     //thanks Google... (https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio)
     audioCtx.resume().then(() => {
       console.log('Playback resumed successfully');
     });
     newGame();
  }
  else if (zId === 'muteToggle') {
    isMuted = isMuted == 1 ? 0 : 1;
    swapToggler('muteToggle');
    storageSave('muted', isMuted);
  }
  else if (zId === 'pmuteToggle') {
    isMuted = isMuted == 1 ? 0 : 1;
    swapToggler('pmuteToggle');
    swapToggler('muteToggle');
    storageSave('muted', isMuted);
  }
  else {
    return false;
  }
//if one of these buttons was the target id of the
//elemnt, return true - no need to do endUp
  return true;
}
function swapToggler(a) {
  a = document.getElementById(a);
  if (!isMuted) {
    a.classList.remove('uButtonGrey');
    a.classList.add('uButtonGreen');
    a.innerHTML = '&#128266;';
  }
  else {
    if (speakWord) {
      speakWord.disconnect();
      //speakWord.stop(); cannot use because it fires the ended event.
    }
    a.classList.remove('uButtonGreen');
    a.classList.add('uButtonGrey');
    a.innerHTML = '&#128263;';
  }
}