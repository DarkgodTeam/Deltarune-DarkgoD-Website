(function() {
  // === Lightbox с галереей, стрелками и миниатюрами ===
  var s = document.createElement('style');
  s.textContent = [
    '.lb-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:999999;overflow:hidden;opacity:0;transition:opacity .3s ease}',
    '.lb-ov.open{display:flex;flex-direction:column;align-items:center;justify-content:center}',
    '.lb-ov.visible{opacity:1}',
    '.lb-img-wrap{position:relative;flex:1;display:flex;align-items:center;justify-content:center;width:100%;overflow:hidden}',
    '.lb-img-wrap img{max-width:90%;max-height:80vh;object-fit:contain;transition:transform .3s ease,opacity .2s ease;cursor:zoom-in;user-select:none;-webkit-user-drag:none}',
    '.lb-img-wrap img.zoomed{max-width:none;max-height:none;cursor:zoom-out}',
    '.lb-x{position:fixed;top:12px;right:20px;font-size:40px;color:#fff;cursor:pointer;z-index:1000001;opacity:.7;font-family:sans-serif;line-height:1;transition:opacity .15s}',
    '.lb-x:hover{opacity:1}',
    '.lb-arr{position:absolute;top:50%;transform:translateY(-50%);font-size:48px;color:#fff;cursor:pointer;opacity:.6;transition:opacity .15s;z-index:1000000;user-select:none;padding:20px;font-family:sans-serif}',
    '.lb-arr:hover{opacity:1}',
    '.lb-arr.lb-left{left:8px}',
    '.lb-arr.lb-right{right:8px}',
    '.lb-thumbs{display:flex;gap:6px;padding:10px;justify-content:center;align-items:center;overflow-x:auto;max-width:100%;flex-shrink:0}',
    '.lb-thumbs img{width:60px;height:45px;object-fit:cover;cursor:pointer;opacity:.5;transition:opacity .15s,border-color .15s;border:2px solid transparent;border-radius:3px}',
    '.lb-thumbs img:hover{opacity:.8}',
    '.lb-thumbs img.active{opacity:1;border-color:#4fc3f7}',
    '.lb-counter{position:fixed;top:14px;left:20px;color:#888;font-size:14px;font-family:sans-serif;z-index:1000001}'
  ].join('');
  document.head.appendChild(s);

  // Создаём элементы
  var ov = document.createElement('div');
  ov.className = 'lb-ov';
  ov.innerHTML = '<span class="lb-x">&times;</span>'
    + '<span class="lb-counter"></span>'
    + '<div class="lb-img-wrap"><span class="lb-arr lb-left">&#8249;</span><img src="" draggable="false"><span class="lb-arr lb-right">&#8250;</span></div>'
    + '<div class="lb-thumbs"></div>';
  document.body.appendChild(ov);

  var img = ov.querySelector('.lb-img-wrap img');
  var thumbsContainer = ov.querySelector('.lb-thumbs');
  var counter = ov.querySelector('.lb-counter');
  var images = [];
  var currentIndex = 0;
  var zoomed = false;
  var scale = 1, tx = 0, ty = 0;

  function collectImages(clickedSrc) {
    images = [];
    // Находим кликнутую картинку в DOM
    var clickedEl = null;
    document.querySelectorAll('img').forEach(function(i) {
      if (i.src === clickedSrc && !clickedEl) clickedEl = i;
    });
    if (!clickedEl) { images = [clickedSrc]; return; }

    // Если картинка в .img-row — собираем только картинки из этого row
    var row = clickedEl.closest('.img-row');
    if (row) {
      row.querySelectorAll('img').forEach(function(i) { images.push(i.src); });
    } else {
      // Одиночная картинка — только она
      images = [clickedSrc];
    }
  }

  function buildThumbs() {
    thumbsContainer.innerHTML = '';
    if (images.length <= 1) return;
    images.forEach(function(src, i) {
      var t = document.createElement('img');
      t.src = src;
      t.className = i === currentIndex ? 'active' : '';
      t.onclick = function() { goTo(i); };
      thumbsContainer.appendChild(t);
    });
  }

  function updateCounter() {
    counter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function applyZoom() {
    if (zoomed) {
      img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
      img.classList.add('zoomed');
    } else {
      img.style.transform = '';
      img.classList.remove('zoomed');
    }
  }

  function resetZoom() {
    zoomed = false; scale = 1; tx = 0; ty = 0;
    applyZoom();
  }

  function goTo(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;
    img.style.opacity = '0';
    setTimeout(function() {
      img.src = images[currentIndex];
      resetZoom();
      img.style.opacity = '1';
    }, 150);
    updateCounter();
    // Update thumb highlight
    thumbsContainer.querySelectorAll('img').forEach(function(t, i) {
      t.className = i === currentIndex ? 'active' : '';
    });
    // Scroll active thumb into view
    var active = thumbsContainer.querySelector('.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function open(src) {
    collectImages(src);
    currentIndex = images.indexOf(src);
    if (currentIndex === -1) { images.push(src); currentIndex = images.length - 1; }
    img.src = src;
    resetZoom();
    buildThumbs();
    updateCounter();
    // Скрыть стрелки/миниатюры/счётчик если одна картинка
    var single = images.length <= 1;
    ov.querySelector('.lb-left').style.display = single ? 'none' : '';
    ov.querySelector('.lb-right').style.display = single ? 'none' : '';
    thumbsContainer.style.display = single ? 'none' : '';
    counter.style.display = single ? 'none' : '';
    ov.classList.add('open');
    requestAnimationFrame(function() { ov.classList.add('visible'); });
  }

  function close() {
    ov.classList.remove('visible');
    setTimeout(function() {
      ov.classList.remove('open');
      img.src = '';
      resetZoom();
    }, 300);
  }

  // Events
  ov.querySelector('.lb-x').onclick = close;
  ov.querySelector('.lb-left').onclick = function(e) { e.stopPropagation(); goTo(currentIndex - 1); };
  ov.querySelector('.lb-right').onclick = function(e) { e.stopPropagation(); goTo(currentIndex + 1); };

  // Click overlay background = close
  ov.addEventListener('click', function(e) {
    if (e.target === ov || e.target.classList.contains('lb-img-wrap')) close();
  });

  // Click image = zoom to 1:1 or reset
  img.addEventListener('click', function(e) {
    e.stopPropagation();
    if (zoomed) {
      // Уже приближено — вернуть
      resetZoom();
    } else {
      // Проверяем: если картинка уже показана в полном размере (1:1), не зумить
      var rect = img.getBoundingClientRect();
      if (rect.width >= img.naturalWidth * 0.95) {
        // Картинка и так в натуральном размере — зум не нужен
        return;
      }
      // Зумим до 1:1 (натуральный размер)
      zoomed = true;
      scale = img.naturalWidth / rect.width;
      // Сдвигаем к точке клика
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      tx = (cx - e.clientX) * (scale - 1);
      ty = (cy - e.clientY) * (scale - 1);
      applyZoom();
    }
  });

  // Pan when zoomed (mouse drag)
  var panning = false, panStartX, panStartY, panTxStart, panTyStart;
  img.addEventListener('mousedown', function(e) {
    if (!zoomed) return;
    e.preventDefault();
    panning = true;
    panStartX = e.clientX; panStartY = e.clientY;
    panTxStart = tx; panTyStart = ty;
    img.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', function(e) {
    if (!panning) return;
    tx = panTxStart + (e.clientX - panStartX);
    ty = panTyStart + (e.clientY - panStartY);
    applyZoom();
  });
  document.addEventListener('mouseup', function() {
    if (panning) { panning = false; img.style.cursor = zoomed ? 'zoom-out' : 'zoom-in'; }
  });

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (!ov.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    else if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  // Click any page image to open
  document.addEventListener('click', function(e) {
    if (ov.classList.contains('open')) return;
    var t = e.target;
    if (t.tagName !== 'IMG') return;
    if (t.closest('.lb-ov') || t.closest('#regions') || t.closest('nav')) return;
    if (t.closest('#ed-text-panel') || t.closest('#ed-media-panel') || t.closest('#ed-inspector')) return;
    if (t.closest('.dog-player')) return;
    if (t.naturalWidth < 50) return;
    // Если картинка внутри ссылки — проверяем куда ведёт
    var link = t.closest('a');
    if (link) {
      var href = link.getAttribute('href') || '';
      // Если ссылка на HTML/страницу — не перехватываем, пусть работает как ссылка
      if (href.match(/\.html?(\?.*)?$/i) || href.startsWith('/') && !href.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i)) return;
      // Если ссылка на картинку — открываем картинку по ссылке в лайтбоксе
      if (href.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i)) {
        e.preventDefault();
        open(link.href);
        return;
      }
      // Прочие ссылки — не трогаем
      return;
    }
    e.preventDefault();
    open(t.src);
  });
})();
