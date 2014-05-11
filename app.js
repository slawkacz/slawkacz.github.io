window.onload = function () {
  navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia;

  var connectionWrapper = document.querySelector('.connection-wrapper'),
    connectionForm = connectionWrapper.querySelector('.connection-form'),
    callWrapper = document.querySelector('.call-wrapper'),
    callForm = callWrapper.querySelector('.call-form'),
    videoWrapper = document.querySelector('.video-wrapper'),
    answerBtn = videoWrapper.querySelector('.answer'),
    mandatory = {
      audio: true,
      video: true
    };

  connectionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = connectionForm.querySelector('.username').value;
    if (username !== '') {
      var peer = new Peer(username.replace(/\s/g, '_'), {key: 'k7vpr9xlmbc323xr'});
      peer.on('open', function () {
        connectionWrapper.hidden = true;
        callWrapper.hidden = false;
        callForm.addEventListener('submit', call, false);
        function call(e) {
          e.preventDefault();
          var peerId = callForm.querySelector('.call-to').value;
          navigator.getUserMedia(mandatory,
            function (MediaStream) {
              var call = peer.call(peerId, MediaStream);
              setVideo(call);
            }, function (error) {
              console.log('error', error)
            });
        }

        function setVideo(call) {
          call.on('stream', function (stream) {
            videoWrapper.hidden = false;
            callForm.hidden = true;
            videoWrapper.querySelector('video').src = URL.createObjectURL(stream);
          });
        }

        function answer(call) {
          answerBtn.hidden = true;
          setVideo(call);
          navigator.getUserMedia(mandatory,
            function (MediaStream) {
              call.answer(MediaStream);

            }, function (error) {
              console.log('error', error)
            });
        }

        peer.on('call', function (call) {
          videoWrapper.hidden = false;
          callWrapper.hidden = true;
          answerBtn.hidden = false;
          answerBtn.onclick = function (e) {
            e.preventDefault();
            answer(call);
          };
        });
      });

    }
  }, false);
};