(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {

    // Convert <a href="...mp4"> with <img> inside into inline <video>
    document.querySelectorAll('a[href$=".mp4"]').forEach(function(link) {
      var img = link.querySelector('img');
      if (!img) return;

      var src = link.getAttribute('href');
      var poster = img.getAttribute('src') || '';

      var video = document.createElement('video');
      video.setAttribute('controls', '');
      video.setAttribute('preload', 'metadata');
      video.setAttribute('playsinline', '');
      if (poster) video.setAttribute('poster', poster);
      video.style.display = 'block';
      video.style.width = '100%';
      video.style.maxWidth = '640px';
      video.style.margin = '0 auto 30px';
      video.style.background = '#000';

      var source = document.createElement('source');
      source.setAttribute('src', src);
      source.setAttribute('type', 'video/mp4');
      video.appendChild(source);

      link.parentNode.replaceChild(video, link);
    });

    // Convert <a href="...mp3"> with <img> inside into clickable image + hidden audio player
    document.querySelectorAll('a[href$=".mp3"]').forEach(function(link) {
      var src = link.getAttribute('href');
      var img = link.querySelector('img');

      if (img) {
        var wrapper = document.createElement('div');
        wrapper.style.display = 'block';
        wrapper.style.margin = '0 auto 30px';
        wrapper.style.maxWidth = '640px';
        wrapper.style.textAlign = 'center';

        var imgEl = img.cloneNode(true);
        imgEl.style.display = 'block';
        imgEl.style.width = '100%';
        imgEl.style.cursor = 'pointer';
        imgEl.style.marginBottom = '0';
        wrapper.appendChild(imgEl);

        var audio = document.createElement('audio');
        audio.setAttribute('preload', 'metadata');
        audio.style.width = '100%';
        audio.style.maxWidth = '640px';
        audio.style.display = 'none';
        audio.style.marginTop = '8px';

        var source = document.createElement('source');
        source.setAttribute('src', src);
        source.setAttribute('type', 'audio/mpeg');
        audio.appendChild(source);
        wrapper.appendChild(audio);

        imgEl.addEventListener('click', function() {
          if (audio.style.display === 'none') {
            audio.style.display = 'block';
            audio.setAttribute('controls', '');
            audio.play();
          } else if (audio.paused) {
            audio.play();
          } else {
            audio.pause();
          }
        });

        link.parentNode.replaceChild(wrapper, link);
      } else {
        var audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.setAttribute('preload', 'metadata');
        audio.style.display = 'block';
        audio.style.width = '100%';
        audio.style.maxWidth = '400px';
        audio.style.margin = '10px auto 20px';

        var source = document.createElement('source');
        source.setAttribute('src', src);
        source.setAttribute('type', 'audio/mpeg');
        audio.appendChild(source);

        var container = link.closest('p') || link.closest('td') || link.parentNode;
        container.parentNode.insertBefore(audio, container.nextSibling);
      }
    });

  });
})();
