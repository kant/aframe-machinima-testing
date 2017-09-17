/* global test */
module.exports = {
  setup: function (sceneFile) {
    const body = document.querySelector('body');
    if (!window.__html__[sceneFile]) {
      console.console.error('File ' + sceneFile + ' not found by html2js' +
          'loader. Check karma.conf.js settings for files and preprocessors');
    }
    body.innerHTML = window.__html__[sceneFile] + body.innerHTML;
  },
  test: function (description, recordingFile, preReplay, postReplay, only) {
    var mach = this;
    var postCallback;
    var testFunc = function (done) {
      if (typeof preReplay === 'function') { preReplay.call(this); }
      if (typeof postReplay === 'function') {
        postCallback = function () {
          postReplay.call(this);
          done();
        };
      } else {
        // postCallback = function () { done(); };
        postCallback = done;
      }
      mach.testEnd(postCallback.bind(this));
      mach.testStart(this, recordingFile);
    };
    if (only) {
      test.only(description, testFunc);
    } else {
      test(description, testFunc);
    }
  },
  testStart: function (testContext, recordingFile) {
    testContext.timeout(0);
    document.querySelector('a-scene')
        .setAttribute('avatar-replayer', 'src:' + recordingFile);
  },
  testEnd: function (callback) {
    function callbackWrapper (e) {
      var replayer = document.querySelector('a-scene') &&
          document.querySelector('a-scene').components &&
          document.querySelector('a-scene').components['avatar-replayer'];
      if (callback) { callback(e); }
      // replayer needs a little help cleaning up neatly
      if (replayer) { replayer.isReplaying = false; }
    }
    document.querySelector('a-scene')
        .addEventListener('replayingstopped', callbackWrapper, { once: true });
        // set event callback with 'once' flag due to multiple event emmisions
  }
};