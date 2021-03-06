/*
Generally, there is a hanburger on the top-left, though some people
put it on the right. I think Google do the top left, and because
they are so ubiquitus, I will choose to place my settings thing there.
*/

function settingsButton() {
  var newElem = document.createElement('div');
  newElem.id = 'sets';
  newElem.classList = 'settB';
  newElem.innerHTML = '&#9776;';
  document.body.appendChild(newElem);
}

function settingsCreate() {
  //create a semi-opaque rounded rectangle on the top-right, and put the message into it.
  var newElem = document.createElement('div');
  newElem.id = 'settns';
  newElem.classList = 'settW';

  newElem.innerHTML =
    //close button
    '<div id="setsClose" class="buttonClose">X</div>' +
    //fullscreen toggle button
    '<div id="fs" class="uButtons uButtonGreen">' +
      '<span id="fsI" class="fsInner">&#9974;</span> Fullscreen' +
    '</div>' +
    '<br>' +
    //volume control
    /*
      add mute/unmute toggler to the volume control
      &#128266; &#x1F50A; - speaker with sound waves
      &#128263; &#x1F507; - speaker with diagonal line through (muted)
    */
    '<div id="muteToggle" class="uButtons uButtonGreen" style="font-size:1em;">&#128266;</div>' +

    '<div id="vol-Cv" class="volCont">&nbsp;' +
    '<div id="vol-Iv" class="volInner">' +
        '<div id="vol-T" class="vImg">&#9698;</div>' +
      '</div>' + //Off ♫ &#128266;
    '</div>' +
    '<div id="bAbout" class="uButtons uButtonGrey">About</div>' +
    '<div id="bChange" class="uButtons uButtonGrey">ChengeLog</div>' +
    '<br>' +
    '<hr id="hrSizer">' + //Now for the Support buttons:
    '<p class="B pZW">Tips & Support:</p>' + //Patreon Button-link to my site
    '<a class=\'ubLink\' href=\'https://www.patreon.com/stewved\' target=\'_blank\'><img class="imgSocs ubLink" ' + imgSocs + 'Patreon.png\');cursor:pointer;margin:auto;display:block;width:100%;height:44px;"' + imgDummy + '></a>' + '<hr style=width:80%;">' + //PayPal Donate Button
    '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">' + '<input type="hidden" name="cmd" value="_s-xclick">' + '<input type="hidden" name="hosted_button_id" value="RJMCJX2TE8E4Y">' + //'<input type="image" style="height:47px;margin:4px auto;display:block;" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online.">' +
      '<input type="image" class="imgSocs ubLink" ' + imgSocs + 'PaypalDonate.png\');height:47px;width:100%;margin:4px auto;display:block;" ' + imgDummy + ' name="submit" alt="PayPal – The safer, easier way to pay online.">' + //'<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">' +
    '</form>'
    ;
  document.body.appendChild(newElem);
  //check whether muted or not.
  swapToggler('muteToggle');
  //set volume slider
  volUpdate();
  //add X to the settings pane
  closeButtonRight('setsClose');
  //in the CSS, the left is set to -90% and width 90%
  //so now we move it onto the screen from the left.

}

function settingsOpen() {
  //move the settings pane into view
  document.getElementById('settns').style.left = 0;
  //hide the hamburger menu icon.
  document.getElementById('sets').style.opacity = 0;
}

function settingsClose() {
  if (document.getElementById('settns')) {
    //move the settings element back offscreen to the left
    document.getElementById('settns').style.left = '-100%';
    window.setTimeout(function(){document.getElementById('sets').style.opacity = 1;},600);
  }
}