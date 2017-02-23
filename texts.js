var zAll = '<span class="B'
  , zNew = zAll + ' Bl">New Stuff: </span>'
  , zImp = zAll + ' Gr">Improvement: </span>'
  , zBug = zAll + ' Re">Bug-Fix: </span>'
  , zDev = zAll + ' Or">Development: </span>'

var appCL =
  '<p class="B C">23rd February 2017</p> ' +
  '<ul><li>' + zImp + 'More colors shown on the volume control.' +
  '</li><li>' + zImp + 'More accurate <q>toast</q> popup animation.' +
  '</li><li>' + zImp + '<q>Toast</q> popup can now be scrolled with a mouse scroll-wheel. Could only drag up/down before.' +
  '</li><li>' + zNew + 'About and ChangeLog buttons added to Settings.' +
  '</li><li>' + zDev + 'Added F12 to key ignore list for easy opening of development tools.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">22nd February 2017</p> ' +
  '<ul><li>' + zNew + 'Settings <q>hamburger</q> which slides a settings window from the left.' +
  '</li><li>' + zImp + 'Colorized the volume control.' +
  '</li><li>' + zImp + 'asking permission to save preferences now comes up in the <q>toast</q> popup from the bottom.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">13th February 2017</p> ' +
  '<ul><li>' + zNew + 'Spoken words added. (ogg format)' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">25th January 2017</p> ' +
  '<ul><li>' + zBug + 'Sometimes could not press an object (typo).' +
  '</li><li>' + zDev + 'comment out <q>toast</q> popup test.' +
  '</li><li>' + zImp + 'Put some color in to this change log.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">24th January 2017</p> ' +
  '<ul><li>' + zNew + 'Swipe-up changelog added under <q>toast</q> popup on update.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">21st January 2017</p> ' +
  '<ul><li>' + zImp + 'Better notifications on updates.' +
  '</li></ul>' +
  '<hr>' +
  '<p class="B C">19th January 2017</p> ' +
  '<ul><li>' + zDev + 'more work on the ServiceWorker.' +
  '</li></ul>' +
  '<hr>';


var appBugs =
  '<h1 style=text-align:center;margin-bottom:0;font-size:1.25em>StewVed\'s standard notice:</h1>' +
  '<p style=text-align:center;color:red;margin-top:0;line-height:1.5em;>' +
    'Warning: May contain Bugs!<br>' +
    'Cannot guarantee Bug free!<br>' +
    'Produced on a system where Buggy products are also made!' +
  '</p>';

var appAbout =
  '<img alt="The Author" src=images/StewVed.jpg style=float:left;' +
  'border-radius:0.7em;width:33%;margin-top:0.8em;margin-right:.1em;margin-bottom:.1em;>' +
  '<p>' +
    'Stewart Robinson (StewVed) was born in the United Kingdom, in the' +
    ' late 1970\'s.' +
  '</p>' +
  '<p>' +
    'He learned just about everything he knows about HTML/CSS/JavaScript' +
    ' programming from <a class=ubLink href=http://www.w3schools.com target=_blank>W3Schools</a>' +
  '</p>' +
  '<p>' +
    'He is a PC Gamer at heart, and though he generally games on Windows,' +
    ' he also uses GNU/Linux based Operating systems.' +
  '</p>' +
  '<br style=clear:both>' +
  '<hr>' + appBugs;
