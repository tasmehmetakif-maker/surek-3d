/* Basit istemci-tarafı TR/EN dil katmanı (build gerektirmez).
 * - Statik metinler: HTML'de data-i18n="anahtar" (textContent), data-i18n-title (title attr),
 *   data-i18n-ph (placeholder), data-i18n-aria (aria-label).
 * - Dinamik JS metinleri: window.T('anahtar', {..}) ile çevrilir.
 * - Dil sırası: ?lang=en  ->  localStorage('lang')  ->  varsayılan 'tr'.
 * - Üstte TR/EN düğmesi #lang-switch içine basılır; yoksa sağ-üste sabitlenir.
 * - Sözlük tek kaynaktır (TR ve EN birlikte) -> diller birbirinden sapmaz.
 */
(function () {
  const DICT = {
    // ---- Sekmeler / üst ----
    'tab.model': ['3B Model', '3D Model'],
    'tab.ortho': ['Ortofoto', 'Orthophoto'],
    'tab.dem2d': ['DEM (2B)', 'DEM (2D)'],
    'tab.compare': ['⇋ Karşılaştır', '⇋ Compare'],
    'nav.portfolio': ['🏛 Portföy', '🏛 Portfolio'],
    // ---- Kalite ----
    'q.label': ['Model kalitesi', 'Model quality'],
    'q.low': ['Düşük', 'Low'],
    'q.medium': ['Orta', 'Medium'],
    'q.high': ['Yüksek', 'High'],
    'q.ultra': ['En Yüksek', 'Highest'],
    'q.low.t': ['Düşük detay — en hızlı açılır, zayıf cihazlar için', 'Low detail — opens fastest, for weak devices'],
    'q.medium.t': ['Dengeli detay/hız (önerilen)', 'Balanced detail/speed (recommended)'],
    'q.high.t': ['Yüksek detay — güçlü bilgisayar ister', 'High detail — needs a powerful computer'],
    'q.ultra.t': ['Tam (10M üçgen) detay — en yavaş, en güçlü cihaz', 'Full (10M triangles) detail — slowest, most powerful device'],
    'q.ultra2': ['En Yüksek ⚡', 'Highest ⚡'],
    'warn.perf': ['⚠️ "Yüksek" ve "En Yüksek" güçlü bir bilgisayar ister. Model açılmazsa veya takılırsa daha düşük bir kalite seçin.',
                  '⚠️ "High" and "Highest" need a powerful computer. If the model fails to open or stutters, choose a lower quality.'],
    'hint.controls': ['Sürükle: döndür · Sağ tık: kaydır · Tekerlek: yakınlaş',
                      'Drag: rotate · Right-click: pan · Wheel: zoom'],
    // ---- Araç grupları + yardım ----
    'grp.measure': ['Ölçüm', 'Measure'],
    'grp.view': ['Görünüm', 'View'],
    'grp.share': ['Paylaşım & Bilgi', 'Share & Info'],
    'tool.help': ['❔ Yardım', '❔ Help'],
    'tool.help.t': ['Tüm araçların ne işe yaradığı ve nasıl kullanılacağı', 'What every tool does and how to use it'],
    'help.title': ['Araçlar — Ne işe yarar, nasıl kullanılır', 'Tools — what they do, how to use them'],
    'help.intro': ['Her araç bir kez açılır/kapanır. Ölçüm araçları için modele tıklayarak nokta seç.', 'Each tool toggles on/off. For measurement tools, click the model to place points.'],
    // ---- Araç butonları (metin + başlık) ----
    'tool.measure': ['📏 Mesafe', '📏 Distance'],
    'tool.measure.t': ['İki noktaya tıkla: mesafe ve yükseklik farkı', 'Click two points: distance and height difference'],
    'tool.vol': ['📦 Hacim', '📦 Volume'],
    'tool.vol.t': ['Alanı çevrele: taban (seçilen noktaların en alçağı) üstü hacim (m³)', 'Enclose an area: volume above the base (lowest selected point) in m³'],
    'tool.area': ['📐 Alan', '📐 Area'],
    'tool.area.t': ['Alanı çevrele: düzlemsel + gerçek 3B yüzey alanı (m²)', 'Enclose an area: planar + true 3D surface area (m²)'],
    'tool.elev': ['📍 Rakım', '📍 Elevation'],
    'tool.elev.t': ['Bir noktaya tıkla: o noktanın rakımı (m)', 'Click a point: its elevation (m)'],
    'tool.profile': ['📈 Profil', '📈 Profile'],
    'tool.profile.t': ['İki nokta seç: aradaki topografik yükseklik profili', 'Pick two points: topographic elevation profile between them'],
    'tool.clear': ['🗑 Temizle', '🗑 Clear'],
    'tool.clear.t': ['Tüm ölçüm/işaretleri temizle', 'Clear all measurements/markers'],
    'tool.wire': ['△ Üçgenler', '△ Wireframe'],
    'tool.wire.t': ['Modeli üçgen ağ (wireframe) olarak göster', 'Show the model as a triangle mesh (wireframe)'],
    'tool.rotate': ['🔄 Döndür', '🔄 Spin'],
    'tool.rotate.t': ['Otomatik döndür (sunum)', 'Auto-rotate (presentation)'],
    'tool.tour': ['🎬 Tur', '🎬 Tour'],
    'tool.tour.t': ['Sinematik 360° tur çek ve video (.webm) olarak indir', 'Record a cinematic 360° tour and download it as video (.webm)'],
    'tool.sun': ['☀️ Güneş', '☀️ Sun'],
    'tool.sun.t': ['Güneş/gölge: tarih-saate göre gerçek güneş konumu ve gölgeler', 'Sun/shadow: real sun position and shadows by date and time'],
    'tool.shot': ['📷 Görüntü', '📷 Snapshot'],
    'tool.shot.t': ['Ekran görüntüsünü PNG indir', 'Download the view as a PNG image'],
    'tool.share': ['🔗 Bağlantı', '🔗 Link'],
    'tool.share.t': ['Bu kamera görünümünün bağlantısını kopyala', 'Copy a link to this camera view'],
    'tool.ar': ['📱 AR', '📱 AR'],
    'tool.ar.t': ['Mobil cihazda artırılmış gerçeklik (AR) ile gör', 'View in augmented reality (AR) on a mobile device'],
    'tool.info': ['ℹ️ Künye', 'ℹ️ Info'],
    'tool.info.t': ['Künye / teknik bilgi', 'Credits / technical info'],
    // ---- Profil paneli ----
    'profile.title': ['📈 Yükseklik Profili', '📈 Elevation Profile'],
    'profile.csv.t': ['Profili CSV indir', 'Download profile as CSV'],
    'common.close.t': ['Kapat', 'Close'],
    'profile.len': ['Uzunluk:', 'Length:'],
    'profile.elevrange': ['Rakım:', 'Elevation:'],
    'profile.delta': ['Δ:', 'Δ:'],
    // ---- Künye paneli ----
    'info.title': ['Künye', 'Credits'],
    'info.whatis': ['Bu nedir?', 'What is this?'],
    'info.location': ['Konum', 'Location'],
    'info.crs': ['Koordinat sistemi', 'Coordinate system'],
    'info.area': ['Kapsanan alan', 'Covered area'],
    'info.elevrange': ['Yükseklik aralığı', 'Elevation range'],
    'info.relief': ['Rölyef (fark)', 'Relief (range)'],
    'info.gsd': ['Çözünürlük (GSD)', 'Resolution (GSD)'],
    'info.camera': ['Kamera', 'Camera'],
    'info.modeltype': ['Model türü', 'Model type'],
    'info.modeltype.v': ['Dokulu 3B mesh', 'Textured 3D mesh'],
    'info.tris': ['Üçgen sayısı', 'Triangle count'],
    'info.source': ['Kaynak', 'Source'],
    'info.date': ['Çekim tarihi', 'Capture date'],
    'info.photos': ['Fotoğraf sayısı', 'Photo count'],
    'info.license': ['Lisans', 'License'],
    'cite.bib': ['⧉ BibTeX kopyala', '⧉ Copy BibTeX'],
    'cite.ris': ['⧉ RIS kopyala', '⧉ Copy RIS'],
    'cite.copied': ['✓ kopyalandı', '✓ copied'],
    // ---- DEM katman + lejant ----
    'dem.relief': ['Renkli DEM', 'Color DEM'],
    'dem.slope': ['Eğim', 'Slope'],
    'dem.aspect': ['Bakı', 'Aspect'],
    'dem.contour': ['Eşyükselti', 'Contours'],
    'leg.elev': ['Yükseklik (m)', 'Elevation (m)'],
    'leg.contour': ['Eşyükselti', 'Contours'],
    'leg.contour.major': ['Ana çizgi', 'Index line'],
    'leg.contour.minor': ['Ara çizgi', 'Intermediate'],
    'leg.slope': ['Eğim (°)', 'Slope (°)'],
    'leg.aspect': ['Bakı (yön)', 'Aspect (direction)'],
    'dir.flat': ['Düz alan', 'Flat'],
    'dir.N': ['K — Kuzey', 'N — North'], 'dir.NE': ['KD — Kuzeydoğu', 'NE — Northeast'],
    'dir.E': ['D — Doğu', 'E — East'], 'dir.SE': ['GD — Güneydoğu', 'SE — Southeast'],
    'dir.S': ['G — Güney', 'S — South'], 'dir.SW': ['GB — Güneybatı', 'SW — Southwest'],
    'dir.W': ['B — Batı', 'W — West'], 'dir.NW': ['KB — Kuzeybatı', 'NW — Northwest'],
    // ---- AR overlay ----
    'ar.hint': ['📱 AR (artırılmış gerçeklik) yalnız destekleyen telefon/tabletlerde çalışır. Masaüstünde 3B önizleme gösterilir.',
                '📱 AR (augmented reality) works only on supported phones/tablets. On desktop a 3D preview is shown.'],
    // ---- Güneş paneli ----
    'sun.title': ['☀️ Güneş / Gölge', '☀️ Sun / Shadow'],
    'sun.date': ['Tarih', 'Date'],
    'sun.time': ['Saat', 'Time'],
    'sun.note': ['Gölgeler, modelin konumundan (enlem/boylam) ve seçilen tarih-saatten hesaplanan gerçek güneş açısıyla çizilir.',
                 'Shadows are drawn from the real sun angle computed from the model location (lat/lon) and the selected date-time.'],
    // ---- Karşılaştır ----
    'cmp.ortho': ['📷 Ortofoto', '📷 Orthophoto'],
    'cmp.hint': ['Bölücüyü sürükle: solda ortofoto, sağda seçilen DEM katmanı',
                 'Drag the divider: orthophoto on the left, selected DEM layer on the right'],
    // ---- Dinamik durum / okumalar (T() ile) ----
    'st.prefix': ['Durum: ', 'Status: '],
    'hud.tris': ['üçgen', 'triangles'],
    'st.fallback': ['"En Yüksek" yükleniyor…', 'Loading "Highest"…'],
    'st.init': ['başlatılıyor…', 'starting…'],
    'st.loadingq': ['yükleniyor… ({u})', 'loading… ({u})'],
    'st.loadingpct': ['yükleniyor… %{p}', 'loading… {p}%'],
    'st.loaded': ['✓ {u} yüklendi', '✓ {u} loaded'],
    'st.fail': ['✗ "{u}" açılamadı — daha DÜŞÜK kalite seçin', '✗ Could not open "{u}" — choose a LOWER quality'],
    'st.ctxlost': ['✗ Cihaz bu kaliteyi kaldıramadı — daha DÜŞÜK kalite seçin', '✗ Your device can’t handle this quality — choose a LOWER one'],
    'st.bvh': ['ölçüm dizini hazırlanıyor… (büyük modelde birkaç saniye)', 'preparing measurement index… (a few seconds on big models)'],
    'st.bvhok': ['✓ ölçüm hazır', '✓ measurement ready'],
    'st.bvhfail': ['✗ ölçüm dizini kurulamadı — araçlar yavaş çalışabilir', '✗ measurement index failed — tools may be slow'],
    'm.pick2': ['İki noktaya tıkla — örn. zeminin iki ucu', 'Click two points — e.g. two ends of the ground'],
    'm.dist3d': ['3B mesafe', '3D distance'],
    'm.vert': ['Düşey (yükseklik)', 'Vertical (height)'],
    'm.horiz': ['Yatay', 'Horizontal'],
    'el.pick': ['Bir noktaya tıkla — o noktanın rakımı görünür', 'Click a point — its elevation is shown'],
    'el.elev': ['📍 Rakım: ', '📍 Elevation: '],
    'el.relh': ['📍 Bağıl yükseklik: ', '📍 Relative height: '],
    'pr.pick2': ['İki nokta seç — aradaki yükseklik profili çıkar', 'Pick two points — the elevation profile between them is drawn'],
    'vol.prompt': ['Hacim — alanı çevrele: yüzeye tıkla ({n}/3+ nokta)', 'Volume — enclose an area: click the surface ({n}/3+ points)'],
    'vol.calc': ['Hacmi hesapla', 'Compute volume'],
    'vol.calcing': ['hesaplanıyor…', 'computing…'],
    'vol.vol': ['Hacim: ', 'Volume: '],
    'vol.area': ['  ·  Alan: ', '  ·  Area: '],
    'vol.maxh': ['  ·  Maks yük.: ', '  ·  Max height: '],
    'common.clearbtn': ['Temizle', 'Clear'],
    'common.points': ['nokta', 'points'],
    'ar.prompt': ['Alan — yüzeyi çevrele: yüzeye tıkla ({n}/3+ nokta)', 'Area — enclose the surface: click it ({n}/3+ points)'],
    'ar.calc': ['Alanı hesapla', 'Compute area'],
    'ar.planar': ['Düzlemsel: ', 'Planar: '],
    'ar.surf': ['  ·  Yüzey (3B): ', '  ·  Surface (3D): '],
    'ar.rough': ['  ·  Pürüzlülük: ', '  ·  Roughness: '],
    'tour.rec': ['🎬 sinematik tur kaydı… %{p}', '🎬 recording cinematic tour… {p}%'],
    'tour.run': ['🎬 sinematik tur… %{p}', '🎬 cinematic tour… {p}%'],
    'tour.saved': ['✓ tur videosu indirildi (.webm)', '✓ tour video downloaded (.webm)'],
    'tour.done': ['✓ tur tamamlandı', '✓ tour finished'],
    'sun.below': ['🌙 Güneş ufkun altında — gölge yok', '🌙 Sun below the horizon — no shadows'],
    'sun.info': ['Güneş yüksekliği: {el}° · Azimut: {az}° ({d})', 'Sun altitude: {el}° · Azimuth: {az}° ({d})'],
  };

  function pickLang() {
    const u = new URLSearchParams(location.search).get('lang');
    if (u === 'en' || u === 'tr') { try { localStorage.setItem('lang', u); } catch (e) {} return u; }
    try { const s = localStorage.getItem('lang'); if (s === 'en' || s === 'tr') return s; } catch (e) {}
    return 'tr';
  }
  let lang = pickLang();
  const idx = () => (lang === 'en' ? 1 : 0);
  function tr(key, vars) {
    const e = DICT[key]; let s = e ? (e[idx()] ?? e[0]) : key;
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }
  window.T = tr;
  window.getLang = () => lang;

  function applyStatic(root) {
    const r = root || document;
    r.querySelectorAll('[data-i18n]').forEach(el => { const v = DICT[el.getAttribute('data-i18n')]; if (v) el.textContent = v[idx()] ?? v[0]; });
    r.querySelectorAll('[data-i18n-title]').forEach(el => { const v = DICT[el.getAttribute('data-i18n-title')]; if (v) el.title = v[idx()] ?? v[0]; });
    r.querySelectorAll('[data-i18n-ph]').forEach(el => { const v = DICT[el.getAttribute('data-i18n-ph')]; if (v) el.placeholder = v[idx()] ?? v[0]; });
    r.querySelectorAll('[data-i18n-aria]').forEach(el => { const v = DICT[el.getAttribute('data-i18n-aria')]; if (v) el.setAttribute('aria-label', v[idx()] ?? v[0]); });
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function buildSwitch() {
    let host = document.getElementById('lang-switch');
    if (!host) { host = document.createElement('div'); host.id = 'lang-switch'; host.style.cssText = 'position:fixed;top:8px;right:10px;z-index:9999'; document.body.appendChild(host); }
    clear(host);
    host.style.display = 'inline-flex'; host.style.borderRadius = '8px'; host.style.overflow = 'hidden'; host.style.border = '1px solid rgba(255,255,255,.18)';
    ['tr', 'en'].forEach(L => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = L.toUpperCase();
      b.style.cssText = 'background:' + (L === lang ? '#2f6df0' : 'rgba(30,35,44,.85)') + ';color:' + (L === lang ? '#fff' : '#9aa3af') + ';border:0;padding:5px 11px;font-size:12.5px;font-weight:600;cursor:pointer';
      b.onclick = () => setLang(L);
      host.appendChild(b);
    });
  }

  function setLang(L) {
    if (L !== 'tr' && L !== 'en') return;
    lang = L; try { localStorage.setItem('lang', L); } catch (e) {}
    document.documentElement.lang = L;
    const url = new URL(location.href); url.searchParams.set('lang', L); history.replaceState(null, '', url);
    applyStatic(); buildSwitch();
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: L } }));
  }
  window.setLang = setLang;

  function init() { document.documentElement.lang = lang; applyStatic(); buildSwitch(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
