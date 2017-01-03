/*
 * Ideally, I would have only two different tpes of input;
 * pointer (for touch and mouse)
 * gamepad for gamepads, and keybnoards
 *
 * having said that, I could make the mouse into a 3-button, 1 axis gamepad, and touches similar, but more axis and buttons.
 * and gamepads and keyboards could be used to move a pointer around too.
 *
 * Sensetivity should be adjustable, and axes and buttons would be configurable
*/
function anEvent() {
  //An event has fired, so let the gameLoop run through.
  gameVars.go = 1;
}

function bubbleStop(e) {
  try {
    e.preventDefault();
    e.stopPropagation();
  } catch (ex) {
    mouseClear();
    touchVars = [];
    //just blank the touches back to nothing.
    touchDown = null;
  }
  //this can fail on touch if scrolling is running on an element at the time...like the uLauncher
}
function findTarget(e) {
  if (!e) {
    var e = window.event;
  }
  targ = e.target || e.srcElement;
  if (targ.nodeType != 1) {
    //element nodes are 1, attribute, text, comment, etc. nodes are other numbers... I want the element.
    targ = targ.parentNode;
  }
  return targ;
}
function gamePadUpdate() {
  var gamePads = navigator.getGamepads();
  for (var x = 0; x < gamePads.length; x++) {
    if (gamePads[x]) {
      //only add if the gamepad exists - NOT FOOLPROOF!
      //initialize/clear the gamePadVar
      gamePadVars[x] = [];
      //only shallow-copy the buttons and axes - don't need the rest (yet!)
      gamePadVars[x].buttons = gamePads[x].buttons.slice(0);
      gamePadVars[x].axes = gamePads[x].axes.slice(0);
    }
  }
}
function gamePadsButtonEventCheck() {
  //only worry about gamePadVar[0] for this version
  var oldButtons = []
  if (gamePadVars[0]) {
    //shallow-copy cos it is an (object) array:
    for (var x = 0; x < gamePadVars[0].buttons.length; x++) {
      oldButtons[x] = gamePadVars[0].buttons[x].pressed;
    }
  }
  gamePadUpdate();
  //if there is at least 1 gamepad being used:
  if (gamePadVars[0]) {
    //if there has been any change to the buttons:
    if (oldButtons.length === gamePadVars[0].buttons.length) {
      //cycle through the newButtons, comparing them to the oldButtons
      for (var x = 0; x < gamePadVars[0].buttons.length; x++) {
        if (oldButtons[x] !== gamePadVars[0].buttons[x].pressed) {
          if (gamePadVars[0].buttons[x].pressed) {
            gamePadsButtonDown(x);
          } else {
            gamePadsButtonUp(x);
          }
          anEvent();
        }
      }
    }
  }
  //because there are no events for a gamepad, I must check for them myself...
  //use animationFrame:
  window.requestAnimationFrame(function() {
    gamePadsButtonEventCheck();
  });
}
function gamePadsButtonDown(zButton) {
  var stopHere = 'blah';
  //I think it'd be nice to have the button lighten here, and play the first beep here...
}
function gamePadsButtonUp(zButton) {
  var stopHere = 'blah';
  //then the right/wrong beep here, with the button's color going back as well.
  //and now this would be the same as mouseClick...
  endUp(gamepadReMap[zButton]);
}
function keyNum(e) {
  return e.keyCode || window.event.keyCode;
  //this is called when there is a keydown or keyup:
  anEvent();
}
function keyDown(e) {
  var theKey = keyNum(e);

  if (keysIgnore.indexOf(theKey) === -1) {
    bubbleStop();
    if (isFinite(keysCurrent[theKey])) {
      //because there is a 0, I gotta check whether it is null/undefined.
      endUp(keysCurrent[theKey]);
    }
    //simply add the newly pressed key into the WinKeys array.
    keyVars.push(theKey);
    anEvent();
  }
}
function keyRedefine(theKey) {
  // left,up,right,down,A,B,X,Y   you can add more should your game require it.
  var theKey = keyNum(e);
  if (keysIgnore.indexOf(theKey) === -1) {
    bubbleStop();
    //simply add the newly pressed key into the WinKeys array.
    keyVars.push(theKey);
  }
}
function keyUp(e) {
  var theKey = keyNum(e);
  if (keysIgnore.indexOf(theKey) === -1) {
    bubbleStop();
    while (keyVars.indexOf(theKey) != -1) {
      //updates array length while delete() doesn't
      keyVars.splice(keyVars.indexOf(theKey), 1);
    }
    anEvent();
  }
}
function mouseClear() {
  if (mouseVars.clickTimer) {
    window.clearTimeout(mouseVars.clickTimer);
  }
  mouseVars = {
    button: null,
    type: null,
    cursorStyle: null,
    clickTimer: null,
    targetCurrent: null,
    targetStart: null,
    timeStart: null,
    moved: 0,
    xCurrent: null,
    xStart: null,
    yCurrent: null,
    yStart: null
  }
  document.body.style.cursor = 'default';
}
function mouseDown(e) {
  bubbleStop(e);
  var targ = findObject(e);
  mouseVars.button = null == e.which ? e.button : e.which;
  mouseVars.type = 'click';
  mouseVars.clickTimer = window.setTimeout(function() {
    mouseLongClick()
  }, 500);
  mouseVars.targetCurrent = targ;
  mouseVars.targetStart = targ;
  mouseVars.timeStart = new Date();
  mouseVars.xCurrent = e.clientX;
  mouseVars.xStart = e.clientX;
  mouseVars.yCurrent = e.clientY;
  mouseVars.yStart = e.clientY;

  anEvent();
}
function mouseMove(e) {
  bubbleStop(e);
  //are mousenmove events polled more than one frame?
  if (mouseVars.moved) {
    return;
    //only accept an input every frame. - probably won't work though
  }
  mMoved = 1;
  window.requestAnimationFrame(function() {
    mMoved = 0;
  });
  //make sure that only one mouse movement is done per frame to reduce cpu usage.
  var targ = findObject(e);
  //check for onmouseout/onmousein events!
  if (mouseVars.targetCurrent != targ) {
    if (mouseVars.type === 'click') {
      mouseVars.type = 'drag';
      window.clearTimeout(mouseVars.clickTimer);
    }
    mouseMoveEnter(targ);
    mouseMoveOut(targ);
  }
  //now onmouseover - this one is done always.
  mouseMoveOver(targ);
  /*
   * do stuff here if needed?
   *
   * likely all movement/scrolling/panning would be done in the mainloop
   */
  //update the mouse object with the current stuff:
  mouseVars.targetCurrent = targ;
  mouseVars.xCurrent = e.clientX;
  mouseVars.yCurrent = e.clientY;
  if (mouseVars.type === 'vol') {
    volMove();
  } else if (mouseVars.type === 'click') {
        if (((mouseVars.xStart + 10) < e.clientX)
        || ((mouseVars.xStart - 10) > e.clientX)
        || ((mouseVars.yStart + 10) < e.clientY)
        || ((mouseVars.yStart - 10) > e.clientY)
       ) {
      mouseVars.type = 'drag';
      window.clearTimeout(mouseVars.clickTimer);
    }
  }
  //only render is a button is pressed... like if the user is dragging.
  if  (mouseVars.button) {
    anEvent();
  }
}
function mouseMoveEnter(targ) {/*
   * use this for hovering over things.
   * eg. when you enter a new thing, highlight it.
  */
}
function mouseMoveOut(targ) {/*
   * opposite of enter...
   * eg. unhighlight something as the mouse moves off of it.
   *
  */
}
function mouseMoveOver(targ) {/*
   * for actively tracking while on an object.
   * eg. moving, dynamic tooltip.
  */
}
function mouseUp(e) {
  bubbleStop(e);
  //do any mouseup stuff here, eg. flinging or animated panning
  if (mouseVars.type == 'click') {
    if (mouseVars.button = 1) {
      mouseClick();
    } else if (mouseVars.button = 2) {
      mouseLongClick();
    }
  }
  //extra bit for moving the volume, so it's new value can be saved.
  if (mouseVars.type == 'vol') {
    storageSave('vol', globVol.toFixed(2));
    //no point in recording something like 15.00000033
  }
  mouseClear();

  anEvent();
}
function mouseWheel(e) {
  //for zooming in/out, changing speed, etc.
}
function mouseClick() {
  endUp();
}
function mouseLongClick() {//this is also the right-click.
//for right click, and long taps.
}
function touchChange(e) {
  return {
    button: 1,
    target: e.target,
    id: e.identifier,
    clientX: e.clientX,
    clientY: e.clientY,
    preventDefault: function() {},
    stopPropagation: function() {}
  };
  //return a new event object back with only the things I want in it :)
}
function touchDown(e) {
  bubbleStop(e);
  var cTouches = e.changedTouches;
  for (var x = 0; x < cTouches.length; x++) {
    var zID = cTouches[x].identifier;
    touchVars[zID] = touchChange(cTouches[x]);
    //would overwrite existing event if a finger was not deleted - from aen error for example.
    if (touchVars[zID].target) {
      if (zID == 0) {
        //only do the mouse events on the first finger.
        mouseMove(touchVars[zID]);
        //should change the mouse cursor if needed.
        mouseDown(touchVars[zID]);
      }
    }
  }
}
function touchMove(e) {
  bubbleStop(e);
  var cTouches = e.changedTouches;
  for (var x = 0; x < cTouches.length; x++) {
    var zID = cTouches[x].identifier;
    if (zID >= 0) {
      touchVars.splice(zID, 1, touchChange(cTouches[x]));
      // swap in the new touch record
    }
    if (touchVars[zID]) {
      mouseMove(touchVars[zID]);
    }
  }
}
function touchUp(e) {
  bubbleStop(e);
  var cTouches = e.changedTouches;
  //new array for all current events
  for (var x = 0; x < cTouches.length; x++) {
    var zID = cTouches[x].identifier;
    if (zID >= 0) {
      if (touchVars[zID]) {
        mouseMoveOut(touchVars[zID].target);
      } else {
        touchVars[zID].target = document.body;
      }
      mouseUp(touchVars[zID]);
      //should change the mouse cursor if needed.
      delete touchVars[zID];
    }
  }
}
function volDown() {
  mouseVars.targetStart = document.getElementById('vol-Iv');
  mouseVars.type = 'vol';
  volMove();
}
function volMove() {
  //find the percentage of the the slider's left
  var zWidth = mouseVars.targetStart.parentNode.offsetWidth;
  var zLeft = mouseVars.targetStart.parentNode.offsetLeft + document.getElementById('cont').offsetLeft;
  var sliderLeft = mouseVars.xCurrent - zLeft + 2;
  sliderLeft -= (mouseVars.targetStart.offsetWidth / 2);
  var sliderPercent = (sliderLeft / (zWidth - mouseVars.targetStart.offsetWidth)) * 100;
  if (sliderPercent < 0) {
    sliderPercent = 0;
  } else if (sliderPercent > 100) {
    sliderPercent = 100;
  }
  globVol = (sliderPercent / 100);
  document.getElementById('vol%').innerHTML = Math.round(sliderPercent) + '%';
  //recalculate to offset width of the slider iteself
  var zDiff = (zWidth - mouseVars.targetStart.offsetWidth) / zWidth;
  sliderPercent *= zDiff;
  mouseVars.targetStart.style.left = sliderPercent + '%';
}
function volUpdate() {
  var sliderPercent = (globVol * 100);
  document.getElementById('vol%').innerHTML = Math.round(sliderPercent) + '%';
  //recalculate to offset width of the slider iteself
  var zDiff = (document.getElementById('vol-Cv').offsetWidth - document.getElementById('vol-Iv').offsetWidth) / document.getElementById('vol-Cv').offsetWidth;
  sliderPercent *= zDiff;
  document.getElementById('vol-Iv').style.left = sliderPercent + '%';
}
