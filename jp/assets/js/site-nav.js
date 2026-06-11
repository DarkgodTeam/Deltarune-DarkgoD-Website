(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname;
    var lang = 'en';
    if (path.indexOf('/ru/') !== -1) lang = 'ru';
    else if (path.indexOf('/jp/') !== -1) lang = 'ja';

    // Show button on newsletter subpages and interview pages
    var isNewsletterSub = /\/newsletters\/[^/]+\//.test(path);
    var isInterview = /\/interviews\/[^/]+\//.test(path);

    if (isNewsletterSub || isInterview) {
      var labels = { en: 'BACK TO ARCHIVE', ja: 'アーカイブに戻る', ru: 'ВЕРНУТЬСЯ К АРХИВУ' };
      var btn = document.createElement('a');
      btn.textContent = labels[lang] || labels.en;

      if (isNewsletterSub) {
        btn.href = path.replace(/\/newsletters\/[^/]+\/.*$/, '/newsletters/index.html');
      } else {
        btn.href = path.replace(/\/interviews\/[^/]+\/.*$/, '/newsletters/index.html');
      }

      var isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        // Mobile: small button at bottom-right corner, out of the way
        btn.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:998;background:#000;color:#F9FF10;border:2px solid #F9FF10;padding:8px 12px;font-family:"8bitOperatorPlus-Bold",monospace;font-size:11px;text-decoration:none;letter-spacing:0.5px;opacity:0.9;border-radius:4px;';
      } else {
        // Desktop: vertical button on left side
        var transform = lang === 'ja' ? 'translateY(-50%)' : 'translateY(-50%) rotate(180deg)';
        btn.style.cssText = 'position:fixed;top:50%;left:0;transform:' + transform + ';writing-mode:vertical-rl;z-index:999;background:#000;color:#F9FF10;border:2px solid #F9FF10;padding:12px 6px;font-family:"8bitOperatorPlus-Bold",monospace;font-size:12px;text-decoration:none;letter-spacing:1px;opacity:0.85;transition:opacity .15s;';
        btn.addEventListener('mouseenter', function() { btn.style.opacity = '1'; });
        btn.addEventListener('mouseleave', function() { btn.style.opacity = '0.85'; });
      }
      document.body.appendChild(btn);
    }
  });
})();
