/* Elle bakımlı viewer'lara (Sürek kök index.html, Stadyum) i18n'i ELLE data-i18n
 * eklemeden bağlar: mevcut id/attribute/metinlerden çeviri anahtarlarını otomatik atar.
 * i18n.js'ten SONRA yüklenir. Statik UI (sekme, kalite, araçlar, künye, lejant) iki dilli olur.
 * (Dinamik JS durum/okuma metinleri bu sayfalarda elle yazıldığından TR kalır.)
 */
function _viewerI18nAuto() {
  function setI(el, key) { if (el && key) el.setAttribute('data-i18n', key); }
  // Kalite
  var q = { 'low.glb': 'q.low', 'medium.glb': 'q.medium', 'high.glb': 'q.high', 'ultra.glb': 'q.ultra' };
  document.querySelectorAll('.q').forEach(function (b) {
    var k = q[b.dataset.url]; if (!k) return;
    if (b.classList.contains('ultra') && /⚡/.test(b.textContent)) k = 'q.ultra2';
    setI(b, k);
  });
  // Sekmeler
  var tab = { model: 'tab.model', ortho: 'tab.ortho', dem2d: 'tab.dem2d', compare: 'tab.compare' };
  document.querySelectorAll('.tab').forEach(function (b) { setI(b, tab[b.dataset.view]); });
  // Araçlar (metin + başlık)
  var tool = { 't-measure': 'tool.measure', 't-vol': 'tool.vol', 't-area': 'tool.area', 't-elev': 'tool.elev',
    't-profile': 'tool.profile', 't-clear': 'tool.clear', 't-wire': 'tool.wire', 't-rotate': 'tool.rotate',
    't-tour': 'tool.tour', 't-sun': 'tool.sun', 't-shot': 'tool.shot', 't-share': 'tool.share',
    't-ar': 'tool.ar', 't-kunye': 'tool.info' };
  Object.keys(tool).forEach(function (id) {
    var b = document.getElementById(id); if (!b) return;
    b.setAttribute('data-i18n', tool[id]); b.setAttribute('data-i18n-title', tool[id] + '.t');
  });
  // DEM katman butonları
  var dem = { 'dem_relief.jpg': 'dem.relief', 'slope.jpg': 'dem.slope', 'aspect.jpg': 'dem.aspect', 'contour.jpg': 'dem.contour' };
  document.querySelectorAll('.dl').forEach(function (b) { setI(b, dem[b.dataset.img]); });
  // Portföy linki
  document.querySelectorAll('.homelink').forEach(function (a) { setI(a, 'nav.portfolio'); });
  // Künye satır etiketleri (metin eşleştirme)
  var lab = { 'Konum': 'info.location', 'Koordinat sistemi': 'info.crs', 'Kapsanan alan': 'info.area',
    'Yükseklik aralığı': 'info.elevrange', 'Rölyef (fark)': 'info.relief', 'Çözünürlük (GSD)': 'info.gsd',
    'Kamera': 'info.camera', 'Model türü': 'info.modeltype', 'Üçgen sayısı': 'info.tris', 'Kaynak': 'info.source',
    'Çekim tarihi': 'info.date', 'Fotoğraf sayısı': 'info.photos', 'Lisans': 'info.license' };
  document.querySelectorAll('#kunye .row span:first-child').forEach(function (s) {
    setI(s, lab[s.textContent.trim()]);
  });
  // "Künye" başlığı + "Bu nedir?" + atıf butonları (metin eşleştirme)
  var txt = { 'Bu nedir?': 'info.whatis', '⧉ BibTeX kopyala': 'cite.bib', '⧉ RIS kopyala': 'cite.ris' };
  document.querySelectorAll('#kunye b, #kunye button').forEach(function (e) { setI(e, txt[e.textContent.trim()]); });
  // DEM lejant başlıkları + yön etiketleri
  var leg = { 'Yükseklik (m)': 'leg.elev', 'Eğim (°)': 'leg.slope', 'Bakı (yön)': 'leg.aspect', 'Eşyükselti': 'leg.contour',
    'K — Kuzey': 'dir.N', 'KD — Kuzeydoğu': 'dir.NE', 'D — Doğu': 'dir.E', 'GD — Güneydoğu': 'dir.SE',
    'G — Güney': 'dir.S', 'GB — Güneybatı': 'dir.SW', 'B — Batı': 'dir.W', 'KB — Kuzeybatı': 'dir.NW', 'Düz alan': 'dir.flat' };
  document.querySelectorAll('#dem-legend .lt, #dem-legend .slopecls div').forEach(function (e) {
    var t = (e.childNodes.length && e.lastChild.nodeType === 3) ? e.lastChild.textContent.trim() : e.textContent.trim();
    var k = leg[e.textContent.trim()] || leg[t]; if (k) e.setAttribute('data-i18n', k);
  });
  // Yeni atanan data-i18n'leri uygula
  if (window.setLang && window.getLang) window.setLang(window.getLang());
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _viewerI18nAuto); else _viewerI18nAuto();

