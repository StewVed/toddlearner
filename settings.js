/*
Add Fullscreen button
Add about ? button
  About Me
  CHANGELOG
Add settings button.
  Volume - or maybe just have a volume slider?!? nah... once the user has changed it, that should be it.

Generally, there is a hanburger on the top-left, though some people
put it on the right. I think Google do the top left, and because
they are so ubiquitus, I will choose to place my settings thing there.

Ideally, I'd like to have a circle icon, that when pressed, smoothly
opens up into a menu from the left.
Click off of the ment, or click the settings icon again to close?

*/

function settingsButton() {
  //zElem.innerHTML += '<button id="set" type="button" class="uButtons uButtonGrey">&#9776;</button>';
  //obviously, because of events being overwritten with the above version
  //it would be much better doing the appendChild version:
  var newElem = document.createElement('div');
  newElem.id = 'sets';
  newElem.classList = 'settB';

  newElem.innerHTML = '&#9776;';
  document.body.appendChild(newElem);
  //can't really an an addEventListener('click',function) here,
  //because of the diffs with touch, mouse, etc inputs.
  //insead I will have to rely on my inputs file having a condition
  //in the click function there (which integrates all pointers).
}

function settingsCreate() {

  var zVol = (globVol*100).toFixed(0);
  //create a semi-opaque rounded rectangle on the top-right, and put the message into it.
  var newElem = document.createElement('div');
  newElem.id = 'settns';
  newElem.classList = 'settW';

  newElem.innerHTML = 
    //close button
    '<div id="setsClose" class="uButtonRed buttonClose">X</div>' +
    //fullscreen toggle button
    '<div id="fs" class="uButtons uButtonGrey fsButton">' + 
      '<span id="fsI" class="fsInner">&#9974;</span> Fullscreen' + 
    '</div>' +
    //volume control
    '<div class="vImg">&#9698;</div>' + '<div id="vol%" style="display:inline-block;left:' + zVol + '%;">' + zVol + '%</div>' + 
    '<div id="vol-Cv" class="sliderCont">&nbsp;' + 
      '<div id="vol-Iv" class="sliderInner">&nbsp;</div>' + //Off ♫ &#128266;
    '</div>';
  document.body.appendChild(newElem);
  //in the CSS, the left is set to -90% and width 90%
  //so now we move it onto the screen from the left.
  newElem.style.left = 0;
}

function settingsClose1() {
  if (document.getElementById('settns')) {
    //move the settings element back offscreen to the left
    document.getElementById('settns').style.left = '-90%';
    //after it has moved offscreen, remove the whole thing.
    window.setTimeout(function(){settingsClose2()},600);
  }
}
function settingsClose2() {
  if (document.getElementById('settns')) {
    document.body.removeChild(document.getElementById('settns'));
  }
}