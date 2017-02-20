/*
Add Fullscreen button
Add about ? button
  About Me
  CHANGELOG
Add settings button.
  Volume - or maybe just have a volume slider?!? nah... once the user has changed it, that should be it.

Generally, there is a hanburger on the top-left, though some people
put it on the right. I think Google do the top left, and because
they are so massive, I will choose to place my settings thing there.

Ideally, I'd like to have a circle icon, that when pressed, smoothly
opens up into a menu from the left.
Click off of the ment, or click the settings icon again to close?

*/

function settingsButton(zElem) {
  zElem.innerHTML += '<button id="set" type="button" class="uButtons uButtonGrey">&#9776;</button>';
  //obviously, because of events being overwritten with the above version
  //it would be much better doing the appendChild version:

}

function settingsSideBar() {
  var zVol = (globVol*100).toFixed(0);
  //create a semi-opaque rounded rectangle on the top-right, and put the message into it.
  var newElem = document.createElement('div');
  newElem.id = 'settns';
  newElem.classList = 'noty';

  newElem.innerHTML = 
    '<div id="setClose" class="uButtonRed buttonClose">X</div>' +
    '<div class="vImg">&#9698;</div>' + '<div id="vol%" style="display:inline-block;left:' + zVol + '%;">' + zVol + '%</div>' + 
    '<div id="vol-Cv" class="sliderCont">&nbsp;' + 
      '<div id="vol-Iv" class="sliderInner">&nbsp;</div>' + //Off ♫ &#128266;
  '</div>';
  document.body.appendChild(newElem);
  //next, place the menu.
  //center the notify popup
  newElem.style.width = Math.round((document.body.offsetWidth - newElem.offsetWidth) / 2) + 'px';
  newElem.style.opacity = .98;
}
