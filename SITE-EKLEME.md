# Sürek Şelalesi 3B Modelini Web Sitene Ekleme

## Hazır dosyalar (bu klasör: `web-embed/`)
| Dosya | Açıklama |
|---|---|
| `index.html` | Görüntüleyici (Düşük/Orta/Yüksek kalite seçicili) |
| `low.glb` | Düşük kalite — 150K üçgen, 1024px doku (~2.3 MB) |
| `medium.glb` | Orta kalite — 600K üçgen, 2048px doku (~7.4 MB) |
| `high.glb` | Yüksek kalite — 2M üçgen, 4096px doku (~22.8 MB) |

Bu **4 dosya birlikte** durmalı (index.html, glb'leri yanındaki göreli yoldan yükler).

---

## Yöntem 1 — iframe ile göm (EN KOLAY, her platformda çalışır)

1. Bu 4 dosyayı sitenin sunucusuna bir klasöre yükle (örn. `/3d/`).
2. Sayfana şu satırı ekle:

```html
<iframe src="/3d/index.html"
        style="width:100%; height:600px; border:0; border-radius:12px;"
        allowfullscreen loading="lazy"></iframe>
```

`src` yolunu, dosyaları yüklediğin klasöre göre ayarla.

---

## Yöntem 2 — Ücretsiz public link (siten dosya yüklemeye izin vermiyorsa)

`web-embed` klasörünü olduğu gibi **Netlify / Cloudflare Pages / Vercel**'e sürükle-bırak →
sana `https://...` public bir adres verir → onu Yöntem 1'deki iframe'de kullan.

---

## Notlar
- `three.js` kütüphanesi internetten (unpkg CDN) yüklenir → ziyaretçinin internet bağlantısı gerekir.
- **Yerel testte** Python web sunucusu büyük dosyaları veremedi (Python 3.14 hatası); **gerçek web sunucularında bu sorun YOKTUR.** Yerel önizleme için `node scripts/serve.js web-embed 8095` kullanıldı.
- Farklı kalite/boyut istersen: `scripts/quality_levels.py` içindeki `LEVELS` listesini düzenleyip yeniden üret.
