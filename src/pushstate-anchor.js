(function() {
  // Extend the <a> tag with history.pushState()
  //
  // <a is="pushstate-anchor" href="/path" [title="New Page Title"] [state="{'message':'New State!'}"]>title</a>

  var HTMLPushStateAnchorElement = Object.create(HTMLAnchorElement.prototype);

  function pushStateAnchorEventListener(event) {
    var href = this.getAttribute('href');
    // open in new tab or cross-origin requests
    if (event.ctrlKey || event.metaKey || event.which === 2 || href.startsWith("http") && window.location.host !== new URL(href).host) {
      return;
    }

    // push state into the history stack
    window.history.pushState(JSON.parse(this.getAttribute('state')), this.getAttribute('title'), href);

    // dispatch a popstate event
    try {
      var popstateEvent = new PopStateEvent('popstate', {
        bubbles: false,
        cancelable: false,
        state: window.history.state
      });

      if ('dispatchEvent_' in window) {
        // FireFox with polyfill
        window.dispatchEvent_(popstateEvent);
      } else {
        // normal
        window.dispatchEvent(popstateEvent);
      }
    } catch(error) {
      // Internet Explorer
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('popstate', false, false, { state: window.history.state });
      window.dispatchEvent(evt);
    }

    // prevent the default link click
    event.preventDefault();
  }

  HTMLPushStateAnchorElement.createdCallback = function() {
    this.addEventListener('click', pushStateAnchorEventListener, false);
  };

  HTMLPushStateAnchorElement.detachedCallback = function() {
    this.removeEventListener('click', pushStateAnchorEventListener, false);
  };

  document.registerElement('pushstate-anchor', {
    prototype: HTMLPushStateAnchorElement,
    extends: 'a'
  });
})();
