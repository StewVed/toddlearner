/*
 * Purpose of this file:
 * to give the user a progressbar for each file that is being loaded.
 * it is not smooth, but at the moment, this is the only way I've
 * found to show progress.
*/
var fileList = ['initialize', 'inputs', 'main', 'storage']
  , isLoaded = 0
  , isUpdated = 0
  , isOffline = 0
  , loadingVars = [];
//add service worker registration to the app:
/*serviceworker (mostly) learned from:
  https://w3c.github.io/ServiceWorker/
  https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
  Also simply by looking at the stuff in Chrome's Development tools environment while paused!
*/
if ('serviceWorker' in navigator) {
  //https://w3c.github.io/ServiceWorker/#install
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    //if there is an active serviceWorker, listen for changes in it's state
    if (registration.active) {
      registration.active.addEventListener('statechange', function(e) {
        console.log('active serviceWorker statechange: ' + e.target.state);
        if (e.target.state === 'activated') {
          sw_active_activated('u')
        }
      });
    }

    /*
      if there is a waiting serviceWorker, listen for changes in it's state.
      When the page closes, 
      Upon page reload, the waiting serviceWorker is
      promoted to the active serviceWorker.
    */
    if (registration.waiting) {
      if (registration.active && registration.waiting.state === 'installed') {
        console.log('waiting ServiceWorker installed and still waiting to activate.');
        //inform user that a hard-reload is needed, not just F5
        window.setTimeout(function() {
          upNotOpen('Waiting to update...<br>Please close then re-open app for new version.')
        }, 2000);
      }
    }
    /*
      listen for an update to the serviceworker's file.
      This should fire on the first load of the web page, since
      any serviceWorker file is different to nothing.
      Also should fire if there is any difference in cached 
      and server's serviceWorker file.

      Dispatched when the service worker registration's
      installing worker changes
    */
    registration.addEventListener('updatefound', function() {
      console.log('registration serviceWorker update Found');
      //Listen for changes in the installing serviceWorker's state
      //registration.installing.addEventListener('statechange', swRI);
      registration.installing.addEventListener('statechange', function(e){
        //Assume a serviceWorker keeps it's eventListeners
        //when it goes from the installing, to waiting, then to active one.
        //if not, addEventListener for waiting and active when required.
        //yeah... seems to keep the eventlistener through it all.
        console.log('registration serviceWorker statechange: ' + e.target.state);
        if (e.target.state === 'installed') {
          if (registration.active) {
            console.log('new ServiceWorker installed and waiting to activate.');
            sw_installed()
          }
        }
        else if (e.target.state === 'activated') {
          console.log('new ServiceWorker activated from install');
          sw_active_activated('i')
        }
      })
    });

    console.log('ServiceWorker registered')
  }).catch(function(err) {
    console.log('ServiceWorker registration failed: ', err)
  });
}
/*

function swRA(e) {
  console.log('active ServiceWorker state changed: ' + e.target.state);
  if (e.target.state === 'activated') {
    //app newly updated to new version
    sw_active_activated('a')
  }
}
function swRI(e) {
  console.log('registration.onstatechange: ' + e.target.state);
  if (e.target.state === 'activated') {
    sw_active_activated('i')
  } else if (e.target.state === 'installed') {
    sw_installed()
  } else if (e.target.state === 'redundant') {
    //install failed!
    console.log('Service Worker update failed!!')
  }
}
function swRW(e) {
  console.log('Waiting ServiceWorker state changed: ' + e.target.state)
  if (e.target.state === 'installed') {
    console.log('Waiting ServiceWorker installed and waiting to activate.');
    sw_installed()
  } else if (e.target.state === 'activated') {
    console.log('Waiting ServiceWorker has activated.');
    sw_active_activated('w')
  }
}
*/
function sw_installed() {
  //New serviceWorker's cache has downloaded, and it is waiting to activate
  console.log('Service Worker update downloaded!');
  window.setTimeout(function() {
    upNotOpen('Update downloaded.<br>Please restart app for new version.')
  }, 2000);
}
function sw_active_activated(zType) {
  var heh = '';
  if (zType === 'i') {
    heh = 'You can use this webapp while offline!'
  }
  else if (zType === 'u') {
    heh = 'app Updated.<br>scroll up to see what\'s new.'
    /*
      TODO:
      swipe up for changelog, swipe down or to either side to dismiss.

      with the swipe up, the popup 'toast' element is moved up with the swipe,
      then scrolls more (still with swipe) when it reaches the top.

      swiping down simply reverses it, but add resistance at the bottom
      so the user has to release and re-swipe down/left/right to dismiss.
    */
  }
  console.log('Service Worker ' + zType + ' Active!');
  if (document.getElementById('updateNotice')) {
    //change updateNotice from installed to updated.
    document.getElementById('unp').innerHTML = heh;
  }
  else {
    window.setTimeout(function() {
      upNotOpen(heh)
    }, 2000);
  }

}
function upNotOpen(msg) {
  var newWindow = document.createElement('div');
  newWindow.id = 'updateNotice';
  document.body.appendChild(newWindow);
  newWindow.innerHTML = '<div id="updateClose">X</div><p id="unp">' + msg + '<p/>';
}
function upNotClose() {
  if (document.getElementById('updateNotice')) {
    document.getElementById('updateNotice').style.top = '100%';
    window.setTimeout(function() {
      if (document.getElementById('updateNotice')) {
        //after a second, once the element is hidden, remove it.
        document.body.removeChild(document.getElementById('updateNotice'));
      }
    }, 1000);
  }
}



//now for the file loading portion of the loader file.
//loop through the required files, and load then now.
for (var fileName of fileList) {
  fLoad(fileName + '.js', 'script', fileName, fileName + ' file', '', 0);
}
function fLoad(zSrc, zType, zId, zText, zLoad, WinNo) {
  //remove the dot and any slashes in the name, so that it can be used for the name of the progressbar
  var zFileName = zSrc.replace(/\./, '').replace(/\//, '');
  fLoadProgressBar(zFileName, zText);
  //create a new global variable with the name of the file so that the progress bar moves a little bit even with no response from the server
  loadingVars[zFileName] = [];
  //create an object to keep the time and amount downloaded for dl speed:
  loadingVars[zFileName].text = zText;
  loadingVars[zFileName].time = performance.now();
  //high resolution version of date.now()
  loadingVars[zFileName].tick = performance.now();
  loadingVars[zFileName].size = 0;
  //the amount of data currently downlaoded.
  loadingVars[zFileName].speed = 2;
  //bytes per second (I think)
  loadingVars[zFileName].total = 0;
  loadingVars[zFileName].xhr = 1;
  //the total amount to be downloaded.
  //Create a new request to the server
  if (!isOffline) {
    //quick check to se if it is local: (Dev only) :
    var xhr = new XMLHttpRequest();
    xhr.open('GET', zSrc, true);
    //was false so it blocks until a response is got, but recoded to true with a loading pulser instead.
    //change the responseType to blob in the case of an image - blob=not changed/as-is
    if (zType === 'img') {
      xhr.responseType = 'blob';
    }
    //create an onLoad event for when the server has sent the data through to the browser
    xhr.addEventListener('loadend', function() {
      if (loadingVars[zFileName].xhr) {
        //Create an empty element of the type required (link=css, script=javascript, img=image)
        var zElem = document.createElement(zType);
        //if there is an ID for this script, add it to the new element
        if (zId) {
          zElem.id = zId;
        }
        if (zType === 'img') {
          window.URL.revokeObjectURL(zElem.src);
          //make sure there is no src
          zElem.src = window.URL.createObjectURL(xhr.response);
          //add the downloaded src to the element
        } else {
          zElem.innerHTML = xhr.responseText;
        }
        document.head.appendChild(zElem);
      }
    }, false);
    xhr.addEventListener('error', function() {
      //will happen with files during local development
      loadingVars[zFileName].xhr = 0;
      isOffline = 1;
      fLoadSimple(zSrc.split('.')[0]);
    }, false);
    xhr.addEventListener('progress', function(e) {
      fileProgress(e, zFileName)
    }, false);
    xhr.send();
  } else {
    fLoadSimple(zSrc.split('.')[0]);
  }
  //high resolution version of date.now()
  loadingVars[zFileName].frame = window.requestAnimationFrame(function() {
    fileProgresser(zFileName)
  });
}
function fLoadSimple(fileName) {
  var firstScript = document.getElementsByTagName('script')[0];
  var zScript = document.createElement('script');
  //zScript.type = 'text/javascript'; //needed in modern browsers?!Q?
  zScript.id = fileName + 'l';
  zScript.src = fileName + '.js';
  zScript.addEventListener('load', function() {
    this.id = this.id.slice(0, -1);
    filesLoadedCheck();
  });
  firstScript.parentNode.insertBefore(zScript, firstScript);
}
function fLoadProgressBar(zFileName, zText) {
  if (document.getElementById('loading')) {
    //create new element for the progressbar of this loader
    var pBar = '<div id="' + zFileName + 'C" class="loadC">' + '<div id="' + zFileName + 'Pi" class="loadPi"></div>' + '<div id="' + zFileName + 'Pc" class="loadPc">' + zText + ' (...)</div>' + '</div>';
    //add the progreassBar to the game
    document.getElementById('loading').innerHTML += pBar;
    loaderReHeight();
  }
}
function fileProgress(e, zFileName) {
  if (document.getElementById(zFileName + 'Pi')) {
    if (e.lengthComputable) {
      if (loadingVars[zFileName].sizeUnknown) {
        loadingVars[zFileName].sizeUnknown = 0;
        window.clearInterval(loadingVars[zFileName].endCheckTimer);
        loadingVars[zFileName].endCheckTimer = null;
      }
      document.getElementById(zFileName + 'Pi').classList.remove('loadVV');
      //calculate the amount of time that has passed since last update:
      var timeNow = performance.now();
      //on slower devices, this might change by the end of the function, so make a var of the time.
      var timePassed = timeNow - loadingVars[zFileName].time;
      var amountDownloaded = e.loaded - loadingVars[zFileName].size;
      loadingVars[zFileName].speed = amountDownloaded / timePassed;
      //bytes per millisecond (I think)
      loadingVars[zFileName].time = timeNow;
      //high resolution version of date.now()
      loadingVars[zFileName].size = e.loaded;
      //the amount of data currently downlaoded
      if (!loadingVars[zFileName].total) {
        loadingVars[zFileName].total = e.total;
      }
      var pCent = (e.loaded / e.total) * 100;
      document.getElementById(zFileName + 'Pi').style.width = pCent + '%';
      document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (' + pCent.toFixed(1) + '%)';
    } else {
      /*
        this appears to happen on github, which is reallllly annoying, but let's hack through it :D
        v1 - non-hack; move the inner progress back and forth in knight-rider/cylon/linux style...
        heh thinking about it.. maybe I should make it glowing... but still green!
      */
      //try pure css animation for the job:  
      if (!loadingVars[zFileName].sizeUnknown) {
        loadingVars[zFileName].sizeUnknown = 1;
        loadingVars[zFileName].endCheckTimer = window.setInterval(function() {
          filesLoadedCheck()
        }, 500);
      }
      document.getElementById(zFileName + 'Pi').classList.add('loadVV');
    }
  }
}
function fileProgresser(zFileName) {
  if (document.getElementById(zFileName + 'Pi')) {
    var zNum = parseFloat(document.getElementById(zFileName + 'Pi').style.width || 0);
    if (zNum < 100) {
      if (loadingVars[zFileName].total) {
        /*
         * additional bit to calculate download speed since last fileProgress...
         * All I need is the amount of time that has elapsed, and the amount
         * that has been downloaded during that time, and the total.
        */
        //calculate the amount of time that has passed since last update:
        var timeNow = performance.now();
        //on slower devices, this might change by the end of the function, so make a var of the time.
        var timePassed = timeNow - loadingVars[zFileName].tick;
        var amountToAdd = parseFloat(loadingVars[zFileName].speed * timePassed);
        //300 because that is the amount of the timer Interval
        var percentToAdd = parseFloat((amountToAdd / loadingVars[zFileName].total) * 100);
        var pCent = (zNum + percentToAdd);
        document.getElementById(zFileName + 'Pi').style.width = pCent + '%';
        document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (' + pCent.toFixed(1) + '%)';
      } else {
        document.getElementById(zFileName + 'Pc').innerHTML = loadingVars[zFileName].text + ' (...)';
        document.getElementById(zFileName + 'Pi').classList.add('loadVV');
      }
      loadingVars[zFileName].tick = timeNow;
      //high resolution version of date.now()
      loadingVars[zFileName].frame = window.requestAnimationFrame(function() {
        fileProgresser(zFileName)
      });
    } else {
      //window.clearInterval(window[zFileName + 'Timer']);
      document.getElementById(zFileName + 'C').style.transition = '1s';
      document.getElementById(zFileName + 'C').style.opacity = 0;
      window.setTimeout(function() {
        if (document.getElementById(zFileName + 'C')) {
          document.getElementById(zFileName + 'C').parentNode.removeChild(document.getElementById(zFileName + 'C'));
          loaderReHeight();
        }
        filesLoadedCheck();
      }, 1000);
    }
  }
}
function filesLoadedCheck() {
  //if all essential data is loaded, initialize. Once only
  if (document.getElementById('loading')) {
    //check for the scripts:
    for (var fileName of fileList) {
      if (!document.getElementById(fileName)) {
        //Not all scripts have finished (down)loading, so do not start yet.
        return;
      }
    }
    //getting this far means everything is loaded. continue...
    //make sure to only run this once :D
    if (!isLoaded) {
      isLoaded = 1;
      document.getElementById('loading').parentNode.removeChild(document.getElementById('loading'));
      Init();
    }
  }
}
function loaderReHeight() {
  document.getElementById('loading').style.top = ((window.innerHeight - document.getElementById('loading').offsetHeight) / 2) + 'px';
}
