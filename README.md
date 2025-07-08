# ECOTRACK

WebGIS interaktif untuk menampilkan data tutupan lahan dan memantau restorasi di PT XYZ.


### Halaman Maps

Halaman maps telah diubah dari metode swipe/compare menjadi **satu peta dengan fitur checklist** untuk menampilkan data tutupan lahan

#### Fitur Baru:

1. **Satu Peta Utama**: Menggunakan Mapbox GL JS dengan tampilan tunggal
2. **Sidebar dengan Checklist**: 
   - Landcover 2018
   - Landcover 2019  
   - Landcover 2021
   - Landcover 2023
3. **Batas Administrasi**: Otomatis ditampilkan sebagai layer dasar
4. **Legenda Dinamis**: Menampilkan informasi berdasarkan data yang dipilih


#### Struktur File yang Diubah:

- `maps.html` - Layout baru dengan sidebar checklist
- `scripts/maps.js` - Logika peta tunggal dengan toggle layer
- `css/maps.css` - Styling untuk layout baru

#### Cara Penggunaan:

1. Buka halaman maps
2. Peta akan menampilkan batas administrasi secara otomatis
3. Gunakan checklist di sidebar untuk menampilkan/menyembunyikan data tutupan lahan
4. Legenda akan menampilkan informasi berdasarkan data yang aktif

### Halaman Dashboard

Halaman dashboard dibuat dengan memasukkan embed code dari dashboard yang disusun melalui Power BI

#### Cara Penggunaan:

1. Buka halaman dashboard
2. Klik data yang ingin ditampilkan
3. Filter data sesuai dengan lokasi atau jenis informasi yang ingin ditampilkan
4. Klik reset untuk menghapus filter
5. Klik logo untuk kembali ke halaman utama dashboard

## Menjalankan Aplikasi

1. Pastikan semua file data tersedia di folder `data/`
2. Jalankan server lokal:
   ```bash
   python -m http.server 8000
   ```
3. Buka browser dan akses `http://localhost:8000`

## Teknologi yang Digunakan

- **Mapbox GL JS**: Untuk rendering peta interaktif
- **HTML5/CSS3**: Untuk layout dan styling
- **JavaScript**: Untuk logika aplikasi

## Struktur Folder

```
/
├── index.html               # Halaman utama
├── maps.html                # Halaman peta tutupan lahan
├── restoration.html         # Halaman pemantauan restorasi
├── css/
│   ├── home.css             # Styling halaman utama
│   └── maps.css             # Styling halaman peta interaktif
├── scripts/
│   └── maps.js              # Logika Layer Control dan pemanggilan GeoJSON
└── data/
    └── LC/                 # Folder Tutupan Lahan
        ├── 2018/
        ├── 2019/
        ├── 2021/
        └── 2023/

