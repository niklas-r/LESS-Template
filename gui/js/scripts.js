(function ($, window, undefined) {
  "use strict"; 

  // jRespond is in charge or delivering the appropriate
  // scripts depending on the screen size

  // call jRespond and add breakpoints
  /*global jRespond*/
  var jRes = jRespond([
    {
      label: 'phone',
      enter: 0,
      exit: 480
    },
    {
      label: 'tablet',
      enter: 768,
      exit: 979
    },
    {
      label: 'desktop',
      enter: 980,
      exit: 10000
    }
  ]);

  // register enter and exit functions for a single or multiple breakpoints
  // namespace events in order to easily unbind them when necessary
  jRes.addFunc({
    breakpoint: 'phone',
    enter: function () {
      // Something
    },
    exit: function () {
      // Do possible clean up
    }
  });
  jRes.addFunc({
    breakpoint: 'tablet',
    enter: function () {
      // Something
    },
    exit: function () {
      // Do possible clean up
    }
  });
  jRes.addFunc({
    breakpoint: 'desktop',
    enter: function () {
      // Something
    },
    exit: function () {
      // Do possible clean up
    }
  });
  jRes.addFunc({
    breakpoint: '*',
    enter: function () {
      // Something
    },
    exit: function () {
      // Do possible clean up
    }
  });
})(jQuery, window);
