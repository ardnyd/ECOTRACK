// =================================================================
// VARIABEL GLOBAL
// =================================================================
let map = null;
let currentLCLayers = {};
let isAdminBoundaryLoaded = false;
let currentShapefileLayer = null;

// State untuk pilihan tahun LC
// let selectedLCYears = {
//     'year1_LC': false,
//     'year2_LC': false,
//     'year3_LC': false,
//     'year4_LC': false
// };

// State untuk pilihan land cover 2018 per area
let selectedLC2018Areas = {
    jambi: false,
    kalbar: false,
    kaltim: false,
    muba: false,
    oki: false,
    riau: false
};

// State untuk pilihan land cover 2019 per area
let selectedLC2019Areas = {
    jambi: false,
    kalbar: false,
    kaltim: false,
    muba: false,
    oki: false,
    riau: false
};

// State untuk pilihan land cover 2019 per area
let selectedLC2021Areas = {
    jambi: false,
    kalbar: false,
    kaltim: false,
    muba: false,
    oki: false,
    riau: false
};

// State untuk pilihan land cover 2019 per area
let selectedLC2023Areas = {
    jambi: false,
    kalbar: false,
    kaltim: false,
    muba: false,
    oki: false,
    riau: false
};

// =================================================================
// KONFIGURASI DAN DATA
// =================================================================
const staticAdminShpUrl = 'data/admin/UMH.zip';
const staticLCZipUrls = {
    year1_LC: 'data/LC/LC-Riau-18.geojson'
};
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZnVhZGFndXNzYWxpbSIsImEiOiJjbGcyZ2Q1ZXMwMHZ2M2RuMW9uOHZ0cDNoIn0.odEIHnmRUwKd2wUq_nBowQ';

const mapboxStyles = {
    year1: 'mapbox://styles/mapbox/streets-v12',
};

const lc2018AreaFiles = {
    jambi: 'data/LC/2018/Jambi/Jambi-LC-18.geojson',
    kalbar: 'data/LC/2018/Kalbar/Kalbar-LC-18.geojson',
    kaltim: 'data/LC/2018/Kaltim/Kaltim-LC-18.geojson',
    muba: 'data/LC/2018/Muba/Muba-LC-18.geojson',
    oki: 'data/LC/2018/Oki/Oki-LC-18.geojson',
    riau: 'data/LC/2018/Riau/riau18_simp.geojson'
};

const lc2019AreaFiles = {
    jambi: 'data/LC/2019/Jambi/Jambi-LC-19.geojson',
    kalbar: 'data/LC/2019/Kalbar/Kalbar-LC-19.geojson',
    kaltim: 'data/LC/2019/Kaltim/Kaltim-LC-19.geojson',
    muba: 'data/LC/2019/Muba/Muba-LC-19.geojson',
    oki: 'data/LC/2019/Oki/Oki-LC-19.geojson',
    riau: 'data/LC/2019/Riau/riau19_simp.geojson'
};

const lc2021AreaFiles = {
    jambi: 'data/LC/2021/jambi21.geojson',
    kalbar: 'data/LC/2021/kalbar21_simp.geojson',
    kaltim: 'data/LC/2021/kaltim21.geojson',
    muba: 'data/LC/2021/muba21.geojson',
    oki: 'data/LC/2021/oki21_simp.geojson',
    riau: 'data/LC/2021/riau21_simp.geojson'
};

const lc2023AreaFiles = {
    jambi: 'data/LC/2023/jambi23.geojson',
    kalbar: 'data/LC/2023/kalbar23.geojson',
    kaltim: 'data/LC/2023/kaltim23.geojson',
    muba: 'data/LC/2023/muba23.geojson',
    oki: 'data/LC/2023/oki23.geojson',
    riau: 'data/LC/2023/riau23_simp.geojson'
};
const LCYearLabels = {
    year1_LC: 'Land Cover 2018',
    year2_LC: 'LC 2019',
    year3_LC: 'LC 2021',
    year4_LC: 'LC 2023'
};

const LCColors = {
    year1_LC: '#ff6b6b',
    year2_LC: '#4ecdc4',
    year3_LC: '#45b7d1',
    year4_LC: '#96ceb4'
};


// Untuk menyimpan layer LC 2018 per area
let lc2018Layers = {};
let lc2019Layers = {};
let lc2021Layers = {};
let lc2023Layers = {};

// =================================================================
// INISIALISASI PETA UTAMA
// =================================================================
function initMap() {
    if (map) return;
    
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    map = new mapboxgl.Map({
        container: 'mapContainer',
        style: mapboxStyles.year1,
        center: [108, 0],
        zoom: 5
    });

    // Tambahkan kontrol navigasi
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Tambahkan kontrol fullscreen
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Load data batas administrasi saat peta selesai dimuat
    map.on('load', () => {
        loadStaticAdminBoundary();
        updateLCLayers();
    });
}

// =================================================================
// FUNGSI BATAS ADMINISTRASI
// =================================================================
async function loadStaticAdminBoundary() {
    const loadingMessage = document.getElementById('loadingMessageAdmin');
    if (loadingMessage) loadingMessage.style.display = 'block';

    try {
        const response = await fetch(staticAdminShpUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        const geojson = await shp(buffer);

        // Hapus layer lama jika ada
        if (map && currentShapefileLayer) {
            map.removeLayer('admin-boundary-layer');
            map.removeSource('admin-boundary-source');
        }

        // Tambahkan source dan layer baru
        map.addSource('admin-boundary-source', {
            type: 'geojson',
            data: geojson
        });

        map.addLayer({
            id: 'admin-boundary-layer',
            type: 'line',
            source: 'admin-boundary-source',
            paint: {
                'line-color': '#1B3C53',
                'line-width': 1,
                'line-opacity': 1
            }
        });

        // Tambahkan popup untuk batas administrasi
        map.on('click', 'admin-boundary-layer', (e) => {
            const properties = e.features[0].properties;
            let popupContent = "<strong>Batas Administrasi:</strong><ul>";
            for (let key in properties) {
                popupContent += `<li><strong>${key}:</strong> ${properties[key]}</li>`;
            }
            popupContent += "</ul>";

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .addTo(map);
        });

        // Change cursor on hover
        map.on('mouseenter', 'admin-boundary-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'admin-boundary-layer', () => {
            map.getCanvas().style.cursor = '';
        });

        isAdminBoundaryLoaded = true;

    } catch (err) {
        console.error("Gagal memproses data batas administrasi:", err);
        alert("Gagal memuat data batas administrasi. Pastikan file tersedia di: " + staticAdminShpUrl);
    } finally {
        if (loadingMessage) loadingMessage.style.display = 'none';
    }
}

// =================================================================
// FUNGSI LC DATA DARI ZIP/GeoJSON
// =================================================================
async function loadLCData(yearKey) {
    const dataUrl = staticLCZipUrls[yearKey];
    if (!map || !dataUrl) return;

    // Tampilkan loading indicator
    const loadingMessage = document.getElementById('loadingMessageLC');
    if (loadingMessage) {
        loadingMessage.style.display = 'block';
        loadingMessage.textContent = `Memuat data LC ${LCYearLabels[yearKey]}...`;
    }

    try {
        let geojsonData;
        if (dataUrl.endsWith('.geojson')) {
            // Ambil dan parse GeoJSON
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            geojsonData = await response.json();
        } else if (dataUrl.endsWith('.zip')) {
            // Ambil dan parse ZIP (shapefile)
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const buffer = await response.arrayBuffer();
            if (loadingMessage) {
                loadingMessage.textContent = `Memproses shapefile ${LCYearLabels[yearKey]}...`;
            }
            geojsonData = await shp(buffer);
        } else {
            throw new Error('Format file LC tidak didukung. Harus .geojson atau .zip');
        }
        // Simpan data untuk digunakan di legenda
        currentLCLayers[yearKey] = geojsonData;
        addLCLayerToMap(yearKey, geojsonData);
        updateLCLegend();
    } catch (error) {
        console.error(`Error loading LC data for ${yearKey}:`, error);
        alert(`Gagal memuat data LC ${LCYearLabels[yearKey]}! Error: ${error.message}`);
    } finally {
        // Sembunyikan loading indicator
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    }
}

function addLCLayerToMap(yearKey, geojsonData) {
    const sourceId = `LC-source-${yearKey}`;
    const layerId = `LC-layer-${yearKey}`;

    // Hapus layer dan source yang ada jika ada
    if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }

    // Tambahkan source dan layer baru
    map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData
    });

    map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: getLCColorPaint(geojsonData, yearKey)
    });

    // Tambahkan popup untuk menampilkan informasi
    map.on('click', layerId, (e) => {
        const properties = e.features[0].properties;
        let popupContent = `<strong>${LCYearLabels[yearKey]}:</strong><br>`;
        
        // Cek apakah ini data land cover dengan gridcode
        if (properties.hasOwnProperty('gridcode')) {
            const landCoverTypes = {
                0: 'HTI',
                1: 'Lahan Terbuka', 
                2: 'Belukar Muda',
                3: 'Belukar Tua',
                4: 'Hutan Kerapatan',
                5: 'Tubuh Air'
            };
            
            const gridcode = properties.gridcode;
            const landCoverName = landCoverTypes[gridcode] || 'Tidak Diketahui';
            
            popupContent += `<strong>Gridcode:</strong> ${gridcode}<br>`;
            popupContent += `<strong>Land Cover:</strong> ${landCoverName}<br>`;
        } else {
            // Cari field yang berkaitan dengan LC
            for (let key in properties) {
                if (key.toLowerCase().includes('LC') || 
                    key.toLowerCase().includes('co2') || 
                    key.toLowerCase().includes('carbon')) {
                    popupContent += `<strong>${key}:</strong> ${properties[key]}<br>`;
                }
            }
        }
        
        // Tambahkan beberapa properti lainnya
        popupContent += '<hr><strong>Properti Lainnya:</strong><br>';
        let count = 0;
        for (let key in properties) {
            if (count < 5 && key !== 'gridcode') {
                popupContent += `${key}: ${properties[key]}<br>`;
                count++;
            }
        }

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change cursor on hover
    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
    });
}

function getLCColorPaint(geojsonData, yearKey) {
    // Cari field yang berkaitan dengan LC atau land cover
    let LCField = null;
    let isLandCover = false;
    const firstFeature = geojsonData.features && geojsonData.features[0];
    
    if (firstFeature && firstFeature.properties) {
        const props = firstFeature.properties;
        
        // Cek apakah ini data land cover dengan gridcode
        if (props.hasOwnProperty('gridcode')) {
            isLandCover = true;
            LCField = 'gridcode';
        } else {
            // Cari field LC dengan berbagai nama yang mungkin
            const possibleFields = ['LC'];
            for (let field of possibleFields) {
                if (props.hasOwnProperty(field)) {
                    LCField = field;
                    break;
                }
            }
            
            // Jika tidak ditemukan, gunakan field numerik pertama
            if (!LCField) {
                for (let key in props) {
                    if (typeof props[key] === 'number') {
                        LCField = key;
                        break;
                    }
                }
            }
        }
    }

    // visualisasi 
    if (isLandCover && LCField === 'gridcode') {
        return {
            'fill-color': [
                'match', ['get', 'gridcode'],
                0, '#aaff00',  // HTI
                1, '#ffff00',  // Lahan Terbuka 
                2, '#a900e6',  // Belukar Muda 
                3, '#e600a9',  // Belukar Tua 
                4, '#267300',  // Hutan Kerapatan 
                5, '#97dbf2',  // Tubuh Air 
                '#CCCCCC'     // Default color
            ],
            'fill-opacity': 0.8,
        };
    }
    // Jika ditemukan field LC, gunakan color scheme yang sesuai
    else if (LCField && !isLandCover) {
        return {
            'fill-color': [
                'interpolate', ['linear'], ['get', LCField],
                0, '#ffffcc',
                50, '#fecc5c',
                100, '#fd8d3c',
                200, '#f03b20',
                400, '#bd0026'
            ],
            'fill-opacity': 0.7,
        };
    } else {
        // Fallback: gunakan warna solid berdasarkan tahun
        return {
            'fill-color': LCColors[yearKey] || '#ff6b6b',
            'fill-opacity': 0.6,
            'fill-outline-color': '#444'
        };
    }
}

// =================================================================
// FUNGSI CHECKLIST LC
// =================================================================
function toggleLCLayer(yearKey, checkbox) {
    const layerId = `LC-layer-${yearKey}`;
    const sourceId = `LC-source-${yearKey}`;
    
    if (checkbox.checked) {
        // Tampilkan layer
        if (!map.getSource(sourceId)) {
            // Load data jika belum ada
            loadLCData(yearKey);
        } else {
            // Tampilkan layer yang sudah ada
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
        // selectedLCYears[yearKey] = true;
    } else {
        // Sembunyikan layer
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        // selectedLCYears[yearKey] = false;
    }
    
    updateLCLegend();
}

function updateLCLayers() {
    // Update visibility semua layer berdasarkan checkbox
    Object.keys(selectedLCYears).forEach(yearKey => {
        const layerId = `LC-layer-${yearKey}`;
        if (map.getLayer(layerId)) {
            const visibility = selectedLCYears[yearKey] ? 'visible' : 'none';
            map.setLayoutProperty(layerId, 'visibility', visibility);
        }
    });
}

// =================================================================
// FUNGSI LEGENDA
// =================================================================
function updateLCLegend() {
    const legend = document.getElementById('LCLegendItems');
    if (!legend) return;
  
    // Tampilkan legenda statis untuk Land Cover
    const landCoverTypes = [
      { code: 0, name: 'HTI', color: '#aaff00' },
      { code: 1, name: 'Lahan Terbuka', color: '#ffff00' },
      { code: 2, name: 'Belukar Muda', color: '#a900e6' },
      { code: 3, name: 'Belukar Tua', color:  '#e600a9'},
      { code: 4, name: 'Hutan Kerapatan', color: '#267300'},
      { code: 5, name: 'Tubuh Air', color: '#97dbf2'}
    ];
  
    let legendHTML = `
      <div style="margin-bottom: 12px; font-weight: bold; font-size: 16px;">Land Cover</div>
      <div class="legend-landcover-list">
    `;
  
    landCoverTypes.forEach(type => {
      legendHTML += `
        <div class="legend-landcover-item">
          <span class="legend-landcover-color" style="background:${type.color};"></span>
          <span class="legend-landcover-label">${type.name}</span>
        </div>
      `;
    });
  
    legendHTML += `</div>`;
  
    legend.innerHTML = legendHTML;
  }
  

// =================================================================
// FUNGSI PEMBANTU
// =================================================================
function destroyMap() {
    if (map) {
        map.remove();
        map = null;
    }
    currentLCLayers = {};
    isAdminBoundaryLoaded = false;
    currentShapefileLayer = null;
}

// =================================================================
// EVENT LISTENERS
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN.includes('GANTI')) {
        alert("PENTING: Harap masukkan Mapbox Access Token Anda di dalam file maps.js!");
    }
    // Inisialisasi peta
    initMap();

    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const arrow = btn.querySelector('.dropdown-arrow');
          arrow.classList.toggle('rotate');
        });
      });
    
    // Setup event listeners untuk checklist LC tahun
    Object.keys(LCYearLabels).forEach(yearKey => {
        const checkbox = document.getElementById(`checkbox-${yearKey}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                toggleLCLayer(yearKey, e.target);
            });
        }
    });
    // Setup event listeners untuk checklist LC 2018 per area
    Object.keys(selectedLC2018Areas).forEach(areaKey => {
        const checkbox = document.getElementById(`checkbox-lc2018-${areaKey}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                toggleLC2018Area(areaKey, e.target.checked);
            });

            //auto close dropdown
            const dropdown = checkbox.closest('dropdown-landcover-2018-list');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
    // Setup event listeners untuk checklist LC 2019 per area
    Object.keys(selectedLC2019Areas).forEach(areaKey => {
        const checkbox = document.getElementById(`checkbox-lc2019-${areaKey}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                toggleLC2019Area(areaKey, e.target.checked);
            });
            //auto close dropdown
            const dropdown = checkbox.closest('.dropdown-list');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
    // Setup event listeners untuk checklist LC 2021 per area
    Object.keys(selectedLC2021Areas).forEach(areaKey => {
        const checkbox = document.getElementById(`checkbox-lc2021-${areaKey}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                toggleLC2021Area(areaKey, e.target.checked);
            });
            //auto close dropdown
            const dropdown = checkbox.closest('.dropdown-list');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
    // Setup event listeners untuk checklist LC 2023 per area
    Object.keys(selectedLC2023Areas).forEach(areaKey => {
        const checkbox = document.getElementById(`checkbox-lc2023-${areaKey}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                toggleLC2023Area(areaKey, e.target.checked);
            });
            //auto close dropdown
            const dropdown = checkbox.closest('.dropdown-list');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
});

async function toggleLC2018Area(areaKey, checked) {
    const layerId = `lc2018-layer-${areaKey}`;
    const sourceId = `lc2018-source-${areaKey}`;
    if (checked) {
        // Load dan tampilkan layer jika belum ada
        if (!map.getSource(sourceId)) {
            const url = lc2018AreaFiles[areaKey];
            try {
                const loadingMessage = document.getElementById('loadingMessageLC');
                if (loadingMessage) {
                    loadingMessage.style.display = 'block';
                    loadingMessage.textContent = `Memuat data Land Cover 2018: ${areaKey}...`;
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error('Gagal fetch geojson');
                const geojson = await response.json();
                map.addSource(sourceId, { type: 'geojson', data: geojson });
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: sourceId,
                    paint: getLCColorPaint(geojson, 'year1_LC')
                });
                lc2018Layers[areaKey] = { sourceId, layerId };
                if (loadingMessage) loadingMessage.style.display = 'none';
            } catch (e) {
                alert('Gagal memuat data Land Cover 2018: ' + areaKey);
            }
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
        selectedLC2018Areas[areaKey] = true;
    } else {
        // Sembunyikan layer
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        selectedLC2018Areas[areaKey] = false;
    }

    // Set time out agar auto close
    setTimeout(() => {
        const dropdown = document.getElementById('dropdown-landcover-2018-list');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }, 100); // 100ms biasanya cukup

    updateLCLegend();
}

async function toggleLC2019Area(areaKey, checked) {
    const layerId = `lc2019-layer-${areaKey}`;
    const sourceId = `lc2019-source-${areaKey}`;
    if (checked) {
        if (!map.getSource(sourceId)) {
            const url = lc2019AreaFiles[areaKey];
            try {
                const loadingMessage = document.getElementById('loadingMessageLC');
                if (loadingMessage) {
                    loadingMessage.style.display = 'block';
                    loadingMessage.textContent = `Memuat data Land Cover 2019: ${areaKey}...`;
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error('Gagal fetch geojson');
                const geojson = await response.json();
                map.addSource(sourceId, { type: 'geojson', data: geojson });
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: sourceId,
                    paint: getLCColorPaint(geojson, 'year1_LC')
                });
                lc2019Layers[areaKey] = { sourceId, layerId };
                if (loadingMessage) loadingMessage.style.display = 'none';
            } catch (e) {
                alert('Gagal memuat data Land Cover 2019: ' + areaKey);
            }
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
        selectedLC2019Areas[areaKey] = true;
    } else {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        selectedLC2019Areas[areaKey] = false;
    }
    
    // Set time out agar auto close
    setTimeout(() => {
        const dropdown = document.getElementById('dropdown-landcover-2019-list');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }, 100); // 100ms biasanya cukup

    updateLCLegend();
}
async function toggleLC2021Area(areaKey, checked) {
    const layerId = `lc2021-layer-${areaKey}`;
    const sourceId = `lc2021-source-${areaKey}`;
    if (checked) {
        if (!map.getSource(sourceId)) {
            const url = lc2021AreaFiles[areaKey];
            try {
                const loadingMessage = document.getElementById('loadingMessageLC');
                if (loadingMessage) {
                    loadingMessage.style.display = 'block';
                    loadingMessage.textContent = `Memuat data Land Cover 2021: ${areaKey}...`;
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error('Gagal fetch geojson');
                const geojson = await response.json();
                map.addSource(sourceId, { type: 'geojson', data: geojson });
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: sourceId,
                    paint: getLCColorPaint(geojson, 'year1_LC')
                });
                lc2019Layers[areaKey] = { sourceId, layerId };
                if (loadingMessage) loadingMessage.style.display = 'none';
            } catch (e) {
                alert('Gagal memuat data Land Cover 2021: ' + areaKey);
            }
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
        selectedLC2021Areas[areaKey] = true;
    } else {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        selectedLC2019Areas[areaKey] = false;
    }
    
    // Set time out agar auto close
    setTimeout(() => {
        const dropdown = document.getElementById('dropdown-landcover-2021-list');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }, 100); // 100ms biasanya cukup

    updateLCLegend();
}

async function toggleLC2023Area(areaKey, checked) {
    const layerId = `lc2023-layer-${areaKey}`;
    const sourceId = `lc2023-source-${areaKey}`;
    if (checked) {
        if (!map.getSource(sourceId)) {
            const url = lc2023AreaFiles[areaKey];
            try {
                const loadingMessage = document.getElementById('loadingMessageLC');
                if (loadingMessage) {
                    loadingMessage.style.display = 'block';
                    loadingMessage.textContent = `Memuat data Land Cover 2023: ${areaKey}...`;
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error('Gagal fetch geojson');
                const geojson = await response.json();
                map.addSource(sourceId, { type: 'geojson', data: geojson });
                map.addLayer({
                    id: layerId,
                    type: 'fill',
                    source: sourceId,
                    paint: getLCColorPaint(geojson, 'year1_LC')
                });
                lc2019Layers[areaKey] = { sourceId, layerId };
                if (loadingMessage) loadingMessage.style.display = 'none';
            } catch (e) {
                alert('Gagal memuat data Land Cover 2023: ' + areaKey);
            }
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
        selectedLC2021Areas[areaKey] = true;
    } else {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
        selectedLC2019Areas[areaKey] = false;
    }
    
    // Set time out agar auto close
    setTimeout(() => {
        const dropdown = document.getElementById('dropdown-landcover-2023-list');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }, 100); // 100ms biasanya cukup

    updateLCLegend();
}

