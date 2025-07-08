# Emission Web Map

Aplikasi web untuk menampilkan data emisi Indonesia dengan peta interaktif.

## Perubahan Terbaru

### Halaman Maps - Layout Baru

Halaman maps telah diubah dari metode swipe/compare menjadi **satu peta dengan fitur checklist** untuk menampilkan data emisi.

#### Fitur Baru:

1. **Satu Peta Utama**: Menggunakan Mapbox GL JS dengan tampilan tunggal
2. **Sidebar dengan Checklist**: 
   - Emission 2018
   - Emission 2019  
   - Emission 2021
   - Emission 2023
3. **Batas Administrasi**: Otomatis ditampilkan sebagai layer dasar
4. **Legenda Dinamis**: Menampilkan informasi berdasarkan data yang dipilih
5. **Popup Informasi**: Klik pada area untuk melihat detail data

#### Struktur File yang Diubah:

- `maps.html` - Layout baru dengan sidebar checklist
- `scripts/maps.js` - Logika peta tunggal dengan toggle layer
- `css/maps.css` - Styling untuk layout baru

#### Cara Penggunaan:

1. Buka halaman maps
2. Peta akan menampilkan batas administrasi secara otomatis
3. Gunakan checklist di sidebar untuk menampilkan/menyembunyikan data emisi
4. Klik pada area di peta untuk melihat detail data
5. Legenda akan menampilkan informasi berdasarkan data yang aktif

#### Data Sources:

- **Batas Administrasi**: `data/admin/batas_area.zip`
- **Emission 2018**: `data/emisi/E18/E18.geojson`
- **Emission 2019**: `data/emisi/E19/E19.geojson`
- **Emission 2021**: `data/emisi/E21/E21.geojson`
- **Emission 2023**: `data/emisi/E23/E23.geojson`

## Menjalankan Aplikasi

1. Pastikan semua file data tersedia di folder `data/`
2. Jalankan server lokal:
   ```bash
   python -m http.server 8000
   ```
3. Buka browser dan akses `http://localhost:8000`

## Teknologi yang Digunakan

- **Mapbox GL JS**: Untuk rendering peta interaktif
- **Leaflet**: Untuk komponen tambahan (shp.js)
- **HTML5/CSS3**: Untuk layout dan styling
- **JavaScript**: Untuk logika aplikasi

## Struktur Folder

```
/
├── index.html          # Halaman utama
├── maps.html           # Halaman peta (sudah diubah)
├── restoration.html    # Halaman restoration
├── css/
│   ├── home.css        # Styling halaman utama
│   └── maps.css        # Styling halaman peta (sudah diubah)
├── scripts/
│   └── maps.js         # Logika peta (sudah diubah)
└── data/               # Folder data (pastikan tersedia)
    ├── admin/
    │   └── batas_area.zip
    └── emisi/
        ├── E18/
        ├── E19/
        ├── E21/
        └── E23/
``` 