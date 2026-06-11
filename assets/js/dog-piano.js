// Dog piano animation — plays when audio is playing, notes float up
(function(){
  var noteStyle = document.createElement('style');
  noteStyle.textContent = '@keyframes float-note{0%{offset-distance:0%;opacity:1}100%{offset-distance:100%;opacity:0}}.dog-note{position:absolute;width:18px;height:18px;image-rendering:pixelated;animation:float-note .8s cubic-bezier(.8,0,1,1.2) forwards;pointer-events:none}';
  document.head.appendChild(noteStyle);

  // Resolve note image path relative to page
  var scripts = document.querySelectorAll('script[src*="dog-piano"]');
  var basePath = '';
  if(scripts.length) {
    var src = scripts[scripts.length-1].getAttribute('src');
    basePath = src.replace(/js\/dog-piano\.js$/, 'images/note-small.png');
  }

  document.querySelectorAll('.dog-player').forEach(function(player) {
    var wrapper = player.querySelector('div[style*="inline-block"]') || player;
    wrapper.style.position = 'relative';

    // Find audio after dog-player (may be separated by <p> etc)
    var audio = null;
    var searchFrom = player.parentElement && player.parentElement.tagName !== 'MAIN' && player.parentElement.tagName !== 'ARTICLE' ? player.parentElement : player;
    var sibling = searchFrom.nextElementSibling;
    while(sibling) {
      if(sibling.tagName === 'AUDIO') { audio = sibling; break; }
      if(sibling.classList && sibling.classList.contains('dog-audio')) { audio = sibling; break; }
      if(sibling.querySelector) {
        var inner = sibling.querySelector('audio');
        if(inner) { audio = inner; break; }
      }
      sibling = sibling.nextElementSibling;
    }
    if(!audio) return;

    var idle = player.querySelector('.dog-idle');
    var frame1 = player.querySelector('.dog-play1');
    var frame2 = player.querySelector('.dog-play2');
    if(!idle || !frame1 || !frame2) return;

    var animInterval = null;
    var noteInterval = null;
    var currentFrame = 1;

    function spawnNote() {
      var note = document.createElement('img');
      note.src = basePath;
      note.className = 'dog-note';
      var startX = Math.floor(Math.random() * 40) + 60;
      var startY = Math.floor(Math.random() * 10) - 5;
      var curveX = Math.floor(Math.random() * 30) - 15;
      var endY = -(Math.floor(Math.random() * 30) + 40);
      note.style.top = startY + 'px';
      note.style.left = startX + 'px';
      note.style.offsetPath = "path('M 0 0 C " + curveX + " " + Math.floor(endY/3) + " " + (curveX*2) + " " + endY + " " + curveX + " " + (endY-15) + "')";
      wrapper.appendChild(note);
      setTimeout(function(){ if(note.parentNode) note.remove(); }, 900);
    }

    function startAnim() {
      idle.style.display = 'none';
      frame1.style.display = 'inline-block';
      frame2.style.display = 'none';
      currentFrame = 1;
      if(animInterval) clearInterval(animInterval);
      animInterval = setInterval(function(){
        if(currentFrame === 1) { frame1.style.display='none'; frame2.style.display='inline-block'; currentFrame=2; }
        else { frame2.style.display='none'; frame1.style.display='inline-block'; currentFrame=1; }
      }, 350);
      if(noteInterval) clearInterval(noteInterval);
      spawnNote();
      noteInterval = setInterval(spawnNote, 700);
    }

    function stopAnim() {
      if(animInterval) { clearInterval(animInterval); animInterval = null; }
      if(noteInterval) { clearInterval(noteInterval); noteInterval = null; }
      frame1.style.display = 'none';
      frame2.style.display = 'none';
      idle.style.display = 'inline-block';
    }

    audio.addEventListener('play', startAnim);
    audio.addEventListener('pause', stopAnim);
    audio.addEventListener('ended', stopAnim);
  });
})();
