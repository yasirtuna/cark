# FIFA Takım Çarkı

FC / FIFA oyunları için takım seçimini şansa bırakan modern bir web uygulaması.

## Özellikler

- **Takım Çarkı**: 10 lig + milli takımlardan oluşan havuzdan rastgele takım seçimi.
- **Lig filtresi**: Hangi liglerin çarkta yer alacağını seç (Tümünü Seç / Tümünü Temizle).
- **Takım bazlı seçim**: İstenmeyen takımları devre dışı bırak.
- **Tur sistemi**: "Seçilen takımı sonraki turlardan çıkar" ile her tur yeni takım seç; **Çarkı Sıfırla** ile hepsi havuza döner.
- **Seçim geçmişi**: Son seçimler listelenir, temizlenebilir.
- **Kalıcılık**: Ayarlar, filtreler ve geçmiş LocalStorage'da saklanır.

## Veriler

Takım listeleri `src/data/leagues/` altında `createLeague` yardımcısıyla merkezi olarak tutulur
(2026/27 sezonu). Yeni lig takımı eklemek için ilgili dosyadaki diziye isim eklemen yeterli;
ID'ler ve referanslar otomatik üretilir. Milli takımlar `nationalTeams.ts` içinde ayrı kategoridir.

## Geliştirme

```bash
npm install
npm run dev       # geliştirme sunucusu
npm test          # vitest
npm run lint      # oxlint
npm run build     # tsc + vite build
```

## Mimari

```
src/
  types/       # Team, League, HistoryEntry vb.
  data/        # merkezi lig/takım verileri + sorgu yardımcıları
  lib/         # çark matematiği (wheelMath), storage
  store/       # React Context + reducer (state yönetimi)
  components/  # Wheel, LeagueFilter, Settings, SpinHistory, SpinResult ...
  styles/      # tema ve bileşen CSS
```

Çark animasyonu canvas ile çizilir; önce rastgele takım seçilir, ardından
`wheelMath.computeTargetRotation` ile çark matematiksel olarak o takımın üzerinde durur
(animasyon sonucu ile seçim sonucu her zaman aynıdır).