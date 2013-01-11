// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*!
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];

    div.className = 'fit-vids-style';
    div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>';

    ref.parentNode.insertBefore(div,ref);

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='www.youtube.com']",
        "iframe[src*='www.youtube-nocookie.com']",
        "iframe[src*='www.kickstarter.com']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
})( jQuery );

/*
 * jRespond.js (a simple way to globally manage javascript on responsive websites)
 * version 0.8.3
 * (c) 2012 Jeremy Fields [jeremy.fields@viget.com]
 * released under the MIT license
 */
(function(win,doc,undefined) {

    'use strict';

    win.jRespond = function(breakpoints) {

        // array for registered functions
        var mediaListeners = [];

        // array that corresponds to mediaListeners and holds the current on/off state
        var mediaInit = [];

        // array of media query breakpoints; adjust as needed
        var mediaBreakpoints = breakpoints;

        // store the current breakpoint
        var curr = '';

        // window resize event timer stuff
        var resizeTimer;
        var resizeW = 0;
        var resizeTmrFast = 100;
        var resizeTmrSlow = 500;
        var resizeTmrSpd = resizeTmrSlow;

        // cross browser window width
        var winWidth = function() {

            var w = 0;

            // IE
            if (!window.innerWidth) {

                if (!(document.documentElement.clientWidth === 0)) {

                    // strict mode
                    w = document.documentElement.clientWidth;
                } else {

                    // quirks mode
                    w = document.body.clientWidth;
                }
            } else {

                // w3c
                w = window.innerWidth;
            }

            return w;
        };

        // send media to the mediaListeners array
        var addFunction = function(elm) {

            var brkpt = elm['breakpoint'];
            var entr = elm['enter'] || undefined;

            // add function to stack
            mediaListeners.push(elm);

            // add corresponding entry to mediaInit
            mediaInit.push(false);

            if (testForCurr(brkpt)) {
                if (entr !== undefined) {
                    entr.call();
                }
                mediaInit[(mediaListeners.length - 1)] = true;
            }
        };

        // loops through all registered functions and determines what should be fired
        var cycleThrough = function() {
            
            var enterArray = [];
            var exitArray = [];

            for (var i = 0; i < mediaListeners.length; i++) {
                var brkpt = mediaListeners[i]['breakpoint'];
                var entr = mediaListeners[i]['enter'] || undefined;
                var exit = mediaListeners[i]['exit'] || undefined;

                if (brkpt === '*') {
                    if (entr !== undefined) {
                        enterArray.push(entr);
                    }
                    if (exit !== undefined) {
                        exitArray.push(exit);
                    }
                } else if (testForCurr(brkpt)) {
                    if (entr !== undefined && !mediaInit[i]) {
                        enterArray.push(entr);
                    }
                    mediaInit[i] = true;
                } else {
                    if (exit !== undefined && mediaInit[i]) {
                        exitArray.push(exit);
                    }
                    mediaInit[i] = false;
                }
            }

            // loop through exit functions to call
            for (var j = 0; j < exitArray.length; j++) {
                exitArray[j].call();
            }

            // then loop through enter functions to call
            for (var k = 0; k < enterArray.length; k++) {
                enterArray[k].call();
            }
        };

        // checks for the correct breakpoint against the mediaBreakpoints list
        var returnBreakpoint = function(width) {

            var foundBrkpt = false;

            // look for existing breakpoint based on width
            for (var i = 0; i < mediaBreakpoints.length; i++) {

                // if registered breakpoint found, break out of loop
                if (width >= mediaBreakpoints[i]['enter'] && width <= mediaBreakpoints[i]['exit']) {
                    foundBrkpt = true;

                    break;
                }
            }

            // if breakpoint is found and it's not the current one
            if (foundBrkpt && curr !== mediaBreakpoints[i]['label']) {
                curr = mediaBreakpoints[i]['label'];

                // run the loop
                cycleThrough();

            // or if no breakpoint applies
            } else if (!foundBrkpt && curr !== '') {
                curr = '';

                // run the loop
                cycleThrough();
            }

        };

        // takes the breakpoint/s arguement from an object and tests it against the current state
        var testForCurr = function(elm) {

            // if there's an array of breakpoints
            if (typeof elm === 'object') {
                if (elm.join().indexOf(curr) >= 0) {
                    return true;
                }

            // if the string is '*' then run at every breakpoint
            } else if (elm === '*') {
                return true;

            // or if it's a single breakpoint
            } else if (typeof elm === 'string') {
                if (curr === elm) {
                    return true;
                }
            }
        };

        // self-calling function that checks the browser width and delegates if it detects a change
        var checkResize = function() {

            // get current width
            var w = winWidth();

            // if there is a change speed up the timer and fire the returnBreakpoint function
            if (w !== resizeW) {
                resizeTmrSpd = resizeTmrFast;

                returnBreakpoint(w);

            // otherwise keep on keepin' on
            } else {
                resizeTmrSpd = resizeTmrSlow;
            }

            resizeW = w;

            // calls itself on a setTimeout
            setTimeout(checkResize, resizeTmrSpd);
        };
        checkResize();

        // return
        return {
            addFunc: function(elm) { addFunction(elm); },
            getBreakpoint: function() { return curr; }
        };

    };

}(this,this.document));